const express = require('express');
const routes = require('./routes');
const { Sequelize } = require('sequelize');



const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const sequelize = new Sequelize('ecommerce_db', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
}).catch((error) => {
  console.error('Error synchronizing models with the database:', error);
});
