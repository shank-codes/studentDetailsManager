require('dotenv').config();

const { application } = require('express');
const express = require('express')
const mongoose = require('mongoose')


const app = express();

mongoose.connect(process.env.DATABASE, {}).then(
    () => { 
        console.log('connected to database successfully')
     },
    err => { console.log(`error while connecting to database: ${err}`) }
  );

app.get('/', (req,res) => {

    res.statusCode = 200
    res.send('Hello world');
})

app.listen(process.env.PORT, () => {
    console.log(`app is running at http://${process.env.HOSTNAME}:${process.env.PORT}`)
})