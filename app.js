const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 3000;
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('dashboard');
});

app.get('/dados', (req, res) => {
  const resultados = [];

  fs.createReadStream('data/GERACAO_USINA-2_2025_04.csv')
    .pipe(csv({ separator: ';' }))
    .on('data', (data) => resultados.push(data))
    .on('end', () => {
      res.json(resultados);
    });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
