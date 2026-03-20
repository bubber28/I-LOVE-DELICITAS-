"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_1 = require("./routes/auth");
const catalog_1 = require("./routes/catalog");
const orders_1 = require("./routes/orders");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'delicitas-api' });
});
exports.app.use('/auth', auth_1.authRouter);
exports.app.use('/catalog', catalog_1.catalogRouter);
exports.app.use('/orders', orders_1.ordersRouter);
