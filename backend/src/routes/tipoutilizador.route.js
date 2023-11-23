const express = require('express');
const router = express.Router();

// Importar Controladores
const tipoUserController = require('../controllers/tipoutilizador.controller')

router.get('/list', tipoUserController.list);

module.exports = router;