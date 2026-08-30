/**
 * GAME ENGINE - ECONOMY SYSTEM
 * Quản lý vàng (gold), kim cương (gems), năng lượng mana
 */
(function(root) {
    'use strict';
    class EconomySystem {
        constructor(initialGold = 300, initialGems = 10) {
            this.gold = initialGold;
            this.gems = initialGems;
        }
        addGold(amount) {
            this.gold += amount;
            return this.gold;
        }
        spendGold(amount) {
            if (this.gold >= amount) {
                this.gold -= amount;
                return true;
            }
            return false;
        }
        addGems(amount) {
            this.gems += amount;
            return this.gems;
        }
    }
    if (typeof window !== 'undefined') window.EconomySystem = EconomySystem;
    if (typeof module !== 'undefined' && module.exports) module.exports = EconomySystem;
})(typeof window !== 'undefined' ? window : global);
