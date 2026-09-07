import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpCenter.css';

const helpTopics = [
  {
    id: 'getting-started',
    icon: '🏠',
    title: 'Getting Started',
    shortDesc: 'Learn how to start your interior project, book a consultation, and share your requirements with our design team.',
    details: [
      { q: 'How do I book a design consultation?', a: 'You can book a consultation directly by calling +91 6379183549 or clicking "Chat on WhatsApp". Our senior interior designer will connect with you within 30 minutes.' },
      { q: 'What should I bring to the first meeting?', a: 'Floor plans, dimensional sketches, inspirational photos, and your budget preferences help us accelerate your 2D/3D design briefing.' },
      { q: 'Do you provide on-site home visits?', a: 'Yes! Our site engineers visit your home for precise 3D laser measurement and space evaluation before finalizing your project plan.' }
    ]
  },
  {
    id: 'design-planning',
    icon: '🎨',
    title: 'Design & Planning',
    shortDesc: 'Explore our design process, 2D/3D visualization, colour selection, space planning, and customization options.',
    details: [
      { q: 'How does 3D visualization work?', a: 'Our designers render ultra-realistic 3D walkthrough models of your living room, kitchen, or bedroom so you can preview materials and lighting before production.' },
      { q: 'Can I customize wood finishes and color themes?', a: 'Absolutely! We offer over 500+ laminate, veneer, acrylic, and PU matte/gloss color finishes tailored to your interior layout.' },
      { q: 'How many design revisions are included?', a: 'We provide unlimited 2D layout revisions and up to 3 complimentary 3D photorealistic render revisions.' }
    ]
  },
  {
    id: 'pricing-budget',
    icon: '💰',
    title: 'Pricing & Budget',
    shortDesc: 'Find information about project costs, quotations, packages, payment options, and budget planning.',
    details: [
      { q: 'How are interior project costs calculated?', a: 'Pricing depends on square footage, selected materials (BWP Plywood, HDMR, Acrylic), hardware fittings (Hettich, Blum), and scope of work.' },
      { q: 'What are the available payment options?', a: 'We accept Online UPI, Credit/Debit Cards, Net Banking, Flexible EMI options, and Cash on Delivery / Milestone Payments.' },
      { q: 'Are there any hidden costs after quotation?', a: 'Zero hidden charges! Our itemized quotations are transparent and fixed upon design sign-off.' }
    ]
  },
  {
    id: 'project-execution',
    icon: '🛠️',
    title: 'Project Execution',
    shortDesc: 'Understand how we manage your project from design approval to on-site execution and final handover.',
    details: [
      { q: 'How is on-site execution managed?', a: 'Factory-made modular panels are transported to your site for dust-free, noise-controlled assembly handled by certified master carpenters.' },
      { q: 'How do I track my order progress?', a: 'You can check real-time progress updates on our "Update Order" portal anytime using your phone number or Order ID.' },
      { q: 'What happens during final handover?', a: 'Our quality audit team performs a 45-point inspection before cleaning the space and handing over keys with warranty cards.' }
    ]
  },
  {
    id: 'materials-quality',
    icon: '📦',
    title: 'Materials & Quality',
    shortDesc: 'Learn about the materials we use, quality standards, customization options, and warranty support.',
    details: [
      { q: 'What materials do you use for modular kitchens & wardrobes?', a: 'We use Boiling Water Proof (BWP) Marine Plywood grade 710, High-Density Moisture Resistant (HDMR) boards, and German anti-scratch laminates.' },
      { q: 'What warranty do you provide?', a: 'We provide a 10-Year Flat Warranty on all factory-crafted woodwork and hardware fittings.' },
      { q: 'Are your materials termite and water resistant?', a: 'Yes! All core materials undergo anti-termite treatment and 100% water-resistant sealing.' }
    ]
  },
  {
    id: 'project-timeline',
    icon: '📅',
    title: 'Project Timeline',
    shortDesc: 'Get answers about project duration, start dates, progress updates, and expected completion.',
    details: [
      { q: 'How long does a full home interior project take?', a: 'Standard projects are completed within 35 to 45 business days from design sign-off.' },
      { q: 'When does the timeline countdown start?', a: 'The timeline begins on the day 3D designs are finalized and site measurements are confirmed.' },
      { q: 'What if there is a delivery delay?', a: 'We offer an On-Time Delivery Guarantee with penalty compensation if delivery exceeds guaranteed dates.' }
    ]
  },
  {
    id: 'our-services',
    icon: '🛋️',
    title: 'Our Services',
    shortDesc: 'Explore our interior services including living rooms, bedrooms, modular kitchens, wardrobes, false ceilings, and more.',
    details: [
      { q: 'What interior services do you offer?', a: 'We offer end-to-end solutions: Modular Kitchens, Bedroom Cupboards, Walk-in Wardrobes, TV Units, Pooja Mandapams, False Ceilings, Wooden Doors & Custom Furniture.' },
      { q: 'Do you handle electrical and plumbing work?', a: 'Yes! We provide complete electrical, plumbing, wall painting, wallpapers, and LED accent lighting installation.' }
    ]
  },
  {
    id: 'contact-support',
    icon: '📞',
    title: 'Contact & Support',
    shortDesc: 'Need assistance? Contact our team for consultations, site visits, project enquiries, and customer support.',
    details: [
      { q: 'How can I contact customer support?', a: 'Call us at +91 6379183549, email support@luxeinteriors.com, or tap "Chat on WhatsApp" for instant assistance.' },
      { q: 'What are your working hours?', a: 'Our design center and phone support operate Monday through Sunday from 9:00 AM to 9:00 PM.' }
    ]
  }
];

