const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api', require('./routes'));

app.listen(PORT, ()=>{
  console.log(`Server is listening on http://localhost:${PORT}`);
});
