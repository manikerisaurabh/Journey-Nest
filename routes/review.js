const express = require("express");
const router = express.Router({ mergeParams: true });


const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");


//post
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviewController.postNewReview));

//delete review
router.delete(
    "/:reviewID",
    isLoggedIn,
    isReviewAuthor,
    reviewController.destroyReview
)

module.exports = router;