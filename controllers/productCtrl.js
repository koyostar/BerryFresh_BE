const Product = require("../models/productModel");

module.exports = {
  createProduct,
  editProduct,
  // duplicateProduct,
  deleteProduct,
  // archiveProduct,
  // restoreProduct,
  getAllProducts,
  getProductById,
  getProductsByStatus,
  getProductsByCategory,
  purchaseProduct,
};

async function createProduct(req, res) {
  try {
    const { name, priceInCents, initialStock, image, origin, category } =
      req.body;
    if (
      !name ||
      !priceInCents ||
      !initialStock ||
      !image ||
      !origin ||
      !category
    ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const newProduct = {
      name,
      priceInCents,
      initialStock,
      image,
      origin,
      category,
    };
    const product = await Product.create(newProduct);

    return res.status(201).json(product);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function editProduct(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product successfully deleted",
      deletedProduct: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getProductsByStatus(req, res) {
  const { status } = req.params;
  try {
    const products = await Product.find({ status });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getProductsByCategory(req, res) {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function purchaseProduct(req, res) {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.updateStock(quantity);

    res.status(200).json({ message: "Purchase successful", product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
