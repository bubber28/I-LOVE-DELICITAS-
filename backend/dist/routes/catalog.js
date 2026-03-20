"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogRouter = void 0;
const express_1 = require("express");
const catalogRouter = (0, express_1.Router)();
exports.catalogRouter = catalogRouter;
catalogRouter.get('/categories', (_req, res) => {
    res.json({
        categories: [
            { id: 'cat_1', name: 'Doces' },
            { id: 'cat_2', name: 'Bebidas' },
            { id: 'cat_3', name: 'Salgados' }
        ]
    });
});
catalogRouter.get('/products', (_req, res) => {
    res.json({
        products: [
            { id: 'prod_1', name: 'Brigadeiro Premium', price: 5.9, categoryId: 'cat_1' },
            { id: 'prod_2', name: 'Empada Artesanal', price: 12.5, categoryId: 'cat_3' },
            { id: 'prod_3', name: 'Suco Natural', price: 8.4, categoryId: 'cat_2' }
        ]
    });
});
