const mongoose = require("mongoose");
const Product = require("./models/productModel");
const { config } = require("dotenv");
const { faker } = require("@faker-js/faker");

config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to the database.");
    seedData();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

async function seedData() {
  try {
    await Product.deleteMany({});
    console.log("Previous data cleared.");

    const products = Array.from({ length: 10 }).map(() => {
      const name = faker.food.fruit();
      console.log(name);
      let imageName = name.split(" ").join("");
      console.log(imageName);

      return {
        name,
        price: faker.commerce.price({ min: 0, max: 30 }),
        initialStock: faker.number.int({ min: 10, max: 100 }),
        image: faker.image.urlLoremFlickr({
          width: 200,
          height: 200,
          category: imageName,
        }),
        origin: faker.location.country(),
        category: faker.helpers.arrayElement(["Daily", "Seasonal"]),
      };
    });

    await Product.insertMany(products);
    console.log("seed data inserted successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error inserting seed data:", err);
    mongoose.connection.close();
  }
}
