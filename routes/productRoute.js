const express = require("express");
const router = express.Router();
const productCtrl = require("./../controllers/productCtrl.js");
const upload = require("../middleware/imageUpload.js");

router.post("/create", upload.single("image"), productCtrl.createProduct);
router.put("/:id/edit", upload.single("image"), productCtrl.editProduct);
router.delete("/:id", productCtrl.deleteProduct);

router.get("/all", productCtrl.getAllProducts);
router.get("/:id", productCtrl.getProductById);
router.get("/status/:status", productCtrl.getProductsByStatus);
router.get("/category/:category", productCtrl.getProductsByCategory);

router.post("/purchase", productCtrl.purchaseProduct);

module.exports = router;
