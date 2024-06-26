const express = require('express');
const mysql = require('mysql');
const app = express();

const port = 8080;

const pool = mysql.createPool({
  connectionLimit: 10, // Limite máximo de conexões no pool
  host: 'database',    // Nome do serviço MySQL no Docker Compose
  user: 'root',
  password: '',
  database: 'performance_schema' // Nome do banco de dados
});

// Função para inserir dados no banco
function sqlInsert(values) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO people (name) VALUES ?`;
    pool.query(sql, [values], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
        console.log(`Foram inseridas ${result.affectedRows} pessoas!`);
      }
    });
  });
}

// Função para selecionar todos os registros da tabela people
function sqlSelect() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM people`;
    pool.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Rota GET para a página inicial
app.get('/', async (req, res) => {
  try {
    const peopleList = await sqlSelect();
    res.render('index', { title: 'Full Cycle Rocks!', peopleList });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).send('Erro interno ao buscar dados.');
  }
});

// Configuração do template engine EJS
app.set('view engine', 'ejs');

// Iniciar o servidor Express
app.listen(port, () => {
  console.log(`Servidor Node.js rodando na porta: ${port}`);
});
