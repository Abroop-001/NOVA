const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const dns = require("node:dns").promises;
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const https = require("https");
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");
const Product = require("../Product/models/productModel");

// 18 Genuine Sneaker Products (6 Nike, 6 Adidas, 6 Puma)
const PRODUCTS_DATA = [
  // ==================== 6 NIKE PRODUCTS ====================
  {
    _id: "6af5d4eb2c792527aee3e2e1",
    name: "Nike Air Force 1 '07",
    brand: "Nike",
    category: "Classics",
    description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold details and the perfect amount of flash to make you shine.",
    price: 7495,
    discountPrice: 6995,
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ["Triple White", "White / Black"],
    stock: 35,
    isFeatured: false,
    rawImages: [
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png",
      "https://image.goat.com/attachments/product_template_pictures/images/078/135/822/original/240_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/100/464/309/original/717534_00.png.png"
    ]
  },
  {
    _id: "6af5d4ea2c792527aee3e2df",
    name: "Nike Air Max 90",
    brand: "Nike",
    category: "Running",
    description: "Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG roots with the iconic Waffle sole, stitched overlays and classic TPU accents.",
    price: 9995,
    discountPrice: 8495,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Infrared", "Triple Black"],
    stock: 25,
    isFeatured: true,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/077/963/758/original/14751_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/080/160/991/original/564089_00.png.png"
    ]
  },
  {
    _id: "6af5d4ea2c792527aee3e2e0",
    name: "Nike Dunk Low Retro",
    brand: "Nike",
    category: "Lifestyle",
    description: "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro delivers classic '80s basketball style with premium leather overlays and vintage hoops flair.",
    price: 8295,
    discountPrice: null,
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ["White / Black", "Phantom"],
    stock: 18,
    isFeatured: true,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/067/655/795/original/891446_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/115/979/073/original/1719471_00.png.png"
    ]
  },
  {
    _id: "6af5d4eb2c792527aee3e2e2",
    name: "Nike Air Jordan 1 Mid",
    brand: "Nike",
    category: "Basketball",
    description: "Inspired by the original AJ1, this mid-top edition maintains the iconic look you love while choice colors and crisp leather give it a distinct identity.",
    price: 11495,
    discountPrice: 10495,
    sizes: [8, 9, 10, 11],
    colors: ["Chicago Black Toe", "Gym Red"],
    stock: 12,
    isFeatured: true,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/088/247/668/original/576959_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/083/706/670/original/651566_00.png.png"
    ]
  },
  {
    _id: "6af5d4ec2c792527aee3e2e3",
    name: "Nike Air Zoom Pegasus 40",
    brand: "Nike",
    category: "Running",
    description: "A springy ride for any run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals with balanced, energized cushioning.",
    price: 10295,
    discountPrice: 8995,
    sizes: [7, 8, 9, 10, 11],
    colors: ["White / Photon Dust", "Black / Anthracite"],
    stock: 20,
    isFeatured: false,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/088/548/480/original/DV3853_102.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/098/862/831/original/1185853_00.png.png"
    ]
  },
  {
    _id: "6af5d4ec2c792527aee3e2e4",
    name: "Nike Blazer Mid '77 Vintage",
    brand: "Nike",
    category: "Classics",
    description: "Styled for the '70s. Loved in the '80s. Classic in the '90s. Ready for the future. The Nike Blazer Mid '77 delivers a timeless design that's easy to wear.",
    price: 7995,
    discountPrice: null,
    sizes: [7, 8, 9, 10],
    colors: ["White / Black", "Black / Sail"],
    stock: 22,
    isFeatured: false,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/099/439/658/original/502784_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/100/575/760/original/693864_00.png.png"
    ]
  },

  // ==================== 6 ADIDAS PRODUCTS ====================
  {
    _id: "6af5d4ed2c792527aee3e2e6",
    name: "Adidas Samba OG",
    brand: "Adidas",
    category: "Classics",
    description: "Born on the pitch, the Samba is a timeless icon of street style. This version stays true to its legacy with a tasteful, low-profile, soft leather upper and suede overlays.",
    price: 10999,
    discountPrice: null,
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ["Cloud White / Core Black", "Core Black / Cloud White"],
    stock: 28,
    isFeatured: true,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/070/577/101/original/437050_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/118/284/685/original/1623462_00.png.png"
    ]
  },
  {
    _id: "6af5d4ee2c792527aee3e2e8",
    name: "Adidas Gazelle",
    brand: "Adidas",
    category: "Lifestyle",
    description: "A low-profile classic that started as an indoor soccer shoe. Made with a rich suede upper, the Gazelle continues to transcend trends.",
    price: 8999,
    discountPrice: 7499,
    sizes: [6, 7, 8, 9, 10],
    colors: ["Core White", "Solar Gold / Core Black"],
    stock: 22,
    isFeatured: false,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/100/004/856/original/1412648_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/119/183/671/original/1774544_00.png.png"
    ]
  },
  {
    _id: "6af5d4ed2c792527aee3e2e7",
    name: "Adidas Stan Smith",
    brand: "Adidas",
    category: "Classics",
    description: "Clean and effortless, the Stan Smith has maintained its place as a style staple for over 50 years with perforated 3-Stripes and sleek proportions.",
    price: 7999,
    discountPrice: 6499,
    sizes: [7, 8, 9, 10, 11],
    colors: ["White / Fairway Green", "Triple Black"],
    stock: 30,
    isFeatured: false,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/025/196/369/original/BZ0520.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/113/686/253/original/1692356_00.png.png"
    ]
  },
  {
    _id: "6af5d4ed2c792527aee3e2e5",
    name: "Adidas Ultraboost Light",
    brand: "Adidas",
    category: "Running",
    description: "Experience epic energy with the lightest Ultraboost ever made. Hundreds of Boost capsules burst with energy every time your foot hits the tarmac.",
    price: 17999,
    discountPrice: 14999,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Triple White", "Triple Black"],
    stock: 15,
    isFeatured: true,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/084/160/471/original/1103609_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/088/481/650/original/1103754_00.png.png"
    ]
  },
  {
    _id: "6af5d4ef2c792527aee3e2e9",
    name: "Adidas Forum Low",
    brand: "Adidas",
    category: "Basketball",
    description: "More than just a shoe, it's a statement. The adidas Forum hit the scene in '84 and gained major love on both the hardwood and in the music world.",
    price: 9999,
    discountPrice: null,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Chalk White / Gum", "Cream White"],
    stock: 14,
    isFeatured: true,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/090/180/160/original/1179863_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/095/523/484/original/1316906_00.png.png"
    ]
  },
  {
    _id: "6af5d4ef2c792527aee3e2ea",
    name: "Adidas NMD_R1 V3",
    brand: "Adidas",
    category: "Lifestyle",
    description: "Tactical style meets comfort. These adidas NMD shoes combine running heritage with cutting-edge Boost cushioning and signature midsole plugs.",
    price: 12999,
    discountPrice: 9999,
    sizes: [8, 9, 10, 11],
    colors: ["Triple Black", "Black / Gum"],
    stock: 19,
    isFeatured: false,
    rawImages: [
      "https://image.goat.com/attachments/product_template_pictures/images/057/448/172/original/782152_00.png.png",
      "https://image.goat.com/attachments/product_template_pictures/images/065/465/513/original/782154_00.png.png"
    ]
  },

  // ==================== 6 PUMA PRODUCTS ====================
  {
    _id: "6af5d4f02c792527aee3e2ec",
    name: "Puma Suede Classic XXI",
    brand: "Puma",
    category: "Classics",
    description: "The Suede hit the scene in 1968 and has been changing the game ever since. Worn by icons of every generation, it stays classic forever.",
    price: 6999,
    discountPrice: 5499,
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ["Puma Black", "Puma White"],
    stock: 32,
    isFeatured: true,
    rawImages: [
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/374915/01/sv01/fnd/IND/fmt/png/Suede-Classic-XXI",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/374915/01/sv02/fnd/IND/fmt/png/Suede-Classic-XXI",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/374915/01/sv03/fnd/IND/fmt/png/Suede-Classic-XXI"
    ]
  },
  {
    _id: "6af5d4ef2c792527aee3e2eb",
    name: "Puma RS-X Efekt",
    brand: "Puma",
    category: "Lifestyle",
    description: "The RS-X is back. The future-retro silhouette of this sneaker returns with a progressive aesthetic and angular details, complete with nubuck and suede overlays.",
    price: 8999,
    discountPrice: 6999,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Puma White", "Feather Grey"],
    stock: 20,
    isFeatured: true,
    rawImages: [
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/390755/06/sv01/fnd/IND/fmt/png/RS-X-Efekt",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/390755/06/sv02/fnd/IND/fmt/png/RS-X-Efekt",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/390755/06/sv03/fnd/IND/fmt/png/RS-X-Efekt"
    ]
  },
  {
    _id: "6af5d4f12c792527aee3e2ed",
    name: "Puma Palermo Special",
    brand: "Puma",
    category: "Classics",
    description: "Straight from the archives, this terrace legend returns with its signature T-toe construction and classic gum rubber sole.",
    price: 7999,
    discountPrice: null,
    sizes: [7, 8, 9, 10],
    colors: ["Alpine Snow", "Green Gum"],
    stock: 16,
    isFeatured: false,
    rawImages: [
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/396463/01/sv01/fnd/IND/fmt/png/Palermo-Special",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/396463/01/sv02/fnd/IND/fmt/png/Palermo-Special",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/396463/01/sv03/fnd/IND/fmt/png/Palermo-Special"
    ]
  },
  {
    _id: "6af5d4f12c792527aee3e2ee",
    name: "Puma Deviate Nitro 2",
    brand: "Puma",
    category: "Running",
    description: "Make every mile count. Maximum cushioning and peak performance with Nitro Elite foam and a redesigned PWRPLATE for effortless propulsion.",
    price: 13999,
    discountPrice: 11999,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Fireglow", "Puma Black"],
    stock: 11,
    isFeatured: true,
    rawImages: [
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/376807/01/sv01/fnd/IND/fmt/png/Deviate-Nitro-2",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/376807/01/sv02/fnd/IND/fmt/png/Deviate-Nitro-2",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/376807/01/sv03/fnd/IND/fmt/png/Deviate-Nitro-2"
    ]
  },
  {
    _id: "6af5d4f12c792527aee3e2ef",
    name: "Puma Slipstream Bball",
    brand: "Puma",
    category: "Basketball",
    description: "Back in 1987, the Puma Slipstream entered the scene as a high-flying, slam-dunking court shoe. Now it returns reimagined for modern streetwear.",
    price: 8499,
    discountPrice: 6799,
    sizes: [8, 9, 10, 11],
    colors: ["Puma White", "Intense Red"],
    stock: 15,
    isFeatured: false,
    rawImages: [
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/387544/01/sv01/fnd/IND/fmt/png/Slipstream",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/387544/01/sv02/fnd/IND/fmt/png/Slipstream",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/387544/01/sv03/fnd/IND/fmt/png/Slipstream"
    ]
  },
  {
    _id: "6af5d4f22c792527aee3e2f0",
    name: "Puma Clyde OG",
    brand: "Puma",
    category: "Classics",
    description: "Named after basketball legend Walt 'Clyde' Frazier, the Clyde embodies fashion, culture, and heritage with clean full-suede execution.",
    price: 7499,
    discountPrice: null,
    sizes: [7, 8, 9, 10],
    colors: ["Puma Navy", "Puma White"],
    stock: 24,
    isFeatured: false,
    rawImages: [
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/391137/01/sv01/fnd/IND/fmt/png/Clyde-OG",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/391137/01/sv02/fnd/IND/fmt/png/Clyde-OG",
      "https://images.puma.com/image/upload/f_auto,q_auto,w_1200,h_1200/global/391137/01/sv03/fnd/IND/fmt/png/Clyde-OG"
    ]
  }
];

