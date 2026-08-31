/**
 * AudioService — Quản lý âm thanh hiệu ứng, nhạc nền và tổng hợp âm thanh Web Audio API.
 * Hỗ trợ nạp trước (preload) 12 file MP3 hiệu ứng, phát thông báo tin nhắn và 6 hiệu ứng âm thanh thủ thành TD.
 * 
 * Public Contract:
 * - isUnlocked: boolean
 * - tempMuteClick: boolean
 * - sounds: Record<string, HTMLAudioElement>
 * - ctx: AudioContext | null
 * - initContext(): void
 * - init(): void
 * - playSound(name: string): void
 * - playStartup(): void
 * - playClick(): void
 * - playTick(): void
 * - playCorrect(): void
 * - playWrong(): void
 * - playVictory(): void
 * - playDefeat(): void
 * - playLose(): void
 * - playBadge(): void
 * - playSwordHit(): void
 * - playMagicSpell(): void
 * - playMessageNotification(): void
 * - playMonter(): void
 * - playBackground(): void
 * - stopBackground(): void
 * - playTdSound(type: string): void
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.AudioService = api;
    if (typeof window !== 'undefined') {
        window.AudioService = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.AudioService = api;
    }
    if (typeof self !== 'undefined') {
        self.AudioService = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const AudioService = {
        isUnlocked: false,
        tempMuteClick: false,
        sounds: {},
        ctx: null,
        initContext: function() {
            if (this.ctx) return;
            try {
                const AudioContextClass = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) ||
                                         (typeof globalThis !== 'undefined' && (globalThis.AudioContext || globalThis.webkitAudioContext)) || null;
                if (AudioContextClass) {
                    this.ctx = new AudioContextClass();
                }
            } catch (e) {
                console.warn("Không khởi tạo được AudioContext:", e);
            }
        },
        init: function() {
            this.initContext();
            if (Object.keys(this.sounds).length > 0) return;
            try {
                const AudioClass = (typeof Audio !== 'undefined' ? Audio : (typeof window !== 'undefined' ? window.Audio : null));
                if (!AudioClass) return;

                this.sounds = {
                    startup: new AudioClass('/sounds/startup.mp3'),
                    click: new AudioClass('/sounds/click.mp3'),
                    tick: new AudioClass('/sounds/click.mp3'),
                    correct: new AudioClass('/sounds/correct.mp3'),
                    wrong: new AudioClass('/sounds/wrong.mp3'),
                    victory: new AudioClass('/sounds/clapping.mp3'),
                    defeat: new AudioClass('/sounds/failed.mp3'),
                    lose: new AudioClass('/sounds/lose.mp3'),
                    sword_hit: new AudioClass('/sounds/sword hit.mp3'),
                    magic_spell: new AudioClass('/sounds/magic spell.mp3'),
                    background: new AudioClass('/sounds/background.mp3'),
                    monter: new AudioClass('/sounds/monter.mp3')
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
        playMessageNotification: function() {
            this.initContext();
            if (!this.ctx) {
                this.playSound('click');
                return;
            }
            try {
                const now = this.ctx.currentTime;
                // Nốt thứ nhất (tần số D5)
                const osc1 = this.ctx.createOscillator();
                const gain1 = this.ctx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(587.33, now); 
                osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); 
                gain1.gain.setValueAtTime(0.12, now);
                gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
                osc1.connect(gain1);
                gain1.connect(this.ctx.destination);
                osc1.start(now);
                osc1.stop(now + 0.22);

                // Nốt thứ hai (tần số D6)
                const osc2 = this.ctx.createOscillator();
                const gain2 = this.ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(880, now + 0.08); 
                osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22); 
                gain2.gain.setValueAtTime(0.12, now + 0.08);
                gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                osc2.connect(gain2);
                gain2.connect(this.ctx.destination);
                osc2.start(now + 0.08);
                osc2.stop(now + 0.35);
            } catch (e) {
                console.warn("Lỗi phát âm thanh Web Audio API:", e);
                this.playSound('click');
            }
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
    };

    return AudioService;
});
