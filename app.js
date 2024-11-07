const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/url');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');


const app = express();

app.use(bodyParser.json());
app.use('/url',urlRoutes);
app.use('/analytics',analyticsRoutes);
app.use('/auth',authRoutes);

app.use((error, req, res, next)=>{
   console.log(error);
   const status = error.statusCode || 500;
   const message = error.message;
   const data = error.data;
   res.status(status).json({message: message, data: data});
});

mongoose
  .connect(
    'mongodb+srv://sumit_123:sumit-123@cluster0.lhtnag6.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
