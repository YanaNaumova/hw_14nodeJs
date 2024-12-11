import express from "express";
import "dotenv/config";
import { connectDb } from "./config/db.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import { isValidObjectId } from "mongoose";

const port = process.env.PORT;
const app = express();
app.use(express.json());

connectDb();

app.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const category = await Category.create({
      name,
    });
    res
      .status(201)
      .json({ message: "create new Category", category: category });
  } catch (error) {
    res.status(500).json({ message: "Error created Category" });
  }
});

app.post("/products", async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!isValidObjectId(category)) {
      return res.status(400).json({ message: "Category incorrect" });
    }
    const categoryExistiert = await Category.findById(category);
    console.log(categoryExistiert);
    if (!categoryExistiert) {
      return res.status(404).json({ message: "Category not found" });
    }
    const product = await Product.create({
      name,
      price,
      category,
    });
    res.status(201).json({ message: "created new product", product: product });
  } catch (error) {
    res.status(500).json({ message: "Error created product" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching poss", error });
  }
});

app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
