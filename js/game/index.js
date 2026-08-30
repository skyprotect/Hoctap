/**
 * GAME ENGINE - MASTER FACADE
 * Tích hợp toàn bộ các Subsystem (Config, Assets, Grid, Hero, Systems, Renderers, UI, Core)
 * Đảm bảo 100% tương thích ngược với API window.game
 */
(function(root) {
    'use strict';

    function getSubmodule(name, relPath) {
        if (typeof root !== 'undefined' && root[name]) return root[name];
        if (typeof require !== 'undefined') {
            try { return require(relPath); } catch (e) {}
            try { return require('./game/' + relPath.replace(/^\.\//, '')); } catch (e) {}
            try { return require('./' + relPath.replace(/^\.\//, '')); } catch (e) {}
        }
        return {};
    }

    const GameConfig = getSubmodule('GameConfig', './core/game-config');
    const GameAssets = getSubmodule('GameAssets', './core/game-assets');
    const GameMath = getSubmodule('GameMath', './core/math-utils');
    const GameCore = getSubmodule('GameCore', './core/game-engine');
    const GridSystem = getSubmodule('GridSystem', './systems/grid-system');
    const HeroSystem = getSubmodule('HeroSystem', './entities/hero');
    const WaveSystem = getSubmodule('WaveSystem', './systems/wave-system');
    const CombatSystem = getSubmodule('CombatSystem', './systems/combat-system');
    const SkillsSystem = getSubmodule('SkillsSystem', './systems/skills-system');
    const MonsterRenderer = getSubmodule('MonsterRenderer', './rendering/monster-renderer');
    const TowerRenderer = getSubmodule('TowerRenderer', './rendering/tower-renderer');
    const MapRenderer = getSubmodule('MapRenderer', './rendering/map-renderer');
    const EffectsRenderer = getSubmodule('EffectsRenderer', './rendering/effects-renderer');
    const GameUI = getSubmodule('GameUI', './ui/game-ui');

    const game = {
        canvas: null,
        ctx: null,
        animationFrame: null,
        lastTime: 0,
        accumulator: 0,
        timestep: 1000 / 60,
        isFreePlay: false,
        paths: [],
        path: [],
        enemies: [],
        towers: [],
        soldiers: [],
        projectiles: [],
        particles: [],
        popups: [],
        activeEffects: [],
        drops: [],
        
        // Hợp nhất các subsystem
        ...GameAssets,
        ...GameConfig,
        ...GridSystem,
        ...HeroSystem,
        ...GameUI,
        ...WaveSystem,
        ...CombatSystem,
        ...SkillsSystem,
        ...MonsterRenderer,
        ...TowerRenderer,
        ...MapRenderer,
        ...EffectsRenderer,
        ...GameMath,
        ...GameCore
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = game;
    }
    if (typeof root !== 'undefined') {
        root.game = game;
    }
})(typeof window !== 'undefined' ? window : global);
