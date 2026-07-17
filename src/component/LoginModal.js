import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = ({ onClose, setIsLoggedIn, setUserRole, setCurrentUser }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'admin'
  const [formData, setFormData] = useState({
    name: '', gender: '', email: '', password: '', confirmPassword: ''
  });

  React.useEffect(() => {
    const existing = localStorage.getItem('luxe_customers');
    if (!existing) {
      const defaultCustomers = [
        { name: 'Default Customer', email: 'customer@luxe.com', password: 'customer123', gender: 'Other' }
      ];
      localStorage.setItem('luxe_customers', JSON.stringify(defaultCustomers));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      ...formData,
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister && activeTab === 'customer') {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      let customers = [];
      try {
        const existing = localStorage.getItem('luxe_customers');
        if (existing) {
          customers = JSON.parse(existing);
        }
      } catch (err) {
        customers = [];
      }
      
      const emailExists = customers.some(c => c.email.trim().toLowerCase() === formData.email.trim().toLowerCase());
      if (emailExists) {
        alert("Email is already registered! Please use another email or Sign In.");
        return;
      }
      
      const newCust = {
        name: formData.name.trim(),
        gender: formData.gender.trim(),
        email: formData.email.trim(),
        password: formData.password
      };
      
      customers.push(newCust);
      localStorage.setItem('luxe_customers', JSON.stringify(customers));
      
      // Auto login customer and redirect
      setIsLoggedIn(true);
      if (setUserRole) setUserRole('customer');
      if (setCurrentUser) setCurrentUser({ name: newCust.name, email: newCust.email });
      navigate('/');
      if (typeof onClose === 'function') {
        onClose();
      }
    } else {
      // Login Logic
      const isSystemAdmin = formData.email.trim() === 'karthi' && formData.password === 'karthi@01';
      
      if (activeTab === 'admin') {
        if (isSystemAdmin) {
          setIsLoggedIn(true);
          if (setUserRole) setUserRole('admin');
          if (setCurrentUser) setCurrentUser({ name: 'Karthi', email: 'karthi' });
          navigate('/');
        } else {
          alert("Invalid Admin credentials!");
          return;
        }
      } else {
        // Customer login
        if (isSystemAdmin) {
          setIsLoggedIn(true);
          if (setUserRole) setUserRole('admin');
          if (setCurrentUser) setCurrentUser({ name: 'Karthi', email: 'karthi' });
          navigate('/');
        } else {
          let customers = [];
          try {
            const existing = localStorage.getItem('luxe_customers');
            if (existing) {
              customers = JSON.parse(existing);
            }
          } catch (err) {
            customers = [];
          }
          
          const foundCustomer = customers.find(
            c => c.email.trim().toLowerCase() === formData.email.trim().toLowerCase() && 
                 c.password === formData.password
          );
          
          if (foundCustomer) {
            setIsLoggedIn(true);
            if (setUserRole) setUserRole('customer');
            if (setCurrentUser) setCurrentUser({ name: foundCustomer.name, email: foundCustomer.email });
            navigate('/');
          } else {
            alert("Invalid customer credentials! You can register a new account or use customer@luxe.com / customer123.");
            return;
          }
        }
      }
      
      if (typeof onClose === 'function') {
        onClose(); // close modal window
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <span className="close-btn" onClick={onClose}>&times;</span>
        
        <h2 style={{ marginBottom: '10px' }}>{isRegister ? "Sign Up" : "Sign In"}</h2>

        {/* Tab Selection */}
        {!isRegister && (
          <div className="login-tabs">
            <button 
              type="button" 
              className={activeTab === 'customer' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => handleTabChange('customer')}
            >
              Customer Login
            </button>
            <button 
              type="button" 
              className={activeTab === 'admin' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => handleTabChange('admin')}
            >
              Admin Login
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
          {isRegister && activeTab === 'customer' && (
            <>
              <input name="name" placeholder="Name" onChange={handleChange} required value={formData.name} />
              <input name="gender" placeholder="Gender" onChange={handleChange} required value={formData.gender} />
            </>
          )}
          <input 
            name="email" 
            type={activeTab === 'admin' ? "text" : "email"} 
            placeholder={activeTab === 'admin' ? "Username" : "Email"} 
            onChange={handleChange} 
            required 
            value={formData.email} 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            value={formData.password} 
          />
          {isRegister && activeTab === 'customer' && (
            <input 
              name="confirmPassword" 
              type="password" 
              placeholder="Confirm Password" 
              onChange={handleChange} 
              required 
              value={formData.confirmPassword} 
            />
          )}
          <button type="submit" className="login-submit-btn">
            {isRegister ? "Register" : "Sign In"}
          </button>
        </form>
        
        {activeTab === 'customer' && (
          <p onClick={() => setIsRegister(!isRegister)} style={{cursor: 'pointer', color: '#c98544', marginTop: '15px', textAlign: 'center', fontSize: '14px', fontWeight: '500'}}>
            {isRegister ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;