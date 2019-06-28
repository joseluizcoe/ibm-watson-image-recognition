require('dotenv').config();
const app = require('express')();
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

app.get('/', (request, response) => {
  response.send(`
  <form action="/result">
  <fieldset>
    <label>URL:</label>
    <input name="url" />
  </fieldset>
  <fieldset>
    <label>Tipo de reconhecimento</label>
    <input name="type" value="face" />
  </fieldset>
  <button type="submit">Ok</button>
  </form>
  `);
})

app.get('/result', (request, response) => {
  const apiConfig = {
    version: '2018-03-19',
    iam_apikey: process.env.WATSON_API_KEY
  }

  const visualRecognition = new VisualRecognitionV3(apiConfig);
  
  const url= request.query.url || null;
  const type = request.query.type || 'default';  
  const params = {
    url: url,
  };

  let action = visualRecognition.classify;
  switch(type) {
    case 'face':
      action = visualRecognition.detectFaces;
      break;
    default:
      action = visualRecognition.classify;
  }

  action.apply(visualRecognition, [params, (err, dataResult) => {
    if (err) {
      throw(err);
      return;
    }

    const result = JSON.stringify(dataResult, null, 2);
    const allFaces = dataResult.images[0].faces;

    
    const faces = allFaces.map((face, index) => {
      let {height, width, top, left} = face.face_location;
      return `
      <style>
        .face_${index} {
          position : absolute;
          height: ${height};
          width:  ${width};
          top:  ${top};
          left: ${left};
          border: 2px solid red;
          border-radius: 4px;
          z-index: 1;
        }
      </style>
      <div class="face_${index}"></div>
      `
    });

    response.send(`
      <style>
        * {margin:0; padding:0;}
        #image-result {
          position : absolute;
          top: 100px;
          left: 0;
          z-index: 0;
        }
        img {
          position: relative;
        }
        h1 {
          font-size : 60px;
          heigth: 50px;
        }
      </style>
      <h1>Rostos detectados: ${allFaces.length}</h1>
      <div id="image-result">
        <img src="${url}" />
        ${faces.join('')}
      </div>
    `);
  }]);

});


app.listen(3001, (error) => {
  if(error) {
    console.log(error); 
  }
  console.log('App rodando em http://localhost:3001');
});
