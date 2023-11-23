const express = require("express");
const router = express.Router();

// Controlador
const utilizadorController = require("../controllers/utilizador.controller");

router.get("/list", utilizadorController.list);
router.get("/getByID/:id", utilizadorController.findUserById);
router.get("/getByToken/:id", utilizadorController.findUserByToken);
router.get("/getNumberOfUsers", utilizadorController.getNumberOfUsers);
router.post("/passwordNeedsUpdate/:id", utilizadorController.firstLogin);
router.post("/register", utilizadorController.register);
router.post("/login", utilizadorController.login);
router.post("/mobileLogin", utilizadorController.mobileLogin);
router.post("/verifyPassword", utilizadorController.verifyPassword);
router.put("/update/:id", utilizadorController.updateUser);
router.put("/updateStatus/:id", utilizadorController.updateStatus);
router.put("/updatePasswordFirstLogin/:id", utilizadorController.updatePasswordFirstLogin);
router.delete("/delete/:id", utilizadorController.delete);

module.exports = router;
