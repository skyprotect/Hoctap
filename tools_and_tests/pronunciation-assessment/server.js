const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Cấu hình CORS để cho phép frontend gọi API
app.use(cors());
app.use(express.json());

// Phục vụ các file tĩnh ở thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Đảm bảo thư mục temp_uploads tồn tại để lưu trữ file tạm thời
const tempDir = path.join(__dirname, 'temp_uploads');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Cấu hình Multer để lưu file tạm thời vào đĩa cứng trước khi convert
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'upload_' + Date.now() + path.extname(file.originalname || '.webm'));
    }
});
const upload = multer({ storage: storage });

/**
 * Hàm hỗ trợ convert audio bằng ffmpeg sang chuẩn Azure: WAV, 16kHz, 16-bit, Mono
 * @param {string} inputPath Đường dẫn file nguồn (WebM/Wav thô từ trình duyệt)
 * @param {string} outputPath Đường dẫn file đích (.wav chuẩn)
 * @returns {Promise<string>}
 */
function convertAudio(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('wav')
            .audioCodec('pcm_s16le')
            .audioChannels(1)
            .audioFrequency(16000)
            .on('end', () => {
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('Lỗi trong quá trình chuyển đổi audio bằng FFmpeg:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

/**
 * Gọi Azure Pronunciation Assessment API để đánh giá phát âm
 * @param {string} wavPath Đường dẫn file WAV đã chuẩn hóa
 * @param {string} referenceText Câu mẫu cần phát âm
 * @returns {Promise<Object>} Kết quả đánh giá dạng JSON
 */
function assessPronunciation(wavPath, referenceText) {
    return new Promise((resolve, reject) => {
        const subscriptionKey = process.env.AZURE_SPEECH_KEY;
        const region = process.env.AZURE_SPEECH_REGION;

        if (!subscriptionKey || !region) {
            return reject(new Error('Chưa cấu hình Azure Speech Service Key hoặc Region trong tệp .env!'));
        }

        // 1. Tạo SpeechConfig
        const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
        speechConfig.speechRecognitionLanguage = "en-US"; // Ngôn ngữ đánh giá

        // 2. Tạo AudioConfig từ file WAV
        const audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(wavPath));

        // 3. Cấu hình Pronunciation Assessment
        const pronConfig = new sdk.PronunciationAssessmentConfig(
            referenceText,
            sdk.PronunciationAssessmentGranularity.Phoneme, // Đánh giá chi tiết đến cấp độ âm vị (Phoneme)
            sdk.PronunciationAssessmentGradingSystem.HundredMark, // Thang điểm 100
            true // Kích hoạt phát hiện lỗi chèn/bỏ sót từ (EnableMiscue)
        );
        pronConfig.phonemeAlphabet = "IPA"; // Sử dụng hệ phiên âm quốc tế IPA (Rất quan trọng!)

        // 4. Tạo bộ nhận dạng SpeechRecognizer
        const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        pronConfig.applyTo(recognizer);

        // 5. Bắt đầu nhận dạng không đồng bộ (nhận dạng 1 lần cho file ghi âm ngắn)
        recognizer.recognizeOnceAsync(
            result => {
                try {
                    if (result.reason === sdk.ResultReason.RecognizedSpeech) {
                        const assessmentResult = sdk.PronunciationAssessmentResult.fromResult(result);
                        
                        // Parse chi tiết kết quả trả về cấu trúc sạch để gửi về client
                        const responsePayload = {
                            recognitionStatus: "Success",
                            text: result.text,
                            scores: {
                                accuracyScore: assessmentResult.accuracyScore, // Độ chính xác phát âm
                                pronunciationScore: assessmentResult.pronunciationScore, // Điểm phát âm chung
                                completenessScore: assessmentResult.completenessScore, // Độ đầy đủ của câu
                                fluencyScore: assessmentResult.fluencyScore // Độ trôi chảy
                            },
                            words: assessmentResult.words.map(w => ({
                                word: w.word,
                                accuracyScore: w.accuracyScore,
                                errorType: w.errorType, // None, Omission, Insertion, Mispronunciation
                                syllables: w.syllables ? w.syllables.map(s => ({
                                    syllable: s.syllable,
                                    accuracyScore: s.accuracyScore
                                })) : [],
                                phonemes: w.phonemes ? w.phonemes.map(p => ({
                                    phoneme: p.phoneme,
                                    accuracyScore: p.accuracyScore
                                })) : []
                            }))
                        };
                        resolve(responsePayload);
                    } else if (result.reason === sdk.ResultReason.NoMatch) {
                        resolve({
                            recognitionStatus: "NoMatch",
                            errorDetails: "Không nhận dạng được giọng nói. Vui lòng nói to, rõ ràng hơn."
                        });
                    } else if (result.reason === sdk.ResultReason.Canceled) {
                        const cancellation = sdk.CancellationDetails.fromResult(result);
                        
                        // Xử lý lỗi Rate Limit (HTTP 429) hoặc lỗi xác thực từ Azure
                        if (cancellation.errorCode === sdk.CancellationErrorCode.ConnectionFailure) {
                            reject(new Error(`Kết nối tới Azure Speech Service thất bại. Vui lòng kiểm tra cấu hình mạng hoặc Azure Key.`));
                        } else {
                            reject(new Error(`Yêu cầu bị hủy: ${cancellation.errorDetails} (Code: ${cancellation.errorCode})`));
                        }
                    }
                } catch (e) {
                    reject(e);
                } finally {
                    recognizer.close();
                }
            },
            err => {
                recognizer.close();
                reject(err);
            }
        );
    });
}

// POST API nhận audio, convert và đánh giá phát âm
app.post('/api/assess-pronunciation', upload.single('audio'), async (req, res) => {
    const file = req.file;
    const referenceText = req.body.referenceText;

    if (!file) {
        return res.status(400).json({ error: 'Không tìm thấy tệp tin âm thanh được tải lên.' });
    }
    if (!referenceText) {
        // Tự động xóa file thô vừa upload để giải phóng dung lượng khi gặp lỗi đầu vào
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({ error: 'Không tìm thấy câu mẫu (referenceText) để đối chiếu.' });
    }

    const inputPath = file.path;
    const outputPath = path.join(tempDir, 'processed_' + Date.now() + '.wav');

    try {
        console.log(`Đang nhận file: ${file.filename}, kích thước: ${file.size} bytes`);
        console.log(`Câu mẫu: "${referenceText}"`);

        // 1. Chuyển đổi file âm thanh sang định dạng chuẩn WAV
        await convertAudio(inputPath, outputPath);
        console.log(`Chuyển đổi âm thanh thành công sang: ${outputPath}`);

        // 2. Gọi Azure Speech SDK để thực hiện đánh giá phát âm
        const result = await assessPronunciation(outputPath, referenceText);
        
        // 3. Trả kết quả thành công về client
        return res.json(result);

    } catch (error) {
        console.error('Lỗi xử lý tại Backend:', error.message);
        
        // Trả lỗi thân thiện về Client
        let statusCode = 500;
        let errorMessage = error.message;
        
        // Phân loại lỗi thường gặp
        if (error.message.includes('429') || error.message.toLowerCase().includes('rate limit')) {
            statusCode = 429;
            errorMessage = 'Dịch vụ Azure đang quá tải (Rate Limit 429). Vui lòng thử lại sau vài giây!';
        } else if (error.message.includes('Azure Speech Service Key')) {
            statusCode = 400;
            errorMessage = 'Server chưa cấu hình Azure Key thành công. Vui lòng liên hệ quản trị viên.';
        }

        return res.status(statusCode).json({ error: errorMessage });

    } finally {
        // Đảm bảo dọn dẹp các tệp tạm thời sau khi xử lý xong (tránh rò rỉ bộ nhớ ổ cứng)
        try {
            if (fs.existsSync(inputPath)) {
                fs.unlinkSync(inputPath);
                console.log(`Đã dọn dẹp file tạm thô: ${inputPath}`);
            }
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
                console.log(`Đã dọn dẹp file WAV chuẩn hóa: ${outputPath}`);
            }
        } catch (cleanupErr) {
            console.error('Lỗi dọn dẹp tệp tin tạm thời:', cleanupErr.message);
        }
    }
});

// Chạy server
app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(` SERVER ĐÁNH GIÁ PHÁT ÂM TIẾNG ANH ĐANG CHẠY CỤC BỘ`);
    console.log(` Endpoint: http://localhost:${PORT}`);
    console.log(` Hãy đảm bảo bạn đã cài đặt FFmpeg trên Windows và set biến PATH.`);
    console.log(`================================================================`);
});
