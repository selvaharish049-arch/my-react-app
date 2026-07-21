// Local product storage with immediate fallback and optional fast backend sync
import img1 from '../assets/c1.jpg';
import img2 from '../assets/c2.jpg';
import img4 from '../assets/c4.jpg';
import img5 from '../assets/c5.jpg';

import d1 from '../assets/d1.jpg';
import d2 from '../assets/d2.jpg';
import d3 from '../assets/d3.jpg';
import d4 from '../assets/d4.jpg';
import d5 from '../assets/d5.jpg';
import d6 from '../assets/d6.jpg';
import d7 from '../assets/d7.jpg';
import d9 from '../assets/d9.jpg';

import k1 from '../assets/k1.webp';
import k2 from '../assets/k2.avif';
import k3 from '../assets/k3.avif';

import p1 from '../assets/p1.jpg';

// Predefined base products for instant local display
const defaultProducts = [
  // Modular Kitchen
  { id: 'mk-1', name: 'Luxe German Island Kitchen', category: 'modularkitchen', price: '₹1,45,000', original: '₹1,75,000', rating: 5, img: k1, description: 'Sleek acrylic finish with soft-close Blum drawers & quartz countertop.' },
  { id: 'mk-2', name: 'Contemporary Parallel Layout', category: 'modularkitchen', price: '₹98,000', original: '₹1,20,000', rating: 4.8, img: k2, description: 'Ergonomic dual workspace with scratch-resistant laminate.' },
  { id: 'mk-3', name: 'Nordic Wooden Grain Kitchen', category: 'modularkitchen', price: '₹1,25,000', original: '₹1,50,000', rating: 4.9, img: k3, description: 'Natural teak veneer panels with integrated LED strip accents.' },

  // Bedroom Cupboard & Wardrobes
  { id: 'bc-1', name: 'Royal Teak Bedroom Cupboard', category: 'bedroomcupboard', price: '₹42,000', original: '₹50,000', rating: 4.7, img: d2, description: 'Spacious 4-door wardrobe with full-length vanity mirror.' },
  { id: 'wd-1', name: 'Spacious Sliding Wardrobe', category: 'wardrobes', price: '₹55,000', original: '₹68,000', rating: 4.9, img: d7, description: 'Modern glass sliding doors with customized storage dividers.' },
  { id: 'wd-2', name: 'Designer Wardrobe', category: 'wardrobe', price: '₹48,000', original: '₹58,000', rating: 4.8, img: d7, description: 'Floor-to-ceiling wooden wardrobe with velvet interior lining.' },

  // TV Units & Showcase
  { id: 'tv-1', name: 'Floating Minimalist TV Console', category: 'tvunit', price: '₹22,500', original: '₹28,000', rating: 4.6, img: d4, description: 'Wall-mounted TV panel with ambient backlighting and wire concealment.' },
  { id: 'sc-1', name: 'Glass Display Showcase', category: 'showcase', price: '₹34,000', original: '₹40,000', rating: 4.7, img: d9, description: 'Toughened glass shelves with warm accent spotlights.' },
  { id: 'pj-1', name: 'Rosewood Pooja Cupboard', category: 'poojacupboard', price: '₹28,000', original: '₹35,000', rating: 5, img: d3, description: 'Traditional intricate carving with brass bells and drawers.' },

  // Doors & Furniture
  { id: 'dr-1', name: 'Solid Teak Entrance Door', category: 'woodendoors', price: '₹38,000', original: '₹45,000', rating: 4.9, img: p1, description: 'Heavy solid teakwood main door with smart biometric lock cutout.' },
  { id: 'fur-1', name: 'Nordic Oak Lounge Armchair', category: 'furniture', price: '₹18,500', original: '₹24,000', rating: 4.8, img: img1, description: 'Ergonomic curved wooden lounge chair with breathable linen upholstery.' },
  { id: 'ww-1', name: 'Custom Wooden Wall Paneling', category: 'woodenwork', price: '₹65,000', original: '₹80,000', rating: 4.9, img: img2, description: 'Bespoke acoustic wood fluted wall paneling and ceiling work.' },

  // Explore Homepage Categories
  { id: 'ex-sofa-1', name: 'Velvet Chesterfield Sofa', category: 'explore-sofa', price: '₹58,000', original: '₹72,000', rating: 4.9, img: img1, description: '3-seater tufted velvet couch with high-density foam cushions.' },
  { id: 'ex-sofa-2', name: 'Modern Minimalist Sofa', category: 'sofa', price: '₹46,000', original: '₹55,000', rating: 4.8, img: img1, description: 'Comfortable fabric sofa designed for cozy living rooms.' },

  { id: 'ex-bed-1', name: 'King Size Upholstered Bed', category: 'explore-bed', price: '₹49,000', original: '₹62,000', rating: 4.9, img: d2, description: 'King size hydraulic storage bed with padded headboard.' },
  { id: 'ex-bed-2', name: 'Royal Comfort Suite Bed', category: 'bed', price: '₹42,000', original: '₹52,000', rating: 4.8, img: d2, description: 'Solid wood queen bed with ergonomic headrest support.' },

  { id: 'ex-dining-1', name: 'Marble Top 6-Seater Dining Set', category: 'explore-dining', price: '₹64,000', original: '₹78,000', rating: 4.9, img: d3, description: 'Italian marble top dining table with cushioned wooden chairs.' },
  { id: 'ex-dining-2', name: 'Luxury Dining Suite', category: 'dining', price: '₹52,000', original: '₹65,000', rating: 4.7, img: d3, description: 'Contemporary solid wood dining table set for 6.' },

  { id: 'ex-tv-1', name: 'Urban Chic Lounge TV Console', category: 'explore-tvunit', price: '₹26,000', original: '₹32,000', rating: 4.8, img: d4, description: 'Sleek wooden TV cabinet with drawers and cable management.' },

  { id: 'ex-coffee-1', name: 'Solid Walnut Coffee Table', category: 'explore-coffeetable', price: '₹14,500', original: '₹18,000', rating: 4.7, img: d5, description: 'Minimalist round wooden coffee table with brass hairpin legs.' },
  { id: 'ex-coffee-2', name: 'Minimalist Coffee Table', category: 'coffeetable', price: '₹12,000', original: '₹15,000', rating: 4.6, img: d5, description: 'Modern coffee table with lower storage shelf.' },

  { id: 'ex-mat-1', name: 'Orthopedic Memory Foam Mattress', category: 'explore-mattress', price: '₹21,000', original: '₹27,000', rating: 4.9, img: d6, description: 'Triple-layer pocket spring orthopedic mattress with aloe vera cover.' },
  { id: 'ex-mat-2', name: 'Cozy Mattress', category: 'mattress', price: '₹18,000', original: '₹22,000', rating: 4.7, img: d6, description: 'Medium-firm dual comfort foam mattress for restful sleep.' },

  { id: 'ex-scb-1', name: 'Double Utility Sofa Cum Bed', category: 'explore-sofacumbed', price: '₹32,000', original: '₹40,000', rating: 4.8, img: img4, description: 'Easy pull-out sofa bed with hidden storage compartment.' },
  { id: 'ex-scb-2', name: 'Convertible Sofa Bed', category: 'sofacumbed', price: '₹28,000', original: '₹34,000', rating: 4.7, img: img4, description: 'Compact sofa bed ideal for guest rooms and studios.' },

  { id: 'ex-bk-1', name: 'Library Showcase Bookshelf', category: 'explore-bookshelf', price: '₹19,500', original: '₹24,000', rating: 4.8, img: img5, description: '5-tier open bookshelf cabinet with solid oak frame.' },
  { id: 'ex-bk-2', name: 'Bookshelf Cabinet', category: 'bookshelf', price: '₹16,000', original: '₹20,000', rating: 4.7, img: img5, description: 'Multi-utility display shelf for books and decor.' },

  { id: 'ex-st-1', name: 'Ergonomic Study Workspace Desk', category: 'explore-study', price: '₹15,000', original: '₹19,000', rating: 4.8, img: d1, description: 'Modern study desk with built-in drawers and wire grommet.' },
  { id: 'ex-st-2', name: 'Study Desk', category: 'study', price: '₹12,500', original: '₹16,000', rating: 4.7, img: d1, description: 'Compact wooden computer desk with bookshelf tower.' }
];

