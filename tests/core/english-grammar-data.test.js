/**
 * Unit & Characterization Tests for EnglishGrammarData (js/core/english-grammar-data.js)
 * 
 * Kiem tra tinh toan ven va bat bien du lieu:
 * 1. Data existence: 3 cau truc du lieu tinh ton tai, khong null/undefined.
 * 2. Cardinality: 18 topics (73 questions), Grade 6 Reading (35 questions), Grade 6 Writing (14 questions).
 * 3. Structural integrity: Moi cau hoi deu co questionText, type, correctAnswer, solutionHtml hop le.
 * 4. Content integrity: Doi chieu mau cau hoi, dap an, giai thich chi tiet.
 * 5. Integration: generateEnglishQuestions() nap va su dung chinh xac ngan hang ngu phap.
 * 6. Hash safety: Du lieu trich xuat trung khop 100% SHA256 characterization snapshot.
 */

const crypto = require('crypto');
const EnglishGrammarData = require('../../js/core/english-grammar-data');
const {
    ENGLISH_GRAMMAR_TOPIC_QUESTIONS,
    ENG6_T1_READING_GRAMMAR_QUESTIONS,
    ENG6_T1_WRITING_GRAMMAR_QUESTIONS
} = require('../../js/core/english-grammar-data');
const { generateEnglishQuestions } = require('../../js/english_data');

