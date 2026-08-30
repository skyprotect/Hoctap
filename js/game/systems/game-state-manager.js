/**
 * GAME ENGINE - STATE MANAGER (FSM)
 * Quản lý trạng thái trò chơi: IDLE -> SPAWNING -> COMBAT -> PAUSED -> VICTORY / DEFEAT
 */
(function(root) {
    'use strict';
    const GameState = {
        IDLE: 'IDLE',
        SPAWNING: 'SPAWNING',
        COMBAT: 'COMBAT',
        PAUSED: 'PAUSED',
        VICTORY: 'VICTORY',
        DEFEAT: 'DEFEAT'
    };

    class GameStateManager {
        constructor(initialState = GameState.IDLE) {
            this.currentState = initialState;
            this.listeners = [];
        }
        getState() { return this.currentState; }
        setState(newState) {
            if (this.currentState === newState) return;
            const oldState = this.currentState;
            this.currentState = newState;
            this.listeners.forEach(fn => fn(newState, oldState));
        }
        onStateChange(callback) {
            this.listeners.push(callback);
        }
        isPlaying() {
            return this.currentState === GameState.COMBAT || this.currentState === GameState.SPAWNING;
        }
    }
    if (typeof window !== 'undefined') {
        window.GameState = GameState;
        window.GameStateManager = GameStateManager;
    }
    if (typeof module !== 'undefined' && module.exports) module.exports = { GameState, GameStateManager };
})(typeof window !== 'undefined' ? window : global);
