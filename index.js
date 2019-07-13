require('dotenv').config();
const cors = require('cors');
const app = require('express')();
const {APP_PORT} = process.env;
const {imageRecognition, imageSearch} = require('./routes');

app.use(cors());
app.get('/api/image-recognition', imageRecognition);
app.get('/api/image-search', imageSearch);

app.listen(APP_PORT, (error) => {
  if(error) {
    console.log(error); 
  }
  console.log(`App rodando em http://localhost:${APP_PORT}`);
});
