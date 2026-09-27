const express = require("express");
const router = express.Router();
const { getProducts, purchaseProducts } = require("../controllers/productController");
const validatePurchase = require("../middleware/validatePurchase");

router.get("/products", getProducts);
router.post("/purchase", validatePurchase, purchaseProducts);

module.exports = router;
