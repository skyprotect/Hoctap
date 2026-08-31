/**
 * SplashQuotesService — Quản lý đồng hồ kỹ thuật số và châm ngôn học tập trên Màn hình chào mừng (Splash Screen).
 * 
 * Public Contract:
 * - QUOTES: Array<{ text: string; author: string }> (14 câu châm ngôn giáo dục)
 * - currentQuoteIndex: number (0..13)
 * - clockTimer: any | null
 * 
 * - formatTime(date?: Date): string (HH:MM:SS)
 * - formatDate(date?: Date): string (Thứ X, ngày DD tháng MM năm YYYY)
 * - updateClock(timeEl?: HTMLElement, dateEl?: HTMLElement, date?: Date): void
 * - initClock(timeElementId?: string, dateElementId?: string): any
 * - stopClock(): void
 * 
 * - getRandomQuote(): { text: string; author: string; index: number }
 * - displayRandomQuote(textElementId?: string, authorElementId?: string): { text: string; author: string; index: number } | null
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.SplashQuotesService = api;
    if (typeof window !== 'undefined') {
        window.SplashQuotesService = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.SplashQuotesService = api;
    }
    if (typeof self !== 'undefined') {
        self.SplashQuotesService = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const QUOTES = [
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

    const DAYS_OF_WEEK = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

    const SplashQuotesService = {
        QUOTES: QUOTES,
        currentQuoteIndex: 0,
        clockTimer: null,

        formatTime: function(date) {
            const now = date instanceof Date ? date : new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();

            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            return `${hours}:${minutes}:${seconds}`;
        },

        formatDate: function(date) {
            const now = date instanceof Date ? date : new Date();
            const dayName = DAYS_OF_WEEK[now.getDay()];
            const day = now.getDate();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            return `${dayName}, ngày ${day} tháng ${month} năm ${year}`;
        },

        updateClock: function(timeEl, dateEl, date) {
            if (!timeEl || !dateEl) return;
            const now = date instanceof Date ? date : new Date();
            timeEl.innerText = this.formatTime(now);
            dateEl.innerText = this.formatDate(now);
        },

        initClock: function(timeElementId, dateElementId) {
            if (typeof document === 'undefined') return null;

            const timeId = timeElementId || "splash-clock-time";
            const dateId = dateElementId || "splash-clock-date";

            const timeEl = document.getElementById(timeId);
            const dateEl = document.getElementById(dateId);
            if (!timeEl || !dateEl) return null;

            // Xóa timer cũ nếu đang chạy để tránh duplicate interval
            this.stopClock();

            // Cập nhật ngay tức khắc
            this.updateClock(timeEl, dateEl);

            // Chạy cập nhật mỗi giây
            this.clockTimer = setInterval(() => {
                const curTimeEl = document.getElementById(timeId);
                const curDateEl = document.getElementById(dateId);
                if (curTimeEl && curDateEl) {
                    this.updateClock(curTimeEl, curDateEl);
                }
            }, 1000);

            return this.clockTimer;
        },

        stopClock: function() {
            if (this.clockTimer) {
                clearInterval(this.clockTimer);
                this.clockTimer = null;
            }
        },

        getRandomQuote: function() {
            const randIndex = Math.floor(Math.random() * this.QUOTES.length);
            this.currentQuoteIndex = randIndex;
            return {
                text: this.QUOTES[randIndex].text,
                author: this.QUOTES[randIndex].author,
                index: randIndex
            };
        },

        displayRandomQuote: function(textElementId, authorElementId) {
            if (typeof document === 'undefined') return null;

            const textId = textElementId || "splash-quote-text";
            const authorId = authorElementId || "splash-quote-author";

            const textEl = document.getElementById(textId);
            const authorEl = document.getElementById(authorId);
            if (!textEl || !authorEl) return null;

            const quote = this.getRandomQuote();
            textEl.innerText = quote.text;
            authorEl.innerText = `— ${quote.author}`;

            return quote;
        }
    };

    return SplashQuotesService;
});
