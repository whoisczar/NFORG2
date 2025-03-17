"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const produtoController_1 = require("../controllers/produtoController");
const router = express_1.default.Router();
router.get("/", produtoController_1.getAllProdutos);
router.get("/:id", produtoController_1.getProdutoById);
router.post("/", produtoController_1.createProduto);
router.put("/:id", produtoController_1.updateProduto);
router.delete("/:id", produtoController_1.deleteProduto);
exports.default = router;
