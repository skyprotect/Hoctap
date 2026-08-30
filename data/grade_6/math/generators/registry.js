/**
 * GRADE 6 MATH - GENERATOR REGISTRY & MATH UTILS
 * Điều phối sinh câu hỏi cho 51 dạng bài Toán Lớp 6 qua các chương chuyên biệt
 */
(function(root) {
    'use strict';

    // Math Helpers
    function randomInt(min, max, excludeZero = false) {
        let val = Math.floor(Math.random() * (max - min + 1)) + min;
        if (excludeZero && val === 0) val = 1;
        return val;
    }

    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    function lcm(a, b) {
        if (a === 0 || b === 0) return 0;
        return Math.abs(a * b) / gcd(a, b);
    }

    function isPrime(n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 === 0 || n % 3 === 0) return false;
        for (let i = 5; i * i <= n; i += 6) {
            if (n % i === 0 || n % (i + 2) === 0) return false;
        }
        return true;
    }

    function getPrimeFactors(n) {
        if (n <= 1) return ["1"];
        n = Math.abs(n);
        const counts = {};
        let d = 2;
        while (d * d <= n) {
            while (n % d === 0) {
                counts[d] = (counts[d] || 0) + 1;
                n /= d;
            }
            d += (d === 2 ? 1 : 2);
        }
        if (n > 1) {
            counts[n] = (counts[n] || 0) + 1;
        }
        return Object.entries(counts).map(([base, exp]) => exp > 1 ? `${base}^${exp}` : `${base}`);
    }

    function factorize(n) {
        const factors = getPrimeFactors(n);
        return factors.join(' \\cdot ');
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getModule(names, relPath) {
        const nameList = Array.isArray(names) ? names : [names];
        for (let name of nameList) {
            if (typeof root !== 'undefined' && root[name]) return root[name];
            if (typeof window !== 'undefined' && window[name]) return window[name];
            if (typeof global !== 'undefined' && global[name]) return global[name];
        }
        if (typeof require !== 'undefined') {
            try { return require(relPath); } catch (e) {}
            try { return require('./generators/' + relPath.replace(/^\.\//, '')); } catch (e) {}
            try { return require('./' + relPath.replace(/^\.\//, '')); } catch (e) {}
        }
        return null;
    }

    function getGenerators() {
        return [
            getModule(['g6_chapter1', 'chapter1_naturals'], './chapter1_naturals'),
            getModule(['g6_chapter2', 'chapter2_integers'], './chapter2_integers'),
            getModule(['g6_chapter3', 'chapter3_geometry'], './chapter3_geometry'),
            getModule(['g6_chapter4', 'chapter4_statistics'], './chapter4_statistics'),
            getModule(['g6_chapter5', 'chapter5_fractions'], './chapter5_fractions'),
            getModule(['g6_chapter6', 'chapter6_geometry_plane'], './chapter6_geometry_plane')
        ].filter(Boolean);
    }

    const contextObj = {
        randomInt,
        gcd,
        lcm,
        isPrime,
        getPrimeFactors,
        factorize,
        shuffle
    };

    function generateQuestion(type, level, context) {
        const self = context || Object.assign({}, contextObj, this);
        const generators = getGenerators();
        let rawQ = null;

        for (let g of generators) {
            if (g && typeof g.generate === 'function') {
                rawQ = g.generate.call(self, type, level, self);
                if (rawQ) break;
            }
        }

        if (!rawQ) {
            // Default fallback
            rawQ = {
                questionText: `Tìm số nguyên $x$, biết: $x + 5 = 2$.`,
                options: [`$x = -3$`, `$x = 3$`, `$x = -7$`, `$x = 7$`],
                correctIndex: 0,
                hints: [`$x = 2 - 5$.`],
                solutionHtml: `Ta có $x = 2 - 5 = -3$.`,
                tip: "Chuyển vế đổi dấu."
            };
        }

        let correctOptionValue;
        if (typeof rawQ.correctIndex === 'number' && rawQ.correctIndex >= 0 && rawQ.correctIndex < rawQ.options.length) {
            correctOptionValue = rawQ.options[rawQ.correctIndex];
        } else {
            correctOptionValue = rawQ.options[0];
        }

        const shuffledOptions = [...rawQ.options];
        shuffle(shuffledOptions);

        return {
            type: rawQ.type || "trac-nghiem",
            questionText: rawQ.questionText,
            options: shuffledOptions,
            correctIndex: shuffledOptions.indexOf(correctOptionValue),
            hints: rawQ.hints || [],
            solutionHtml: rawQ.solutionHtml || "",
            tip: rawQ.tip || ""
        };
    }

    const questions = {
        generateQuestion,
        getGenerators,
        randomInt,
        gcd,
        lcm,
        isPrime,
        getPrimeFactors,
        factorize,
        shuffle
    };

    if (typeof window !== 'undefined') {
        window.questions = questions;
        window.g6_registry = questions;
        window.generateQuestion = generateQuestion;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = questions;
    }
})(typeof window !== 'undefined' ? window : global);
