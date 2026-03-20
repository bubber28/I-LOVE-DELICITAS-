"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.post('/login', (req, res) => {
    const { email } = req.body;
    const isAdmin = Boolean(email && email.toLowerCase().includes('admin'));
    const user = {
        id: 'user_001',
        role: isAdmin ? 'admin' : 'user'
    };
    const token = (0, auth_1.signMockToken)({ id: user.id, role: user.role });
    res.json({
        message: 'Login mock realizado com sucesso.',
        token,
        user
    });
});
