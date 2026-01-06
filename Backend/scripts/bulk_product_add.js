import mongoose from "mongoose";
import Product from "../models/product.js";
import connectMongo from "../mongo_DB.js";  // your db connection
import product from "../models/product.js";


const products = [
    // ===== HOUSEHOLD & CLEANING =====
  {
    productId: "PROD-031",
    name: "Surf Excel Detergent",
    brand: "Surf Excel",
    category: "Household",
    tags: ["detergent", "surf excel", "laundry", "cleaning"],
    unitSize: 1,
    unitType: "weight",
    basePrice: 210,
  },
  {
    productId: "PROD-032",
    name: "Vim Dishwash Gel",
    brand: "Vim",
    category: "Household",
    tags: ["vim", "dishwash", "utensil cleaner"],
    unitSize: 500,
    unitType: "volume",
    basePrice: 95,
  },
  {
    productId: "PROD-033",
    name: "Harpic Toilet Cleaner",
    brand: "Harpic",
    category: "Household",
    tags: ["harpic", "toilet cleaner", "bathroom"],
    unitSize: 500,
    unitType: "volume",
    basePrice: 110,
  },
  {
    productId: "PROD-034",
    name: "Lizol Floor Cleaner",
    brand: "Lizol",
    category: "Household",
    tags: ["lizol", "floor cleaner", "disinfectant"],
    unitSize: 1,
    unitType: "volume",
    basePrice: 180,
  },
  {
    productId: "PROD-035",
    name: "Colin Glass Cleaner",
    brand: "Colin",
    category: "Household",
    tags: ["colin", "glass cleaner", "cleaning"],
    unitSize: 500,
    unitType: "volume",
    basePrice: 95,
  },

  // ===== PERSONAL CARE =====
  {
    productId: "PROD-036",
    name: "Dove Bath Soap",
    brand: "Dove",
    category: "Personal Care",
    tags: ["soap", "dove", "bath", "skin care"],
    unitSize: 125,
    unitType: "weight",
    basePrice: 65,
  },
  {
    productId: "PROD-037",
    name: "Lux Soap",
    brand: "Lux",
    category: "Personal Care",
    tags: ["lux", "soap", "bath"],
    unitSize: 150,
    unitType: "weight",
    basePrice: 45,
  },
  {
    productId: "PROD-038",
    name: "Patanjali Aloe Vera Gel",
    brand: "Patanjali",
    category: "Personal Care",
    tags: ["aloe vera", "patanjali", "skin care"],
    unitSize: 150,
    unitType: "volume",
    basePrice: 90,
  },
  {
    productId: "PROD-039",
    name: "Colgate Toothpaste",
    brand: "Colgate",
    category: "Personal Care",
    tags: ["toothpaste", "colgate", "oral care"],
    unitSize: 200,
    unitType: "weight",
    basePrice: 110,
  },
  {
    productId: "PROD-040",
    name: "Head & Shoulders Shampoo",
    brand: "Head & Shoulders",
    category: "Personal Care",
    tags: ["shampoo", "head and shoulders", "hair care"],
    unitSize: 180,
    unitType: "volume",
    basePrice: 195,
  },

  // ===== BABY CARE =====
  {
    productId: "PROD-041",
    name: "Johnson Baby Soap",
    brand: "Johnson & Johnson",
    category: "Baby Care",
    tags: ["baby soap", "johnson", "baby care"],
    unitSize: 75,
    unitType: "weight",
    basePrice: 55,
  },
  {
    productId: "PROD-042",
    name: "Johnson Baby Oil",
    brand: "Johnson & Johnson",
    category: "Baby Care",
    tags: ["baby oil", "johnson", "baby massage"],
    unitSize: 200,
    unitType: "volume",
    basePrice: 170,
  },
  {
    productId: "PROD-043",
    name: "Himalaya Baby Powder",
    brand: "Himalaya",
    category: "Baby Care",
    tags: ["baby powder", "himalaya", "baby care"],
    unitSize: 200,
    unitType: "weight",
    basePrice: 145,
  },

  // ===== SPICES =====
  {
    productId: "PROD-044",
    name: "Turmeric Powder",
    brand: "Everest",
    category: "Spices",
    tags: ["haldi", "turmeric", "everest", "spice"],
    unitSize: 200,
    unitType: "weight",
    basePrice: 85,
  },
  {
    productId: "PROD-045",
    name: "Red Chilli Powder",
    brand: "MDH",
    category: "Spices",
    tags: ["chilli powder", "mdh", "spice"],
    unitSize: 200,
    unitType: "weight",
    basePrice: 95,
  },
  {
    productId: "PROD-046",
    name: "Garam Masala",
    brand: "Catch",
    category: "Spices",
    tags: ["garam masala", "catch", "spice mix"],
    unitSize: 100,
    unitType: "weight",
    basePrice: 90,
  },

  // ===== READY TO COOK =====
  {
    productId: "PROD-047",
    name: "MTR Ready To Eat Paneer Butter Masala",
    brand: "MTR",
    category: "Ready To Eat",
    tags: ["ready to eat", "mtr", "paneer"],
    unitSize: 300,
    unitType: "weight",
    basePrice: 135,
  },
  {
    productId: "PROD-048",
    name: "Kellogg's Cornflakes",
    brand: "Kellogg's",
    category: "Breakfast",
    tags: ["cornflakes", "kelloggs", "breakfast"],
    unitSize: 475,
    unitType: "weight",
    basePrice: 210,
  },

  // ===== DRY FRUITS =====
  {
    productId: "PROD-049",
    name: "Almonds",
    brand: "True Elements",
    category: "Dry Fruits",
    tags: ["almonds", "badam", "dry fruits"],
    unitSize: 250,
    unitType: "weight",
    basePrice: 310,
  },
  {
    productId: "PROD-050",
    name: "Cashew Nuts",
    brand: "True Elements",
    category: "Dry Fruits",
    tags: ["cashew", "kaju", "dry fruits"],
    unitSize: 250,
    unitType: "weight",
    basePrice: 295,
  },

  // ===== MORE DAILY ESSENTIALS =====
  {
    productId: "PROD-051",
    name: "Sugar",
    brand: "Madhur",
    category: "Staples",
    tags: ["sugar", "chini", "sweetener"],
    unitSize: 1,
    unitType: "weight",
    basePrice: 48,
  },
  {
    productId: "PROD-052",
    name: "Salt",
    brand: "Tata",
    category: "Staples",
    tags: ["salt", "namak", "tata salt"],
    unitSize: 1,
    unitType: "weight",
    basePrice: 28,
  },
  {
    productId: "PROD-053",
    name: "Poha",
    brand: "24 Mantra",
    category: "Staples",
    tags: ["poha", "flattened rice", "breakfast"],
    unitSize: 500,
    unitType: "weight",
    basePrice: 55,
  },

  // ===== LAST BATCH =====
  {
    productId: "PROD-054",
    name: "Bread",
    brand: "Britannia",
    category: "Bakery",
    tags: ["bread", "britannia", "bakery"],
    unitSize: 400,
    unitType: "weight",
    basePrice: 45,
  },
  {
    productId: "PROD-055",
    name: "Eggs",
    brand: "Farm Fresh",
    category: "Poultry",
    tags: ["eggs", "protein", "daily"],
    unitSize: 12,
    unitType: "piece",
    basePrice: 78,
  }


]



const seedProducts = async (products) => {
  try {
    await connectMongo();
    await Product.insertMany(products);

    console.log("✅  products inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts(products);