// Helper: Download buffer via HTTPS
function downloadImageBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

// Helper: Standardize image into 1:1 square canvas with #E8E9E6 background and centered sneaker
async function standardizeImage(inputBuffer, targetSize = 1200, visualRatio = 0.78) {
  const trimmed = await sharp(inputBuffer)
    .trim({ threshold: 10 })
    .toBuffer({ resolveWithObject: true });

  const shoeWidth = trimmed.info.width;
  const shoeHeight = trimmed.info.height;

  const maxShoeDim = targetSize * visualRatio;
  const scale = Math.min(maxShoeDim / shoeWidth, maxShoeDim / shoeHeight);
  const scaledWidth = Math.max(1, Math.round(shoeWidth * scale));
  const scaledHeight = Math.max(1, Math.round(shoeHeight * scale));

  const resizedShoe = await sharp(trimmed.data)
    .resize(scaledWidth, scaledHeight, { fit: "inside" })
    .toBuffer();

  const left = Math.round((targetSize - scaledWidth) / 2);
  const top = Math.round((targetSize - scaledHeight) / 2);

  // Background #E8E9E6: RGB (232, 233, 230)
  const standardizedBuffer = await sharp({
    create: {
      width: targetSize,
      height: targetSize,
      channels: 3,
      background: { r: 232, g: 233, b: 230 }
    }
  })
    .composite([{ input: resizedShoe, left, top }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return standardizedBuffer;
}

// Helper: Upload buffer to Cloudinary
function uploadToCloudinary(buffer, folder, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image"
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// Main execution routine
async function main() {
  console.log("=== NOVA Product Refresh Pipeline Started ===");

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not configured in .env");
  }

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connection established.");

  // Delete unwanted non-sneaker product if present ("Man City")
  const extraDelete = await Product.deleteOne({ _id: new mongoose.Types.ObjectId("6afb1528d11bebb1d3da4bc0") });
  if (extraDelete.deletedCount > 0) {
    console.log("Removed non-sneaker product record (Man City).");
  }

  const refreshedProducts = [];

  for (let i = 0; i < PRODUCTS_DATA.length; i++) {
    const p = PRODUCTS_DATA[i];
    console.log(`\n[${i + 1}/${PRODUCTS_DATA.length}] Processing: "${p.name}" (${p.brand})...`);

    const uploadedUrls = [];
    const folder = `nova/products/${p.brand.toLowerCase()}`;
    const slugBase = p.name.toLowerCase().replace(/[^a-z0-9]/g, "_");

    for (let imgIdx = 0; imgIdx < p.rawImages.length; imgIdx++) {
      const rawUrl = p.rawImages[imgIdx];
      const publicId = `${slugBase}_view_${imgIdx + 1}`;
      console.log(`  - Fetching image view ${imgIdx + 1}...`);

      try {
        const rawBuf = await downloadImageBuffer(rawUrl);
        const standardizedBuf = await standardizeImage(rawBuf, 1200, 0.78);
        console.log(`    Standardized 1200x1200 with #E8E9E6 background. Uploading to Cloudinary (${folder}/${publicId})...`);
        const cdnUrl = await uploadToCloudinary(standardizedBuf, folder, publicId);
        console.log(`    Cloudinary URL: ${cdnUrl}`);
        uploadedUrls.push(cdnUrl);
      } catch (err) {
        console.error(`    Error processing view ${imgIdx + 1}: ${err.message}`);
      }
    }

    if (uploadedUrls.length === 0) {
      console.error(`  CRITICAL: No images could be uploaded for ${p.name}!`);
      continue;
    }

    // Update existing document in MongoDB preserving _id
    const updated = await Product.findByIdAndUpdate(
      p._id,
      {
        name: p.name,
        brand: p.brand,
        category: p.category,
        description: p.description,
        price: p.price,
        discountPrice: p.discountPrice,
        sizes: p.sizes,
        colors: p.colors,
        stock: p.stock,
        isFeatured: p.isFeatured,
        images: uploadedUrls
      },
      { new: true, upsert: true }
    );

    console.log(`  Updated MongoDB record (${updated._id}): ${uploadedUrls.length} image(s) saved.`);
    refreshedProducts.push(updated);
  }

  // Verification queries
  console.log("\n================ REFRESH VERIFICATION ================");
  const totalInDb = await Product.countDocuments();
  const nikeCount = await Product.countDocuments({ brand: "Nike" });
  const adidasCount = await Product.countDocuments({ brand: "Adidas" });
  const pumaCount = await Product.countDocuments({ brand: "Puma" });

  console.log(`Total Products in Database: ${totalInDb} (Expected: 18)`);
  console.log(`Nike Products:   ${nikeCount} (Expected: 6)`);
  console.log(`Adidas Products: ${adidasCount} (Expected: 6)`);
  console.log(`Puma Products:   ${pumaCount} (Expected: 6)`);

  const sampleProducts = await Product.find().select("name brand images price isFeatured");
  sampleProducts.forEach((sp) => {
    const isCloudinary = sp.images.every((img) => img.includes("res.cloudinary.com"));
    console.log(`- [${sp.brand}] ${sp.name} | Images: ${sp.images.length} | Cloudinary Verified: ${isCloudinary}`);
  });

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB. Refresh completed successfully.");
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
