const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

// Ensure DNS resolution works reliably for MongoDB Atlas on Windows
const dns = require("node:dns").promises;
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Product = require("../Product/models/productModel");

const testProducts = [
  // ==================== 6 NIKE PRODUCTS ====================
  {
    name: "Nike Air Max 90",
    brand: "Nike",
    category: "Running",
    description:
      "Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG roots with the iconic Waffle sole, stitched overlays and classic TPU accents.",
    price: 9995,
    discountPrice: 8495,
    sizes: [7, 8, 9, 10, 11],
    colors: ["White", "Infrared", "Black"],
    stock: 25,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
  },
  {
    name: "Nike Dunk Low Retro",
    brand: "Nike",
    category: "Lifestyle",
    description:
      "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with perfectly shined overlays and classic team colors.",
    price: 8295,
    discountPrice: null,
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ["Black", "White"],
    stock: 18,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
    ],
  },
  {
    name: "Nike Air Force 1 '07",
    brand: "Nike",
    category: "Classics",
    description:
      "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold details and the perfect amount of flash.",
    price: 7495,
    discountPrice: 6995,
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ["Triple White"],
    stock: 35,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    ],
  },
  {
    name: "Nike Air Jordan 1 Mid",
    brand: "Nike",
    category: "Basketball",
    description:
      "Inspired by the original AJ1, this mid-top edition maintains the iconic look you love while choice colors and crisp leather give it a distinct identity.",
    price: 11495,
    discountPrice: 10495,
    sizes: [8, 9, 10, 11],
    colors: ["Gym Red", "Black", "White"],
    stock: 12,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    ],
  },
  {
    name: "Nike Air Zoom Pegasus 40",
    brand: "Nike",
    category: "Running",
    description:
      "A springy ride for any run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals with balanced, energized cushioning.",
    price: 10295,
    discountPrice: 8995,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Thunder Blue", "Black"],
    stock: 20,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80",
    ],
  },
  {
    name: "Nike Blazer Mid '77 Vintage",
    brand: "Nike",
    category: "Classics",
    description:
      "Styled for the '70s. Loved in the '80s. Classic in the '90s. Ready for the future. The Nike Blazer Mid '77 delivers a timeless design that's easy to wear.",
    price: 7995,
    discountPrice: null,
    sizes: [7, 8, 9, 10],
    colors: ["White", "Sail", "Black"],
    stock: 22,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80",
    ],
  },

  // ==================== 6 ADIDAS PRODUCTS ====================
  {
    name: "Adidas Ultraboost Light",
    brand: "Adidas",
    category: "Running",
    description:
      "Experience epic energy with the lightest Ultraboost ever made. Hundreds of Boost capsules burst with energy every time your foot hits the tarmac.",
    price: 17999,
    discountPrice: 14999,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Core Black", "Cloud White"],
    stock: 15,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
    ],
  },
  {
    name: "Adidas Samba OG",
    brand: "Adidas",
    category: "Classics",
    description:
      "Born on the pitch, the Samba is a timeless icon of street style. This version stays true to its legacy with a tasteful, low-profile, soft leather upper and suede overlays.",
    price: 10999,
    discountPrice: null,
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ["Cloud White", "Core Black", "Gum"],
    stock: 28,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&q=80",
    ],
  },
  {
    name: "Adidas Stan Smith",
    brand: "Adidas",
    category: "Classics",
    description:
      "Clean and effortless, the Stan Smith has maintained its place as a style staple for over 50 years with perforated 3-Stripes and sleek proportions.",
    price: 7999,
    discountPrice: 6499,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Cloud White", "Fairway Green"],
    stock: 30,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80",
    ],
  },
  {
    name: "Adidas Gazelle",
    brand: "Adidas",
    category: "Lifestyle",
    description:
      "A low-profile classic that started as an indoor soccer shoe. Made with a rich suede upper, the Gazelle continues to transcend trends.",
    price: 8999,
    discountPrice: 7499,
    sizes: [6, 7, 8, 9, 10],
    colors: ["Collegiate Navy", "White"],
    stock: 22,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80",
    ],
  },
  {
    name: "Adidas Forum Low",
    brand: "Adidas",
    category: "Basketball",
    description:
      "More than just a shoe, it's a statement. The adidas Forum hit the scene in '84 and gained major love on both the hardwood and in the music world.",
    price: 9999,
    discountPrice: null,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Cloud White", "Royal Blue"],
    stock: 14,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
    ],
  },
  {
    name: "Adidas NMD_R1 V3",
    brand: "Adidas",
    category: "Lifestyle",
    description:
      "Tactical style meets comfort. These adidas NMD shoes combine running heritage with cutting-edge Boost cushioning and signature midsole plugs.",
    price: 12999,
    discountPrice: 9999,
    sizes: [8, 9, 10, 11],
    colors: ["Grey Five", "Core Black"],
    stock: 19,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
    ],
  },

  // ==================== 6 PUMA PRODUCTS ====================
  {
    name: "Puma RS-X Efekt",
    brand: "Puma",
    category: "Lifestyle",
    description:
      "The RS-X is back. The future-retro silhouette of this sneaker returns with a progressive aesthetic and angular details, complete with nubuck and suede overlays.",
    price: 8999,
    discountPrice: 6999,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Puma White", "Feather Grey"],
    stock: 20,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    ],
  },
  {
    name: "Puma Suede Classic XXI",
    brand: "Puma",
    category: "Classics",
    description:
      "The Suede hit the scene in 1968 and has been changing the game ever since. Worn by icons of every generation, it stays classic forever.",
    price: 6999,
    discountPrice: 5499,
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ["Puma Black", "Puma White"],
    stock: 32,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    ],
  },
  {
    name: "Puma Palermo Special",
    brand: "Puma",
    category: "Classics",
    description:
      "Straight from the archives, this terrace legend returns with its signature T-toe construction and classic gum rubber sole.",
    price: 7999,
    discountPrice: null,
    sizes: [7, 8, 9, 10],
    colors: ["Alpine Snow", "Green Gum"],
    stock: 16,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80",
    ],
  },
  {
    name: "Puma Deviate Nitro 2",
    brand: "Puma",
    category: "Running",
    description:
      "Make every mile count. Maximum cushioning and peak performance with Nitro Elite foam and a redesigned PWRPLATE for effortless propulsion.",
    price: 13999,
    discountPrice: 11999,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Fireglow", "Puma Black"],
    stock: 11,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80",
    ],
  },
  {
    name: "Puma Slipstream Bball",
    brand: "Puma",
    category: "Basketball",
    description:
      "Back in 1987, the Puma Slipstream entered the scene as a high-flying, slam-dunking court shoe. Now it returns reimagined for modern streetwear.",
    price: 8499,
    discountPrice: 6799,
    sizes: [8, 9, 10, 11],
    colors: ["Puma White", "Intense Red"],
    stock: 15,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
    ],
  },
  {
    name: "Puma Clyde OG",
    brand: "Puma",
    category: "Classics",
    description:
      "Named after basketball legend Walt 'Clyde' Frazier, the Clyde embodies fashion, culture, and heritage with clean full-suede execution.",
    price: 7499,
    discountPrice: null,
    sizes: [7, 8, 9, 10],
    colors: ["Puma Navy", "Puma White"],
    stock: 24,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    ],
  },
];

async function seedDatabase() {
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is missing in your environment (.env file)");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully to MongoDB.");

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of testProducts) {
      // Check if product already exists to prevent duplication
      const existingProduct = await Product.findOne({ name: item.name });

      if (existingProduct) {
        skippedCount++;
        console.log(`[SKIP] Already exists: "${item.name}" (${item.brand})`);
      } else {
        await Product.create(item);
        insertedCount++;
        console.log(`[INSERTED] Added: "${item.name}" (${item.brand}) - ₹${item.price}${item.isFeatured ? " [FEATURED]" : ""}`);
      }
    }

    console.log("\n================ SEED SUMMARY ================");
    console.log(`Total Products in Script: ${testProducts.length}`);
    console.log(`Successfully Inserted:   ${insertedCount}`);
    console.log(`Skipped (Already Exist): ${skippedCount}`);
    console.log("===============================================\n");

  } catch (error) {
    console.error("Seeding failed with error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

// Execute if run directly from CLI
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, testProducts };

