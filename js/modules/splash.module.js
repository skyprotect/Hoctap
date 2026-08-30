/**
 * SPLASH MODULE
 * Quản lý màn hình chào mừng (Splash Screen), đồng hồ thời gian thực,
 * hiển thị lời chào theo buổi và các câu châm ngôn học tập ngẫu nhiên.
 */
(function() {
    'use strict';

    const quotes = [
        "Học, học nữa, học mãi! — V.I. Lênin",
        "Tri thức là sức mạnh. — Francis Bacon",
        "Hành trình vạn dặm bắt đầu từ một bước chân. — Lão Tử",
        "Có công mài sắt, có ngày nên kim. — Tục ngữ Việt Nam",
        "Không có kho báu nào quý bằng học vấn. — Ngạn ngữ",
        "Toán học là chìa khóa mở cánh cửa tri thức vũ trụ. — Galileo Galilei",
        "Mỗi ngày tiến bộ 1% là một kỳ tích sau một năm. — James Clear"
    ];

    const SplashModule = {
        init: function() {
            this.initClock();
            this.displayGreeting();
            this.displayRandomQuote();
        },

        initClock: function() {
            const clockEl = document.getElementById('splash-clock') || document.getElementById('realtime-clock');
            if (!clockEl) return;

            const updateTime = () => {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                clockEl.textContent = `${hours}:${minutes}:${seconds}`;
            };
            updateTime();
            setInterval(updateTime, 1000);
        },

        displayGreeting: function() {
            const greetingEl = document.getElementById('splash-greeting');
            if (!greetingEl) return;

            const hour = new Date().getHours();
            let greeting = "Chào buổi sáng";
            if (hour >= 12 && hour < 18) {
                greeting = "Chào buổi chiều";
            } else if (hour >= 18) {
                greeting = "Chào buổi tối";
            }

            const studentName = (window.AppState && window.AppState.config && window.AppState.config.studentName) ? window.AppState.config.studentName : "bạn nhỏ";
            greetingEl.textContent = `${greeting}, ${studentName}! Chúc con một ngày học tập thật hứng khởi!`;
        },

        displayRandomQuote: function() {
            const quoteEl = document.getElementById('splash-quote');
            if (!quoteEl) return;
            const randomIndex = Math.floor(Math.random() * quotes.length);
            quoteEl.textContent = `"${quotes[randomIndex]}"`;
        },

        hide: function() {
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
