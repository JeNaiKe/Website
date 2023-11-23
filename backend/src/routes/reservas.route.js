const express = require("express");
const router = express.Router();

// Controlador
const reservasController = require("../controllers/reservas.controller");

// Rotas
router.get("/list", reservasController.list);
router.get("/getByID/:id", reservasController.getByID);
router.get("/getBySalaID/:id", reservasController.getBySalaID);
router.get("/getByUserToken/:id", reservasController.getByUserToken);
router.get("/getByUserTokenOnwards/:id", reservasController.getByUserTokenOnwards);
router.get("/getSalaMostPopular", reservasController.getSalaMostPopular);
router.get("/qtyReservasByDate", reservasController.qtyReservasByDate);
router.get("/getListByDateInterval", reservasController.getListByDateInterval);
router.get("/getListByDateIntervalByCenter", reservasController.getListByDateIntervalByCenter);
router.get("/percentAllocationMonthly", reservasController.percentAllocationMonthly);
router.get("/percentMostUsedSalasByCapacity/:id", reservasController.percentMostUsedSalasByCapacity);
router.get("/getListBySalaByDate/:id&:dataRecebida", reservasController.getListBySalaByDate);
router.get("/getListBySalaToday/:id", reservasController.getListBySalaToday);
router.get("/getListBySalaTodayOnward/:id", reservasController.getListBySalaTodayOnward);
router.get("/getListBySalaTodayTomorrow/:id", reservasController.getListBySalaTodayTomorrow);
router.get("/getListByCentroTodayTomorrow/:id", reservasController.getListByCentroTodayTomorrow);
router.get("/getListByLimpeza/:id", reservasController.getListByLimpeza);
router.get("/getListBySalaIDHoraInicioDate/:salaId&:horaInicio&:dataReserva", reservasController.getListBySalaIDHoraInicioDate);
router.post("/register", reservasController.register);
router.delete("/delete/:id", reservasController.delete);
router.put("/updateReserva/:id", reservasController.updateReserva);
router.put("/cancelarReserva/:id", reservasController.cancelarReserva);

module.exports = router;
