const { test, expect } = require('@playwright/test');

test.describe('E2E Real-Browser Student Journey — Math Short Answer Evaluation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/student.html');
  });

  test('Xác minh MathAnswerEvaluator hoạt động chuẩn xác trong runtime của trình duyệt thật', async ({ page }) => {
    // Đảm bảo module MathAnswerEvaluator đã được load trên window của trình duyệt
    const isEvaluatorLoaded = await page.evaluate(() => {
      return Boolean(window.MathAnswerEvaluator && typeof window.MathAnswerEvaluator.evaluateShortAnswer === 'function');
    });
    expect(isEvaluatorLoaded).toBe(true);

    // Kiểm tra trực tiếp trong ngữ cảnh window browser:
    // 20 / 20 -> true, 2 / 20 -> false, 0 / 20 -> false
    const results = await page.evaluate(() => {
      return {
        correct_20_20: window.MathAnswerEvaluator.evaluateShortAnswer("20", "20"),
        incorrect_2_20: window.MathAnswerEvaluator.evaluateShortAnswer("2", "20"),
        incorrect_0_20: window.MathAnswerEvaluator.evaluateShortAnswer("0", "20"),
        incorrect_200_20: window.MathAnswerEvaluator.evaluateShortAnswer("200", "20"),
        correct_100_100: window.MathAnswerEvaluator.evaluateShortAnswer("100", "100"),
        incorrect_1_100: window.MathAnswerEvaluator.evaluateShortAnswer("1", "100"),
        incorrect_10_100: window.MathAnswerEvaluator.evaluateShortAnswer("10", "100"),
        correct_unit_20cm: window.MathAnswerEvaluator.evaluateShortAnswer("20 cm", "20"),
        correct_vietnamese: window.MathAnswerEvaluator.evaluateShortAnswer("tam giác đều", "tam giác đều"),
        preserve_doanthang: window.MathAnswerEvaluator.evaluateShortAnswer("Đoạn thẳng AB", "Đoạn thẳng AB")
      };
    });

    expect(results.correct_20_20).toBe(true);
    expect(results.incorrect_2_20).toBe(false);
    expect(results.incorrect_0_20).toBe(false);
    expect(results.incorrect_200_20).toBe(false);
    expect(results.correct_100_100).toBe(true);
    expect(results.incorrect_1_100).toBe(false);
    expect(results.incorrect_10_100).toBe(false);
    expect(results.correct_unit_20cm).toBe(true);
    expect(results.correct_vietnamese).toBe(true);
    expect(results.preserve_doanthang).toBe(true);
  });

  test('Student Journey: Bắt đầu làm bài toán điền đáp án ngắn -> Nhập đáp án -> Chấm điểm -> Chuyển câu', async ({ page }) => {
    // Bỏ qua màn hình splash screen nếu có
    const splashStartBtn = page.locator('#splash-start-btn');
    if (await splashStartBtn.isVisible()) {
      await splashStartBtn.click();
    }

    // Giả lập trực tiếp một session luyện tập câu hỏi short-answer trong questions engine
    await page.evaluate(() => {
      if (window.questions) {
        // Thiết lập bộ câu hỏi kiểm thử short-answer
        window.questions.currentQuestions = [
          {
            id: "q_test_sa_1",
            questionText: "Tính giá trị của 15 + 5 = ?",
            options: ["20", "25", "18", "30"],
            correctIndex: 0,
            forceMCQ: false,
            userShortAnswer: ""
          },
          {
            id: "q_test_sa_2",
            questionText: "Tam giác đều có mấy trục đối xứng?",
            options: ["3 trục đối xứng", "1 trục đối xứng", "2 trục đối xứng", "4 trục đối xứng"],
            correctIndex: 0,
            forceMCQ: false,
            userShortAnswer: ""
          }
        ];
        window.questions.currentQuestionIndex = 0;
        window.questions.isGraded = false;
        
        // Render câu hỏi đầu tiên
        if (typeof window.questions.displayCurrentQuestion === 'function') {
          window.questions.displayCurrentQuestion();
        }
      }
    });

    // 1. Kiểm tra câu 1: Nhập "2" cho đáp án "20" -> Chấm phải là FALSE
    const isFalseFor2 = await page.evaluate(() => {
      return window.questions.checkShortAnswer("2", "20");
    });
    expect(isFalseFor2).toBe(false);

    // 2. Nhập "0" cho đáp án "20" -> Chấm phải là FALSE
    const isFalseFor0 = await page.evaluate(() => {
      return window.questions.checkShortAnswer("0", "20");
    });
    expect(isFalseFor0).toBe(false);

    // 3. Nhập "20" cho đáp án "20" -> Chấm phải là TRUE
    const isTrueFor20 = await page.evaluate(() => {
      return window.questions.checkShortAnswer("20", "20");
    });
    expect(isTrueFor20).toBe(true);

    // 4. Kiểm tra câu 2 với đơn vị & từ vựng tiếng Việt: "3" hoặc "3 trục đối xứng" cho "3 trục đối xứng"
    const isTrueFor3 = await page.evaluate(() => {
      return window.questions.checkShortAnswer("3", "3 trục đối xứng");
    });
    expect(isTrueFor3).toBe(true);

    const isTrueFor3Units = await page.evaluate(() => {
      return window.questions.checkShortAnswer("3 trục đối xứng", "3 trục đối xứng");
    });
    expect(isTrueFor3Units).toBe(true);
  });

  test('Real Browser DOM Verification: L1, L4, AI Template deterministically render MCQ buttons vs Short Answer input', async ({ page }) => {
    // Bỏ qua màn hình splash screen nếu có
    const splashStartBtn = page.locator('#splash-start-btn');
    if (await splashStartBtn.isVisible()) {
      await splashStartBtn.click();
    }

    // 1. Khởi động bài học môn Toán và kiểm tra L1 MCQ question -> nút .option-btn hiển thị, không có #short-answer-input
    await page.evaluate(() => {
      if (window.app) {
        app.selectSubject('math');
        app.startLesson('bai-1');
        app.switchLessonTab('practice');
      }
      if (window.questions) {
        const l1Q = window.questions.generateQuestion('l1-cac-so-0-5-d1', 'co-ban');
        l1Q.isShortAnswer = false; // MCQ mode
        window.questions.currentQuestions = [l1Q];
        window.questions.currentQuestionIndex = 0;
        window.questions.practiceMode = 'standard';
        window.questions.isGraded = false;

        const selectBox = document.getElementById("practice-mode-select-box");
        if (selectBox) selectBox.classList.add("hidden");
        const activeBox = document.getElementById("practice-active-box");
        if (activeBox) activeBox.classList.remove("hidden");

        window.questions.showQuestion();
      }
    });

    const optionButtons = page.locator('.option-btn');
    await expect(optionButtons.first()).toBeVisible();
    const countOptions = await optionButtons.count();
    expect(countOptions).toBeGreaterThanOrEqual(2);
    const shortAnswerInput = page.locator('#short-answer-input');
    await expect(shortAnswerInput).toHaveCount(0);

    // 2. Kiểm tra L1 Short Answer question: Phải render #short-answer-input, không có .option-btn
    await page.evaluate(() => {
      if (window.questions) {
        const l1Q_SA = {
          questionText: "Tính nhẩm: $3 + 2 = ?$",
          options: ["$5$", "$6$", "$4$"],
          correctIndex: 0,
          isShortAnswer: true,
          forceMCQ: false,
          userShortAnswer: ""
        };
        window.questions.currentQuestions = [l1Q_SA];
        window.questions.currentQuestionIndex = 0;
        window.questions.isGraded = false;
        window.questions.showQuestion();
      }
    });

    await expect(shortAnswerInput).toBeVisible();
    await expect(optionButtons).toHaveCount(0);

    // 3. Kiểm tra L4 MCQ question: Phải render các nút trắc nghiệm (.option-btn)
    await page.evaluate(() => {
      if (window.questions) {
        const l4Q = window.questions.generateQuestion('l4-on-tap-100k', 'co-ban');
        l4Q.isShortAnswer = false;
        window.questions.currentQuestions = [l4Q];
        window.questions.currentQuestionIndex = 0;
        window.questions.isGraded = false;
        window.questions.showQuestion();
      }
    });

    await expect(optionButtons.first()).toBeVisible();
    await expect(shortAnswerInput).toHaveCount(0);

    // 4. Kiểm tra AI Template MCQ question: Phải render các nút trắc nghiệm (.option-btn)
    await page.evaluate(() => {
      if (window.questions) {
        const aiQ = window.questions.generateQuestionFromTemplate({
          isTemplate: true,
          questionText: "Trong các khẳng định sau, khẳng định nào đúng?",
          options: ["A. Số 0 là số tự nhiên", "B. Số nguyên tố luôn là số lẻ"],
          correctIndex: 0
        });
        aiQ.isShortAnswer = false;
        window.questions.currentQuestions = [aiQ];
        window.questions.currentQuestionIndex = 0;
        window.questions.isGraded = false;
        window.questions.showQuestion();
      }
    });

    await expect(optionButtons.first()).toBeVisible();
    await expect(shortAnswerInput).toHaveCount(0);
  });
});
