const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');

const app = express();

app.use(express.json());
app.use(cors());

const uri = "mongodb://localhost:27017";
const dbName = 'Pesquisa';
const client = new MongoClient(uri);

client.connect()
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida!");
  })
  .catch(err => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });


app.post("/history", async (req, res) => {
  const body = req.body;

  console.log("Passed: ", req.body);

  try {
      const db = client.db(dbName);

      console.log("Tentando inserir...");

      await db.collection('Cidade').insertOne({ cidade: body.cidade });
      console.log('Documento inserido com sucesso');

      res.send({
        response: "Success",
      })
  } catch(error) {
    console.error("Erro durante a inserção:", error);
    res.status(500).send({
      response: "Error",
      message: error.message,
    });
  }
});

process.on('exit', () => {
  console.log("Encerrando o aplicativo...");
  client.close();
});

process.on('SIGINT', () => {
  console.log("Encerrando o aplicativo...");
  client.close();
  process.exit();
});

app.listen(3333, () => {
  console.log("Server is running!");
});