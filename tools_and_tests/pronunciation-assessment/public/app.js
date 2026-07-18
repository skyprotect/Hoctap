/**
 * AI ENGLISH PRONUNCIATION LAB - FRONTEND LOGIC
 * Tương tác ghi âm qua MediaRecorder, hiển thị kết quả và chi tiết khẩu hình âm vị.
 */

// --- BẢN ĐỒ GỢI Ý CẤU ÂM (ARTICULATORY CUES DATABASE) TIẾNG VIỆT ---
const IPA_CUES = {
    // Phụ âm sát răng, răng-môi, lợi
    "θ": "Đặt đầu lưỡi nhẹ giữa răng cửa trên và dưới. Thổi hơi nhẹ qua khe giữa lưỡi và răng cửa trên (không rung dây thanh quản - vô thanh). Ví dụ: thin, think.",
    "ð": "Đặt đầu lưỡi nhẹ giữa răng cửa trên và dưới. Thổi hơi nhẹ qua khe giữa lưỡi và răng cửa trên đồng thời rung mạnh dây thanh quản (hữu thanh). Ví dụ: the, mother.",
    "ʃ": "Chu môi về phía trước, hai hàm răng khép hờ. Đẩy luồng hơi mạnh ra ngoài qua khe hở giữa lưỡi và vòm họng tạo ra tiếng xì lớn (vô thanh). Ví dụ: she, shoe.",
    "ʒ": "Chu môi về phía trước, hai hàm răng khép hờ. Đẩy hơi ra ngoài đồng thời làm rung dây thanh quản (hữu thanh). Ví dụ: measure, vision.",
    "s": "Hai hàm răng khép hờ, lưỡi đặt sát sau răng cửa trên. Đẩy luồng hơi nhẹ thoát ra ngoài qua khe răng tạo âm xì nhẹ (vô thanh). Ví dụ: see, sit.",
    "z": "Đặt lưỡi tương tự như âm /s/. Khép hờ răng, đẩy luồng hơi ra đồng thời làm rung mạnh dây thanh quản (hữu thanh). Ví dụ: zoo, buzz.",
    "f": "Đặt răng cửa hàm trên chạm nhẹ lên phần trong của môi dưới. Thổi luồng hơi thoát ra qua khe giữa môi và răng (vô thanh). Ví dụ: fat, coffee.",
    "v": "Đặt răng cửa hàm trên chạm nhẹ môi dưới tương tự âm /f/. Đẩy luồng hơi ra đồng thời làm rung mạnh dây thanh quản (hữu thanh). Ví dụ: very, love.",

    // Phụ âm tắc sát (Affricates)
    "tʃ": "Tròn môi, khép hờ răng. Đặt đầu lưỡi ở phần lợi phía sau răng cửa trên, bật mạnh đầu lưỡi xuống để đẩy luồng hơi ma sát ra thật nhanh (vô thanh). Ví dụ: chair, beach.",
    "dʒ": "Tròn môi, khép răng tương tự như âm /tʃ/. Đặt đầu lưỡi ở lợi trên, bật mạnh lưỡi ra ngoài để tạo luồng khí đồng thời rung dây thanh quản (hữu thanh). Ví dụ: jump, page.",

    // Phụ âm mũi và các âm khác
    "ŋ": "Hạ phần sau của lưỡi chạm vào vòm họng mềm (khẩu cái mềm) để chặn luồng khí ở miệng, ép toàn bộ hơi thoát ra qua đường mũi và làm rung dây thanh quản. Ví dụ: sing, ring.",
    "r": "Chu môi nhẹ, cong đầu lưỡi ngược vào trong hướng lên vòm họng (nhưng tuyệt đối không chạm vòm họng). Rung dây thanh quản khi phát âm. Ví dụ: red, run.",
    "l": "Đầu lưỡi chạm vào phần lợi ngay sau răng cửa trên. Để luồng hơi đi ra qua hai bên cạnh của lưỡi và rung dây thanh quản. Ví dụ: leg, call (ở cuối từ, lưỡi cong chạm lợi).",
    "h": "Mở rộng môi và miệng tự nhiên. Thở hơi nhẹ ra ngoài từ sâu trong cổ họng như đang thở dài (không rung thanh quản). Ví dụ: hat, home.",

    // Nguyên âm đơn ngắn (Short Vowels)
    "æ": "Hạ hàm dưới xuống thấp hết cỡ, mở rộng miệng sang hai bên. Đặt đầu lưỡi chạm vào mặt trong của răng cửa hàm dưới và phát âm âm /a/ ngắn, dứt khoát. Ví dụ: cat, map.",
    "ʌ": "Mở miệng tự nhiên theo chiều dọc ở mức vừa phải, lưỡi hơi nâng nhẹ ở phía sau và phát ra âm /á/ rất ngắn, dứt khoát. Ví dụ: cup, love.",
    "ɪ": "Mở miệng rộng sang hai bên như đang cười nhẹ. Nâng lưỡi lên cao một chút và phát âm âm /i/ rất ngắn, dứt khoát. Ví dụ: sit, pin.",
    "e": "Mở miệng rộng sang hai bên rộng hơn âm /ɪ/ một chút. Lưỡi hạ thấp và phát âm âm /e/ ngắn gọn. Ví dụ: bed, pen.",
    "ɒ": "Mở miệng rộng theo chiều dọc, hơi tròn môi nhẹ. Đẩy lưỡi về phía sau và phát âm âm /o/ thật ngắn. Ví dụ: hot, box.",
    "ʊ": "Tròn môi nhẹ (không chặt môi), đẩy lưỡi lùi về phía sau và phát âm âm /u/ rất ngắn, dứt khoát. Ví dụ: book, put.",
    "ə": "Mở miệng nhẹ tự nhiên. Thả lỏng toàn bộ lưỡi và cơ miệng, phát âm một âm nhẹ ngắn nửa chừng (âm schwa phổ biến nhất trong tiếng Anh). Ví dụ: about, banana.",

    // Nguyên âm đơn dài (Long Vowels)
    "iː": "Mở miệng rộng sang hai bên tương tự như đang cười tươi. Đẩy lưỡi lên cao và phát ra âm /i/ kéo dài trong khoang miệng. Ví dụ: see, beat.",
    "ɑː": "Mở rộng miệng hết cỡ theo chiều dọc như khi bác sĩ khám họng. Thả lỏng lưỡi hoàn toàn ở đáy miệng và phát âm âm /a/ kéo dài từ cổ họng. Ví dụ: father, car.",
    "ɔː": "Tròn môi hết cỡ để tạo hình chữ O nhỏ, đẩy lưỡi lùi về phía sau vòm họng và phát ra âm /o/ kéo dài trong cổ họng. Ví dụ: law, port.",
    "uː": "Tròn môi chặt hết cỡ và đưa môi về phía trước. Đẩy sâu lưỡi về phía sau và phát ra âm /u/ kéo dài trong khoang miệng. Ví dụ: blue, food.",
    "ɜː": "Miệng mở tự nhiên ở mức trung bình. Đặt lưỡi ở vị trí trung tâm của khoang miệng (không chạm hàm trên hay răng), hơi cong lưỡi lên một chút và phát âm kéo dài. Ví dụ: bird, work."
};

