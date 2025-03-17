"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
const router = express_1.default.Router();
router.post("/", clientController_1.loginClient);
router.get("/", clientController_1.getAllClients);
router.get("/:cpfCnpj", clientController_1.getClientByCpfCnpj);
router.post("/", clientController_1.createClient);
router.put("/:cpfCnpj", clientController_1.updateClient);
router.delete("/:cpfCnpj", clientController_1.deleteClient);
exports.default = router;
