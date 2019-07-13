const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const apiConfig = require('../config/apiConfig');

const imageRecognition = (request, response) => {
  const { url } = request.query;
  const visualRecognition = new VisualRecognitionV3(apiConfig);

  visualRecognition
    .detectFaces( { url },
      (err, dataResult) => {
        if (err) {
          console.log(err);
          return;
        }
        const stringResult = JSON.stringify(dataResult, null, 2);
        response.send(stringResult);
      }
    );
}

module.exports = imageRecognition;
