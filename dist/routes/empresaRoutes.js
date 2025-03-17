"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const empresaController_1 = require("../controllers/empresaController");
const router = express_1.default.Router();
router.get("/", empresaController_1.getAllEmpresas);
router.get("/:id", empresaController_1.getEmpresaById);
router.post("/", empresaController_1.createEmpresa);
router.put("/:id", empresaController_1.updateEmpresa);
router.delete("/:id", empresaController_1.deleteEmpresa);
exports.default = router;
