/**
 * CORE TYPES & INTERFACES
 * Định nghĩa các kiểu dữ liệu cốt lõi cho toàn bộ backend server
 */

export interface Student {
    id: string;
    name: string;
    classLevel: '1' | '4' | '6' | string;
    parentName?: string;
}

export interface SystemConfig {
    parentName?: string;
    parentPin?: string;
    studentName?: string;
    currentClass?: string;
    defaultStudentId?: string;
    students?: Student[];
}

export interface QuizQuestion {
    questionText: string;
    options: string[];
    correctIndex: number;
    userSelectedIndex?: number | null;
    isCorrect?: boolean;
    isShortAnswer?: boolean;
    userShortAnswer?: string;
    type?: string;
    isTemplate?: boolean;
    variables?: Record<string, any>;
    constraints?: string[];
    formulas?: Record<string, any>;
    hints?: string[];
    solutionHtml?: string;
    tip?: string;
    listeningText?: string;
    speakingPhrases?: string[];
    spellingWords?: string[];
    questionType?: string;
}

export interface ExamSession {
    lessonId: string;
    lessonTitle: string;
    scorePercent: number;
    score?: number;
    completedAt?: string;
    questions: QuizQuestion[];
    isAudited?: boolean;
}

export interface SubjectData {
    scores: Record<string, number>;
    completedSubtopics: string[];
    subtopicScores: Record<string, number>;
    completedLessonTheory: string[];
    examSessions: ExamSession[];
    skillScores?: {
        listening: number;
        speaking: number;
        reading: number;
        spelling: number;
    };
    weakVocabulary?: any[];
}

export interface StudentProgress {
    student: string | { id?: string; name?: string; classLevel?: string };
    classLevel: string;
    xp: number;
    englishXp?: number;
    _sharedXp?: number;
    streak: number;
    englishStreak?: number;
    lastActiveDate: string | null;
    scores: Record<string, number>;
    badges: string[];
    goldBadges?: string[];
    history?: any[];
    distractions?: number;
    customVideos?: Record<string, any>;
    parentPin?: string;
    cardExchangeHistory?: any[];
    examSessions?: ExamSession[];
    completedSubtopics?: string[];
    subtopicScores?: Record<string, number>;
    completedLessonTheory?: string[];
    subjects?: {
        math?: SubjectData;
        english?: SubjectData;
    };
    lastUpdated: string;
}

export interface LeaderboardItem {
    studentId: string;
    studentName: string;
    mathXp?: number;
    englishXp?: number;
    mathStreak?: number;
    englishStreak?: number;
    classLevel: string;
    lastActiveDate?: string;
    lastHeartbeat?: string;
    appVersion?: string;
    lastUpdated?: string;
}

export interface CustomVocabularyItem {
    id?: number;
    student_id: string;
    word: string;
    translation: string;
    phonetics?: string;
    type?: string;
    example_sentence?: string;
    example_translation?: string;
    topic_id?: string;
    status?: string;
    box_level?: number;
    last_reviewed?: string;
    next_review_due?: string;
    review_count?: number;
    created_at?: string;
}

export interface CustomTopicItem {
    id: string;
    student_id: string;
    title: string;
    created_at?: string;
}

export interface TabletTokenItem {
    token: string;
    student_id?: string;
    minutes: number;
    status: 'unused' | 'active' | 'used' | string;
    created_at: string;
    activated_at?: string;
    expires_at?: string;
}
