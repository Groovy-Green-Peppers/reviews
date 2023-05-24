Create Table If Not Exists Reviews (
  id Serial Primary Key,
  product_id int,
  rating int,
  date bigint,
  summary Varchar(100),
  body Varchar(1000),
  recommend boolean,
  reported boolean,
  reviewer_name Varchar(20),
  reviewer_email Varchar(30),
  response Varchar(1000),
  helpfulness int
);

Create Table If Not Exists Review_Photos (
  id Serial Primary Key,
  review_id int References Reviews(id),
  url Varchar(1000),
);

Create Table If Not Exists Review_Characteristics (
  id Serial Primary Key,
  characteristic_id int,
  review_id int References Reviews(id),
  value int
);