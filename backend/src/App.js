const express = require("express");
const app = express();
const cors = require("cors");

// Configurações
app.set("port", process.env.PORT || 3001);

// Middlewares
app.use(express.json());

/*/ Configurar CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
}); /*/
app.use(cors());

//Importar Middleware criada
const middleware = require("./middlewares/middleware");

// Rotas
app.use("/user", require("./routes/utilizador.route"));
app.use("/centros", require("./routes/centros.route"));
app.use("/localizacoes", require("./routes/localizacoes.route"));
app.use("/salas", require("./routes/salas.route"));
app.use("/permissoes", require("./routes/permissoes.route"));
app.use("/tipoUtilizador", require("./routes/tipoutilizador.route"));
app.use("/reservas", require("./routes/reservas.route"));

app.use("/", (req, res) => {
  res.send("Rota não definida");
});

// Importar os models criados
const sequelize = require("./models/index");

app.listen(app.get("port"), () => {
  console.log("Start server on port " + app.get("port"));
});