// --- ĐỐI TƯỢNG QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT) ---
const state = {
    selectedSentence: "",
    isRecording: false,
    mediaRecorder: null,
    audioChunks: [],
    audioBlob: null,
    audioUrl: null,
    azureResult: null,
    selectedWordData: null
};

// --- DOM ELEMENTS ---
const selectSentence = document.getElementById('sentence-select');
const customSentenceContainer = document.getElementById('custom-sentence-container');
const inputCustomSentence = document.getElementById('custom-sentence-input');
const targetSentenceText = document.getElementById('target-sentence-text');
const btnRecord = document.getElementById('btn-record');
const recordTip = document.getElementById('record-tip');
const voiceWave = document.getElementById('voice-wave');
const audioPlaybackContainer = document.getElementById('audio-playback-container');
const audioPlayback = document.getElementById('audio-playback');

const cardWelcome = document.getElementById('welcome-card');
const cardLoading = document.getElementById('loading-card');
const cardResults = document.getElementById('results-card');

const scorePronVal = document.getElementById('score-pron-val');
const scoreAccuracyVal = document.getElementById('score-accuracy-val');
const scoreFluencyVal = document.getElementById('score-fluency-val');
const scoreCompletenessVal = document.getElementById('score-completeness-val');

const fillAccuracy = document.getElementById('fill-accuracy');
const fillFluency = document.getElementById('fill-fluency');
const fillCompleteness = document.getElementById('fill-completeness');

