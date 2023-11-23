const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var models = require("../models/index");
const userModel = models.utilizador;
const tipoUtilizador = models.tipoutilizador;
const permissoesUtilizador = models.permissoesUtilizador;
const config = require("../config/jwt.config"); //ficheiro de configuração
const sequelize = require("sequelize");
const nodemailer = require("nodemailer");

const controllers = {};
controllers.list = async (req, res) => {
  const data = await userModel
    .findAll({
      order: [[sequelize.col("id_utilizador"), "ASC"]],
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.json({ success: true, data: data });
};

controllers.findUserById = async (req, res) => {
  const { id } = req.params;
  const data = userModel
    .findOne({ where: { id_utilizador: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.findUserByToken = async (req, res) => {
  let decoded;
  if (req.params.id) {
    try {
      decoded = jwt.decode(req.params.id);
    } catch (e) {
      return res.status(401).send("unauthorized");
    }
  }
  try {
    const user = await userModel.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        message: "User does not exist!",
      });
    }
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

controllers.register = async (req, res) => {
  console.log("A registar: " + JSON.stringify(req.body));
  const data = userModel
    .create({
      primeironome: req.body.primeironome,
      sobrenome: req.body.sobrenome,
      email: req.body.email,
      password: req.body.password,
      passwordprecisaupdate: req.body.passwordprecisaupdate,
      emailconfirmado: req.body.emailconfirmado,
      activeStatus: req.body.activeStatus,
      id_centro: req.body.id_centro,
      id_tipoUtilizador: req.body.id_tipoUtilizador,
      id_permissao: req.body.id_permissao,
    })
    .then(function (data) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "softinsareunions@gmail.com",
          pass: "zwwunrhqkfghpcqb",
        },
      });
      var textoEmail = `Olá ${req.body.primeironome}, 
A sua conta no Softinsa Reunions foi criada com sucesso.

Aceda com o seu email e a password fornecida pela sua equipa informática/gestor de equipa.
Pode reservar e aceder a partir da aplicação mobile, e se for administrador, na web a partir do seguinte link:\n\n
      https://softinsa-reunions.herokuapp.com`;
      var mailOptions = {
        from: "softinsareunions@gmail.com",
        to: req.body.email,
        subject: "Registo em Softinsa Reunions",
        text: textoEmail,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("ERRO AO ENVIAR EMAIL " + error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      return data;
    })
    .catch((error) => {
      return error;
    });
  res.status(200).json({
    success: true,
    message: "Registado",
    data: data,
  });
};

controllers.firstLogin = async (req, res) => {
  let decoded;
  if (req.params.id) {
    try {
      decoded = jwt.decode(req.params.id);
    } catch (e) {
      return res.status(401).send("unauthorized");
    }
  }
  var user = await userModel
    .findOne({ where: { id_utilizador: decoded.id } })
    .then(function (data) {
      if (data.passwordprecisaupdate === true) {
        res.json({ success: true, message: "Password precica de update!", data: data.id_utilizador });
      } else {
        res.json({ success: false, message: "Password não precica de update!" });
      }
    })
    .catch((error) => {
      console.log("Erro: " + error);
      return error;
    });
};

controllers.login = async (req, res) => {
  if (req.body.email && req.body.password) {
    var email = req.body.email;
    var password = req.body.password;
  }
  var user = await userModel
    .findOne({
      include: [
        {
          model: permissoesUtilizador,
          required: true,
          attributes: ["descricao", "id_permissao"],
        },
        {
          model: tipoUtilizador,
          required: true,
          attributes: ["descricao", "id_tipoUtilizador"],
        },
      ],
      where: {
        email: email,
      },
    })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      console.log("Erro: " + error);
      return error;
    });
  if (password === null || typeof password === "undefined") {
    res.status(403).json({
      success: false,
      message: "Campos em Branco",
    });
  } else {
    if (req.body.email && req.body.password && user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (req.body.email === user.email && isMatch) {
        if (user.activeStatus === false) {
          res.json({ success: false, message: "Utilizador inativo. Contacte o suporte!" });
        } else if (user.TipoUtilizador.descricao !== "Administrador" && user.PermissoesUtilizador.descricao !== "Back-Office") {
          // !Administradoor
          res.json({ success: false, message: "Plataforma disponivel apenas para 'Administrador' ou utilizadores com permissão 'Back-Office'!" });
        } else {
          let token = jwt.sign({ id: user.id_utilizador, email: req.body.email }, config.jwtSecret, { expiresIn: "1h" });
          res.json({ success: true, message: "Autenticação realizada com sucesso!", token: token });
        }
      } else {
        res.status(403).json({ success: false, message: "Dados de autenticação inválidos." });
      }
    } else {
      res.status(400).json({ success: false, message: "Erro no processo de autenticação. Tente de novo mais tarde." });
    }
  }
};

controllers.mobileLogin = async (req, res) => {
  if (req.body.email && req.body.password) {
    var email = req.body.email;
    var password = req.body.password;
  }
  var user = await userModel
    .findOne({ where: { email: email } })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      console.log("Erro: " + error);
      return error;
    });
  if (password === null || typeof password === "undefined") {
    res.status(403).json({
      success: false,
      message: "Campos em Branco",
    });
  } else {
    if (req.body.email && req.body.password && user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (req.body.email === user.email && isMatch) {
        if (user.activeStatus === false) {
          res.json({ success: false, message: "Utilizador inativo. Contacte o suporte!" });
        } else {
          let token = jwt.sign({ id: user.id_utilizador, email: req.body.email }, config.jwtSecret, { expiresIn: "1h" });
          res.json({ success: true, message: "Autenticação realizada com sucesso!", token: token });
        }
      } else {
        res.status(403).json({ success: false, message: "Dados de autenticação inválidos." });
      }
    } else {
      res.status(400).json({ success: false, message: "Erro no processo de autenticação. Tente de novo mais tarde." });
    }
  }
};