const HelpCenter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState(null);

  const filteredTopics = helpTopics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.details.some(d => d.q.toLowerCase().includes(searchQuery.toLowerCase()) || d.a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleWhatsAppChat = (topicTitle) => {
    const text = encodeURIComponent(`Hello Luxe Interiors Team, I need assistance regarding "${topicTitle || 'Help Center Inquiry'}". Please connect me with an interior specialist.`);
    window.open(`https://wa.me/916379183549?text=${text}`, '_blank');
  };

  return (
    <div className="help-center-page">
      {/* Hero Header */}
      <section className="help-hero">
        <div className="help-hero-content">
          <span className="help-badge">LUXE ASSIST & GUIDE</span>
          <h1 className="help-hero-title">HELP CENTER</h1>
          <p className="help-hero-subtitle">
            Everything you need to know about your interior design journey.
          </p>

          {/* Search Box */}
          <div className="help-search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="help-search-input"
              placeholder="Search topics, pricing, materials, timelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>
      </section>

      {/* Popular Topics Grid */}
      <section className="help-topics-section">
        <div className="help-container">
          <div className="section-header">
            <h2 className="section-title">Popular Topics</h2>
            <p className="section-subtitle">Select a category below to explore details, processes, and FAQs</p>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="no-search-results">
              <p>No help topics found matching "{searchQuery}"</p>
              <button className="reset-btn" onClick={() => setSearchQuery('')}>Show All Topics</button>
            </div>
          ) : (
            <div className="topics-grid">
              {filteredTopics.map((topic) => (
                <div 
                  key={topic.id} 
                  className={`topic-card ${activeTopic?.id === topic.id ? 'active' : ''}`}
                  onClick={() => setActiveTopic(activeTopic?.id === topic.id ? null : topic)}
                >
                  <div className="topic-card-header">
                    <span className="topic-icon">{topic.icon}</span>
                    <h3 className="topic-title">{topic.title}</h3>
                  </div>
                  <p className="topic-desc">{topic.shortDesc}</p>
                  
                  <div className="topic-action-bar">
                    <span className="explore-text">
                      {activeTopic?.id === topic.id ? 'Hide Details ▲' : 'Explore Topics & FAQs ▼'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Active Topic Details Drawer / Modal */}
      {activeTopic && (
        <section className="topic-detail-drawer">
          <div className="help-container">
            <div className="detail-drawer-box">
              <div className="drawer-header">
                <div className="drawer-title-group">
                  <span className="drawer-icon">{activeTopic.icon}</span>
                  <div>
                    <h3 className="drawer-title">{activeTopic.title}</h3>
                    <p className="drawer-sub">{activeTopic.shortDesc}</p>
                  </div>
                </div>
                <button className="close-drawer-btn" onClick={() => setActiveTopic(null)}>✕ Close</button>
              </div>

              <div className="faq-list">
                <h4 className="faq-heading">Frequently Asked Questions</h4>
                {activeTopic.details.map((item, idx) => (
                  <div key={idx} className="faq-item">
                    <h5 className="faq-q">Q: {item.q}</h5>
                    <p className="faq-a">{item.a}</p>
                  </div>
                ))}
              </div>

              <div className="drawer-cta-row">
                <button 
                  className="whatsapp-cta-btn"
                  onClick={() => handleWhatsAppChat(activeTopic.title)}
                >
                  💬 Chat on WhatsApp (+91 6379183549)
                </button>
                <button 
                  className="track-cta-btn"
                  onClick={() => navigate('/track')}
                >
                  📦 Update & Track Order Status
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer Support Banner */}
      <section className="help-footer-banner">
        <div className="help-container">
          <div className="footer-banner-box">
            <div className="banner-text">
              <h3>Still Have Questions About Your Interior Journey?</h3>
              <p>Our senior interior design specialists and project managers are available 7 days a week to guide you.</p>
            </div>
            <div className="banner-buttons">
              <button 
                className="banner-wa-btn"
                onClick={() => handleWhatsAppChat('General Assistance')}
              >
                💬 Chat on WhatsApp
              </button>
              <a href="tel:+916379183549" className="banner-call-btn">
                📞 Call Us: +91 6379183549
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
