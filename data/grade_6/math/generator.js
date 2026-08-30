/**
 * GRADE 6 MATH GENERATOR - MASTER MODULE ORCHESTRATOR (v13.41)
 * Điều phối các micro-generators chuyên biệt trong generators/ và runner/
 */
(function(root) {
    'use strict';

    if (typeof module !== 'undefined' && module.exports) {
        const hero = require('./hero');
        const templateEngine = require('./generators/template_engine');
        const ch1 = require('./generators/chapter1_naturals');
        const ch2 = require('./generators/chapter2_integers');
        const ch3 = require('./generators/chapter3_geometry');
        const ch4 = require('./generators/chapter4_statistics');
        const ch5 = require('./generators/chapter5_fractions');
        const ch6 = require('./generators/chapter6_geometry_plane');
        const registry = require('./generators/registry');
        const practiceUi = require('./runner/practice_ui');
        const printExam = require('./runner/print_exam');

        module.exports = registry;
    }
})(typeof window !== 'undefined' ? window : global);
