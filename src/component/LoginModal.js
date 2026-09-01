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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isRegister && activeTab === 'customer') {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseUrl = isLocalhost ? 'http://localhost:5000' : 'https://selvaharish-interior-back.onrender.com';
      
      let registeredOnServer = false;
      try {
        const response = await fetch(`${baseUrl}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        if (response.ok) {
          registeredOnServer = true;
          alert("User registered successfully on server!");
        } else {
          const data = await response.json().catch(() => ({}));
          console.warn("Server registration failed: ", data.message);
        }
      } catch (err) {
        console.warn("Backend server offline or database connection failed. Falling back to local browser storage registration.");
      }

      // Save to localStorage as well so they can log in offline/locally
      let customers = [];
      try {
        const existing = localStorage.getItem('luxe_customers');
        if (existing) {
          customers = JSON.parse(existing);
        }
      } catch (e) {
        customers = [];
      }
      
      const alreadyExists = customers.some(c => c.email.trim().toLowerCase() === formData.email.trim().toLowerCase());
      if (!alreadyExists) {
        customers.push({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender || 'Other'
        });
        localStorage.setItem('luxe_customers', JSON.stringify(customers));
      }

      if (!registeredOnServer) {
        alert("User registered successfully locally!");
      }
    
      
      // Auto login customer and redirect
      setIsLoggedIn(true);
      if (setUserRole) setUserRole('customer');
     if (setCurrentUser) {
    setCurrentUser({
        name: formData.name,
        email: formData.email
    });
}
      if (typeof onClose === 'function') {
        onClose();
      }
    } else {
      // Login Logic
      const inputUser = formData.email.trim().toLowerCase();
      const isSystemAdmin = (inputUser === 'karthi' || inputUser === 'karthi@gmail.com') && 
                            (formData.password === 'karthi123' || formData.password === 'karthi@123');
      
      if (activeTab === 'admin') {
        if (isSystemAdmin) {
          setIsLoggedIn(true);
          if (setUserRole) setUserRole('admin');
          if (setCurrentUser) setCurrentUser({ name: 'Karthi', email: 'karthi' });
          if (typeof onClose === 'function') onClose();
          navigate('/admin');
        } else {
          alert("Invalid Admin credentials! Use username: karthi & password: karthi123");
          return;
        }
      } else {
        // Customer login
        if (isSystemAdmin) {
          setIsLoggedIn(true);
          if (setUserRole) setUserRole('admin');
          if (setCurrentUser) setCurrentUser({ name: 'Karthi', email: 'karthi' });
          if (typeof onClose === 'function') onClose();
          navigate('/admin');
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
            if (typeof onClose === 'function') onClose();
            navigate('/');
          } else {
            alert("Invalid customer credentials! You can register a new account or use admin: karthi / karthi123.");
            return;
          }
        }
      }
      
      if (typeof onClose === 'function') {
        onClose();
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container amazon-login-card">
        <span className="close-btn" onClick={onClose}>&times;</span>
        
        {/* Amazon-style Branding Header */}
        <div className="amazon-brand-logo">
          <span className="brand-luxe">LUXE</span>
          <span className="brand-sub">INTERIOR</span>
        </div>

        <h2 className="amazon-signin-title">{isRegister ? "Create account" : "Sign in"}</h2>

        {/* Tab Selection */}
        {!isRegister && (
          <div className="login-tabs amazon-tabs">
            <button 
              type="button" 
              className={activeTab === 'customer' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => handleTabChange('customer')}
            >
              Customer
            </button>
            <button 
              type="button" 
              className={activeTab === 'admin' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => handleTabChange('admin')}
            >
              Admin Sign-In
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="amazon-login-form">
          {isRegister && activeTab === 'customer' && (
            <>
              <label className="amazon-input-label">Your name</label>
              <input name="name" placeholder="First and last name" onChange={handleChange} required value={formData.name} />
              
              <label className="amazon-input-label">Gender</label>
              <input name="gender" placeholder="e.g. Male / Female" onChange={handleChange} required value={formData.gender} />
            </>
          )}

          <label className="amazon-input-label">
            {activeTab === 'admin' ? "Admin Username" : "Email or mobile phone number"}
          </label>
          <input 
            name="email" 
            type={activeTab === 'admin' ? "text" : "email"} 
            placeholder={activeTab === 'admin' ? "e.g. karthi" : "email@domain.com"} 
            onChange={handleChange} 
            required 
            value={formData.email} 
          />

          <label className="amazon-input-label">Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="At least 6 characters" 
            onChange={handleChange} 
            required 
            value={formData.password} 
          />

          {isRegister && activeTab === 'customer' && (
            <>
              <label className="amazon-input-label">Re-enter password</label>
              <input 
                name="confirmPassword" 
                type="password" 
                placeholder="Confirm password" 
                onChange={handleChange} 
                required 
                value={formData.confirmPassword} 
              />
            </>
          )}

          <button type="submit" className="login-submit-btn amazon-btn-primary">
            {isRegister ? "Create your Luxe account" : "Sign in"}
          </button>
        </form>

        <p className="amazon-terms-text">
          By continuing, you agree to Luxe Interior's <span>Conditions of Use</span> and <span>Privacy Notice</span>.
        </p>

        <div className="amazon-divider">
          <span>{isRegister ? "Already have an account?" : "New to Luxe Interior?"}</span>
        </div>

        {activeTab === 'customer' && (
          <button 
            type="button" 
            onClick={() => setIsRegister(!isRegister)} 
            className="amazon-btn-secondary"
          >
            {isRegister ? "Sign in to your account" : "Create your Luxe account"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginModal;