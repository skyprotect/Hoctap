/**
 * TOWER CONTROLLER SUBSYSTEM
 */
(function(root) {
    'use strict';
    class TowerController {
        constructor(gameState) {
            this.gameState = gameState;
        }
        canPlaceTower(gridX, gridY, towerType) {
            if (!this.gameState || !this.gameState.grid) return false;
            return this.gameState.grid.isValidPlacement(gridX, gridY);
        }
        upgradeTower(tower) {
            if (!tower || tower.level >= 3) return false;
            const cost = tower.upgradeCost || 100;
            if (this.gameState.gold >= cost) {
                this.gameState.gold -= cost;
                tower.level += 1;
                tower.damage = Math.round(tower.damage * 1.5);
                tower.range = Math.round(tower.range * 1.15);
                return true;
            }
            return false;
        }
        sellTower(tower) {
            if (!tower) return 0;
            const refund = Math.round((tower.cost || 100) * 0.7);
            this.gameState.gold += refund;
            return refund;
        }
    }
    if (typeof window !== 'undefined') window.TowerController = TowerController;
    if (typeof module !== 'undefined' && module.exports) module.exports = TowerController;
})(typeof window !== 'undefined' ? window : global);
