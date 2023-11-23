const express = require("express");
const router = express.Router();

// Importar Controladores
const salasController = require("../controllers/salas.controller");

router.get("/list", salasController.list);
router.get("/listActiveSalas", salasController.listActiveSalas);
router.get("/listActiveSalasByCenterId/:id", salasController.listActiveSalasByCenterId);
router.get("/listaActiveSalasByHorario/:idCentro&:participantes&:dia&:inicio&:fim", salasController.listaActiveSalasByHorario);
router.get("/listaActiveSalasByHorarioByReserva/:idCentro&:participantes&:dia&:inicio&:fim&:idReserva", salasController.listaActiveSalasByHorarioByReserva);
router.get("/listUniqueAlocacao_maxima", salasController.listUniqueAlocacao_maxima);
router.post("/register", salasController.register);
router.delete("/delete/:id", salasController.delete);
router.put("/update/:id", salasController.updateSala);
router.put("/updateStatus/:id", salasController.updateStatus);
router.get("/get/:id", salasController.getSala);

module.exports = router;
