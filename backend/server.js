const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Paths
const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, 'data');
const UPLOADS_DIR = path.join(BASE_DIR, 'uploads');
const REACT_ASSETS_DIR = path.resolve(path.join(BASE_DIR, '../src/assets'));

// Create directories if they don't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomUUID().replace(/-/g, '') + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Helper to load JSON
function loadJson(filename, defaultVal) {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(defaultVal, null, 2), 'utf-8');
    return defaultVal;
  }
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return defaultVal;
  }
}

// Helper to save JSON
function saveJson(filename, data) {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// Seed Initial Products
const baseDefaultProducts = [
  // Sofa Category
  { "id": "sofa-1", "name": "L-Shape Sofa", "price": "₹25,000", "img": "https://selvaharish-interior-back.onrender.com/assets/s1.jpg", "category": "sofa", "rating": 4.8, "description": "Luxury L-Shape sectional sofa offering ultimate comfort and sleek styling. Perfect for large families and hosting guests.", "specifications": { "Material": "Premium Fabric, Solid Teak Wood", "Dimensions": "96\" W x 60\" D x 34\" H", "Color": "Slate Grey", "Warranty": "3 Years", "Assembly Required": "Yes (Free installation)" } },
  { "id": "sofa-2", "name": "Leather Sofa", "price": "₹35,000", "img": "https://selvaharish-interior-back.onrender.com/assets/s2.webp", "category": "sofa", "rating": 4.9, "description": "Premium genuine leather upholstery with a classic tufted design. Gives a royal and polished feel to any living room setup.", "specifications": { "Material": "Genuine Italian Leather, Mahogany wood", "Dimensions": "84\" W x 36\" D x 32\" H", "Color": "Chestnut Brown", "Warranty": "5 Years", "Assembly Required": "No" } },
  { "id": "sofa-3", "name": "Fabric Sofa", "price": "₹18,000", "img": "https://selvaharish-interior-back.onrender.com/assets/s3.jpg", "category": "sofa", "rating": 4.5, "description": "Minimalist fabric sofa featuring high density foam cushions and durable linen covers. Perfect for compact and modern apartments.", "specifications": { "Material": "Cotton Linen, Engineered Wood", "Dimensions": "74\" W x 32\" D x 30\" H", "Color": "Beige", "Warranty": "2 Years", "Assembly Required": "Yes" } },
  { "id": "sofa-4", "name": "Wooden Sofa", "price": "₹22,000", "img": "https://selvaharish-interior-back.onrender.com/assets/s4.webp", "category": "sofa", "rating": 4.7, "description": "Traditional solid sheesham wood sofa set with thick plush cushions. High structural strength and longevity.", "specifications": { "Material": "Solid Sheesham Wood", "Dimensions": "78\" W x 34\" D x 33\" H", "Color": "Honey Finish", "Warranty": "3 Years", "Assembly Required": "No" } },
  { "id": "sofa-5", "name": "Modern Sofa", "price": "₹28,000", "img": "https://selvaharish-interior-back.onrender.com/assets/s5.webp", "category": "sofa", "rating": 4.6, "description": "Sleek contemporary design with thin chrome legs and adjustable headrests. Adds a touch of high-tech luxury.", "specifications": { "Material": "Synthetic Velvet, Steel frame", "Dimensions": "88\" W x 35\" D x 36\" H", "Color": "Navy Blue", "Warranty": "3 Years", "Assembly Required": "Yes" } },

  // Table Category
  { "id": "table-1", "name": "Dining Table", "price": "₹15,000", "img": "https://selvaharish-interior-back.onrender.com/assets/t1.jpg", "category": "table", "rating": 4.6, "description": "Solid wood dining table built to host memories. Accommodates 4-6 chairs comfortably for pleasant meal times.", "specifications": { "Material": "Teak Wood", "Dimensions": "60\" W x 36\" D x 30\" H", "Color": "Walnut", "Warranty": "2 Years", "Assembly Required": "Yes" } },
  { "id": "table-2", "name": "Coffee Table", "price": "₹5,500", "img": "https://selvaharish-interior-back.onrender.com/assets/t2.jpg", "category": "table", "rating": 4.4, "description": "Chic central table for living rooms with nested shelving below for storing magazines and remote controls.", "specifications": { "Material": "MDF & Metal Frame", "Dimensions": "36\" W x 36\" D x 18\" H", "Color": "Oak Wood & Black", "Warranty": "1 Year", "Assembly Required": "Yes" } },
  { "id": "table-3", "name": "Study Table", "price": "₹7,200", "img": "https://selvaharish-interior-back.onrender.com/assets/t3.avif", "category": "table", "rating": 4.7, "description": "Ergonomic work-from-home desk with integrated cable trays and dual drawers to help you stay productive.", "specifications": { "Material": "Engineered Wood, Steel", "Dimensions": "48\" W x 24\" D x 30\" H", "Color": "Light Pine", "Warranty": "2 Years", "Assembly Required": "Yes" } },
  { "id": "table-4", "name": "Side Table", "price": "₹3,000", "img": "https://selvaharish-interior-back.onrender.com/assets/t4.jpeg", "category": "table", "rating": 4.3, "description": "Compact bedside table to hold your reading lamps, smartphones, and decorative vases elegantly.", "specifications": { "Material": "Mango Wood", "Dimensions": "16\" W x 16\" D x 22\" H", "Color": "Natural Wood", "Warranty": "1 Year", "Assembly Required": "No" } },
  { "id": "table-5", "name": "Office Table", "price": "₹12,000", "img": "https://selvaharish-interior-back.onrender.com/assets/t5.webp", "category": "table", "rating": 4.8, "description": "Executive style office desk with lockable cabinet compartments, heavy keyboard slider, and wire grommets.", "specifications": { "Material": "Solid Rosewood", "Dimensions": "56\" W x 28\" D x 30\" H", "Color": "Dark Mahogany", "Warranty": "3 Years", "Assembly Required": "Yes" } },

  // Curtain Category
  { "id": "curtain-1", "name": "Cotton Curtain", "price": "₹1,200", "img": "https://selvaharish-interior-back.onrender.com/assets/c1.jpg", "category": "curtain", "rating": 4.5, "description": "Breathable 100% natural cotton curtains. Diffuses daylight beautifully while maintaining your privacy.", "specifications": { "Material": "100% Cotton", "Dimensions": "4' x 7' (Door Size)", "Color": "Off-White", "Warranty": "1 Year", "Assembly Required": "No (Ready to hang)" } },
  { "id": "curtain-2", "name": "Silk Curtain", "price": "₹2,500", "img": "https://selvaharish-interior-back.onrender.com/assets/c2.jpg", "category": "curtain", "rating": 4.7, "description": "Luxury silk drapes with soft lining. Adds a glossy, sophisticated texture and shimmers elegantly in ambient lighting.", "specifications": { "Material": "Pure Art Silk", "Dimensions": "4' x 7'", "Color": "Champagne Gold", "Warranty": "1 Year", "Assembly Required": "No" } },
  { "id": "curtain-3", "name": "Blackout Curtain", "price": "₹1,800", "img": "https://selvaharish-interior-back.onrender.com/assets/c3.webp", "category": "curtain", "rating": 4.8, "description": "Thick triple-woven thermal insulated blackout drapes blocking 99% of sunlight. Ideal for home theaters and bedrooms.", "specifications": { "Material": "Polyester-Microfiber Blend", "Dimensions": "4' x 8' (Long Door)", "Color": "Charcoal Black", "Warranty": "2 Years", "Assembly Required": "No" } },
  { "id": "curtain-4", "name": "Net Curtain", "price": "₹900", "img": "https://selvaharish-interior-back.onrender.com/assets/c4.jpg", "category": "curtain", "rating": 4.2, "description": "Sheer net curtains with delicate lace embroidery patterns. Allows fresh air flow and gives a dreamy backdrop.", "specifications": { "Material": "Nylon Lace", "Dimensions": "4' x 7'", "Color": "Pure White", "Warranty": "6 Months", "Assembly Required": "No" } },
  { "id": "curtain-5", "name": "Designer Curtain", "price": "₹3,200", "img": "https://selvaharish-interior-back.onrender.com/assets/c5.jpg", "category": "curtain", "rating": 4.6, "description": "Custom geometric printed heavy drapes matching premium modern room setups. Fade-resistant color technology.", "specifications": { "Material": "Jacquard Weave", "Dimensions": "4' x 9' (Window-to-Ceiling)", "Color": "Teal & Gold Print", "Warranty": "2 Years", "Assembly Required": "No" } },

  // Mattress Category
  { "id": "mattress-1", "name": "Orthopedic Mattress", "price": "₹12,000", "img": "https://selvaharish-interior-back.onrender.com/assets/m1.webp", "category": "mattress", "rating": 4.9, "description": "Doctor-recommended orthopedic memory foam mattress. Relieves joint pain and offers perfect spinal alignment support.", "specifications": { "Material": "Orthopedic High Resilience Foam", "Dimensions": "72\" L x 60\" W x 6\" T (Queen)", "Color": "White & Grey", "Warranty": "10 Years", "Assembly Required": "No" } },
  { "id": "mattress-2", "name": "Memory Foam", "price": "₹15,500", "img": "https://selvaharish-interior-back.onrender.com/assets/m2.webp", "category": "mattress", "rating": 4.8, "description": "Body-adaptive memory foam mattress absorbing pressure points. Includes luxury breathable outer zipper cover.", "specifications": { "Material": "Visco-elastic Memory Foam", "Dimensions": "78\" L x 72\" W x 8\" T (King)", "Color": "Blue Cover", "Warranty": "7 Years", "Assembly Required": "No" } },
  { "id": "mattress-3", "name": "Spring Mattress", "price": "₹9,000", "img": "https://selvaharish-interior-back.onrender.com/assets/m3.jpg", "category": "mattress", "rating": 4.4, "description": "Pocket spring mattress with quilted foam topping. Provides superior bounce, motion isolation, and cool airflow.", "specifications": { "Material": "Pocket Springs & Soft Foam", "Dimensions": "72\" L x 36\" W x 6\" T (Single)", "Color": "White", "Warranty": "5 Years", "Assembly Required": "No" } },
  { "id": "mattress-4", "name": "Coir Mattress", "price": "₹7,500", "img": "https://selvaharish-interior-back.onrender.com/assets/m4.webp", "category": "mattress", "rating": 4.2, "description": "Natural rubberized coconut coir mattress. Highly breathable, firm support, eco-friendly cooling properties.", "specifications": { "Material": "Coir & PU Foam Layer", "Dimensions": "72\" L x 48\" W x 5\" T (Double)", "Color": "Maroon", "Warranty": "3 Years", "Assembly Required": "No" } },
  { "id": "mattress-5", "name": "Luxury Pillow-Top", "price": "₹20,000", "img": "https://selvaharish-interior-back.onrender.com/assets/m5.webp", "category": "mattress", "rating": 4.9, "description": "Super premium hotel comfort double sided pillow-top mattress. Zero partner disturbance technology.", "specifications": { "Material": "Latex Foam & Luxury Gel Pocket Springs", "Dimensions": "78\" L x 72\" W x 10\" T", "Color": "White", "Warranty": "12 Years", "Assembly Required": "No" } },

  // Dining Category
  { "id": "dining-1", "name": "6-Seater Dining", "price": "₹45,000", "img": "https://selvaharish-interior-back.onrender.com/assets/a1.jpg", "category": "dining", "rating": 4.8, "description": "Massive solid teak wood 6-seater dining set with highly padded chairs. Perfect for grand dinners and family celebrations.", "specifications": { "Material": "Teak Wood & Fabric Cushioning", "Dimensions": "72\" W x 38\" D x 30\" H (Table)", "Color": "Dark Walnut", "Warranty": "5 Years", "Assembly Required": "Yes" } },
  { "id": "dining-2", "name": "Glass Top Dining", "price": "₹32,000", "img": "https://selvaharish-interior-back.onrender.com/assets/a2.jpg", "category": "dining", "rating": 4.5, "description": "Tempered glass-top dining table with sleek powder-coated metal legs. Set includes 4 comfortable leatherette chairs.", "specifications": { "Material": "Tempered Glass & Metal frame", "Dimensions": "54\" W x 36\" D x 30\" H (Table)", "Color": "Black", "Warranty": "2 Years", "Assembly Required": "Yes" } },
  { "id": "dining-3", "name": "Wooden Dining Set", "price": "₹28,000", "img": "https://selvaharish-interior-back.onrender.com/assets/a3.webp", "category": "dining", "rating": 4.7, "description": "Cozy 4-seater dining set made of premium sheesham wood. Classic design suitable for modern dining rooms.", "specifications": { "Material": "Sheesham Wood", "Dimensions": "46\" W x 32\" D x 30\" H (Table)", "Color": "Honey Oak", "Warranty": "3 Years", "Assembly Required": "Yes" } },
  { "id": "dining-4", "name": "Compact Dining", "price": "₹18,000", "img": "https://selvaharish-interior-back.onrender.com/assets/a4.jpg", "category": "dining", "rating": 4.3, "description": "Space saving drop-leaf dining set with 2 foldable stools. Excellent option for studio apartments and balconies.", "specifications": { "Material": "Rubberwood", "Dimensions": "30\" W to 45\" W x 30\" D x 30\" H", "Color": "Light Cherry", "Warranty": "1 Year", "Assembly Required": "Yes" } },
  { "id": "dining-5", "name": "Modern Dining", "price": "₹38,000", "img": "https://selvaharish-interior-back.onrender.com/assets/a5.webp", "category": "dining", "rating": 4.7, "description": "Scandinavian style dining table with 4 pastel colored chairs. Elegant design featuring light ashwood finishing.", "specifications": { "Material": "Ashwood table, Polymer chairs", "Dimensions": "60\" W x 34\" D x 30\" H", "Color": "Light Ash & Pastel Green", "Warranty": "3 Years", "Assembly Required": "Yes" } },

  // Lamp Category
  { "id": "lamp-1", "name": "Modern Lamp", "price": "₹1,200", "img": "https://selvaharish-interior-back.onrender.com/assets/l1.jpg", "category": "lamp", "rating": 4.4, "description": "Minimalist desk lamp with adjustable arm and warm led bulb. Fits smoothly into any computer desk setup.", "specifications": { "Material": "Steel, Powder Finish", "Dimensions": "6\" Base, 18\" Height", "Color": "Matt Black", "Warranty": "1 Year", "Assembly Required": "No" } },
  { "id": "lamp-2", "name": "Table Lamp", "price": "₹950", "img": "https://selvaharish-interior-back.onrender.com/assets/l2.avif", "category": "lamp", "rating": 4.3, "description": "Bedroom reading lamp with a woven fabric shade. Creates a soft, relaxed ambient glow in dark rooms.", "specifications": { "Material": "Ceramic Base, Canvas shade", "Dimensions": "8\" Diameter, 14\" Height", "Color": "Terracotta & Beige", "Warranty": "1 Year", "Assembly Required": "No" } },
  { "id": "lamp-3", "name": "Floor Lamp", "price": "₹2,500", "img": "https://selvaharish-interior-back.onrender.com/assets/l3.avif", "category": "lamp", "rating": 4.7, "description": "Tall arched floor lamp to position over reading armchairs or sofas. Heavy base prevents accidental tipping.", "specifications": { "Material": "Chrome Metal", "Dimensions": "12\" Base, 68\" Height", "Color": "Silver Polish", "Warranty": "2 Years", "Assembly Required": "Yes" } },
  { "id": "lamp-4", "name": "Wall Lamp", "price": "₹1,800", "img": "https://selvaharish-interior-back.onrender.com/assets/l4.avif", "category": "lamp", "rating": 4.5, "description": "Industrial rustic style wall-mounted swing-arm sconce lamp. Hardwire or plug-in flexibility.", "specifications": { "Material": "Brass & Matte Metal", "Dimensions": "12\" Reach", "Color": "Vintage Brass", "Warranty": "1 Year", "Assembly Required": "Yes" } },
  { "id": "lamp-5", "name": "Designer Lamp", "price": "₹3,200", "img": "https://selvaharish-interior-back.onrender.com/assets/l5.jpg", "category": "lamp", "rating": 4.8, "description": "Handcrafted mosaic stained-glass table lamp. Shows breathtaking patterns on adjacent walls when switched on.", "specifications": { "Material": "Turkish Stained Glass & Bronze base", "Dimensions": "10\" Diameter, 16\" Height", "Color": "Multicolor Mosaic", "Warranty": "2 Years", "Assembly Required": "No" } },

  // Pillow Category
  { "id": "pillow-1", "name": "Memory Foam Pillow", "price": "₹1,200", "img": "https://selvaharish-interior-back.onrender.com/assets/p1.jpg", "category": "pillow", "rating": 4.8, "description": "Contoured cervical support memory foam pillow. Adapts to neck curves and stops snoring and soreness.", "specifications": { "Material": "Responsive Memory Foam", "Dimensions": "24\" L x 16\" W x 4.5\" H", "Color": "White Cover", "Warranty": "2 Years", "Assembly Required": "No" } },
  { "id": "pillow-2", "name": "Orthopedic Pillow", "price": "₹1,500", "img": "https://selvaharish-interior-back.onrender.com/assets/p2.webp", "category": "pillow", "rating": 4.7, "description": "Cool-gel infused orthopedic pillow. Diffuses heat and provides optimal cooling during deep sleep.", "specifications": { "Material": "Gel-injected Foam", "Dimensions": "24\" L x 16\" W x 5\" H", "Color": "Blue Cooling mesh", "Warranty": "3 Years", "Assembly Required": "No" } },
  { "id": "pillow-3", "name": "Soft Cotton Pillow", "price": "₹800", "img": "https://selvaharish-interior-back.onrender.com/assets/p3.jpg", "category": "pillow", "rating": 4.3, "description": "Fluffy standard sleeping pillows packed with premium microfiber fillings. Soft and machine washable.", "specifications": { "Material": "Microfiber & Cotton Outer Shell", "Dimensions": "26\" L x 18\" W", "Color": "White", "Warranty": "1 Year", "Assembly Required": "No" } },
  { "id": "pillow-4", "name": "Decorative Pillow", "price": "₹600", "img": "https://selvaharish-interior-back.onrender.com/assets/p4.jpg", "category": "pillow", "rating": 4.1, "description": "Stylish hand-knit throw pillows for couches and lounges. Easily removable zip closures for cleaning.", "specifications": { "Material": "Macrame Cotton & Cushion Pad", "Dimensions": "16\" x 16\" (Square)", "Color": "Cream White", "Warranty": "6 Months", "Assembly Required": "No" } },
  { "id": "pillow-5", "name": "Neck Support Pillow", "price": "₹1,100", "img": "https://selvaharish-interior-back.onrender.com/assets/p5.jpg", "category": "pillow", "rating": 4.5, "description": "Travel neck pillow made of memory foam. Perfect companion for flights, roadtrips, and office rests.", "specifications": { "Material": "Micro-cushion Velvet & Memory Foam", "Dimensions": "12\" x 12\" x 4\"", "Color": "Grey Velvet", "Warranty": "1 Year", "Assembly Required": "No" } },

  // Modular Kitchen Category
  { "id": "kitchen-1", "name": "L-Shape Kitchen", "price": "₹1,50,000", "img": "https://selvaharish-interior-back.onrender.com/assets/k1.webp", "category": "modularkitchen", "rating": 4.9, "description": "Premium L-Shape modular kitchen setup with high gloss acrylic shutters, soft close drawers, and corner pullouts.", "specifications": { "Material": "Boiling Water Resistant Plywood, Acrylic Laminates", "Dimensions": "10' x 8' Layout", "Color": "White & Royal Blue", "Warranty": "10 Years", "Assembly Required": "Yes (Included)" } },
  { "id": "kitchen-2", "name": "U-Shape Kitchen", "price": "₹2,10,000", "img": "https://selvaharish-interior-back.onrender.com/assets/h2.jpg", "category": "modularkitchen", "rating": 4.9, "description": "Spacious U-Shape kitchen providing high work-triangle efficiency. Built-in microwave and oven tall unit included.", "specifications": { "Material": "BWP Plywood, Scratch-proof Laminate", "Dimensions": "12' x 10' x 8' Layout", "Color": "Burgundy Glossy", "Warranty": "10 Years", "Assembly Required": "Yes (Included)" } },
  { "id": "kitchen-3", "name": "Straight Kitchen", "price": "₹95,000", "img": "https://selvaharish-interior-back.onrender.com/assets/k3.avif", "category": "modularkitchen", "rating": 4.6, "description": "Ergonomic straight kitchen design ideal for compact homes. Fits chimney, sink, and cooktop lines seamlessly.", "specifications": { "Material": "Commercial Grade Plywood, PVC Edges", "Dimensions": "10' Length", "Color": "Charcoal Grey & Yellow Accent", "Warranty": "5 Years", "Assembly Required": "Yes" } },
  { "id": "kitchen-4", "name": "Island Kitchen", "price": "₹2,80,000", "img": "https://selvaharish-interior-back.onrender.com/assets/k4.jpg", "category": "modularkitchen", "rating": 5.0, "description": "Grand modular kitchen layout with an independent central breakfast island counter and built-in chimney hob.", "specifications": { "Material": "Premium Marine Ply, Quartz Countertop", "Dimensions": "12' x 12' + 4'x3' Island", "Color": "Emerald Green & White Marble", "Warranty": "12 Years", "Assembly Required": "Yes" } },
  { "id": "kitchen-5", "name": "Parallel Kitchen", "price": "₹1,30,000", "img": "https://selvaharish-interior-back.onrender.com/assets/k5.webp", "category": "modularkitchen", "rating": 4.7, "description": "Dual platform parallel modular kitchen. Segregates washing zone and cooking zone effectively to keep counters dry.", "specifications": { "Material": "Waterproof MDF, Matte Anti-fingerprint laminates", "Dimensions": "9' length both sides", "Color": "Warm Oak & Beige", "Warranty": "7 Years", "Assembly Required": "Yes" } },

  // Coffee Table Category
  { "id": "coffeetable-1", "name": "Modern Coffee Table - Model 1", "price": "₹5,200", "img": "https://selvaharish-interior-back.onrender.com/assets/cc1.jpg", "category": "coffeetable", "rating": 4.4, "description": "Contemporary glass-topped coffee table with solid wooden supports.", "specifications": { "Material": "Glass & Wood", "Dimensions": "36\" x 20\" x 18\"", "Color": "Oak", "Warranty": "1 Year", "Assembly Required": "Yes" } },
  { "id": "coffeetable-2", "name": "Nordic Coffee Table - Model 2", "price": "₹6,100", "img": "https://selvaharish-interior-back.onrender.com/assets/cc2.jpg", "category": "coffeetable", "rating": 4.5, "description": "Minimalist Scandinavian coffee table with splayed legs.", "specifications": { "Material": "Ash Wood", "Dimensions": "38\" x 24\" x 18\"", "Color": "Natural Oak", "Warranty": "1 Year", "Assembly Required": "Yes" } },
  { "id": "coffeetable-3", "name": "Rustic Coffee Table - Model 3", "price": "₹4,800", "img": "https://selvaharish-interior-back.onrender.com/assets/cc3.jpg", "category": "coffeetable", "rating": 4.3, "description": "Charming reclaimed style coffee table with metal rivets.", "specifications": { "Material": "Pine Wood & Iron", "Dimensions": "34\" x 24\" x 16\"", "Color": "Rustic Brown", "Warranty": "1 Year", "Assembly Required": "No" } },
  { "id": "coffeetable-4", "name": "Industrial Coffee Table - Model 4", "price": "₹5,500", "img": "https://selvaharish-interior-back.onrender.com/assets/cc4.jpg", "category": "coffeetable", "rating": 4.6, "description": "Heavy duty steel frame coffee table with open mesh wire shelf storage.", "specifications": { "Material": "Alloy Steel & Engineered Wood", "Dimensions": "40\" x 20\" x 18\"", "Color": "Carbon Black", "Warranty": "2 Years", "Assembly Required": "Yes" } },
  { "id": "coffeetable-5", "name": "Marble Coffee Table - Model 5", "price": "₹10,500", "img": "https://selvaharish-interior-back.onrender.com/assets/cc5.jpg", "category": "coffeetable", "rating": 4.8, "description": "Premium white Italian marble top coffee table with gold round base.", "specifications": { "Material": "Carrara Marble & Stainless Steel", "Dimensions": "32\" Diameter, 18\" Height", "Color": "Gold & White", "Warranty": "3 Years", "Assembly Required": "No" } },
  { "id": "coffeetable-6", "name": "Japanese Coffee Table - Model 6", "price": "₹4,000", "img": "https://selvaharish-interior-back.onrender.com/assets/cc6.jpg", "category": "coffeetable", "rating": 4.4, "description": "Low height floor-sitting coffee table with beautiful folding frames.", "specifications": { "Material": "Bamboo", "Dimensions": "30\" x 20\" x 12\"", "Color": "Amber", "Warranty": "1 Year", "Assembly Required": "No" } },
  { "id": "coffeetable-7", "name": "Retro Coffee Table - Model 7", "price": "₹7,200", "img": "https://selvaharish-interior-back.onrender.com/assets/cc7.webp", "category": "coffeetable", "rating": 4.5, "description": "Mid-century vintage wooden coffee table with center drawer panel.", "specifications": { "Material": "Solid Walnut Wood", "Dimensions": "38\" x 22\" x 18\"", "Color": "Walnut", "Warranty": "2 Years", "Assembly Required": "Yes" } },
  { "id": "coffeetable-8", "name": "Oval Coffee Table - Model 8", "price": "₹6,800", "img": "https://selvaharish-interior-back.onrender.com/assets/cc8.webp", "category": "coffeetable", "rating": 4.6, "description": "Soft oval coffee table with twin tier storage matching cozy rugs.", "specifications": { "Material": "MDF & Beech Wood", "Dimensions": "42\" x 22\" x 18\"", "Color": "Espresso", "Warranty": "1 Year", "Assembly Required": "Yes" } },
  { "id": "coffeetable-9", "name": "Geometric Coffee Table - Model 9", "price": "₹8,400", "img": "https://selvaharish-interior-back.onrender.com/assets/cc9.webp", "category": "coffeetable", "rating": 4.7, "description": "Abstract diamond geometric shape wireframe glass coffee table.", "specifications": { "Material": "Tempered Glass & Iron Wire", "Dimensions": "34\" Diameter, 16\" Height", "Color": "Rose Gold Base", "Warranty": "2 Years", "Assembly Required": "No" } },
  { "id": "coffeetable-10", "name": "Luxury Coffee Table - Model 10", "price": "₹12,000", "img": "https://selvaharish-interior-back.onrender.com/assets/cc10.jpg", "category": "coffeetable", "rating": 4.9, "description": "Ultra luxury nested circular coffee table pair in sliding layout.", "specifications": { "Material": "Slate & Brass", "Dimensions": "32\" Dia + 24\" Dia nested", "Color": "Gold", "Warranty": "3 Years", "Assembly Required": "No" } },

  // Additional 10 Homepage Specific Categories Seed Data (separately searchable)
  { "id": "home-bed-1", "name": "Royal King Bed", "price": "₹45,000", "img": "https://selvaharish-interior-back.onrender.com/assets/d2.jpg", "category": "bed", "rating": 4.8, "description": "Exquisite solid teak king size bed frame. Timeless layout matching royal decor.", "specifications": { "Material": "Teak Wood", "Dimensions": "78\" W x 82\" L x 40\" H", "Color": "Teak Polish", "Warranty": "5 Years", "Assembly Required": "Yes" } },
  { "id": "home-tvunit-1", "name": "Console TV Unit", "price": "₹14,500", "img": "https://selvaharish-interior-back.onrender.com/assets/d4.jpg", "category": "tvunit", "rating": 4.5, "description": "Wall-mounted premium entertainment TV console with glass shutters.", "specifications": { "Material": "Engineered MDF", "Dimensions": "60\" W x 15\" D x 12\" H", "Color": "Slate Grey", "Warranty": "1 Year", "Assembly Required": "Yes" } },
  { "id": "home-wardrobe-1", "name": "3-Door Wardrobe", "price": "₹26,000", "img": "https://selvaharish-interior-back.onrender.com/assets/d7.jpg", "category": "wardrobe", "rating": 4.6, "description": "Spacious wardrobe cabinet with drawer locks and dressing mirror.", "specifications": { "Material": "Engineered Particle Wood", "Dimensions": "48\" W x 22\" D x 78\" H", "Color": "Oak", "Warranty": "2 Years", "Assembly Required": "Yes" } },
  { "id": "home-sofacumbed-1", "name": "Comfort Sofa Cum Bed", "price": "₹29,000", "img": "https://selvaharish-interior-back.onrender.com/assets/d8.jpg", "category": "sofacumbed", "rating": 4.7, "description": "Easy-pull metal frames sofa cum bed with orthopedic high density mattress.", "specifications": { "Material": "Carbon Steel & Fabric", "Dimensions": "72\" W x 76\" L (Open)", "Color": "Charcoal Grey", "Warranty": "3 Years", "Assembly Required": "Yes" } },
  { "id": "home-bookshelf-1", "name": "Library Bookshelf", "price": "₹9,800", "img": "https://selvaharish-interior-back.onrender.com/assets/d9.jpg", "category": "bookshelf", "rating": 4.4, "description": "Five tier library showcase shelf to display your books and awards.", "specifications": { "Material": "Engineered Wood", "Dimensions": "32\" W x 12\" D x 70\" H", "Color": "Wenge", "Warranty": "1 Year", "Assembly Required": "Yes" } },
  { "id": "home-study-1", "name": "Ergo Study Table", "price": "₹8,500", "img": "https://selvaharish-interior-back.onrender.com/assets/d1.jpg", "category": "study", "rating": 4.6, "description": "Spacious desk for students with top storage rack and footrest.", "specifications": { "Material": "MDF & Metal Leg Frame", "Dimensions": "42\" W x 22\" D x 48\" H", "Color": "Light Oak", "Warranty": "2 Years", "Assembly Required": "Yes" } },

  // Bedroom Cupboard
  { "id": "bedroomcupboard-1", "name": "Sliding Wardrobe Cupboard", "price": "₹28,500", "img": "https://selvaharish-interior-back.onrender.com/assets/cb1.jpg", "category": "bedroomcupboard", "rating": 4.7, "description": "Elegant sliding 2-door wardrobe with full-length dresser mirror, hangers, drawers and ample shelving.", "specifications": { "Material": "Engineered Wood, Steel Rails", "Dimensions": "78\" H x 48\" W x 22\" D", "Color": "Oak & White", "Warranty": "3 Years", "Assembly Required": "Yes" } },
  { "id": "bedroomcupboard-2", "name": "Classic Fitted Bedroom Cupboard", "price": "₹34,000", "img": "https://selvaharish-interior-back.onrender.com/assets/cbb1.jpg", "category": "bedroomcupboard", "rating": 4.8, "description": "Floor-to-ceiling bedroom cupboard with soft close shutters, overhead loft cabinets, and safety locks.", "specifications": { "Material": "BWP Plywood, Laminate Finish", "Dimensions": "96\" H x 60\" W x 24\" D", "Color": "Teak & Cream", "Warranty": "5 Years", "Assembly Required": "Yes" } },

  // Pooja Cupboard
  { "id": "poojacupboard-1", "name": "Traditional Teak Mandir", "price": "₹12,500", "img": "https://selvaharish-interior-back.onrender.com/assets/pb1.webp", "category": "poojacupboard", "rating": 4.9, "description": "Intricately carved teak wood pooja cupboard with storage drawer and slide-out tray for diyas and incense.", "specifications": { "Material": "Solid Teak Wood", "Dimensions": "36\" H x 24\" W x 18\" D", "Color": "Honey Glossy Finish", "Warranty": "3 Years", "Assembly Required": "No" } },
  { "id": "poojacupboard-2", "name": "Wall Mount Pooja Cabinet", "price": "₹6,800", "img": "https://selvaharish-interior-back.onrender.com/assets/kk8.jpg", "category": "poojacupboard", "rating": 4.6, "description": "Compact and space-saving wall mount pooja cupboard with led spotlighting and beautiful brass bells.", "specifications": { "Material": "Mango Wood, Brass Bells", "Dimensions": "24\" H x 18\" W x 12\" D", "Color": "Mahogany", "Warranty": "1 Year", "Assembly Required": "Yes" } },

  // Showcase
  { "id": "showcase-1", "name": "Elegant Living Room Showcase", "price": "₹19,500", "img": "https://selvaharish-interior-back.onrender.com/assets/sb1.jpg", "category": "showcase", "rating": 4.7, "description": "Stylish display cabinet for living rooms with glass doors, built-in LED spotlights and adjustable shelves.", "specifications": { "Material": "Sheesham Wood, Tempered Glass", "Dimensions": "72\" H x 36\" W x 16\" D", "Color": "Walnut Finish", "Warranty": "2 Years", "Assembly Required": "Yes" } },
  { "id": "showcase-2", "name": "Corner Display Showcase", "price": "₹15,000", "img": "https://selvaharish-interior-back.onrender.com/assets/h3.png", "category": "showcase", "rating": 4.5, "description": "Sleek corner unit with multiple shelves. Great for showing off photos, travel souvenirs, and flower vases.", "specifications": { "Material": "Engineered Wood, Glass Panels", "Dimensions": "68\" H x 20\" W x 20\" D", "Color": "Espresso Black", "Warranty": "1 Year", "Assembly Required": "Yes" } },

  // Wooden Doors
  { "id": "woodendoors-1", "name": "Teak Wood Carved Door", "price": "₹26,000", "img": "https://selvaharish-interior-back.onrender.com/assets/d0.jpg", "category": "woodendoors", "rating": 4.9, "description": "Grand main entrance door crafted from seasoned teak wood. Elegant CNC carving designs to welcome your guests.", "specifications": { "Material": "Solid Teak Wood", "Dimensions": "81\" H x 38\" W x 1.5\" T", "Color": "Teak Natural", "Warranty": "5 Years", "Assembly Required": "Installation service available" } },
  { "id": "woodendoors-2", "name": "Modern Flush Door", "price": "₹9,800", "img": "https://selvaharish-interior-back.onrender.com/assets/d5.jpg", "category": "woodendoors", "rating": 4.4, "description": "High-durability waterproof flush door with clean laminates, ideal for bedrooms and bathrooms.", "specifications": { "Material": "Solid Core Blockboard, Laminate", "Dimensions": "80\" H x 32\" W x 1.25\" T", "Color": "Light Oak", "Warranty": "2 Years", "Assembly Required": "No" } },

  // Furniture
  { "id": "furniture-1", "name": "Modern Lounge Accent Chair", "price": "₹7,200", "img": "https://selvaharish-interior-back.onrender.com/assets/d1.jpg", "category": "furniture", "rating": 4.6, "description": "Ergonomically designed high-back accent chair with solid wood legs and premium foam cushion.", "specifications": { "Material": "Velvet Fabric, Beech Wood Legs", "Dimensions": "36\" H x 28\" W x 30\" D", "Color": "Teal Blue", "Warranty": "1 Year", "Assembly Required": "No" } },
  { "id": "furniture-2", "name": "Wooden Chest of Drawers", "price": "₹16,500", "img": "https://selvaharish-interior-back.onrender.com/assets/d6.jpg", "category": "furniture", "rating": 4.7, "description": "Spacious drawer cabinet for bedrooms or living rooms. Vintage design with metallic handles.", "specifications": { "Material": "Mango Wood, MDF Backing", "Dimensions": "34\" H x 40\" W x 18\" D", "Color": "Natural Mango Wood", "Warranty": "2 Years", "Assembly Required": "No" } },

  // Wooden Work
  { "id": "woodenwork-1", "name": "Custom Wooden Wall Paneling", "price": "₹25,000", "img": "https://selvaharish-interior-back.onrender.com/assets/ab.webp", "category": "woodenwork", "rating": 4.8, "description": "Premium CNC routed wall paneling designs. Adds thermal insulation and luxury vibes to TV backgrounds.", "specifications": { "Material": "HDMR Board, Charcoal sheets", "Dimensions": "8' x 4' Panel size (Customizable)", "Color": "Charcoal and Gold Line", "Warranty": "5 Years", "Assembly Required": "Yes (Onsite installation)" } },
  { "id": "woodenwork-2", "name": "Decorative Room Partition", "price": "₹14,500", "img": "https://selvaharish-interior-back.onrender.com/assets/q1.png", "category": "woodenwork", "rating": 4.7, "description": "Intricate MDF jaali room divider with high structural strength. Ideal for hall-dining segregation.", "specifications": { "Material": "High Density Fiberboard", "Dimensions": "72\" H x 48\" W x 1\" T", "Color": "Antique White", "Warranty": "2 Years", "Assembly Required": "Yes" } }
];

const defaultProducts = [...baseDefaultProducts];
const exploreCategories = ['sofa', 'bed', 'dining', 'tvunit', 'coffeetable', 'mattress', 'wardrobe', 'sofacumbed', 'bookshelf', 'study'];

baseDefaultProducts.forEach(p => {
  if (exploreCategories.includes(p.category)) {
    defaultProducts.push({
      ...p,
      id: `explore-${p.id}`,
      category: `explore-${p.category}`
    });
  }
});

const defaultReviews = [
  { "id": "rev-1", "name": "Sivakumar K", "rating": 5, "comment": "The L-Shape Sofa is incredibly comfortable and the wood quality is premium. Best purchase for my new home!", "date": "2026-06-15" },
  { "id": "rev-2", "name": "Deepika R", "rating": 5, "comment": "Highly satisfied with the modular kitchen installation. Very professional team and timely delivery.", "date": "2026-07-02" },
  { "id": "rev-3", "name": "Arun Kumar", "rating": 4, "comment": "The study table fits perfectly in my room. Assembly was quick and easy. Highly recommended.", "date": "2026-07-10" },
  { "id": "rev-4", "name": "Priya Lakshmi", "rating": 5, "comment": "Memory foam pillow has completely cured my neck pain. Will buy more for my family.", "date": "2026-07-12" }
];

// Serve React static assets
app.use('/assets', express.static(REACT_ASSETS_DIR));

// Serve uploaded files
app.use('/uploads', express.static(UPLOADS_DIR));

// API - Products
app.get('/api/products', (req, res) => {
  const products = loadJson('products.json', defaultProducts);
  res.json(products);
});

app.post('/api/products', upload.single('image'), (req, res) => {
  const products = loadJson('products.json', defaultProducts);

  const { name, price, category, description, material, dimensions, color, warranty, assemblyRequired } = req.body;

  // Specifications
  const specs = {
    "Material": material || 'Premium Finish',
    "Dimensions": dimensions || 'Standard Size',
    "Color": color || 'As shown',
    "Warranty": warranty || '1 Year brand warranty',
    "Assembly Required": assemblyRequired || 'No'
  };

  // Handle image upload
  let imgUrl = "";
  if (req.file) {
    imgUrl = `https://selvaharish-interior-back.onrender.com/uploads/${req.file.filename}`;
  } else {
    imgUrl = req.body.imageUrl || 'https://via.placeholder.com/300?text=No+Image';
  }

  const newProd = {
    "id": `custom-${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`,
    "name": name,
    "price": price,
    "img": imgUrl,
    "category": category,
    "rating": 4.5,
    "description": description || '',
    "specifications": specs
  };

  products.push(newProd);
  saveJson('products.json', products);
  res.status(201).json(newProd);
});

app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  let products = loadJson('products.json', defaultProducts);
  const initialLen = products.length;
  products = products.filter(p => p.id !== productId);

  if (products.length === initialLen) {
    return res.status(404).json({ error: "Product not found" });
  }

  saveJson('products.json', products);
  res.json({ success: true });
});

// API - Reviews
app.get('/api/reviews', (req, res) => {
  const reviews = loadJson('reviews.json', defaultReviews);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const reviews = loadJson('reviews.json', defaultReviews);
  const { name, comment, rating } = req.body;

  if (!name || !comment) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const newReview = {
    "id": `rev-${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`,
    "name": name,
    "rating": parseInt(rating || 5, 10),
    "comment": comment,
    "date": formattedDate
  };

  reviews.push(newReview);
  saveJson('reviews.json', reviews);
  res.status(201).json(newReview);
});

app.delete('/api/reviews/:id', (req, res) => {
  const reviewId = req.params.id;
  let reviews = loadJson('reviews.json', defaultReviews);
  const initialLen = reviews.length;
  reviews = reviews.filter(r => r.id !== reviewId);

  if (reviews.length === initialLen) {
    return res.status(404).json({ error: "Review not found" });
  }

  saveJson('reviews.json', reviews);
  res.json({ success: true });
});

// Start server
app.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
});