const circlePron = document.getElementById('circle-pron');
const interactiveSentenceResult = document.getElementById('interactive-sentence-result');

const phonemeDetailContainer = document.getElementById('phoneme-detail-container');
const selectedWordTitle = document.getElementById('selected-word-title');
const phonemesFlexContainer = document.getElementById('phonemes-flex-container');
const btnClosePhoneme = document.getElementById('btn-close-phoneme');

const articulatoryCuePanel = document.getElementById('articulatory-cue-panel');
const cuePhonemeSymbol = document.getElementById('cue-phoneme-symbol');
const cueTextInstruction = document.getElementById('cue-text-instruction');

// --- KHỞI CHẠY (INITIALIZATION) ---
document.addEventListener("DOMContentLoaded", () => {
    state.selectedSentence = selectSentence.value;
    updateTargetDisplay();
    
    // Đăng ký sự kiện thay đổi câu mẫu
    selectSentence.addEventListener('change', handleSentenceChange);
    inputCustomSentence.addEventListener('input', () => {
        state.selectedSentence = inputCustomSentence.value;
        updateTargetDisplay();
    });

    // Sự kiện ghi âm
    btnRecord.addEventListener('click', toggleRecording);
    
    // Nút đóng bảng chi tiết âm vị
    btnClosePhoneme.addEventListener('click', () => {
        phonemeDetailContainer.classList.add('hidden');
        articulatoryCuePanel.classList.add('hidden');
    });
});

// --- LOGIC CHỌN CÂU HỎI ---
function handleSentenceChange() {
    const val = selectSentence.value;
    if (val === 'custom') {
        customSentenceContainer.classList.remove('hidden');
        state.selectedSentence = inputCustomSentence.value;
    } else {
        customSentenceContainer.classList.add('hidden');
        state.selectedSentence = val;
    }
    updateTargetDisplay();
    resetResultsView();
}

function updateTargetDisplay() {
    targetSentenceText.textContent = state.selectedSentence || "(Chưa có nội dung)";
}

function resetResultsView() {
    cardResults.classList.add('hidden');
    cardWelcome.classList.remove('hidden');
    phonemeDetailContainer.classList.add('hidden');
    articulatoryCuePanel.classList.add('hidden');
    audioPlaybackContainer.classList.add('hidden');
    if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
        state.audioUrl = null;
    }
}

// --- LOGIC GHI ÂM (MEDIA RECORDER) ---
async function toggleRecording() {
    if (state.isRecording) {
        stopRecording();
    } else {
        await startRecording();
    }
}

async function startRecording() {
    state.audioChunks = [];
    
    try {
        // Yêu cầu quyền truy cập micro trong trình duyệt Chrome
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        state.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        
        state.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                state.audioChunks.push(event.data);
            }
        };

        state.mediaRecorder.onstop = async () => {
            // Chuyển đổi các chunk âm thanh thành Blob WebM đơn lẻ
            state.audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
            state.audioUrl = URL.createObjectURL(state.audioBlob);
            
            // Cập nhật thẻ audio phát lại
            audioPlayback.src = state.audioUrl;
            audioPlaybackContainer.classList.remove('hidden');
            
            // Tự động dừng luồng micro để giải phóng thiết bị
            stream.getTracks().forEach(track => track.stop());
            
            // Gửi tệp âm thanh lên backend chấm điểm
            await sendAudioForAssessment();
        };

        state.mediaRecorder.start();
        
        // Cập nhật giao diện trạng thái đang ghi âm
        state.isRecording = true;
        btnRecord.classList.add('recording');
        btnRecord.innerHTML = '<i class="fa-solid fa-square"></i>';
        recordTip.textContent = "Bấm để dừng ghi và nộp bài";
        voiceWave.classList.add('active');
        
        // Ẩn các khu vực hiển thị cũ
        resetResultsView();

    } catch (err) {
        console.error("Không thể truy cập Microphone:", err);
        alert("Lỗi: Không thể truy cập Micro của bạn. Hãy đảm bảo bạn đã cấp quyền sử dụng Micro trong trình duyệt Google Chrome.");
    }
}

