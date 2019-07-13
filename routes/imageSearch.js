const axios = require('axios');
const imageSearch = (request, response) => {
  const { q } = request.query;
  const {
    GOOGLE_SEARCH_URL,
    GOOGLE_SEARCH_ID,
    GOOGLE_SEARCH_KEY
  } = process.env;

  const queryString = `q=${q}&cx=${GOOGLE_SEARCH_ID}&searchType=image&key=${GOOGLE_SEARCH_KEY}`;
  const imageSearchUrl = `${GOOGLE_SEARCH_URL}?${queryString}`;

  axios
    .get(imageSearchUrl)
    .then(result => {
      const { items } = result.data;
      return items.map(
        image => (
          { thumbnail : image.link }
        )
      )
    })
    .then(images => {
      response.send(images);
    })
    .catch(err => {
      response.send(err);
    })
  }

module.exports = imageSearch;
