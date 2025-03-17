"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notaFiscalController_1 = require("../controllers/notaFiscalController");
const router = express_1.default.Router();
router.get("/", notaFiscalController_1.getAllNotasFiscais);
router.get("/:id", notaFiscalController_1.getNotaFiscalById);
router.post("/", notaFiscalController_1.createNotaFiscal);
router.put("/:id", notaFiscalController_1.updateNotaFiscal);
router.delete("/:id", notaFiscalController_1.deleteNotaFiscal);
exports.default = router;
