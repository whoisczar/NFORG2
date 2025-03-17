"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemNfController_1 = require("../controllers/itemNfController");
const router = express_1.default.Router();
router.get("/", itemNfController_1.getAllItensNf);
router.get("/:id", itemNfController_1.getItemNfById);
router.post("/", itemNfController_1.createItemNf);
router.put("/:id", itemNfController_1.updateItemNf);
router.delete("/:id", itemNfController_1.deleteItemNf);
exports.default = router;
