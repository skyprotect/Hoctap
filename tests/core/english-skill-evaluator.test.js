/**
 * Unit Tests for EnglishSkillEvaluator (js/core/english-skill-evaluator.js)
 * 
 * Pure Function & Decision Invariants:
 * 1. Skill Cards Eligibility (isSkillCardUnlocked, checkSkillScore, checkPerfectScore, getUnlockedSkillCardsCount)
 * 2. Skill Scores Aggregation (calculateEnglishSkillScores)
 * 3. Edge Cases: Empty states, null/undefined, missing examSessions, threshold boundaries, rounding.
 */

const EnglishSkillEvaluator = require('../../js/core/english-skill-evaluator');
const {
    isSkillCardUnlocked,
    getUnlockedSkillCardsCount,
    checkSkillScore,
    checkPerfectScore,
    calculateEnglishSkillScores
} = require('../../js/core/english-skill-evaluator');
const { SKILL_CARDS } = require('../../js/core/skill-cards-data');

describe('EnglishSkillEvaluator (js/core/english-skill-evaluator.js)', () => {

    describe('1. Module Contract & API Existence', () => {
        test('Module exports all expected pure evaluation methods', () => {
            expect(EnglishSkillEvaluator).toBeDefined();
            expect(typeof EnglishSkillEvaluator.isSkillCardUnlocked).toBe('function');
            expect(typeof EnglishSkillEvaluator.getUnlockedSkillCardsCount).toBe('function');
            expect(typeof EnglishSkillEvaluator.checkSkillScore).toBe('function');
            expect(typeof EnglishSkillEvaluator.checkPerfectScore).toBe('function');
            expect(typeof EnglishSkillEvaluator.calculateEnglishSkillScores).toBe('function');
        });
    });

    describe('2. checkSkillScore & checkPerfectScore Helpers', () => {
        test('checkSkillScore returns false when state or scores are missing', () => {
            expect(checkSkillScore(null, 'listening', 90)).toBe(false);
            expect(checkSkillScore({}, 'listening', 90)).toBe(false);
            expect(checkSkillScore({ scores: null }, 'listening', 90)).toBe(false);
        });

        test('checkSkillScore correctly detects scores at or above threshold', () => {
            const state = { scores: { 'eng1-t1-listening': 90, 'eng1-t2-listening': 85 } };
            expect(checkSkillScore(state, 'listening', 90)).toBe(true);
            expect(checkSkillScore(state, 'listening', 95)).toBe(false);
            expect(checkSkillScore(state, 'speaking', 80)).toBe(false);
        });

        test('checkPerfectScore returns true only when at least one score is exactly 100', () => {
            expect(checkPerfectScore(null)).toBe(false);
            expect(checkPerfectScore({ scores: { 'eng1-t1': 99 } })).toBe(false);
            expect(checkPerfectScore({ scores: { 'eng1-t1': 100 } })).toBe(true);
            expect(checkPerfectScore({ scores: { 'eng1-t1': 80, 'eng4-t2': 100 } })).toBe(true);
        });
    });

    describe('3. isSkillCardUnlocked - General & Skill Mastery Cards', () => {
        test('listening_master, speaking_pro, reading_wizard, writing_champion', () => {
            const state = {
                scores: {
                    'eng1-t1-listening': 90,
                    'eng1-t1-speaking': 90,
                    'eng1-t1-reading': 89,
                    'eng1-t1-writing': 95
                }
            };
            expect(isSkillCardUnlocked('listening_master', state, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('speaking_pro', state, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('reading_wizard', state, SKILL_CARDS)).toBe(false);
            expect(isSkillCardUnlocked('writing_champion', state, SKILL_CARDS)).toBe(true);
        });

        test('streak and xp milestone cards', () => {
            expect(isSkillCardUnlocked('streak_legend', { englishStreak: 5 }, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('streak_legend', { streak: 5 }, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('streak_legend', { englishStreak: 4 }, SKILL_CARDS)).toBe(false);

            expect(isSkillCardUnlocked('streak_hero', { englishStreak: 10 }, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('streak_hero', { englishStreak: 9 }, SKILL_CARDS)).toBe(false);

            expect(isSkillCardUnlocked('xp_conqueror', { englishXp: 1000 }, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('xp_conqueror', { englishXp: 999 }, SKILL_CARDS)).toBe(false);
        });

        test('speed_runner card requires score 100 in duration <= 60s', () => {
            expect(isSkillCardUnlocked('speed_runner', { examSessions: [{ score: 100, duration: 45 }] }, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('speed_runner', { examSessions: [{ score: 100, duration: 61 }] }, SKILL_CARDS)).toBe(false);
            expect(isSkillCardUnlocked('speed_runner', { examSessions: [{ score: 90, duration: 30 }] }, SKILL_CARDS)).toBe(false);
            expect(isSkillCardUnlocked('speed_runner', {}, SKILL_CARDS)).toBe(false);
        });

        test('monster_slayer and vocab_slayer cards', () => {
            expect(isSkillCardUnlocked('monster_slayer', { slainMonstersCount: 3 }, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('monster_slayer', { slainMonstersCount: 2 }, SKILL_CARDS)).toBe(false);
            expect(isSkillCardUnlocked('vocab_slayer', { slainMonstersCount: 10 }, SKILL_CARDS)).toBe(true);
        });

        test('theory_explorer, gold_collector, subtopic_expert cards', () => {
            expect(isSkillCardUnlocked('theory_explorer', { completedLessonTheory: ['1', '2', '3'] }, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('theory_explorer', { completedLessonTheory: ['1', '2'] }, SKILL_CARDS)).toBe(false);
            expect(isSkillCardUnlocked('gold_collector', { goldSkills: ['a', 'b', 'c'] }, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('subtopic_expert', { completedSubtopics: [1,2,3,4,5] }, SKILL_CARDS)).toBe(true);
        });
    });

    describe('4. isSkillCardUnlocked - Grade-specific & Complex Conditions', () => {
        test('Grade 1 skill cards (listening_rookie_1, bilingual_kid, class1_master)', () => {
            const state = {
                scores: {
                    'eng1-t1-listening': 80,
                    'eng1-t1-speaking': 85,
                    'eng1-t2-listening': 90,
                    'eng1-t3-listening': 95,
                    'eng1-t4-listening': 92,
                    'eng1-t5-listening': 90,
                    'eng1-t6-listening': 90
                }
            };
            expect(isSkillCardUnlocked('listening_rookie_1', state, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('bilingual_kid', state, SKILL_CARDS)).toBe(true); // 5 lessons with score >= 90
            expect(isSkillCardUnlocked('class1_master', state, SKILL_CARDS)).toBe(false); // only 5 passed, need 10
        });

        test('Grade 4 and Grade 6 grammar cards', () => {
            const state = {
                scores: {
                    'eng4-t1-grammar': 85,
                    'eng4-t2-grammar': 80,
                    'eng4-t3-grammar': 90
                }
            };
            expect(isSkillCardUnlocked('grammar_rookie', state, SKILL_CARDS)).toBe(true); // 3 grammar scores >= 80
            expect(isSkillCardUnlocked('grammar_expert', state, SKILL_CARDS)).toBe(false); // need 5 grammar scores >= 90
        });

        test('double_perfect card requires listening and speaking = 100 on same lesson prefix', () => {
            const stateSuccess = {
                scores: {
                    'eng6-t1-listening': 100,
                    'eng6-t1-speaking': 100
                }
            };
            const stateFail = {
                scores: {
                    'eng6-t1-listening': 100,
                    'eng6-t2-speaking': 100
                }
            };
            expect(isSkillCardUnlocked('double_perfect', stateSuccess, SKILL_CARDS)).toBe(true);
            expect(isSkillCardUnlocked('double_perfect', stateFail, SKILL_CARDS)).toBe(false);
        });

        test('all_rounder card requires all 4 skills >= 90 on same lesson prefix', () => {
            const state = {
                scores: {
                    'eng1-t1-listening': 90,
                    'eng1-t1-speaking': 95,
                    'eng1-t1-reading': 92,
                    'eng1-t1-writing': 90
                }
            };
            expect(isSkillCardUnlocked('all_rounder', state, SKILL_CARDS)).toBe(true);
        });

        test('Invalid cardId returns false', () => {
            expect(isSkillCardUnlocked('non_existent_card', { englishXp: 99999 }, SKILL_CARDS)).toBe(false);
        });
    });

    describe('5. getUnlockedSkillCardsCount', () => {
        test('Counts all unlocked cards except unlocked_all_english', () => {
            const state = {
                englishStreak: 10,
                englishXp: 5000,
                slainMonstersCount: 20
            };
            const count = getUnlockedSkillCardsCount(state, SKILL_CARDS);
            expect(count).toBeGreaterThan(0);
        });

        test('Returns 0 for empty state', () => {
            expect(getUnlockedSkillCardsCount({}, SKILL_CARDS)).toBe(0);
        });
    });

    describe('6. calculateEnglishSkillScores (Aggregation & Metrics)', () => {
        test('Returns baseline 70 for empty state or zero sessions', () => {
            const baseline = { listening: 70, speaking: 70, reading: 70, writing: 70, vocabulary: 70, grammar: 70 };
            expect(calculateEnglishSkillScores(null)).toEqual(baseline);
            expect(calculateEnglishSkillScores({})).toEqual(baseline);
            expect(calculateEnglishSkillScores({ examSessions: [] })).toEqual(baseline);
        });

        test('Handles subject nested state (state.subjects.english)', () => {
            const nested = {
                subjects: {
                    english: {
                        examSessions: [
                            {
                                answers: [
                                    { category: 'listening', correct: true },
                                    { category: 'listening', correct: true }
                                ]
                            }
                        ]
                    }
                }
            };
            const scores = calculateEnglishSkillScores(nested);
            expect(scores.listening).toBe(100);
            expect(scores.reading).toBe(70); // unchanged baseline
        });

        test('Correctly aggregates multi-session mixed answers and calculates percentage', () => {
            const state = {
                examSessions: [
                    {
                        answers: [
                            { category: 'reading', correct: true },
                            { category: 'reading', correct: false },
                            { category: 'reading', correct: true },
                            { category: 'grammar', correct: true }
                        ]
                    },
                    {
                        skill: 'speaking',
                        answers: [
                            { correct: true },
                            { correct: true },
                            { correct: true },
                            { correct: false }
                        ]
                    }
                ]
            };
            const scores = calculateEnglishSkillScores(state);
            expect(scores.reading).toBe(67); // 2/3 = 66.67% -> 67%
            expect(scores.grammar).toBe(100); // 1/1 = 100%
            expect(scores.speaking).toBe(75); // 3/4 = 75%
            expect(scores.listening).toBe(70); // baseline
        });

        test('Maps spelling category to vocabulary', () => {
            const state = {
                examSessions: [
                    {
                        answers: [
                            { category: 'spelling', correct: true },
                            { category: 'spelling', correct: true },
                            { category: 'vocabulary', correct: false }
                        ]
                    }
                ]
            };
            const scores = calculateEnglishSkillScores(state);
            expect(scores.vocabulary).toBe(67); // 2/3 = 66.67% -> 67%
        });
    });
});