const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load file .env từ thư mục dự án
dotenv.config({ path: 'D:/AntiGravity/HocTap/.env' });

const rawKeys = process.env.GEMINI_API_KEY || '';
const apiKeys = rawKeys.split(/[\s,;]+/).filter(k => k && k !== 'your_gemini_api_key_here');
const key = apiKeys[0]?.trim();

if (!key) {
  console.error("Không tìm thấy GEMINI_API_KEY trong file .env!");
  process.exit(1);
}

console.log("Sử dụng API Key:", key.substring(0, 8) + "...");

const getMathPrompt = (lessonTitle, lessonId) => {
  return `Bạn là một giáo viên dạy Toán lớp 6 chuyên bồi dưỡng học sinh giỏi và luyện thi chất lượng cao tại Việt Nam.
Hãy biên soạn đúng 10 câu hỏi trắc nghiệm toán học bậc CHẤT LƯỢNG CAO (đòi hỏi tư duy logic sâu sắc, vận dụng cao, giải quyết các bài toán đố thực tế thú vị) liên quan trực tiếp đến bài học: "${lessonTitle}" (ID bài học: ${lessonId}).

Yêu cầu đặc biệt: Để học sinh có thể làm lại đề thi nhiều lần mà không bị trùng số liệu, bạn phải biên soạn mỗi câu hỏi dưới dạng một template lập trình JSON có chứa các biến ngẫu nhiên, các ràng buộc điều kiện và công thức tính toán.

Yêu cầu toán học & lập trình quan trọng:
1. Các biến trong "variables" phải là các số tự nhiên hoặc số nguyên phù hợp với chương trình lớp 6. Khoảng giá trị [min, max] phải hợp lý để bài toán có nghĩa và không quá lớn.
2. "constraints" là danh sách các biểu thức ràng buộc để đảm bảo đề bài hợp lệ về mặt toán học và thực tế (ví dụ: số lớn phải lớn hơn số bé "a > b", hoặc chia hết "a % b === 0"). Sử dụng cú pháp JavaScript hợp lệ.
3. "formulas" dùng để tính toán đáp án đúng và các phương án sai (nhiễu), cũng như các giá trị trung gian trong lời giải chi tiết. Ví dụ: nếu đáp án đúng là "ans" thì trong "formulas" phải định nghĩa "ans": "a / b", và trong "options" có chứa "{ans}".
   - Các công thức cho đáp án nhiễu phải được thiết kế thông minh để tránh việc vô tình trùng giá trị với nhau hoặc trùng với đáp án đúng (ví dụ: w1 = ans + 2, w2 = ans - 2, w3 = ans * 2 thay vì các công thức dễ dẫn đến cùng kết quả).
4. Quy định về hiển thị Tiếng Việt và các cấu trúc "solutionHtml" (Lời giải chi tiết), "tip" (Mẹo):
   - TẤT CẢ các nội dung văn bản hiển thị cho học sinh (bao gồm: "questionText", các phương án lựa chọn trong "options", các chỉ dẫn trong "hints", "solutionHtml" và "tip") bắt buộc phải viết bằng TIẾNG VIỆT CÓ DẤU đầy đủ, chuẩn chính tả sư phạm. Tuyệt đối không viết tiếng Việt không dấu (ví dụ: cấm viết 'Tinh gia tri', 'Ta co', 'Dap an dung la',...; bắt buộc phải viết 'Tính giá trị', 'Ta có', 'Đáp án đúng là',...).
   - Phải trình bày HOÀN TOÀN bằng Tiếng Việt chuẩn sư phạm Việt Nam, rõ ràng, dễ hiểu đối với học sinh lớp 6. Tuyệt đối không pha trộn tiếng Anh hay viết cẩu thả.
   - Phải phân chia cấu trúc rõ ràng, sử dụng thẻ \`<br/>\` để xuống dòng có tổ chức, chia các bước giải mạch lạc (không viết dồn cục một khối văn bản).
   - TUYỆT ĐỐI CẤM sử dụng hoặc hiển thị trực tiếp các tên biến lập trình tiếng Anh thô hay code JavaScript thô như \`lowerBound\`, \`upperBound\`, \`factor1\`, \`lcm_val_q3\`, \`Math.floor\`, \`Math.pow\`, \`variables.\`, \`formulas.\`, \`===\`, \`?\`, \`:\` trong văn bản đề bài, gợi ý, lời giải và mẹo. Hãy dịch hoặc dùng từ tiếng Việt tương đương (ví dụ: dùng "cận dưới" thay cho "lowerBound", "cận trên" thay cho "upperBound"). Toàn bộ các giá trị tính toán phức tạp này PHẢI được tính toán sẵn trong phần "formulas" thành các biến kết quả trung gian, và trong "solutionHtml" chỉ được tham chiếu đến biến kết quả sạch đã tính sẵn (ví dụ: \`{val1}\` thay vì \`{Math.floor((upperBound - 1) / factor1)}\` hay \`{variables.factor1}\`).
   - TUYỆT ĐỐI KHÔNG sử dụng ký tự tiếng Việt có dấu trong thẻ LaTeX \`\\text{...}\` (ví dụ: \`\\text{số lượng}\` là sai, hãy viết \`\\text{so luong}\` hoặc viết hẳn chữ tiếng Việt ở ngoài dấu \`$\`).
5. Đảm bảo các công thức toán, biểu thức (kể cả chứa placeholder như {a}) phải được bọc trong cặp dấu $ thích hợp (ví dụ: $\\frac{{a}}{{b}}$ hoặc $ {a} + {b} = {ans} $) để KaTeX render chuẩn.
   - **QUY TẮC VÀNG TRÁNH LỖI LỆCH DẤU $**: Tuyệt đối không sử dụng ký tự "$" trước dấu mở ngoặc "{" của các biến nằm bên trong một biểu thức LaTeX dài. Ví dụ: viết "$A = \\{a1, a2, a3\\}$" thay vì viết "$A = \\{$a1, $a2, $a3\\}$" vì dấu "$" đứng trước các biến bên trong sẽ phá vỡ định dạng KaTeX. Dấu "$" chỉ được đặt ở đầu và ở cuối biểu thức LaTeX.
   - Đối với các biến số đơn giản đi kèm với đơn vị, ví dụ số thành viên, hãy dùng \`{totalMembers} thành viên\` (không cần bọc dấu \`$\`). Nếu bắt buộc phải bọc dấu \`$\` để có font toán học, hãy bọc đúng cách: \`$ {totalMembers} $\` (có dấu $ ở đầu và ở cuối). TUYỆT ĐỐI KHÔNG viết dạng \`{totalMembers}$\` hay \`{totalMembers}\` (vì sẽ làm dư thừa hoặc thiếu dấu $, dẫn đến lỗi dính chữ và ký tự lạ trên toàn trang).
6. Đảm bảo tính logic thực tế của đề bài: các ràng buộc trong "constraints" phải đảm bảo đề bài không bị mâu thuẫn thực tế. Ví dụ: nếu đề bài cho "mỗi thành viên chỉ tham gia đúng một đội" thì tổng số thành viên của các đội cộng lại phải nhỏ hơn hoặc bằng tổng số thành viên của cả câu lạc bộ ("teamA + teamB + teamC <= totalMembers").
7. Đảm bảo file JSON đầu ra hoàn toàn hợp lệ, không chứa lỗi cú pháp.


Ví dụ minh họa cấu trúc câu hỏi:
{
  "isTemplate": true,
  "variables": {
    "a": { "min": 12, "max": 30, "step": 1 },
    "b": { "min": 3, "max": 9, "step": 1 }
  },
  "constraints": [
    "a > b",
    "a % b === 0"
  ],
  "formulas": {
    "ans": "a / b",
    "w1": "a + b",
    "w2": "a - b",
    "w3": "a * b"
  },
  "questionText": "Bố chia đều {a} chiếc kẹo cho {b} bạn học sinh. Hỏi mỗi bạn nhận được bao nhiêu chiếc kẹo?",
  "options": [
    "A. {w1} chiếc kẹo",
    "B. {ans} chiếc kẹo",
    "C. {w2} chiếc kẹo",
    "D. {w3} chiếc kẹo"
  ],
  "correctIndex": 1,
  "hints": [
    "Muốn tìm số kẹo mỗi bạn nhận được, ta lấy tổng số kẹo là {a} chia cho số bạn là {b}.",
    "Hãy thực hiện phép chia $ {a} : {b} $."
  ],
  "solutionHtml": "Số kẹo mỗi bạn học sinh nhận được là:<br/>$ {a} : {b} = {ans} $ (chiếc kẹo).<br/>Đáp án đúng là B.",
  "tip": "Cần đọc kỹ đề để thực hiện phép tính chia chứ không phải phép nhân hay phép cộng.",
  "level": "chat-luong-cao",
  "type": "${lessonId}-d4"
}

Hãy biên soạn đúng 10 câu hỏi chất lượng cao dưới dạng mảng JSON "questions" như trên.
Chỉ trả về chuỗi JSON thô, không bọc trong tag \`\`\`json hay bất kỳ văn bản thừa nào.`;
};

