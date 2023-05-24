const mongoose = require('mongoose');

const { Schema } = mongoose;

const photoSchema = new Schema({
  id: Number,
  url: String,
});

const reviewSchema = new Schema({
  review_id: { type: Number, required: true },
  rating: { type: Number, required: true },
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: { type: Date, default: Date.now },
  reviewer_name: String,
  helpfulness: Number,
  photos: [photoSchema],
});

const reviewCharacteristicsSchema = new Schema({
  id: Number,
  characteristic_id: Number,
  review_id: Number,
  value: Number,
});

const ReviewCharacteristic = mongoose.model('ReviewCharacteristic', reviewCharacteristicsSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review, ReviewCharacteristic };
