/**
 * english-skill-evaluator — Bộ đánh giá Năng lực và Thẻ kỹ năng Tiếng Anh (English Skill Assessment & Cards Evaluator).
 * Pure Domain Logic 100%: Không truy cập DOM, không side-effect, không phụ thuộc window.app, Swal, Audio, Confetti.
 * 
 * Public Contract:
 * - isSkillCardUnlocked(cardId: string, state?: Object, skillCardsList?: Array<Object>): boolean
 * - getUnlockedSkillCardsCount(state?: Object, skillCardsList?: Array<Object>): number
 * - checkSkillScore(state: Object, skillKey: string, minScore: number): boolean
 * - checkPerfectScore(state: Object): boolean
 * - calculateEnglishSkillScores(engState?: Object): Record<string, number>
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.EnglishSkillEvaluator = api;
    root.isSkillCardUnlocked = api.isSkillCardUnlocked;
    root.getUnlockedSkillCardsCount = api.getUnlockedSkillCardsCount;
    root.checkSkillScore = api.checkSkillScore;
    root.checkPerfectScore = api.checkPerfectScore;
    root.calculateEnglishSkillScores = api.calculateEnglishSkillScores;
    if (typeof window !== 'undefined') {
        window.EnglishSkillEvaluator = api;
        window.isSkillCardUnlocked = api.isSkillCardUnlocked;
        window.getUnlockedSkillCardsCount = api.getUnlockedSkillCardsCount;
        window.checkSkillScore = api.checkSkillScore;
        window.checkPerfectScore = api.checkPerfectScore;
        window.calculateEnglishSkillScores = api.calculateEnglishSkillScores;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.EnglishSkillEvaluator = api;
        globalThis.isSkillCardUnlocked = api.isSkillCardUnlocked;
        globalThis.getUnlockedSkillCardsCount = api.getUnlockedSkillCardsCount;
        globalThis.checkSkillScore = api.checkSkillScore;
        globalThis.checkPerfectScore = api.checkPerfectScore;
        globalThis.calculateEnglishSkillScores = api.calculateEnglishSkillScores;
    }
    if (typeof self !== 'undefined') {
        self.EnglishSkillEvaluator = api;
        self.isSkillCardUnlocked = api.isSkillCardUnlocked;
        self.getUnlockedSkillCardsCount = api.getUnlockedSkillCardsCount;
        self.checkSkillScore = api.checkSkillScore;
        self.checkPerfectScore = api.checkPerfectScore;
        self.calculateEnglishSkillScores = api.calculateEnglishSkillScores;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var SKILL_CARDS_DATA = (typeof globalThis !== 'undefined' && globalThis.SKILL_CARDS)
        || (typeof window !== 'undefined' && window.SKILL_CARDS)
        || (typeof require !== 'undefined' ? require('./skill-cards-data').SKILL_CARDS : null);

    function checkSkillScore(state, skillKey, minScore) {
        const safeState = state || {};
        if (!safeState.scores || typeof safeState.scores !== 'object') return false;
        return Object.keys(safeState.scores).some(function(key) {
            return key.endsWith('-' + skillKey) && (safeState.scores[key] || 0) >= minScore;
        });
    }

    function checkPerfectScore(state) {
        const safeState = state || {};
        if (!safeState.scores || typeof safeState.scores !== 'object') return false;
        return Object.values(safeState.scores).some(function(score) {
            return score === 100;
        });
    }

    function isSkillCardUnlocked(cardId, state, customSkillCards) {
        const safeState = state || {};
        const skillCards = Array.isArray(customSkillCards) ? customSkillCards : (SKILL_CARDS_DATA || []);
        
        function checkClassSkillScore(classLevel, skillKey, minScore) {
            if (!safeState.scores || typeof safeState.scores !== 'object') return false;
            const prefix = 'eng' + classLevel + '-';
            return Object.keys(safeState.scores).some(function(key) {
                return key.startsWith(prefix) && 
                    key.endsWith('-' + skillKey) && 
                    (safeState.scores[key] || 0) >= minScore;
            });
        }

        function countClassPassedLessons(classLevel, minScore) {
            if (!safeState.scores || typeof safeState.scores !== 'object') return 0;
            const prefix = 'eng' + classLevel + '-';
            const lessonIds = new Set();
            Object.keys(safeState.scores).forEach(function(key) {
                if (key.startsWith(prefix) && (safeState.scores[key] || 0) >= minScore) {
                    const parts = key.split('-');
                    if (parts.length >= 3) {
                        const part = parts[0] + '-' + parts[1] + '-' + parts[2];
                        lessonIds.add(part);
                    }
                }
            });
            return lessonIds.size;
        }

        function checkDoublePerfect() {
            if (!safeState.scores || typeof safeState.scores !== 'object') return false;
            const prefixes = new Set(Object.keys(safeState.scores).map(function(k) { return k.substring(0, k.lastIndexOf('-')); }));
            return Array.from(prefixes).some(function(pref) {
                return safeState.scores[pref + '-listening'] === 100 && safeState.scores[pref + '-speaking'] === 100;
            });
        }

        function checkAllRounder() {
            if (!safeState.scores || typeof safeState.scores !== 'object') return false;
            const prefixes = new Set(Object.keys(safeState.scores).map(function(k) { return k.substring(0, k.lastIndexOf('-')); }));
            return Array.from(prefixes).some(function(pref) {
                return (safeState.scores[pref + '-listening'] || 0) >= 90 && 
                    (safeState.scores[pref + '-speaking'] || 0) >= 90 && 
                    (safeState.scores[pref + '-reading'] || 0) >= 90 && 
                    ((safeState.scores[pref + '-writing'] || 0) >= 90 || 
                     (safeState.scores[pref + '-spelling'] || 0) >= 90 || 
                     (safeState.scores[pref + '-writing_champion'] || 0) >= 90);
            });
        }

        switch(cardId) {
            case 'listening_master':
                return checkSkillScore(safeState, 'listening', 90);
            case 'speaking_pro':
                return checkSkillScore(safeState, 'speaking', 90);
            case 'reading_wizard':
                return checkSkillScore(safeState, 'reading', 90);
            case 'writing_champion':
                return checkSkillScore(safeState, 'spelling', 90) || checkSkillScore(safeState, 'writing', 90);
            case 'streak_legend':
                return (safeState.englishStreak || safeState.streak || 0) >= 5;
            case 'streak_hero':
                return (safeState.englishStreak || safeState.streak || 0) >= 10;
            case 'xp_conqueror':
                return (safeState.englishXp || 0) >= 1000;
            case 'perfect_score':
                return checkPerfectScore(safeState);
            case 'theory_explorer':
                return (safeState.completedLessonTheory || []).length >= 3;
            case 'gold_collector':
                return (safeState.goldSkills || []).length >= 3;
            case 'subtopic_expert':
                return (safeState.completedSubtopics || []).length >= 5;
            case 'speed_runner':
                if (!safeState.examSessions || !Array.isArray(safeState.examSessions)) return false;
                return safeState.examSessions.some(function(session) {
                    return session.score === 100 && (session.duration || 0) > 0 && (session.duration || 0) <= 60;
                });
            case 'monster_slayer':
                return (safeState.slainMonstersCount || 0) >= 3;
            case 'vocab_slayer':
                return (safeState.slainMonstersCount || 0) >= 10;
                
            // Lop 1
            case 'listening_rookie_1':
                return checkClassSkillScore('1', 'listening', 80);
            case 'speaking_rookie_1':
                return checkClassSkillScore('1', 'speaking', 80);
            case 'reading_rookie_1':
                return checkClassSkillScore('1', 'reading', 80);
            case 'writing_rookie_1':
                return checkClassSkillScore('1', 'spelling', 80) || checkClassSkillScore('1', 'writing', 80);
            case 'vocabulary_explorer_1':
                return (safeState.slainMonstersCount || 0) >= 2;
            case 'perfect_star_1':
                if (!safeState.scores || typeof safeState.scores !== 'object') return false;
                return Object.keys(safeState.scores).some(function(key) {
                    return key.startsWith('eng1-') && safeState.scores[key] === 100;
                });
            case 'bilingual_kid':
                return countClassPassedLessons('1', 90) >= 5;
            case 'class1_master':
                return countClassPassedLessons('1', 90) >= 10;
                
            // Lop 4
            case 'listening_apprentice_4':
                return checkClassSkillScore('4', 'listening', 85);
            case 'speaking_apprentice_4':
                return checkClassSkillScore('4', 'speaking', 85);
            case 'reading_apprentice_4':
                return checkClassSkillScore('4', 'reading', 85);
            case 'writing_apprentice_4':
                return checkClassSkillScore('4', 'spelling', 85) || checkClassSkillScore('4', 'writing', 85);
            case 'vocabulary_explorer_4':
                return (safeState.slainMonstersCount || 0) >= 5;
            case 'grammar_rookie':
                if (!safeState.scores || typeof safeState.scores !== 'object') return false;
                return Object.keys(safeState.scores).filter(function(key) {
                    return key.includes('grammar') && (safeState.scores[key] || 0) >= 80;
                }).length >= 3;
            case 'global_citizen_junior':
                return countClassPassedLessons('4', 90) >= 10;
            case 'class4_master':
                return countClassPassedLessons('4', 90) >= 15;
                
            // Lop 6
            case 'listening_expert_6':
                return checkClassSkillScore('6', 'listening', 90);
            case 'speaking_expert_6':
                return checkClassSkillScore('6', 'speaking', 90);
            case 'reading_expert_6':
                return checkClassSkillScore('6', 'reading', 90);
            case 'writing_expert_6':
                return checkClassSkillScore('6', 'spelling', 90) || checkClassSkillScore('6', 'writing', 90);
            case 'vocabulary_explorer_6':
                return (safeState.slainMonstersCount || 0) >= 8;
            case 'grammar_expert':
                if (!safeState.scores || typeof safeState.scores !== 'object') return false;
                return Object.keys(safeState.scores).filter(function(key) {
                    return key.includes('grammar') && (safeState.scores[key] || 0) >= 90;
                }).length >= 5;
            case 'global_citizen_senior':
                return countClassPassedLessons('6', 90) >= 15;
            case 'class6_master':
                return countClassPassedLessons('6', 90) >= 18;
                
            // Cot moc
            case 'streak_bronze':
                return (safeState.englishStreak || 0) >= 3;
            case 'streak_gold':
                return (safeState.englishStreak || 0) >= 20;
            case 'xp_novice':
                return (safeState.englishXp || 0) >= 100;
            case 'xp_apprentice':
                return (safeState.englishXp || 0) >= 500;
            case 'xp_master':
                return (safeState.englishXp || 0) >= 2000;
            case 'xp_legend':
                return (safeState.englishXp || 0) >= 5000;
            case 'theory_scholar':
                return (safeState.completedLessonTheory || []).length >= 8;
            case 'vocabulary_monarch':
                return (safeState.slainMonstersCount || 0) >= 20;
            case 'speedy_writer':
                if (!safeState.examSessions || !Array.isArray(safeState.examSessions)) return false;
                return safeState.examSessions.some(function(session) {
                    return (session.skill === 'spelling' || session.skill === 'writing') && 
                        session.score === 100 && (session.duration || 0) > 0 && (session.duration || 0) <= 40;
                });
            case 'double_perfect':
                return checkDoublePerfect();
            case 'all_rounder':
                return checkAllRounder();
            case 'unlocked_all_english':
                return skillCards.every(function(c) {
                    return c.id === 'unlocked_all_english' || isSkillCardUnlocked(c.id, safeState, skillCards);
                });
                
            default:
                return false;
        }
    }

    function getUnlockedSkillCardsCount(state, customSkillCards) {
        const safeState = state || {};
        const skillCards = Array.isArray(customSkillCards) ? customSkillCards : (SKILL_CARDS_DATA || []);
        let count = 0;
        skillCards.forEach(function(card) {
            if (card.id !== 'unlocked_all_english' && isSkillCardUnlocked(card.id, safeState, skillCards)) {
                count++;
            }
        });
        return count;
    }

    function calculateEnglishSkillScores(engState) {
        const stateToUse = (engState && engState.subjects && engState.subjects.english ? engState.subjects.english : engState) || {};
        const sessions = Array.isArray(stateToUse.examSessions) ? stateToUse.examSessions : [];
        const scores = { listening: 70, speaking: 70, reading: 70, writing: 70, vocabulary: 70, grammar: 70 };
        
        if (sessions.length === 0) {
            return scores;
        }

        const counts = { listening: 0, speaking: 0, reading: 0, writing: 0, vocabulary: 0, grammar: 0 };
        const totals = { listening: 0, speaking: 0, reading: 0, writing: 0, vocabulary: 0, grammar: 0 };

        sessions.forEach(function(sess) {
            if (sess && sess.answers && Array.isArray(sess.answers)) {
                sess.answers.forEach(function(ans) {
                    let category = ans.category || (sess.skill === 'listening' ? 'listening' : sess.skill === 'speaking' ? 'speaking' : sess.skill === 'reading' ? 'reading' : 'writing');
                    if (category === 'spelling') category = 'vocabulary';
                    
                    if (counts[category] !== undefined) {
                        counts[category]++;
                        if (ans.correct) {
                            totals[category]++;
                        }
                    }
                });
            }
        });

        for (const key in scores) {
            if (counts[key] > 0) {
                scores[key] = Math.round((totals[key] / counts[key]) * 100);
            }
        }
        return scores;
    }

    return {
        isSkillCardUnlocked: isSkillCardUnlocked,
        getUnlockedSkillCardsCount: getUnlockedSkillCardsCount,
        checkSkillScore: checkSkillScore,
        checkPerfectScore: checkPerfectScore,
        calculateEnglishSkillScores: calculateEnglishSkillScores
    };
});