const { pool } = require('../db');

exports.getReviews = (req, res) => {
  const product = Number(req.query.product_id);
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort || 'relevant';
  let orderBy = null;

  if (sort === 'relevant' || sort === 'helpful') {
    orderBy = 'helpfulness';
  } else {
    orderBy = 'date';
  }

  const reviewsResponse = {
    product,
    page,
    count,
    results: null,
  };

  if (Number.isNaN(product) || product === 0) {
    return res.status(400).json({ error: 'Invalid product ID.' });
  }

  pool.query(`
  SELECT reviews.*, 
  ARRAY_AGG(json_build_object('id', review_photos.id, 'url', review_photos.url)) AS photos
  FROM reviews
  LEFT JOIN review_photos ON reviews.review_id = review_photos.review_id
  WHERE reviews.product_id = ${product} AND reviews.reported IS NOT TRUE
  GROUP BY reviews.review_id
  ORDER BY reviews.${orderBy} DESC
  LIMIT ${count} OFFSET ${page * count - count};
  `)
    .then((response) => {
      if (response.rows.length === 0) {
        return res.status(404).json({ error: 'No product with that ID or no reviews for the product.' });
      }
      reviewsResponse.results = response.rows;
      return res.json(reviewsResponse);
    })
    .catch((err) => {
      console.log('Failed to get reviews from DB:', err);
      res.status(500).json({ error: 'Something went wrong...' });
    });
};

exports.getReviewsMeta = (req, res) => {

};

exports.postReview = (req, res) => {

};

exports.putHelpful = (req, res) => {

};

exports.putReport = (req, res) => {

};

module.exports = exports;
