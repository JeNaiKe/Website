const express = require('express');
const router = express.Router();

// Importar Controladores
const permissoesController = require('../controllers/permissoes.controller')

router.get('/list', permissoesController.list);

module.exports = router;