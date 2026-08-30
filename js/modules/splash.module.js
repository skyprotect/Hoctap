/**
 * SPLASH MODULE
 * Quản lý màn hình chào mừng (Splash Screen), đồng hồ thời gian thực,
 * hiển thị lời chào tên học sinh, châm ngôn học tập ngẫu nhiên, số liệu XP/Streak/Huy hiệu,
 * và phát âm thanh chào mừng kèm giọng đọc châm ngôn truyền cảm hứng.
 */
(function() {
    'use strict';

    const quotes = [
        { text: "Học, học nữa, học mãi!", author: "V.I. Lênin" },
        { text: "Tri thức là sức mạnh.", author: "Francis Bacon" },
        { text: "Hành trình vạn dặm bắt đầu từ một bước chân.", author: "Lão Tử" },
        { text: "Có công mài sắt, có ngày nên kim.", author: "Tục ngữ Việt Nam" },
        { text: "Không có kho báu nào quý bằng học vấn.", author: "Ngạn ngữ" },
        { text: "Toán học là chìa khóa mở cánh cửa tri thức vũ trụ.", author: "Galileo Galilei" },
        { text: "Mỗi ngày tiến bộ 1% là một kỳ tích sau một năm.", author: "James Clear" },
        { text: "Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc.", author: "Ngạn ngữ Gruzia" },
        { text: "Thiên tài là một phần trăm cảm hứng và chín mươi chín phần trăm mồ hôi.", author: "Thomas Edison" },
        { text: "Đầu tư vào tri thức luôn mang lại lợi nhuận cao nhất.", author: "Benjamin Franklin" }
    ];

    let currentQuote = null;
    let clockInterval = null;

    const SplashModule = {
        isMuted: false,

        init: function() {
            try {
                this.isMuted = (localStorage.getItem('splash_audio_muted') === 'true');
            } catch (e) {
                this.isMuted = false;
            }

            this.initClock();
            this.displayGreeting();
            this.displayRandomQuote();
            this.updateStats();
            this.bindEvents();
            this.updateMuteButtonUI();

            // Tự động phát âm thanh và giọng đọc châm ngôn khi khởi động
            setTimeout(() => {
                this.playWelcomeAudio();
            }, 600);
        },

        initClock: function() {
            const timeEl = document.getElementById('splash-clock-time') || document.getElementById('splash-clock') || document.getElementById('realtime-clock');
            const dateEl = document.getElementById('splash-clock-date');

            const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

            const updateTime = () => {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');

                if (timeEl) {
                    timeEl.textContent = `${hours}:${minutes}:${seconds}`;
                }

                if (dateEl) {
                    const dayName = days[now.getDay()];
                    const day = String(now.getDate()).padStart(2, '0');
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const year = now.getFullYear();
                    dateEl.textContent = `${dayName}, ngày ${day}/${month}/${year}`;
                }
            };

            updateTime();
            if (clockInterval) clearInterval(clockInterval);
            clockInterval = setInterval(updateTime, 1000);
        },

        displayGreeting: function() {
            const welcomeEl = document.querySelector('.splash-welcome-user') || document.getElementById('splash-welcome-user') || document.getElementById('splash-greeting');
            if (!welcomeEl) return;

            const studentName = (window.AppState && window.AppState.config && window.AppState.config.studentName) 
                ? window.AppState.config.studentName 
                : "bạn nhỏ";

            welcomeEl.textContent = `Chào mừng ${studentName}! 👋`;
        },

        displayRandomQuote: function() {
            const quoteTextEl = document.getElementById('splash-quote-text') || document.getElementById('splash-quote');
            const quoteAuthorEl = document.getElementById('splash-quote-author');

            const randomIndex = Math.floor(Math.random() * quotes.length);
            currentQuote = quotes[randomIndex];

            if (quoteTextEl) {
                quoteTextEl.textContent = `"${currentQuote.text}"`;
            }
            if (quoteAuthorEl) {
                quoteAuthorEl.textContent = currentQuote.author ? `— ${currentQuote.author}` : '';
            }
        },

        updateStats: function() {
            const state = (window.AppState && window.AppState.state) || {};

            const xpEl = document.getElementById('splash-xp-val');
            if (xpEl) {
                xpEl.textContent = state.xp || 0;
            }

            const streakEl = document.getElementById('splash-streak-val');
            if (streakEl) {
                streakEl.textContent = state.streak || 0;
            }

            const badgeEl = document.getElementById('splash-badge-count');
            if (badgeEl) {
                const totalBadges = (state.badges ? state.badges.length : 0) + (state.goldBadges ? state.goldBadges.length : 0);
                badgeEl.textContent = totalBadges;
            }
        },

        playWelcomeAudio: function() {
            if (this.isMuted) return;

            // 1. Phát chuông chào mừng
            if (window.AudioService && typeof window.AudioService.play === 'function') {
                window.AudioService.play('welcome');
            } else {
                try {
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
                    osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
                    osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
                    osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.5); // C6
                    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.85);
                } catch (e) {}
            }

            // 2. Đọc to câu châm ngôn học tập
            if (currentQuote && currentQuote.text) {
                setTimeout(() => {
                    if (this.isMuted) return;
                    if (window.SpeechService && typeof window.SpeechService.speak === 'function') {
                        const quoteSpeech = `${currentQuote.text}. ${currentQuote.author ? 'Tác giả: ' + currentQuote.author : ''}`;
                        window.SpeechService.speak(quoteSpeech, 'vi-VN', 0.95);
                    }
                }, 800);
            }
        },

        toggleMute: function() {
            this.isMuted = !this.isMuted;
            try {
                localStorage.setItem('splash_audio_muted', this.isMuted ? 'true' : 'false');
            } catch (e) {}
            this.updateMuteButtonUI();

            if (this.isMuted) {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
            } else {
                this.playWelcomeAudio();
            }
        },

        updateMuteButtonUI: function() {
            const muteBtn = document.getElementById('splash-mute-btn');
            if (!muteBtn) return;
            if (this.isMuted) {
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark" style="color: #ef4444;"></i>';
                muteBtn.title = "Đang tắt âm thanh (Nhấp để bật)";
            } else {
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-high" style="color: #10b981;"></i>';
                muteBtn.title = "Đang bật âm thanh (Nhấp để tắt)";
            }
        },

        bindEvents: function() {
            const muteBtn = document.getElementById('splash-mute-btn');
            if (muteBtn) {
                muteBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.toggleMute();
                };
            }

            const splashScreen = document.getElementById('splash-screen');
            const hintEl = document.getElementById('splash-autoplay-hint');

            // Xử lý trình duyệt chặn autoplay
            if (splashScreen) {
                const handleFirstUserInteraction = () => {
                    if (hintEl) hintEl.classList.add('hidden');
                    if (!this.isMuted) {
                        this.playWelcomeAudio();
                    }
                    splashScreen.removeEventListener('click', handleFirstUserInteraction);
                };
                splashScreen.addEventListener('click', handleFirstUserInteraction, { once: true });
            }
        },

        hide: function() {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            const splashBox = document.getElementById('splash-screen');
            if (splashBox) {
                splashBox.classList.add('hidden');
            }
        },

        show: function() {
            const splashBox = document.getElementById('splash-screen');
            if (splashBox) {
                splashBox.classList.remove('hidden');
                this.displayGreeting();
                this.displayRandomQuote();
                this.updateStats();
                setTimeout(() => {
                    this.playWelcomeAudio();
                }, 400);
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.SplashModule = SplashModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SplashModule;
    }
})();
