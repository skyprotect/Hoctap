/**
 * passive-listening-player — Trình phát nghe tiếng Anh thụ động chuyên biệt (v15.9).
 * Thiết kế thân thiện cho trẻ em, hỗ trợ 3 chế độ: PASSIVE / LIGHT / ACTIVE.
 * Đảm bảo 100% OFFLINE CACHE ONLY — Nghiêm cấm Browser SpeechSynthesis.
 * Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.PassiveListeningPlayer = api;
    if (typeof window !== 'undefined') {
        window.PassiveListeningPlayer = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.PassiveListeningPlayer = api;
    }
    if (typeof self !== 'undefined') {
        self.PassiveListeningPlayer = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const state = {
        containerId: 'passive-listening-player-container',
        playlist: [],
        currentIndex: 0,
        currentLesson: null,
        isPlaying: false,
        audioElement: null,
        playbackSpeed: 1.0,
        repeatMode: 2, // 1x, 2x, 3x, 'smart'
        currentRepeatIteration: 1,
        interactionMode: 'PASSIVE', // 'PASSIVE', 'LIGHT', 'ACTIVE'
        showTranscript: false,
        showVisual: true,
        sessionTimerMinutes: 15,
        sessionSecondsRemaining: 900,
        sessionTimerInterval: null,
        activeTabLevel: 'all'
    };

    /**
     * Khởi tạo trình phát
     */
    async function init(containerId = 'passive-listening-player-container') {
        state.containerId = containerId;
        const service = (typeof window !== 'undefined' && window.PassiveListeningService) || (typeof PassiveListeningService !== 'undefined' ? PassiveListeningService : null);
        if (service && service.buildSmartPlaylist) {
            state.playlist = await service.buildSmartPlaylist({ level: state.activeTabLevel });
            if (state.playlist.length > 0) {
                state.currentIndex = 0;
                state.currentLesson = state.playlist[0];
            }
        }
        render();
    }

    /**
     * Tải danh sách bài nghe theo cấp độ
     */
    async function filterLevel(level) {
        state.activeTabLevel = level;
        const service = (typeof window !== 'undefined' && window.PassiveListeningService) || (typeof PassiveListeningService !== 'undefined' ? PassiveListeningService : null);
        if (service && service.buildSmartPlaylist) {
            state.playlist = await service.buildSmartPlaylist({ level: level });
            state.currentIndex = 0;
            state.currentLesson = state.playlist[0] || null;
            if (state.audioElement) {
                state.audioElement.pause();
                state.isPlaying = false;
            }
        }
        render();
    }

    /**
     * Bắt đầu phát bài học hiện tại hoặc bài học được chỉ định
     */
    async function playLesson(lessonId) {
        if (lessonId) {
            const idx = state.playlist.findIndex(p => p.id === lessonId);
            if (idx >= 0) {
                state.currentIndex = idx;
                state.currentLesson = state.playlist[idx];
                state.currentRepeatIteration = 1;
            }
        }
        if (!state.currentLesson) return;

        // Dừng âm thanh cũ nếu đang chạy
        if (state.audioElement) {
            try { state.audioElement.pause(); } catch (e) {}
        }

        const audioSrc = state.currentLesson.audioFile;
        const AudioClass = (typeof window !== 'undefined' && window.Audio) || (typeof Audio !== 'undefined' ? Audio : null);
        if (!AudioClass) {
            console.warn('[PassiveListeningPlayer] Trình duyệt không hỗ trợ Audio element');
            return;
        }

        state.audioElement = new AudioClass(audioSrc);
        state.audioElement.playbackRate = state.playbackSpeed;

        state.audioElement.onplay = () => {
            state.isPlaying = true;
            updatePlayPauseButton();
        };

        state.audioElement.onpause = () => {
            state.isPlaying = false;
            updatePlayPauseButton();
        };

        state.audioElement.ontimeupdate = () => {
            updateProgressBar();
        };

        state.audioElement.onended = () => {
            handleTrackEnded();
        };

        try {
            await state.audioElement.play();
            state.isPlaying = true;
            startSessionTimer();
        } catch (err) {
            console.warn('[PassiveListeningPlayer] Lỗi khởi động playback (Autoplay Policy):', err);
            state.isPlaying = false;
        }

        render();
    }

    function togglePlay() {
        if (!state.audioElement) {
            if (state.currentLesson) {
                playLesson(state.currentLesson.id);
            }
            return;
        }

        if (state.isPlaying) {
            state.audioElement.pause();
            state.isPlaying = false;
        } else {
            state.audioElement.play().catch(e => console.warn('Play error:', e));
            state.isPlaying = true;
        }
        updatePlayPauseButton();
    }

    function nextTrack() {
        if (state.playlist.length === 0) return;
        state.currentIndex = (state.currentIndex + 1) % state.playlist.length;
        state.currentLesson = state.playlist[state.currentIndex];
        state.currentRepeatIteration = 1;
        playLesson(state.currentLesson.id);
    }

    function prevTrack() {
        if (state.playlist.length === 0) return;
        state.currentIndex = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length;
        state.currentLesson = state.playlist[state.currentIndex];
        state.currentRepeatIteration = 1;
        playLesson(state.currentLesson.id);
    }

    function handleTrackEnded() {
        const service = (typeof window !== 'undefined' && window.PassiveListeningService) || (typeof PassiveListeningService !== 'undefined' ? PassiveListeningService : null);
        if (service && service.saveProgress && state.currentLesson) {
            service.saveProgress(state.currentLesson.id, state.currentLesson.durationSec || 60, true);
        }

        // Logic Lặp lại
        const maxRepeats = typeof state.repeatMode === 'number' ? state.repeatMode : 2;
        if (state.currentRepeatIteration < maxRepeats) {
            state.currentRepeatIteration++;
            if (state.audioElement) {
                state.audioElement.currentTime = 0;
                state.audioElement.play().catch(e => console.warn(e));
            }
            render();
        } else {
            // Chuyển sang bài tiếp theo trong playlist
            state.currentRepeatIteration = 1;
            nextTrack();
        }
    }

    function setSpeed(speed) {
        state.playbackSpeed = speed;
        if (state.audioElement) {
            state.audioElement.playbackRate = speed;
        }
        render();
    }

    function setRepeatMode(mode) {
        state.repeatMode = mode;
        render();
    }

    function setInteractionMode(mode) {
        state.interactionMode = mode;
        if (mode === 'PASSIVE') {
            state.showTranscript = false;
            state.showVisual = true;
        } else if (mode === 'LIGHT') {
            state.showTranscript = true;
            state.showVisual = true;
        } else if (mode === 'ACTIVE') {
            state.showTranscript = true;
            state.showVisual = true;
        }
        render();
    }

    function toggleTranscript() {
        state.showTranscript = !state.showTranscript;
        render();
    }

    function toggleVisual() {
        state.showVisual = !state.showVisual;
        render();
    }

    function startSessionTimer() {
        if (state.sessionTimerInterval) return;
        state.sessionTimerInterval = setInterval(() => {
            if (state.sessionSecondsRemaining > 0) {
                state.sessionSecondsRemaining--;
                const el = document.getElementById('pl-session-timer-display');
                if (el) {
                    const m = Math.floor(state.sessionSecondsRemaining / 60);
                    const s = state.sessionSecondsRemaining % 60;
                    el.innerText = `⏳ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
                }
            } else {
                // Hết giờ phiên nghe micro-session
                clearInterval(state.sessionTimerInterval);
                state.sessionTimerInterval = null;
                if (state.audioElement) state.audioElement.pause();
                state.isPlaying = false;
                render();
            }
        }, 1000);
    }

    function updatePlayPauseButton() {
        const btn = document.getElementById('pl-btn-play-pause');
        if (btn) {
            btn.innerHTML = state.isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
        }
    }

    function updateProgressBar() {
        if (!state.audioElement) return;
        const cur = state.audioElement.currentTime;
        const dur = state.audioElement.duration || 1;
        const pct = Math.min(100, Math.max(0, (cur / dur) * 100));

        const bar = document.getElementById('pl-progress-fill');
        if (bar) bar.style.width = `${pct}%`;

        const curTimeEl = document.getElementById('pl-current-time');
        if (curTimeEl) {
            const m = Math.floor(cur / 60);
            const s = Math.floor(cur % 60);
            curTimeEl.innerText = `${m}:${String(s).padStart(2, '0')}`;
        }
        const durTimeEl = document.getElementById('pl-duration-time');
        if (durTimeEl && !isNaN(dur)) {
            const m = Math.floor(dur / 60);
            const s = Math.floor(dur % 60);
            durTimeEl.innerText = `${m}:${String(s).padStart(2, '0')}`;
        }
    }

    function seekAudio(e) {
        if (!state.audioElement || !state.audioElement.duration) return;
        const track = document.getElementById('pl-progress-track');
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const ratio = Math.max(0, Math.min(1, clickX / width));
        state.audioElement.currentTime = ratio * state.audioElement.duration;
    }

    /**
     * Render toàn bộ giao diện Trình phát
     */
    function render() {
        if (typeof document === 'undefined') return;
        const container = document.getElementById(state.containerId);
        if (!container) return;

        const lesson = state.currentLesson;
        const isPreA1 = state.activeTabLevel === 'Pre-A1';
        const isA1 = state.activeTabLevel === 'A1';
        const isA2 = state.activeTabLevel === 'A2';
        const isAll = state.activeTabLevel === 'all';

        const heroImageSrc = lesson?.visualAssets?.heroImage || 'images/english/passive/pl_prea1_animals_001_hero.svg';

        container.innerHTML = `
            <div class="passive-listening-card" style="background:var(--bg-card); border:2px solid var(--border-color); border-radius:24px; padding:1.8rem; max-width:850px; margin:0 auto; box-shadow:0 8px 24px rgba(0,0,0,0.04);">
                <!-- Header: Bộ lọc Cấp độ CEFR & Timer -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem; margin-bottom:1.5rem; border-bottom:1px dashed var(--border-color); padding-bottom:1rem;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:1.6rem;">🎧</span>
                            <h2 style="margin:0; font-size:1.3rem; font-weight:900; color:var(--text-main);">NGHE TIẾNG ANH THỤ ĐỘNG (EXTENSIVE LISTENING)</h2>
                        </div>
                        <p style="margin:4px 0 0 0; font-size:0.82rem; color:var(--text-muted); font-weight:600;">Chuẩn hóa CEFR Young Learners (Pre-A1, A1, A2) • Giọng đọc Kokoro Offline đa nhân vật</p>
                    </div>

                    <!-- Session Timer -->
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span id="pl-session-timer-display" style="background:rgba(59,130,246,0.1); color:#2563eb; font-weight:900; padding:6px 14px; border-radius:99px; font-size:0.88rem;">
                            ⏳ 15:00
                        </span>
                    </div>
                </div>

                <!-- Thanh chọn Tab Cấp độ CEFR & Chế độ tương tác -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
                    <div style="display:flex; gap:6px; background:var(--bg-app); padding:4px; border-radius:12px; border:1px solid var(--border-color);">
                        <button type="button" onclick="PassiveListeningPlayer.filterLevel('all')" style="border:none; padding:6px 14px; border-radius:8px; font-weight:800; font-size:0.8rem; cursor:pointer; background:${isAll ? '#3b82f6' : 'none'}; color:${isAll ? 'white' : 'var(--text-muted)'};">Tất cả (18)</button>
                        <button type="button" onclick="PassiveListeningPlayer.filterLevel('Pre-A1')" style="border:none; padding:6px 14px; border-radius:8px; font-weight:800; font-size:0.8rem; cursor:pointer; background:${isPreA1 ? '#ec4899' : 'none'}; color:${isPreA1 ? 'white' : 'var(--text-muted)'};">Pre-A1 (Starters)</button>
                        <button type="button" onclick="PassiveListeningPlayer.filterLevel('A1')" style="border:none; padding:6px 14px; border-radius:8px; font-weight:800; font-size:0.8rem; cursor:pointer; background:${isA1 ? '#10b981' : 'none'}; color:${isA1 ? 'white' : 'var(--text-muted)'};">A1 (Movers)</button>
                        <button type="button" onclick="PassiveListeningPlayer.filterLevel('A2')" style="border:none; padding:6px 14px; border-radius:8px; font-weight:800; font-size:0.8rem; cursor:pointer; background:${isA2 ? '#8b5cf6' : 'none'}; color:${isA2 ? 'white' : 'var(--text-muted)'};">A2 (Flyers)</button>
                    </div>

                    <!-- 3 Chế độ: Passive, Light, Active -->
                    <div style="display:flex; gap:6px; background:var(--bg-app); padding:4px; border-radius:12px; border:1px solid var(--border-color);">
                        <button type="button" id="pl-mode-passive" onclick="PassiveListeningPlayer.setInteractionMode('PASSIVE')" title="Chế độ Nghe Thụ Động: Không áp lực, chỉ nghe thư giãn" style="border:none; padding:6px 12px; border-radius:8px; font-weight:800; font-size:0.78rem; cursor:pointer; background:${state.interactionMode === 'PASSIVE' ? '#2563eb' : 'none'}; color:${state.interactionMode === 'PASSIVE' ? 'white' : 'var(--text-muted)'};">🛋️ Thụ động</button>
                        <button type="button" id="pl-mode-light" onclick="PassiveListeningPlayer.setInteractionMode('LIGHT')" title="Chế độ Tương Tác Nhẹ: Xem tranh và transcript tuỳ chọn" style="border:none; padding:6px 12px; border-radius:8px; font-weight:800; font-size:0.78rem; cursor:pointer; background:${state.interactionMode === 'LIGHT' ? '#059669' : 'none'}; color:${state.interactionMode === 'LIGHT' ? 'white' : 'var(--text-muted)'};">📖 Tranh & Chữ</button>
                        <button type="button" id="pl-mode-active" onclick="PassiveListeningPlayer.setInteractionMode('ACTIVE')" title="Chế độ Luyện Tập: Đọc hiểu và phản xạ" style="border:none; padding:6px 12px; border-radius:8px; font-weight:800; font-size:0.78rem; cursor:pointer; background:${state.interactionMode === 'ACTIVE' ? '#d97706' : 'none'}; color:${state.interactionMode === 'ACTIVE' ? 'white' : 'var(--text-muted)'};">🎯 Luyện tập</button>
                    </div>
                </div>

                ${lesson ? `
                <!-- Khu vực hiển thị Hero Visual Context & Thông tin bài -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; align-items:center; margin-bottom:1.5rem;">
                    <!-- Ảnh Hero Visual -->
                    ${state.showVisual ? `
                    <div style="border-radius:18px; overflow:hidden; border:2px solid var(--border-color); box-shadow:0 4px 12px rgba(0,0,0,0.06); text-align:center; background:#0f172a;">
                        <img src="${heroImageSrc}" alt="${lesson.title}" style="width:100%; max-height:220px; object-fit:cover; display:block;" onerror="this.style.display='none';"/>
                    </div>
                    ` : `
                    <div style="border:2px dashed var(--border-color); border-radius:18px; height:180px; display:flex; justify-content:center; align-items:center; color:var(--text-muted); font-weight:700;">
                        <span>🖼️ Hình ảnh ngữ cảnh đã tắt</span>
                    </div>
                    `}

                    <!-- Thông tin bài học & Speakers -->
                    <div>
                        <div style="display:flex; gap:6px; margin-bottom:8px;">
                            <span style="background:#e0e7ff; color:#3730a3; padding:2px 8px; border-radius:99px; font-size:0.72rem; font-weight:800;">${lesson.level}</span>
                            <span style="background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:99px; font-size:0.72rem; font-weight:800;">${lesson.topic.toUpperCase()}</span>
                            <span style="background:#dcfce7; color:#166534; padding:2px 8px; border-radius:99px; font-size:0.72rem; font-weight:800;">Lặp: ${state.currentRepeatIteration}/${state.repeatMode === 'smart' ? 'Smart' : state.repeatMode}</span>
                        </div>
                        <h3 style="margin:0 0 6px 0; font-size:1.35rem; font-weight:900; color:var(--text-main);">${lesson.title}</h3>
                        <p style="margin:0 0 12px 0; font-size:0.85rem; color:var(--text-muted); font-style:italic;">${lesson.contentType} • ${lesson.durationSec}s</p>

                        <!-- Danh sách Nhân vật tham gia hội thoại -->
                        <div style="background:var(--bg-app); padding:8px 12px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:12px;">
                            <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); margin-bottom:4px;">NHÂN VẬT & GIỌNG ĐỌC:</div>
                            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                                ${lesson.speakers.map(s => `
                                    <span style="font-size:0.78rem; font-weight:700; color:var(--text-main); background:var(--bg-card); padding:2px 8px; border-radius:6px; border:1px solid var(--border-color);">
                                        ${s.gender === 'female' ? '👧' : '👨'} ${s.name} (${s.role}) • <i style="color:#64748b;">${s.voice}</i>
                                    </span>
                                `).join("")}
                            </div>
                        </div>

                        <!-- Mục tiêu ngôn ngữ -->
                        <div style="font-size:0.78rem; color:var(--text-muted); line-height:1.4;">
                            <b>Mục tiêu:</b> ${lesson.learningObjectives ? lesson.learningObjectives.join(', ') : ''}
                        </div>
                    </div>
                </div>

                <!-- BẢNG ĐIỀU KHIỂN ÂM THANH (AUDIO CONTROLS) -->
                <div style="background:var(--bg-app); border:2px solid var(--border-color); border-radius:18px; padding:1.2rem; margin-bottom:1.5rem;">
                    <!-- Thanh tiến trình (Seek Bar) -->
                    <div id="pl-progress-track" onclick="PassiveListeningPlayer.seekAudio(event)" style="width:100%; height:8px; background:#cbd5e1; border-radius:4px; cursor:pointer; position:relative; overflow:hidden; margin-bottom:8px;">
                        <div id="pl-progress-fill" style="width:0%; height:100%; background:linear-gradient(90deg, #3b82f6, #10b981); border-radius:4px; transition:width 0.1s linear;"></div>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:700; color:var(--text-muted); margin-bottom:12px;">
                        <span id="pl-current-time">0:00</span>
                        <span id="pl-duration-time">${Math.floor(lesson.durationSec/60)}:${String(Math.round(lesson.durationSec%60)).padStart(2, '0')}</span>
                    </div>

                    <!-- Nút điều khiển Play/Pause/Next/Prev/Speed/Repeat -->
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                        <!-- Nhóm Trái: Tốc độ đọc -->
                        <div style="display:flex; gap:4px; align-items:center;">
                            <span style="font-size:0.75rem; font-weight:800; color:var(--text-muted);">Tốc độ:</span>
                            <button type="button" id="pl-speed-08" onclick="PassiveListeningPlayer.setSpeed(0.8)" style="border:none; padding:4px 8px; border-radius:6px; font-weight:800; font-size:0.75rem; cursor:pointer; background:${state.playbackSpeed === 0.8 ? '#3b82f6' : '#e2e8f0'}; color:${state.playbackSpeed === 0.8 ? 'white' : '#475569'};">0.8x</button>
                            <button type="button" id="pl-speed-10" onclick="PassiveListeningPlayer.setSpeed(1.0)" style="border:none; padding:4px 8px; border-radius:6px; font-weight:800; font-size:0.75rem; cursor:pointer; background:${state.playbackSpeed === 1.0 ? '#3b82f6' : '#e2e8f0'}; color:${state.playbackSpeed === 1.0 ? 'white' : '#475569'};">1.0x</button>
                            <button type="button" id="pl-speed-12" onclick="PassiveListeningPlayer.setSpeed(1.2)" style="border:none; padding:4px 8px; border-radius:6px; font-weight:800; font-size:0.75rem; cursor:pointer; background:${state.playbackSpeed === 1.2 ? '#3b82f6' : '#e2e8f0'}; color:${state.playbackSpeed === 1.2 ? 'white' : '#475569'};">1.2x</button>
                        </div>

                        <!-- Nhóm Giữa: Điều khiển Playback chính -->
                        <div style="display:flex; align-items:center; gap:12px;">
                            <button type="button" onclick="PassiveListeningPlayer.prevTrack()" style="background:none; border:none; color:var(--text-main); font-size:1.3rem; cursor:pointer;" title="Bài trước">
                                <i class="fa-solid fa-backward-step"></i>
                            </button>
                            <button type="button" id="pl-btn-play-pause" onclick="PassiveListeningPlayer.togglePlay()" style="width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg, #3b82f6, #2563eb); border:none; color:white; font-size:1.4rem; cursor:pointer; box-shadow:0 4px 12px rgba(37,99,235,0.3); display:flex; justify-content:center; align-items:center;" title="Phát/Tạm dừng">
                                <i class="fa-solid ${state.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                            </button>
                            <button type="button" onclick="PassiveListeningPlayer.nextTrack()" style="background:none; border:none; color:var(--text-main); font-size:1.3rem; cursor:pointer;" title="Bài tiếp">
                                <i class="fa-solid fa-forward-step"></i>
                            </button>
                        </div>

                        <!-- Nhóm Phải: Chế độ lặp lại -->
                        <div style="display:flex; gap:4px; align-items:center;">
                            <span style="font-size:0.75rem; font-weight:800; color:var(--text-muted);">Lặp lại:</span>
                            <button type="button" id="pl-repeat-1" onclick="PassiveListeningPlayer.setRepeatMode(1)" style="border:none; padding:4px 8px; border-radius:6px; font-weight:800; font-size:0.75rem; cursor:pointer; background:${state.repeatMode === 1 ? '#10b981' : '#e2e8f0'}; color:${state.repeatMode === 1 ? 'white' : '#475569'};">1x</button>
                            <button type="button" id="pl-repeat-2" onclick="PassiveListeningPlayer.setRepeatMode(2)" style="border:none; padding:4px 8px; border-radius:6px; font-weight:800; font-size:0.75rem; cursor:pointer; background:${state.repeatMode === 2 ? '#10b981' : '#e2e8f0'}; color:${state.repeatMode === 2 ? 'white' : '#475569'};">2x</button>
                            <button type="button" id="pl-repeat-3" onclick="PassiveListeningPlayer.setRepeatMode(3)" style="border:none; padding:4px 8px; border-radius:6px; font-weight:800; font-size:0.75rem; cursor:pointer; background:${state.repeatMode === 3 ? '#10b981' : '#e2e8f0'}; color:${state.repeatMode === 3 ? 'white' : '#475569'};">3x</button>
                        </div>
                    </div>
                </div>

                <!-- Khu vực Transcript (Ẩn/Hiện tuỳ chọn) -->
                <div style="margin-bottom:1.5rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:0.88rem; font-weight:800; color:var(--text-main);">
                            💬 LỜI THOẠI BÀI NGHE (TRANSCRIPT)
                        </span>
                        <button type="button" id="pl-btn-toggle-transcript" onclick="PassiveListeningPlayer.toggleTranscript()" style="background:none; border:1px solid var(--border-color); padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:700; color:var(--text-muted); cursor:pointer;">
                            ${state.showTranscript ? '👁️ Ẩn Lời thoại' : '👀 Hiện Lời thoại'}
                        </button>
                    </div>

                    ${state.showTranscript ? `
                    <div id="passive-transcript-body" style="background:var(--bg-app); border:2px solid var(--border-color); border-radius:14px; padding:1.2rem; max-height:220px; overflow-y:auto; font-size:0.95rem; line-height:1.6;">
                        ${lesson.transcript.map(t => {
                            const sp = lesson.speakers.find(s => s.id === t.speakerId);
                            const name = sp ? sp.name : t.speakerId;
                            return `
                                <div style="margin-bottom:8px;">
                                    <b style="color:#2563eb;">${name}:</b> <span>${t.text}</span>
                                </div>
                            `;
                        }).join("")}
                    </div>
                    ` : `
                    <div style="text-align:center; padding:0.8rem; background:rgba(0,0,0,0.02); border-radius:10px; font-size:0.8rem; color:var(--text-muted); font-style:italic;">
                        🎧 Chế độ nghe tự nhiên không phụ đề. Con hãy tập trung lắng nghe và cảm nhận ngữ điệu!
                    </div>
                    `}
                </div>

                <!-- Danh sách Playlist các bài nghe -->
                <div>
                    <div style="font-size:0.88rem; font-weight:800; color:var(--text-main); margin-bottom:8px;">
                        📜 DANH SÁCH BÀI NGHE THEO LỘ TRÌNH (${state.playlist.length} bài):
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px; max-height:240px; overflow-y:auto;">
                        ${state.playlist.map((item, idx) => {
                            const isCurrent = item.id === lesson.id;
                            return `
                                <div onclick="PassiveListeningPlayer.playLesson('${item.id}')" style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-radius:12px; background:${isCurrent ? '#eff6ff' : 'var(--bg-app)'}; border:1.5px solid ${isCurrent ? '#3b82f6' : 'var(--border-color)'}; cursor:pointer; transition:all 0.15s;">
                                    <div style="display:flex; align-items:center; gap:10px;">
                                        <span style="font-weight:900; color:${isCurrent ? '#2563eb' : 'var(--text-muted)'}; font-size:0.85rem;">#${idx + 1}</span>
                                        <div>
                                            <div style="font-weight:800; font-size:0.9rem; color:var(--text-main);">${item.title}</div>
                                            <div style="font-size:0.75rem; color:var(--text-muted);">${item.topic} • ${item.speakers.map(s => s.name).join(', ')}</div>
                                        </div>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:8px;">
                                        <span style="font-size:0.72rem; font-weight:800; padding:2px 6px; border-radius:99px; background:${item.level === 'Pre-A1' ? '#fce7f3' : item.level === 'A1' ? '#dcfce7' : '#ede9fe'}; color:${item.level === 'Pre-A1' ? '#be185d' : item.level === 'A1' ? '#15803d' : '#6d28d9'};">${item.level}</span>
                                        <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">${item.durationSec}s</span>
                                    </div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>
                ` : `
                <div style="text-align:center; padding:2rem; color:var(--text-muted);">
                    Đang tải danh sách bài nghe...
                </div>
                `}
            </div>
        `;
    }

    return {
        init: init,
        filterLevel: filterLevel,
        playLesson: playLesson,
        togglePlay: togglePlay,
        nextTrack: nextTrack,
        prevTrack: prevTrack,
        setSpeed: setSpeed,
        setRepeatMode: setRepeatMode,
        setInteractionMode: setInteractionMode,
        toggleTranscript: toggleTranscript,
        toggleVisual: toggleVisual,
        seekAudio: seekAudio,
        render: render,
        getState: function() {
            return { ...state };
        }
    };
});
