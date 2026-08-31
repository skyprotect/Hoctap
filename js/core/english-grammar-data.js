/**
 * english-grammar-data — Ngân hàng câu hỏi ngữ pháp tiếng Anh tĩnh (Static English Grammar Questions).
 * Tách biệt hoàn toàn khỏi logic sinh đề trong js/english_data.js.
 * Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 * 
 * Public Contract:
 * - ENG6_T1_READING_GRAMMAR_QUESTIONS: Array<Object> (35 câu)
 * - ENG6_T1_WRITING_GRAMMAR_QUESTIONS: Array<Object> (14 câu)
 * - ENGLISH_GRAMMAR_TOPIC_QUESTIONS: Record<string, Array<Object>> (18 topics, 73 câu)
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.EnglishGrammarData = api;
    root.ENGLISH_GRAMMAR_TOPIC_QUESTIONS = api.ENGLISH_GRAMMAR_TOPIC_QUESTIONS;
    root.ENG6_T1_READING_GRAMMAR_QUESTIONS = api.ENG6_T1_READING_GRAMMAR_QUESTIONS;
    root.ENG6_T1_WRITING_GRAMMAR_QUESTIONS = api.ENG6_T1_WRITING_GRAMMAR_QUESTIONS;
    if (typeof window !== 'undefined') {
        window.EnglishGrammarData = api;
        window.ENGLISH_GRAMMAR_TOPIC_QUESTIONS = api.ENGLISH_GRAMMAR_TOPIC_QUESTIONS;
        window.ENG6_T1_READING_GRAMMAR_QUESTIONS = api.ENG6_T1_READING_GRAMMAR_QUESTIONS;
        window.ENG6_T1_WRITING_GRAMMAR_QUESTIONS = api.ENG6_T1_WRITING_GRAMMAR_QUESTIONS;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.EnglishGrammarData = api;
        globalThis.ENGLISH_GRAMMAR_TOPIC_QUESTIONS = api.ENGLISH_GRAMMAR_TOPIC_QUESTIONS;
        globalThis.ENG6_T1_READING_GRAMMAR_QUESTIONS = api.ENG6_T1_READING_GRAMMAR_QUESTIONS;
        globalThis.ENG6_T1_WRITING_GRAMMAR_QUESTIONS = api.ENG6_T1_WRITING_GRAMMAR_QUESTIONS;
    }
    if (typeof self !== 'undefined') {
        self.EnglishGrammarData = api;
        self.ENGLISH_GRAMMAR_TOPIC_QUESTIONS = api.ENGLISH_GRAMMAR_TOPIC_QUESTIONS;
        self.ENG6_T1_READING_GRAMMAR_QUESTIONS = api.ENG6_T1_READING_GRAMMAR_QUESTIONS;
        self.ENG6_T1_WRITING_GRAMMAR_QUESTIONS = api.ENG6_T1_WRITING_GRAMMAR_QUESTIONS;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

const ENG6_T1_READING_GRAMMAR_QUESTIONS = [
    {
        type: "choice",
        questionText: "My mother likes chocolate, but she _________ like biscuits. (Chọn trợ động từ phù hợp)",
        correctAnswer: "doesn't",
        options: ["doesn't", "don't", "does", "do"],
        solutionHtml: "Chủ ngữ là 'she' (ngôi thứ ba số ít) và câu mang nghĩa phủ định đối lập ('but she...'), do đó ta dùng trợ động từ <b>'doesn't'</b>."
    },
    {
        type: "choice",
        questionText: "_________ the children wear your uniform at your school? (Chọn trợ động từ phù hợp)",
        correctAnswer: "Do",
        options: ["Do", "Does", "Don't", "Doesn't"],
        solutionHtml: "Chủ ngữ là 'the children' (danh từ số nhiều), câu hỏi Yes/No ở thì hiện tại đơn cần dùng trợ động từ <b>'Do'</b> đứng đầu."
    },
    {
        type: "choice",
        questionText: "Lynn’s father watches badminton on TV, but he _________ watch judo. (Chọn trợ động từ phù hợp)",
        correctAnswer: "doesn't",
        options: ["doesn't", "don't", "does", "do"],
        solutionHtml: "Chủ ngữ là 'he' (ngôi thứ ba số ít), câu phủ định dùng <b>'doesn't'</b>."
    },
    {
        type: "choice",
        questionText: "Where _________ the Masons buy their fruits? (Chọn trợ động từ phù hợp)",
        correctAnswer: "do",
        options: ["do", "does", "don't", "doesn't"],
        solutionHtml: "Chủ ngữ là 'the Masons' (gia đình nhà Mason - số nhiều), câu hỏi dùng trợ động từ <b>'do'</b>."
    },
    {
        type: "choice",
        questionText: "_________ the cat like to sleep on the sofa? (Chọn trợ động từ phù hợp)",
        correctAnswer: "Does",
        options: ["Does", "Do", "Doesn't", "Don't"],
        solutionHtml: "Chủ ngữ là 'the cat' (số ít), câu hỏi Yes/No dùng trợ động từ <b>'Does'</b>."
    },
    {
        type: "choice",
        questionText: "Dogs love bones, but they _________ love cheese. (Chọn trợ động từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "do", "does"],
        solutionHtml: "Chủ ngữ là 'they' (số nhiều), câu phủ định dùng <b>'don't'</b>."
    },
    {
        type: "choice",
        questionText: "Where _________ Sam and Ben hide their pocket money? (Chọn trợ động từ phù hợp)",
        correctAnswer: "do",
        options: ["do", "does", "don't", "doesn't"],
        solutionHtml: "Sam and Ben là chủ ngữ số nhiều (2 người), câu hỏi Wh- dùng trợ động từ <b>'do'</b>."
    },
    {
        type: "choice",
        questionText: "We eat pizza, but we _________ eat hamburgers. (Chọn trợ động từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "do", "does"],
        solutionHtml: "Chủ ngữ là 'we' (số nhiều), câu phủ định dùng <b>'don't'</b>."
    },
    {
        type: "choice",
        questionText: "_________ Mrs. Miller read magazines? (Chọn trợ động từ phù hợp)",
        correctAnswer: "Does",
        options: ["Does", "Do", "Doesn't", "Don't"],
        solutionHtml: "Mrs. Miller là chủ ngữ số ít, câu hỏi Yes/No dùng trợ động từ <b>'Does'</b>."
    },
    {
        type: "choice",
        questionText: "_________ the boys play cricket outside? (Chọn trợ động từ phù hợp)",
        correctAnswer: "Do",
        options: ["Do", "Does", "Don't", "Doesn't"],
        solutionHtml: "Chủ ngữ là 'the boys' (số nhiều), câu hỏi dùng trợ động từ <b>'Do'</b>."
    },
    {
        type: "choice",
        questionText: "Please _________ play with my food. (Chọn từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "not", "no"],
        solutionHtml: "Cấu trúc câu mệnh lệnh phủ định (yêu cầu ai đó không làm gì): <b>'Please don't + V'</b>."
    },
    {
        type: "choice",
        questionText: "She _________ the cleaning three times a week. (Chọn dạng đúng của động từ do)",
        correctAnswer: "does",
        options: ["does", "do", "doing", "did"],
        solutionHtml: "Chủ ngữ là 'She' (số ít), động từ 'do' tận cùng là 'o' nên thêm 'es' thành <b>'does'</b>."
    },
    {
        type: "choice",
        questionText: "We _________ go out very much because we have a baby. (Chọn trợ động từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "not", "no"],
        solutionHtml: "Chủ ngữ là 'We' (số nhiều), câu phủ định dùng trợ động từ <b>'don't'</b>."
    },
    {
        type: "choice",
        questionText: "I _________ want to talk about my neighborhood any more. (Chọn trợ động từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "do", "does"],
        solutionHtml: "Chủ ngữ là 'I' dùng trợ động từ phủ định <b>'don't'</b>."
    },
    {
        type: "choice",
        questionText: "How much _________ it cost to phone overseas? (Chọn trợ động từ phù hợp)",
        correctAnswer: "does",
        options: ["does", "do", "don't", "doesn't"],
        solutionHtml: "Chủ ngữ là 'it' (ngôi thứ ba số ít), câu hỏi Wh- dùng trợ động từ <b>'does'</b>."
    },
    {
        type: "choice",
        questionText: "We sometimes _________ books. (Chọn dạng đúng của động từ)",
        correctAnswer: "read",
        options: ["read", "reads", "reading", "to read"],
        solutionHtml: "Chủ ngữ là 'We' (số nhiều), động từ ở thì hiện tại đơn giữ nguyên: <b>'read'</b>."
    },
    {
        type: "choice",
        questionText: "Emily _________ to the art club. (Chọn dạng đúng của động từ)",
        correctAnswer: "goes",
        options: ["goes", "go", "going", "went"],
        solutionHtml: "Emily là chủ ngữ số ít, động từ 'go' tận cùng là 'o' thêm 'es' thành <b>'goes'</b>."
    },
    {
        type: "choice",
        questionText: "It often _________ on Sundays. (Chọn dạng đúng của động từ)",
        correctAnswer: "rains",
        options: ["rains", "rain", "raining", "rained"],
        solutionHtml: "Chủ ngữ 'It' số ít, động từ 'rain' thêm 's' thành <b>'rains'</b>."
    },
    {
        type: "choice",
        questionText: "Pete and his sister _________ the family car. (Chọn dạng đúng của động từ)",
        correctAnswer: "wash",
        options: ["wash", "washes", "washing", "washed"],
        solutionHtml: "Pete and his sister là chủ ngữ số nhiều (2 người), động từ giữ nguyên: <b>'wash'</b>."
    },
    {
        type: "choice",
        questionText: "I always _________ to the bus stop. (Chọn dạng đúng của động từ)",
        correctAnswer: "hurry",
        options: ["hurry", "hurries", "hurrying", "hurried"],
        solutionHtml: "Chủ ngữ là 'I' động từ giữ nguyên ở thì hiện tại đơn: <b>'hurry'</b>."
    },
    {
        type: "choice",
        questionText: "She _________ four languages. (Chọn dạng đúng của động từ)",
        correctAnswer: "speaks",
        options: ["speaks", "speak", "speaking", "spoke"],
        solutionHtml: "Chủ ngữ là 'She' số ít, động từ 'speak' thêm 's' thành <b>'speaks'</b>."
    },
    {
        type: "choice",
        questionText: "Jane is a teacher. She _________ English. (Chọn dạng đúng của động từ)",
        correctAnswer: "teaches",
        options: ["teaches", "teach", "teaching", "teacher"],
        solutionHtml: "Chủ ngữ là 'She' số ít, động từ 'teach' tận cùng là 'ch' thêm 'es' thành <b>'teaches'</b>."
    },
    {
        type: "choice",
        questionText: "Those shoes _________ too much. (Chọn dạng đúng của động từ)",
        correctAnswer: "cost",
        options: ["cost", "costs", "costing", "costed"],
        solutionHtml: "Chủ ngữ 'Those shoes' là danh từ số nhiều, động từ giữ nguyên: <b>'cost'</b>."
    },
    {
        type: "choice",
        questionText: "My sister _________ to the library once a week. (Chọn dạng đúng của động từ)",
        correctAnswer: "goes",
        options: ["goes", "go", "going", "goes to"],
        solutionHtml: "Chủ ngữ 'My sister' số ít, động từ 'go' thêm 'es' thành <b>'goes'</b>."
    },
    {
        type: "choice",
        questionText: "We both _________ to the radio in the morning. (Chọn dạng đúng của động từ)",
        correctAnswer: "listen",
        options: ["listen", "listens", "listening", "listened"],
        solutionHtml: "Chủ ngữ 'We' số nhiều, động từ giữ nguyên: <b>'listen'</b>."
    },
    {
        type: "choice",
        questionText: "They ________ hockey at school. (Chọn dạng đúng của động từ)",
        correctAnswer: "play",
        options: ["play", "plays", "playing", "played"],
        solutionHtml: "Chủ ngữ 'They' số nhiều, động từ ở hiện tại đơn giữ nguyên: <b>'play'</b>."
    },
    {
        type: "choice",
        questionText: "She ________ poems. (Chọn dạng đúng của động từ)",
        correctAnswer: "doesn't write",
        options: ["doesn't write", "don't write", "not write", "doesn't writes"],
        solutionHtml: "Chủ ngữ 'She' số ít, câu phủ định động từ thường dùng <b>'doesn't + V nguyên thể'</b>."
    },
    {
        type: "choice",
        questionText: "_________ you _________ English? (Chọn dạng đúng của động từ)",
        correctAnswer: "Do - speak",
        options: ["Do - speak", "Does - speak", "Do - speaks", "Does - speaks"],
        solutionHtml: "Chủ ngữ 'you' dùng trợ động từ <b>'Do'</b> và động từ giữ nguyên mẫu <b>'speak'</b>."
    },
    {
        type: "choice",
        questionText: "My parents _________ fish. (Chọn dạng đúng của động từ)",
        correctAnswer: "don't like",
        options: ["don't like", "doesn't like", "not like", "don't likes"],
        solutionHtml: "Chủ ngữ 'My parents' số nhiều, câu phủ định dùng <b>'don't + V'</b>."
    },
    {
        type: "choice",
        questionText: "_________ Ann _________ any hobbies? (Chọn dạng đúng của động từ)",
        correctAnswer: "Does - have",
        options: ["Does - have", "Does - has", "Do - have", "Do - has"],
        solutionHtml: "Ann là chủ ngữ số ít, câu hỏi dùng trợ động từ <b>'Does'</b> và động từ nguyên thể <b>'have'</b>."
    },
    {
        type: "choice",
        questionText: "Andy’s brother _________ in a big building. (Chọn dạng đúng của động từ)",
        correctAnswer: "works",
        options: ["works", "work", "working", "worked"],
        solutionHtml: "Chủ ngữ 'Andy's brother' số ít, động từ 'work' thêm 's' thành <b>'works'</b>."
    },
    {
        type: "choice",
        questionText: "_________ Jim and Joe _________ the flowers every week? (Chọn dạng đúng của động từ)",
        correctAnswer: "Do - water",
        options: ["Do - water", "Does - water", "Do - waters", "Does - waters"],
        solutionHtml: "Jim and Joe là chủ ngữ số nhiều (2 người), câu hỏi dùng <b>'Do'</b> và động từ nguyên thể <b>'water'</b>."
    },
    {
        type: "choice",
        questionText: "Yvonne’s mother _________ a motorbike. (Chọn dạng đúng của động từ)",
        correctAnswer: "doesn't ride",
        options: ["doesn't ride", "don't ride", "not ride", "doesn't rides"],
        solutionHtml: "Chủ ngữ 'Yvonne's mother' số ít, phủ định dùng trợ động từ <b>'doesn't'</b> và động từ nguyên mẫu <b>'ride'</b>."
    },
    {
        type: "choice",
        questionText: "_________ Elisabeth _________ the door? (Chọn dạng đúng của động từ)",
        correctAnswer: "Does - knock",
        options: ["Does - knock", "Do - knock", "Does - knocks", "Do - knocks"],
        solutionHtml: "Elisabeth là chủ ngữ số ít, câu hỏi dùng trợ động từ <b>'Does'</b> và động từ nguyên mẫu <b>'knock'</b>."
    },
    {
        type: "choice",
        questionText: "What _________ you _________ in the school canteen? (Chọn dạng đúng của động từ)",
        correctAnswer: "do - buy",
        options: ["do - buy", "does - buy", "do - buys", "does - buys"],
        solutionHtml: "Chủ ngữ là 'you', câu hỏi Wh- dùng trợ động từ <b>'do'</b> và động từ nguyên mẫu <b>'buy'</b>."
    }
];

const ENG6_T1_WRITING_GRAMMAR_QUESTIONS = [
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Anh ấy thỉnh thoảng chơi gôn vào các ngày Chủ nhật.</i>",
        correctAnswer: "He sometimes plays golf on Sundays.",
        wordPool: ["He", "sometimes", "plays", "golf", "on", "Sundays."],
        solutionHtml: "Trạng từ chỉ tần suất 'sometimes' đứng trước động từ thường 'plays'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Thời tiết luôn xấu vào tháng Mười một.</i>",
        correctAnswer: "The weather is always bad in November.",
        wordPool: ["The", "weather", "is", "always", "bad", "in", "November."],
        solutionHtml: "Trạng từ chỉ tần suất 'always' đứng sau động từ tobe 'is'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Chúng tôi hiếm khi ăn cá vào bữa tối.</i>",
        correctAnswer: "We seldom have fish for dinner.",
        wordPool: ["We", "seldom", "have", "fish", "for", "dinner."],
        solutionHtml: "Trạng từ chỉ tần suất 'seldom' đứng trước động từ thường 'have'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Peter thường không thức dậy trước 7 giờ.</i>",
        correctAnswer: "Peter doesn't usually get up before seven.",
        wordPool: ["Peter", "doesn't", "usually", "get", "up", "before", "seven."],
        solutionHtml: "Trạng từ chỉ tần suất 'usually' đứng trước động từ thường 'get up' và sau trợ động từ 'doesn't'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Họ không bao giờ xem TV vào buổi chiều.</i>",
        correctAnswer: "They never watch TV in the afternoon.",
        wordPool: ["They", "never", "watch", "TV", "in", "the", "afternoon."],
        solutionHtml: "Trạng từ chỉ tần suất 'never' đứng trước động từ thường 'watch'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Anh trai tôi, Tony, hiếm khi đi phỏng vấn muộn.</i>",
        correctAnswer: "My brother Tony is rarely late for interview.",
        wordPool: ["My", "brother", "Tony", "is", "rarely", "late", "for", "interview."],
        solutionHtml: "Trạng từ chỉ tần suất 'rarely' đứng sau động từ tobe 'is'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Anh ấy luôn giúp đỡ bố mình.</i>",
        correctAnswer: "He always helps his father.",
        wordPool: ["He", "always", "helps", "his", "father."],
        solutionHtml: "Trạng từ chỉ tần suất 'always' đứng trước động từ thường 'helps'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp từ thành câu hỏi đúng)<br/><i>Ý nghĩa: Bạn có thường đi mua sắm không?</i>",
        correctAnswer: "How often do you go shopping?",
        wordPool: ["How", "often", "do", "you", "go", "shopping?"],
        solutionHtml: "Cấu trúc hỏi tần suất: 'How often + do/does + S + V?'"
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Tôi hiếm khi làm bài tập về nhà sau giờ học.</i>",
        correctAnswer: "I hardly do my homework after school.",
        wordPool: ["I", "hardly", "do", "my", "homework", "after", "school."],
        solutionHtml: "Trạng từ chỉ tần suất 'hardly' đứng trước động từ thường 'do'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Xe buýt trường học đến lúc 7 giờ mỗi ngày.</i>",
        correctAnswer: "The school bus arrives at seven every day.",
        wordPool: ["The", "school", "bus", "arrives", "at", "seven", "every", "day."],
        solutionHtml: "Cụm từ chỉ tần suất 'every day' đứng cuối câu."
    },
    {
        type: "writing_completion",
        questionText: "Write the correct present simple form of the verb 'have' (cho chủ ngữ he/she/it): (Viết dạng chia đúng của động từ)",
        correctAnswer: "has",
        solutionHtml: "Động từ 'have' biến đổi thành bất quy tắc <b>'has'</b> ở ngôi thứ ba số ít."
    },
    {
        type: "writing_completion",
        questionText: "Write the correct present simple form of the verb 'try' (cho chủ ngữ he/she/it): (Viết dạng chia đúng của động từ)",
        correctAnswer: "tries",
        solutionHtml: "Động từ 'try' tận cùng là 'y' đi sau phụ âm 'r', ta đổi 'y' thành 'ies' ➔ <b>'tries'</b>."
    },
    {
        type: "writing_completion",
        questionText: "Write the correct present simple form of the verb 'go' (cho chủ ngữ he/she/it): (Viết dạng chia đúng của động từ)",
        correctAnswer: "goes",
        solutionHtml: "Động từ 'go' tận cùng là 'o', ta thêm 'es' ➔ <b>'goes'</b>."
    },
    {
        type: "writing_completion",
        questionText: "Write the correct present simple form of the verb 'do' (cho chủ ngữ he/she/it): (Viết dạng chia đúng của động từ)",
        correctAnswer: "does",
        solutionHtml: "Động từ 'do' tận cùng là 'o', ta thêm 'es' ➔ <b>'does'</b>."
    }
];

const ENGLISH_GRAMMAR_TOPIC_QUESTIONS = {
    "to_be": [
        {
            type: "choice",
            questionText: "Hello! My name _________ Linh. (Chọn động từ To Be phù hợp)",
            correctAnswer: "is",
            options: ["is", "am", "are", "be"],
            solutionHtml: "My name là danh từ số ít ngôi thứ ba, đi với động từ tobe là <b>'is'</b>."
        },
        {
            type: "choice",
            questionText: "How _________ you today? - I am fine, thank you. (Chọn từ phù hợp)",
            correctAnswer: "are",
            options: ["are", "is", "am", "be"],
            solutionHtml: "Chủ ngữ là 'you' đi với động từ tobe <b>'are'</b> trong câu hỏi thăm sức khỏe."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Họ là học sinh mới.</i>",
            correctAnswer: "They are new students.",
            wordPool: ["They", "are", "new", "students."],
            solutionHtml: "Cấu trúc: S + tobe + adj + noun. Họ là học sinh mới."
        },
        {
            type: "choice",
            questionText: "We _________ happy to learn English together. (Chọn động từ phù hợp)",
            correctAnswer: "are",
            options: ["are", "is", "am", "be"],
            solutionHtml: "Chủ ngữ 'We' (chúng tôi - số nhiều) đi với động từ tobe <b>'are'</b>."
        }
    ],
    "articles": [
        {
            type: "choice",
            questionText: "This is _________ book. (Chọn mạo từ phù hợp)",
            correctAnswer: "a",
            options: ["a", "an", "the", "some"],
            solutionHtml: "Danh từ 'book' bắt đầu bằng phụ âm 'b' nên dùng mạo từ <b>'a'</b>."
        },
        {
            type: "choice",
            questionText: "Do you have _________ apple? (Chọn mạo từ phù hợp)",
            correctAnswer: "an",
            options: ["an", "a", "the", "any"],
            solutionHtml: "Danh từ 'apple' bắt đầu bằng nguyên âm 'a' nên dùng mạo từ <b>'an'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Tôi có một cục tẩy màu xanh lá cây.</i>",
            correctAnswer: "I have a green eraser.",
            wordPool: ["I", "have", "a", "green", "eraser."],
            solutionHtml: "Mạo từ 'a' đứng trước tính từ 'green' bổ nghĩa cho danh từ 'eraser'."
        },
        {
            type: "choice",
            questionText: "My father is _________ English teacher. (Chọn mạo từ phù hợp)",
            correctAnswer: "an",
            options: ["an", "a", "the", "one"],
            solutionHtml: "English bắt đầu bằng nguyên âm 'E' (/ɪ/), nên dùng mạo từ <b>'an'</b>."
        }
    ],
    "demonstratives": [
        {
            type: "choice",
            questionText: "Look at _________ birds up there in the sky! (Chọn từ phù hợp)",
            correctAnswer: "those",
            options: ["those", "these", "this", "that"],
            solutionHtml: "Birds là số nhiều và ở xa (up there in the sky) nên dùng từ chỉ định <b>'those'</b>."
        },
        {
            type: "choice",
            questionText: "Is _________ your pen here? - Yes, it is. (Chọn từ phù hợp)",
            correctAnswer: "this",
            options: ["this", "that", "these", "those"],
            solutionHtml: "Vật ở gần (here) và là số ít nên dùng chỉ định từ <b>'this'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Đây là những cuốn sách của tôi.</i>",
            correctAnswer: "These are my books.",
            wordPool: ["These", "are", "my", "books."],
            solutionHtml: "Cấu trúc chỉ định số nhiều ở gần: These are + danh từ số nhiều."
        },
        {
            type: "choice",
            questionText: "_________ pencil in my hand is yellow. (Chọn từ phù hợp)",
            correctAnswer: "This",
            options: ["This", "That", "These", "Those"],
            solutionHtml: "Cái bút chì ở gần (in my hand - trong tay tôi) số ít nên dùng <b>'This'</b>."
        }
    ],
    "plural_nouns": [
        {
            type: "choice",
            questionText: "How many _________ are there on the desk? (Chọn từ phù hợp)",
            correctAnswer: "books",
            options: ["books", "book", "a book", "books-style"],
            solutionHtml: "Sau cấu trúc 'How many' phải là danh từ đếm được số nhiều: <b>'books'</b>."
        },
        {
            type: "choice",
            questionText: "There are three _________ in the room. (Chọn từ phù hợp)",
            correctAnswer: "children",
            options: ["children", "childs", "child", "childrens"],
            solutionHtml: "Danh từ số nhiều bất quy tắc của 'child' là <b>'children'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Có 5 cái bút màu đỏ trên bàn.</i>",
            correctAnswer: "There are five red pens on the desk.",
            wordPool: ["There", "are", "five", "red", "pens", "on", "the", "desk."],
            solutionHtml: "Cấu trúc: There are + [số lượng] + [tính từ] + [danh từ số nhiều] + [vị trí]."
        },
        {
            type: "choice",
            questionText: "He has four _________ (Chọn từ phù hợp)",
            correctAnswer: "boxes",
            options: ["boxes", "boxs", "boxes-style", "box"],
            solutionHtml: "Danh từ 'box' tận cùng là 'x', khi chuyển sang số nhiều ta thêm 'es' thành <b>'boxes'</b>."
        }
    ],
    "possessive": [
        {
            type: "choice",
            questionText: "I am a student. _________ name is Bill. (Chọn tính từ sở hữu phù hợp)",
            correctAnswer: "My",
            options: ["My", "I", "Mine", "Me"],
            solutionHtml: "Chủ ngữ là 'I' thì tính từ sở hữu tương ứng bổ nghĩa cho danh từ name là <b>'My'</b>."
        },
        {
            type: "choice",
            questionText: "She likes _________ school very much. (Chọn tính từ sở hữu phù hợp)",
            correctAnswer: "her",
            options: ["her", "his", "your", "its"],
            solutionHtml: "Chủ ngữ là 'She' (cô ấy) thì dùng tính từ sở hữu tương ứng là <b>'her'</b> (của cô ấy)."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Tên của bạn là gì?</i>",
            correctAnswer: "What is your name?",
            wordPool: ["What", "is", "your", "name?"],
            solutionHtml: "Câu hỏi tên: What + is + tính từ sở hữu + name?"
        },
        {
            type: "choice",
            questionText: "He lives with _________ parents in the city. (Chọn tính từ sở hữu phù hợp)",
            correctAnswer: "his",
            options: ["his", "him", "he", "her"],
            solutionHtml: "Chủ ngữ là 'He' (anh ấy) thì tính từ sở hữu là <b>'his'</b> (của anh ấy)."
        }
    ],
    "modal_can": [
        {
            type: "choice",
            questionText: "A bird _________ fly, but a dog cannot. (Chọn động từ phù hợp)",
            correctAnswer: "can",
            options: ["can", "cannot", "must", "should"],
            solutionHtml: "Chim biết bay (chỉ khả năng) nên dùng động từ khuyết thiếu <b>'can'</b>."
        },
        {
            type: "choice",
            questionText: "_________ you swim? - Yes, I can. (Chọn từ phù hợp)",
            correctAnswer: "Can",
            options: ["Can", "Do", "Are", "Will"],
            solutionHtml: "Câu trả lời kết thúc bằng 'I can', nên câu hỏi bắt đầu bằng động từ khuyết thiếu <b>'Can'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Tôi có thể chơi đàn guitar.</i>",
            correctAnswer: "I can play the guitar.",
            wordPool: ["I", "can", "play", "the", "guitar."],
            solutionHtml: "Cấu trúc: S + can + V nguyên mẫu + O. Tôi có thể chơi guitar."
        },
        {
            type: "choice",
            questionText: "They _________ speak English very well. (Chọn từ phù hợp)",
            correctAnswer: "can",
            options: ["can", "are", "do", "must"],
            solutionHtml: "Diễn đạt khả năng nói tiếng Anh trôi chảy dùng trợ động từ khuyết thiếu <b>'can'</b>."
        }
    ],
    "like_ving": [
        {
            type: "choice",
            questionText: "She likes _________ to music in her free time. (Chọn từ phù hợp)",
            correctAnswer: "listening",
            options: ["listening", "listen", "to listening", "listened"],
            solutionHtml: "Sau động từ chỉ sở thích 'like' ta dùng động từ thêm đuôi -ing: <b>'listening'</b>."
        },
        {
            type: "choice",
            questionText: "Do you like _________ football? (Chọn từ phù hợp)",
            correctAnswer: "playing",
            options: ["playing", "plays", "play", "played"],
            solutionHtml: "Cấu trúc hỏi sở thích: Like + V-ing ➔ <b>'playing'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Chúng tôi thích học tiếng Anh.</i>",
            correctAnswer: "We like learning English.",
            wordPool: ["We", "like", "learning", "English."],
            solutionHtml: "Cấu trúc: S + like + V-ing + O. Chúng tôi thích học tiếng Anh."
        },
        {
            type: "choice",
            questionText: "My brother likes _________ books. (Chọn từ phù hợp)",
            correctAnswer: "reading",
            options: ["reading", "read", "reads", "to reading"],
            solutionHtml: "Thích đọc sách: likes + V-ing ➔ <b>'reading'</b>."
        }
    ],
    "present_continuous": [
        {
            type: "choice",
            questionText: "Look! The children _________ in the garden. (Chọn dạng động từ phù hợp)",
            correctAnswer: "are playing",
            options: ["are playing", "is playing", "play", "played"],
            solutionHtml: "Câu có từ nhận biết 'Look!' chỉ hành động đang diễn ra. Chủ ngữ 'The children' số nhiều nên chia <b>'are playing'</b>."
        },
        {
            type: "choice",
            questionText: "She _________ a blue dress today. (Chọn dạng động từ phù hợp)",
            correctAnswer: "is wearing",
            options: ["is wearing", "wear", "wears", "are wearing"],
            solutionHtml: "Diễn tả hành động mặc đồ hôm nay (hành động tạm thời) dùng thì Hiện tại tiếp diễn: <b>'is wearing'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Bây giờ bạn đang làm gì thế?</i>",
            correctAnswer: "What are you doing now?",
            wordPool: ["What", "are", "you", "doing", "now?"],
            solutionHtml: "Cấu trúc câu hỏi thì Hiện tại tiếp diễn: Wh- + am/is/are + S + V-ing + now?"
        },
        {
            type: "choice",
            questionText: "What _________ he doing now? - He is reading. (Chọn từ phù hợp)",
            correctAnswer: "is",
            options: ["is", "are", "am", "does"],
            solutionHtml: "Chủ ngữ 'he' số ít đi kèm trợ động từ <b>'is'</b> trong thì Hiện tại tiếp diễn."
        }
    ],
    "prepositions_place": [
        {
            type: "choice",
            questionText: "The book is _________ the table. (Chọn giới từ phù hợp)",
            correctAnswer: "on",
            options: ["on", "in", "under", "next"],
            solutionHtml: "Quyển sách nằm trên bề mặt bàn nên dùng giới từ <b>'on'</b>."
        },
        {
            type: "choice",
            questionText: "There is a big tree _________ of my house. (Chọn giới từ phù hợp)",
            correctAnswer: "in front",
            options: ["in front", "behind", "next to", "opposite"],
            solutionHtml: "Đi kèm với 'of' tạo thành cụm giới từ chỉ vị trí phía trước là: <b>'in front of'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Con mèo ở dưới cái ghế.</i>",
            correctAnswer: "The cat is under the chair.",
            wordPool: ["The", "cat", "is", "under", "the", "chair."],
            solutionHtml: "Cấu trúc miêu tả vị trí: S + tobe + giới từ chỉ vị trí + the + danh từ."
        },
        {
            type: "choice",
            questionText: "The library is _________ to the classroom. (Chọn giới từ phù hợp)",
            correctAnswer: "next",
            options: ["next", "near", "opposite", "behind"],
            solutionHtml: "Giới từ đi với 'to' để chỉ bên cạnh là: <b>'next to'</b>."
        }
    ],
    "present_simple_verbs": [
        {
            type: "choice",
            questionText: "He _________ to school every day. (Chọn dạng động từ phù hợp)",
            correctAnswer: "goes",
            options: ["goes", "go", "going", "went"],
            solutionHtml: "Thì hiện tại đơn chỉ thói quen 'every day', chủ ngữ 'He' số ít nên động từ 'go' thêm 'es' thành <b>'goes'</b>."
        },
        {
            type: "choice",
            questionText: "They _________ like chocolate. (Chọn trợ động từ phủ định phù hợp)",
            correctAnswer: "don't",
            options: ["don't", "doesn't", "not", "no"],
            solutionHtml: "Chủ ngữ 'They' số nhiều, câu phủ định thì hiện tại đơn dùng trợ động từ <b>'don't'</b>."
        },
        {
            type: "choice",
            questionText: "_________ she watch TV in the evening? (Chọn trợ động từ phù hợp)",
            correctAnswer: "Does",
            options: ["Does", "Do", "Is", "Are"],
            solutionHtml: "Câu hỏi Yes/No chủ ngữ 'she' số ít, động từ thường 'watch' nên dùng trợ động từ <b>'Does'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Chúng tôi ăn sáng lúc 6 giờ.</i>",
            correctAnswer: "We have breakfast at six o'clock.",
            wordPool: ["We", "have", "breakfast", "at", "six", "o'clock."],
            solutionHtml: "Cấu trúc: S + V + O + cụm thời gian. We have breakfast at six o'clock."
        },
        {
            type: "choice",
            questionText: "She _________ her homework after school. (Chọn dạng động từ do phù hợp)",
            correctAnswer: "does",
            options: ["does", "do", "doing", "did"],
            solutionHtml: "Chủ ngữ 'She' số ít, động từ 'do' chia ở hiện tại đơn thành <b>'does'</b>."
        }
    ],
    "adverbs_frequency": [
        {
            type: "choice",
            questionText: "He is _________ late for school. He is a good student. (Chọn trạng từ tần suất phù hợp)",
            correctAnswer: "never",
            options: ["never", "always", "sometimes", "usually"],
            solutionHtml: "Học sinh giỏi thì không bao giờ đi học muộn, chọn trạng từ chỉ tần suất phủ định tuyệt đối: <b>'never'</b>."
        },
        {
            type: "choice",
            questionText: "How _________ do you go swimming? - Twice a week. (Chọn từ phù hợp)",
            correctAnswer: "often",
            options: ["often", "sometimes", "usually", "never"],
            solutionHtml: "Câu hỏi về tần suất: <b>'How often + do/does + S + V?'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Anh ấy luôn luôn giúp đỡ mẹ mình.</i>",
            correctAnswer: "He always helps his mother.",
            wordPool: ["He", "always", "helps", "his", "mother."],
            solutionHtml: "Trạng từ chỉ tần suất 'always' đứng trước động từ thường 'helps'."
        },
        {
            type: "choice",
            questionText: "We _________ play football on Sundays. (Chọn trạng từ phù hợp)",
            correctAnswer: "usually",
            options: ["usually", "are", "did", "have"],
            solutionHtml: "Trạng từ tần suất chỉ thói quen thường xuyên đứng trước động từ thường: <b>'usually'</b>."
        }
    ],
    "prepositions_time": [
        {
            type: "choice",
            questionText: "My birthday is _________ January. (Chọn giới từ phù hợp)",
            correctAnswer: "in",
            options: ["in", "on", "at", "to"],
            solutionHtml: "Trước các tháng trong năm dùng giới từ <b>'in'</b>."
        },
        {
            type: "choice",
            questionText: "We have English class _________ Mondays. (Chọn giới từ phù hợp)",
            correctAnswer: "on",
            options: ["on", "in", "at", "by"],
            solutionHtml: "Trước các thứ trong tuần dùng giới từ <b>'on'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Tôi thức dậy lúc 6 giờ.</i>",
            correctAnswer: "I get up at six o'clock.",
            wordPool: ["I", "get", "up", "at", "six", "o'clock."],
            solutionHtml: "Trước giờ chẵn cụ thể ta dùng giới từ chỉ thời gian là <b>'at'</b>."
        },
        {
            type: "choice",
            questionText: "He watches TV _________ the evening. (Chọn giới từ phù hợp)",
            correctAnswer: "in",
            options: ["in", "on", "at", "to"],
            solutionHtml: "Cụm từ chỉ các buổi trong ngày: <b>'in the evening'</b>."
        }
    ],
    "should_shouldn't": [
        {
            type: "choice",
            questionText: "You _________ eat too much candy. It's bad for your teeth. (Chọn từ khuyên bảo phù hợp)",
            correctAnswer: "shouldn't",
            options: ["shouldn't", "should", "must", "can"],
            solutionHtml: "Ăn kẹo nhiều có hại cho răng nên khuyên không nên làm: <b>'shouldn't'</b>."
        },
        {
            type: "choice",
            questionText: "He has a cough. He _________ see a doctor. (Chọn từ khuyên bảo phù hợp)",
            correctAnswer: "should",
            options: ["should", "shouldn't", "can't", "mustn't"],
            solutionHtml: "Bị ho thì khuyên nên đi khám bác sĩ, dùng động từ khuyết thiếu đưa ra lời khuyên: <b>'should'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Bạn nên đánh răng mỗi ngày.</i>",
            correctAnswer: "You should brush your teeth every day.",
            wordPool: ["You", "should", "brush", "your", "teeth", "every", "day."],
            solutionHtml: "Cấu trúc khuyên bảo: S + should + V nguyên mẫu + O. Bạn nên đánh răng mỗi ngày."
        },
        {
            type: "choice",
            questionText: "What _________ I do to keep fit? (Chọn từ phù hợp)",
            correctAnswer: "should",
            options: ["should", "must", "can", "am"],
            solutionHtml: "Hỏi xin lời khuyên: 'What should + S + V?' ➔ dùng <b>'should'</b>."
        }
    ],
    "past_simple": [
        {
            type: "choice",
            questionText: "We _________ at home yesterday. (Chọn động từ To Be quá khứ phù hợp)",
            correctAnswer: "were",
            options: ["were", "was", "are", "been"],
            solutionHtml: "Thời gian quá khứ 'yesterday', chủ ngữ 'We' số nhiều nên dùng tobe quá khứ là <b>'were'</b>."
        },
        {
            type: "choice",
            questionText: "He _________ his homework last night. (Chọn dạng động từ do quá khứ)",
            correctAnswer: "did",
            options: ["did", "does", "do", "done"],
            solutionHtml: "Thời gian quá khứ 'last night', động từ 'do' biến đổi thành quá khứ là <b>'did'</b>."
        },
        {
            type: "choice",
            questionText: "She _________ a new book last week. (Chọn dạng động từ buy quá khứ)",
            correctAnswer: "bought",
            options: ["bought", "buy", "buys", "buying"],
            solutionHtml: "Động từ bất quy tắc 'buy' chuyển sang quá khứ đơn là <b>'bought'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Họ không đi học ngày hôm qua.</i>",
            correctAnswer: "They did not go to school yesterday.",
            wordPool: ["They", "did", "not", "go", "to", "school", "yesterday."],
            solutionHtml: "Câu phủ định quá khứ đơn: S + did + not + V-inf. Họ không đi học hôm qua."
        }
    ],
    "comparatives": [
        {
            type: "choice",
            questionText: "My house is _________ than your house. (Chọn tính từ so sánh phù hợp)",
            correctAnswer: "bigger",
            options: ["bigger", "big", "more big", "biggest"],
            solutionHtml: "So sánh hơn của tính từ ngắn 'big' nhân đôi phụ âm cuối 'g' thêm 'er' thành <b>'bigger'</b>."
        },
        {
            type: "choice",
            questionText: "This book is _________ than that book. (Chọn tính từ so sánh phù hợp)",
            correctAnswer: "more interesting",
            options: ["more interesting", "interesting", "interestinger", "most interesting"],
            solutionHtml: "Interesting là tính từ dài, cấu trúc so sánh hơn: <b>'more + tính từ dài + than'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Đọc sách tốt hơn chơi trò chơi.</i>",
            correctAnswer: "Reading books is better than playing games.",
            wordPool: ["Reading", "books", "is", "better", "than", "playing", "games."],
            solutionHtml: "So sánh hơn bất quy tắc của tính từ 'good/well' là <b>'better'</b>."
        },
        {
            type: "choice",
            questionText: "He is _________ than his brother. (Chọn tính từ so sánh phù hợp)",
            correctAnswer: "taller",
            options: ["taller", "tall", "more tall", "tallest"],
            solutionHtml: "So sánh hơn của tính từ ngắn 'tall' là <b>'taller'</b>."
        }
    ],
    "future_plans": [
        {
            type: "choice",
            questionText: "We _________ going to visit Hanoi next summer. (Chọn động từ phù hợp)",
            correctAnswer: "are",
            options: ["are", "is", "am", "will"],
            solutionHtml: "Cấu trúc tương lai gần 'be going to V', chủ ngữ 'We' số nhiều đi với động từ tobe <b>'are'</b>."
        },
        {
            type: "choice",
            questionText: "What _________ you do tomorrow? - I will stay at home. (Chọn trợ động từ phù hợp)",
            correctAnswer: "will",
            options: ["will", "do", "are", "shall"],
            solutionHtml: "Hỏi về kế hoạch tương lai đơn với 'tomorrow', trả lời 'I will' nên câu hỏi dùng trợ động từ <b>'will'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Họ sẽ chơi bóng đá vào ngày mai.</i>",
            correctAnswer: "They are going to play football tomorrow.",
            wordPool: ["They", "are", "going", "to", "play", "football", "tomorrow."],
            solutionHtml: "Cấu trúc diễn tả dự định/kế hoạch: S + am/is/are + going to + V-inf."
        },
        {
            type: "choice",
            questionText: "I _________ think it will rain tomorrow. (Chọn trợ động từ phủ định phù hợp)",
            correctAnswer: "don't",
            options: ["don't", "doesn't", "will not", "am not"],
            solutionHtml: "Diễn tả ý kiến cá nhân về tương lai dùng cấu trúc 'I don't think it will V'."
        }
    ],
    "must_mustn't": [
        {
            type: "choice",
            questionText: "You _________ speak loudly in the library. (Chọn từ phù hợp)",
            correctAnswer: "mustn't",
            options: ["mustn't", "must", "should", "can"],
            solutionHtml: "Nội quy cấm đoán trong thư viện (không được phép): <b>'mustn't'</b>."
        },
        {
            type: "choice",
            questionText: "We _________ do our homework before class. (Chọn từ phù hợp)",
            correctAnswer: "must",
            options: ["must", "mustn't", "needn't", "shouldn't"],
            solutionHtml: "Nhiệm vụ bắt buộc phải hoàn thành dùng động từ khuyết thiếu chỉ nghĩa bắt buộc: <b>'must'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Bạn phải tuân thủ luật lệ giao thông.</i>",
            correctAnswer: "You must obey the traffic rules.",
            wordPool: ["You", "must", "obey", "the", "traffic", "rules."],
            solutionHtml: "Cấu trúc bắt buộc: S + must + V-inf. Bạn phải tuân thủ luật lệ giao thông."
        },
        {
            type: "choice",
            questionText: "Students _________ cheat in the exams. (Chọn từ khuyết thiếu phù hợp)",
            correctAnswer: "mustn't",
            options: ["mustn't", "must", "should", "needn't"],
            solutionHtml: "Gian lận thi cử là điều cấm kỵ tuyệt đối đối với học sinh, dùng <b>'mustn't'</b>."
        }
    ],
    "first_conditional": [
        {
            type: "choice",
            questionText: "If it rains tomorrow, we _________ stay at home. (Chọn dạng động từ phù hợp)",
            correctAnswer: "will",
            options: ["will", "would", "are", "do"],
            solutionHtml: "Câu điều kiện loại 1: Mệnh đề If dùng hiện tại đơn (rains), mệnh đề chính dùng tương lai đơn <b>'will + V'</b>."
        },
        {
            type: "choice",
            questionText: "If you _________ hard, you will pass the exam. (Chọn dạng động từ phù hợp)",
            correctAnswer: "study",
            options: ["study", "studies", "will study", "studied"],
            solutionHtml: "Mệnh đề If của câu điều kiện loại 1 chia thì hiện tại đơn, chủ ngữ 'you' nên động từ giữ nguyên là <b>'study'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Nếu cô ấy đến, chúng tôi sẽ đi chơi.</i>",
            correctAnswer: "If she comes, we will go out.",
            wordPool: ["If", "she", "comes,", "we", "will", "go", "out."],
            solutionHtml: "Cấu trúc điều kiện loại 1: If + S + V(s/es), S + will + V-inf."
        },
        {
            type: "choice",
            questionText: "What will you do if you _________ free? (Chọn dạng động từ tobe phù hợp)",
            correctAnswer: "are",
            options: ["are", "is", "am", "will be"],
            solutionHtml: "Mệnh đề If dùng hiện tại đơn của To Be với chủ ngữ 'you' là <b>'are'</b>."
        }
    ]
};

    return {
        ENG6_T1_READING_GRAMMAR_QUESTIONS: ENG6_T1_READING_GRAMMAR_QUESTIONS,
        ENG6_T1_WRITING_GRAMMAR_QUESTIONS: ENG6_T1_WRITING_GRAMMAR_QUESTIONS,
        ENGLISH_GRAMMAR_TOPIC_QUESTIONS: ENGLISH_GRAMMAR_TOPIC_QUESTIONS
    };
});
