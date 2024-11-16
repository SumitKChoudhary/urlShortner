const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/routes')
const errorHandler = require('./middleware/errorHandler');
require("dotenv").config();
require('./schedulers/visitHistorySync');



const app = express();

app.use(bodyParser.json());
app.use(routes);

app.use(errorHandler);

mongoose
  .connect(
    `${process.env.MONGO_URL}`
  )
  .then(result => {
    app.listen(process.env.PORT);
  })
  .catch(err => console.log(err));
