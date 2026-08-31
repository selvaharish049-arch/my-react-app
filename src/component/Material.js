import React from 'react';
import './Material.css';

const materials = [
  { 
    title: "Sheesham Wood", 
    desc: "Sheesham (Indian Rosewood) is an exceptionally dense, durable hardwood prized for its gorgeous natural grain patterns and rich color tones. It is highly resistant to warping and splitting, making it the perfect choice for high-strength, long-lasting dining tables, bed frames, and luxury cabinets that require low maintenance over decades of daily household use." 
  },
  { 
    title: "Mango Wood", 
    desc: "Mango wood has gained immense popularity as a sustainable and highly versatile furniture material. Known for its unique golden-brown hues and prominent grain lines, it exhibits excellent strength and density. It takes stains and finishes beautifully, allowing craftsmen to create elegant contemporary sideboards, rustic coffee tables, and artistic wall panels that add instant organic warmth to modern living spaces." 
  },
  { 
    title: "Teak Wood", 
    desc: "Teak wood stands as the gold standard of premium furniture timber in India. Packed with natural oils, it exhibits legendary durability, weather resistance, and natural protection against termites, pests, and decay. Its stability under varying humidity levels makes it the absolute best choice for heritage doors, outdoor patio sets, and luxury customized living room furniture." 
  },
  { 
    title: "Engineered Wood", 
    desc: "Engineered wood (including MDF, HDF, and premium plywoods) is the go-to material for sleek, minimalist, and highly functional modular furniture. Engineered for absolute consistency, it does not contract or expand due to temperature changes, providing flat, smooth, and lightweight surfaces. It is highly versatile and ideal for contemporary wardrobes, modern study desks, and modular kitchen cabinetry." 
  },
  { 
    title: "Ash Wood", 
    desc: "Ash wood is celebrated for its remarkable shock resistance, bending flexibility, and classic light-beige grain appeal. It has a beautiful, smooth texture that is highly receptive to luxury lacquer finishes. Its clean aesthetic and lightweight strength make it a top pick for crafting modern Scandinavian-style dining chairs, accent coffee tables, and contemporary room dividers." 
  }
];

const Material = () => {
  return (
    <div className="material-wrapper">
      <h2 className="material-heading">Check out Various Furniture Materials Available</h2>
      <div className="material-container">
        {materials.map((item, index) => (
          <div key={index} className="material-card">
            <h3>{index + 1}. {item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Material;