const LOCAL_STORAGE_KEY = 'luxe_custom_products_v2';

// Get local stored custom items
const getStoredCustomProducts = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error reading products from localStorage:", e);
    return [];
  }
};

// Save custom items to local storage
const saveCustomProductsLocally = (customList) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customList));
  } catch (e) {
    console.error("Error saving products to localStorage:", e);
  }
};

/**
 * Fetch all products instantly from local defaults + localStorage.
 * Performs a fast non-blocking background check with 1.2s timeout if server is up.
 */
export const getAllProducts = async () => {
  const customItems = getStoredCustomProducts();
  const allLocal = [...defaultProducts, ...customItems];

  // Try fast fetch with 1.2 second timeout so we never block or wait 50s
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch('https://selvaharish-interior-back.onrender.com/api/products', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const serverProducts = await res.json();
      if (Array.isArray(serverProducts) && serverProducts.length > 0) {
        // Merge server products with local ones, eliminating duplicates by ID
        const map = new Map();
        [...allLocal, ...serverProducts].forEach(p => map.set(p.id.toString(), p));
        return Array.from(map.values());
      }
    }
  } catch (e) {
    // Fast fallback to local products if server is sleeping or offline
    console.warn("Backend server offline or waking up, using instant local products folder dataset.");
  }

  return allLocal;
};

