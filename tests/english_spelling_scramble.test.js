const {
    generateEnglishQuestions,
    scrambleWord,
    ENGLISH_COURSE_DATA
} = require('../js/english_data.js');

describe("English Spelling Scramble & Palindrome Characterization Suite", () => {

    // Helper kiểm tra multiset ký tự (bảo toàn 100% số lượng từng ký tự)
    function getLetterMultiset(str) {
        const cleaned = str.replace(/-/g, '').toLowerCase();
        const counts = {};
        for (const ch of cleaned) {
            counts[ch] = (counts[ch] || 0) + 1;
        }
        return counts;
    }

    describe("1. scrambleWord Unit Tests - Palindromes", () => {
        const palindromes = ["radar", "noon", "level", "eye", "racecar", "mom", "dad", "madam"];

        palindromes.forEach(word => {
            test(`Từ đối xứng '${word}' phải được xáo trộn khác từ gốc nhưng giữ nguyên multiset`, () => {
                const scrambleFn = scrambleWord;
                expect(typeof scrambleFn).toBe('function');
                const scrambled = scrambleFn(word);
                const originalJoined = word.split('').join('-');
                expect(scrambled).not.toBe(originalJoined);
                expect(getLetterMultiset(scrambled)).toEqual(getLetterMultiset(word));
            });
        });
    });

    describe("2. scrambleWord Unit Tests - Non-palindromes", () => {
        const words = ["apple", "teacher", "window", "school", "student", "football", "kitchen"];

        words.forEach(word => {
            test(`Từ '${word}' phải được xáo trộn khác từ gốc và bảo toàn multiset`, () => {
                const scrambleFn = scrambleWord;
                expect(typeof scrambleFn).toBe('function');
                const scrambled = scrambleFn(word);
                const originalJoined = word.split('').join('-');
                expect(scrambled).not.toBe(originalJoined);
                expect(getLetterMultiset(scrambled)).toEqual(getLetterMultiset(word));
            });
        });
    });

    describe("3. scrambleWord Unit Tests - Short Words & Edge Cases", () => {
        test("Từ 1 ký tự: 'a', 'i' giữ nguyên", () => {
            expect(typeof scrambleWord).toBe('function');
            expect(scrambleWord("a")).toBe("a");
            expect(scrambleWord("i")).toBe("i");
            expect(scrambleWord("")).toBe("");
        });

        test("Từ 2 ký tự khác nhau: 'to', 'in', 'on', 'go' đảo vị trí", () => {
            expect(typeof scrambleWord).toBe('function');
            expect(scrambleWord("to")).toBe("o-t");
            expect(scrambleWord("in")).toBe("n-i");
            expect(scrambleWord("on")).toBe("n-o");
            expect(scrambleWord("go")).toBe("o-g");
        });

        test("Từ gồm toàn ký tự giống nhau: 'aaa', 'zzzz' giữ nguyên", () => {
            expect(typeof scrambleWord).toBe('function');
            expect(scrambleWord("aaa")).toBe("a-a-a");
            expect(scrambleWord("zzzz")).toBe("z-z-z-z");
        });

        test("Từ có ký tự lặp: 'book', 'feel', 'letter', 'banana', 'committee'", () => {
            expect(typeof scrambleWord).toBe('function');
            const repeatedWords = ["book", "feel", "letter", "banana", "committee"];
            repeatedWords.forEach(word => {
                const scrambled = scrambleWord(word);
                const originalJoined = word.split('').join('-');
                expect(scrambled).not.toBe(originalJoined);
                expect(getLetterMultiset(scrambled)).toEqual(getLetterMultiset(word));
            });
        });
    });

    describe("4. Integration Tests - generateEnglishQuestions across Grades", () => {
        const grades = ["1", "4", "6"];
        grades.forEach(grade => {
            test(`Grade ${grade}: Câu hỏi dạng Writing / Spelling không để lộ đáp án`, () => {
                const classData = ENGLISH_COURSE_DATA[grade];
                if (!classData || !classData.topics || classData.topics.length === 0) return;
                const firstTopic = classData.topics[0];
                let spellingQuestions = [];
                for (let retry = 0; retry < 5; retry++) {
                    const questions = generateEnglishQuestions(grade, firstTopic.id, "writing");
                    spellingQuestions = questions.filter(q => q.type === "writing" && q.category === "vocabulary" && q.scrambledLetters);
                    if (spellingQuestions.length > 0) break;
                }
                
                expect(spellingQuestions.length).toBeGreaterThan(0);

                spellingQuestions.forEach(q => {
                    expect(q.correctAnswer).toBeDefined();
                    expect(q.scrambledLetters).toBeDefined();
                    expect(q.wordPool).toBeDefined();

                    const cleanCorrect = q.correctAnswer.toLowerCase();
                    const scrambledStr = q.scrambledLetters.toLowerCase();
                    const originalJoined = cleanCorrect.split('').join('-');

                    // Nếu từ có thể xáo trộn được (length >= 2 và có ít nhất 2 ký tự khác nhau)
                    const hasDifferentChars = cleanCorrect.length >= 2 && cleanCorrect.split('').some(c => c !== cleanCorrect[0]);
                    if (hasDifferentChars) {
                        expect(scrambledStr).not.toBe(originalJoined);
                    }

                    // Multiset chữ cái phải được bảo toàn 100%
                    expect(getLetterMultiset(scrambledStr)).toEqual(getLetterMultiset(cleanCorrect));
                    expect(getLetterMultiset(q.wordPool.join(''))).toEqual(getLetterMultiset(cleanCorrect));
                });
            });
        });

        test("Grade 6 Unit 1: 50 lượt sinh ngẫu nhiên liên tiếp không bao giờ lộ đáp án", () => {
            for (let iter = 0; iter < 50; iter++) {
                const questions = generateEnglishQuestions("6", "eng6-t1", "writing");
                const spellingQuestions = questions.filter(q => q.type === "writing" && q.category === "vocabulary" && q.scrambledLetters);
                
                spellingQuestions.forEach(q => {
                    const cleanCorrect = q.correctAnswer.toLowerCase();
                    const scrambledStr = q.scrambledLetters.toLowerCase();
                    const originalJoined = cleanCorrect.split('').join('-');

                    const hasDifferentChars = cleanCorrect.length >= 2 && cleanCorrect.split('').some(c => c !== cleanCorrect[0]);
                    if (hasDifferentChars) {
                        expect(scrambledStr).not.toBe(originalJoined);
                    }
                    expect(getLetterMultiset(scrambledStr)).toEqual(getLetterMultiset(cleanCorrect));
                });
            }
        });
    });
});
