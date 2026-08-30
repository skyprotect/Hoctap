const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');

function bundleGame() {
    const orchestrator = `/**
 * GAME ENGINE - MASTER MODULE ORCHESTRATOR (v13.41)
 * Điều phối các hệ thống con trong js/game/ (Loop, State, Input, Combat, Renderers)
 */
(function(root) {
    'use strict';

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            MathUtils: require('./game/core/math-utils'),
            GameConfig: require('./game/core/game-config'),
            GameLoop: require('./game/core/game-loop'),
            GameStateManager: require('./game/systems/game-state-manager'),
            InputHandler: require('./game/systems/input-handler'),
            EconomySystem: require('./game/systems/economy-system'),
            CollisionDetector: require('./game/systems/collision-detector'),
            TowerController: require('./game/systems/tower-controller'),
            GridSystem: require('./game/systems/grid-system'),
            Hero: require('./game/entities/hero'),
            WaveSystem: require('./game/systems/wave-system'),
            CombatSystem: require('./game/systems/combat-system'),
            SkillsSystem: require('./game/systems/skills-system'),
            GameEngine: require('./game/core/game-engine'),
            GameUI: require('./game/ui/game-ui')
        };
    }
})(typeof window !== 'undefined' ? window : global);
`;
    fs.writeFileSync(path.join(ROOT, 'js/game.js'), orchestrator, 'utf8');
    console.log('✅ js/game.js được bảo toàn ở dạng Master Orchestrator (28 dòng).');
}

if (require.main === module) bundleGame();
module.exports = bundleGame;
