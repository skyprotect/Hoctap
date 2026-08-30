/**
 * PREGENERATION WORKER & CACHE
 * Nạp danh sách bài học, quản lý file cache đề thi pre-generated và thực hiện tiến trình sinh ngầm
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { ROOT_DIR } from './gemini-key-manager';
import { callGeminiAPI, addAiLog } from './gemini-client';
import { cleanJsonString } from './response-parser';
import { getMathPrompt } from './prompt-builder';
import { auditMathQuestions } from './ai-auditor';

export const EXAMS_DIR = path.join(ROOT_DIR, 'exams');
if (!fs.existsSync(EXAMS_DIR)) {
    fs.mkdirSync(EXAMS_DIR, { recursive: true });
}

export function getPregenFilePath(studentId: string, lessonId: string): string {
    const specificPath = path.join(EXAMS_DIR, `pregen-${studentId}-${lessonId}.json`);
    if (fs.existsSync(specificPath)) return specificPath;

    const genericPath = path.join(EXAMS_DIR, `pregen-${lessonId}.json`);
    if (fs.existsSync(genericPath)) return genericPath;

    const defaultPath = path.join(EXAMS_DIR, `pregen-default-${lessonId}.json`);
    if (fs.existsSync(defaultPath)) return defaultPath;

    if (studentId === 'std_baongoc' || studentId === 'default') {
        const oldBaoNgocPath = path.join(EXAMS_DIR, `pregen-std_xf9e2lvgv-${lessonId}.json`);
        if (fs.existsSync(oldBaoNgocPath)) return oldBaoNgocPath;
    }
    const bmPath = path.join(EXAMS_DIR, `pregen-std_htsj4gbmo-${lessonId}.json`);
    if (fs.existsSync(bmPath)) return bmPath;

    const dpPath = path.join(EXAMS_DIR, `pregen-std_tyc0gfnkz-${lessonId}.json`);
    if (fs.existsSync(dpPath)) return dpPath;

    return specificPath;
}

export interface LessonMeta {
    id: string;
    title: string;
    class: string;
    subject: string;
}

export let allLessons: LessonMeta[] = [];
try {
    const jsonPath = path.join(ROOT_DIR, 'data', 'curriculum', 'course_data.json');
    let courseData: any[] = [];
    if (fs.existsSync(jsonPath)) {
        courseData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } else {
        const lessonsFilePath = path.join(ROOT_DIR, 'js', 'lessons.js');
        const lessons = require(lessonsFilePath);
        courseData = lessons.COURSE_DATA || [];
    }
    
    courseData.forEach(chapter => {
        if (chapter.lessons && Array.isArray(chapter.lessons)) {
            chapter.lessons.forEach((lesson: any) => {
                allLessons.push({
                    id: lesson.id,
                    title: lesson.title,
                    class: chapter.class || '6',
                    subject: chapter.subject || 'math'
                });
            });
        }
    });
} catch (e) {
    console.error('Lỗi khi nạp danh sách bài học:', e);
}

export const studentAiStatusMap: Record<string, any> = {};
let preGenQueue: any[] = [];
let isPreGenRunning = false;

export function loadPregenStatusForStudent(studentId: string): any {
    const filePath = path.join(EXAMS_DIR, `pregen_status_${studentId}.json`);
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {
        console.error(`Không thể đọc file trạng thái sinh đề cho học sinh ${studentId}:`, e);
    }
    return null;
}

export function savePregenStatusForStudent(studentId: string, statusData: any): void {
    const filePath = path.join(EXAMS_DIR, `pregen_status_${studentId}.json`);
    try {
        const tempPath = filePath + '.tmp';
        fs.writeFileSync(tempPath, JSON.stringify(statusData, null, 2), 'utf8');
        fs.renameSync(tempPath, filePath);
    } catch (e) {
        console.error(`Không thể ghi file trạng thái sinh đề cho học sinh ${studentId}:`, e);
    }
}

export async function startPreGenerationWorkerForStudent(studentId: string, classLevel?: string): Promise<void> {
    const studentLessons = allLessons.filter(lesson => lesson.class === (classLevel || '6'));
    
    let statusData = loadPregenStatusForStudent(studentId);
    if (!statusData) {
        statusData = { completed: [], failed: {} };
        for (const lesson of studentLessons) {
            const cachePath = getPregenFilePath(studentId, lesson.id);
            if (fs.existsSync(cachePath)) {
                statusData.completed.push(lesson.id);
            }
        }
        savePregenStatusForStudent(studentId, statusData);
    }

    const pendingLessons = [];
    for (const lesson of studentLessons) {
        if (!statusData.completed.includes(lesson.id)) {
            pendingLessons.push(lesson);
        }
    }

    let completedCount = studentLessons.length - pendingLessons.length;

    if (!studentAiStatusMap[studentId]) {
        studentAiStatusMap[studentId] = {
            errors: [],
            retryCount: 0,
            pausedUntil: null
        };
    }
    
    studentAiStatusMap[studentId].totalExams = studentLessons.length;
    studentAiStatusMap[studentId].completedExams = completedCount;

    preGenQueue = preGenQueue.filter(task => task.studentId !== studentId);
    const newTasks = pendingLessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        class: lesson.class,
        studentId: studentId
    }));
    preGenQueue = [...newTasks, ...preGenQueue];

    addAiLog(`[Worker] Kích hoạt sinh đề cho HS: ${studentId} (Lớp ${classLevel}). Tổng: ${studentLessons.length} bài, đã xong: ${completedCount} bài, cần sinh thêm: ${pendingLessons.length} bài.`);

    if (isPreGenRunning) return;
    isPreGenRunning = true;

    (async () => {
        while (preGenQueue.length > 0) {
            const task = preGenQueue[0];
            const taskStudentId = task.studentId;

            try {
                addAiLog(`[Worker] Sinh đề bài "${task.title}" (${task.id}) cho HS ${taskStudentId} - Lớp ${task.class || '6'}`);
                const prompt = getMathPrompt(task.title, task.id, task.class || '6');
                const data = await callGeminiAPI({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json' }
                }, `Sinh đề ngầm: ${task.title}`);

                const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!textResponse) throw new Error('Không nhận được nội dung từ Gemini.');

                let examData = JSON.parse(cleanJsonString(textResponse));
                examData = await auditMathQuestions(examData, task.class || '6');
                if (Array.isArray(examData)) examData = { questions: examData };

                const cachePath = path.join(EXAMS_DIR, `pregen-${taskStudentId}-${task.id}.json`);
                const tempPath = cachePath + '.tmp';
                fs.writeFileSync(tempPath, JSON.stringify(examData, null, 2), 'utf8');
                fs.renameSync(tempPath, cachePath);

                preGenQueue.shift();
                if (studentAiStatusMap[taskStudentId]) {
                    studentAiStatusMap[taskStudentId].completedExams++;
                }

                let stStatus = loadPregenStatusForStudent(taskStudentId) || { completed: [], failed: {} };
                stStatus.completed.push(task.id);
                savePregenStatusForStudent(taskStudentId, stStatus);
            } catch (err: any) {
                addAiLog(`[Worker] Lỗi sinh đề bài "${task.title}": ${err.message}`);
                preGenQueue.shift();
            }

            if (preGenQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 8000));
            }
        }
        isPreGenRunning = false;
    })();
}
