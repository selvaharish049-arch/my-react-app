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
    setIsRegister(false);
    setFormData({
      name: '',
      gender: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const removeReadOnly = (e) => {
    e.target.removeAttribute('readonly');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isRegister && activeTab === 'customer') {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanPassword = formData.password.trim();
      const cleanName = formData.name.trim() || 'Luxe Customer';

      // Save / Update to localStorage so customer can always sign in smoothly
      let customers = [];
      try {
        const existing = localStorage.getItem('luxe_customers');
        if (existing) {
          customers = JSON.parse(existing);
        }
      } catch (e) {
        customers = [];
      }
      
      const existingIdx = customers.findIndex(c => c.email && c.email.trim().toLowerCase() === cleanEmail);
      const newCustomer = {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        gender: formData.gender || 'Other'
      };

      if (existingIdx >= 0) {
        customers[existingIdx] = newCustomer;
      } else {
        customers.push(newCustomer);
      }

      localStorage.setItem('luxe_customers', JSON.stringify(customers));
      localStorage.setItem('luxe_user', JSON.stringify({ name: cleanName, email: cleanEmail, role: 'customer' }));

      // Non-blocking server sync if server is online
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseUrl = isLocalhost ? 'http://localhost:5000' : 'https://selvaharish-interior-back.onrender.com';
      fetch(`${baseUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanName, email: cleanEmail, password: cleanPassword })
      }).catch(() => {});

      alert(`Account created successfully! Welcome to Luxe Interior, ${cleanName}.`);
      
      // Auto login customer and redirect
      setIsLoggedIn(true);
      if (setUserRole) setUserRole('customer');
      if (setCurrentUser) {
        setCurrentUser({ name: cleanName, email: cleanEmail });
      }
      if (typeof onClose === 'function') {
        onClose();
      }
      navigate('/');
    } else {
      // Login Logic
      const inputUser = formData.email.trim().toLowerCase();
      const inputPass = formData.password.trim();

      if (activeTab === 'admin') {
        // STRICT ADMIN LOGIN ONLY ON ADMIN TAB
        const isSystemAdmin = (inputUser === 'karthi' || inputUser === 'karthi@gmail.com') && 
                              (inputPass === 'karthi123' || inputPass === 'karthi@123');

        if (isSystemAdmin) {
          setIsLoggedIn(true);
          if (setUserRole) setUserRole('admin');
          if (setCurrentUser) setCurrentUser({ name: 'Karthi', email: 'karthi' });
          localStorage.setItem('luxe_user', JSON.stringify({ name: 'Karthi', email: 'karthi', role: 'admin' }));
          if (typeof onClose === 'function') onClose();
          navigate('/admin');
        } else {
          alert("Invalid Admin credentials! Please check your username and password.");
          return;
        }
      } else {
        // STRICT CUSTOMER LOGIN ONLY ON CUSTOMER TAB
        let customers = [];
        try {
          const existing = localStorage.getItem('luxe_customers');
          if (existing) {
            customers = JSON.parse(existing);
          }
        } catch (err) {
          customers = [];
        }
        
        let foundCustomer = customers.find(c => {
          const emailMatch = c.email && c.email.trim().toLowerCase() === inputUser;
          const nameMatch = c.name && c.name.trim().toLowerCase() === inputUser;
          const phoneMatch = c.phone && c.phone.trim() === inputUser;
          const passMatch = c.password && (c.password.trim() === inputPass || c.password === formData.password);
          return (emailMatch || nameMatch || phoneMatch) && passMatch;
        });

        // Fallback check for default customer test account
        if (!foundCustomer && (inputUser === 'customer@luxe.com' || inputUser === 'default customer') && inputPass === 'customer123') {
          foundCustomer = { name: 'Default Customer', email: 'customer@luxe.com' };
        }
        
        if (foundCustomer) {
          setIsLoggedIn(true);
          if (setUserRole) setUserRole('customer');
          if (setCurrentUser) setCurrentUser({ name: foundCustomer.name, email: foundCustomer.email });
          localStorage.setItem('luxe_user', JSON.stringify({ name: foundCustomer.name, email: foundCustomer.email, role: 'customer' }));
          alert(`Logged in successfully! Welcome back, ${foundCustomer.name}.`);
          if (typeof onClose === 'function') onClose();
          navigate('/');
        } else {
          alert("Invalid customer credentials! Please register a new account or check your email and password.");
          return;
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

        <h2 className="amazon-signin-title">
          {isRegister ? "Create account" : activeTab === 'admin' ? "Admin Portal Sign-In" : "Sign in"}
        </h2>

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

        <form onSubmit={handleSubmit} className="amazon-login-form" autoComplete="off">
          {/* Dummy inputs to absorb browser password manager auto-fill */}
          <input type="text" name="prevent_autofill_username" style={{ display: 'none' }} tabIndex="-1" />
          <input type="password" name="prevent_autofill_password" style={{ display: 'none' }} tabIndex="-1" />

          {isRegister && activeTab === 'customer' && (
            <>
              <label className="amazon-input-label">Your name</label>
              <input 
                name="name" 
                placeholder="First and last name" 
                onChange={handleChange} 
                required 
                value={formData.name} 
                autoComplete="off"
                readOnly
                onFocus={removeReadOnly}
              />
              
              <label className="amazon-input-label">Gender</label>
              <input 
                name="gender" 
                placeholder="e.g. Male / Female" 
                onChange={handleChange} 
                required 
                value={formData.gender} 
                autoComplete="off"
                readOnly
                onFocus={removeReadOnly}
              />
            </>
          )}

          <label className="amazon-input-label">
            {activeTab === 'admin' ? "Admin Username" : "Email or mobile phone number"}
          </label>
          <input 
            name="email" 
            type="text" 
            placeholder={activeTab === 'admin' ? "Enter Admin Username" : "Enter Email or Phone Number"} 
            onChange={handleChange} 
            required 
            value={formData.email} 
            autoComplete="new-password"
            readOnly
            onFocus={removeReadOnly}
          />

          <label className="amazon-input-label">Password</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input 
              name="luxe_security_key" 
              type="text" 
              placeholder="At least 6 characters" 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required 
              value={formData.password} 
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-lpignore="true"
              data-1p-ignore="true"
              data-form-type="other"
              readOnly
              onFocus={removeReadOnly}
              style={{ width: '100%', WebkitTextSecurity: 'disc', fontFamily: 'caption, monospace' }}
            />
          </div>

          {isRegister && activeTab === 'customer' && (
            <>
              <label className="amazon-input-label">Re-enter password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  name="luxe_security_confirm_key" 
                  type="text" 
                  placeholder="Confirm password" 
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                  required 
                  value={formData.confirmPassword} 
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  readOnly
                  onFocus={removeReadOnly}
                  style={{ width: '100%', WebkitTextSecurity: 'disc', fontFamily: 'caption, monospace' }}
                />
              </div>
            </>
          )}

          <button type="submit" className="login-submit-btn amazon-btn-primary">
            {isRegister ? "Create your Luxe account" : activeTab === 'admin' ? "Sign In as Admin" : "Sign in"}
          </button>
        </form>

        <p className="amazon-terms-text">
          By continuing, you agree to Luxe Interior's <span>Conditions of Use</span> and <span>Privacy Notice</span>.
        </p>

        {activeTab === 'customer' && (
          <>
            <div className="amazon-divider">
              <span>{isRegister ? "Already have an account?" : "New to Luxe Interior?"}</span>
            </div>

            <button 
              type="button" 
              onClick={() => setIsRegister(!isRegister)} 
              className="amazon-btn-secondary"
            >
              {isRegister ? "Sign in to your account" : "Create your Luxe account"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;