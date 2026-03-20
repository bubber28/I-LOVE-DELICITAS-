"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const ordersRouter = (0, express_1.Router)();
exports.ordersRouter = ordersRouter;
ordersRouter.post('/', auth_1.authMiddleware, (req, res) => {
    const items = req.body?.items || [];
    res.status(201).json({
        orderId: `order_${Date.now()}`,
        items,
        status: 'created',
        userId: req.user?.id
    });
});
