const express = require('express');
const router = express.Router();

const centrosController = require('../controllers/centros.controller')

router.get('/list', centrosController.list);
router.get('/listActiveCenters', centrosController.listActiveCenters);
router.get('/getNumberOfCenters',centrosController.getNumberOfCenters);
router.post('/register', centrosController.register);
router.delete('/delete/:id', centrosController.delete);
router.put('/update/:id', centrosController.update);
router.put('/updateStatus/:id', centrosController.updateStatus);
router.get('/get/:id', centrosController.getCentro);

module.exports = router;