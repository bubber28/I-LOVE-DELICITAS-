"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.adminMiddleware = adminMiddleware;
exports.signMockToken = signMockToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token ausente.' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ message: 'Token invalido.' });
    }
}
function adminMiddleware(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Nao autenticado.' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso restrito a admins.' });
    }
    next();
}
function signMockToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}
