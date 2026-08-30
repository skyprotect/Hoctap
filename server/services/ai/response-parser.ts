/**
 * RESPONSE PARSER & SANITIZER
 * Làm sạch chuỗi JSON sinh bởi AI và khử mã độc Prompt Injection trong lịch sử làm bài
 */

export function sanitizeHistory(historyArray: any[]): any[] {
    if (!Array.isArray(historyArray)) return [];
    return historyArray.map(item => {
        const newItem = { ...item };
        if (typeof newItem.studentAnswer === 'string') {
            newItem.studentAnswer = newItem.studentAnswer
                .replace(/ignore|bỏ qua|override|quên đi|hãy viết|trả lời|nhận xét|đánh giá|hãy khuyên|khuyên bố|chơi game|điện tử/gi, '*')
                .substring(0, 100);
        }
        return newItem;
    });
}

export function cleanJsonString(str: string): string {
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
