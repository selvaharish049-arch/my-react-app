import React from 'react';
import './Material.css';

const materials = [
  { title: "Sheesham Wood", desc: "Sheesham is a type of Indian rosewood that is a trendy pick for home furniture. It is very dense and strong, making it ideal for pieces that need high strength." },
  { title: "Mango Wood", desc: "Mango wood is another popular choice for furniture in India. It is a hardwood known for its strength and density, often finished with a light stain." },
  { title: "Teak Wood", desc: "Teak is the most popular type of wood for furniture in India. It is known for its durability and natural resistance to moisture and decay." },
  { title: "Engineered Wood", desc: "If you enjoy the sleekness that comes with simplicity, engineered wood will be the right choice for your home. They are versatile and neat." },
  { title: "Ash Wood", desc: "Ash wood is known for its strength, flexibility, and timeless appeal. With a smooth texture and light color tone, it brings warmth and elegance." }
];

const Material = () => {
  return (
    <div className="material-wrapper">
      <h2 className="material-heading">𝙲𝚑𝚎𝚌𝚔 𝚘𝚞𝚝 𝚅𝚊𝚛𝚒𝚘𝚞𝚜 𝙵𝚞𝚛𝚗𝚒𝚝𝚞𝚛𝚎 𝙼𝚊𝚝𝚎𝚛𝚒𝚊𝚕𝚜 𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎</h2>
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