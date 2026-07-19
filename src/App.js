import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// காம்பனென்ட்கள் (உங்கள் ஃபோல்டர் அமைப்பிற்கு ஏற்ப இம்போர்ட் செய்யவும்)
import Navbar from './component/Navbar';
import Home from './component/Home'; 
import ModularKitchen from './component/ModularKitchen';
import BedroomCupboard from './component/BedroomCupboard';
import Wardrobes from './component/Wardrobes';
import TVUnit from './component/TVUnit';
import PoojaCupboard from './component/PoojaCupboard';
import Showcase from './component/Showcase';
import WoodenDoors from './component/WoodenDoors';
import Furniture from './component/Furniture';
import WoodenWork from './component/WoodenWork';
import LoginModal from './component/LoginModal';
import Cart from './component/Cart';
import Success from './component/Success'; 
import CheckOut from './component/CheckOut';
import ProductPage from './component/ProductPage';
import AdminPanel from './component/AdminPanel';
import HomeDecor from './component/HomeDecor';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'customer'
  const [currentUser, setCurrentUser] = useState(null); // { name, email }
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
    alert("Logged out successfully!");
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
          userRole={userRole}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLoginClick={() => setShowLogin(true)} 
          cartCount={cartItems.length} 
          onCartClick={() => setShowCart(true)} 
        />
        
        {showLogin && (
          <LoginModal 
            onClose={() => setShowLogin(false)} 
            setIsLoggedIn={setIsLoggedIn} 
            setUserRole={setUserRole} 
            setCurrentUser={setCurrentUser}
          />
        )}
        {showCart && (
          <Cart 
            cartItems={cartItems} 
            setCartItems={setCartItems}
            onClose={() => setShowCart(false)} 
            isLoggedIn={isLoggedIn}
          />
        )}

        <Routes>
          <Route path="/home" element={<Home addToCart={addToCart} isLoggedIn={isLoggedIn} userRole={userRole} />} />
          <Route index path="/" element={<Home addToCart={addToCart} isLoggedIn={isLoggedIn} userRole={userRole} />} />
          <Route path="/modularkitchen" element={<ModularKitchen isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
          <Route path="/bedroomcupboard" element={<BedroomCupboard isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
          <Route path="/wardrobes" element={<Wardrobes isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
          <Route path="/tvunit" element={<TVUnit isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
          <Route path="/poojacupboard" element={<PoojaCupboard isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
          <Route path="/showcase" element={<Showcase isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
          <Route path="/woodendoors" element={<WoodenDoors isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
          <Route path="/furniture" element={<Furniture isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
          <Route path="/woodenwork" element={<WoodenWork isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
          <Route path="/homedecor" element={<HomeDecor />} />
          <Route path="/success" element={<Success />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/admin" element={<AdminPanel isLoggedIn={isLoggedIn} userRole={userRole} />} />
          <Route path="/product/:name" element={<ProductPage isLoggedIn={isLoggedIn} userRole={userRole} addToCart={addToCart} triggerLogin={() => setShowLogin(true)} />} />
        </Routes>
   
      </div>

    </Router>
  );
}

export default App;