function cleanJsonString(str) {
  let result = '';
  let inString = false;
  let i = 0;
  
  while (i < str.length) {
    let char = str[i];
    
    if (char === '"') {
      if (i > 0 && str[i - 1] === '\\') {
        result += char;
        i++;
        continue;
      }
      
      if (inString) {
        let nextNonSpaceChar = '';
        let j = i + 1;
        while (j < str.length) {
          const nextChar = str[j];
          if (nextChar !== ' ' && nextChar !== '\t' && nextChar !== '\r' && nextChar !== '\n') {
            nextNonSpaceChar = nextChar;
            break;
          }
          j++;
        }
        
        if (nextNonSpaceChar === ':' || nextNonSpaceChar === ',' || nextNonSpaceChar === '}' || nextNonSpaceChar === ']' || j === str.length) {
          inString = false;
          result += char;
        } else {
          result += "'";
        }
      } else {
        inString = true;
        result += char;
      }
      i++;
      continue;
    }
    
    if (inString && (char === '\n' || char === '\r')) {
      if (char === '\r' && str[i + 1] === '\n') {
        result += '\\n';
        i += 2;
      } else {
        result += '\\n';
        i++;
      }
      continue;
    }
    
    if (inString && char === '\\') {
      let nextChar = str[i + 1];
      if (nextChar === undefined) {
        result += '\\\\';
        i++;
        continue;
      }
      
      if (nextChar === '"' || nextChar === '\\') {
        result += '\\' + nextChar;
        i += 2;
        continue;
      }
      
      result += '\\\\';
      i++;
    } else {
      result += char;
      i++;
    }
  }
  return result;
}