controllers.verifyPassword = async (req, res) => {
  if (req.body.userToken && req.body.inputPassword) {
    var token = req.body.userToken;
    var password = req.body.inputPassword;
  }

  let decoded;
  try {
    decoded = jwt.decode(token);
  } catch (e) {
    return res.status(401).send("unauthorized");
  }

  var user = await userModel
    .findOne({ where: { id_utilizador: decoded.id } })
    .then(function (data) {
      return data;
    })
    .catch((error) => {
      console.log("Erro: " + error);
      return error;
    });
  if (password === null || typeof password === "undefined") {
    res.status(403).json({
      success: false,
      message: "Campos em Branco",
    });
  } else {
    if (req.body.inputPassword && user) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (isMatch) {
        res.json({ success: true, message: "Password correta." });
      } else {
        res.status(403).json({ success: false, message: "Password incorreta." });
      }
    } else {
      res.status(400).json({ success: false, message: "Erro no processo de autenticação. Tente de novo mais tarde." });
    }
  }
};

controllers.delete = async (req, res) => {
  const { id } = req.params;
  const data = userModel
    .destroy({ where: { id_utilizador: id } })
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.updateUser = async (req, res) => {
  const { id } = req.params;
  const data = userModel
    .update(
      {
        primeironome: req.body.primeironome,
        sobrenome: req.body.sobrenome,
        id_centro: req.body.id_centro,
        id_tipoUtilizador: req.body.id_tipoUtilizador,
        id_permissao: req.body.id_permissao,
      },
      { where: { id_utilizador: id } }
    )
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.updateStatus = async (req, res) => {
  const { id } = req.params;
  const data = userModel
    .update(
      {
        activeStatus: req.body.activeStatus,
      },
      { where: { id_utilizador: id } }
    )
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.updatePasswordFirstLogin = async (req, res) => {
  const { id } = req.params;
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  const data = userModel
    .update(
      {
        password: req.body.password,
        passwordprecisaupdate: false,
      },
      { where: { id_utilizador: id } }
    )
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

controllers.getNumberOfUsers = async (req, res) => {
  const data = userModel
    .count()
    .then(function (data) {
      res.json({ success: true, data: data });
    })
    .catch((error) => {
      res.json({ success: false, data: error });
      console.log(error);
    });
};

module.exports = controllers;
