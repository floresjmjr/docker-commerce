/* eslint-disable max-len */
const express = require('express');
const app = express();
const PORT = 3000;
const Handlebars = require('handlebars');
const {create} = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const {select} = require('./routes/_functions.js')

const hbs = create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: { 
    select: select,
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());



app.use('/', require('./routes'));

app.listen(PORT, ()=>{
  console.log(`Server is listening on http://localhost:${PORT}`);
});
