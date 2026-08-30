/**
 * GRADE 6 MATH - CHAPTER 1: SỐ TỰ NHIÊN (MASTER DELEGATOR)
 * Điều phối qua 6 Micro-Generators độc lập trong ch1_naturals/
 */
(function(root) {
    'use strict';

    function getPlugins() {
        if (typeof root !== 'undefined' && root.g6_ch1_bai01) {
            return [
                root.g6_ch1_bai01,
                root.g6_ch1_bai02,
                root.g6_ch1_bai03,
                root.g6_ch1_bai04,
                root.g6_ch1_bai05,
                root.g6_ch1_bai06
            ].filter(Boolean);
        }
        if (typeof require !== 'undefined') {
            try {
                return [
                    require('./ch1_naturals/bai_01_tap_hop'),
                    require('./ch1_naturals/bai_02_ghi_so'),
                    require('./ch1_naturals/bai_03_phep_tinh'),
                    require('./ch1_naturals/bai_04_luy_thua'),
                    require('./ch1_naturals/bai_05_chia_het_so_nguyen_to'),
                    require('./ch1_naturals/bai_06_ucln_bcnn')
                ];
            } catch (e) {
                try {
                    return [
                        require('./generators/ch1_naturals/bai_01_tap_hop'),
                        require('./generators/ch1_naturals/bai_02_ghi_so'),
                        require('./generators/ch1_naturals/bai_03_phep_tinh'),
                        require('./generators/ch1_naturals/bai_04_luy_thua'),
                        require('./generators/ch1_naturals/bai_05_chia_het_so_nguyen_to'),
                        require('./generators/ch1_naturals/bai_06_ucln_bcnn')
                    ];
                } catch (e2) {
                    return [];
                }
            }
        }
        return [];
    }

    function generate(type, level, context) {
        const self = context || this;
        const plugins = getPlugins();
        for (const p of plugins) {
            if (p && typeof p.generate === 'function') {
                const res = p.generate.call(self, type, level, self);
                if (res) return res;
            }
        }
        return null;
    }

    const Chapter1 = { generate };

    if (typeof window !== 'undefined') {
        window.g6_chapter1 = Chapter1;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Chapter1;
    }
})(typeof window !== 'undefined' ? window : global);
