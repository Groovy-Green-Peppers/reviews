Create Table If Not Exists Reviews (
  review_id Serial Primary Key,
  product_id int,
  rating int,
  date bigint,
  summary Varchar(100),
  body Varchar(1000),
  recommend boolean,
  reported boolean,
  reviewer_name Varchar(100),
  reviewer_email Varchar(100),
  response Varchar(1000),
  helpfulness int
);

Create Table If Not Exists Review_Photos (
  id Serial Primary Key,
  review_id int References Reviews(review_id),
  url Varchar(1000)
);

Create Table If Not Exists Review_Characteristics (
  id Serial Primary Key,
  characteristic_id int,
  review_id int References Reviews(review_id),
  value int
);

\copy reviews TO 'hR/reviews/server/reviews.csv' DELIMITER ',' CSV HEADER;
\copy review_photos TO 'hR/reviews/server/reviews_photos.csv' DELIMITER ',' CSV HEADER;
\copy review_characteristics TO 'hR/reviews/server/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;