/**
 * Add custom product and save instantly to local storage folder.
 */
export const addCustomProduct = async (formData) => {
  try {
    const id = 'custom-' + Date.now();
    const name = formData.get('name') || 'New Custom Product';
    const price = formData.get('price') || '₹20,000';
    const category = formData.get('category') || 'modularkitchen';
    const description = formData.get('description') || 'Premium custom crafted furniture piece.';
    
    let img = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80';
    const imageFile = formData.get('image');
    const imageUrl = formData.get('imageUrl');

    if (imageFile && imageFile instanceof File) {
      img = URL.createObjectURL(imageFile);
    } else if (imageUrl) {
      img = imageUrl;
    }

    const newProduct = {
      id,
      name,
      price,
      category,
      description,
      rating: 5,
      img,
      specifications: {
        Material: formData.get('material') || 'Premium Wood',
        Dimensions: formData.get('dimensions') || 'Custom Size',
        Color: formData.get('color') || 'As Shown',
        Warranty: formData.get('warranty') || '1 Year Brand Warranty',
        Assembly: formData.get('assemblyRequired') || 'No'
      }
    };

    const currentCustom = getStoredCustomProducts();
    const updatedCustom = [newProduct, ...currentCustom];
    saveCustomProductsLocally(updatedCustom);

    // Also attempt non-blocking background upload to server
    fetch('https://selvaharish-interior-back.onrender.com/api/products', {
      method: 'POST',
      body: formData
    }).catch(err => console.log("Background server sync failed, saved locally."));

    return { success: true, product: newProduct };
  } catch (e) {
    console.error("Failed to add product locally:", e);
    return null;
  }
};

/**
 * Delete custom product instantly from local storage.
 */
export const deleteCustomProduct = async (id) => {
  try {
    const currentCustom = getStoredCustomProducts();
    const updatedCustom = currentCustom.filter(p => p.id.toString() !== id.toString());
    saveCustomProductsLocally(updatedCustom);

    // Background sync to server
    fetch(`https://selvaharish-interior-back.onrender.com/api/products/${id}`, {
      method: 'DELETE'
    }).catch(err => console.log("Background server delete sync failed, removed locally."));

    return { success: true };
  } catch (e) {
    console.error(`Failed to delete product ${id}:`, e);
    return { success: false };
  }
};
