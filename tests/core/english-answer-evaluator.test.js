/**
 * Characterization and Unit Tests for EnglishAnswerEvaluator (js/core/english-answer-evaluator.js)
 * 
 * Invariants tested:
 * 1. Module contract and API existence (UMD export).
 * 2. Dictation evaluation (single string vs correctAnswers array).
 * 3. Speaking evaluation (threshold 60%, accuracy recording).
 * 4. Reading Cloze evaluation (ordered array comparison, token normalization).
 * 5. Writing Unscramble evaluation (spelling letters vs sentence words).
 * 6. Free Writing / Rewrite & Smart Grammar Assistant heuristics.
 * 7. Multiple Choice evaluation (index vs string match, listening passage text).
 * 8. Central dispatcher evaluateEnglishAnswer.
 */

const EnglishAnswerEvaluator = require('../../js/core/english-answer-evaluator');
const {
    evaluateEnglishAnswer,
    diagnoseGrammarError,
    evaluateDictation,
    evaluateSpeaking,
    evaluateCloze,
    evaluateUnscramble,
    evaluateWriting,
    evaluateChoice
} = EnglishAnswerEvaluator;

describe('EnglishAnswerEvaluator (js/core/english-answer-evaluator.js)', () => {

    describe('1. Module Contract & API Existence', () => {
        test('Exports all expected pure functions', () => {
            expect(EnglishAnswerEvaluator).toBeDefined();
            expect(typeof evaluateEnglishAnswer).toBe('function');
            expect(typeof diagnoseGrammarError).toBe('function');
            expect(typeof evaluateDictation).toBe('function');
            expect(typeof evaluateSpeaking).toBe('function');
            expect(typeof evaluateCloze).toBe('function');
            expect(typeof evaluateUnscramble).toBe('function');
            expect(typeof evaluateWriting).toBe('function');
            expect(typeof evaluateChoice).toBe('function');
        });
    });

    describe('2. Dictation (Listening Dictation)', () => {
        test('Evaluates single string correctAnswer correctly with punctuation normalization', () => {
            const q = { type: 'listening', correctAnswer: 'beautiful morning.' };
            const res1 = evaluateDictation(q, 'beautiful morning');
            expect(res1.isCorrect).toBe(true);
            expect(res1.studentAnsStr).toBe('beautiful morning');
            expect(res1.explanation).toContain('beautiful morning.');

            const res2 = evaluateDictation(q, 'ugly morning');
            expect(res2.isCorrect).toBe(false);
        });

        test('Evaluates correctAnswers array allowing multiple accepted variations', () => {
            const q = {
                type: 'listening',
                correctAnswers: ['an apple', 'one apple']
            };
            expect(evaluateDictation(q, 'An Apple').isCorrect).toBe(true);
            expect(evaluateDictation(q, 'one apple!').isCorrect).toBe(true);
            expect(evaluateDictation(q, 'two apples').isCorrect).toBe(false);
        });
    });

    describe('3. Speaking (Speaking / Roleplay)', () => {
        test('Correct when accuracy >= 60% and studentAnswer.correct is true', () => {
            const q = { type: 'speaking' };
            const studentAns = { correct: true, accuracy: 85, spokenText: 'Hello world' };
            const res = evaluateSpeaking(q, studentAns);
            expect(res.isCorrect).toBe(true);
            expect(res.studentAnsStr).toBe('Hello world');
            expect(res.explanation).toContain('85%');
        });

        test('Incorrect when accuracy < 60% or missing answer', () => {
            const q = { type: 'speaking' };
            const studentAns = { correct: false, accuracy: 45, spokenText: 'Hela word' };
            const res = evaluateSpeaking(q, studentAns);
            expect(res.isCorrect).toBe(false);

            const missingRes = evaluateSpeaking(q, null);
            expect(missingRes.isCorrect).toBe(false);
        });
    });

    describe('4. Reading Cloze', () => {
        test('Correct when all blanks match in order', () => {
            const q = {
                type: 'reading_cloze',
                correctAnswers: ['in', 'the', 'morning'],
                correctAnswer: 'in - the - morning'
            };
            const res = evaluateCloze(q, ['in', 'the', 'morning']);
            expect(res.isCorrect).toBe(true);
            expect(res.studentAnsStr).toBe('in, the, morning');
        });

        test('Incorrect when any blank fails or word count mismatches', () => {
            const q = {
                type: 'reading_cloze',
                correctAnswers: ['in', 'the', 'morning']
            };
            expect(evaluateCloze(q, ['at', 'the', 'morning']).isCorrect).toBe(false);
            expect(evaluateCloze(q, ['in', 'the']).isCorrect).toBe(false);
        });
    });

    describe('5. Writing Unscramble', () => {
        test('Spelling unscramble (letters to word without space)', () => {
            const q = {
                type: 'writing',
                scrambledLetters: true,
                correctAnswer: 'school'
            };
            const resCorrect = evaluateUnscramble(q, ['s', 'c', 'h', 'o', 'o', 'l']);
            expect(resCorrect.isCorrect).toBe(true);
            expect(resCorrect.studentAnsStr).toBe('school');

            const resWrong = evaluateUnscramble(q, ['s', 'c', 'o', 'h', 'o', 'l']);
            expect(resWrong.isCorrect).toBe(false);
        });

        test('Sentence unscramble (words to sentence with spaces)', () => {
            const q = {
                type: 'writing_unscramble',
                correctAnswer: 'She is a student.'
            };
            const resCorrect = evaluateUnscramble(q, ['She', 'is', 'a', 'student']);
            expect(resCorrect.isCorrect).toBe(true);
            expect(resCorrect.studentAnsStr).toBe('She is a student');

            const resWrong = evaluateUnscramble(q, ['She', 'a', 'is', 'student']);
            expect(resWrong.isCorrect).toBe(false);
        });
    });

    describe('6. Free Writing & Smart Grammar Assistant', () => {
        test('Diagnoses missing s/es on third-person singular or plural noun', () => {
            const diag = diagnoseGrammarError('play', 'plays');
            expect(diag).toContain('Thiếu đuôi s/es');
        });

        test('Diagnoses missing past tense ed', () => {
            const diag = diagnoseGrammarError('visit', 'visited');
            expect(diag).toContain('Thiếu đuôi ed');
        });

        test('Diagnoses minor typo within 2 characters', () => {
            const diag = diagnoseGrammarError('beutiful', 'beautiful');
            expect(diag).toContain('sai chính tả một vài ký tự');
        });

        test('Diagnoses extra characters or punctuation', () => {
            const diag = diagnoseGrammarError('I like apples and bananas!!', 'I like apples');
            expect(diag).toContain('Dấu câu hoặc ký tự thừa');
        });

        test('Evaluates writing with single or multiple accepted answers', () => {
            const q = {
                type: 'writing_completion',
                correctAnswer: 'plays'
            };
            const resCorrect = evaluateWriting(q, 'plays');
            expect(resCorrect.isCorrect).toBe(true);

            const resWrong = evaluateWriting(q, 'play');
            expect(resWrong.isCorrect).toBe(false);
            expect(resWrong.grammarAnalysis).toContain('Thiếu đuôi s/es');
        });
    });

    describe('7. Multiple Choice & Listening Passage', () => {
        test('Evaluates choice by index', () => {
            const q = {
                type: 'choice',
                options: ['Apple', 'Banana', 'Orange'],
                correctIndex: 1
            };
            expect(evaluateChoice(q, 1).isCorrect).toBe(true);
            expect(evaluateChoice(q, 0).isCorrect).toBe(false);
        });

        test('Evaluates choice by text match', () => {
            const q = {
                type: 'choice',
                options: ['A. Cat', 'B. Dog', 'C. Fish'],
                correctAnswer: 'Dog'
            };
            expect(evaluateChoice(q, 'Dog').isCorrect).toBe(true);
            expect(evaluateChoice(q, 'Cat').isCorrect).toBe(false);
        });

        test('Listening passage includes listening text in explanation', () => {
            const q = {
                type: 'listening_passage',
                listeningText: 'Tom went to the zoo yesterday.',
                options: ['Zoo', 'Park'],
                correctAnswer: 'Zoo'
            };
            const res = evaluateChoice(q, 'Zoo');
            expect(res.isCorrect).toBe(true);
            expect(res.explanation).toContain('Tom went to the zoo yesterday.');
        });
    });

    describe('8. Central Dispatcher evaluateEnglishAnswer', () => {
        test('Dispatches appropriately to correct sub-evaluator', () => {
            const qDictation = { type: 'listening', options: [], correctAnswer: 'sun' };
            expect(evaluateEnglishAnswer(qDictation, 'sun').isCorrect).toBe(true);

            const qChoice = { type: 'choice', options: ['A', 'B'], correctAnswer: 'B' };
            expect(evaluateEnglishAnswer(qChoice, 'B').isCorrect).toBe(true);

            const qNull = null;
            expect(evaluateEnglishAnswer(qNull, 'test').isCorrect).toBe(false);
        });
    });
});
