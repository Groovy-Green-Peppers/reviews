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

exports.getReviewsMeta = async (req, res) => {
  const product = Number(req.query.product_id);
  if (Number.isNaN(product) || product === 0) {
    return res.status(400).json({ error: 'Invalid product ID.' });
  }

  const metaResponse = {
    product_id: product,
    ratings: {},
    recommended: {},
    characteristics: {},
  };

  try {
    const ratingResponse = await pool.query(`
      SELECT 
        rating, COUNT(rating) as count,
        CASE WHEN recommend THEN 1 ELSE 0 END as recommend, COUNT(recommend) as recommend_count
      FROM reviews
      WHERE product_id = ${product}
      AND reported IS NOT TRUE
      GROUP BY rating, recommend;
    `);

    ratingResponse.rows.forEach((row) => {
      metaResponse.ratings[row.rating] = Number(row.count);
      if (row.recommend === 1) {
        metaResponse.recommended.true = Number(row.recommend_count);
      } else {
        metaResponse.recommended.false = Number(row.recommend_count);
      }
    });

    const characteristicsResponse = await pool.query(`
      SELECT 
        rc.characteristic_id, AVG(rc.value) as value
      FROM review_characteristics rc
      INNER JOIN reviews r ON rc.review_id = r.review_id
      WHERE r.product_id = ${product}
      AND r.reported IS NOT TRUE
      GROUP BY rc.characteristic_id;
    `);
    characteristicsResponse.rows.forEach((row, i) => {
      const charNames = [null, 'Comfort', 'Fit', 'Length', 'Quality', 'Width', 'Size'];
      metaResponse.characteristics[charNames[i + 1]] = {
        id: row.characteristic_id,
        value: row.value,
      };
    });

    res.json(metaResponse);
  } catch (err) {
    console.log('Failed to get review metadata from DB:', err);
    res.status(500).json({ error: 'Something went wrong...' });
  }
};

exports.postReview = async (req, res) => {
  const {
    product_id, rating, summary, body, recommend, name, email, photos, characteristics,
  } = req.body;

  try {
    // Insert review into reviews table
    const reviewResponse = await pool.query(`
      INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING review_id;
    `, [product_id, rating, Date.now(), summary, body, recommend, name, email]);

    const reviewId = reviewResponse.rows[0].review_id;

    // Insert photos into review_photos table
    for (const photo of photos) {
      await pool.query(`
        INSERT INTO review_photos (review_id, url)
        VALUES ($1, $2);
      `, [reviewId, photo]);
    }

    // Insert characteristics into review_characteristics table
    for (const characteristic_id in characteristics) {
      await pool.query(`
        INSERT INTO review_characteristics (characteristic_id, review_id, value)
        VALUES ($1, $2, $3);
      `, [characteristic_id, reviewId, characteristics[characteristic_id]]);
    }

    res.status(201).end();
  } catch (err) {
    console.error('Failed to post review:', err);
    res.status(500).json({ error: 'Something went wrong...' });
  }
};

exports.putHelpful = async (req, res) => {
  const { review_id } = req.params;

  try {
    await pool.query(`
      UPDATE reviews 
      SET helpfulness = helpfulness + 1 
      WHERE review_id = $1;
    `, [review_id]);

    res.status(204).end();
  } catch (err) {
    console.error('Failed to mark review as helpful:', err);
    res.status(500).json({ error: 'Something went wrong...' });
  }
};

exports.putReport = async (req, res) => {
  const { review_id } = req.params;

  try {
    await pool.query(`
      UPDATE reviews 
      SET reported = true 
      WHERE review_id = $1;
    `, [review_id]);

    res.status(204).end();
  } catch (err) {
    console.error('Failed to report review:', err);
    res.status(500).json({ error: 'Something went wrong...' });
  }
};

module.exports = exports;