async function run() {
  const lessonId = 'lt-c2-1';
  const lessonTitle = 'Luyện tập chung (Dấu hiệu chia hết & Số nguyên tố)';
  const prompt = getMathPrompt(lessonTitle, lessonId);
  
  const modelName = 'gemini-2.5-flash';
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;
  
  const requestBody = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ]
  };

  try {
    console.log("Đang gọi Gemini API...");
    const response = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    
    const data = await response.json();
    let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Không có textResponse từ Gemini!");
    }
    
    fs.writeFileSync('raw_response.txt', textResponse, 'utf8');
    console.log("Đã lưu phản hồi thô vào raw_response.txt (Độ dài:", textResponse.length, "ký tự)");
    
    const cleaned = cleanJsonString(textResponse);
    fs.writeFileSync('cleaned_response.json', cleaned, 'utf8');
    console.log("Đã lưu phản hồi sạch vào cleaned_response.json");
    
    try {
      const parsed = JSON.parse(cleaned);
      console.log("Chúc mừng! Parse JSON THÀNH CÔNG! Số lượng câu hỏi:", parsed.questions ? parsed.questions.length : (Array.isArray(parsed) ? parsed.length : "không rõ"));
    } catch (parseErr) {
      console.error("Parse JSON THẤT BẠI!");
      console.error(parseErr.message);
      
      // Tìm vị trí lỗi
      const match = parseErr.message.match(/position (\d+)/);
      if (match) {
        const pos = parseInt(match[1]);
        const start = Math.max(0, pos - 50);
        const end = Math.min(cleaned.length, pos + 50);
        console.error("--- Đoạn text lỗi xung quanh vị trí " + pos + " ---");
        console.error(cleaned.substring(start, pos) + ">>>[LỖI TẠI ĐÂY]<<<" + cleaned.substring(pos, end));
        console.error("-------------------------------------------------");
      }
    }
    
  } catch (err) {
    console.error("Lỗi thực thi:", err);
  }
}

run();
