"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const historicoController_1 = require("../controllers/historicoController");
const router = express_1.default.Router();
router.get("/", historicoController_1.getAllHistoricos);
router.get("/:id", historicoController_1.getHistoricoById);
router.post("/", historicoController_1.createHistorico);
router.put("/:id", historicoController_1.updateHistorico);
router.delete("/:id", historicoController_1.deleteHistorico);
exports.default = router;
