/**
 * VOCAB MONSTER MODULE
 * Quản lý tính năng Đấu trùm từ vựng (Vocab Monster Battle)
 */
(function() {
    'use strict';

    const VocabMonsterModule = {
        monsterHp: 100,
        maxMonsterHp: 100,
        playerHp: 100,
        currentWordIndex: 0,
        wordsList: [],

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            // Lắng nghe các tương tác trận đấu
        },

        startBattle: function(words) {
            this.wordsList = words || [];
            this.monsterHp = 100;
            this.playerHp = 100;
            this.currentWordIndex = 0;
            this.renderBattleArena();
        },

        renderBattleArena: function() {
            const arena = document.getElementById('vocab-monster-arena');
            if (!arena) return;

            arena.innerHTML = `
                <div class="monster-battle-box">
                    <div class="battle-header">
                        <div class="fighter player-side">
                            <span class="avatar">🧙‍♂️</span>
                            <div class="hp-bar"><div class="hp-fill" style="width: ${this.playerHp}%"></div></div>
                        </div>
                        <div class="vs-badge">VS</div>
                        <div class="fighter monster-side">
                            <span class="avatar">👾</span>
                            <div class="hp-bar"><div class="hp-fill monster-fill" style="width: ${this.monsterHp}%"></div></div>
                        </div>
                    </div>
                    <div id="monster-question-box" class="question-box"></div>
                </div>
            `;
        },

        attackMonster: function(damage = 25) {
            this.monsterHp = Math.max(0, this.monsterHp - damage);
            const fill = document.querySelector('.monster-fill');
            if (fill) fill.style.width = `${this.monsterHp}%`;

            if (this.monsterHp <= 0) {
                this.onVictory();
            }
        },

        onVictory: function() {
            if (window.AudioService && typeof window.AudioService.play === 'function') {
                window.AudioService.play('victory');
            }
            if (window.AppState && window.AppState.state) {
                window.AppState.state.xp = (window.AppState.state.xp || 0) + 50;
            }
            alert("🎉 Chúc mừng con đã tiêu diệt quái vật từ vựng và nhận được 50 XP!");
        }
    };

    if (typeof window !== 'undefined') {
        window.VocabMonsterModule = VocabMonsterModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = VocabMonsterModule;
    }
})();
