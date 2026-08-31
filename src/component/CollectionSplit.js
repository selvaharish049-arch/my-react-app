import React from 'react';
import './CollectionSplit.css';

// Import arch image asset
import archImg from '../assets/collection_arch.jpg';

const categoryContent = {
  'modularkitchen': {
    title: 'Crafted for the modern culinary enthusiast, our Modular Kitchen layouts thoughtfully consider every detail.',
    bullets: [
      'Smart Cabinets & Seamless Storage Accessories',
      'Water-resistant & Extremely Durable Countertops',
      'Ergonomic Work Triangle Layouts & Premium Finishes'
    ]
  },
  'bedroomcupboard': {
    title: 'Designed for peaceful bedroom layouts, our Cupboards organize your space elegantly.',
    bullets: [
      'Built-in Soft-close Shelves & Security Lockers',
      'Termite-proof Long-lasting Engineered Core',
      'Compact Layouts customizable to your bedroom size'
    ]
  },
  'wardrobes': {
    title: 'Crafted for the modern dressing room, our Designer Wardrobes maximize storage elegantly.',
    bullets: [
      'Integrated Wardrobe Hanger Rods & Organizers',
      'Scratch-resistant Laminated Surfaces in premium shades',
      'Contemporary sliding doors & safety glass partitions'
    ]
  },
  'wardrobe': {
    title: 'Crafted for the modern dressing room, our Designer Wardrobes maximize storage elegantly.',
    bullets: [
      'Integrated Wardrobe Hanger Rods & Organizers',
      'Scratch-resistant Laminated Surfaces in premium shades',
      'Contemporary sliding doors & safety glass partitions'
    ]
  },
  'tvunit': {
    title: 'Crafted for modern entertainment setups, our TV Console units organize your media gear cleanly.',
    bullets: [
      'Smart Wire Management & Cable Concealment Channels',
      'Floating & Floor-standing open shelving panels',
      'Sleek Minimalist Aesthetic with Optional LED highlights'
    ]
  },
  'poojacupboard': {
    title: 'Crafted for spiritual corners, our Wooden Pooja Mandirs offer sacred elegance.',
    bullets: [
      'Traditional Handcrafted motifs & solid wood build',
      'Dedicated drawers for brassware & prayer accessories',
      'High-quality Teakwood & Rosewood polished finishes'
    ]
  },
  'showcase': {
    title: 'Designed to display your collectibles, our Display Units showcase memories beautifully.',
    bullets: [
      'Tempered Glass Doors with internal warm spotlights',
      'Adjustable heavy-duty shelves for books & decor items',
      'Premium Wood Grain textures matching your living room theme'
    ]
  },
  'woodendoors': {
    title: 'Crafted to welcome warmth, our Solid Wooden Doors are built for safety and strength.',
    bullets: [
      'Multi-lock safety compatible core paneling',
      'Weather-resistant & termite-proof external finish layers',
      'Elegant hand-carved classical and modern border motifs'
    ]
  },
  'furniture': {
    title: 'Crafted for modern living rooms, our Designer Furniture pieces elevate every corner.',
    bullets: [
      'High-density comfort cushioning & premium fabric wraps',
      'Seasoned solid wood frames with rust-proof metal accents',
      'Modular layouts easily rearrangeable for seating flexibility'
    ]
  },
  'woodenwork': {
    title: 'Crafted by master artisans, our Premium Wooden Work defines custom luxury.',
    bullets: [
      'Seamless Wall Paneling & decorative acoustic partitions',
      'Custom hand-finished architectural carpentry work',
      'Grade-A Hardwood materials & premium polyurethane coating'
    ]
  }
};

const CollectionSplit = ({ category }) => {
  const query = (category || '').trim().toLowerCase();
  const content = categoryContent[query] || {
    title: 'Crafted for the contemporary home, our custom furniture designs thoughtfully consider every detail.',
    bullets: [
      'Premium Seating & Soft Fabric Cushions',
      'Solid Teak & Sheesham Wood Core Build',
      'Warm Cozy Lighting & Contemporary Aesthetics'
    ]
  };

  return (
    <div className="collection-split-wrapper">
      <div className="collection-split-container">
        {/* Left Side: Arch Image */}
        <div className="collection-split-left">
          <div className="collection-arch-img-box">
            <img src={archImg} alt="Designer Interior Arch" />
          </div>
        </div>

        {/* Right Side: Text Description Details */}
        <div className="collection-split-right">
          <p className="collection-split-shipping">FREE SHIPPING FOR ALL ORDERS OVER ₹10,000</p>
          
          <h2 className="collection-split-heading">
            {content.title}
          </h2>

          <ul className="collection-split-bullets">
            {content.bullets.map((bullet, idx) => (
              <li key={idx}>
                <span className="bullet-dot">•</span> {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CollectionSplit;
