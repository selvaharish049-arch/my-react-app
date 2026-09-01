import React, { useState, useEffect } from 'react';
import './OrderManagement.css';

const API_BASE_URL = 'http://localhost:5000/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // New Order Form state
  const [newOrder, setNewOrder] = useState({
    orderId: '',
    customerName: '',
    phone: '',
    projectType: 'Modular Kitchen',
    currentStep: 1,
    expectedCompletionDate: '',
    notes: ''
  });

  // Edit / Status Updater Modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateStep, setUpdateStep] = useState(1);
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateExpectedDate, setUpdateExpectedDate] = useState('');
  const [stageDates, setStageDates] = useState({
    1: '',
    2: '',
    3: '',
    4: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create Order Handler
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.customerName || !newOrder.phone) {
      alert('Please fill customer name and phone number.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const created = await response.json();

      if (response.ok) {
        setMessage(`Success! Order '${created.orderId}' created for ${created.customerName}.`);
        setNewOrder({
          orderId: '',
          customerName: '',
          phone: '',
          projectType: 'Modular Kitchen',
          currentStep: 1,
          expectedCompletionDate: '',
          notes: ''
        });
        fetchOrders();
        setTimeout(() => setMessage(''), 4000);
      } else {
        alert(created.error || 'Failed to create order');
      }
    } catch (err) {
      alert('Error connecting to backend server.');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (order) => {
    setSelectedOrder(order);
    setUpdateStep(order.currentStep || 1);
    setUpdateNotes(order.notes || '');
    setUpdateExpectedDate(order.expectedCompletionDate || '');

    // Fill stage dates map
    const datesMap = { 1: '', 2: '', 3: '', 4: '' };
    if (order.steps && Array.isArray(order.steps)) {
      order.steps.forEach(st => {
        datesMap[st.stepNumber] = st.date || '';
      });
    }
    setStageDates(datesMap);
  };

  // Save Status Update Handler
  const handleSaveStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`${API_BASE_URL}/orders/update-status/${selectedOrder.orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: updateStep,
          stageDates: stageDates,
          notes: updateNotes,
          expectedCompletionDate: updateExpectedDate
        })
      });

      const resData = await response.json();

      if (response.ok) {
        setMessage(`Order '${selectedOrder.orderId}' status updated to Step ${updateStep}!`);
        setSelectedOrder(null);
        fetchOrders();
        setTimeout(() => setMessage(''), 4000);
      } else {
        alert(resData.error || 'Failed to update order');
      }
    } catch (err) {
      alert('Error updating order status');
    }
  };

  // Delete Order Handler
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order '${orderId}'?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setMessage(`Order '${orderId}' deleted successfully.`);
        fetchOrders();
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      alert('Failed to delete order.');
    }
  };

  const getStepLabel = (step) => {
    switch (parseInt(step, 10)) {
      case 1: return '1. Order Confirmed';
      case 2: return '2. Design & Material Selection';
      case 3: return '3. Carpentry & Production';
      case 4: return '4. Site Installation & Delivery';
      default: return '1. Order Confirmed';
    }
  };

  return (
    <div className="order-mgmt-container">
      
      {/* Header */}
      <div className="order-mgmt-header">
        <div>
          <h2>📦 Project Order Management</h2>
          <p>Create customer interior orders and track live 4-stage progress.</p>
        </div>
        <button className="refresh-btn" onClick={fetchOrders} disabled={loading}>
          🔄 Refresh Orders
        </button>
      </div>

      {/* Alert Notification Message */}
      {message && (
        <div className="order-toast-success">
          ✅ {message}
        </div>
      )}

      {/* CREATE ORDER FORM CARD */}
      <div className="mgmt-card create-order-card">
        <h3>➕ Add New Interior Project Order</h3>
        <form onSubmit={handleCreateOrder} className="create-order-grid">
          
          <div className="form-group">
            <label>Customer Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Ananya Sharma" 
              value={newOrder.customerName}
              onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input 
              type="text" 
              placeholder="e.g. 9876543210" 
              value={newOrder.phone}
              onChange={(e) => setNewOrder({...newOrder, phone: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Project Type</label>
            <select 
              value={newOrder.projectType}
              onChange={(e) => setNewOrder({...newOrder, projectType: e.target.value})}
            >
              <option value="Modular Kitchen">Modular Kitchen</option>
              <option value="Wardrobe">Wardrobe</option>
              <option value="Full Interior">Full Interior</option>
              <option value="Bedroom Cupboard">Bedroom Cupboard</option>
              <option value="TV Unit Console">TV Unit Console</option>
              <option value="Pooja Cupboard">Pooja Cupboard</option>
              <option value="Custom Woodwork">Custom Woodwork</option>
            </select>
          </div>

          <div className="form-group">
            <label>Custom Order ID (Optional)</label>
            <input 
              type="text" 
              placeholder="Auto-generated if left blank (e.g. SH-104)" 
              value={newOrder.orderId}
              onChange={(e) => setNewOrder({...newOrder, orderId: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Expected Completion Date</label>
            <input 
              type="date" 
              value={newOrder.expectedCompletionDate}
              onChange={(e) => setNewOrder({...newOrder, expectedCompletionDate: e.target.value})}
            />
          </div>

          <div className="form-group full-width">
            <label>Project Notes / Material Details</label>
            <input 
              type="text" 
              placeholder="e.g. Plywood grade, acrylic shade finish, soft-close hardware specifications..." 
              value={newOrder.notes}
              onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
            />
          </div>

          <div className="form-group full-width">
            <button type="submit" className="btn-primary-create">
              🚀 Create Project Order
            </button>
          </div>
        </form>
      </div>

      {/* ORDERS LIST TABLE / CARDS */}
      <div className="mgmt-card orders-list-card">
        <h3>📋 Existing Customer Orders ({orders.length})</h3>

        {loading ? (
          <p className="loading-text">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="empty-text">No project orders created yet. Use the form above to add your first order.</p>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Info</th>
                  <th>Project / Items</th>
                  <th>Total & Payment</th>
                  <th>Current Stage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.orderId}>
                    <td>
                      <span className="table-order-id">{ord.orderId}</span>
                    </td>
                    <td>
                      <strong>{ord.customerName}</strong>
                      <div style={{ fontSize: '12px', color: '#555' }}>📞 {ord.phone}</div>
                      {ord.email && <div style={{ fontSize: '11.5px', color: '#888' }}>📧 {ord.email}</div>}
                      {ord.address && <div style={{ fontSize: '11.5px', color: '#666', fontStyle: 'italic', maxWidth: '180px' }}>📍 {ord.address}</div>}
                    </td>
                    <td>
                      <span className="table-project-pill">{ord.projectType}</span>
                    </td>
                    <td>
                      <strong>{ord.totalAmount || '₹N/A'}</strong>
                      <div style={{ fontSize: '11.5px', color: '#888' }}>{ord.paymentMode || 'Cash on Delivery'}</div>
                    </td>
                    <td>
                      <span className={`table-step-pill step-${ord.currentStep}`}>
                        Step {ord.currentStep}: {getStepLabel(ord.currentStep).split('. ')[1]}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="btn-action-edit"
                        onClick={() => handleOpenEditModal(ord)}
                      >
                        ✏️ Update Status
                      </button>
                      <button 
                        className="btn-action-delete"
                        onClick={() => handleDeleteOrder(ord.orderId)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content update-modal">
            <div className="modal-header">
              <h3>Update Project Status — Order {selectedOrder.orderId}</h3>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">
              <p className="customer-sub-text">
                Customer: <strong>{selectedOrder.customerName}</strong> ({selectedOrder.phone})
              </p>

              {/* Stage Selector */}
              <div className="form-group">
                <label>Select Current Stage Progress (1 to 4):</label>
                <div className="stage-radio-group">
                  {[1, 2, 3, 4].map((stepNum) => (
                    <label key={stepNum} className={`stage-radio-label ${updateStep === stepNum ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="stageStep"
                        value={stepNum}
                        checked={updateStep === stepNum}
                        onChange={() => setUpdateStep(stepNum)}
                      />
                      <span>{getStepLabel(stepNum)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stage Dates Inputs */}
              <div className="stage-dates-grid">
                <label className="grid-heading">Stage Completion / Estimate Dates:</label>
                
                <div className="form-group">
                  <label>Step 1 Date (Order Confirmed):</label>
                  <input 
                    type="text" 
                    placeholder="YYYY-MM-DD"
                    value={stageDates[1]}
                    onChange={(e) => setStageDates({...stageDates, 1: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Step 2 Date (Design & Material):</label>
                  <input 
                    type="text" 
                    placeholder="YYYY-MM-DD"
                    value={stageDates[2]}
                    onChange={(e) => setStageDates({...stageDates, 2: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Step 3 Date (Carpentry Production):</label>
                  <input 
                    type="text" 
                    placeholder="YYYY-MM-DD"
                    value={stageDates[3]}
                    onChange={(e) => setStageDates({...stageDates, 3: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Step 4 Date (Site Delivery):</label>
                  <input 
                    type="text" 
                    placeholder="YYYY-MM-DD"
                    value={stageDates[4]}
                    onChange={(e) => setStageDates({...stageDates, 4: e.target.value})}
                  />
                </div>
              </div>

              {/* Notes & Date */}
              <div className="form-group">
                <label>Expected Completion Date:</label>
                <input 
                  type="text" 
                  value={updateExpectedDate}
                  onChange={(e) => setUpdateExpectedDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div className="form-group">
                <label>Project Notes / Status Highlights:</label>
                <textarea 
                  rows="3"
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Add notes for the customer..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedOrder(null)}>Cancel</button>
              <button className="btn-save-update" onClick={handleSaveStatusUpdate}>
                💾 Save Status Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderManagement;
