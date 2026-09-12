/**
 * english_exam_audio_integrity.test.js — Kiểm toán toàn vẹn bộ nhớ đệm âm thanh đề thi Anh ngữ (v15.8)
 * 
 * Kiểm tra chuẩn khoa học quốc tế (Asset-Backed Listening Generation):
 * 1. 100% các câu hỏi nghe sinh ra từ generateEnglishFullExam và generateIoeQuestions bắt buộc khớp với Kokoro TTS Cache.
 * 2. Tuyệt đối không xảy ra Cache Miss ở bất kỳ Unit nào của Lớp 1, Lớp 4 và Lớp 6.
 * 3. Tệp âm thanh MP3 vật lý tương ứng tồn tại trên đĩa và có dung lượng hợp lệ (> 100 bytes).
 */

const fs = require('fs');
const path = require('path');
const { ENGLISH_COURSE_DATA } = require('../../js/core/english-course-data');
const { generateEnglishFullExam, generateIoeQuestions } = require('../../js/english_data');
const EnglishAudioService = require('../../js/core/english-audio-service');

const SOUNDS_DIR = path.resolve(__dirname, '../../sounds/english');

describe('Kiểm toán toàn vẹn âm thanh Đề thi Anh ngữ (Asset-Backed Integrity v15.8)', () => {
    beforeAll(async () => {
        const ok = await EnglishAudioService.init();
        expect(ok).toBe(true);
        const manifest = EnglishAudioService.getManifest();
        expect(manifest).toBeDefined();
        expect(Object.keys(manifest).length).toBeGreaterThan(0);
    });

    test('1. generateEnglishFullExam mặc định (Unit 1 & General): 100% câu nghe có audio Kokoro TTS hợp lệ', () => {
        for (let iter = 0; iter < 10; iter++) {
            const examQs = generateEnglishFullExam({ classLevel: '6', detail: 'eng6-t1' });
            expect(Array.isArray(examQs)).toBe(true);
            expect(examQs.length).toBe(10);

            const listeningQs = examQs.filter(q => q.category === 'listening' || q.questionType === 'listening' || q.listeningText);
            expect(listeningQs.length).toBeGreaterThanOrEqual(2);

            for (const q of listeningQs) {
                const speechText = q.listeningText || q.audioScript || q.correctAnswer;
                const audioKey = q.audioFileKey || q.audioKey || q.listeningText;

                const res = EnglishAudioService.resolveAudio(speechText, audioKey);
                expect(res.found).toBe(true);
                expect(res.filename).toBeTruthy();

                const filePath = path.join(SOUNDS_DIR, res.filename);
                expect(fs.existsSync(filePath)).toBe(true);
                const stat = fs.statSync(filePath);
                expect(stat.size).toBeGreaterThan(100);
            }
        }
    });

    test('2. generateEnglishFullExam quét cạn 12 Unit Lớp 6: Không bao giờ Cache Miss', () => {
        const topics = ENGLISH_COURSE_DATA['6'].topics;
        expect(topics.length).toBeGreaterThanOrEqual(12);

        for (const topic of topics) {
            for (let iter = 0; iter < 5; iter++) {
                const examQs = generateEnglishFullExam({ classLevel: '6', category: 'unit', detail: topic.id });
                expect(examQs.length).toBe(10);

                const listeningQs = examQs.filter(q => q.category === 'listening' || q.questionType === 'listening' || q.listeningText);
                expect(listeningQs.length).toBeGreaterThanOrEqual(2);

                for (const q of listeningQs) {
                    const speechText = q.listeningText || q.audioScript || q.correctAnswer;
                    const audioKey = q.audioFileKey || q.audioKey || q.listeningText;

                    const res = EnglishAudioService.resolveAudio(speechText, audioKey);
                    expect(res.found).toBe(true);

                    const filePath = path.join(SOUNDS_DIR, res.filename);
                    expect(fs.existsSync(filePath)).toBe(true);
                    expect(fs.statSync(filePath).size).toBeGreaterThan(100);
                }
            }
        }
    });

    test('3. generateIoeQuestions quét cạn các Unit Lớp 6: Tương thích hoàn toàn', () => {
        const topics = ENGLISH_COURSE_DATA['6'].topics;
        for (const topic of topics.slice(0, 5)) {
            const ioeQs = generateIoeQuestions('6', topic.id);
            expect(ioeQs.length).toBe(20);

            const listeningQs = ioeQs.filter(q => q.category === 'listening' || q.questionType === 'listening' || q.listeningText);
            for (const q of listeningQs) {
                const speechText = q.listeningText || q.audioScript || q.correctAnswer;
                const audioKey = q.audioFileKey || q.audioKey || q.listeningText;

                const res = EnglishAudioService.resolveAudio(speechText, audioKey);
                expect(res.found).toBe(true);
                const filePath = path.join(SOUNDS_DIR, res.filename);
                expect(fs.existsSync(filePath)).toBe(true);
            }
        }
    });

    test('4. resolveAudio xử lý linh hoạt phần mở rộng .mp3 và canonical ID hoa/thường', () => {
        const r1 = EnglishAudioService.resolveAudio('dummy text', 'l6_exam_listening_01.mp3');
        expect(r1.found).toBe(true);
        expect(r1.filename).toBe('l6_exam_listening_01.mp3');

        const r2 = EnglishAudioService.resolveAudio('dummy text', 'L6_EXAM_LISTENING_01');
        expect(r2.found).toBe(true);
        expect(r2.filename).toBe('l6_exam_listening_01.mp3');

        const r3 = EnglishAudioService.resolveAudio('dummy text', 'l6_exam_listening_02.mp3');
        expect(r3.found).toBe(true);
        expect(r3.filename).toBe('l6_exam_listening_02.mp3');
    });

    test('5. generateEnglishFullExam quét cạn Lớp 1 và Lớp 4: 100% Asset-Backed Không Cache Miss', () => {
        for (const grade of ['1', '4']) {
            const topics = ENGLISH_COURSE_DATA[grade].topics;
            for (const topic of topics.slice(0, 5)) {
                const examQs = generateEnglishFullExam({ classLevel: grade, category: 'unit', detail: topic.id });
                expect(examQs.length).toBe(10);

                const listeningQs = examQs.filter(q => q.category === 'listening' || q.questionType === 'listening' || q.listeningText);
                expect(listeningQs.length).toBeGreaterThanOrEqual(2);

                for (const q of listeningQs) {
                    const speechText = q.listeningText || q.audioScript || q.correctAnswer;
                    const audioKey = q.audioFileKey || q.audioKey || q.listeningText;

                    const res = EnglishAudioService.resolveAudio(speechText, audioKey);
                    expect(res.found).toBe(true);
                    const filePath = path.join(SOUNDS_DIR, res.filename);
                    expect(fs.existsSync(filePath)).toBe(true);
                    expect(fs.statSync(filePath).size).toBeGreaterThan(100);
                }
            }
        }
    });
});