describe('EnglishGrammarData (js/core/english-grammar-data.js)', () => {

    describe('1. Module Contract & Data Existence', () => {
        test('EnglishGrammarData module is exported and is an object', () => {
            expect(EnglishGrammarData).toBeDefined();
            expect(typeof EnglishGrammarData).toBe('object');
        });

        test('All 3 data structures are exported directly and on EnglishGrammarData', () => {
            expect(Array.isArray(ENG6_T1_READING_GRAMMAR_QUESTIONS)).toBe(true);
            expect(Array.isArray(ENG6_T1_WRITING_GRAMMAR_QUESTIONS)).toBe(true);
            expect(typeof ENGLISH_GRAMMAR_TOPIC_QUESTIONS).toBe('object');
            expect(ENGLISH_GRAMMAR_TOPIC_QUESTIONS).not.toBeNull();

            expect(EnglishGrammarData.ENG6_T1_READING_GRAMMAR_QUESTIONS).toBe(ENG6_T1_READING_GRAMMAR_QUESTIONS);
            expect(EnglishGrammarData.ENG6_T1_WRITING_GRAMMAR_QUESTIONS).toBe(ENG6_T1_WRITING_GRAMMAR_QUESTIONS);
            expect(EnglishGrammarData.ENGLISH_GRAMMAR_TOPIC_QUESTIONS).toBe(ENGLISH_GRAMMAR_TOPIC_QUESTIONS);
        });

        test('Data structures are non-empty', () => {
            expect(ENG6_T1_READING_GRAMMAR_QUESTIONS.length).toBeGreaterThan(0);
            expect(ENG6_T1_WRITING_GRAMMAR_QUESTIONS.length).toBeGreaterThan(0);
            expect(Object.keys(ENGLISH_GRAMMAR_TOPIC_QUESTIONS).length).toBeGreaterThan(0);
        });
    });

    describe('2. Cardinality & Topic Keys', () => {
        test('Grade 6 Unit 1 Reading contains exactly 35 questions', () => {
            expect(ENG6_T1_READING_GRAMMAR_QUESTIONS.length).toBe(35);
        });

        test('Grade 6 Unit 1 Writing contains exactly 14 questions', () => {
            expect(ENG6_T1_WRITING_GRAMMAR_QUESTIONS.length).toBe(14);
        });

        test('ENGLISH_GRAMMAR_TOPIC_QUESTIONS contains exactly 18 grammar topics', () => {
            const expectedTopics = [
                'to_be', 'articles', 'demonstratives', 'plural_nouns',
                'possessive', 'modal_can', 'like_ving', 'present_continuous',
                'prepositions_place', 'present_simple_verbs', 'adverbs_frequency',
                'prepositions_time', 'should_shouldn\'t', 'past_simple',
                'comparatives', 'future_plans', 'must_mustn\'t', 'first_conditional'
            ];
            const actualTopics = Object.keys(ENGLISH_GRAMMAR_TOPIC_QUESTIONS);
            expect(actualTopics.sort()).toEqual(expectedTopics.sort());
            expect(actualTopics.length).toBe(18);
        });

        test('Total questions across all 18 topics is exactly 73', () => {
            let total = 0;
            for (const key of Object.keys(ENGLISH_GRAMMAR_TOPIC_QUESTIONS)) {
                total += ENGLISH_GRAMMAR_TOPIC_QUESTIONS[key].length;
            }
            expect(total).toBe(73);
        });

        test('Grand total across all 3 data banks is exactly 122 questions', () => {
            let topicTotal = 0;
            for (const key of Object.keys(ENGLISH_GRAMMAR_TOPIC_QUESTIONS)) {
                topicTotal += ENGLISH_GRAMMAR_TOPIC_QUESTIONS[key].length;
            }
            const grandTotal = ENG6_T1_READING_GRAMMAR_QUESTIONS.length +
                               ENG6_T1_WRITING_GRAMMAR_QUESTIONS.length +
                               topicTotal;
            expect(grandTotal).toBe(122);
        });
    });

    describe('3. Structural Integrity & Schema Conformance', () => {
        test('Every Reading question in Grade 6 Unit 1 adheres to schema', () => {
            ENG6_T1_READING_GRAMMAR_QUESTIONS.forEach((q) => {
                expect(typeof q.type).toBe('string');
                expect(typeof q.questionText).toBe('string');
                expect(q.questionText.length).toBeGreaterThan(0);
                expect(typeof q.correctAnswer).toBe('string');
                expect(q.correctAnswer.length).toBeGreaterThan(0);
                expect(typeof q.solutionHtml).toBe('string');
                expect(q.solutionHtml.length).toBeGreaterThan(0);

                if (q.type === 'choice') {
                    expect(Array.isArray(q.options)).toBe(true);
                    expect(q.options.length).toBeGreaterThanOrEqual(2);
                    expect(q.options).toContain(q.correctAnswer);
                }
            });
        });

        test('Every Writing question in Grade 6 Unit 1 adheres to schema', () => {
            ENG6_T1_WRITING_GRAMMAR_QUESTIONS.forEach((q) => {
                expect(typeof q.type).toBe('string');
                expect(typeof q.questionText).toBe('string');
                expect(q.questionText.length).toBeGreaterThan(0);
                expect(typeof q.correctAnswer).toBe('string');
                expect(q.correctAnswer.length).toBeGreaterThan(0);
                expect(typeof q.solutionHtml).toBe('string');
                expect(q.solutionHtml.length).toBeGreaterThan(0);

                if (q.type === 'writing') {
                    expect(Array.isArray(q.wordPool)).toBe(true);
                    expect(q.wordPool.length).toBeGreaterThanOrEqual(2);
                }
            });
        });

        test('Every Topic Grammar question across all 18 topics adheres to schema', () => {
            for (const [topic, questions] of Object.entries(ENGLISH_GRAMMAR_TOPIC_QUESTIONS)) {
                expect(Array.isArray(questions)).toBe(true);
                expect(questions.length).toBeGreaterThanOrEqual(4);

                questions.forEach((q) => {
                    expect(typeof q.type).toBe('string');
                    expect(typeof q.questionText).toBe('string');
                    expect(q.questionText.length).toBeGreaterThan(0);
                    expect(typeof q.correctAnswer).toBe('string');
                    expect(q.correctAnswer.length).toBeGreaterThan(0);
                    expect(typeof q.solutionHtml).toBe('string');
                    expect(q.solutionHtml.length).toBeGreaterThan(0);

                    if (q.type === 'choice') {
                        expect(Array.isArray(q.options)).toBe(true);
                        expect(q.options.length).toBeGreaterThanOrEqual(2);
                        expect(q.options).toContain(q.correctAnswer);
                    } else if (q.type === 'writing') {
                        expect(Array.isArray(q.wordPool)).toBe(true);
                        expect(q.wordPool.length).toBeGreaterThanOrEqual(2);
                    }
                });
            }
        });
    });

    describe('4. Content Verification & Representative Samples', () => {
        test('to_be topic contains expected questions and answers', () => {
            const toBe = ENGLISH_GRAMMAR_TOPIC_QUESTIONS['to_be'];
            expect(toBe[0].questionText).toContain('Hello! My name _________ Linh.');
            expect(toBe[0].correctAnswer).toBe('is');
            expect(toBe[1].correctAnswer).toBe('are');
        });

        test('articles topic contains a/an questions', () => {
            const articles = ENGLISH_GRAMMAR_TOPIC_QUESTIONS['articles'];
            expect(articles[0].correctAnswer).toBe('a');
            expect(articles[1].correctAnswer).toBe('an');
        });

        test('past_simple topic contains past tense questions', () => {
            const past = ENGLISH_GRAMMAR_TOPIC_QUESTIONS['past_simple'];
            expect(past.some(q => q.correctAnswer === 'were' || q.correctAnswer === 'did' || q.correctAnswer === 'bought')).toBe(true);
        });

        test('first_conditional topic contains if-clause questions', () => {
            const ifTopic = ENGLISH_GRAMMAR_TOPIC_QUESTIONS['first_conditional'];
            expect(ifTopic.some(q => q.questionText.includes('If') || q.questionText.includes('if'))).toBe(true);
        });
    });

    describe('5. Integration with generateEnglishQuestions', () => {
        test('Reading skill for Grade 6 Unit 1 injects grammar questions from extracted data', () => {
            const questions = generateEnglishQuestions('6', 'eng6-t1', 'reading');
            expect(Array.isArray(questions)).toBe(true);
            expect(questions.length).toBeGreaterThan(0);
            const grammarQuestions = questions.filter(q => q.category === 'grammar');
            expect(grammarQuestions.length).toBeGreaterThan(0);
            expect(grammarQuestions.every(q => q.type === 'choice')).toBe(true);
        });

        test('Writing skill for Grade 6 Unit 1 injects writing grammar questions from extracted data', () => {
            const questions = generateEnglishQuestions('6', 'eng6-t1', 'writing');
            expect(Array.isArray(questions)).toBe(true);
            expect(questions.length).toBeGreaterThan(0);
            const grammarQuestions = questions.filter(q => q.category === 'grammar');
            expect(grammarQuestions.length).toBeGreaterThan(0);
        });

        test('Reading skill for Grade 4 Unit 1 injects topic-based grammar questions', () => {
            const questions = generateEnglishQuestions('4', 'eng4-t1', 'reading');
            expect(Array.isArray(questions)).toBe(true);
            expect(questions.length).toBeGreaterThan(0);
            const grammarQuestions = questions.filter(q => q.category === 'grammar');
            expect(grammarQuestions.length).toBeGreaterThan(0);
        });

        test('Writing skill for Grade 1 Unit 1 injects topic-based writing grammar questions', () => {
            const questions = generateEnglishQuestions('1', 'eng1-t1', 'writing');
            expect(Array.isArray(questions)).toBe(true);
            expect(questions.length).toBeGreaterThan(0);
            const grammarQuestions = questions.filter(q => q.category === 'grammar');
            expect(grammarQuestions.length).toBeGreaterThan(0);
        });
    });

    describe('6. Characterization Hash Invariance (100% Match)', () => {
        test('Extracted data hash matches canonical baseline SHA256', () => {
            const hash = crypto.createHash('sha256').update(JSON.stringify({
                reading: ENG6_T1_READING_GRAMMAR_QUESTIONS,
                writing: ENG6_T1_WRITING_GRAMMAR_QUESTIONS,
                topics: ENGLISH_GRAMMAR_TOPIC_QUESTIONS
            })).digest('hex');

            const EXPECTED_HASH = '5f88ef122555dd54c8b47bf36b24213ee07331149f88382b6b794143b8da1200';
            expect(hash).toBe(EXPECTED_HASH);
        });
    });
});