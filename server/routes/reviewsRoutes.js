const express = require('express');

const router = express.Router();

const {
  getReviews, getReviewsMeta, postReview, putHelpful, putReport,
} = require('../controllers/reviewsController');

router.get('/', getReviews);

router.get('/meta', getReviewsMeta);

router.post('/', postReview);

router.put('/:review_id/helpful', putHelpful);

router.put('/:review_id/report', putReport);

module.exports = router;
