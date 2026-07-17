import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeDecor.css';

// உங்கள் படங்களை இம்போர்ட் செய்யவும்
import img1 from '../assets/d1.jpg';
import img2 from '../assets/d2.jpg';
import img3 from '../assets/d3.jpg';
import img4 from '../assets/d4.jpg';
import img5 from '../assets/d5.jpg';
import img6 from '../assets/d6.jpg';
import img7 from '../assets/d7.jpg';
import img8 from '../assets/d8.jpg';
import img9 from '../assets/d9.jpg';
import img10 from '../assets/d1.jpg';

const items = [
  { name: 'SOFAS', img: img1, path: '/product/explore-sofa' },
  { name: 'BEDS', img: img2, path: '/product/explore-bed' },
  { name: 'DINING', img: img3, path: '/product/explore-dining' },
  { name: 'TV UNITS', img: img4, path: '/product/explore-tvunit' },
  { name: 'COFFEE', img: img5, path: '/product/explore-coffeetable' },
  { name: 'MATTRESSES', img: img6, path: '/product/explore-mattress' },
  { name: 'WARDROBES', img: img7, path: '/product/explore-wardrobe' },
  { name: 'SOFA CUM BED', img: img8, path: '/product/explore-sofacumbed' },
  { name: 'BOOKSHELVES', img: img9, path: '/product/explore-bookshelf' },
  { name: 'ALL STUDY', img: img10, path: '/product/explore-study' },
];

const HomeDecor = () => {
  const navigate = useNavigate();

  return (
    <div className="decor-grid-container">
      <h3 className="decor-grid-title">𝙾𝚞𝚛 𝙲𝚛𝚊𝚏𝚝𝚜𝚖𝚊𝚗𝚜𝚑𝚒𝚙 𝙵𝚘𝚛 𝙷𝚘𝚖𝚎 𝙳𝚎𝚌𝚘𝚛</h3>
      <div className="decor-grid">
        {items.map((item, index) => (
          <div key={index} className="decor-card" onClick={() => navigate(item.path)}>
            <div className="decor-circle-wrapper">
              <img src={item.img} alt={item.name} />
            </div>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeDecor;