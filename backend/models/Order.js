const mongoose = require('mongoose');

// Schema for individual timeline steps
const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['completed', 'active', 'pending'], default: 'pending' },
  date: { type: String, default: '' },
  description: { type: String, default: '' }
});

// Main Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    trim: true 
  },
  customerName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    required: true, 
    trim: true 
  },
  projectType: { 
    type: String, 
    required: true, 
    default: 'Full Interior'
  },
  currentStep: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 4, 
    default: 1 
  },
  steps: [stepSchema],
  notes: { 
    type: String, 
    default: '' 
  },
  expectedCompletionDate: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Order', orderSchema);
