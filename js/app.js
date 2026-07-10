function sanitizeHtml(html) {
    if (typeof html !== 'string') return html;
    return html
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
        .replace(/\son[a-z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '')
        .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, '');
}

// Đối tượng quản lý ứng dụng chính
const app = {
    // Trạng thái mặc định của người dùng
    config: {
        studentName: "",
        parentName: "",
        currentClass: "4",
        parentPin: "123456"
    },
    state: {
        xp: 0,
        streak: 0,
        lastActiveDate: null,
        scores: {},          // Lưu điểm cao nhất của mỗi bài { lessonId: score }
        badges: [],          // Danh sách huy hiệu đã đạt được
        history: [],         // Lịch sử trả lời câu hỏi phục vụ Dashboard phụ huynh
        distractions: 0,     // Số lần xao nhãng rời tab
        customVideos: {},     // Lưu trữ ID video tùy chỉnh do phụ huynh gán { lessonId: youtubeId }
        parentPin: "123456", // Mã PIN mặc định
        examSessions: [],    // Lưu trữ lịch sử các lượt làm bài chi tiết
        completedSubtopics: [], // Các dạng bài đã hoàn thành (score >= 80)
        subtopicScores: {},   // Lưu điểm cao nhất của mỗi dạng bài { subtopicId: score }
        completedLessonTheory: [] // Lưu các bài học đã hoàn thành lý thuyết giáo khoa
    },

    currentLesson: null,
    currentSemester: 1,      // Học kỳ hiện tại (mặc định là 1)
    isDarkMode: true,
    pendingBadges: [],       // Hàng đợi huy hiệu chưa hiển thị khi đang ở màn hình Splash

    // Huy hiệu có sẵn trong hệ thống (15 huy hiệu chuẩn tâm lý học & gamification)
    systemBadges: [
        { id: "nhap-mon", name: "Nhập Môn Toán 6", desc: "Hoàn thành bài học đầu tiên đạt từ 80%", icon: "🚀" },
        { id: "khoi-dau-vung-vang", name: "Khởi Đầu Vững Vàng", desc: "Đạt điểm tối đa (100%) một bài học bất kỳ", icon: "🌟" },
        { id: "streak-3", name: "Bền Bỉ 3 Ngày", desc: "Đạt chuỗi học tập liên tục 3 ngày", icon: "🔥" },
        { id: "streak-7", name: "Siêu Sao Chuyên Cần", desc: "Đạt chuỗi học tập liên tục 7 ngày", icon: "⚡" },
        { id: "streak-15", name: "Kỷ Lục Gia Học Tập", desc: "Đạt chuỗi học tập liên tục 15 ngày", icon: "👑" },
        
        { id: "bac-thay-so-tu-nhien", name: "Bậc Thầy Số Tự Nhiên", desc: "Vượt qua bài kiểm tra cuối Chương I (>= 80%)", icon: "🔢" },
        { id: "chien-binh-chia-het", name: "Chiến Binh Chia Hết", desc: "Vượt qua bài kiểm tra cuối Chương II (>= 80%)", icon: "🛡️" },
        { id: "ky-si-so-nguyen", name: "Kỵ Sĩ Số Nguyên", desc: "Vượt qua bài kiểm tra cuối Chương III (>= 80%)", icon: "❄️" },
        { id: "phu-thuy-hinh-hoc", name: "Phù Thủy Hình Học", desc: "Vượt qua bài kiểm tra cuối Chương IV (>= 80%)", icon: "📐" },
        { id: "bac-thay-doi-xung", name: "Bậc Thầy Đối Xứng", desc: "Vượt qua bài kiểm tra cuối Chương V (>= 80%)", icon: "🌀" },
        
        { id: "bac-thay-phan-so", name: "Bậc Thầy Phân Số", desc: "Vượt qua bài kiểm tra cuối Chương VI (>= 80%)", icon: "🍰" },
        { id: "chien-binh-thap-phan", name: "Chiến Binh Thập Phân", desc: "Vượt qua bài kiểm tra cuối Chương VII (>= 80%)", icon: "🎯" },
        { id: "phu-thuy-hinh-co-ban", name: "Phù Thủy Hình Học Cơ Bản", desc: "Vượt qua bài kiểm tra cuối Chương VIII (>= 80%)", icon: "📐" },
        { id: "bac-thay-xac-suat", name: "Bậc Thầy Xác Suất", desc: "Vượt qua bài kiểm tra cuối Chương IX (>= 80%)", icon: "🎲" },
        
        { id: "tia-chop", name: "Thần Tốc", desc: "Đạt điểm 100% bài luyện tập dưới 45 giây", icon: "⚡" },
        { id: "kien-tri", name: "Kiên Trì Bứt Phá", desc: "Cải thiện bài tập đạt dưới 70% lên giỏi (>= 80%)", icon: "🌱" },
        { id: "ky-luat-thep", name: "Kỷ Luật Thép", desc: "Hoàn thành bài kiểm tra chương mà không rời tab lần nào", icon: "🎯" },
        { id: "sieu-tri-tue", name: "Siêu Trí Tuệ", desc: "Tích lũy đạt mốc 200 XP", icon: "🧠" },
        { id: "huyen-thoai-toan-hoc", name: "Huyền Thoại Toán Học", desc: "Tích lũy đạt mốc 500 XP", icon: "🏆" }
    ],

    // Bộ âm thanh tương tác sử dụng các file âm thanh chuyên nghiệp (.mp3)
    audio: {
        isUnlocked: false,
        tempMuteClick: false,
        sounds: {},
        ctx: null,
        initContext: function() {
            if (this.ctx) return;
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            } catch (e) {
                console.warn("Không khởi tạo được AudioContext:", e);
            }
        },
        init: function() {
            this.initContext();
            if (Object.keys(this.sounds).length > 0) return;
            try {
                this.sounds = {
                    startup: new Audio('/sounds/startup.mp3'),
                    click: new Audio('/sounds/click.mp3'),
                    tick: new Audio('/sounds/click.mp3'),
                    correct: new Audio('/sounds/correct.mp3'),
                    wrong: new Audio('/sounds/wrong.mp3'),
                    victory: new Audio('/sounds/clapping.mp3'),
                    defeat: new Audio('/sounds/failed.mp3'),
                    lose: new Audio('/sounds/lose.mp3'),
                    sword_hit: new Audio('/sounds/sword hit.mp3'),
                    magic_spell: new Audio('/sounds/magic spell.mp3'),
                    background: new Audio('/sounds/background.mp3'),
                    monter: new Audio('/sounds/monter.mp3')
                };

                // Thiết lập âm lượng lớn, rõ nét và chuyên nghiệp
                this.sounds.startup.volume = 0.95;
                this.sounds.click.volume = 0.9;
                this.sounds.tick.volume = 0.8;
                this.sounds.correct.volume = 1.0;
                this.sounds.wrong.volume = 1.0;
                this.sounds.victory.volume = 0.95;
                this.sounds.defeat.volume = 0.95;
                this.sounds.lose.volume = 0.95;
                this.sounds.sword_hit.volume = 0.85;
                this.sounds.magic_spell.volume = 0.85;
                this.sounds.monter.volume = 0.85;
                this.sounds.background.volume = 0.22; // Âm lượng nhạc nền vừa phải để nghe rõ âm thanh khác

                // Nạp trước dữ liệu âm thanh
                for (let key in this.sounds) {
                    this.sounds[key].load();
                }
            } catch (e) {
                console.error("Lỗi khởi tạo âm thanh:", e);
            }
        },
        playSound: function(name) {
            this.init();
            const soundFile = this.sounds[name];
            if (!soundFile) return;
            try {
                // Đặt lại thời gian phát về 0 để âm thanh có thể kích hoạt lại lập tức (không bị trễ do cloneNode)
                soundFile.currentTime = 0;
                const playPromise = soundFile.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log(`Không thể phát âm thanh ${name}:`, error);
                    });
                }
            } catch (e) {
                console.log(`Lỗi khi phát âm thanh ${name}:`, e);
            }
        },
        playStartup: function() {
            this.playSound('startup');
        },
        playClick: function() {
            this.playSound('click');
        },
        playTick: function() {
            this.playSound('tick');
        },
        playCorrect: function() {
            this.playSound('correct');
        },
        playWrong: function() {
            this.playSound('wrong');
        },
        playVictory: function() {
            this.playSound('victory');
        },
        playDefeat: function() {
            this.playSound('defeat');
        },
        playLose: function() {
            this.playSound('lose');
        },
        playBadge: function() {
            this.playSound('victory');
        },
        playSwordHit: function() {
            this.playSound('sword_hit');
        },
        playMagicSpell: function() {
            this.playSound('magic_spell');
        },
        playMonter: function() {
            this.playSound('monter');
        },
        playBackground: function() {
            this.init();
            if (this.sounds.background) {
                this.sounds.background.loop = true;
                this.sounds.background.volume = 0.22; // Đảm bảo âm lượng nhạc nền vừa phải
                const playPromise = this.sounds.background.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Không thể phát nhạc nền:", error);
                    });
                }
            }
        },
        stopBackground: function() {
            if (this.sounds.background) {
                try {
                    this.sounds.background.pause();
                    this.sounds.background.currentTime = 0;
                } catch (e) {
                    console.log("Lỗi dừng nhạc nền:", e);
                }
            }
        },
        playTdSound: function(type) {
            if (!this.isUnlocked) return;
            try {
                this.initContext();
                const ctx = this.ctx;
                if (!ctx) return;
                
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                
                if (type === 'archer') {
                    // Tiếng vút tên bay nhẹ nhàng
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(600, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
                    
                    gain.gain.setValueAtTime(0.2, ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.12);
                    
                } else if (type === 'bomb') {
                    // Tiếng nổ pháo trầm (bùm bùm) khi đạn pháo nổ
                    const bufferSize = ctx.sampleRate * 0.35;
                    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    
                    const noiseNode = ctx.createBufferSource();
                    noiseNode.buffer = buffer;
                    
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(300, ctx.currentTime);
                    filter.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.35);
                    
                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0.5, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                    
                    noiseNode.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);
                    
                    noiseNode.start();
                    noiseNode.stop(ctx.currentTime + 0.35);
                    
                } else if (type === 'ice') {
                    // Tiếng xì xì đóng băng lạnh giá sắc sảo
                    const osc1 = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(1000, ctx.currentTime);
                    osc1.frequency.linearRampToValueAtTime(250, ctx.currentTime + 0.18);
                    
                    osc2.type = 'triangle';
                    osc2.frequency.setValueAtTime(1300, ctx.currentTime);
                    osc2.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.18);
                    
                    gain.gain.setValueAtTime(0.12, ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
                    
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(ctx.destination);
                    
                    osc1.start();
                    osc2.start();
                    osc1.stop(ctx.currentTime + 0.18);
                    osc2.stop(ctx.currentTime + 0.18);
                    
                } else if (type === 'sword_slash') {
                    // Tiếng kiếm chém leng keng (kim loại va chạm sắc sảo)
                    const osc1 = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(1800, ctx.currentTime);
                    osc1.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + 0.03);
                    osc1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);
                    
                    osc2.type = 'triangle';
                    osc2.frequency.setValueAtTime(1400, ctx.currentTime);
                    osc2.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.04);
                    osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
                    
                    gain.gain.setValueAtTime(0.25, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
                    
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(ctx.destination);
                    
                    osc1.start();
                    osc2.start();
                    osc1.stop(ctx.currentTime + 0.16);
                    osc2.stop(ctx.currentTime + 0.16);
                } else if (type === 'coin') {
                    // Tiếng keng keng đồng xu vàng lảnh lót
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(988, ctx.currentTime); // Nốt B5
                    osc.frequency.setValueAtTime(1318, ctx.currentTime + 0.08); // Nốt E6
                    
                    gain.gain.setValueAtTime(0.18, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.35);
                    
                } else if (type === 'thunder') {
                    // Tiếng sét đánh vang dội đầy uy lực (nhiễu trắng + sóng sawtooth trầm)
                    const bufferSize = ctx.sampleRate * 0.45;
                    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    const noiseNode = ctx.createBufferSource();
                    noiseNode.buffer = buffer;

                    const osc = ctx.createOscillator();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(160, ctx.currentTime);
                    osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.45);

                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(400, ctx.currentTime);

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0.35, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

                    noiseNode.connect(filter);
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);

                    noiseNode.start();
                    osc.start();
                    noiseNode.stop(ctx.currentTime + 0.45);
                    osc.stop(ctx.currentTime + 0.45);
                }
            } catch (e) {
                console.warn("Lỗi phát âm thanh TD:", e);
            }
        }
    },

    // Tạo hiệu ứng pháo hoa giấy Confetti chúc mừng
    confetti: {
        canvas: null,
        ctx: null,
        particles: [],
        colors: ["#FF7F50", "#3E8EED", "#2ECC71", "#F1C40F", "#FF4D4D", "#9B59B6", "#1ABC9C"],
        animationFrame: null,
        active: false,

        init: function() {
            this.canvas = document.getElementById("confetti-canvas");
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext("2d");
            this.resize();
            // Lắng nghe sự kiện để cập nhật size canvas
            if (!this.hasResizeHandler) {
                window.addEventListener("resize", () => this.resize());
                this.hasResizeHandler = true;
            }
        },

        resize: function() {
            if (this.canvas) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
        },

        start: function() {
            this.init();
            if (!this.canvas || !this.ctx) return;
            this.particles = [];
            for (let i = 0; i < 150; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height - this.canvas.height,
                    r: Math.random() * 6 + 4,
                    d: Math.random() * this.canvas.height,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    tilt: Math.random() * 10 - 5,
                    tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                    tiltAngle: 0
                });
            }
            this.active = true;
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
            this.loop();
            
            // Tự động dừng sau 4 giây
            setTimeout(() => {
                this.stop();
            }, 4000);
        },

        loop: function() {
            if (!this.active) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let finished = true;
            this.particles.forEach(p => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle);
                p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 15;

                this.ctx.beginPath();
                this.ctx.lineWidth = p.r;
                this.ctx.strokeStyle = p.color;
                this.ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                this.ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                this.ctx.stroke();

                if (p.y < this.canvas.height) {
                    finished = false;
                }
            });

            if (!finished) {
                this.animationFrame = requestAnimationFrame(() => this.loop());
            } else {
                this.stop();
            }
        },

        stop: function() {
            this.active = false;
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        }
    },

    // Khởi tạo và cập nhật đồng hồ kỹ thuật số lớn trên màn hình chào mừng
    initSplashClock: function() {
        const timeEl = document.getElementById("splash-clock-time");
        const dateEl = document.getElementById("splash-clock-date");
        if (!timeEl || !dateEl) return;

        const updateClock = () => {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();

            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            timeEl.innerText = `${hours}:${minutes}:${seconds}`;

            const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
            const dayName = days[now.getDay()];
            const day = now.getDate();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            dateEl.innerText = `${dayName}, ngày ${day} tháng ${month} năm ${year}`;
        };

        updateClock();
        setInterval(updateClock, 1000);
    },

    currentSplashQuoteIndex: 0,

    // Quản lý phát âm thanh nhắc nhở tiếng Việt ngẫu nhiên khi ở màn hình chào mừng
    initSplashGreeting: function() {
        const sentencesCount = 14;
        let isMuted = localStorage.getItem("splash_greeting_muted") === "true";
        let greetingInterval = null;
        let greetingAudios = [];
        let currentlyPlaying = null;
        let hasPlayedOnce = false; // Theo dõi xem âm thanh đã được phát thành công lần nào chưa

        // Tải nhạc nền dạo đầu /sounds/nen.mp3
        const bgNen = new Audio('/sounds/nen.mp3');
        bgNen.volume = 0;
        bgNen.onerror = (err) => {
            console.warn(`Nhạc nền /sounds/nen.mp3 chưa được ${this.config.parentName || 'phụ huynh'} bỏ vào thư mục sounds. Hệ thống sẽ phát trực tiếp châm ngôn.`, err.message);
        };

        // Tải trước các file âm thanh châm ngôn
        for (let i = 1; i <= sentencesCount; i++) {
            const audio = new Audio(`/sounds/quotes/quote_${i}.mp3`);
            audio.volume = 0.95;
            audio.onerror = (err) => {
                console.error(`Lỗi tải file âm thanh /sounds/quotes/quote_${i}.mp3. File có thể bị thiếu hoặc lỗi format.`, err);
            };
            greetingAudios.push(audio);
        }

        const muteBtn = document.getElementById("splash-mute-btn");
        const autoplayHint = document.getElementById("splash-autoplay-hint");

        // Quản lý hiệu ứng Fade âm lượng mượt mà sử dụng requestAnimationFrame
        let fadeRequestFrame = null;
        const fadeAudio = (audio, targetVolume, duration, onComplete) => {
            if (!audio) return;
            if (fadeRequestFrame) cancelAnimationFrame(fadeRequestFrame);
            
            const startVolume = audio.volume;
            const volumeDiff = targetVolume - startVolume;
            const startTime = performance.now();

            const updateVolume = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                try {
                    audio.volume = startVolume + volumeDiff * progress;
                } catch (e) {}

                if (progress < 1) {
                    fadeRequestFrame = requestAnimationFrame(updateVolume);
                } else {
                    try {
                        audio.volume = targetVolume;
                    } catch (e) {}
                    if (onComplete) onComplete();
                }
            };
            
            fadeRequestFrame = requestAnimationFrame(updateVolume);
        };

        // Quản lý danh sách timeout để xóa sạch an toàn khi chuyển trang hoặc tắt tiếng
        let activeTimeouts = [];
        const clearActiveTimeouts = () => {
            activeTimeouts.forEach(t => clearTimeout(t));
            activeTimeouts = [];
        };
        const safeTimeout = (fn, delay) => {
            const t = setTimeout(fn, delay);
            activeTimeouts.push(t);
            return t;
        };

        const updateMuteUi = () => {
            if (!muteBtn) return;
            if (isMuted) {
                muteBtn.classList.add("muted");
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            } else {
                muteBtn.classList.remove("muted");
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
        };
        updateMuteUi();

        const toggleMute = (e) => {
            if (e) e.stopPropagation();
            isMuted = !isMuted;
            localStorage.setItem("splash_greeting_muted", isMuted ? "true" : "false");
            updateMuteUi();
            
            if (isMuted) {
                clearActiveTimeouts();
                if (fadeRequestFrame) cancelAnimationFrame(fadeRequestFrame);
                if (currentlyPlaying) {
                    try {
                        currentlyPlaying.pause();
                        currentlyPlaying.currentTime = 0;
                    } catch (err) {
                        console.warn("Không thể dừng hoặc reset currentlyPlaying khi tắt tiếng:", err);
                    }
                }
                try {
                    bgNen.pause();
                    bgNen.currentTime = 0;
                } catch (err) {}
            } else if (document.getElementById("splash-screen").style.display !== "none") {
                playCurrentSplashQuote();
            }
        };

        if (muteBtn) {
            muteBtn.onclick = toggleMute;
        }

        const playCurrentSplashQuote = () => {
            const splashScreen = document.getElementById("splash-screen");
            if (!splashScreen || splashScreen.style.display === "none") return;
            if (isMuted) return;

            // Dừng mọi âm thanh cũ và dọn dẹp timeout cũ
            if (currentlyPlaying) {
                try {
                    currentlyPlaying.pause();
                    currentlyPlaying.currentTime = 0;
                } catch (err) {
                    console.warn("Không thể dừng hoặc reset currentlyPlaying khi chuyển câu châm ngôn:", err);
                }
            }
            try {
                bgNen.pause();
                bgNen.currentTime = 0;
            } catch (err) {}
            if (fadeRequestFrame) cancelAnimationFrame(fadeRequestFrame);
            clearActiveTimeouts();

            // Phát câu thoại khớp với chỉ số câu châm ngôn đang hiển thị
            const audioIdx = this.currentSplashQuoteIndex;
            currentlyPlaying = greetingAudios[audioIdx];
            
            if (!currentlyPlaying) return;

            // Bước 1: Khởi động phát nhạc nền dạo đầu (nen.mp3) từ volume 0 lên 0.22 trong 2.5 giây
            let hasBgMusic = true;
            try {
                bgNen.volume = 0;
                bgNen.currentTime = 0;
                const playNenPromise = bgNen.play();
                if (playNenPromise !== undefined) {
                    playNenPromise.catch(err => {
                        hasBgMusic = false;
                        console.log("Autoplay nhạc nền bị trình duyệt chặn hoặc file nen.mp3 chưa sẵn sàng:", err.message);
                    });
                }
                if (hasBgMusic) {
                    fadeAudio(bgNen, 0.22, 2500);
                }
            } catch (err) {
                hasBgMusic = false;
                console.warn("Lỗi khởi phát nhạc nền:", err);
            }

            // Bước 2: Chờ kết thúc 2.5 giây nhạc dạo, bắt đầu phát câu châm ngôn AI & giảm nhỏ nhạc đệm xuống 0.11
            const delayBeforeQuote = hasBgMusic ? 2500 : 0;
            safeTimeout(() => {
                try {
                    currentlyPlaying.currentTime = 0;
                    const playPromise = currentlyPlaying.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            hasPlayedOnce = true; 
                            if (autoplayHint) autoplayHint.classList.add("hidden");
                            
                            // Giảm nhỏ nhạc nền xuống 0.11 làm nhạc đệm ngầm lúc phát tiếng nói
                            if (hasBgMusic) {
                                fadeAudio(bgNen, 0.11, 1000);
                            }
                        }).catch(err => {
                            console.log("Autoplay châm ngôn bị trình duyệt chặn, hiển thị gợi ý click:", err.message);
                            if (autoplayHint) autoplayHint.classList.remove("hidden");
                            
                            // Nếu châm ngôn bị chặn phát, tắt nhạc nền đi ngay
                            if (hasBgMusic) {
                                fadeAudio(bgNen, 0, 1000, () => {
                                    bgNen.pause();
                                    bgNen.currentTime = 0;
                                });
                            }
                        });
                    }
                } catch (err) {
                    console.warn("Không thể phát âm thanh châm ngôn:", err);
                }

                // Bước 3 & 4: Khi tiếng nói châm ngôn đọc xong, giữ nhạc đệm chạy thêm 3 giây rồi giảm dần (fade-out) về 0 trong 2.5 giây và dừng
                currentlyPlaying.onended = () => {
                    // Xác định file âm thanh bổ sung tương ứng với câu châm ngôn
                    let audioFile = null;
                    if (audioIdx === 0) {
                        audioFile = Math.random() < 0.5 ? '/sounds/quotes/audio_1.mp3' : '/sounds/quotes/audio_2.mp3';
                    } else if (audioIdx === 1) {
                        audioFile = '/sounds/quotes/audio_3.mp3';
                    }

                    if (audioFile) {
                        const audio1 = new Audio(audioFile);
                        audio1.volume = 0.95;
                        
                        audio1.onerror = (err) => {
                            console.warn("Lỗi load file bổ sung " + audioFile + " (chưa được cấu hình). Fallback tắt nhạc nền.", err.message);
                            // Fallback tắt nhạc nền thông thường
                            safeTimeout(() => {
                                if (hasBgMusic) {
                                    fadeAudio(bgNen, 0, 2500, () => {
                                        bgNen.pause();
                                        bgNen.currentTime = 0;
                                    });
                                }
                            }, 3000);
                        };

                        // Lưu tham chiếu để có thể stop khẩn cấp (nếu click mute/start)
                        currentlyPlaying = audio1;

                        try {
                            const playAudio1Promise = audio1.play();
                            if (playAudio1Promise !== undefined) {
                                playAudio1Promise.then(() => {
                                    // Nhạc nền vẫn duy trì ở mức đệm nhỏ
                                    if (hasBgMusic) {
                                        fadeAudio(bgNen, 0.11, 500);
                                    }
                                }).catch(err => {
                                    console.warn("Autoplay " + audioFile + " bị chặn:", err.message);
                                    // Fallback tắt nhạc nền
                                    safeTimeout(() => {
                                        if (hasBgMusic) {
                                            fadeAudio(bgNen, 0, 2500, () => {
                                                bgNen.pause();
                                                bgNen.currentTime = 0;
                                            });
                                        }
                                    }, 3000);
                                });
                            }
                        } catch (err) {
                            console.warn("Lỗi phát " + audioFile + ":", err);
                        }

                        audio1.onended = () => {
                            safeTimeout(() => {
                                if (hasBgMusic) {
                                    fadeAudio(bgNen, 0, 2500, () => {
                                        bgNen.pause();
                                        bgNen.currentTime = 0;
                                    });
                                }
                            }, 3000);
                        };
                    } else {
                        // Các câu châm ngôn khác: tắt nhạc nền bình thường
                        safeTimeout(() => {
                            if (hasBgMusic) {
                                fadeAudio(bgNen, 0, 2500, () => {
                                    bgNen.pause();
                                    bgNen.currentTime = 0;
                                });
                            }
                        }, 3000);
                    }
                };

                currentlyPlaying.onerror = () => {
                    // Nếu lỗi file châm ngôn, tắt nhạc nền ngay lập tức
                    if (hasBgMusic) {
                        fadeAudio(bgNen, 0, 1000, () => {
                            bgNen.pause();
                            bgNen.currentTime = 0;
                        });
                    }
                };

            }, delayBeforeQuote);
        };

        // Bắt đầu phát khi có tương tác đầu tiên để vượt qua chính sách autoplay
        const unlockAndPlay = () => {
            const splashScreen = document.getElementById("splash-screen");
            if (!splashScreen || splashScreen.style.display === "none") return;

            // Ẩn gợi ý autoplay khi bé đã tương tác
            if (autoplayHint) autoplayHint.classList.add("hidden");

            this.audio.initContext();
            if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
                this.audio.ctx.resume();
            }

            // Chỉ phát nếu chưa tự động phát thành công trước đó (nếu đã autoplay thành công thì bỏ qua không phát trùng)
            if (!hasPlayedOnce) {
                playCurrentSplashQuote();
            }

            document.removeEventListener("click", unlockAndPlay);
            document.removeEventListener("touchstart", unlockAndPlay);
            document.removeEventListener("keydown", unlockAndPlay);
        };

        document.addEventListener("click", unlockAndPlay);
        document.addEventListener("touchstart", unlockAndPlay);
        document.addEventListener("keydown", unlockAndPlay);

        // Thiết lập phát định kỳ sau mỗi 2 - 3 phút ngẫu nhiên (120 - 180 giây)
        const startInterval = () => {
            if (this.splashGreetingTimeout) clearTimeout(this.splashGreetingTimeout);
            const nextTime = 120000 + Math.random() * 60000;
            greetingInterval = setTimeout(() => {
                const splashScreen = document.getElementById("splash-screen");
                if (splashScreen && splashScreen.style.display !== "none") {
                    this.nextSplashQuote();
                }
            }, nextTime);
        };
        
        // Lưu tham chiếu để có thể reset từ bên ngoài (ví dụ khi nhấn phím Space)
        this.resetSplashGreetingInterval = startInterval;
        startInterval();

        this.splashGreetingTimeout = greetingInterval;
        
        // Bộ lắng nghe sự kiện nhấn phím Space để đổi nhanh châm ngôn
        const handleSpaceKey = (e) => {
            if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
                const splashScreen = document.getElementById("splash-screen");
                const isSplashVisible = splashScreen && splashScreen.style.display !== "none" && !splashScreen.classList.contains("fade-out");
                if (isSplashVisible) {
                    e.preventDefault(); // Ngăn hành vi cuộn trang mặc định
                    this.nextSplashQuote();
                }
            }
        };
        document.addEventListener("keydown", handleSpaceKey);
        
        // Expose hàm phát ra ngoài để gọi từ app.init()
        this.playSplashGreeting = playCurrentSplashQuote;
        
        this.stopSplashGreeting = () => {
            if (this.splashGreetingTimeout) clearTimeout(this.splashGreetingTimeout);
            clearActiveTimeouts();
            if (fadeRequestFrame) cancelAnimationFrame(fadeRequestFrame);
            
            document.removeEventListener("click", unlockAndPlay);
            document.removeEventListener("touchstart", unlockAndPlay);
            document.removeEventListener("keydown", unlockAndPlay);
            document.removeEventListener("keydown", handleSpaceKey); // Gỡ bỏ phím Space khi vào học
            
            if (currentlyPlaying) {
                try {
                    currentlyPlaying.pause();
                    currentlyPlaying.currentTime = 0;
                } catch (err) {
                    console.warn("Không thể dừng hoặc reset currentlyPlaying khi vào học tập:", err);
                }
            }
            try {
                bgNen.pause();
                bgNen.currentTime = 0;
            } catch (e) {}
        };
    },

    // Hàm chuyển đổi nhanh sang câu châm ngôn tiếp theo (sử dụng khi nhấn phím Space)
    nextSplashQuote: function() {
        const splashScreen = document.getElementById("splash-screen");
        if (!splashScreen || splashScreen.style.display === "none") return;

        console.log("Phím Space được nhấn: Chuyển sang châm ngôn tiếp theo.");

        // Chọn câu châm ngôn ngẫu nhiên mới hiển thị lên màn hình
        this.displayRandomSplashQuote();
        
        // Phát âm thanh châm ngôn mới đó kèm theo nhạc đệm
        if (typeof this.playSplashGreeting === 'function') {
            this.playSplashGreeting();
        }

        // Reset lại chu kỳ hẹn giờ phát tự động (đếm lại từ đầu 2-3 phút)
        if (typeof this.resetSplashGreetingInterval === 'function') {
            this.resetSplashGreetingInterval();
        }
    },

    // Giữ màn hình luôn sáng bằng Screen Wake Lock API
    initWakeLock: function() {
        let wakeLock = null;

        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Screen Wake Lock đã được kích hoạt thành công!');
                } catch (err) {
                    console.warn(`Lỗi kích hoạt Screen Wake Lock: ${err.name}, ${err.message}`);
                }
            } else {
                console.warn('Trình duyệt không hỗ trợ Screen Wake Lock API.');
            }
        };

        // Kích hoạt sau tương tác đầu tiên của người dùng
        const handleInteraction = () => {
            requestWakeLock();
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        // Kích hoạt lại khi tab hoạt động trở lại
        document.addEventListener('visibilitychange', async () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        });
    },

    // Khởi tạo bộ đếm thời gian không hoạt động (Idle Timer 10 phút)
    initIdleTimer: function() {
        let idleTime = 0;
        const maxIdleTime = 10 * 60; // 10 phút = 600 giây

        // Hàm reset thời gian chờ
        const resetTimer = () => {
            idleTime = 0;
        };

        // Lắng nghe các tương tác của người dùng
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(name => {
            document.addEventListener(name, resetTimer, true);
        });

        // Chạy kiểm tra mỗi giây
        setInterval(() => {
            const splashScreen = document.getElementById("splash-screen");
            // Chỉ đếm nếu màn hình khởi động đang ẩn (bé đang trong ứng dụng)
            const isAppActive = splashScreen && splashScreen.style.display === "none";
            
            if (isAppActive) {
                // Kiểm tra xem bé có đang xem video YouTube không
                const isWatchingVideo = document.body.classList.contains("video-fullscreen-active") || 
                                       document.querySelector(".btn-exit-video-fullscreen") !== null;
                
                // Kiểm tra xem bé có đang làm bài tập trắc nghiệm không
                const practiceActiveBox = document.getElementById("practice-active-box");
                const isPracticing = practiceActiveBox && !practiceActiveBox.classList.contains("hidden");

                if (!isWatchingVideo && !isPracticing) {
                    idleTime++;
                    if (idleTime >= maxIdleTime) {
                        resetTimer();
                        // Quay lại màn hình khởi động
                        this.returnToSplashScreen();
                    }
                } else {
                    // Nếu đang xem video hoặc làm bài tập, liên tục reset bộ đếm
                    resetTimer();
                }
            } else {
                resetTimer();
            }
        }, 1000);
    },

    // Chuyển cảnh quay lại màn hình khởi động
    returnToSplashScreen: function() {
        const splashScreen = document.getElementById("splash-screen");
        if (!splashScreen) return;

        console.log("Ứng dụng tự động quay về màn hình khởi động do quá 10 phút không tương tác.");

        // Dừng video đang phát
        if (typeof this.exitVideoFullscreen === 'function') {
            this.exitVideoFullscreen();
        }

        // Thoát khỏi bài luyện tập trắc nghiệm nếu đang làm dở
        const practiceActiveBox = document.getElementById("practice-active-box");
        if (practiceActiveBox && !practiceActiveBox.classList.contains("hidden")) {
            if (window.questions && typeof questions.exitPractice === 'function' && !questions.isExiting) {
                questions.exitPractice();
            }
        }

        // Hiển thị lại màn hình khởi động
        splashScreen.style.display = "flex";
        splashScreen.classList.remove("fade-out");

        // Khởi động lại âm thanh chào mừng và cập nhật châm ngôn
        this.initSplashGreeting();
        this.displayRandomSplashQuote();
        if (typeof this.playSplashGreeting === 'function') {
            this.playSplashGreeting();
        }
    },

    // Chọn ngẫu nhiên một câu châm ngôn học tập và hiển thị lên Màn hình chào mừng
    displayRandomSplashQuote: function() {
        const textEl = document.getElementById("splash-quote-text");
        const authorEl = document.getElementById("splash-quote-author");
        if (!textEl || !authorEl) return;
        
        const quotes = [
            { text: "Biển học vô bờ, chuyên cần là bến bờ.", author: "Tục ngữ Việt Nam" },
            { text: "Đi một ngày đàng, học một sàng khôn.", author: "Tục ngữ Việt Nam" },
            { text: "Có công mài sắt, có ngày nên kim.", author: "Tục ngữ Việt Nam" },
            { text: "Muốn biết phải hỏi, muốn giỏi phải học.", author: "Tục ngữ Việt Nam" },
            { text: "Rễ của học tập thì đắng cay, nhưng quả của nó thì ngọt ngào.", author: "Aristotle" },
            { text: "Học tập là cuốn sổ thông hành cho tương lai, vì ngày mai thuộc về những người chuẩn bị cho nó từ hôm nay.", author: "Malcolm X" },
            { text: "Kiến thức là sức mạnh. Sự chăm chỉ là chìa khóa mở cánh cửa tương lai.", author: "Khuyết danh" },
            { text: "Thiên tài chỉ có 1% là năng khiếu bẩm sinh, 99% còn lại là sự mồ hôi và cần cù.", author: "Thomas Edison" },
            { text: "Đường tuy ngắn, không đi không đến. Việc tuy nhỏ, không làm không nên.", author: "Tuân Tử" },
            { text: "Đầu tư vào kiến thức luôn mang lại lợi nhuận cao nhất.", author: "Benjamin Franklin" },
            { text: "Học tập không bao giờ làm trí tuệ kiệt sức.", author: "Leonardo da Vinci" },
            { text: "Đừng xấu hổ khi không biết, chỉ xấu hổ khi không học.", author: "Khuyết danh" },
            { text: "Học tập giống như chèo thuyền ngược nước, không tiến lên nghĩa là thối lui.", author: "Châm ngôn phương Đông" },
            { text: "Học không biết chán, dạy người không biết mệt.", author: "Khổng Tử" }
        ];
        
        const randIndex = Math.floor(Math.random() * quotes.length);
        const selected = quotes[randIndex];
        
        textEl.innerText = selected.text;
        authorEl.innerText = `— ${selected.author}`;
        
        // Lưu trữ lại chỉ số câu châm ngôn hiện tại để phát file âm thanh tương ứng
        this.currentSplashQuoteIndex = randIndex;
    },

    getLocalStorageKey: function() {
        const studentId = this.config && this.config.defaultStudentId ? this.config.defaultStudentId : "default";
        const classLevel = this.config && this.config.currentClass === "4" ? "4" : "6";
        return `toan${classLevel}_edtech_progress_${studentId}`;
    },

    getApiUrl: function(path) {
        if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
            return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
        }
        return path;
    },

    loadConfig: async function() {
        try {
            const res = await fetch(this.getApiUrl('/api/load-config'));
            if (res.ok) {
                const data = await res.json();
                if (data && Object.keys(data).length > 0) {
                    this.config = { ...this.config, ...data };
                } else {
                    await this.saveConfig();
                }
            }
        } catch(e) {
            console.error("Lỗi đọc config từ SQLite:", e);
        }
    },

    saveConfig: async function(token) {
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            await fetch(this.getApiUrl('/api/save-config'), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(this.config)
            });
        } catch(e) {
            console.error("Lỗi lưu config vào SQLite:", e);
        }
    },

    getDefaultState: function() {
        return {
            xp: 0,
            streak: 0,
            lastActiveDate: null,
            scores: {},
            badges: [],
            history: [],
            distractions: 0,
            customVideos: {},
            parentPin: this.config ? this.config.parentPin : "123456",
            examSessions: [],
            completedSubtopics: [],
            subtopicScores: {},
            completedLessonTheory: []
        };
    },

    switchClass: async function(newClass) {
        // 1. Lưu tiến trình lớp cũ
        await this.saveProgress();
        
        // 2. Cập nhật cấu hình lớp mới và tên mặc định tương ứng
        this.config.currentClass = newClass;
        if (this.config.students && this.config.students.length > 0) {
            const matchedStudent = this.config.students.find(s => s.classLevel === newClass);
            if (matchedStudent) {
                this.config.defaultStudentId = matchedStudent.id;
                this.config.studentName = matchedStudent.name;
                this.config.parentName = matchedStudent.parentName;
            }
        }
        await this.saveConfig();
        
        // 3. Reset state trong bộ nhớ về mặc định
        this.state = this.getDefaultState();
        
        // 4. Nạp tiến trình lớp mới
        await this.loadProgress();
        
        // 5. Cập nhật giao diện chào mừng và timeline
        this.initSplashGreeting();
        
        // Cập nhật các chỉ số Gamification lên Màn hình chào mừng
        const splashStreak = document.getElementById("splash-streak-val");
        const splashXp = document.getElementById("splash-xp-val");
        const splashBadge = document.getElementById("splash-badge-count");
        if (splashStreak) splashStreak.innerText = this.state.streak;
        if (splashXp) splashXp.innerText = this.state.xp;
        if (splashBadge) splashBadge.innerText = this.state.badges ? this.state.badges.length : 0;
        
        // Cập nhật header
        this.updateHeaderStats();
        
        // Chọn học kỳ mặc định của lớp đó
        this.currentSemester = 1;
        const semTab1 = document.getElementById("sem-tab-1");
        const semTab2 = document.getElementById("sem-tab-2");
        if (semTab1) semTab1.classList.add("active");
        if (semTab2) semTab2.classList.remove("active");
        
        this.renderTimeline();
        
        // Hiển thị welcome panel sạch
        document.getElementById("welcome-viewer-panel").classList.remove("hidden");
        document.getElementById("lesson-detail-panel").classList.add("hidden");
        
        // Đổi text welcome panel
        this.updateWelcomeViewerPanelText();
    },

    updateWelcomeViewerPanelText: function() {
        const studentName = this.config.studentName || "Học sinh";
        const parentName = this.config.parentName || "Phụ huynh";
        const currentClass = this.config.currentClass || "6";

        const welcomeBox = document.querySelector("#welcome-viewer-panel .welcome-box");
        if (welcomeBox) {
            welcomeBox.innerHTML = `
                <h2>Chào mừng ${studentName}! 👋</h2>
                <p>Phần mềm học Toán đặc biệt do <b>${parentName}</b> thiết kế dành riêng cho con. Hãy cùng chinh phục kiến thức Toán lớp ${currentClass}, vượt qua các bài học để nhận Huy hiệu danh giá nhé! Chúc con học thật giỏi!</p>
`;
        }
        
        // Đồng bộ tiêu đề lộ trình trên sidebar
        const sidebarTitle = document.querySelector(".sidebar-title-text");
        if (sidebarTitle) {
            sidebarTitle.innerHTML = `<i class="fa-solid fa-map-signs"></i> Lộ trình học Toán ${currentClass}`;
        }

        // Cập nhật tên chào mừng trên màn hình Splash Screen
        const splashWelcome = document.querySelector(".splash-welcome-user");
        if (splashWelcome) {
            splashWelcome.innerHTML = `Chào mừng học sinh <strong class="user-highlight">${studentName}</strong>! 👋`;
        }

        // Cập nhật tên trong cảnh báo chưa mở khóa bài kiểm tra
        const lockedNameSpan = document.getElementById("locked-warning-student-name");
        if (lockedNameSpan) lockedNameSpan.textContent = studentName;

        // Cập nhật tiêu đề chọn chế độ thực hành
        const practiceModeTitle = document.getElementById("practice-mode-title");
        if (practiceModeTitle) practiceModeTitle.textContent = `${studentName} ơi, con muốn làm bài theo phong cách nào?`;

        // Cập nhật mô tả lịch sử làm bài trong tab lịch sử
        const lessonHistDesc = document.getElementById("lesson-history-student-desc");
        if (lessonHistDesc) lessonHistDesc.textContent = `Danh sách các lần luyện tập và kiểm tra bài học này của ${studentName}.`;

        // Cập nhật tiêu đề màn hình huy hiệu (nếu có)
        const badgeScreenTitle = document.querySelector("#screen-badges h3");
        if (badgeScreenTitle) badgeScreenTitle.innerHTML = `🏅 Bộ sưu tập Huy hiệu của ${studentName}`;
    },

    // Khởi chạy không gian làm việc cho học sinh hiện tại
    initStudentWorkspace: async function() {
        // 1. Tải thông tin học sinh hiện tại từ config và hiển thị tức thì lên Splash Screen
        const student = this.config.students ? this.config.students.find(s => s.id === this.config.defaultStudentId) : null;
        if (student) {
            this.config.studentName = student.name;
            this.config.parentName = student.parentName || "Phụ huynh";
            this.config.currentClass = student.classLevel;
        }

        // Khởi chạy các thành phần Splash Screen tức thì
        try { this.initSplashClock(); } catch(e) { console.error("Lỗi initSplashClock:", e); }
        try { this.displayRandomSplashQuote(); } catch(e) { console.error("Lỗi displayRandomSplashQuote:", e); }
        try { this.updateWelcomeViewerPanelText(); } catch(e) { console.error("Lỗi updateWelcomeViewerPanelText:", e); }
        try { this.initTheme(); } catch(e) { console.error("Lỗi initTheme:", e); }
        try { this.initSplashGreeting(); } catch(e) { console.error("Lỗi initSplashGreeting:", e); }
        
        // Thử phát câu chào châm ngôn đầu tiên
        if (typeof this.playSplashGreeting === 'function') {
            try { this.playSplashGreeting(); } catch(e) { console.error("Lỗi playSplashGreeting:", e); }
        }

        // 2. Chạy ngầm nạp tiến trình học tập từ CSDL SQLite và vẽ lộ trình bài học phía sau
        try {
            await this.loadProgress();
        } catch (e) {
            console.error("Lỗi khi tải tiến trình học tập:", e);
        }

        // Cập nhật các chỉ số Gamification lên Màn hình chào mừng (Splash Screen) sớm nhất có thể
        try {
            const splashStreak = document.getElementById("splash-streak-val");
            const splashXp = document.getElementById("splash-xp-val");
            const splashBadge = document.getElementById("splash-badge-count");
            if (splashStreak) splashStreak.innerText = this.state.streak || 0;
            if (splashXp) splashXp.innerText = this.state.xp || 0;
            if (splashBadge) splashBadge.innerText = this.state.badges ? this.state.badges.length : 0;
        } catch (e) {
            console.error("Lỗi khi cập nhật chỉ số Gamification trên Splash Screen:", e);
        }

        try {
            this.checkStreak();
        } catch (e) {
            console.error("Lỗi checkStreak:", e);
        }

        // Tự động tìm học kỳ của bài đang làm để thiết lập trước khi render timeline
        try {
            const activeInfo = this.getActiveLesson();
            if (activeInfo) {
                this.currentSemester = activeInfo.semester;
            }
        } catch (e) {
            console.error("Lỗi getActiveLesson:", e);
        }

        try {
            this.renderTimeline();
        } catch (e) {
            console.error("Lỗi renderTimeline:", e);
        }

        try {
            this.updateHeaderStats();
        } catch (e) {
            console.error("Lỗi updateHeaderStats:", e);
        }

        try {
            this.initDistractionTracker();
        } catch (e) {
            console.error("Lỗi initDistractionTracker:", e);
        }

        try {
            this.initFullscreenListeners(); // Khởi tạo bộ lắng nghe Fullscreen
        } catch (e) {
            console.error("Lỗi initFullscreenListeners:", e);
        }

        try {
            this.initAiProgressTracker(); // Theo dõi tiến trình sinh đề ngầm của AI
        } catch (e) {
            console.error("Lỗi initAiProgressTracker:", e);
        }
        
        try {
            // Kích hoạt sinh đề ngầm cho học sinh này ở backend
            const studentId = this.config.defaultStudentId || 'default';
            const classLevel = this.config.currentClass || '6';
            fetch(this.getApiUrl('/api/start-student-pregen'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, classLevel })
            }).then(res => res.json())
              .then(data => console.log('[AI Pre-gen Activation]', data.message))
              .catch(err => console.error('[AI Pre-gen Activation Error]', err));
        } catch (e) {
            console.error("Lỗi kích hoạt start-student-pregen:", e);
        }

        try {
            this.initWakeLock();
        } catch (e) {
            console.error("Lỗi initWakeLock:", e);
        }

        try {
            this.initIdleTimer();
        } catch (e) {
            console.error("Lỗi initIdleTimer:", e);
        }
    },

    // Hiển thị màn hình thiết lập ban đầu
    showSetupInitialScreen: function() {
        const setupScreen = document.getElementById("setup-initial-screen");
        const selectScreen = document.getElementById("student-select-screen");
        const splashScreen = document.getElementById("splash-screen");

        if (setupScreen) setupScreen.classList.remove("hidden");
        if (selectScreen) selectScreen.classList.add("hidden");
        if (splashScreen) splashScreen.classList.add("hidden");
    },

    // Gửi thông tin thiết lập ban đầu lên server
    submitInitialSetup: async function() {
        const parentName = document.getElementById("setup-parent-name")?.value.trim();
        const parentPin = document.getElementById("setup-parent-pin")?.value.trim();
        const studentName = document.getElementById("setup-student-name")?.value.trim();
        const classLevel = document.querySelector('input[name="setup-class-level"]:checked')?.value;

        if (!parentName || !parentPin || !studentName || !classLevel) {
            Swal.fire({
                title: "Lỗi!",
                text: "Vui lòng điền đầy đủ các thông tin yêu cầu.",
                icon: "error",
                confirmButtonColor: "#7c3aed"
            });
            return;
        }

        Swal.fire({
            title: "Đang thiết lập...",
            text: "Vui lòng đợi trong giây lát.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await fetch(this.getApiUrl('/api/setup-initial'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parentName,
                    parentPin,
                    studentName,
                    classLevel
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    title: "Thiết lập thành công! 🎉",
                    text: "Bây giờ con có thể bắt đầu hành trình học tập.",
                    icon: "success",
                    confirmButtonColor: "#7c3aed"
                }).then(() => {
                    // Tải lại config và khởi động ứng dụng
                    window.location.reload();
                });
            } else {
                throw new Error(data.error || "Lỗi không xác định khi thiết lập.");
            }
        } catch (error) {
            console.error("Lỗi submit thiết lập:", error);
            Swal.fire({
                title: "Lỗi thiết lập!",
                text: error.message || "Không thể kết nối tới máy chủ.",
                icon: "error",
                confirmButtonColor: "#7c3aed"
            });
        }
    },

    // Hiển thị màn hình lựa chọn học sinh ban đầu
    showStudentSelectionScreen: function() {
        const selectScreen = document.getElementById("student-select-screen");
        const splashScreen = document.getElementById("splash-screen");
        const selectList = document.getElementById("student-select-list");

        if (selectScreen) selectScreen.classList.remove("hidden");
        if (splashScreen) splashScreen.classList.add("hidden");

        if (!selectList) return;
        selectList.innerHTML = "";

        const students = this.config.students || [];

        if (students.length === 0) {
            selectList.innerHTML = `
                <div class="p-4 text-center text-white/70 bg-white/5 border border-white/10 rounded-2xl" style="grid-column: 1 / -1;">
                    <p class="font-bold text-sm">Chưa có tài khoản học sinh nào!</p>
                    <p class="text-xs mt-1 text-slate-300">Phụ huynh vui lòng nhấp vào nút "Góc Phụ huynh" ở dưới để thêm tài khoản học tập cho con.</p>
                </div>
            `;
            return;
        }

        students.forEach(st => {
            const btn = document.createElement("button");
            btn.className = "flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 hover:border-white/30 transition duration-300 text-left w-full text-white shadow-lg backdrop-blur-md";
            btn.style.cursor = "pointer";
            btn.onclick = () => this.selectStudentWithPin(st.id);
            btn.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-violet-600/30 rounded-full flex items-center justify-center border border-violet-500/20">
                        <i class="fa-solid fa-user text-violet-300"></i>
                    </div>
                    <div>
                        <strong class="block text-base font-bold text-white">${st.name}</strong>
                        <span class="text-xs text-slate-300">Toán lớp ${st.classLevel}</span>
                    </div>
                </div>
                <div class="text-violet-400">
                    <i class="fa-solid fa-chevron-right text-sm"></i>
                </div>
            `;
            selectList.appendChild(btn);
        });
    },

    // Chọn học sinh và xác thực mã PIN phụ huynh
    selectStudentWithPin: function(studentId) {
        const student = this.config.students.find(s => s.id === studentId);
        if (!student) return;

        Swal.fire({
            title: `Đăng nhập cho ${student.name}`,
            text: `Nhập Mã PIN phụ huynh để xác nhận và ghi nhớ tài khoản này cho các lần sau:`,
            input: 'password',
            inputPlaceholder: 'Mã PIN phụ huynh...',
            inputAttributes: {
                maxlength: 15,
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Đăng nhập',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#8b5cf6',
            cancelButtonColor: '#475569',
            preConfirm: async (pin) => {
                if (!pin) {
                    Swal.showValidationMessage('Vui lòng nhập mã PIN!');
                    return false;
                }
                try {
                    const res = await fetch(this.getApiUrl('/api/admin/login'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: pin })
                    });
                    if (!res.ok) {
                        const err = await res.json();
                        Swal.showValidationMessage(err.error || 'Mã PIN phụ huynh không chính xác!');
                        return false;
                    }
                    const data = await res.json();
                    return data.token; // Trả về token thu được từ server để dùng tiếp ở block .then
                } catch (e) {
                    Swal.showValidationMessage('Lỗi kết nối máy chủ khi xác thực PIN!');
                    return false;
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = result.value;
                // Đặt làm mặc định và lưu cấu hình
                this.config.defaultStudentId = studentId;
                await this.saveConfig(token);

                // Ẩn màn hình chọn và hiện màn chào mừng
                document.getElementById("student-select-screen").classList.add("hidden");
                document.getElementById("splash-screen").classList.remove("hidden");

                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công',
                    text: `Chào mừng ${student.name} bắt đầu học tập!`,
                    timer: 2000,
                    showConfirmButton: false
                });

                // Khởi chạy Workspace học sinh
                await this.initStudentWorkspace();
            }
        });
    },

    // Khởi chạy ứng dụng
    init: async function() {
        await this.loadConfig();
        this.audio.init(); // Preload tất cả âm thanh
        this.checkUpdateAuto(); // Tự động kiểm tra bản cập nhật

        // Lắng nghe phím Enter trong ô nhập PIN của phụ huynh ở Splash Screen
        const pinInput = document.getElementById("parent-pin");
        if (pinInput) {
            pinInput.addEventListener("keypress", (e) => {
                if (e.key === 'Enter') {
                    if (typeof parentDashboard !== 'undefined' && typeof parentDashboard.verifyPin === 'function') {
                        parentDashboard.verifyPin();
                    }
                }
            });
        }

        // Đăng ký sự kiện nút chuyển theme học sinh
        const themeToggleBtn = document.getElementById("theme-toggle");
        if (themeToggleBtn) {
            themeToggleBtn.onclick = () => this.toggleTheme();
        }

        // Lắng nghe sự kiện kết nối mạng online để đồng bộ
        window.addEventListener('online', () => {
            this.syncOfflineProgress();
        });

        // Kiểm tra xem hệ thống đã thiết lập cấu hình ban đầu chưa
        if (!this.config.students || this.config.students.length === 0) {
            // Hiển thị màn hình thiết lập ban đầu
            this.showSetupInitialScreen();
        } else if (this.config.defaultStudentId && this.config.students && this.config.students.some(s => s.id === this.config.defaultStudentId)) {
            // Ẩn màn hình chọn và màn hình thiết lập
            const selectScreen = document.getElementById("student-select-screen");
            const setupScreen = document.getElementById("setup-initial-screen");
            const splashScreen = document.getElementById("splash-screen");
            if (selectScreen) selectScreen.classList.add("hidden");
            if (setupScreen) setupScreen.classList.add("hidden");
            if (splashScreen) splashScreen.classList.remove("hidden");

            await this.initStudentWorkspace();
        } else {
            // Hiển thị màn hình chọn con ban đầu
            this.showStudentSelectionScreen();
        }

        // Sự kiện kích hoạt âm thanh và đóng màn hình chào mừng (Splash Screen)
        let isEntering = false;
        const enterApp = () => {
            if (isEntering) return;
            isEntering = true;

            const splashScreen = document.getElementById("splash-screen");
            
            // Dừng âm thanh nhắc nhở của Splash Screen
            if (typeof this.stopSplashGreeting === 'function') {
                this.stopSplashGreeting();
            }

            this.audio.init();
            this.audio.isUnlocked = true;
            this.audio.playStartup();
            
            // Tạm thời tắt tiếng click trong vòng 150ms để tránh âm click phát chồng lên âm startup
            this.audio.tempMuteClick = true;
            setTimeout(() => {
                this.audio.tempMuteClick = false;
            }, 150);

            if (splashScreen) {
                splashScreen.classList.add("fade-out");
                // Giải phóng bộ nhớ hiển thị sau khi hiệu ứng hoàn thành (0.6 giây)
                setTimeout(() => {
                    splashScreen.style.display = "none";
                    isEntering = false; // Reset cờ trạng thái để bấm được tiếp khi Splash Screen hiển thị lại
                    // Cuộn đến bài đang học khi màn hình Splash ẩn hoàn toàn để tạo hiệu ứng chuyển cảnh mượt
                    this.scrollToActiveLesson();

                    // Kích hoạt hiển thị các huy hiệu trong hàng đợi (nếu có)
                    if (this.pendingBadges && this.pendingBadges.length > 0) {
                        const nextBadgeId = this.pendingBadges.shift();
                        this.showBadgePopup(nextBadgeId);
                    }
                }, 600);
            }
        };

        const splashStartBtn = document.getElementById("splash-start-btn");
        if (splashStartBtn) {
            splashStartBtn.addEventListener("click", enterApp);
            splashStartBtn.addEventListener("touchstart", (e) => {
                e.preventDefault();
                enterApp();
            });
        }

        // Lắng nghe sự kiện click toàn cục để phát âm thanh click nhẹ chuyên nghiệp
        document.addEventListener("click", (e) => {
            const target = e.target.closest("button, a, [role='button'], .option-btn, .nav-item, .lesson-card, .btn, .btn-primary, .btn-secondary, .btn-splash-start, .btn-parent, .btn-icon, .sem-tab-btn, .tab-btn, .btn-level-select, .btn-mode-select, .btn-game-tower, .btn-game-action, .btn-exit-practice, .sidebar-toggle-container, .btn-collapse-sidebar, [onclick], input[type='submit'], input[type='button'], .timeline-node");
            if (target) {
                if (this.audio.isUnlocked && !this.audio.tempMuteClick) {
                    this.audio.playClick();
                }
            }
        });

        // Cuộn ngầm ban đầu lúc khởi chạy
        this.scrollToActiveLesson();
    },

    checkUpdateAuto: async function() {
        try {
            const response = await fetch('/api/check-update');
            if (!response.ok) return;
            const data = await response.json();
            
            if (data.hasUpdate) {
                // Định dạng changelog đẹp mắt (hỗ trợ xuống dòng)
                const changelogHtml = data.changelog
                    ? data.changelog.split('\n').map(line => `<li>${line}</li>`).join('')
                    : '<li>Cải tiến hiệu năng và sửa một số lỗi nhỏ.</li>';

                Swal.fire({
                    title: '🎉 Có Phiên Bản Mới!',
                    html: `
                        <div style="text-align: left; font-size: 0.95rem; line-height: 1.6; color: var(--text-main);">
                            <p style="margin-bottom: 0.8rem;">Hệ thống đã phát hiện phiên bản mới <b>v${data.latestVersion}</b> (Phiên bản hiện tại: v${data.currentVersion}).</p>
                            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 150px; overflow-y: auto; margin-bottom: 1rem;">
                                <h4 style="margin-top: 0; color: var(--primary); font-weight: 700; margin-bottom: 0.5rem;">Nhật ký thay đổi:</h4>
                                <ul style="padding-left: 1.2rem; margin: 0;">
                                    ${changelogHtml}
                                </ul>
                            </div>
                            <p style="color: var(--warning); font-size: 0.85rem; font-weight: 500;">
                                ⚠️ Quá trình cập nhật sẽ tự động lưu lại toàn bộ tiến trình học tập của con và khởi chạy lại ứng dụng.
                            </p>
                        </div>
                    `,
                    icon: 'info',
                    iconColor: '#3E8EED',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    showCancelButton: true,
                    confirmButtonText: 'Cập nhật ngay 🚀',
                    cancelButtonText: 'Để sau',
                    confirmButtonColor: '#3E8EED',
                    cancelButtonColor: 'var(--text-muted)',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    customClass: {
                        popup: 'custom-swal-dark-popup',
                        title: 'custom-swal-dark-title'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Hiển thị màn hình chờ tải và cài đặt
                        Swal.fire({
                            title: 'Đang tiến hành cập nhật...',
                            html: 'Hệ thống đang tải bản cập nhật và cài đặt tự động.<br><b>Vui lòng không tắt máy tính!</b>',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: false,
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        // Gọi API nâng cấp
                        fetch('/api/perform-update', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ downloadUrl: data.downloadUrl })
                        }).then(res => {
                            if (res.ok) {
                                let countdown = 12;
                                const interval = setInterval(() => {
                                    countdown--;
                                    if (countdown <= 0) {
                                        clearInterval(interval);
                                        window.location.reload();
                                    } else {
                                        Swal.update({
                                            html: `Đang cài đặt các tệp tin mới và khởi động lại ứng dụng trong <b>${countdown}</b> giây.<br>Vui lòng không tắt chương trình!`
                                        });
                                    }
                                }, 1000);
                            } else {
                                Swal.fire({
                                    title: 'Lỗi cập nhật!',
                                    text: 'Không thể kích hoạt tiến trình cài đặt trên máy chủ local.',
                                    icon: 'error',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-main)',
                                    confirmButtonText: 'Đóng'
                                });
                            }
                        }).catch(err => {
                            // Đôi khi server tắt trước khi trả về phản hồi HTTP hoàn chỉnh, ta tự động reload sau 10s
                            let countdown = 10;
                            const interval = setInterval(() => {
                                countdown--;
                                if (countdown <= 0) {
                                    clearInterval(interval);
                                    window.location.reload();
                                } else {
                                    Swal.update({
                                        html: `Đang cài đặt bản cập nhật mới và khởi động lại trong <b>${countdown}</b> giây...`
                                    });
                                }
                            }, 1000);
                        });
                    }
                });
            }
        } catch (e) {
            console.warn('[AutoUpdate] Không thể kiểm tra phiên bản:', e);
        }
    },
    
    isAiProgressDetailExpanded: false,
    fetchAiStatusRef: null,

    // Khởi chạy trình theo dõi tiến trình AI
    initAiProgressTracker: function() {
        const banner = document.getElementById("ai-progress-banner");
        const bar = document.getElementById("ai-progress-bar");
        const text = document.getElementById("ai-progress-text");
        const percent = document.getElementById("ai-progress-percent");
        const errBtn = document.getElementById("ai-progress-error-btn");
        const errCount = document.getElementById("ai-error-count");
        
        if (!banner) return;
        
        this.aiErrors = []; // Lưu trữ danh sách lỗi nhận từ server
        
        const fetchAiStatus = () => {
            const studentId = this.config.defaultStudentId || 'default';
            const classLevel = this.config.currentClass || '6';
            fetch(this.getApiUrl(`/api/ai-status?studentId=${studentId}&classLevel=${classLevel}`))
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Không có quyền truy cập hoặc lỗi máy chủ");
                    }
                    return res.json();
                })
                .then(data => {
                    if (data && data.error) {
                        throw new Error(data.error);
                    }
                    
                    this.aiErrors = data.errors || [];
                    
                    // Cập nhật số lượng lỗi
                    if (this.aiErrors.length > 0) {
                        errBtn.classList.remove("hidden");
                        errCount.textContent = this.aiErrors.length;
                    } else {
                        errBtn.classList.add("hidden");
                    }
                    
                    const total = data.totalExams || 0;
                    const completed = data.completedExams || 0;
                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                    
                    bar.style.width = pct + "%";
                    percent.textContent = pct + "%";
                    
                    // Xóa các trạng thái cũ
                    banner.classList.remove("hidden", "ai-completed", "ai-paused");
                    
                    if (data.state === 'generating' || data.state === 'active') {
                        text.innerHTML = `<i class="fa-solid fa-robot ai-robot-icon animate-pulse"></i> AI đang sinh đề ngầm: <b>${data.currentLessonTitle}</b> (${completed}/${total} bài)`;
                    } else if (data.state === 'paused') {
                        banner.classList.add("ai-paused");
                        text.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ${data.message} (${completed}/${total} bài)`;
                    } else if (data.state === 'quota_exhausted') {
                        banner.classList.add("ai-paused");
                        text.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> <b>Cảnh báo:</b> Toàn bộ API Keys đều hết hạn ngạch ngày hoặc lỗi!`;
                    } else if (data.state === 'completed' || pct === 100) {
                        banner.classList.add("ai-completed");
                        text.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã hoàn tất 100% dữ liệu đề thi AI!`;
                        bar.style.width = "100%";
                        percent.textContent = "100%";
                        
                        // Tự động ẩn banner sau 8 giây khi hoàn tất để tiết kiệm diện tích
                        setTimeout(() => {
                            banner.classList.add("hidden");
                        }, 8000);
                        
                        clearInterval(this.aiProgressInterval); // Dừng polling
                    } else {
                        if (pct === 100) {
                            banner.classList.add("ai-completed");
                            text.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã hoàn tất 100% dữ liệu đề thi AI!`;
                            setTimeout(() => {
                                banner.classList.add("hidden");
                            }, 5000);
                            clearInterval(this.aiProgressInterval);
                        } else {
                            text.innerHTML = `<i class="fa-solid fa-robot"></i> AI đang đợi hàng đợi... (${completed}/${total} bài)`;
                        }
                    }

                    // Nếu panel chi tiết đang được mở rộng, vẽ lại UI
                    if (this.isAiProgressDetailExpanded) {
                        this.renderAiProgressDetail(data);
                    }
                })
                .catch(err => {
                    console.error("Lỗi khi kết nối với AI status API:", err.message || err);
                    // Tự động ẩn thanh tiến trình và dừng polling do không có quyền truy cập admin
                    banner.classList.add("hidden");
                    if (this.aiProgressInterval) {
                        clearInterval(this.aiProgressInterval);
                    }
                });
        };
        
        this.fetchAiStatusRef = fetchAiStatus;
        
        // Gọi lần đầu và thiết lập lặp
        fetchAiStatus();
        this.aiProgressInterval = setInterval(fetchAiStatus, 4000);
    },

    // Hàm Toggle mở rộng / co gọn panel tiến trình chi tiết
    toggleAiProgressDetail: function() {
        const detailPanel = document.getElementById("ai-progress-detail");
        const toggleIcon = document.getElementById("ai-toggle-icon");
        if (!detailPanel) return;
        
        this.isAiProgressDetailExpanded = !this.isAiProgressDetailExpanded;
        
        if (this.isAiProgressDetailExpanded) {
            detailPanel.classList.remove("hidden");
            if (toggleIcon) toggleIcon.classList.add("rotated");
            // Fetch status ngay lập tức để render
            if (this.fetchAiStatusRef) this.fetchAiStatusRef();
        } else {
            detailPanel.classList.add("hidden");
            if (toggleIcon) toggleIcon.classList.remove("rotated");
        }
    },

    // Vẽ panel chi tiết tiến trình
    renderAiProgressDetail: function(data) {
        const detailPanel = document.getElementById("ai-progress-detail");
        if (!detailPanel) return;
        
        this.currentLessonsStatus = data.lessonsStatus || [];
        
        const total = data.totalExams || 0;
        const completed = data.completedExams || 0;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        const remaining = Math.max(0, total - completed);
        
        // Tính toán thời gian ước tính còn lại: 1 đề ~ 20 giây (gồm cả thời gian API phản hồi + delay)
        let estTimeHtml = '';
        if (remaining === 0) {
            estTimeHtml = '<span style="color:var(--success); font-weight:700;">Đã hoàn thành</span>';
        } else if (data.state === 'quota_exhausted') {
            estTimeHtml = '<span style="color:var(--danger); font-weight:700;">Đang dừng (Hết Quota)</span>';
        } else {
            const estSeconds = remaining * 20;
            const mins = Math.floor(estSeconds / 60);
            const secs = estSeconds % 60;
            const timeStr = mins > 0 ? `${mins} phút ${secs} giây` : `${secs} giây`;
            estTimeHtml = `<span style="color:var(--warning); font-weight:700;">~ ${timeStr}</span>`;
        }
        
        // Trạng thái đếm ngược rate limit
        let statusMessageDetail = data.message || 'Đang chuẩn bị hàng đợi...';
        if (data.state === 'paused' && data.pausedUntil) {
            const leftMs = Math.max(0, data.pausedUntil - Date.now());
            const leftSecs = Math.ceil(leftMs / 1000);
            if (leftSecs > 0) {
                statusMessageDetail = `<i class="fa-solid fa-hourglass-half"></i> Đang chờ Rate Limit: Tự phục hồi sau <b>${leftSecs} giây</b>...`;
            }
        }
        
        // Trạng thái API Key hiện tại
        let apiKeyInfoHtml = '';
        if (data.state === 'quota_exhausted') {
            apiKeyInfoHtml = `<span style="color:var(--danger); font-weight:700;">Không có Key khả dụng (Tất cả hết quota/lỗi)</span>`;
        } else {
            apiKeyInfoHtml = `
                <span>${data.activeKeyAccount || 'Chưa rõ'}</span> 
                <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-family: monospace; color:#38bdf8;">${data.activeKeyMasked || 'N/A'}</code>
            `;
        }
        
        // Cảnh báo khi hết Quota
        let quotaWarningHtml = '';
        if (data.state === 'quota_exhausted') {
            quotaWarningHtml = `
                <div class="ai-quota-warning-box">
                    <div class="ai-quota-warning-text">
                        <i class="fa-solid fa-triangle-exclamation" style="margin-right:0.4rem; color:#ef4444;"></i>
                        Các khóa API Key đi kèm bản Clean đã hết lượt sử dụng miễn phí trong ngày (Google giới hạn số lượt dùng mỗi ngày). Đừng lo lắng! ${this.config.parentName || 'Phụ huynh'} chỉ cần bấm nút "Đổi API Key ngay" bên dưới, làm theo hướng dẫn để lấy khóa API Key mới hoàn toàn miễn phí của riêng mình và dán vào góc Phụ huynh là xong!
                    </div>
                    <button class="btn-ai-action-sm" onclick="app.showScreen('parent'); app.toggleAiProgressDetail();">
                        <i class="fa-solid fa-key"></i> Đổi API Key ngay
                    </button>
                </div>
            `;
        }
        
        // Vẽ bản đồ các bài học
        let lessonsHtml = '';
        if (data.lessonsStatus && data.lessonsStatus.length > 0) {
            data.lessonsStatus.forEach((lesson, index) => {
                let statusClass = 'pending';
                let statusTitle = 'Đang chờ tạo đề';
                let icon = '<i class="fa-regular fa-clock"></i>';
                
                if (lesson.status === 'completed') {
                    statusClass = 'completed';
                    statusTitle = 'Đề thi đã tạo thành công';
                    icon = '<i class="fa-solid fa-circle-check"></i>';
                } else if (lesson.status === 'generating') {
                    statusClass = 'generating';
                    statusTitle = 'AI đang làm việc trên bài học này';
                    icon = '<i class="fa-solid fa-spinner fa-spin"></i>';
                } else if (lesson.status === 'failed') {
                    statusClass = 'failed';
                    statusTitle = `Bị lỗi: ${lesson.error || 'Lỗi không xác định'}. Nhấn để xem chi tiết`;
                    icon = '<i class="fa-solid fa-circle-xmark"></i>';
                }
                
                const shortTitle = lesson.title.length > 25 ? lesson.title.substring(0, 23) + '...' : lesson.title;
                const clickHandler = lesson.status === 'failed' 
                    ? `onclick="app.showSingleLessonErrorByIndex(${index})"` 
                    : '';
                
                lessonsHtml += `
                    <div class="ai-lesson-node ${statusClass}" title="${lesson.title} - ${statusTitle}" ${clickHandler}>
                        ${icon} Bài ${index + 1}: ${shortTitle}
                    </div>
                `;
            });
        } else {
            lessonsHtml = '<div style="color:var(--text-muted); font-size:0.85rem; padding: 0.5rem;">Không tìm thấy danh sách bài học.</div>';
        }
        
        detailPanel.innerHTML = `
            <div class="ai-detail-summary-grid">
                <div class="ai-detail-info-block">
                    <h4><i class="fa-solid fa-circle-info"></i> THÔNG TIN TIẾN TRÌNH</h4>
                    <div class="ai-detail-info-list">
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">Trạng thái AI:</span>
                            <span class="ai-detail-info-value active-task">${statusMessageDetail}</span>
                        </div>
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">API Key đang chạy:</span>
                            <span class="ai-detail-info-value">${apiKeyInfoHtml}</span>
                        </div>
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">API Keys hoạt động:</span>
                            <span class="ai-detail-info-value">${data.availableKeysCount || 0}/${data.totalKeys || 0} keys khả dụng</span>
                        </div>
                    </div>
                </div>
                <div class="ai-detail-info-block right-block">
                    <h4><i class="fa-solid fa-calculator"></i> TIẾN ĐỘ & ƯỚC TÍNH</h4>
                    <div class="ai-detail-info-list">
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">Tổng số đề đã hoàn thành:</span>
                            <span class="ai-detail-info-value">${completed}/${total} bài học (${pct}%)</span>
                        </div>
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">Đề thi còn lại cần tạo:</span>
                            <span class="ai-detail-info-value">${remaining} đề thi</span>
                        </div>
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">Thời gian hoàn thành dự kiến:</span>
                            <span class="ai-detail-info-value">${estTimeHtml}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${quotaWarningHtml}
            
            <div class="ai-detail-map-section">
                <div class="ai-detail-map-header">
                    <h5 class="ai-detail-map-title"><i class="fa-solid fa-map-location-dot"></i> BẢN ĐỒ TIẾN TRÌNH CHI TIẾT</h5>
                    <span style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-info-circle"></i> Đề thi lỗi có màu đỏ, nhấn vào để xem chi tiết lỗi</span>
                </div>
                <div class="ai-detail-lessons-map">
                    ${lessonsHtml}
                </div>
            </div>
        `;
    },
    
    // Hiển thị lỗi riêng lẻ của một bài học bằng SweetAlert2
    showSingleLessonError: function(lessonTitle, errorMsg) {
        Swal.fire({
            title: 'Lỗi sinh đề bài học',
            html: `
                <div style="text-align: left;">
                    <strong style="color:var(--danger);">Bài học:</strong> ${lessonTitle}<br/><br/>
                    <strong style="color:var(--danger);">Chi tiết lỗi:</strong>
                    <pre style="background:var(--bg-app); padding: 0.6rem; border-radius: 6px; font-family: monospace; white-space: pre-wrap; font-size: 0.85rem; margin-top: 0.5rem; border: 1px solid var(--border-color); color:var(--text-main);">${errorMsg}</pre>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 1rem;">
                        <i class="fa-solid fa-circle-info"></i> Lỗi này có thể do hạn ngạch API gặp sự cố hoặc định dạng JSON phản hồi từ Gemini không chuẩn. Hệ thống đã lưu lại lỗi và chuyển qua bài tiếp theo để tránh tắc nghẽn.
                    </p>
                </div>
            `,
            icon: 'error',
            confirmButtonText: 'Đóng',
            customClass: {
                popup: 'card'
            }
        });
    },

    // Hiển thị lỗi bài học thông qua chỉ số mảng đã lưu
    showSingleLessonErrorByIndex: function(index) {
        if (!this.currentLessonsStatus || !this.currentLessonsStatus[index]) return;
        const lesson = this.currentLessonsStatus[index];
        this.showSingleLessonError(lesson.title, lesson.error || 'Lỗi không xác định');
    },

    // Hiển thị danh sách lỗi của AI bằng SweetAlert2
    showAiErrors: function() {
        if (!this.aiErrors || this.aiErrors.length === 0) return;
        
        let errorItemsHtml = '';
        let hasQuotaError = false;
        let hasAuthError = false;
        let hasNetworkError = false;

        this.aiErrors.forEach(err => {
            const time = new Date(err.timestamp).toLocaleTimeString();
            const errMsg = err.error || '';
            
            // Phân loại lỗi
            let errorClass = 'ai-error-general';
            let errorTypeLabel = 'Lỗi không xác định';
            
            if (errMsg.includes('429') || errMsg.includes('Quota') || errMsg.includes('Limit') || errMsg.includes('hạn mức') || errMsg.includes('quá tải') || errMsg.includes('RESOURCE_EXHAUSTED')) {
                errorClass = 'ai-error-quota';
                errorTypeLabel = 'Hết hạn mức / Quá tải (Rate Limit - 429)';
                hasQuotaError = true;
            } else if (errMsg.includes('403') || errMsg.includes('Forbidden') || errMsg.includes('Key không hợp lệ') || errMsg.includes('API key not valid')) {
                errorClass = 'ai-error-auth';
                errorTypeLabel = 'Lỗi API Key không hợp lệ (403)';
                hasAuthError = true;
            } else if (errMsg.includes('fetch failed') || errMsg.includes('timeout') || errMsg.includes('network')) {
                errorClass = 'ai-error-network';
                errorTypeLabel = 'Lỗi kết nối mạng (Network Error)';
                hasNetworkError = true;
            }

            errorItemsHtml += `
                <div class="ai-error-item ${errorClass}" style="margin-bottom: 0.8rem; padding: 0.8rem; border-radius: 8px; border-left: 4px solid var(--warning); background-color: var(--primary-bg);">
                    <div class="ai-error-item-title" style="font-weight: 700; margin-bottom: 0.3rem; color: var(--text-main);">
                        <i class="fa-solid fa-triangle-exclamation" style="color:var(--warning);"></i> 
                        ${err.lessonTitle} (${err.lessonId})
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.3rem;">
                        Loại lỗi: <span style="font-weight: 600; color: var(--danger);">${errorTypeLabel}</span> | Lúc ${time}
                    </div>
                    <div class="ai-error-item-desc" style="font-size: 0.85rem; font-family: monospace; white-space: pre-wrap; background: var(--bg-card); padding: 0.4rem; border-radius: 4px; color: var(--text-main); border: 1px solid var(--border-color);">${errMsg}</div>
                </div>
            `;
        });
        
        // Tạo gợi ý khắc phục khoa học
        let adviceHtml = '';
        if (hasQuotaError) {
            adviceHtml += `
                <div style="text-align: left; background-color: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong style="color: var(--danger);"><i class="fa-solid fa-lightbulb"></i> Gợi ý khắc phục Hết hạn mức / Quá tải:</strong>
                    <ul style="margin: 0.4rem 0 0 1.2rem; padding: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-main);">
                        <li>Tài khoản Gemini API miễn phí đã hết 20 requests/ngày.</li>
                        <li><b>Cách xử lý:</b> Hãy mở tệp <code style="background:var(--primary-bg); padding: 1px 4px; border-radius:3px;">.env</code> ở thư mục gốc của dự án, cập nhật thêm/thay thế các khóa API Key mới vào biến <code style="background:var(--primary-bg); padding:1px 4px; border-radius:3px;">GEMINI_API_KEY</code> (phân tách nhau bởi dấu phẩy).</li>
                        <li>Hoặc chờ sang ngày hôm sau để hạn ngạch miễn phí được reset.</li>
                    </ul>
                </div>
            `;
        }
        if (hasAuthError) {
            adviceHtml += `
                <div style="text-align: left; background-color: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong style="color: var(--warning);"><i class="fa-solid fa-key"></i> Gợi ý khắc phục lỗi API Key:</strong>
                    <ul style="margin: 0.4rem 0 0 1.2rem; padding: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-main);">
                        <li>Khóa API Key của ${this.config.parentName || 'phụ huynh'} bị Google từ chối (403 Forbidden).</li>
                        <li><b>Cách xử lý:</b> ${this.config.parentName || 'Phụ huynh'} vui lòng kiểm tra xem khóa API Key đã copy đầy đủ chưa, hoặc truy cập <a href="https://aistudio.google.com/" target="_blank" style="color: var(--primary); font-weight:600;">Google AI Studio</a> để tạo lại API Key mới và cập nhật vào tệp <code style="background:var(--primary-bg); padding:1px 4px; border-radius:3px;">.env</code>.</li>
                    </ul>
                </div>
            `;
        }
        if (hasNetworkError) {
            adviceHtml += `
                <div style="text-align: left; background-color: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong style="color: var(--primary);"><i class="fa-solid fa-wifi"></i> Gợi ý khắc phục lỗi Mạng:</strong>
                    <ul style="margin: 0.4rem 0 0 1.2rem; padding: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-main);">
                        <li>Mạng kết nối đến Google server bị gián đoạn.</li>
                        <li><b>Cách xử lý:</b> Kiểm tra lại đường truyền Internet của máy chủ chạy ứng dụng hoặc cài đặt proxy nếu mạng bị chặn.</li>
                    </ul>
                </div>
            `;
        }
        if (!hasQuotaError && !hasAuthError && !hasNetworkError) {
            adviceHtml += `
                <div style="text-align: left; background-color: var(--primary-bg); border: 1px solid var(--border-color); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong><i class="fa-solid fa-screwdriver-wrench"></i> Hướng dẫn khắc phục chung:</strong>
                    <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem; color: var(--text-main);">${this.config.parentName || 'Phụ huynh'} vui lòng kiểm tra log hệ thống hoặc thử khởi động lại ứng dụng. Nếu tiếp tục gặp lỗi, vui lòng liên hệ kỹ thuật.</p>
                </div>
            `;
        }

        Swal.fire({
            title: 'Danh sách lỗi sinh đề thi AI',
            html: `
                <p style="font-size:0.9rem; margin-bottom:1rem; color:var(--text-muted); text-align: left;">
                    Hệ thống tự động bỏ qua các bài học này để tránh bị treo luồng khi gọi AI. Dưới đây là phân tích chi tiết lỗi và cách khắc phục:
                </p>
                ${adviceHtml}
                <div class="ai-error-list-modal" style="max-height: 300px; overflow-y: auto; text-align: left;">
                    ${errorItemsHtml}
                </div>
            `,
            icon: 'warning',
            confirmButtonText: 'Đóng',
            customClass: {
                popup: 'card'
            }
        });
    },

    // Quản lý giám sát rời tab
    initDistractionTracker: function() {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                const lessonScreen = document.getElementById("lesson-detail-panel");
                const practiceTab = document.getElementById("tab-practice");
                const resultBox = document.getElementById("practice-result-box");
                
                // Nếu đang ở màn hình làm bài và chưa nộp bài/xem kết quả
                if (lessonScreen && !lessonScreen.classList.contains("hidden") && 
                    practiceTab && !practiceTab.classList.contains("hidden") &&
                    resultBox && resultBox.classList.contains("hidden")) {
                    
                    this.state.distractions += 1;
                    this.saveProgress();
                }
            } else if (document.visibilityState === 'visible') {
                const lessonScreen = document.getElementById("lesson-detail-panel");
                const practiceTab = document.getElementById("tab-practice");
                const resultBox = document.getElementById("practice-result-box");
                
                if (lessonScreen && !lessonScreen.classList.contains("hidden") && 
                    practiceTab && !practiceTab.classList.contains("hidden") &&
                    resultBox && resultBox.classList.contains("hidden")) {
                    
                    // Hiển thị hộp cảnh báo cho học sinh khi quay lại bằng SweetAlert2
                    Swal.fire({
                        icon: 'warning',
                        title: 'Chú ý tập trung con nhé!',
                        text: `Việc chuyển tab hoặc ứng dụng khi đang làm bài tập đã được hệ thống ghi nhận lại để báo cáo cho ${this.config.parentName || 'Phụ huynh'}.`,
                        target: document.getElementById('tab-practice') || 'body',
                        confirmButtonText: 'Con đã rõ và sẽ tập trung học',
                        confirmButtonColor: 'var(--primary)'
                    });
                }
            }
        });
    },

    // Bật tắt chế độ Toàn màn hình
    toggleFullscreen: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Lỗi khi bật toàn màn hình: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    },

    // Lấy ID video YouTube của bài học (ưu tiên ID tùy chỉnh của phụ huynh)
    getLessonVideoId: function(lessonId) {
        if (this.state.customVideos && this.state.customVideos[lessonId]) {
            return this.extractYoutubeId(this.state.customVideos[lessonId]);
        }
        const lesson = getLessonById(lessonId);
        return lesson ? this.extractYoutubeId(lesson.youtubeId) : "";
    },

    // Hàm Regex thông minh tự động trích xuất ID YouTube từ mọi định dạng link phụ huynh dán vào
    extractYoutubeId: function(input) {
        if (!input) return "";
        input = input.trim();
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = input.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        }
        return input; // Trả về nguyên bản nếu người dùng đã nhập đúng ID 11 ký tự
    },

    // Lấy ID video YouTube của Dạng bài học (ưu tiên ID tùy chỉnh của phụ huynh)
    getSubtopicVideoId: function(subtopicId, lessonId) {
        if (this.state.customVideos && this.state.customVideos[subtopicId]) {
            return this.extractYoutubeId(this.state.customVideos[subtopicId]);
        }
        const lesson = getLessonById(lessonId);
        if (lesson && lesson.subtopics) {
            const sub = lesson.subtopics.find(s => s.id === subtopicId);
            if (sub && sub.youtubeId) {
                return this.extractYoutubeId(sub.youtubeId);
            }
        }
        return "";
    },

    // Render trình phát video hoặc khung thông báo dán video
    renderVideoPlayer: function(wrapperId, videoId, idToSave, lessonId) {
        const videoWrapper = document.getElementById(wrapperId);
        if (!videoWrapper) return;

        if (videoId) {
            videoWrapper.innerHTML = `
                <div class="video-thumbnail-overlay" onclick="app.playVideoFullscreen('${videoId}')" title="Bấm vào để xem bài giảng Fullscreen HD">
                    <img class="video-thumb-img" src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video Thumbnail">
                    <div class="video-play-btn-3d">
                        <i class="fa-solid fa-play"></i>
                    </div>
                    <div class="video-play-text">${app.config.studentName || 'Con'} nhấp vào đây để xem Bài giảng Full HD 📺</div>
                </div>
            `;
        } else {
            videoWrapper.innerHTML = `
                <div class="video-no-link-overlay" onclick="app.promptAddVideoId('${idToSave}', '${lessonId}')" title="Nhấp vào đây để thêm video bài giảng">
                    <div style="font-size: 3rem; margin-bottom: 0.8rem; text-shadow: 0 4px 10px rgba(0,0,0,0.15);">📺</div>
                    <div style="font-weight: 700; font-size: 1.05rem; color: var(--primary);">Không có video bài giảng liên kết</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">${app.config.parentName || 'Bố'} hoặc ${app.config.studentName || 'Con'} nhấp vào đây để thêm link bài giảng nhé!</div>
                </div>
            `;
        }
    },

    // Hiển thị hộp thoại SweetAlert2 cho người dùng dán link video và lưu lại
    promptAddVideoId: function(idToSave, lessonId) {
        Swal.fire({
            title: 'Thêm video bài giảng',
            text: 'Dán đường dẫn (link) video YouTube hoặc ID video vào đây:',
            input: 'text',
            inputPlaceholder: 'Ví dụ: https://www.youtube.com/watch?v=...',
            showCancelButton: true,
            confirmButtonText: 'Lưu lại',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: 'var(--text-muted)',
            inputValidator: (value) => {
                if (!value) {
                    return 'Vui lòng nhập đường dẫn hoặc ID video YouTube!'
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const rawInput = result.value;
                const videoId = this.extractYoutubeId(rawInput);
                if (videoId) {
                    this.state.customVideos = this.state.customVideos || {};
                    this.state.customVideos[idToSave] = videoId;
                    this.saveProgress();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Đã lưu video thành công!',
                        text: 'Hệ thống đã cập nhật video bài giảng mới.',
                        confirmButtonColor: 'var(--primary)',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        // Tải lại video hiển thị ngay lập tức
                        const lesson = this.currentLesson;
                        if (lesson) {
                            const hasSub = lesson.subtopics && lesson.subtopics.some(s => s.id === idToSave);
                            if (hasSub) {
                                this.showSubtopicDetail(idToSave);
                            } else {
                                // Đối với bài không chia dạng
                                const curVideoId = this.getLessonVideoId(lesson.id);
                                this.renderVideoPlayer("video-wrapper", curVideoId, lesson.id, lesson.id);
                            }
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi đường dẫn',
                        text: 'Không thể trích xuất ID YouTube từ liên kết này. Vui lòng kiểm tra lại!',
                        confirmButtonColor: 'var(--primary)'
                    });
                }
            }
        });
    },

    // Đồng bộ dữ liệu offline lên server SQLite khi mạng phục hồi hoặc khi load lại
    syncOfflineProgress: async function() {
        const localKey = this.getLocalStorageKey();
        const isDirty = localStorage.getItem(localKey + "_offline_dirty");
        if (isDirty === "true") {
            const rawData = localStorage.getItem(localKey + "_offline_data");
            if (rawData) {
                try {
                    const offlineState = JSON.parse(rawData);
                    console.log(`[Sync] Phát hiện dữ liệu offline chưa đồng bộ (XP: ${offlineState.xp || 0}). Đang đồng bộ lên SQLite...`);
                    const classLevel = this.config.currentClass || '6';
                    const studentId = this.config.defaultStudentId || '';
                    const res = await fetch(this.getApiUrl('/api/save-progress'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ classLevel, studentId, state: offlineState })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        localStorage.removeItem(localKey + "_offline_dirty");
                        localStorage.removeItem(localKey + "_offline_data");
                        if (data && data.state) {
                            this.state = { ...this.state, ...data.state };
                        }
                        console.log("[Sync] Đồng bộ tiến trình offline lên SQLite thành công.");
                    } else {
                        console.warn("[Sync] Server trả về lỗi khi đồng bộ offline:", res.status);
                    }
                } catch(e) {
                    console.error("[Sync] Lỗi trong quá trình đồng bộ offline:", e);
                }
            }
        }
    },

    // Đọc tiến trình từ LocalStorage hoặc SQLite
    loadProgress: async function() {
        try {
            // Đồng bộ dữ liệu offline bẩn lên SQLite trước khi tải dữ liệu mới
            await this.syncOfflineProgress();

            // Đảm bảo state luôn có đầy đủ các trường mặc định từ trước khi load dữ liệu
            this.state = { ...this.getDefaultState(), ...this.state };
            const classLevel = this.config.currentClass || '6';
            const studentId = this.config.defaultStudentId || '';
            
            // Cơ chế tải lại tự động (retry) 3 lần nếu có lỗi kết nối máy chủ khi khởi động
            let res = null;
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
                try {
                    res = await fetch(this.getApiUrl(`/api/load-progress?classLevel=${classLevel}&studentId=${studentId}`));
                    if (res.ok) {
                        break;
                    }
                } catch (err) {
                    console.warn(`[loadProgress] Lần thử ${attempts + 1} nạp dữ liệu thất bại:`, err.message);
                }
                attempts++;
                if (attempts < maxAttempts) {
                    await new Promise(r => setTimeout(r, 800)); // Chờ 800ms rồi thử lại
                }
            }

            let serverData = null;
            if (res && res.ok) {
                serverData = await res.json();
            }

            // Tự động kiểm tra và di chuyển dữ liệu cũ từ LocalStorage nếu có
            const localKey = this.getLocalStorageKey();
            const localRaw = localStorage.getItem(localKey);
            let localData = null;
            if (localRaw) {
                try {
                    localData = JSON.parse(localRaw);
                } catch(e) {}
            }

            let dataToUse = null;
            // Nếu có dữ liệu cục bộ và dữ liệu cục bộ tiến triển hơn (XP cao hơn hoặc có điểm)
            // thì chọn dữ liệu cục bộ để lưu/đồng bộ lên server SQLite
            if (localData && localData.xp > 0 && (!serverData || !serverData.xp || localData.xp > serverData.xp)) {
                console.log(`[Migration] Phát hiện dữ liệu học tập cũ trong trình duyệt (XP: ${localData.xp}). Đang tự động chuyển đổi dữ liệu lên SQLite...`);
                dataToUse = localData;
                this.state = { ...this.state, ...localData };
                await this.saveProgress();
            } else if (serverData && Object.keys(serverData).length > 0) {
                dataToUse = serverData;
                this.state = { ...this.state, ...serverData };
            } else {
                await this.saveProgress();
            }

            if (dataToUse && Object.keys(dataToUse).length > 0) {
                if (!this.state.completedSubtopics || !Array.isArray(this.state.completedSubtopics)) this.state.completedSubtopics = [];
                if (!this.state.subtopicScores || typeof this.state.subtopicScores !== 'object') this.state.subtopicScores = {};
                if (!this.state.completedLessonTheory || !Array.isArray(this.state.completedLessonTheory)) this.state.completedLessonTheory = [];
                if (!this.state.badges || !Array.isArray(this.state.badges)) this.state.badges = [];
                if (!this.state.scores || typeof this.state.scores !== 'object') this.state.scores = {};
                if (!this.state.history || !Array.isArray(this.state.history)) this.state.history = [];

                // Migration: Xóa sạch toàn bộ video cũ ở phần kiến thức chung (chạy 1 lần)
                if (!this.state.cleanedOldTheoryVideos) {
                    if (this.state.customVideos) {
                        COURSE_DATA.forEach(chapter => {
                            chapter.lessons.forEach(lesson => {
                                // Nếu bài học có chia dạng bài
                                if (lesson.subtopics && lesson.subtopics.length > 0) {
                                    // Xóa video bài học chung (kiến thức chung)
                                    if (this.state.customVideos[lesson.id]) {
                                        delete this.state.customVideos[lesson.id];
                                    }
                                }
                            });
                        });
                    }
                    this.state.cleanedOldTheoryVideos = true;
                    await this.saveProgress();
                }

                // Migration: Sửa lỗi chấm sai do đáp án trùng lặp (chạy 1 lần)
                if (!this.state.migratedDuplicateAnswersV5) {
                    this.migrateDuplicateAnswers();
                }

                // Migration V6: Tự động chấm lại toàn bộ các câu trùng đáp án trong lịch sử
                if (!this.state.migratedDuplicateAnswersV6) {
                    this.migrateDuplicateAnswersV6();
                }

                // Migration V7: Tự động sửa lỗi chấm chẵn lẻ và sửa lời giải hiển thị trong lịch sử của bài hoán vị chữ số 3, 8, 0
                if (!this.state.migratedParityBugV7) {
                    this.migrateParityBugV7();
                }

                // Migration V11: Tự động sửa lỗi hiển thị giải thích điền số (Short Answer) bị chấm sai trong lịch sử
                if (!this.state.migratedShortAnswerBugV11) {
                    this.migrateShortAnswerBugV11();
                }

                // Migration V8: Tự động sửa lỗi hiển thị giải thích chi tiết trong lịch sử
                if (!this.state.migratedPregenBugsV8) {
                    this.migratePregenBugsV8();
                }

                // Migration V9: Tự động sửa lỗi hiển thị giải thích chi tiết trong lịch sử (bản sửa đổi regex spacing)
                if (!this.state.migratedPregenBugsV9) {
                    this.migratePregenBugsV9();
                }

                // Migration V10: Reset bài 6 & 7 do thiếu case "thu-tu-phep-tinh" gây sinh câu hỏi sai
                if (!this.state.migratedFixMissingThuTuPhepTinhV10) {
                    this.migrateFixMissingThuTuPhepTinh();
                }
            }
        } catch (e) {
            console.error("Lỗi đọc dữ liệu lưu trữ từ SQLite:", e);
            // Đảm bảo phục hồi trạng thái state mặc định để tránh crash toàn bộ ứng dụng
            this.state = { ...this.getDefaultState(), ...this.state };
        }
    },

    // Ghi tiến trình vào SQLite (có Offline Fallback)
    saveProgress: async function() {
        if (this.isSavingProgress) {
            this.hasPendingSave = true;
            return;
        }
        this.isSavingProgress = true;
        this.hasPendingSave = false;
        
        const localKey = this.getLocalStorageKey();
        const classLevel = this.config.currentClass || '6';
        const studentId = this.config.defaultStudentId || '';

        // Luôn lưu trữ cục bộ trước để làm bản sao lưu an toàn
        try {
            localStorage.setItem(localKey, JSON.stringify(this.state));
        } catch (e) {
            console.warn("Không thể lưu bản sao lưu tiến trình vào localStorage:", e);
        }

        try {
            const res = await fetch(this.getApiUrl('/api/save-progress'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classLevel, studentId, state: this.state })
            });
            if (res.ok) {
                const data = await res.json();
                
                // Đồng bộ thành công -> Xóa cờ dirty offline
                localStorage.removeItem(localKey + "_offline_dirty");
                localStorage.removeItem(localKey + "_offline_data");

                if (data && data.state) {
                    if (!this.hasPendingSave) {
                        this.state = data.state;
                    } else {
                        // Nếu có yêu cầu lưu mới đang chờ, chỉ cập nhật các thay đổi
                        // do server sinh ra (ví dụ: isAudited và câu hỏi đã làm sạch)
                        // để tránh đè mất các dữ liệu mới khác ở client
                        if (data.state.examSessions && this.state.examSessions) {
                            data.state.examSessions.forEach(serverSess => {
                                const clientSess = this.state.examSessions.find(s => s.id === serverSess.id);
                                if (clientSess) {
                                    clientSess.isAudited = serverSess.isAudited;
                                    clientSess.questions = serverSess.questions;
                                }
                            });
                        }
                    }
                }
            } else {
                // Server trả về lỗi (ví dụ 500 SQLITE_BUSY) -> Lưu offline dirty
                console.warn("[Offline Sync] Server không thể lưu dữ liệu, lưu offline để đồng bộ sau.");
                localStorage.setItem(localKey + "_offline_dirty", "true");
                localStorage.setItem(localKey + "_offline_data", JSON.stringify(this.state));
            }
        } catch (e) {
            console.error("Lỗi lưu progress vào SQLite, chuyển sang chế độ lưu offline:", e);
            localStorage.setItem(localKey + "_offline_dirty", "true");
            localStorage.setItem(localKey + "_offline_data", JSON.stringify(this.state));
        } finally {
            this.isSavingProgress = false;
            if (this.hasPendingSave) {
                this.saveProgress();
            }
        }
    },

    // Tự động sửa điểm và bù XP cho các câu bị chấm sai do lỗi trùng đáp án ở bản cũ
    migrateDuplicateAnswers: function() {
        const affectedTypes = ["tap-hop-d1", "tap-hop-d3", "tap-hop-d4", "ghi-so-tu-nhien", "ghi-so-tu-nhien-d1", "ghi-so-tu-nhien-d4", "luy-thua", "dau-hieu-chia-het"];
        let correctedCount = 0;
        
        // 1. Sửa đổi trong lịch sử làm bài tổng quát (history)
        if (this.state.history && this.state.history.length > 0) {
            this.state.history.forEach(item => {
                if (affectedTypes.includes(item.questionType) && !item.isCorrect) {
                    item.isCorrect = true;
                    correctedCount++;
                }
            });
        }

        // 2. Sửa đổi chi tiết trong lịch sử các lượt làm bài (examSessions)
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach(q => {
                        // Nếu câu hỏi thuộc dạng bị ảnh hưởng và học sinh làm sai
                        if (affectedTypes.includes(q.type) && q.userSelectedIndex !== q.correctIndex) {
                            // Kiểm tra xem text lựa chọn của học sinh có trùng khớp với đáp án đúng hay không
                            if (q.options && q.options[q.userSelectedIndex] && q.options[q.correctIndex]) {
                                // Hàm chuẩn hóa chuỗi: loại bỏ khoảng trắng, dấu $, dấu cách, LaTeX, v.v.
                                const clean = (s) => s.toString().replace(/[\$\s\{\}\\\.\,\-\_\'\"]/g, "").toLowerCase();
                                if (clean(q.options[q.userSelectedIndex]) === clean(q.options[q.correctIndex])) {
                                    q.userSelectedIndex = q.correctIndex; // Đặt lại index cho khớp (chuyển thành Đúng)
                                    session.correctCount++;
                                    sessionChanged = true;
                                    correctedCount++;
                                }
                            }
                        }
                    });
                }
                
                if (sessionChanged) {
                    // Tính toán lại điểm số phần trăm của lượt làm bài đó
                    session.scorePercent = Math.round((session.correctCount / session.totalQuestions) * 100);
                    
                    // Cập nhật lại điểm số cao nhất của bài học tương ứng
                    const oldScore = this.state.scores[session.lessonId] || 0;
                    if (session.scorePercent > oldScore) {
                        this.state.scores[session.lessonId] = session.scorePercent;
                    }
                }
            });
        }
        
        // 3. Khôi phục điểm số trên Lộ trình Luyện tập & Khắc phục Điểm yếu
        if (typeof COURSE_DATA !== "undefined") {
            COURSE_DATA.forEach(chapter => {
                chapter.lessons.forEach(lesson => {
                    // Chỉ cập nhật nếu bài học này đã thực sự được làm (có lịch sử trong examSessions)
                    const hasSession = this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lesson.id);
                    if (!hasSession) return;

                    // Nếu bài học chính có questionType bị ảnh hưởng
                    if (affectedTypes.includes(lesson.questionType)) {
                        this.state.scores[lesson.id] = 100;
                    }
                    // Duyệt các dạng bài con (subtopics) để cập nhật subtopicScores
                    if (lesson.subtopics && lesson.subtopics.length > 0) {
                        lesson.subtopics.forEach(sub => {
                            if (affectedTypes.includes(sub.questionType)) {
                                this.state.subtopicScores[sub.id] = 100;
                                if (!this.state.completedSubtopics.includes(sub.id)) {
                                    this.state.completedSubtopics.push(sub.id);
                                }
                                this.state.scores[lesson.id] = 100; // Đặt điểm bài học lên 100%
                            }
                        });
                    }
                });
            });
        }
        
        // 4. Cộng bù điểm XP
        if (correctedCount > 0) {
            this.state.xp += Math.round(correctedCount * 10);
        }
        
        this.state.migratedDuplicateAnswersV5 = true;
        this.saveProgress();
        console.log(`[Migration V5] Đã tự động khôi phục điểm số trên Lộ trình Luyện tập cho các dạng bài bị ảnh hưởng.`);
    },

    migrateDuplicateAnswersV6: function() {
        let correctedCount = 0;
        
        // Hàm chuẩn hóa chuỗi: loại bỏ khoảng trắng, dấu $, dấu cách, LaTeX, v.v.
        const clean = (s) => s.toString().replace(/[\$\s\{\}\\\.\,\-\_\'\"]/g, "").toLowerCase();
        
        // 1. Quét và sửa đổi chi tiết trong lịch sử các lượt làm bài (examSessions)
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach((q, qIdx) => {
                        // Nếu học sinh làm sai
                        if (q.userSelectedIndex !== undefined && q.correctIndex !== undefined && q.userSelectedIndex !== q.correctIndex) {
                            if (q.options && q.options[q.userSelectedIndex] && q.options[q.correctIndex]) {
                                // Rút trích nội dung đáp án (loại bỏ A. B. C. D.)
                                const userOptClean = clean(q.options[q.userSelectedIndex].replace(/^[A-D][\.\)\:\-\s]+/i, ''));
                                const correctOptClean = clean(q.options[q.correctIndex].replace(/^[A-D][\.\)\:\-\s]+/i, ''));
                                
                                // Nếu nội dung đáp án học sinh chọn giống hệt đáp án đúng (do lỗi trùng đáp án)
                                if (userOptClean === correctOptClean) {
                                    q.userSelectedIndex = q.correctIndex; // Chuyển đáp án học sinh chọn thành đúng
                                    session.correctCount++;
                                    sessionChanged = true;
                                    correctedCount++;
                                    
                                    // Tìm và sửa trong lịch sử làm bài tổng quát (history) nếu có bản ghi tương ứng
                                    if (this.state.history && this.state.history.length > 0) {
                                        const histItem = this.state.history.find(h => 
                                            h.lessonId === session.lessonId && 
                                            clean(h.questionText || '') === clean(q.questionText || '') &&
                                            !h.isCorrect
                                        );
                                        if (histItem) {
                                            histItem.isCorrect = true;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                
                if (sessionChanged) {
                    // Tính toán lại điểm số phần trăm của lượt làm bài đó
                    session.scorePercent = Math.round((session.correctCount / session.totalQuestions) * 100);
                    
                    // Cập nhật lại điểm số cao nhất của bài học tương ứng
                    const oldScore = this.state.scores[session.lessonId] || 0;
                    if (session.scorePercent > oldScore) {
                        this.state.scores[session.lessonId] = session.scorePercent;
                    }
                }
            });
        }
        
        // 2. Cộng bù điểm XP
        if (correctedCount > 0) {
            this.state.xp = (this.state.xp || 0) + Math.round(correctedCount * 10);
        }
        
        this.state.migratedDuplicateAnswersV6 = true;
        this.saveProgress();
        console.log(`[Migration V6] Đã tự động khôi phục và chấm lại ${correctedCount} câu hỏi bị lỗi trùng đáp án trong lịch sử.`);
    },

    migrateShortAnswerBugV11: function() {
        let correctedCount = 0;
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    const is18QuestExam = session.totalQuestions === 18;
                    
                    if (is18QuestExam) {
                        let mcqCorrectCount = 0;
                        session.questions.forEach((q, idx) => {
                            if (idx < 12) {
                                if (q.userSelectedIndex === q.correctIndex) {
                                    mcqCorrectCount++;
                                }
                            }
                        });
                        
                        const saCorrectCountNeeded = session.correctCount - mcqCorrectCount;
                        let saCorrectAllocated = 0;

                        session.questions.forEach((q, idx) => {
                            if (idx >= 12) {
                                if (q.isShortAnswer === undefined || q.isShortAnswer === false) {
                                    q.isShortAnswer = true;
                                    sessionChanged = true;
                                }
                                
                                if (q.isCorrect === undefined) {
                                    if (saCorrectAllocated < saCorrectCountNeeded) {
                                        q.isCorrect = true;
                                        q.userShortAnswer = q.options[q.correctIndex] || "";
                                        saCorrectAllocated++;
                                    } else {
                                        q.isCorrect = false;
                                        q.userShortAnswer = "---";
                                    }
                                    sessionChanged = true;
                                    correctedCount++;
                                }
                            }
                        });
                    } else {
                        session.questions.forEach(q => {
                            if (q.isShortAnswer && q.isCorrect === undefined) {
                                q.isCorrect = (q.userShortAnswer !== undefined && q.userShortAnswer !== "") ? 
                                    (q.userShortAnswer === q.options[q.correctIndex]) : false;
                                sessionChanged = true;
                            }
                        });
                    }
                }
            });
        }
        
        this.state.migratedShortAnswerBugV11 = true;
        this.saveProgress();
        console.log(`[Migration V11] Đã khôi phục hiển thị chính xác kết quả đúng/sai cho ${correctedCount} câu hỏi điền số trong lịch sử.`);
    },

    migrateParityBugV7: function() {
        let correctedCount = 0;
        
        // 1. Duyệt qua các examSessions để tìm câu hỏi bị lỗi
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach(q => {
                        // Kiểm tra câu hỏi hoán vị chẵn/lẻ với chữ số 3, 8, 0 cụ thể
                        const isTargetQuestion = q.questionText && 
                            q.questionText.includes("3, 8, 0") && 
                            q.questionText.includes("số chẵn") && 
                            q.questionText.includes("3 chữ số");
                            
                        if (isTargetQuestion) {
                            // Sửa lỗi hiển thị giải thích bằng cách thay thế các chuỗi code thô
                            if (q.solutionHtml) {
                                q.solutionHtml = q.solutionHtml.replace(
                                    /\$\{allPermutations\.map\([\s\S]*?\)\.join\(\', \'\)\}/g,
                                    "$308$, $380$, $803$, $830$"
                                );
                                q.solutionHtml = q.solutionHtml.replace(
                                    /\$\{filteredPerms\.map\([\s\S]*?\)\.join\(\', \'\)\}/g,
                                    "$308$, $380$, $830$"
                                );
                                q.solutionHtml = q.solutionHtml.replace(
                                    /Số nhỏ nhất trong các số chẵn này là 803\./g,
                                    "Số nhỏ nhất trong các số chẵn này là 308."
                                );
                                q.solutionHtml = q.solutionHtml.replace(
                                    /Đáp án đúng là B\./g,
                                    "Đáp án đúng là C."
                                );
                            }

                            // Sửa lại đáp án đúng
                            // Trong options: index 1 là 803 (B), index 2 là 308 (C)
                            // Ta cần đổi correctIndex từ 1 sang 2
                            if (q.correctIndex === 1) {
                                q.correctIndex = 2;
                                
                                // Nếu học sinh đã chọn C (index 2), đổi từ Sai thành Đúng
                                if (q.userSelectedIndex === 2) {
                                    session.correctCount++;
                                    sessionChanged = true;
                                    correctedCount++;
                                    
                                    // Sửa trong lịch sử làm bài tổng quát (history)
                                    if (this.state.history && this.state.history.length > 0) {
                                        const histItem = this.state.history.find(h => 
                                            h.lessonId === session.lessonId && 
                                            !h.isCorrect
                                        );
                                        if (histItem) {
                                            histItem.isCorrect = true;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                
                if (sessionChanged) {
                    // Tính lại điểm phần trăm
                    session.scorePercent = Math.round((session.correctCount / session.totalQuestions) * 100);
                    
                    // Cập nhật điểm cao nhất của bài học tương ứng
                    const oldScore = this.state.scores[session.lessonId] || 0;
                    if (session.scorePercent > oldScore) {
                        this.state.scores[session.lessonId] = session.scorePercent;
                    }
                }
            });
        }
        
        // 2. Cộng bù điểm XP
        if (correctedCount > 0) {
            this.state.xp = (this.state.xp || 0) + Math.round(correctedCount * 10);
        }
        
        this.state.migratedParityBugV7 = true;
        this.saveProgress();
        console.log(`[Migration V7] Đã khắc phục lịch sử lời giải và khôi phục điểm cho ${correctedCount} lượt làm bài.`);
    },

    migratePregenBugsV8: function() {
        let correctedCount = 0;
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach(q => {
                        let qChanged = false;
                        if (!q.solutionHtml) return;

                        // 1. Sửa lỗi Dạng 1: "Thỏa mãn 3 điều kiện"
                        if (q.solutionHtml.includes("thỏa mãn 3 điều kiện")) {
                            const original = q.solutionHtml;
                            // Sửa $X > 48 và $X < 75 $
                            q.solutionHtml = q.solutionHtml.replace(/\$X\s*>\s*(\d+)\s+và\s+\$X\s*<\s*(\d+)\s*\$?/g, "$X > $1$ và $X < $2$");
                            // Sửa tức là $X \in \{$49, ..., $74\}$.
                            q.solutionHtml = q.solutionHtml.replace(/tức là \$X\s*\\in\s*\\\{\$/g, "tức là $X \\in \\{");
                            q.solutionHtml = q.solutionHtml.replace(/tức là \$X\s*\\in\s*\\\{\\\{\$/g, "tức là $X \\in \\{");
                            q.solutionHtml = q.solutionHtml.replace(/,\s*\.\.\.,\s*\$/g, ", ..., ");
                            // Sửa cận dưới: - Cận dưới chung: $\text{max}($49, 54) = 54.
                            q.solutionHtml = q.solutionHtml.replace(/-\s*Cận dưới chung:\s*\$\\text\{max\}\(\$?(\d+),\s*\$?(\d+)\)\s*=\s*(\d+)\.?/g, "- Cận dưới chung: $\\text{max}($1, $2) = $3$.");
                            // Sửa cận trên: - Cận trên chung: $\text{min}(74, 74) = 74.
                            q.solutionHtml = q.solutionHtml.replace(/-\s*Cận trên chung:\s*\$\\text\{min\}\(\$?(\d+),\s*\$?(\d+)\)\s*=\s*(\d+)\.?/g, "- Cận trên chung: $\\text{min}($1, $2) = $3$.");
                            // Sửa Vậy, X phải thỏa mãn 54 \le X \le 74.
                            q.solutionHtml = q.solutionHtml.replace(/Vậy,\s*X\s*phải\s*thỏa\s*mãn\s*(\d+)\s*(?:\\le|\\\\le)\s*X\s*(?:\\le|\\\\le)\s*(\d+)\.?/g, "Vậy, $X$ phải thỏa mãn $$1 \\le X \\le $2$.");
                            // Sửa Liệt kê và kiểm tra: 54, $55, ..., 74.
                            q.solutionHtml = q.solutionHtml.replace(/Liệt kê\s*và\s*kiểm\s*tra:\s*(\d+),\s*\$(\d+),\s*\.\.\.,\s*(\d+)\.?/g, "Liệt kê và kiểm tra: $$1, $2, ..., $3$.");

                            if (q.solutionHtml !== original) qChanged = true;
                        }

                        // 2. Sửa lỗi Dạng 2: "bội của multipleOf"
                        if (q.solutionHtml.includes("là bội của") && q.solutionHtml.includes("dãy số cách đều")) {
                            const original = q.solutionHtml;
                            // Sửa sao cho 73 \le x \le 158
                            q.solutionHtml = q.solutionHtml.replace(/sao cho\s*(\d+)\s*(?:\\le|\\\\le)\s*x\s*(?:\\le|\\\\le)\s*(\d+)/g, "sao cho $$1 \\le x \\le $2$");
                            // Sửa Bội số đầu tiên... là $x_\text{min} = 75.
                            q.solutionHtml = q.solutionHtml.replace(/là\s*\$x_\\?(?:text)?\{min\}\s*=\s*(\d+)/g, "là $x_\\text{min} = $1$");
                            // Sửa Bội số cuối cùng... là $x_\text{max} = 156.
                            q.solutionHtml = q.solutionHtml.replace(/là\s*\$x_\\?(?:text)?\{max\}\s*=\s*(\d+)/g, "là $x_\\text{max} = $1$");
                            // Sửa $(156 - 75) / 3 + 1 = 28 số.
                            q.solutionHtml = q.solutionHtml.replace(/\$\((\d+)\s*-\s*(\d+)\)\s*\/\s*(\d+)\s*\+\s*1\s*=\s*(\d+)\s*số/g, "$($1 - $2) / $3 + 1 = $4$ số");

                            if (q.solutionHtml !== original) qChanged = true;
                        }

                        // 3. Sửa lỗi Dạng 3 & 5 & Dạng bài hoán vị chữ số (allPermutations / filteredPerms un-evaluated)
                        if (q.solutionHtml.includes("Các số có 3 chữ số có thể tạo thành là") && q.questionText) {
                            const original = q.solutionHtml;
                            const matchDigits = q.questionText.match(/chữ số\s*:?\s*(\d+),\s*(\d+),\s*(\d+)/);
                            if (matchDigits) {
                                const d1 = parseInt(matchDigits[1]);
                                const d2 = parseInt(matchDigits[2]);
                                const d3 = parseInt(matchDigits[3]);
                                const isEven = q.questionText.includes("số chẵn") ? 1 : 0;
                                const parityText = isEven ? "chẵn" : "lẻ";

                                // Tính lại allPermutations
                                const perms = [];
                                if (d1 !== 0) perms.push(d1 * 100 + d2 * 10 + d3, d1 * 100 + d3 * 10 + d2);
                                if (d2 !== 0) perms.push(d2 * 100 + d1 * 10 + d3, d2 * 100 + d3 * 10 + d1);
                                if (d3 !== 0) perms.push(d3 * 100 + d1 * 10 + d2, d3 * 100 + d2 * 10 + d1);
                                const allPerms = Array.from(new Set(perms)).sort((a,b)=>a-b);
                                
                                // Tính lại filteredPerms (lọc chẵn/lẻ)
                                const filtPerms = allPerms.filter(num => (isEven ? (num % 2 === 0) : (num % 2 !== 0)));
                                const ansVal = Math.min(...filtPerms);

                                const allPermsText = allPerms.map(num => '$' + num + '$').join(', ');
                                const filtPermsText = filtPerms.map(num => '$' + num + '$').join(', ');

                                // Thay thế template thô
                                q.solutionHtml = q.solutionHtml.replace(/\$\{allPermutations\.map\([\s\S]*?\)\.join\(\', \'\)\}/g, allPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\$\{filteredPerms\.map\([\s\S]*?\)\.join\(\', \'\)\}/g, filtPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{allPermutationsText\}/g, allPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{filteredPermsText\}/g, filtPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{parityText\}/g, parityText);
                                q.solutionHtml = q.solutionHtml.replace(/\{ans\}/g, ansVal);
                                q.solutionHtml = q.solutionHtml.replace(/\{d1\}/g, d1).replace(/\{d2\}/g, d2).replace(/\{d3\}/g, d3);

                                // Sửa lại số nhỏ nhất nếu bị sai số do lỗi chẵn/lẻ
                                const minTextRegex = new RegExp("Số nhỏ nhất trong các số " + parityText + " này là (\\d+)", "g");
                                q.solutionHtml = q.solutionHtml.replace(minTextRegex, "Số nhỏ nhất trong các số " + parityText + " này là " + ansVal);

                                if (q.solutionHtml !== original) qChanged = true;
                            }
                        }

                        // 4. Sửa lỗi Dạng 4: Hộp vật phẩm (allBoxes.filter...)
                        if (q.solutionHtml.includes("Các loại hộp có thể tích lớn hơn") && q.questionText) {
                            const original = q.solutionHtml;
                            // Trích xuất itemSize từ câu hỏi
                            const matchItem = q.questionText.match(/thể tích là (\d+)/);
                            const matchBoxes = q.questionText.match(/thể tích sau:\s*(\d+)\s*cm³,\s*(\d+)\s*cm³,\s*(\d+)\s*cm³,\s*(\d+)\s*cm³/);
                            if (matchItem && matchBoxes) {
                                const itemSize = parseInt(matchItem[1]);
                                const boxes = [
                                    parseInt(matchBoxes[1]),
                                    parseInt(matchBoxes[2]),
                                    parseInt(matchBoxes[3]),
                                    parseInt(matchBoxes[4])
                                ];
                                const sortedAvailable = boxes.filter(b => b > itemSize).sort((a,b)=>a-b);
                                const choicesText = sortedAvailable.map(b => b + ' cm³').join(', ');
                                const ansVal = sortedAvailable[0];

                                // Thay thế template thô
                                q.solutionHtml = q.solutionHtml.replace(/\$\{allBoxes\.filter\([\s\S]*?\)\}/g, choicesText);
                                q.solutionHtml = q.solutionHtml.replace(/\{boxChoicesText\}/g, choicesText);
                                q.solutionHtml = q.solutionHtml.replace(/\{itemSize\}/g, itemSize);
                                q.solutionHtml = q.solutionHtml.replace(/\{ans\}/g, ansVal);

                                if (q.solutionHtml !== original) qChanged = true;
                            }
                        }

                        if (qChanged) {
                            sessionChanged = true;
                            correctedCount++;
                        }
                    });
                }
            });
        }

        this.state.migratedPregenBugsV8 = true;
        this.saveProgress();
        console.log(`[Migration V8] Đã sửa lỗi hiển thị giải thích chi tiết cho ${correctedCount} câu hỏi trong lịch sử.`);
    },

    migratePregenBugsV9: function() {
        let correctedCount = 0;
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach(q => {
                        let qChanged = false;
                        if (!q.solutionHtml) return;

                        // 1. Sửa lỗi Dạng 1: "Thỏa mãn 3 điều kiện"
                        if (q.solutionHtml.includes("thỏa mãn 3 điều kiện")) {
                            const original = q.solutionHtml;
                            // Sửa $X > 48 và $X < 75 $
                            q.solutionHtml = q.solutionHtml.replace(/\$X\s*>\s*(\d+)\s+và\s+\$X\s*<\s*(\d+)\s*\$?/g, "$X > $1$ và $X < $2$");
                            // Sửa tức là $X \in \{$49, ..., $74\}$.
                            q.solutionHtml = q.solutionHtml.replace(/tức là \$X\s*\\in\s*\\\{\$/g, "tức là $X \\in \\{");
                            q.solutionHtml = q.solutionHtml.replace(/tức là \$X\s*\\in\s*\\\{\\\{\$/g, "tức là $X \\in \\{");
                            q.solutionHtml = q.solutionHtml.replace(/,\s*\.\.\.,\s*\$/g, ", ..., ");
                            // Sửa cận dưới: - Cận dưới chung: $\text{max}($49, 54) = 54.
                            q.solutionHtml = q.solutionHtml.replace(/-\s*Cận dưới chung:\s*\$\\text\{max\}\(\$?(\d+),\s*\$?(\d+)\)\s*=\s*(\d+)\.?/g, "- Cận dưới chung: $\\text{max}($1, $2) = $3$.");
                            // Sửa cận trên: - Cận trên chung: $\text{min}(74, 74) = 74.
                            q.solutionHtml = q.solutionHtml.replace(/-\s*Cận trên chung:\s*\$\\text\{min\}\(\$?(\d+),\s*\$?(\d+)\)\s*=\s*(\d+)\.?/g, "- Cận trên chung: $\\text{min}($1, $2) = $3$.");
                            // Sửa Vậy, X phải thỏa mãn 54 \le X \le 74.
                            q.solutionHtml = q.solutionHtml.replace(/Vậy,\s*X\s*phải\s*thỏa\s*mãn\s*(\d+)\s*(?:\\le|\\\\le)\s*X\s*(?:\\le|\\\\le)\s*(\d+)\.?/g, "Vậy, $X$ phải thỏa mãn $$1 \\le X \\le $2$.");
                            // Sửa Liệt kê và kiểm tra: 54, $55, ..., 74.
                            q.solutionHtml = q.solutionHtml.replace(/Liệt kê\s*và\s*kiểm\s*tra:\s*(\d+),\s*\$(\d+),\s*\.\.\.,\s*(\d+)\.?/g, "Liệt kê và kiểm tra: $$1, $2, ..., $3$.");

                            if (q.solutionHtml !== original) qChanged = true;
                        }

                        // 2. Sửa lỗi Dạng 2: "bội của multipleOf"
                        if (q.solutionHtml.includes("là bội của") && q.solutionHtml.includes("dãy số cách đều")) {
                            const original = q.solutionHtml;
                            // Sửa sao cho 73 \le x \le 158
                            q.solutionHtml = q.solutionHtml.replace(/sao cho\s*(\d+)\s*(?:\\le|\\\\le)\s*x\s*(?:\\le|\\\\le)\s*(\d+)/g, "sao cho $$1 \\le x \\le $2$");
                            // Sửa Bội số đầu tiên... là $x_\text{min} = 75.
                            q.solutionHtml = q.solutionHtml.replace(/là\s*\$x_\\?(?:text)?\{min\}\s*=\s*(\d+)/g, "là $x_\\text{min} = $1$");
                            // Sửa Bội số cuối cùng... là $x_\text{max} = 156.
                            q.solutionHtml = q.solutionHtml.replace(/là\s*\$x_\\?(?:text)?\{max\}\s*=\s*(\d+)/g, "là $x_\\text{max} = $1$");
                            // Sửa $(156 - 75) / 3 + 1 = 28 số.
                            q.solutionHtml = q.solutionHtml.replace(/\$\((\d+)\s*-\s*(\d+)\)\s*\/\s*(\d+)\s*\+\s*1\s*=\s*(\d+)\s*số/g, "$($1 - $2) / $3 + 1 = $4$ số");

                            if (q.solutionHtml !== original) qChanged = true;
                        }

                        // 3. Sửa lỗi Dạng 3 & 5 & Dạng bài hoán vị chữ số (allPermutations / filteredPerms un-evaluated)
                        if (q.solutionHtml.includes("Các số có 3 chữ số có thể tạo thành là") && q.questionText) {
                            const original = q.solutionHtml;
                            const matchDigits = q.questionText.match(/chữ số\s*:?\s*(\d+),\s*(\d+),\s*(\d+)/);
                            if (matchDigits) {
                                const d1 = parseInt(matchDigits[1]);
                                const d2 = parseInt(matchDigits[2]);
                                const d3 = parseInt(matchDigits[3]);
                                const isEven = q.questionText.includes("số chẵn") ? 1 : 0;
                                const parityText = isEven ? "chẵn" : "lẻ";

                                // Tính lại allPermutations
                                const perms = [];
                                if (d1 !== 0) perms.push(d1 * 100 + d2 * 10 + d3, d1 * 100 + d3 * 10 + d2);
                                if (d2 !== 0) perms.push(d2 * 100 + d1 * 10 + d3, d2 * 100 + d3 * 10 + d1);
                                if (d3 !== 0) perms.push(d3 * 100 + d1 * 10 + d2, d3 * 100 + d2 * 10 + d1);
                                const allPerms = Array.from(new Set(perms)).sort((a,b)=>a-b);
                                
                                // Tính lại filteredPerms (lọc chẵn/lẻ)
                                const filtPerms = allPerms.filter(num => (isEven ? (num % 2 === 0) : (num % 2 !== 0)));
                                const ansVal = Math.min(...filtPerms);

                                const allPermsText = allPerms.map(num => '$' + num + '$').join(', ');
                                const filtPermsText = filtPerms.map(num => '$' + num + '$').join(', ');

                                // Thay thế template thô
                                q.solutionHtml = q.solutionHtml.replace(/\$\{allPermutations\.map\([\s\S]*?\)\.join\([\s\S]*?\)\}/g, allPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\$\{filteredPerms\.map\([\s\S]*?\)\.join\([\s\S]*?\)\}/g, filtPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{allPermutationsText\}/g, allPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{filteredPermsText\}/g, filtPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{parityText\}/g, parityText);
                                q.solutionHtml = q.solutionHtml.replace(/\{ans\}/g, ansVal);
                                q.solutionHtml = q.solutionHtml.replace(/\{d1\}/g, d1).replace(/\{d2\}/g, d2).replace(/\{d3\}/g, d3);

                                // Sửa lại số nhỏ nhất nếu bị sai số do lỗi chẵn/lẻ
                                const minTextRegex = new RegExp("Số nhỏ nhất trong các số " + parityText + " này là (\\d+)", "g");
                                q.solutionHtml = q.solutionHtml.replace(minTextRegex, "Số nhỏ nhất trong các số " + parityText + " này là " + ansVal);

                                if (q.solutionHtml !== original) qChanged = true;
                            }
                        }

                        // 4. Sửa lỗi Dạng 4: Hộp vật phẩm (allBoxes.filter...)
                        if (q.solutionHtml.includes("Các loại hộp có thể tích lớn hơn") && q.questionText) {
                            const original = q.solutionHtml;
                            // Trích xuất itemSize từ câu hỏi
                            const matchItem = q.questionText.match(/thể tích là (\d+)/);
                            const matchBoxes = q.questionText.match(/thể tích sau:\s*(\d+)\s*cm³,\s*(\d+)\s*cm³,\s*(\d+)\s*cm³,\s*(\d+)\s*cm³/);
                            if (matchItem && matchBoxes) {
                                const itemSize = parseInt(matchItem[1]);
                                const boxes = [
                                    parseInt(matchBoxes[1]),
                                    parseInt(matchBoxes[2]),
                                    parseInt(matchBoxes[3]),
                                    parseInt(matchBoxes[4])
                                ];
                                const sortedAvailable = boxes.filter(b => b > itemSize).sort((a,b)=>a-b);
                                const choicesText = sortedAvailable.map(b => b + ' cm³').join(', ');
                                const ansVal = sortedAvailable[0];

                                // Thay thế template thô
                                q.solutionHtml = q.solutionHtml.replace(/\$\{allBoxes\.filter\([\s\S]*?join\([\s\S]*?\)\}/g, choicesText);
                                q.solutionHtml = q.solutionHtml.replace(/\{boxChoicesText\}/g, choicesText);
                                q.solutionHtml = q.solutionHtml.replace(/\{itemSize\}/g, itemSize);
                                q.solutionHtml = q.solutionHtml.replace(/\{ans\}/g, ansVal);

                                if (q.solutionHtml !== original) qChanged = true;
                            }
                        }

                        if (qChanged) {
                            sessionChanged = true;
                            correctedCount++;
                        }
                    });
                }
            });
        }

        this.state.migratedPregenBugsV9 = true;
        this.saveProgress();
        console.log(`[Migration V9] Đã sửa lỗi hiển thị giải thích chi tiết cho ${correctedCount} câu hỏi trong lịch sử.`);
    },

    // Migration V10: Reset trạng thái bài 6 & 7 do trước đây thiếu case "thu-tu-phep-tinh"
    // khiến Spaced Repetition sinh câu hỏi sai (default "x+5=2"). Xoá session lỗi, reset điểm.
    migrateFixMissingThuTuPhepTinh: function() {
        // Danh sách bài bị ảnh hưởng: bai-6 (luy-thua) bị SR lấy câu sai khi bai-7 đã hoàn thành
        // và bai-7 (thu-tu-phep-tinh) không có câu hỏi đúng chủ đề
        const affectedLessonIds = ["bai-6", "bai-7"];
        const brokenQuestionMarker = "Tìm số nguyên $x$, biết"; // câu hỏi default bị sinh lỗi
        let resetCount = 0;
        let removedSessionCount = 0;

        // 1. Xoá bỏ các examSessions có chứa câu hỏi bị lỗi (default case)
        // Mở rộng: cũng kiểm tra luyện tập chung chương 1 và kiểm tra cuối chương 1
        const affectedSessionLessonIds = [...affectedLessonIds, "lt-c1-1", "lt-c1-2", "kt-c1"];
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            const originalLength = this.state.examSessions.length;
            this.state.examSessions = this.state.examSessions.filter(session => {
                // Giữ lại session không thuộc bài bị ảnh hưởng
                if (!affectedSessionLessonIds.includes(session.lessonId)) return true;
                // Với session thuộc bài bị ảnh hưởng: kiểm tra có câu lỗi không
                const hasBrokenQuestion = session.questions && session.questions.some(q =>
                    q.questionText && q.questionText.includes(brokenQuestionMarker)
                );
                if (hasBrokenQuestion) {
                    removedSessionCount++;
                    return false; // Xoá session lỗi
                }
                return true;
            });
        }

        // 2. Reset điểm, subtopicScores, completedSubtopics cho bài bị ảnh hưởng
        affectedLessonIds.forEach(lessonId => {
            // Reset điểm bài học nếu đang tồn tại
            if (this.state.scores && this.state.scores[lessonId] !== undefined) {
                delete this.state.scores[lessonId];
                resetCount++;
            }
            // Reset điểm các dạng bài (subtopics) của bài bị ảnh hưởng
            if (this.state.subtopicScores) {
                const subtopicKeys = Object.keys(this.state.subtopicScores).filter(k => k.startsWith(lessonId + "-"));
                subtopicKeys.forEach(k => {
                    delete this.state.subtopicScores[k];
                    resetCount++;
                });
            }
            // Xoá khỏi danh sách completedSubtopics
            if (this.state.completedSubtopics) {
                this.state.completedSubtopics = this.state.completedSubtopics.filter(id => !id.startsWith(lessonId + "-"));
            }
        });

        // 3. Xoá history (kết quả câu hỏi) của các câu lỗi thuộc bài bị ảnh hưởng
        if (this.state.history && this.state.history.length > 0) {
            const beforeHistory = this.state.history.length;
            this.state.history = this.state.history.filter(item => {
                if (!affectedLessonIds.includes(item.lessonId)) return true;
                // Giữ lại lịch sử câu hỏi đúng chủ đề (luy-thua, thu-tu-phep-tinh)
                if (item.questionType === "luy-thua" || item.questionType === "thu-tu-phep-tinh") return true;
                // Xoá lịch sử câu hỏi không đúng chủ đề (số nguyên, v.v.)
                return false;
            });
        }

        this.state.migratedFixMissingThuTuPhepTinhV10 = true;
        this.saveProgress();
        if (resetCount > 0 || removedSessionCount > 0) {
            console.log(`[Migration V10] Đã reset ${resetCount} điểm số và xoá ${removedSessionCount} lượt làm bài lỗi của bài 6 & 7. Học sinh có thể làm lại với câu hỏi đúng chủ đề.`);
        } else {
            console.log(`[Migration V10] Kiểm tra hoàn tất. Không tìm thấy dữ liệu lỗi cần reset.`);
        }
    },

    // Kiểm tra và cập nhật Streak (chuỗi ngày học liên tục)
    checkStreak: function() {
        const todayStr = new Date().toDateString();
        
        // Đảm bảo learningTimeWeek luôn được khởi tạo
        if (!this.state.learningTimeWeek) {
            this.state.learningTimeWeek = [0, 0, 0, 0, 0, 0, 0];
        }

        const getMondayOfWeek = (d) => {
            const date = new Date(d);
            const day = date.getDay();
            const diff = date.getDate() - (day === 0 ? 6 : day - 1);
            const monday = new Date(date.setDate(diff));
            monday.setHours(0,0,0,0);
            return monday;
        };

        if (!this.state.lastActiveDate) {
            this.state.streak = 1;
            this.state.lastActiveDate = todayStr;
        } else {
            const lastActive = new Date(this.state.lastActiveDate);
            const today = new Date(todayStr);

            // Tự động kiểm tra và reset thời gian học trong tuần nếu bước sang tuần mới
            const mondayLastActive = getMondayOfWeek(lastActive);
            const mondayToday = getMondayOfWeek(today);
            if (mondayLastActive.toDateString() !== mondayToday.toDateString()) {
                console.log("[Gamification] Phát hiện tuần học mới. Đang tự động reset thời gian học trong tuần...");
                this.state.learningTimeWeek = [0, 0, 0, 0, 0, 0, 0];
            }

            const diffTime = today - lastActive;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Ngày tiếp theo liên tục
                this.state.streak += 1;
                this.state.lastActiveDate = todayStr;
                
                // Kiểm tra huy hiệu Streak 3
                if (this.state.streak >= 3) {
                    this.unlockBadge("streak-3");
                }
            } else if (diffDays > 1) {
                // Đứt streak, reset về 1
                this.state.streak = 1;
                this.state.lastActiveDate = todayStr;
            }
            // Nếu diffDays === 0 thì giữ nguyên streak trong ngày
        }
        this.saveProgress();
    },

    // Lấy danh sách các bài học đã hoàn thành (score >= 80%)
    getCompletedLessons: function() {
        const list = [];
        for (const lessonId in this.state.scores) {
            if (this.state.scores[lessonId] >= 80) {
                list.push(lessonId);
            }
        }
        return list;
    },

    // Lấy trạng thái của một bài học (locked, active, completed)
    getLessonStatus: function(lessonId) {
        const currentClass = this.config.currentClass || "6";
        const flatLessons = [];
        COURSE_DATA
            .filter(chapter => (chapter.class || "6") === currentClass)
            .forEach(chapter => {
                chapter.lessons.forEach(l => flatLessons.push(l.id));
            });

        const idx = flatLessons.indexOf(lessonId);
        if (idx === -1) return 'locked';

        if (idx === 0) {
            // Bài đầu tiên luôn được mở khóa
            const score = this.state.scores[lessonId] || 0;
            return score >= 80 ? 'completed' : 'active';
        }

        // Duyệt tuyến tính từ đầu lộ trình đến bài học hiện tại để xác định trạng thái mở khóa chính xác
        let currentStatus = 'completed';
        for (let i = 0; i <= idx; i++) {
            const lid = flatLessons[i];
            const score = this.state.scores[lid] || 0;
            if (i === 0) {
                currentStatus = score >= 80 ? 'completed' : 'active';
            } else {
                if (currentStatus === 'completed') {
                    currentStatus = score >= 80 ? 'completed' : 'active';
                } else {
                    currentStatus = 'locked';
                }
            }
            
            // Trả về trạng thái khi duyệt đến bài học cần truy vấn
            if (i === idx) {
                return currentStatus;
            }
        }
        return 'locked';
    },

    // Cập nhật các chỉ số hiển thị trên Header
    updateHeaderStats: function() {
        document.getElementById("streak-val").innerText = this.state.streak;
        document.getElementById("xp-val").innerText = this.state.xp;
        document.getElementById("badge-count").innerText = this.state.badges.length;
    },

    // Dựng giao diện Học kỳ và Timeline dọc (VioEdu style)
    switchSemester: function(semester) {
        this.currentSemester = semester;
        document.getElementById("sem-tab-1").classList.toggle("active", semester === 1);
        document.getElementById("sem-tab-2").classList.toggle("active", semester === 2);
        this.renderTimeline();
    },

    // Tìm bài học đang làm hiện tại (bài active đầu tiên)
    getActiveLesson: function() {
        const currentClass = this.config.currentClass || "6";
        const classChapters = COURSE_DATA.filter(
            chapter => (chapter.class || "6") === currentClass
        );

        let firstUncompleted = null;
        for (const chapter of classChapters) {
            for (const lesson of chapter.lessons) {
                const status = this.getLessonStatus(lesson.id);
                if (status === 'active') {
                    return { lesson, semester: chapter.semester };
                }
                if (status !== 'completed' && !firstUncompleted) {
                    firstUncompleted = { lesson, semester: chapter.semester };
                }
            }
        }

        if (firstUncompleted) {
            return firstUncompleted;
        }

        // Nếu tất cả đã hoàn thành, trả về bài học cuối cùng của lớp hiện tại
        const lastChapter = classChapters[classChapters.length - 1];
        if (lastChapter && lastChapter.lessons && lastChapter.lessons.length > 0) {
            const lastLesson = lastChapter.lessons[lastChapter.lessons.length - 1];
            return { lesson: lastLesson, semester: lastChapter.semester };
        }
        return null;
    },

    // Cuộn mượt mà đến bài học đang làm và tự động chuyển học kỳ nếu cần
    scrollToActiveLesson: function() {
        const activeInfo = this.getActiveLesson();
        if (!activeInfo || !activeInfo.lesson) return;

        const lessonId = activeInfo.lesson.id;
        const targetSemester = activeInfo.semester;

        // Nếu học kỳ của bài học đang làm khác học kỳ hiện tại, tự động chuyển tab
        if (this.currentSemester !== targetSemester) {
            this.switchSemester(targetSemester);
        }

        // Đợi DOM render ổn định rồi cuộn
        setTimeout(() => {
            const activeBtn = document.getElementById(`node-${lessonId}`);
            if (activeBtn) {
                activeBtn.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 150);
    },

    // Dựng giao diện Timeline lộ trình học (Skill Tree)
    renderTimeline: function() {
        const container = document.getElementById("skill-tree-container");
        container.innerHTML = "";

        // Lọc các chương thuộc học kỳ hiện tại
        const chapters = COURSE_DATA.filter(chapter => chapter.semester === this.currentSemester && (chapter.class || "6") === this.config.currentClass);

        chapters.forEach(chapter => {
            const chapterDiv = document.createElement("div");
            chapterDiv.className = "timeline-chapter";

            // Tạo Header cho chương
            const headerDiv = document.createElement("div");
            headerDiv.className = "chapter-header";
            headerDiv.innerHTML = `
                <h3>${chapter.title}</h3>
                <p>${chapter.subtitle}</p>
            `;
            chapterDiv.appendChild(headerDiv);

            // Tạo các node bài học
            const nodesDiv = document.createElement("div");
            nodesDiv.className = "chapter-nodes";

            chapter.lessons.forEach((lesson, index) => {
                const status = this.getLessonStatus(lesson.id); // locked, active, completed
                const score = this.state.scores[lesson.id] || 0;

                const nodeWrapper = document.createElement("div");
                nodeWrapper.className = "lesson-node-wrapper";

                let iconClass = "fa-solid fa-lock";
                let badgeCrown = "";

                if (status === "completed") {
                    iconClass = "fa-solid fa-crown";
                    badgeCrown = `<div class="completed-crown">👑</div>`;
                } else if (status === "active") {
                    iconClass = "fa-solid fa-book-open-reader";
                }

                // Nhãn hiển thị trạng thái VioEdu style
                let statusBadgeHtml = "";
                if (status === 'locked') {
                    statusBadgeHtml = `<span class="lesson-item-status-badge status-unstarted"><i class="fa-solid fa-lock"></i> Chưa mở</span>`;
                } else if (score === 0) {
                    statusBadgeHtml = `<span class="lesson-item-status-badge status-unstarted"><i class="fa-solid fa-circle"></i> Chưa học</span>`;
                } else if (score < 80) {
                    statusBadgeHtml = `<span class="lesson-item-status-badge status-learning"><i class="fa-solid fa-spinner"></i> Đang học (${score}%)</span>`;
                } else {
                    statusBadgeHtml = `<span class="lesson-item-status-badge status-passed"><i class="fa-solid fa-circle-check"></i> Đã đạt (${score}%)</span>`;
                }

                nodeWrapper.innerHTML = `
                    <div class="node-anchor">
                        <button class="node-btn ${status}" id="node-${lesson.id}" onclick="app.handleLessonNodeClick('${lesson.id}', '${status}')">
                           ${badgeCrown}
                           <i class="${iconClass}"></i>
                        </button>
                        <div class="node-label" onclick="app.handleLessonLabelClick('${lesson.id}', '${status}')">
                            <div style="font-weight:800; font-size:0.9rem;">${lesson.title}</div>
                            ${statusBadgeHtml}
                        </div>
                    </div>
                `;
                nodesDiv.appendChild(nodeWrapper);
            });

            chapterDiv.appendChild(nodesDiv);
            container.appendChild(chapterDiv);
        });
    },

    // Điều phối SPA hiển thị màn hình mong muốn
    showScreen: function(screenName) {
        // Tắt mọi chế độ Focus Mode khi đổi trang
        document.body.classList.remove("focus-mode-active");

        // Dừng game nếu rời màn hình học tập
        if (screenName !== 'lesson') {
            if (window.game && game.isPlaying) {
                game.stop();
            }
        }

        // Khôi phục thanh cuộn cho body và html phòng trường hợp bị kẹt
        this.restoreScrollbar();

        // Ẩn/Hiện nút Quay lại ở Header
        const backBtn = document.getElementById("header-back-btn");
        if (backBtn) {
            if (screenName === 'timeline') {
                backBtn.classList.add("hidden");
            } else {
                backBtn.classList.remove("hidden");
            }
        }

        const screens = ['timeline', 'parent'];
        screens.forEach(s => {
            const elem = document.getElementById(`screen-${s}`);
            if (elem) {
                if (s === (screenName === 'lesson' ? 'timeline' : screenName)) {
                    elem.classList.remove("hidden");
                } else {
                    elem.classList.add("hidden");
                }
            }
        });

        // Nếu quay lại timeline thì dựng lại để cập nhật trạng thái mở khóa
        if (screenName === 'timeline') {
            document.getElementById("welcome-viewer-panel").classList.remove("hidden");
            document.getElementById("lesson-detail-panel").classList.add("hidden");

            // Reset tab về Lý thuyết để lần mở bài tiếp theo hiển thị video & dạng bài
            const theoryBtn = document.getElementById("tab-theory-btn");
            const practiceBtn = document.getElementById("tab-practice-btn");
            const historyBtn = document.getElementById("tab-history-btn");
            const theoryPane = document.getElementById("tab-theory");
            const practicePane = document.getElementById("tab-practice");
            const historyPane = document.getElementById("tab-history");
            if (theoryBtn) theoryBtn.classList.add("active");
            if (practiceBtn) practiceBtn.classList.remove("active");
            if (historyBtn) historyBtn.classList.remove("active");
            if (theoryPane) theoryPane.classList.remove("hidden");
            if (practicePane) practicePane.classList.add("hidden");
            if (historyPane) historyPane.classList.add("hidden");
            
            // Tự động tìm học kỳ của bài đang làm và switch sang đó nếu khác học kỳ hiện tại
            const activeInfo = this.getActiveLesson();
            if (activeInfo && this.currentSemester !== activeInfo.semester) {
                this.switchSemester(activeInfo.semester); // Hàm này đã tự gọi renderTimeline()
            } else {
                this.renderTimeline();
            }
            
            this.updateHeaderStats();
            document.getElementById("video-wrapper").innerHTML = "";
            
            // Cuộn tự động đến bài học đang làm
            this.scrollToActiveLesson();
        }

        if (screenName === 'lesson') {
            document.getElementById("welcome-viewer-panel").classList.add("hidden");
            document.getElementById("lesson-detail-panel").classList.remove("hidden");
        }
        
        // Nếu vào màn hình parent và đã xác thực, vẽ lại biểu đồ
        if (screenName === 'parent') {
            if (typeof parentDashboard !== 'undefined' && typeof parentDashboard.onScreenLoad === 'function') {
                parentDashboard.onScreenLoad();
            }
        }
    },

    // Quay lại màn hình trước
    goBack: function() {
        this.showScreen('timeline');
    },

    // Xử lý click nhãn bài học trên timeline (mở bài hoặc hỏi mã PIN nếu bị khóa)
    handleLessonLabelClick: function(lessonId, status) {
        if (status === 'locked') {
            Swal.fire({
                title: 'Bài học chưa mở 🔑',
                text: 'Nhập mật mã phụ huynh để mở khóa tạm thời bài học này (phục vụ in đề hoặc học thử):',
                input: 'password',
                inputPlaceholder: 'Nhập mật mã phụ huynh...',
                showCancelButton: true,
                confirmButtonColor: 'var(--primary)',
                cancelButtonColor: 'var(--danger)',
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy bỏ'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const pin = result.value;
                    try {
                        const res = await fetch(app.getApiUrl("/api/verify-pin"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ pin })
                        });
                        if (res.ok) {
                            // Mở khóa tạm thời bài này bằng cách startLesson
                            this.startLesson(lessonId);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Mật mã không đúng',
                                text: 'Mật mã phụ huynh nhập vào không chính xác!'
                            });
                        }
                    } catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi kết nối',
                            text: 'Không thể kết nối tới máy chủ.'
                        });
                    }
                }
            });
            return;
        }
        this.startLesson(lessonId);
    },

    // Xử lý click nút tròn bài học trên timeline
    handleLessonNodeClick: function(lessonId, status) {
        if (status === 'locked') {
            this.handleLessonLabelClick(lessonId, status);
            return;
        }
        this.startLesson(lessonId);
    },

    // Kích hoạt khi học sinh click vào bài học
    startLesson: function(lessonId) {
        const lesson = getLessonById(lessonId);
        if (!lesson) return;

        this.currentLesson = lesson;
        this.currentSubtopicId = null; // Reset dạng bài đang học của bài cũ
        document.getElementById("current-lesson-title").innerText = `${lesson.chapterTitle} - ${lesson.title}`;
        
        // Gọi API sinh ngầm đề thi Chất lượng cao bằng AI để tránh độ trễ
        fetch(this.getApiUrl('/api/pre-generate-questions'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                classLevel: this.config.currentClass || '6'
            })
        }).then(res => res.json())
          .then(data => {
              console.log('[AI Pre-generate]', data.message);
          })
          .catch(err => {
              console.error('[AI Pre-generate Error]', err);
          });

        // Tự động co gọn lộ trình học khi chọn bài học
        this.collapseSidebar();

        // Luôn mở tab Lý thuyết khi chọn bài từ màn hình chào mừng bên phải
        const openingFromWelcome = document.getElementById("lesson-detail-panel").classList.contains("hidden");

        // Hiển thị panel chi tiết bài học trước khi nạp nội dung tab
        this.showScreen('lesson');

        // Nạp video bài học hoặc dạng bài đầu tiên (Nếu có subtopics thì video của dạng đầu sẽ tự được nạp khi switch sang tab 'theory')
        const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;
        if (!hasSubtopics) {
            const videoId = this.getLessonVideoId(lesson.id);
            this.renderVideoPlayer("video-wrapper", videoId, lesson.id, lesson.id);
        }

        // Giữ nguyên tab hiện tại khi đổi bài trong cùng phiên học
        let activeTab = 'theory';
        if (!openingFromWelcome) {
            if (document.getElementById("tab-practice-btn").classList.contains("active")) {
                activeTab = 'practice';
            } else if (document.getElementById("tab-history-btn").classList.contains("active")) {
                activeTab = 'history';
            }
        }
        this.switchLessonTab(activeTab);

        // Phân tích kết quả học và cập nhật box Đánh giá nổi bật ở cột phải
        this.updateLessonEvaluation(lessonId);

        // Hiển thị lịch sử làm bài cho bài học này
        this.renderLessonHistory(lessonId);

        // Ghi nhận thời gian học (Dashboard phụ huynh): giả lập 5 phút cho mỗi lần click học bài lý thuyết
        this.logLearningTime(5);
    },

    // Chuyển đổi qua lại giữa Tab Lý thuyết, Thực hành và Lịch sử
    switchLessonTab: function(tabName, isDirectClick = true) {
        // Khôi phục thanh cuộn khi chuyển tab phòng trường hợp bị kẹt từ chế độ luyện tập
        this.restoreScrollbar();

        const theoryBtn = document.getElementById("tab-theory-btn");
        const practiceBtn = document.getElementById("tab-practice-btn");
        const historyBtn = document.getElementById("tab-history-btn");
        
        const theoryPane = document.getElementById("tab-theory");
        const practicePane = document.getElementById("tab-practice");
        const historyPane = document.getElementById("tab-history");

        theoryBtn.classList.toggle("active", tabName === 'theory');
        practiceBtn.classList.toggle("active", tabName === 'practice');
        historyBtn.classList.toggle("active", tabName === 'history');

        theoryPane.classList.toggle("hidden", tabName !== 'theory');
        practicePane.classList.toggle("hidden", tabName !== 'practice');
        historyPane.classList.toggle("hidden", tabName !== 'history');

        // Dừng phát video bài giảng khi học sinh rời tab lý thuyết
        if (tabName !== 'theory') {
            this.stopVideo();
        }

        // Dừng game khi học sinh rời tab thực hành
        if (tabName !== 'practice') {
            if (window.game && game.isPlaying) {
                game.stop();
            }
        }

        if (tabName === 'theory') {
            this.renderSubtopicsTimeline();
        } else if (tabName === 'practice') {
            // Ẩn tất cả các box trong tab practice trước
            document.getElementById("practice-locked-warning-box").classList.add("hidden");
            document.getElementById("practice-lesson-exam-intro-box").classList.add("hidden");
            document.getElementById("practice-level-select-box").classList.add("hidden");
            document.getElementById("practice-exam-intro-box").classList.add("hidden");
            document.getElementById("practice-active-box").classList.add("hidden");
            document.getElementById("practice-result-box").classList.add("hidden");
            document.getElementById("practice-mode-select-box").classList.add("hidden");
            const dbBox = document.getElementById("practice-levels-dashboard-box");
            if (dbBox) dbBox.classList.add("hidden");

            if (!isDirectClick) {
                // Nếu không phải click trực tiếp (được chuyển hướng từ nút Luyện tập dạng bài)
                // Hiển thị ngay màn hình làm bài đang chuẩn bị nạp
                document.getElementById("practice-active-box").classList.remove("hidden");
            } else {
                const lesson = this.currentLesson;
                const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;

                if (hasSubtopics) {
                    // Kiểm tra xem đã học lý thuyết chưa
                    const theoryCompleted = this.state.completedLessonTheory && this.state.completedLessonTheory.includes(lesson.id);
                    const isLessonPassed = (this.state.scores[lesson.id] || 0) >= 80;

                    if (!theoryCompleted && !isLessonPassed) {
                        const lockedWarning = document.getElementById("practice-locked-warning-box");
                        if (lockedWarning) {
                            const p = lockedWarning.querySelector("p");
                            if (p) p.innerHTML = `${this.config.studentName} ơi, con cần học phần <b>Kiến thức giáo khoa (Lý thuyết)</b> ở tab <b>Lý thuyết & Video</b> trước để mở khóa phần Luyện tập của bài học này nhé!`;
                            lockedWarning.classList.remove("hidden");
                        }
                    } else {
                        // Đã học lý thuyết -> Hiển thị Dashboard 3 cấp độ
                        this.renderPracticeDashboard();
                    }
                } else {
                    // Các bài luyện tập chung hoặc kiểm tra chương
                    const isExam = lesson.questionType.startsWith("cuoi-chuong") || lesson.id.startsWith("kt-");
                    if (isExam) {
                        document.getElementById("practice-exam-intro-box").classList.remove("hidden");
                        document.getElementById("exam-intro-title").innerText = `Bài kiểm tra kết thúc: ${lesson.chapterTitle || "Chương"}`;
                        document.getElementById("exam-intro-desc").innerText = `Bài thi kiểm tra tổng hợp kiến thức của ${lesson.chapterTitle || "Chương"} bao gồm các câu hỏi từ cơ bản, nâng cao đến khó.`;
                    } else {
                        // Luyện tập chung không có subtopics: Hiển thị Dashboard 3 cấp độ luôn
                        this.renderPracticeDashboard();
                    }
                }
            }
        } else if (tabName === 'history') {
            this.renderLessonHistory(this.currentLesson.id);
        }
    },

    // Hàm phân tích kết quả học của học sinh đối với bài đang chọn và đưa ra Đánh giá phân tích nổi bật
    updateLessonEvaluation: function(lessonId) {
        const evalBox = document.getElementById("lesson-evaluation-box");
        evalBox.className = "evaluation-box card"; // reset class

        // Tổng hợp điểm cao nhất từ MỌI nguồn lưu trữ để tránh hiển thị "Bài học mới" khi học sinh
        // đã làm dạng bài (subtopicScores) nhưng chưa làm luyện tập chung (scores[lessonId])
        const lessonScore = this.state.scores[lessonId] || 0;

        // Điểm từ subtopicScores (luyện tập dạng bài)
        let subtopicMaxScore = 0;
        const _evalLesson = getLessonById(lessonId);
        if (_evalLesson && _evalLesson.subtopics && _evalLesson.subtopics.length > 0 && this.state.subtopicScores) {
            _evalLesson.subtopics.forEach(sub => {
                subtopicMaxScore = Math.max(subtopicMaxScore, this.state.subtopicScores[sub.id] || 0);
            });
        }

        // Điểm từ levelScores (luyện tập cấp độ chung)
        let levelMaxScore = 0;
        if (this.state.levelScores) {
            ['co-ban', 'nang-cao', 'kho', 'chat-luong-cao'].forEach(lvl => {
                levelMaxScore = Math.max(levelMaxScore, this.state.levelScores[`${lessonId}_${lvl}`] || 0);
            });
        }

        // Điểm từ examSessions (tất cả lượt làm bài đã ghi nhận)
        const sessionMaxScore = (this.state.examSessions || [])
            .filter(s => s.lessonId === lessonId)
            .reduce((max, s) => Math.max(max, s.scorePercent || 0), 0);

        const maxScore = Math.max(lessonScore, subtopicMaxScore, levelMaxScore, sessionMaxScore);

        const history = this.state.history || [];
        const lessonHistory = history.filter(h => h.lessonId === lessonId);

        const _studentName = this.config.studentName || 'Con';
        const _parentName = this.config.parentName || 'Bố';
        let evalHtml = "";

        if (maxScore === 0) {
            evalBox.classList.add("new-lesson");
            evalHtml = `
                <div class="eval-title"><i class="fa-solid fa-star" style="color: var(--blue-app);"></i> Bài học mới dành cho ${_studentName}!</div>
                <div class="eval-desc">${_studentName} chưa làm bài luyện tập nào cho bài học này. Con hãy xem kỹ video bài giảng, ôn tập lý thuyết tóm tắt bên dưới, sau đó bắt đầu làm bài luyện tập cấp độ <b>Cơ bản</b> nhé. ${_parentName} chúc con học tốt và đạt điểm cao!</div>
            `;
        } else if (maxScore < 70) {
            evalBox.classList.add("needs-improvement");
            
            // Tìm dạng lỗi con hay gặp nhất (nếu có)
            let weakText = "";
            if (lessonHistory.length > 0) {
                const incorrectTypes = lessonHistory.filter(h => !h.isCorrect).map(h => h.questionType);
                if (incorrectTypes.length > 0) {
                    const counts = {};
                    incorrectTypes.forEach(t => counts[t] = (counts[t] || 0) + 1);
                    const mostIncorrect = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
                    let skillName = "kỹ năng làm bài";
                    if (typeof parentDashboard !== 'undefined' && parentDashboard.skillNames && parentDashboard.skillNames[mostIncorrect]) {
                        skillName = parentDashboard.skillNames[mostIncorrect];
                    } else if (typeof COURSE_DATA !== 'undefined') {
                        const foundLesson = COURSE_DATA.flatMap(c => c.lessons).find(l => l.questionType === mostIncorrect);
                        if (foundLesson) {
                            skillName = foundLesson.title.split(': ')[1] || foundLesson.title;
                        }
                    }
                    weakText = ` Con còn hay làm nhầm ở phần <b>${skillName}</b>.`;
                }
            }

            evalHtml = `
                <div class="eval-title"><i class="fa-solid fa-circle-exclamation"></i> Cần cải thiện điểm số con nhé! (Điểm cao nhất: ${maxScore}%)</div>
                <div class="eval-desc">${_studentName} đang gặp một chút khó khăn ở bài học này.${weakText} Con hãy dành 10 phút xem lại video bài giảng và đọc lời giải chi tiết của các câu đã làm sai, sau đó luyện tập lại để nâng điểm số nhé. ${_parentName} luôn đồng hành và tin tưởng con!</div>
            `;
        } else if (maxScore < 80) {
            evalBox.classList.add("good");
            evalHtml = `
                <div class="eval-title"><i class="fa-solid fa-thumbs-up"></i> Con làm bài khá tốt! (Điểm cao nhất: ${maxScore}%)</div>
                <div class="eval-desc">${_studentName} làm bài tập đạt kết quả khá rồi. Tuy nhiên, con cần đạt từ <b>80% trở lên</b> để mở khóa bài học tiếp theo. Con hãy ôn lại bài và thử sức lại một lần nữa để đạt điểm Giỏi/Xuất sắc nhé. ${_parentName} tin con chắc chắn sẽ làm được!</div>
            `;
        } else {
            evalBox.classList.add("excellent");
            evalHtml = `
                <div class="eval-title"><i class="fa-solid fa-crown" style="color: #FFD700;"></i> ${_parentName} chúc mừng ${_studentName}! Hoàn thành xuất sắc! (Điểm cao nhất: ${maxScore}%)</div>
                <div class="eval-desc">Tuyệt vời ${_studentName}! Con đã hoàn thành xuất sắc bài học này và mở khóa bài mới. Hãy thử thách thêm bản thân ở các cấp độ khó hơn như <b>Nâng cao</b> hoặc <b>Khó</b> để tích lũy thật nhiều XP và nhận huy hiệu danh giá nhé!</div>
            `;
        }

        evalBox.innerHTML = evalHtml;
    },

    // Hiển thị lịch sử làm bài bài học này
    renderLessonHistory: function(lessonId) {
        const listContainer = document.getElementById("lesson-history-list");
        listContainer.innerHTML = "";

        const sessions = this.state.examSessions || [];
        const lessonSessions = sessions.filter(s => s.lessonId === lessonId).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (lessonSessions.length === 0) {
            listContainer.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:1.5rem;font-size:0.9rem;"><i class="fa-solid fa-folder-open"></i> ${this.config.studentName || 'Con'} chưa làm bài tập/kiểm tra bài này.</p>`;
            return;
        }

        lessonSessions.forEach(sess => {
            const dateObj = new Date(sess.date);
            const dateStr = dateObj.toLocaleDateString("vi-VN") + " " + dateObj.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'});
            
            const isPassed = sess.scorePercent >= 80;

            // --- Phân loại loại bài và nhãn hiển thị ---
            // Hỗ trợ cả dữ liệu cũ (chỉ có isExam) và dữ liệu mới (có isLessonExam, isSubtopicPractice...)
            let sessionTypeLabel = "";
            let sessionTypeStyle = "";
            let sessionMainTitle = "Luyện tập";

            if (sess.isExam) {
                // Thi cuối chương
                sessionTypeLabel = "Thi cuối chương 📋";
                sessionTypeStyle = `style="background-color: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger); font-weight:700;"`;
                sessionMainTitle = "Bài thi";
            } else if (sess.isLessonExam) {
                // Kiểm tra tổng thể bài học (Thử thách)
                sessionTypeLabel = "⚡ Kiểm tra tổng thể";
                sessionTypeStyle = `style="background-color: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid #ef4444; font-weight:700;"`;
                sessionMainTitle = "Kiểm tra tổng thể";
            } else if (sess.isSubtopicPractice) {
                // Luyện tập theo Dạng bài
                const dTitle = sess.subtopicTitle || "Dạng bài";
                const prefix = sess.isWeaknessPractice ? "🎯 Luyện điểm yếu: " : "📚 Dạng bài: ";
                sessionTypeLabel = prefix + dTitle;
                sessionTypeStyle = sess.isWeaknessPractice
                    ? `style="background-color: rgba(245,158,11,0.15); color: #d97706; border: 1px solid #d97706; font-weight:700;"`
                    : `style="background-color: var(--primary-bg); color: var(--primary); border: 1px solid var(--primary); font-weight:700;"`;
                sessionMainTitle = sess.isWeaknessPractice ? "Luyện điểm yếu AI" : "Luyện tập Dạng bài";
            } else if (sess.isWeaknessPractice) {
                // Luyện điểm yếu không phải subtopic
                sessionTypeLabel = "🎯 Luyện điểm yếu AI";
                sessionTypeStyle = `style="background-color: rgba(245,158,11,0.15); color: #d97706; border: 1px solid #d97706; font-weight:700;"`;
                sessionMainTitle = "Luyện điểm yếu AI";
            } else {
                // Luyện tập cấp độ thường (cũng xử lý dữ liệu cũ chỉ có isExam=false)
                const levelLabel = sess.level === 'co-ban' ? 'Cơ bản 🌱' :
                    (sess.level === 'nang-cao' ? 'Nâng cao 🚀' :
                    (sess.level === 'kho' ? 'Khó 🔥' :
                    (sess.level === 'chat-luong-cao' ? 'Chất lượng cao 💎' : (sess.level || 'Luyện tập'))));
                const levelClass = sess.level === 'co-ban' ? 'success' :
                    (sess.level === 'nang-cao' ? 'warning' :
                    (sess.level === 'kho' ? 'danger' : 'info'));
                sessionTypeLabel = levelLabel;
                sessionTypeStyle = sess.level === 'chat-luong-cao'
                    ? `style="background-color: rgba(139,92,246,0.15); color: #8b5cf6; border: 1px solid #8b5cf6; font-weight:700;"`
                    : `style="background-color: var(--${levelClass}-bg); color: var(--${levelClass}); border: 1px solid var(--${levelClass}); font-weight:700;"`;
                sessionMainTitle = "Luyện tập";
            }

            const itemDiv = document.createElement("div");
            itemDiv.className = "session-history-item";
            itemDiv.innerHTML = `
                <div class="sess-info-left">
                    <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                        <span class="sess-title-main">${sessionMainTitle}</span>
                        <span class="sess-badge-level" ${sessionTypeStyle}>${sessionTypeLabel}</span>
                    </div>
                    <span class="sess-time-meta"><i class="fa-solid fa-calendar-day"></i> ${dateStr} | <i class="fa-solid fa-stopwatch"></i> ${sess.timeSpent}s | <i class="fa-solid fa-triangle-exclamation"></i> ${sess.distractions || 0} lần chuyển tab</span>
                </div>
                <div class="sess-result-right">
                    <span class="sess-score-percent ${isPassed ? 'passed' : 'failed'}">${sess.scorePercent}%</span>
                    <button class="btn-sess-review" onclick="app.openReviewSession('${sess.id}')">
                        Xem bài làm
                    </button>
                </div>
            `;
            listContainer.appendChild(itemDiv);
        });
    },


    // Mở modal xem lại chi tiết bài làm của một lượt thi/luyện tập
    openReviewSession: function(sessionId) {
        const sessions = this.state.examSessions || [];
        const sess = sessions.find(s => s.id === sessionId);
        if (!sess) return;

        const modalTitle = document.getElementById("review-session-title");
        const modalBody = document.getElementById("review-session-body");

        const dateObj = new Date(sess.date);
        const dateStr = dateObj.toLocaleDateString("vi-VN") + " " + dateObj.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'});

        modalTitle.innerText = `📝 Lịch sử bài làm: ${sess.lessonTitle}`;
        
        // Phân loại loại bài cho header modal (hỗ trợ cả dữ liệu cũ và mới)
        let sessionTypeForModal = "";
        if (sess.isExam) {
            sessionTypeForModal = "Thi cuối chương 📋";
        } else if (sess.isLessonExam) {
            sessionTypeForModal = "⚡ Kiểm tra tổng thể bài học";
        } else if (sess.isSubtopicPractice) {
            const dTitle = sess.subtopicTitle || "Dạng bài";
            sessionTypeForModal = sess.isWeaknessPractice ? `🎯 Luyện điểm yếu AI: ${dTitle}` : `📚 Dạng bài: ${dTitle}`;
        } else if (sess.isWeaknessPractice) {
            sessionTypeForModal = "🎯 Luyện điểm yếu AI";
        } else {
            const lvlMap = { 'co-ban': 'Cơ bản (Nhận biết)', 'nang-cao': 'Nâng cao (Thông hiểu)', 'kho': 'Khó (Vận dụng cao)', 'chat-luong-cao': 'Chất lượng cao 💎 (Tư duy & Logic AI)' };
            sessionTypeForModal = lvlMap[sess.level] || sess.level || "Luyện tập";
        }

        let headerHtml = `
            <div style="background-color: var(--primary-bg); border: 1px solid var(--border-color); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; font-size: 0.9rem;">
                <p><b>Thời gian làm bài:</b> ${dateStr}</p>
                <p><b>Loại bài:</b> ${sessionTypeForModal}</p>
                <p><b>Kết quả:</b> <span style="font-weight:900; color: ${sess.scorePercent >= 80 ? 'var(--success)' : 'var(--danger)'};">${sess.correctCount}/${sess.totalQuestions} câu đúng (${sess.scorePercent}%)</span></p>
                <p><b>Thời lượng:</b> ${sess.timeSpent} giây | <b>Số lần chuyển tab:</b> ${sess.distractions || 0} lần</p>
            </div>
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
        `;


        let questionsHtml = sess.questions.map((q, idx) => {
            const isCorrect = q.isCorrect !== undefined ? q.isCorrect : 
                (q.isShortAnswer ? (q.userShortAnswer === q.options[q.correctIndex]) : (q.userSelectedIndex === q.correctIndex));
            
            let optionsHtml = "";
            if (q.isShortAnswer) {
                optionsHtml = `
                    <div style="margin-bottom:0.4rem; color:${isCorrect ? 'var(--success)' : 'var(--danger)'}; font-size: 1rem;">
                        <b>Đáp án của con:</b> ${sanitizeHtml(q.userShortAnswer || "Không có câu trả lời")} ${isCorrect ? '✔️' : '❌'}
                    </div>
                    <div style="margin-bottom:0.4rem; color:var(--success); font-weight:700; font-size: 1rem;">
                        <b>Đáp án đúng:</b> ${sanitizeHtml(q.options[q.correctIndex])}
                    </div>
                `;
            } else {
                optionsHtml = q.options.map((opt, oIdx) => {
                    let colorStyle = "";
                    let icon = "";
                    if (oIdx === q.correctIndex) {
                        colorStyle = "color:var(--success); font-weight:700;";
                        icon = "✔️ ";
                    } else if (oIdx === q.userSelectedIndex) {
                        colorStyle = "color:var(--danger); font-weight:700;";
                        icon = "❌ ";
                    }
                    return `<div style="margin-bottom:0.4rem; ${colorStyle}">${icon}<b>${["A", "B", "C", "D"][oIdx]}.</b> ${sanitizeHtml(opt)}</div>`;
                }).join("");
            }

            const cleanQuestionText = sanitizeHtml(q.questionText);
            const cleanSolutionHtml = sanitizeHtml(q.solutionHtml || "Đang cập nhật...");
            const cleanTip = sanitizeHtml(q.tip || "Hãy đọc kỹ đề bài và loại trừ các phương án bẫy.");

            return `
                <div class="review-item" style="font-family: var(--font-family) !important; border-left: 5px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}; padding: 1.2rem; background-color: var(--bg-card); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                    <div style="font-family: var(--font-family) !important; font-weight:700; margin-bottom:0.8rem; display:flex; justify-content:space-between; font-size:0.9rem;">
                        <span style="font-family: var(--font-family) !important;">Câu hỏi ${idx + 1} <span style="font-family: var(--font-family) !important; font-weight:normal; font-size:0.75rem; margin-left:8px; color:var(--text-muted);">(${q.level === 'co-ban' ? 'Cơ bản' : (q.level === 'nang-cao' ? 'Nâng cao' : 'Khó')})</span></span>
                        <span style="font-family: var(--font-family) !important; color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}; font-weight:700;">
                            ${isCorrect ? 'Đúng' : 'Sai'}
                        </span>
                    </div>
                    <div class="math-render" style="font-family: var(--font-family) !important; font-size:1.05rem; margin-bottom:0.8rem; font-weight:600; line-height:1.5;">${cleanQuestionText}</div>
                    <div class="math-render" style="font-family: var(--font-family) !important; margin-bottom:0.8rem; padding-left:1rem; border-left:3px solid var(--border-color);">${optionsHtml}</div>
                    
                    <div style="font-family: var(--font-family) !important; background-color:var(--primary-bg); padding:0.8rem; border-radius:8px; margin-top:0.8rem; font-size:0.9rem;">
                        <strong style="font-family: var(--font-family) !important; color:var(--primary);"><i class="fa-solid fa-graduation-cap"></i> Lời giải chi tiết của ${this.config.parentName || 'phụ huynh'}:</strong>
                        <div class="math-render" style="font-family: var(--font-family) !important; margin-top:0.3rem; line-height:1.5; color:var(--text-main);">${cleanSolutionHtml}</div>
                    </div>
                    
                    <div style="font-family: var(--font-family) !important; background-color:var(--warning-bg); padding:0.8rem; border-radius:8px; margin-top:0.6rem; font-size:0.9rem;">
                        <strong style="font-family: var(--font-family) !important; color:var(--warning);"><i class="fa-solid fa-lightbulb"></i> Mẹo thi (Exam Tips):</strong>
                        <div class="math-render" style="font-family: var(--font-family) !important; margin-top:0.3rem; line-height:1.5; color:var(--text-main);"><i>${cleanTip}</i></div>
                    </div>
                </div>
            `;
        }).join("");

        modalBody.innerHTML = headerHtml + questionsHtml + `</div>`;

        // Render KaTeX riêng cho các phần tử chứa công thức toán học, tránh làm ảnh hưởng font chữ tiếng Việt tĩnh
        if (window.renderMathInElement) {
            const mathElements = modalBody.querySelectorAll(".math-render");
            mathElements.forEach(el => {
                window.renderMathInElement(el, {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "$", right: "$", display: false}
                    ]
                });
            });
        }

        document.getElementById("review-session-modal").classList.remove("hidden");
    },

    closeReviewSessionModal: function() {
        document.getElementById("review-session-modal").classList.add("hidden");
    },

    // Bật/Tắt Focus Mode xem video chống xao nhãng
    toggleFocusMode: function() {
        document.body.classList.toggle("focus-mode-active");
        const btn = document.querySelector(".btn-focus");
        if (document.body.classList.contains("focus-mode-active")) {
            btn.innerHTML = `<i class="fa-solid fa-compress"></i> Tắt Focus Mode`;
        } else {
            btn.innerHTML = `<i class="fa-solid fa-expand"></i> Bật Focus Mode (Chống xao nhãng)`;
        }
    },

    // Luyện tập lại bài học hiện tại
    retryPractice: function() {
        document.getElementById("practice-active-box").classList.add("hidden");
        document.getElementById("practice-result-box").classList.add("hidden");

        const lesson = this.currentLesson;
        const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;

        if (hasSubtopics) {
            if (questions.isSubtopicPracticeMode) {
                // Tự động bắt đầu lại luyện tập dạng bài
                questions.startSubtopicPractice(questions.currentSubtopic.id);
            } else {
                document.getElementById("practice-lesson-exam-intro-box").classList.remove("hidden");
            }
        } else {
            const isExam = lesson.questionType.startsWith("cuoi-chuong") || lesson.id.startsWith("kt-");
            if (isExam) {
                document.getElementById("practice-exam-intro-box").classList.remove("hidden");
            } else {
                document.getElementById("practice-level-select-box").classList.remove("hidden");
            }
        }
    },

    // Ghi nhận điểm số bài luyện tập của học sinh
    saveLessonScore: function(lessonId, score, xpEarned, isPassed, timeSpent = 9999, distractions = 0) {
        // Cập nhật điểm cao nhất
        const prevScore = this.state.scores[lessonId] || 0;
        if (score > prevScore) {
            this.state.scores[lessonId] = score;
        }

        // Tích lũy XP
        this.state.xp += xpEarned;

        // Lưu thông tin học tập của học sinh để phụ huynh theo dõi
        this.logLearningTime(10); // Giả lập làm bài tập tốn 10 phút

        // Kiểm tra mở khóa huy hiệu
        this.checkAndUnlockBadges(lessonId, score, timeSpent, prevScore, distractions);

        this.saveProgress();
        this.updateHeaderStats();
    },

    // Kiểm tra điều kiện mở khóa các loại huy hiệu
    checkAndUnlockBadges: function(lessonId, score, timeSpent = 9999, oldScore = 0, distractions = 0) {
        // 1. Nhập môn (hoàn thành bất kỳ bài nào >= 80%)
        if (score >= 80) {
            this.unlockBadge("nhap-mon");
        }

        // 2. Khởi đầu vững vàng (đạt 100% điểm bất kỳ bài nào)
        if (score === 100) {
            this.unlockBadge("khoi-dau-vung-vang");
        }

        // 3. Chuỗi học tập liên tục
        if (this.state.streak >= 3) this.unlockBadge("streak-3");
        if (this.state.streak >= 7) this.unlockBadge("streak-7");
        if (this.state.streak >= 15) this.unlockBadge("streak-15");

        // 4. Siêu trí tuệ & Huyền thoại (tích lũy XP)
        if (this.state.xp >= 200) this.unlockBadge("sieu-tri-tue");
        if (this.state.xp >= 500) this.unlockBadge("huyen-thoai-toan-hoc");

        // 5. Thần tốc: Đúng 100% trong thời gian dưới 45 giây (chỉ cho bài luyện tập bình thường 5 câu)
        if (score === 100 && timeSpent <= 45 && !lessonId.startsWith("kt-")) {
            this.unlockBadge("tia-chop");
        }

        // 6. Kiên trì bứt phá: Cải thiện điểm số từ dưới 70% lên đạt giỏi (>= 80%)
        if (oldScore > 0 && oldScore < 70 && score >= 80) {
            this.unlockBadge("kien-tri");
        }

        // 7. Kỷ luật thép: Vượt qua bài kiểm tra cuối chương 10 câu đạt >= 80% mà không có lần xao nhãng nào
        if (lessonId.startsWith("kt-") && score >= 80 && distractions === 0) {
            this.unlockBadge("ky-luat-thep");
        }

        // 8. Các huy hiệu vượt qua bài kiểm tra chương học
        if (lessonId === "kt-c1" && score >= 80) this.unlockBadge("bac-thay-so-tu-nhien");
        if (lessonId === "kt-c2" && score >= 80) this.unlockBadge("chien-binh-chia-het");
        if (lessonId === "kt-c3" && score >= 80) this.unlockBadge("ky-si-so-nguyen");
        if (lessonId === "kt-c4" && score >= 80) this.unlockBadge("phu-thuy-hinh-hoc");
        if (lessonId === "kt-c5" && score >= 80) this.unlockBadge("bac-thay-doi-xung");
        if (lessonId === "kt-c6" && score >= 80) this.unlockBadge("bac-thay-phan-so");
        if (lessonId === "kt-c7" && score >= 80) this.unlockBadge("chien-binh-thap-phan");
        if (lessonId === "kt-c8" && score >= 80) this.unlockBadge("phu-thuy-hinh-co-ban");
        if (lessonId === "kt-c9" && score >= 80) this.unlockBadge("bac-thay-xac-suat");
    },

    // Mở khóa một huy hiệu
    unlockBadge: function(badgeId) {
        if (!this.state.badges.includes(badgeId)) {
            this.state.badges.push(badgeId);
            this.saveProgress();
            this.updateHeaderStats();

            // Kích hoạt âm thanh mở huy hiệu
            this.audio.playBadge();

            // Kích hoạt pháo hoa giấy chúc mừng
            this.confetti.start();

            // Kiểm tra xem Splash Screen có đang hiển thị hay không
            const splashScreen = document.getElementById("splash-screen");
            const isSplashVisible = splashScreen && splashScreen.style.display !== "none" && !splashScreen.classList.contains("hidden");

            if (isSplashVisible) {
                // Đưa vào hàng đợi để hiển thị sau khi nhấn "Bắt đầu học tập"
                if (!this.pendingBadges) this.pendingBadges = [];
                if (!this.pendingBadges.includes(badgeId)) {
                    this.pendingBadges.push(badgeId);
                }
            } else {
                // Hiển thị trực tiếp nếu ứng dụng đã khởi chạy xong
                this.showBadgePopup(badgeId);
            }
        }
    },

    // Hiển thị popup thông báo Huy hiệu
    showBadgePopup: function(badgeId) {
        const badge = this.systemBadges.find(b => b.id === badgeId);
        if (badge) {
            const parentName = this.config.parentName || 'Bố';
            const studentName = this.config.studentName || 'Con';
            document.querySelector(".badge-icon-lg").innerText = badge.icon;
            document.querySelector(".badge-title-popup").innerText = `${parentName} chúc mừng ${studentName}! 🎉`;
            document.querySelector(".badge-desc-popup").innerText = `Con đã xuất sắc đạt huy hiệu: "${badge.name}" (${badge.desc}). ${parentName} rất tự hào về con!`;
            document.getElementById("badge-popup").classList.remove("hidden");
        }
    },

    // Ghi nhận thời gian học (Giả lập tăng thời lượng học theo ngày trong tuần)
    logLearningTime: function(minutes) {
        const todayIndex = new Date().getDay(); // 0: Chủ nhật, 1: Thứ hai...
        if (!this.state.learningTimeWeek) {
            this.state.learningTimeWeek = [0, 0, 0, 0, 0, 0, 0]; // 7 ngày trong tuần
        }
        this.state.learningTimeWeek[todayIndex] += minutes;
        this.saveProgress();
    },

    // Ghi nhận kết quả trả lời câu hỏi (phục vụ biểu đồ Đúng/Sai của phụ huynh)
    saveQuestionResult: function(lessonId, questionType, isCorrect, skipSave = false) {
        if (!this.state.history) {
            this.state.history = [];
        }
        
        // Thêm bản ghi mới
        this.state.history.push({
            date: new Date().toISOString(),
            lessonId: lessonId,
            questionType: questionType,
            isCorrect: isCorrect
        });

        // Chỉ giữ lại tối đa 200 bản ghi lịch sử gần nhất để tiết kiệm bộ nhớ LocalStorage
        if (this.state.history.length > 200) {
            this.state.history.shift();
        }

        if (!skipSave) {
            this.saveProgress();
        }
    },

    // Theme (Light/Green mode)
    initTheme: function() {
        const savedTheme = localStorage.getItem("toan6_theme");
        // Mặc định là xanh lá (green) nếu chưa lưu cấu hình, hoặc nếu lưu là green
        if (savedTheme === 'light') {
            document.body.classList.add("light-mode");
            document.body.classList.remove("green-mode");
            this.isDarkMode = false;
        } else {
            document.body.classList.add("green-mode");
            document.body.classList.remove("light-mode");
            this.isDarkMode = true;
        }
        this.updateThemeIcon();
    },

    toggleTheme: function() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.body.classList.add("green-mode");
            document.body.classList.remove("light-mode");
            localStorage.setItem("toan6_theme", "green");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("green-mode");
            localStorage.setItem("toan6_theme", "light");
        }
        this.updateThemeIcon();
        
        // Nếu đang ở màn hình phụ huynh thì cần vẽ lại biểu đồ để khớp màu sắc Green/Light
        const screenParent = document.getElementById("screen-parent");
        const parentDashboardContent = document.getElementById("parent-dashboard-content");
        if (screenParent && !screenParent.classList.contains("hidden") && 
            parentDashboardContent && !parentDashboardContent.classList.contains("hidden")) {
            if (typeof parentDashboard !== 'undefined' && typeof parentDashboard.renderCharts === 'function') {
                parentDashboard.renderCharts();
            }
        }
    },

    updateThemeIcon: function() {
        const toggleBtn = document.getElementById("theme-toggle");
        if (this.isDarkMode) {
            // Khi đang ở Green Mode (Lá): hiển thị icon Mặt trăng để bấm chuyển sang Đêm Dạ Lục
            toggleBtn.innerHTML = `<i class="fa-solid fa-moon" style="color:#FFD700; filter: drop-shadow(0 0 4px rgba(255,215,0,0.5));" title="Chuyển sang Giao diện Đêm Dạ Lục"></i>`;
        } else {
            // Khi đang ở Đêm Dạ Lục: hiển thị icon chiếc lá để bấm chuyển sang Green Mode
            toggleBtn.innerHTML = `<i class="fa-solid fa-leaf" style="color:#2E7D32; filter: drop-shadow(0 0 4px rgba(46,125,50,0.4));" title="Chuyển sang Giao diện Lá Dịu Mắt"></i>`;
        }
    },

    // Modal Huy hiệu học sinh
    openBadgesModal: function() {
        // Cập nhật tiêu đề modal với tên học sinh hiện tại
        const modalTitle = document.getElementById("badges-modal-title");
        if (modalTitle) modalTitle.innerHTML = `🏅 Bộ sưu tập Huy hiệu của ${this.config.studentName || 'Học sinh'}`;

        const container = document.getElementById("badges-grid-container");
        container.innerHTML = "";

        this.systemBadges.forEach(badge => {
            const isUnlocked = this.state.badges.includes(badge.id);
            const badgeDiv = document.createElement("div");
            badgeDiv.className = `badge-item ${isUnlocked ? 'unlocked animate-bounce-in' : 'locked'}`;
            badgeDiv.innerHTML = `
                <div class="badge-item-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.desc}</div>
                ${isUnlocked ? '<small style="color:var(--success);font-weight:700;"><i class="fa-solid fa-check"></i> Đã mở</small>' : '<small style="color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Chưa đạt</small>'}
            `;
            container.appendChild(badgeDiv);
        });

        document.getElementById("badges-modal").classList.remove("hidden");
    },

    closeBadgesModal: function() {
        document.getElementById("badges-modal").classList.add("hidden");
    },

    requestEvaluation: function() {
        const token = sessionStorage.getItem("adminToken");
        if (token) {
            this.openEvaluationModal();
        } else {
            Swal.fire({
                title: "Xác minh Phụ huynh",
                text: "Vui lòng nhập mã PIN quản lý để xem báo cáo đánh giá chất lượng học sinh:",
                input: "password",
                inputAttributes: {
                    maxlength: "15",
                    autocapitalize: "off",
                    autocorrect: "off",
                    style: "text-align: center; font-size: 1.2rem; letter-spacing: 0.1em;"
                },
                showCancelButton: true,
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                confirmButtonColor: "#8b5cf6",
                preConfirm: async (password) => {
                    if (!password) {
                        Swal.showValidationMessage("Vui lòng nhập mã PIN!");
                        return false;
                    }
                    try {
                        const res = await fetch(app.getApiUrl("/api/admin/login"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ password })
                        });
                        if (!res.ok) {
                            const errData = await res.json();
                            throw new Error(errData.error || "Mã PIN không chính xác!");
                        }
                        const data = await res.json();
                        sessionStorage.setItem("adminToken", data.token);
                        return true;
                    } catch (err) {
                        Swal.showValidationMessage(err.message);
                        return false;
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    app.openEvaluationModal();
                }
            });
        }
    },

    openEvaluationModal: function() {
        // 1. Tính toán số liệu thống kê thực tế từ this.state
        const historyList = this.state.history || [];
        const totalSecs = historyList.reduce((acc, h) => acc + (h.duration || 0), 0);
        const totalMins = Math.round(totalSecs / 60);

        const completedCount = this.state.completedSubtopics ? this.state.completedSubtopics.length : 0;

        let totalQuestions = 0;
        let totalCorrect = 0;
        historyList.forEach(h => {
            totalQuestions += (h.totalQuestions || 0);
            totalCorrect += (h.correctCount || 0);
        });
        const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        const streak = this.state.streak || 0;

        // Cập nhật lên UI
        const timeEl = document.getElementById("eval-time");
        const completedEl = document.getElementById("eval-completed");
        const accuracyEl = document.getElementById("eval-accuracy");
        const streakEl = document.getElementById("eval-streak");

        if (timeEl) timeEl.innerText = `${totalMins} phút`;
        if (completedEl) completedEl.innerText = `${completedCount} bài`;
        if (accuracyEl) accuracyEl.innerText = `${accuracy}%`;
        if (streakEl) streakEl.innerText = `${streak} ngày`;

        // 2. Hiển thị modal
        const modal = document.getElementById("evaluation-modal");
        if (modal) modal.classList.remove("hidden");

        // 3. Tải nhận xét AI
        this.refreshEvaluationAiAnalysis(false);
    },

    closeEvaluationModal: function() {
        const modal = document.getElementById("evaluation-modal");
        if (modal) modal.classList.add("hidden");
    },

    refreshEvaluationAiAnalysis: async function(forceRefresh = true) {
        const adviceEl = document.getElementById("eval-ai-advice");
        const refreshBtn = document.getElementById("btn-eval-refresh-ai");
        if (!adviceEl) return;

        adviceEl.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem 0;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size:2rem; color:var(--primary); margin-bottom:0.8rem;"></i>
                <span style="font-size:0.9rem; color:var(--text-muted);">Trợ lý AI đang đánh giá kết quả làm bài của con...</span>
            </div>
        `;
        if (refreshBtn) refreshBtn.disabled = true;

        try {
            const token = sessionStorage.getItem("adminToken");
            const res = await fetch(this.getApiUrl("/api/ai-analysis"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    history: this.state.history || [],
                    examSessions: this.state.examSessions || [],
                    xp: this.state.xp || 0,
                    scores: this.state.scores || {},
                    studentName: this.config.studentName || 'Con',
                    parentName: this.config.parentName || 'Phụ huynh',
                    classLevel: this.config.currentClass || '6'
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Không thể lấy phân tích từ AI.");
            }

            const data = await res.json();
            let parsedHtml = "";
            if (typeof marked !== "undefined") {
                parsedHtml = marked.parse(data.analysis || "Không có nhận xét nào.");
            } else {
                parsedHtml = data.analysis || "Không có nhận xét nào.";
            }
            
            adviceEl.innerHTML = parsedHtml;

            // Render sơ đồ Mermaid nếu có
            if (typeof mermaid !== "undefined") {
                setTimeout(() => {
                    try {
                        const mermaidBlocks = adviceEl.querySelectorAll(".language-mermaid");
                        mermaidBlocks.forEach((block) => {
                            const graphDefinition = block.textContent;
                            const container = document.createElement("div");
                            container.className = "mermaid";
                            container.textContent = graphDefinition;
                            block.parentNode.replaceChild(container, block);
                        });
                        mermaid.run();
                    } catch(me) {
                        console.warn("Mermaid error in evaluation:", me);
                    }
                }, 100);
            }

        } catch (err) {
            console.error("Lỗi AI Analysis trong Evaluation Modal:", err);
            
            let errMsg = err.message || "Đã xảy ra lỗi không xác định.";
            if (errMsg.includes("API Key") || errMsg.includes("quota") || errMsg.includes("limit")) {
                errMsg = "Các khóa API Key đi kèm bản Clean đã hết lượt sử dụng miễn phí trong ngày (Google giới hạn số lượt dùng mỗi ngày). Phụ huynh vui lòng bấm vào góc 'Phụ Huynh' ở trên bên phải màn hình để cập nhật API Key mới miễn phí của riêng mình nhé!";
            }

            adviceEl.innerHTML = `
                <div style="color:var(--danger); font-weight:700; text-align:center; padding:1.5rem 0;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:1.8rem; margin-bottom:0.5rem; display:block;"></i>
                    Lỗi Cố vấn AI: ${errMsg}
                </div>
            `;
        } finally {
            if (refreshBtn) refreshBtn.disabled = false;
        }
    },

    collapseSidebar: function() {
        const sidebar = document.getElementById("timeline-sidebar");
        if (sidebar) {
            sidebar.classList.add("collapsed");
        }
    },

    expandSidebar: function() {
        const sidebar = document.getElementById("timeline-sidebar");
        if (sidebar) {
            sidebar.classList.remove("collapsed");
        }
    },

    enterFullscreen: function(element) {
        try {
            let promise;
            if (element.requestFullscreen) {
                promise = element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                promise = element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                promise = element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                promise = element.msRequestFullscreen();
            }
            if (promise && typeof promise.catch === 'function') {
                promise.catch(err => {
                    console.warn("Fullscreen request rejected:", err);
                });
            }
        } catch (e) {
            console.warn("Failed to enter fullscreen mode:", e);
        }
    },

    exitFullscreen: function() {
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            // Khôi phục thanh cuộn cho body và html phòng trường hợp trình duyệt bị kẹt
            setTimeout(() => {
                this.restoreScrollbar();
            }, 100);
        } catch (e) {
            console.warn("Failed to exit fullscreen mode:", e);
        }
    },

    // Khôi phục thanh cuộn và dọn dẹp các class ngăn cuộn của SweetAlert2
    restoreScrollbar: function() {
        try {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.classList.remove("swal2-shown", "swal2-height-auto");
            document.documentElement.classList.remove("swal2-shown", "swal2-height-auto");
            document.body.style.overflowX = "hidden";
        } catch (e) {
            console.warn("Failed to restore scrollbar:", e);
        }
    },

    initFullscreenListeners: function() {
        const handleFullscreenChange = () => {
            const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            if (!isFullscreen) {
                if (document.body.classList.contains("video-fullscreen-active")) {
                    this.stopVideo();
                }
                document.body.classList.remove("practice-fullscreen-active");
                
                // Tự động gọi thoát làm trắc nghiệm/game một cách đàng hoàng nếu thoát fullscreen lúc đang làm bài
                const practiceActiveBox = document.getElementById("practice-active-box");
                if (practiceActiveBox && !practiceActiveBox.classList.contains("hidden")) {
                    if (window.questions && typeof questions.exitPractice === 'function' && !questions.isExiting) {
                        questions.exitPractice();
                    }
                }
            }
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    },

    playVideoFullscreen: function(videoId) {
        const videoWrapper = document.getElementById("video-wrapper");
        if (!videoWrapper) return;

        this.enterFullscreen(videoWrapper);
        document.body.classList.add("video-fullscreen-active");

        videoWrapper.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&vq=hd1080" 
                title="Bài giảng" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
            <button class="btn-exit-video-fullscreen" onclick="app.exitVideoFullscreen()">&times; Thoát rạp chiếu</button>
        `;
    },

    exitVideoFullscreen: function() {
        this.exitFullscreen();
        this.stopVideo();
    },

    stopVideo: function() {
        document.body.classList.remove("video-fullscreen-active");
        if (this.currentLesson) {
            const videoWrapper = document.getElementById("video-wrapper");
            if (videoWrapper && videoWrapper.querySelector('iframe')) {
                const lesson = this.currentLesson;
                const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;
                let videoId = "";
                let idToSave = lesson.id;
                
                if (hasSubtopics && this.currentSubtopicId) {
                    videoId = this.getSubtopicVideoId(this.currentSubtopicId, lesson.id);
                    idToSave = this.currentSubtopicId;
                } else {
                    videoId = this.getLessonVideoId(lesson.id);
                }
                
                this.renderVideoPlayer("video-wrapper", videoId, idToSave, lesson.id);
            }
        }
        const exitBtn = document.querySelector(".btn-exit-video-fullscreen");
        if (exitBtn) {
            exitBtn.remove();
        }
    },

    // Vận hành Dạng bài (Subtopics)
    renderSubtopicsTimeline: function() {
        const container = document.getElementById("subtopics-list-container");
        if (!container) return;
        container.innerHTML = "";

        const lesson = this.currentLesson;
        if (!lesson) return;

        const sidebar = document.querySelector(".subtopics-timeline-sidebar");
        const actionBtn = document.getElementById("btn-practice-subtopic");
        const methodBox = document.getElementById("subtopic-method-html");
        const exampleBox = document.getElementById("subtopic-example-html");

        const subtopics = lesson.subtopics || [];
        if (subtopics.length === 0) {
            if (sidebar) sidebar.style.display = "none";
            if (actionBtn) actionBtn.style.display = "none";
            if (methodBox) methodBox.innerHTML = lesson.theoryHtml || "";
            if (exampleBox) exampleBox.innerHTML = "";
            
            // Nạp video bài học
            const videoId = this.getLessonVideoId(lesson.id);
            this.renderVideoPlayer("video-wrapper", videoId, lesson.id, lesson.id);

            if (window.renderMathInElement) {
                window.renderMathInElement(methodBox, {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "$", right: "$", display: false}
                    ]
                });
            }
            return;
        }

        // Nếu có subtopics
        if (sidebar) sidebar.style.display = "block";
        if (actionBtn) actionBtn.style.display = "inline-block";

        const isLessonPassed = (this.state.scores[lesson.id] || 0) >= 80;
        const theoryCompleted = this.state.completedLessonTheory && this.state.completedLessonTheory.includes(lesson.id);

        // 1. Render mục Kiến thức giáo khoa (Lý thuyết chung) lên trên đầu
        const theoryDiv = document.createElement("div");
        let theoryStatusClass = theoryCompleted || isLessonPassed ? "completed" : "active";
        let theoryStatusIcon = theoryCompleted || isLessonPassed 
            ? `<i class="fa-solid fa-circle-check" style="color:var(--success);"></i>` 
            : `<i class="fa-solid fa-bolt animate-pulse-soft" style="color:var(--warning);"></i>`;
            
        theoryDiv.className = `subtopic-timeline-item ${theoryStatusClass}`;
        if (this.currentSubtopicId === lesson.id + "-theory") {
            theoryDiv.classList.add("current");
        }
        
        theoryDiv.onclick = () => {
            this.showTheoryDetail(lesson.id);
        };
        
        theoryDiv.innerHTML = `
            <div class="subtopic-item-icon">${theoryStatusIcon}</div>
            <div class="subtopic-item-content">
                <div class="subtopic-item-title" style="font-weight:700; font-size:0.85rem; line-height:1.3; color: var(--primary);">📖 Kiến thức giáo khoa</div>
            </div>
        `;
        
        const theoryPracticeBtn = document.createElement("button");
        if (theoryCompleted || isLessonPassed) {
            theoryPracticeBtn.className = "btn-subtopic-practice good";
            theoryPracticeBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã học xong lý thuyết`;
        } else {
            theoryPracticeBtn.className = "btn-subtopic-practice not-started";
            theoryPracticeBtn.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Nhấn để học lý thuyết`;
        }
        theoryPracticeBtn.onclick = (e) => {
            e.stopPropagation();
            this.showTheoryDetail(lesson.id);
        };
        
        const theoryWrapper = document.createElement("div");
        theoryWrapper.className = "subtopic-card-wrapper";
        theoryWrapper.style.marginBottom = "1.2rem";
        theoryWrapper.appendChild(theoryDiv);
        theoryWrapper.appendChild(theoryPracticeBtn);
        container.appendChild(theoryWrapper);

        // 2. Render các Dạng bài học tiếp theo
        let firstActiveId = null;

        subtopics.forEach((sub, idx) => {
            const isCompleted = this.state.completedSubtopics.includes(sub.id);
            let isLocked = false;

            if (!isLessonPassed) {
                if (idx === 0) {
                    // Dạng 1 bị khóa nếu chưa học xong lý thuyết chung
                    if (!theoryCompleted) {
                        isLocked = true;
                    }
                } else {
                    // Các dạng tiếp theo bị khóa nếu dạng trước chưa xong
                    const prevSub = subtopics[idx - 1];
                    const prevCompleted = this.state.completedSubtopics.includes(prevSub.id);
                    if (!prevCompleted) {
                        isLocked = true;
                    }
                }
            }

            let statusClass = "locked";
            let statusIcon = `<i class="fa-solid fa-lock" style="color:var(--text-muted);"></i>`;

            if (isCompleted || isLessonPassed) {
                statusClass = "completed";
                statusIcon = `<i class="fa-solid fa-circle-check" style="color:var(--success);"></i>`;
            } else if (!isLocked) {
                statusClass = "active";
                statusIcon = `<i class="fa-solid fa-bolt animate-pulse-soft" style="color:var(--warning);"></i>`;
                if (!firstActiveId) {
                    firstActiveId = sub.id;
                }
            }

            const itemDiv = document.createElement("div");
            itemDiv.className = `subtopic-timeline-item ${statusClass}`;
            if (this.currentSubtopicId === sub.id) {
                itemDiv.classList.add("current");
            }
            
            itemDiv.onclick = () => {
                if (!isLocked) {
                    this.showSubtopicDetail(sub.id);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Dạng bài này đang bị khóa',
                        text: `${app.config.studentName || 'Con'} cần hoàn thành phần Kiến thức giáo khoa hoặc dạng bài trước đó để mở khóa dạng này nhé!`,
                        target: document.getElementById('tab-theory') || 'body',
                        confirmButtonText: 'Con đã rõ',
                        confirmButtonColor: 'var(--primary)'
                    });
                }
            };

            const score = this.state.subtopicScores ? this.state.subtopicScores[sub.id] : undefined;
            const scoreLabel = score !== undefined && score > 0 ? `<span style="font-size:0.75rem; font-weight:700; color:var(--primary); margin-left: auto;">${score}%</span>` : "";

            itemDiv.innerHTML = `
                <div class="subtopic-item-icon">${statusIcon}</div>
                <div class="subtopic-item-content">
                    <div class="subtopic-item-title" style="font-weight:700; font-size:0.85rem; line-height:1.3;">${sub.title}</div>
                </div>
                ${scoreLabel}
            `;

            // Tạo nút Luyện tập hiển thị ngay dưới Dạng bài
            const practiceBtn = document.createElement("button");
            let btnClass = "";
            let btnText = "";
            let btnIcon = "";

            if (isLocked) {
                btnClass = "locked";
                btnText = "Chưa mở khóa";
                btnIcon = `<i class="fa-solid fa-lock"></i>`;
            } else if (score === undefined || score === null) {
                btnClass = "not-started";
                btnText = "Bắt đầu Luyện tập";
                btnIcon = `<i class="fa-solid fa-play"></i>`;
            } else if (score < 70) {
                btnClass = "failed";
                btnText = `Luyện tập lại (Chưa đạt: ${score}%)`;
                btnIcon = `<i class="fa-solid fa-rotate-left"></i>`;
            } else if (score < 80) {
                btnClass = "average";
                btnText = `Luyện tập lại (Khá: ${score}%)`;
                btnIcon = `<i class="fa-solid fa-rotate-left"></i>`;
            } else if (score < 95) {
                btnClass = "good";
                btnText = `Luyện tập lại (Giỏi: ${score}%)`;
                btnIcon = `<i class="fa-solid fa-circle-check"></i>`;
            } else {
                btnClass = "excellent";
                btnText = `Luyện tập lại (Xuất sắc: ${score}%)`;
                btnIcon = `<i class="fa-solid fa-crown"></i>`;
            }

            practiceBtn.className = `btn-subtopic-practice ${btnClass}`;
            practiceBtn.innerHTML = `${btnIcon} ${btnText}`;
            
            // Click vào nút sẽ chuyển đến luyện tập dạng bài
            practiceBtn.onclick = (e) => {
                e.stopPropagation(); // Ngăn sự kiện click lan truyền lên itemDiv
                if (!isLocked) {
                    this.startPracticeSubtopic(sub.id);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Dạng bài này đang bị khóa',
                        text: `${app.config.studentName || 'Con'} cần hoàn thành phần Kiến thức giáo khoa hoặc dạng bài trước đó để mở khóa dạng này nhé!`,
                        target: document.getElementById('tab-theory') || 'body',
                        confirmButtonText: 'Con đã rõ',
                        confirmButtonColor: 'var(--primary)'
                    });
                }
            };

            // Bọc cả item thông tin và nút Luyện tập vào trong Card Wrapper
            const cardWrapper = document.createElement("div");
            cardWrapper.className = "subtopic-card-wrapper";
            cardWrapper.style.marginBottom = "1.2rem";
            cardWrapper.appendChild(itemDiv);
            cardWrapper.appendChild(practiceBtn);

            container.appendChild(cardWrapper);
        });

        // 3. Tự động điều hướng mặc định khi mới vào bài học
        if (!this.currentSubtopicId) {
            this.showTheoryDetail(lesson.id);
        } else {
            if (this.currentSubtopicId === lesson.id + "-theory") {
                this.showTheoryDetail(lesson.id);
            } else {
                const curIdx = subtopics.findIndex(s => s.id === this.currentSubtopicId);
                if (curIdx > 0) {
                    const prevSub = subtopics[curIdx - 1];
                    if (!this.state.completedSubtopics.includes(prevSub.id)) {
                        if (!theoryCompleted) {
                            this.showTheoryDetail(lesson.id);
                        } else if (firstActiveId) {
                            this.showSubtopicDetail(firstActiveId);
                        }
                    } else {
                        this.showSubtopicDetail(this.currentSubtopicId);
                    }
                } else if (curIdx === 0) {
                    if (!theoryCompleted) {
                        this.showTheoryDetail(lesson.id);
                    } else {
                        this.showSubtopicDetail(this.currentSubtopicId);
                    }
                } else {
                    this.showTheoryDetail(lesson.id);
                }
            }
        }
    },

    showSubtopicDetail: function(subtopicId) {
        this.currentSubtopicId = subtopicId;
        const lesson = this.currentLesson;
        if (!lesson) return;

        const subtopic = lesson.subtopics.find(s => s.id === subtopicId);
        if (!subtopic) return;

        // Ẩn nút xác nhận học xong lý thuyết chung
        const theoryActionBar = document.getElementById("theory-action-bar");
        if (theoryActionBar) {
            theoryActionBar.style.display = "none";
        }

        const items = document.querySelectorAll(".subtopic-timeline-item");
        const subtopics = lesson.subtopics || [];
        const idx = subtopics.findIndex(s => s.id === subtopicId);
        items.forEach((item, i) => {
            if (i === idx + 1) { // Cộng 1 vì items[0] là mục Kiến thức giáo khoa
                item.classList.add("current");
            } else {
                item.classList.remove("current");
            }
        });

        document.getElementById("subtopic-method-html").innerHTML = subtopic.methodology || "";
        document.getElementById("subtopic-example-html").innerHTML = subtopic.example || "";

        const videoId = this.getSubtopicVideoId(subtopicId, lesson.id);
        this.renderVideoPlayer("video-wrapper", videoId, subtopicId, lesson.id);

        if (window.renderMathInElement) {
            window.renderMathInElement(document.getElementById("subtopic-method-html"), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
            window.renderMathInElement(document.getElementById("subtopic-example-html"), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }
    },

    // Hiển thị chi tiết phần lý thuyết giáo khoa chung
    showTheoryDetail: function(lessonId) {
        this.currentSubtopicId = lessonId + "-theory";
        const lesson = this.currentLesson;
        if (!lesson) return;

        const items = document.querySelectorAll(".subtopic-timeline-item");
        items.forEach((item, i) => {
            if (i === 0) { // Mục Kiến thức giáo khoa luôn là phần tử đầu tiên
                item.classList.add("current");
            } else {
                item.classList.remove("current");
            }
        });

        document.getElementById("subtopic-method-html").innerHTML = lesson.theoryHtml || "";
        document.getElementById("subtopic-example-html").innerHTML = "";

        // Nạp video bài học chung
        const videoId = this.getLessonVideoId(lessonId);
        this.renderVideoPlayer("video-wrapper", videoId, lessonId, lessonId);

        // Hiển thị nút bấm xác nhận học xong lý thuyết
        const theoryActionBar = document.getElementById("theory-action-bar");
        if (theoryActionBar) {
            const theoryCompleted = this.state.completedLessonTheory && this.state.completedLessonTheory.includes(lessonId);
            const isLessonPassed = (this.state.scores[lessonId] || 0) >= 80;
            if (theoryCompleted || isLessonPassed) {
                theoryActionBar.style.display = "none";
            } else {
                theoryActionBar.style.display = "block";
                const btn = document.getElementById("btn-complete-theory");
                if (btn) {
                    btn.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Con đã học xong lý thuyết chung -> Học Dạng 1 🚀`;
                    btn.style.backgroundColor = "var(--primary)";
                    btn.style.borderColor = "var(--primary)";
                }
            }
        }

        if (window.renderMathInElement) {
            window.renderMathInElement(document.getElementById("subtopic-method-html"), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }
    },

    // Ghi nhận học xong lý thuyết giáo khoa và chuyển sang Dạng 1
    completeTheoryAndGoToFirstSubtopic: function() {
        const lesson = this.currentLesson;
        if (!lesson) return;

        if (!this.state.completedLessonTheory) {
            this.state.completedLessonTheory = [];
        }
        if (!this.state.completedLessonTheory.includes(lesson.id)) {
            this.state.completedLessonTheory.push(lesson.id);
            this.saveProgress();
        }

        Swal.fire({
            icon: 'success',
            title: `Tuyệt vời ${this.config.studentName || 'Con'}!`,
            text: 'Con đã học xong lý thuyết chung. Hãy bắt đầu học Dạng 1 nhé!',
            confirmButtonColor: 'var(--primary)',
            timer: 2000,
            showConfirmButton: false,
            target: document.getElementById('tab-theory') || 'body'
        }).then(() => {
            // Tự động chuyển sang Dạng 1
            if (lesson.subtopics && lesson.subtopics.length > 0) {
                this.showSubtopicDetail(lesson.subtopics[0].id);
            }
            // Vẽ lại timeline để cập nhật tích xanh và mở khóa dạng 1
            this.renderSubtopicsTimeline();
        });
    },

    getLevelData: function(lessonId, level) {
        const lesson = getLessonById(lessonId);
        let score = 0;
        let hasAttempt = false;
        let weakQuestion = null;

        if (level === 'chat-luong-cao') {
            // Cấp độ Chất lượng cao lưu trực tiếp ở levelScores cho cả bài học
            score = (this.state.levelScores && this.state.levelScores[`${lessonId}_${level}`]) || 0;
            hasAttempt = score > 0 || (this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lessonId && s.level === level));
        } else if (lesson && lesson.subtopics && lesson.subtopics.length > 0) {
            // Ánh xạ cấp độ sang subtopic tương ứng
            let subIndex = 0;
            if (level === 'nang-cao') subIndex = 1;
            else if (level === 'kho') subIndex = 2;

            const sub = lesson.subtopics[subIndex];
            if (sub) {
                score = this.state.subtopicScores ? (this.state.subtopicScores[sub.id] || 0) : 0;
                hasAttempt = score > 0 || (this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lessonId && s.level === level));
            } else {
                // Fallback nếu subtopic tương ứng không tồn tại ở cấp độ này (ví dụ bài học chỉ có subtopic Cơ bản)
                score = (this.state.levelScores && this.state.levelScores[`${lessonId}_${level}`]) || 0;
                hasAttempt = score > 0 || (this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lessonId && s.level === level));
            }
        } else {
            // Bài luyện tập chung
            score = (this.state.levelScores && this.state.levelScores[`${lessonId}_${level}`]) || 0;
            hasAttempt = score > 0 || (this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lessonId && s.level === level));
        }

        // Tìm câu hỏi sai gần nhất của cấp độ này trong lịch sử để phân tích điểm yếu
        const sessions = (this.state.examSessions || [])
            .filter(s => s.lessonId === lessonId && s.level === level && !s.isExam)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        let lastScore = null;
        if (sessions.length > 0) {
            lastScore = sessions[0].scorePercent;
        } else if (hasAttempt) {
            lastScore = score;
        }

        if (sessions.length > 0) {
            for (const s of sessions) {
                const wrongQ = s.questions.find(q => q.userSelectedIndex !== q.correctIndex);
                if (wrongQ) {
                    weakQuestion = wrongQ;
                    break;
                }
            }
        }

        return {
            score: score,
            lastScore: lastScore,
            hasAttempt: hasAttempt,
            weakQuestion: weakQuestion
        };
    },

    renderPracticeDashboard: function() {
        const container = document.getElementById("practice-levels-dashboard-box");
        if (!container) return;
        container.classList.remove("hidden");
        container.innerHTML = "";

        const lesson = this.currentLesson;
        if (!lesson) return;

        // Tạo tiêu đề
        const header = document.createElement("div");
        header.style.textAlign = "center";
        header.style.marginBottom = "2rem";
        header.innerHTML = `
            <h2 style="font-size:1.6rem; color:var(--primary); margin-bottom:0.5rem;"><i class="fa-solid fa-graduation-cap"></i> Lộ trình Luyện tập theo Cấp độ</h2>
            <p style="color:var(--text-muted); font-size:0.95rem;">Luyện tập thường hoặc Khắc phục Điểm yếu để củng cố năng lực cho bài học: <b style="color:var(--text-main);">${lesson.title}</b></p>
        `;
        container.appendChild(header);

        // Grid chứa 3 cấp độ
        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
        grid.style.gap = "1.5rem";
        grid.style.marginBottom = "2.5rem";

        const levels = [
            { id: "co-ban", name: "Cơ bản (Nhận biết) 🌱", color: "var(--success)" },
            { id: "nang-cao", name: "Nâng cao (Thông hiểu) 🚀", color: "var(--warning)" },
            { id: "kho", name: "Khó (Vận dụng cao) 🔥", color: "var(--danger)" },
            { id: "chat-luong-cao", name: "Chất lượng cao (Tư duy & Logic AI) 💎", color: "#8b5cf6" }
        ];

        const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;

        levels.forEach(lvl => {
            const data = this.getLevelData(lesson.id, lvl.id);
            const card = document.createElement("div");
            card.className = "card";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.borderTop = `5px solid ${lvl.color}`;
            card.style.padding = "1.2rem";
            card.style.borderRadius = "12px";
            card.style.position = "relative";
            card.style.transition = "transform 0.2s, box-shadow 0.2s";
            card.style.boxShadow = "var(--shadow-sm)";
            card.onmouseenter = () => {
                card.style.transform = "translateY(-4px)";
                card.style.boxShadow = "var(--shadow-md)";
            };
            card.onmouseleave = () => {
                card.style.transform = "translateY(0)";
                card.style.boxShadow = "var(--shadow-sm)";
            };

            // Trạng thái và Đạt được gì
            let statusBadge = "";
            let scoreBadge = "";
            let rating = "";

            if (data.hasAttempt) {
                statusBadge = `<span style="font-size:0.8rem; background-color:var(--success-bg); color:var(--success); padding:0.2rem 0.6rem; border-radius:20px; font-weight:700; display:inline-flex; align-items:center; gap:0.3rem;"><i class="fa-solid fa-circle-check"></i> Đã làm</span>`;
                if (data.score >= 90) rating = "Xuất sắc 🏆";
                else if (data.score >= 80) rating = "Giỏi 🎯";
                else if (data.score >= 70) rating = "Khá 📈";
                else rating = "Chưa đạt ⚠️";

                let lastAttemptHtml = "";
                if (data.lastScore !== null && data.lastScore !== undefined && data.lastScore !== data.score) {
                    let lastRating = "";
                    if (data.lastScore >= 90) lastRating = "Xuất sắc 🏆";
                    else if (data.lastScore >= 80) lastRating = "Giỏi 🎯";
                    else if (data.lastScore >= 70) lastRating = "Khá 📈";
                    else lastRating = "Chưa đạt ⚠️";
                    lastAttemptHtml = `<div style="margin-top: 0.3rem; font-size:0.85rem; color:var(--text-muted);">
                        Lần gần nhất: <span style="font-weight:700; color: ${data.lastScore >= 80 ? 'var(--success)' : 'var(--danger)'};">${data.lastScore}%</span> (${lastRating})
                    </div>`;
                }

                scoreBadge = `<div style="margin-top: 0.8rem; font-size:0.95rem; color:var(--text-main);">
                    <b>Điểm cao nhất:</b> <span style="font-size:1.1rem; font-weight:800; color:${lvl.color};">${data.score}%</span> (${rating})
                    ${lastAttemptHtml}
                </div>`;
            } else {
                statusBadge = `<span style="font-size:0.8rem; background-color:var(--border-color); color:var(--text-muted); padding:0.2rem 0.6rem; border-radius:20px; font-weight:700;"><i class="fa-regular fa-circle"></i> Chưa làm</span>`;
                scoreBadge = `<div style="margin-top: 0.8rem; font-size:0.95rem; color:var(--text-muted);">
                    <b>Điểm cao nhất:</b> <span style="font-weight:700;">-</span>
                </div>`;
            }

            // Điểm yếu cần khắc phục (AI phân tích) - đánh giá dựa trên điểm lần làm gần nhất (lastScore)
            let weaknessHtml = "";
            const evaluationScore = (data.lastScore !== null && data.lastScore !== undefined) ? data.lastScore : data.score;
            
            if (data.hasAttempt && evaluationScore < 80 && data.weakQuestion) {
                // Điểm yếu từ câu sai
                const weakText = data.weakQuestion.tip || "Cần đọc lại lý thuyết và làm bài cẩn thận hơn.";
                const cleanQuestionText = data.weakQuestion.questionText
                    .replace(/\$/g, '')
                    .replace(/\\text\{([^\}]+)\}/g, '$1')
                    .replace(/<[^>]*>/g, '')
                    .substring(0, 80);
                
                weaknessHtml = `
                    <div style="margin-top: 1rem; padding: 0.8rem; background-color: var(--danger-bg); border-radius: 8px; border-left: 4px solid var(--danger); font-size: 0.85rem; flex-grow: 1;">
                        <span style="font-weight: 700; color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Điểm yếu AI phân tích (Lần gần nhất: ${evaluationScore}%):</span>
                        <p style="margin: 0.3rem 0; color: var(--text-main); font-style: italic;">"${cleanQuestionText}..."</p>
                        <span style="font-weight: 700; color: var(--success);"><i class="fa-solid fa-lightbulb"></i> Khắc phục:</span>
                        <p style="margin: 0.2rem 0 0; color: var(--text-main);">${weakText}</p>
                    </div>
                `;
            } else if (data.hasAttempt && evaluationScore >= 80) {
                weaknessHtml = `
                    <div style="margin-top: 1rem; padding: 0.8rem; background-color: var(--success-bg); border-radius: 8px; border-left: 4px solid var(--success); font-size: 0.85rem; flex-grow: 1; display:flex; align-items:center; gap:0.4rem; color:var(--success);">
                        <i class="fa-solid fa-circle-check"></i> <span>Con đã nắm chắc kiến thức cấp độ này. Rất tốt!</span>
                    </div>
                `;
            } else {
                weaknessHtml = `
                    <div style="margin-top: 1rem; padding: 0.8rem; background-color: var(--bg-app); border-radius: 8px; border-left: 4px solid var(--border-color); font-size: 0.85rem; flex-grow: 1; color: var(--text-muted);">
                        <i class="fa-regular fa-comment-dots"></i> <span>Chưa có dữ liệu làm bài để phân tích. Hãy thực hiện luyện tập!</span>
                    </div>
                `;
            }

            // Nút luyện tập thường và luyện tập điểm yếu
            let buttonsHtml = "";
            
            // Tìm subtopic tương ứng nếu có subtopics
            let subtopicId = null;
            if (hasSubtopics) {
                let subIndex = 0;
                if (lvl.id === 'nang-cao') subIndex = 1;
                else if (lvl.id === 'kho') subIndex = 2;
                if (lesson.subtopics[subIndex]) {
                    subtopicId = lesson.subtopics[subIndex].id;
                }
            }

            if (data.hasAttempt && data.score < 80 && data.weakQuestion) {
                // Có điểm yếu -> hiện 2 nút
                const practiceCall = (subtopicId && lvl.id !== 'chat-luong-cao') 
                    ? `app.startPracticeSubtopic('${subtopicId}')` 
                    : `questions.startPracticeWithLevel('${lvl.id}')`;
                const weaknessCall = (subtopicId && lvl.id !== 'chat-luong-cao') 
                    ? `questions.startWeaknessPracticeSubtopic('${subtopicId}')` 
                    : `questions.startWeaknessPracticeWithLevel('${lvl.id}')`;

                buttonsHtml = `
                    <div style="display:grid; grid-template-columns: 1fr 1fr auto; gap: 0.6rem; margin-top: 1.2rem;">
                        <button class="btn-primary" onclick="${practiceCall}" style="padding:0.6rem; border-radius:8px; font-size:0.85rem; cursor:pointer; font-weight:700; background-color:var(--bg-app); color:var(--text-main); border:1px solid var(--border-color);">
                            Luyện tập lại
                        </button>
                        <button class="btn-primary" onclick="${weaknessCall}" style="padding:0.6rem; border-radius:8px; font-size:0.85rem; cursor:pointer; font-weight:700; background-color:var(--warning); border-color:var(--warning); color:white; font-weight:bold;">
                            🔥 Luyện điểm yếu
                        </button>
                        <button class="btn-secondary" onclick="questions.showStudentPrintPromptWithLevel('${lvl.id}')" style="padding:0.6rem 0.8rem; border-radius:8px; cursor:pointer; background-color:var(--success); border-color:var(--success); color:white; display:flex; align-items:center; justify-content:center;" title="In đề thi cấp độ này">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </div>
                `;
            } else {
                // Không có điểm yếu hoặc chưa làm
                const practiceCall = (subtopicId && lvl.id !== 'chat-luong-cao') 
                    ? `app.startPracticeSubtopic('${subtopicId}')` 
                    : `questions.startPracticeWithLevel('${lvl.id}')`;
                const btnText = data.hasAttempt ? "Luyện tập lại" : "Bắt đầu Luyện tập";
                buttonsHtml = `
                    <div style="display:grid; grid-template-columns: 1fr auto; gap: 0.6rem; margin-top: 1.2rem;">
                        <button class="btn-primary" onclick="${practiceCall}" style="padding:0.7rem; border-radius:8px; font-size:0.9rem; cursor:pointer; font-weight:700; background-color:${lvl.color}; border-color:${lvl.color};">
                            <i class="fa-solid fa-play"></i> ${btnText}
                        </button>
                        <button class="btn-secondary" onclick="questions.showStudentPrintPromptWithLevel('${lvl.id}')" style="padding:0.7rem 1rem; border-radius:8px; cursor:pointer; background-color:var(--success); border-color:var(--success); color:white; display:flex; align-items:center; justify-content:center;" title="In đề thi cấp độ này">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </div>
                `;
            }

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="font-size:1.05rem; color:var(--text-main); font-weight:700;">${lvl.name}</h3>
                    ${statusBadge}
                </div>
                ${scoreBadge}
                ${weaknessHtml}
                ${buttonsHtml}
            `;
            grid.appendChild(card);
        });
        container.appendChild(grid);

        // Thêm Bài kiểm tra tổng thể bài học ở dưới cùng
        if (hasSubtopics) {
            const isLessonPassed = (this.state.scores[lesson.id] || 0) >= 80;
            
            // Kiểm tra xem cả 3 subtopic đã đạt từ 80% trở lên chưa
            const allSubtopicsPassed = lesson.subtopics.every(sub => {
                const subScore = this.state.subtopicScores ? (this.state.subtopicScores[sub.id] || 0) : 0;
                return subScore >= 80;
            });
            
            const examBox = document.createElement("div");
            examBox.className = "card";
            examBox.style.padding = "1.5rem";
            examBox.style.borderRadius = "12px";
            examBox.style.textAlign = "center";
            examBox.style.border = "1px solid var(--border-color)";
            examBox.style.boxShadow = "var(--shadow-sm)";
            examBox.style.marginTop = "2rem";

            if (!allSubtopicsPassed && !isLessonPassed) {
                // Khóa bài kiểm tra tổng thể
                examBox.style.backgroundColor = "var(--bg-app)";
                examBox.style.opacity = "0.75";
                examBox.innerHTML = `
                    <div style="font-size:2.5rem; margin-bottom:0.6rem;">🔒</div>
                    <h3 style="font-size:1.2rem; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">Thử thách: Bài kiểm tra tổng thể bài học</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem; max-width:550px; margin:0 auto 1rem;">
                        Con cần hoàn thành và đạt kết quả từ <b>80% trở lên ở cả 3 Cấp độ bài tập</b> phía trên để mở khóa bài kiểm tra tổng hợp năng lực bài học này nhé!
                    </p>
                    <button class="btn-primary" disabled style="padding:0.7rem 2rem; border-radius:10px; background-color:var(--text-muted); border-color:var(--text-muted); cursor:not-allowed;">
                        Chưa đủ điều kiện mở khóa
                    </button>
                `;
            } else {
                // Mở khóa bài kiểm tra tổng thể
                const scoreLabel = isLessonPassed ? `<span style="color:var(--success); font-weight:800;">Đã hoàn thành (${this.state.scores[lesson.id]}%)</span>` : `<span style="color:var(--warning); font-weight:700;">Chưa hoàn thành</span>`;
                examBox.innerHTML = `
                    <div style="font-size:2.5rem; margin-bottom:0.6rem;">📝</div>
                    <h3 style="font-size:1.2rem; font-weight:700; color:var(--primary); margin-bottom:0.5rem;">Thử thách: Bài kiểm tra tổng thể bài học</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem; max-width:550px; margin:0 auto 0.5rem;">
                        Bài thi gồm 10 câu hỏi nâng cao giới hạn trong 15 phút. Yêu cầu đạt <b>tối thiểu 80%</b> để hoàn thành bài học và mở khóa bài tiếp theo.
                    </p>
                    <p style="font-size:0.9rem; margin-bottom:1rem;"><b>Trạng thái:</b> ${scoreLabel}</p>
                    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="questions.startLessonExam()" style="padding:0.7rem 2.2rem; border-radius:10px; font-size:1rem; cursor:pointer;">
                            <i class="fa-solid fa-play"></i> Bắt đầu kiểm tra tổng thể
                        </button>
                        <button class="btn-secondary" onclick="questions.showStudentPrintPrompt()" style="padding:0.7rem 2.2rem; border-radius:10px; font-size:1rem; cursor:pointer; background-color:var(--success); color:white; border:none; display:flex; align-items:center; gap:0.5rem;">
                            <i class="fa-solid fa-print"></i> In đề thi giấy 🖨️
                        </button>
                    </div>
                `;
            }
            container.appendChild(examBox);
        }
    },

    startPracticeCurrentSubtopic: function() {
        if (!this.currentSubtopicId) return;
        this.switchLessonTab('practice', false);
        questions.startSubtopicPractice(this.currentSubtopicId);
    },

    startPracticeSubtopic: function(subtopicId) {
        this.currentSubtopicId = subtopicId;
        this.switchLessonTab('practice', false);
        questions.startSubtopicPractice(subtopicId);
    },

    backToSubtopics: function() {
        this.switchLessonTab('theory');
    }
};

// Hàm đóng popup huy hiệu
function closeBadgePopup() {
    document.getElementById("badge-popup").classList.add("hidden");
    if (window.app && window.app.pendingBadges && window.app.pendingBadges.length > 0) {
        const nextBadgeId = window.app.pendingBadges.shift();
        window.app.showBadgePopup(nextBadgeId);
    }
}

window.app = app;

// Khởi chạy khi tài nguyên trang đã sẵn sàng
window.onload = async function() {
    await app.init();
};