function stopRecording() {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
        state.mediaRecorder.stop();
    }
    
    // Cập nhật giao diện
    state.isRecording = false;
    btnRecord.classList.remove('recording');
    btnRecord.innerHTML = '<i class="fa-solid fa-microphone"></i>';
    recordTip.textContent = "Bấm nút để bắt đầu ghi âm";
    voiceWave.classList.remove('active');
}

// --- LOGIC GIAO TIẾP VỚI API BACKEND ---
async function sendAudioForAssessment() {
    // Hiển thị màn hình Loading
    cardWelcome.classList.add('hidden');
    cardResults.classList.add('hidden');
    cardLoading.classList.remove('hidden');

    const formData = new FormData();
    formData.append('audio', state.audioBlob, 'recording.webm');
    formData.append('referenceText', state.selectedSentence);

    try {
        const response = await fetch('/api/assess-pronunciation', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `Lỗi HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Dữ liệu đánh giá từ Azure:", data);
        
        if (data.recognitionStatus === "NoMatch") {
            throw new Error(data.errorDetails || "Không nhận diện được giọng đọc. Vui lòng thử lại!");
        }

        state.azureResult = data;
        renderResults();

    } catch (err) {
        console.error("Lỗi gửi request chấm điểm:", err);
        alert(`Lỗi đánh giá phát âm: ${err.message}`);
        
        // Quay về màn hình chào mừng nếu lỗi
        cardLoading.classList.add('hidden');
        cardWelcome.classList.remove('hidden');
    }
}

// --- LOGIC RENDER KẾT QUẢ ---
function renderResults() {
    cardLoading.classList.add('hidden');
    cardResults.classList.remove('hidden');

    const { scores, words } = state.azureResult;

    // 1. Cập nhật các điểm số số liệu
    const pronScore = Math.round(scores.pronunciationScore || 0);
    scorePronVal.textContent = pronScore;
    scoreAccuracyVal.textContent = `${Math.round(scores.accuracyScore || 0)}%`;
    scoreFluencyVal.textContent = `${Math.round(scores.fluencyScore || 0)}%`;
    scoreCompletenessVal.textContent = `${Math.round(scores.completenessScore || 0)}%`;

    // 2. Cập nhật các thanh tiến trình
    fillAccuracy.style.width = `${scores.accuracyScore || 0}%`;
    fillFluency.style.width = `${scores.fluencyScore || 0}%`;
    fillCompleteness.style.width = `${scores.completenessScore || 0}%`;

    // 3. Đổi màu vòng tròn điểm chung theo phân loại
    circlePron.className = "score-circle"; // reset class
    if (pronScore >= 80) {
        circlePron.classList.add('excellent');
    } else if (pronScore >= 60) {
        circlePron.classList.add('average');
    } else {
        circlePron.classList.add('poor');
    }

    // 4. Render câu tương tác
    interactiveSentenceResult.innerHTML = '';
    
    words.forEach((w, index) => {
        const span = document.createElement('span');
        span.textContent = w.word;
        span.className = 'interactive-word';
        span.dataset.index = index;

        // Phân loại màu sắc của từ dựa trên AccuracyScore và ErrorType
        const score = w.accuracyScore || 0;
        
        if (w.errorType === "Omission") {
            span.classList.add('omission-word');
            span.title = "Bị bỏ sót không đọc";
        } else if (w.errorType === "Insertion") {
            span.classList.add('insertion-word');
            span.title = "Từ bị tự chèn thêm";
        } else {
            if (score >= 80) {
                span.classList.add('excellent-word');
            } else if (score >= 60) {
                span.classList.add('average-word');
            } else {
                span.classList.add('poor-word');
            }
        }

        // Sự kiện click để xem chi tiết âm vị
        span.addEventListener('click', () => handleWordClick(w, span));

        interactiveSentenceResult.appendChild(span);
    });
}

// --- LOGIC CLICK TỪNG TỪ ĐỂ XEM PHÂN TÍCH ÂM VỊ ---
function handleWordClick(wordData, element) {
    // Bỏ active của các từ khác
    document.querySelectorAll('.interactive-word').forEach(w => {
        w.style.boxShadow = 'none';
    });
    
    // Highlight từ đang chọn
    element.style.boxShadow = '0 0 0 2.5px var(--primary)';

    state.selectedWordData = wordData;
    selectedWordTitle.textContent = wordData.word;
    
    // Hiển thị panel chi tiết âm vị
    phonemeDetailContainer.classList.remove('hidden');
    articulatoryCuePanel.classList.add('hidden'); // ẩn hướng dẫn khẩu hình cho đến khi bấm âm vị cụ thể
    
    phonemesFlexContainer.innerHTML = '';
    
    // Nếu từ bị bỏ sót (Omission), không có phân tích âm vị cụ thể
    if (wordData.errorType === "Omission") {
        phonemesFlexContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.88rem; font-style: italic;">Từ này bị bỏ sót hoàn toàn trong file ghi âm, không có thông số âm vị.</p>';
        return;
    }
    
    const phonemes = wordData.phonemes || [];
    if (phonemes.length === 0) {
        phonemesFlexContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.88rem; font-style: italic;">Không có thông tin phân tích âm vị cho từ này.</p>';
        return;
    }

    phonemes.forEach((p, idx) => {
        const badge = document.createElement('div');
        // Azure trả về âm vị thường có định dạng chữ cái, ví dụ "θ", ta làm sạch dấu gạch/kí tự thừa nếu có
        const cleanPhoneme = p.phoneme;
        badge.className = 'phoneme-badge';
        badge.innerHTML = `
            <span>/${cleanPhoneme}/</span>
            <span class="phoneme-score">${Math.round(p.accuracyScore)}</span>
        `;

        // Tô màu badge âm vị
        const phScore = p.accuracyScore || 0;
        if (phScore >= 80) {
            badge.classList.add('excellent-ph');
        } else if (phScore >= 60) {
            badge.classList.add('average-ph');
        } else {
            badge.classList.add('poor-ph');
        }

        // Click để hiển thị hướng dẫn khẩu hình miệng
        badge.addEventListener('click', () => handlePhonemeClick(cleanPhoneme, badge));

        phonemesFlexContainer.appendChild(badge);
    });
}

// --- LOGIC CLICK ÂM VỊ ĐỂ XEM HƯỚNG DẪN KHẨU HÌNH ---
function handlePhonemeClick(phoneme, badgeElement) {
    // Bỏ trạng thái active của toàn bộ badge âm vị trong từ
    document.querySelectorAll('.phoneme-badge').forEach(b => {
        b.classList.remove('active');
    });
    
    // Kích hoạt trạng thái active cho badge hiện tại
    badgeElement.classList.add('active');

    // Mở bảng hướng dẫn khẩu hình miệng
    articulatoryCuePanel.classList.remove('hidden');
    cuePhonemeSymbol.textContent = `/${phoneme}/`;

    // Tìm kiếm hướng dẫn cấu âm trong cơ sở dữ liệu
    // Xử lý loại bỏ dấu thanh hoặc các kí tự phụ nếu Azure trả về dạng biến thể
    const cleanKey = phoneme.replace(/[\u0300-\u036f]/g, "").trim();
    const instruction = IPA_CUES[cleanKey] || `Hướng dẫn phát âm cho âm /${phoneme}/ đang được cập nhật. Hãy chú ý đặt lưỡi và thổi luồng hơi chính xác theo chuẩn bản xứ.`;
    
    cueTextInstruction.textContent = instruction;
    
    // Cuộn mượt màn hình tới khu vực hướng dẫn khẩu hình để tăng trải nghiệm người dùng
    articulatoryCuePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
