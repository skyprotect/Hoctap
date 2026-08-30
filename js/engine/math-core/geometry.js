/**
 * HỌCTẬP SYSTEM — CORE GEOMETRY HELPERS
 * Thư viện các hàm tính toán hình học: Chu vi, Diện tích, Định lý Pythagoras, Góc và Đa giác.
 */
(function(root) {
    'use strict';

    const Geometry = {
        // Chu vi & Diện tích hình chữ nhật
        rectanglePerimeter: function(a, b) {
            return 2 * (Number(a) + Number(b));
        },
        rectangleArea: function(a, b) {
            return Number(a) * Number(b);
        },

        // Chu vi & Diện tích hình vuông
        squarePerimeter: function(a) {
            return 4 * Number(a);
        },
        squareArea: function(a) {
            return Number(a) * Number(a);
        },

        // Chu vi & Diện tích hình tròn
        circleCircumference: function(r) {
            return 2 * Math.PI * Number(r);
        },
        circleArea: function(r) {
            return Math.PI * Number(r) * Number(r);
        },

        // Chu vi & Diện tích hình tam giác
        trianglePerimeter: function(a, b, c) {
            return Number(a) + Number(b) + Number(c);
        },
        triangleArea: function(base, height) {
            return (Number(base) * Number(height)) / 2;
        },

        // Chu vi & Diện tích hình thang
        trapezoidArea: function(top, bottom, height) {
            return ((Number(top) + Number(bottom)) * Number(height)) / 2;
        },

        // Chu vi & Diện tích hình thoi
        rhombusArea: function(d1, d2) {
            return (Number(d1) * Number(d2)) / 2;
        },
        rhombusPerimeter: function(a) {
            return 4 * Number(a);
        },

        // Chu vi & Diện tích hình bình hành
        parallelogramArea: function(base, height) {
            return Number(base) * Number(height);
        },
        parallelogramPerimeter: function(a, b) {
            return 2 * (Number(a) + Number(b));
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Geometry;
    }
    if (typeof root !== 'undefined') {
        root.Geometry = Geometry;
    }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : self));
