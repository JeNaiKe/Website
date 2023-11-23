const express = require('express');
const router = express.Router();

// Importar Controladores
const localizacoesController = require('../controllers/localizacoes.controller')

router.get('/list', localizacoesController.list);
router.post('/register', localizacoesController.register);
router.delete('/delete/:id', localizacoesController.delete);
router.put('/update/:id', localizacoesController.updateLocal);
router.get('/get/:id', localizacoesController.getLocalizacoes);

module.exports = router;