import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  CreditCard, 
  List,
  FileText,
  Eye,
  Download,
  Printer,
  CheckCircle2,
  X,
  Building2,
  Calendar,
  Check,
  RotateCcw
} from 'lucide-react';

const CATALOG = {
  'Pumps': [
    { id: 'p1', name: 'High Pressure RO Pump', price: 450, stock: 12, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=Pump+2HP', specs: ['Power: 2HP', 'Flow Rate: 1000 LPH', 'Material: SS304'] },
    { id: 'p2', name: 'Raw Water Feed Pump', price: 320, stock: 8, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=Feed+Pump', specs: ['Power: 1HP', 'Flow Rate: 500 LPH', 'Material: Cast Iron'] },
    { id: 'p3', name: 'Chemical Dosing Pump', price: 150, stock: 25, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=Dosing+Pump', specs: ['Capacity: 0-5 LPH', 'Pressure: 5 Bar', 'Type: Diaphragm'] },
  ],
  'Valves': [
    { id: 'v1', name: 'Multiport Valve (Top Mount)', price: 85, stock: 40, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=MPV', specs: ['Size: 1.5 Inch', 'Type: Top Mount', 'Max Pressure: 4 Bar'] },
    { id: 'v2', name: 'Solenoid Valve 1/2"', price: 45, stock: 60, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=Solenoid', specs: ['Size: 1/2 Inch', 'Voltage: 230V AC', 'Material: Brass'] },
    { id: 'v3', name: 'Butterfly Valve 2"', price: 120, stock: 15, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=Butterfly', specs: ['Size: 2 Inch', 'Operation: Lever', 'Seal: EPDM'] },
  ],
  'Blowers': [
    { id: 'b1', name: 'Twin Lobe Air Blower', price: 850, stock: 5, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=Twin+Lobe', specs: ['Power: 3HP', 'Air Flow: 150 CFM', 'Pressure: 0.4 Kg/cm2'] },
    { id: 'b2', name: 'Side Channel Blower', price: 420, stock: 10, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=Ring+Blower', specs: ['Power: 1.5HP', 'Stage: Single', 'Vacuum: -210 mbar'] },
  ],
  'Tanks': [
    { id: 't1', name: 'FRP Vessel 13x54', price: 210, stock: 18, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=FRP+13x54', specs: ['Dimensions: 13" x 54"', 'Volume: 105 Liters', 'Max Pressure: 150 psi'] },
    { id: 't2', name: 'FRP Vessel 14x65', price: 280, stock: 12, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=FRP+14x65', specs: ['Dimensions: 14" x 65"', 'Volume: 140 Liters', 'Max Pressure: 150 psi'] },
    { id: 't3', name: 'Brine Tank 100L', price: 95, stock: 30, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=Brine+Tank', specs: ['Capacity: 100 Liters', 'Material: HDPE', 'Includes: Brine Valve'] },
  ],
  'Structure': [
    { id: 's1', name: 'SS 304 Skid Frame', price: 600, stock: 4, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=SS+Skid', specs: ['Material: SS 304', 'Finish: Polished', 'Type: Standard RO'] },
    { id: 's2', name: 'MS Epoxy Coated Frame', price: 350, stock: 7, image: 'https://placehold.co/200x200/e2e8f0/64748b?text=MS+Skid', specs: ['Material: Mild Steel', 'Coating: Epoxy Powder', 'Type: Heavy Duty'] },
  ]
};

const DEFAULT_ORDERS = [
  {
    id: 'ORD-5481',
    poNumber: 'PO-2026-8812',
    siteName: 'TechCorp Solutions',
    ocNumber: 'OC-2026-1001',
    date: '2026-09-22',
    items: [
      { id: 'p1', name: 'High Pressure RO Pump', price: 450, quantity: 1, specs: ['Power: 2HP', 'Flow Rate: 1000 LPH'] },
      { id: 'v1', name: 'Multiport Valve (Top Mount)', price: 85, quantity: 2, specs: ['Size: 1.5 Inch', 'Type: Top Mount'] }
    ],
    subtotal: 620,
    tax: 111.6,
    total: 731.6,
    status: 'APPROVED',
    customerDetails: {
      name: 'TechCorp Solutions',
      phone: '+1 (555) 123-4567',
      address: '123 Business Park, Silicon Valley, CA',
      ocNumber: 'OC-2026-1001'
    }
  },
  {
    id: 'ORD-7294',
    poNumber: 'PO-2026-9430',
    siteName: 'Global Industries',
    ocNumber: 'OC-2026-1002',
    date: '2026-09-25',
    items: [
      { id: 't1', name: 'FRP Vessel 13x54', price: 210, quantity: 2, specs: ['Dimensions: 13" x 54"', 'Volume: 105 Liters'] },
      { id: 't3', name: 'Brine Tank 100L', price: 95, quantity: 1, specs: ['Capacity: 100 Liters', 'Material: HDPE'] }
    ],
    subtotal: 515,
    tax: 92.7,
    total: 607.7,
    status: 'PENDING',
    customerDetails: {
      name: 'Global Industries',
      phone: '+1 (555) 987-6543',
      address: '456 Industrial Way, New York, NY',
      ocNumber: 'OC-2026-1002'
    }
  }
];

export default function EcommerceDashboard({ enquiries = [], setEnquiries }) {
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [activeTab, setActiveTab] = useState('store');
  const [expandedCategory, setExpandedCategory] = useState('Pumps');
  const [cart, setCart] = useState({}); // { itemId: quantity }
  const [selectedPoOrder, setSelectedPoOrder] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  
  const confirmedSites = enquiries.filter(e => e.status === 'CONFIRMED');
  const selectedSite = confirmedSites.find(s => s.id.toString() === selectedSiteId);

  const handleAddToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
  };

  const handleUpdateQuantity = (itemId, delta) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedSite) return alert('Please select a site/customer first.');
    if (Object.keys(cart).length === 0) return alert('Cart is empty.');

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderDate = new Date().toISOString().split('T')[0];

    const orderItems = Object.entries(cart).map(([itemId, qty]) => {
      let foundItem = null;
      for (const cat in CATALOG) {
        const item = CATALOG[cat].find(i => i.id === itemId);
        if (item) foundItem = item;
      }
      return { ...foundItem, quantity: qty };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const newOrder = {
      id: orderId,
      poNumber: poNumber,
      date: orderDate,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: 'PENDING',
      siteId: selectedSite.id,
      siteName: selectedSite.customerName,
      ocNumber: selectedSite.ocNumber || 'N/A',
      customerDetails: {
        name: selectedSite.customerName,
        phone: selectedSite.phone || '+91 98451 22340',
        address: selectedSite.address || 'Industrial Area, Phase 1',
        ocNumber: selectedSite.ocNumber || 'N/A'
      }
    };

    setEnquiries(enquiries.map(enq => {
      if (enq.id.toString() === selectedSiteId) {
        const currentData = enq.siteData || {};
        return {
          ...enq,
          siteData: {
            ...currentData,
            ecommerceOrders: [newOrder, ...(currentData.ecommerceOrders || [])]
          }
        };
      }
      return enq;
    }));

    setCart({});
    setSelectedPoOrder(newOrder);
    setSuccessToast(`Purchase Order #${poNumber} generated successfully!`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleUpdateOrderStatus = (siteId, orderId, newStatus) => {
    setEnquiries(enquiries.map(enq => {
      if (enq.id.toString() === siteId.toString()) {
        const orders = (enq.siteData?.ecommerceOrders || []).map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        );
        return {
          ...enq,
          siteData: {
            ...enq.siteData,
            ecommerceOrders: orders
          }
        };
      }
      return enq;
    }));
  };

  const handleDownloadPo = (order) => {
    const poHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Purchase Order ${order.poNumber || order.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; background: #fff; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
    .title { font-size: 24px; font-weight: 800; color: #2563eb; margin: 0; }
    .badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 99px; font-size: 13px; font-weight: 700; display: inline-block; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .card h4 { margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f1f5f9; padding: 10px 14px; text-align: left; font-size: 13px; border-bottom: 2px solid #cbd5e1; font-weight: 700; }
    td { padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .totals { margin-left: auto; width: 300px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .totals-total { border-top: 2px solid #2563eb; font-weight: 800; font-size: 17px; color: #2563eb; padding-top: 10px; margin-top: 6px; }
    .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">PURCHASE ORDER</h1>
      <div style="font-weight: 700; color: #334155; margin-top: 4px;">XPREDICT AUTOMATION SOLUTIONS PVT LTD</div>
      <div style="font-size: 13px; color: #64748b;">Spare Parts & Equipment Catalog Division</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 20px; font-weight: 800; color: #0f172a;">${order.poNumber || `PO-2026-${order.id}`}</div>
      <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Order Ref: ${order.id}</div>
      <div style="font-size: 13px; color: #64748b;">Date: ${order.date}</div>
      <div style="margin-top: 8px;"><span class="badge">${order.status}</span></div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h4>Bill / Ship To (Site Customer)</h4>
      <div style="font-weight: 700; font-size: 15px;">${order.siteName || order.customerDetails?.name || 'Customer Site'}</div>
      <div style="font-size: 13px; color: #475569; margin-top: 4px;">Address: ${order.customerDetails?.address || 'Site Delivery Location'}</div>
      <div style="font-size: 13px; color: #475569;">Contact: ${order.customerDetails?.phone || '+91 98451 22340'}</div>
      <div style="font-size: 13px; color: #475569;">OC Reference: ${order.ocNumber || 'N/A'}</div>
    </div>
    <div class="card">
      <h4>Supplier / Vendor</h4>
      <div style="font-weight: 700; font-size: 15px;">XPREDICT AUTOMATION SOLUTIONS</div>
      <div style="font-size: 13px; color: #475569; margin-top: 4px;">Industrial Water & Wastewater Treatment</div>
      <div style="font-size: 13px; color: #475569;">Email: procurement@xpredict.com</div>
      <div style="font-size: 13px; color: #475569;">Phone: +91 80 4123 4567</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>Item Description</th>
        <th style="text-align: center; width: 80px;">Qty</th>
        <th style="text-align: right; width: 120px;">Unit Price</th>
        <th style="text-align: right; width: 120px;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <div style="font-weight: 600;">${item.name}</div>
            ${item.specs ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">${item.specs.join(' • ')}</div>` : ''}
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">$${Number(item.price).toFixed(2)}</td>
          <td style="text-align: right; font-weight: 600;">$${(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>$${(order.subtotal || order.total / 1.18 || order.total).toFixed(2)}</span>
    </div>
    <div class="totals-row">
      <span>Taxes & GST (18%):</span>
      <span>$${(order.tax || order.total * 0.18 / 1.18 || 0).toFixed(2)}</span>
    </div>
    <div class="totals-row totals-total">
      <span>Grand Total:</span>
      <span>$${Number(order.total).toFixed(2)}</span>
    </div>
  </div>

  <div class="footer">
    <div>This is an official Purchase Order generated via XPREDICT Automated Procurement System.</div>
    <div style="margin-top: 4px;">Generated on: ${new Date().toLocaleString()}</div>
  </div>
</body>
</html>`;

    const blob = new Blob([poHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Purchase_Order_${order.poNumber || order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const cartItems = Object.entries(cart).map(([itemId, qty]) => {
    let foundItem = null;
    for (const cat in CATALOG) {
      const item = CATALOG[cat].find(i => i.id === itemId);
      if (item) foundItem = item;
    }
    return { ...foundItem, quantity: qty };
  });
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const displaySites = selectedSiteId ? confirmedSites.filter(s => s.id.toString() === selectedSiteId) : confirmedSites;
  
  // Real orders from site data
  const realOrders = displaySites.flatMap(s => (s.siteData?.ecommerceOrders || []).map(o => ({ 
    ...o, 
    poNumber: o.poNumber || `PO-2026-${o.id.replace(/\D/g, '') || '1042'}`,
    siteId: s.id,
    siteName: s.customerName, 
    ocNumber: s.ocNumber,
    customerDetails: {
      name: s.customerName,
      phone: s.phone || '+91 98451 22340',
      address: s.address || 'Industrial Area, Phase 1',
      ocNumber: s.ocNumber || 'N/A'
    }
  })));

  // Fallback sample orders if none exist yet
  const orderHistory = realOrders.length > 0 ? realOrders : (!selectedSiteId ? DEFAULT_ORDERS : []);

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>
      
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--accent-dark)',
          color: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          zIndex: 1500,
          fontSize: '0.88rem',
          fontWeight: 500,
          borderLeft: '4px solid var(--success)'
        }}>
          <CheckCircle2 size={18} color="var(--success)" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Purchase & Spare Parts Store</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Browse the store catalog, place parts orders, and generate or download official Purchase Orders (PO).
          </p>
        </div>
      </div>

      {/* Site Selector Bar */}
      <div className="form-row" style={{ marginBottom: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: 1, maxWidth: '420px' }}>
          <label className="form-label" style={{ fontWeight: 600 }}>Select Site / Customer for Purchase</label>
          <select 
            className="form-control" 
            value={selectedSiteId} 
            onChange={e => setSelectedSiteId(e.target.value)}
          >
            <option value="">-- All Confirmed Sites --</option>
            {confirmedSites.map(s => (
              <option key={s.id} value={s.id}>
                {s.customerName} - OC: {s.ocNumber || 'N/A'} (DC: {s.siteData?.dcNumber || 'N/A'})
              </option>
            ))}
          </select>
        </div>
        {selectedSite && (
          <div style={{ padding: '0.55rem 1rem', background: '#F0FDF4', color: '#16A34A', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', border: '1px solid #BBF7D0' }}>
            Ordering for: {selectedSite.customerName}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button
          onClick={() => setActiveTab('store')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem',
            borderBottom: activeTab === 'store' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'store' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'store' ? 700 : 500, whiteSpace: 'nowrap'
          }}
        >
          <ShoppingCart size={16} /> Store Catalog
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0',
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem',
            borderBottom: activeTab === 'orders' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'orders' ? 700 : 500, whiteSpace: 'nowrap'
          }}
        >
          <List size={16} /> My Orders & POs ({orderHistory.length})
        </button>
      </div>

      {/* STORE CATALOG TAB */}
      {activeTab === 'store' && (
        <div className="form-row" style={{ flex: 1, alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
        
          {/* Accordion Catalog */}
          <div style={{ flex: 2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(CATALOG).map(([category, items]) => (
              <div key={category} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', overflow: 'hidden' }}>
                
                <button 
                  onClick={() => setExpandedCategory(expandedCategory === category ? '' : category)}
                  style={{ 
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1rem', background: expandedCategory === category ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
                    border: 'none', cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Package size={18} color="var(--primary)" />
                    {category}
                  </div>
                  {expandedCategory === category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {expandedCategory === category && (
                  <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', background: '#F8FAFC' }}>
                    {items.map(item => (
                      <div key={item.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'contain', marginBottom: '1rem', background: '#F1F5F9', borderRadius: 'var(--radius-sm)' }} />
                        <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>{item.name}</h4>
                        
                        <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', flex: 1, margin: '0 0 1rem 0' }}>
                          {item.specs.map((spec, i) => <li key={i} style={{ marginBottom: '0.2rem' }}>{spec}</li>)}
                        </ul>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>${item.price.toFixed(2)}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: item.stock > 10 ? '#F0FDF4' : '#FEF2F2', color: item.stock > 10 ? '#16A34A' : '#DC2626' }}>
                            {item.stock > 0 ? `${item.stock} in stock` : 'Out of Stock'}
                          </span>
                        </div>
                        
                        <button 
                          className="btn btn-primary"
                          style={{ width: '100%', padding: '0.6rem' }}
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart size={16} /> Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Shopping Cart Sidebar */}
          <div style={{ flex: 1, minWidth: '300px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', padding: '1.5rem', position: 'sticky', top: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <ShoppingCart size={18} /> Order Cart
            </h3>

            {cartItems.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0', fontSize: '0.88rem' }}>Your cart is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                    <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>${item.price.toFixed(2)} each</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <button className="btn-icon" style={{ padding: '0.2rem', border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleUpdateQuantity(item.id, -1)}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button className="btn-icon" style={{ padding: '0.2rem', border: '1px solid var(--border-color)', background: '#fff', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleUpdateQuantity(item.id, 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <span>Est. Tax (18% GST):</span>
                <span>${(cartTotal * 0.18).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem' }}>
                <span>Total:</span>
                <span>${(cartTotal * 1.18).toFixed(2)}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              disabled={cartItems.length === 0 || !selectedSiteId}
              onClick={handlePlaceOrder}
            >
              <CreditCard size={18} /> Place Order & Generate PO
            </button>
            
            {!selectedSiteId && cartItems.length > 0 && (
              <p style={{ color: '#DC2626', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.6rem', fontWeight: 600 }}>
                * Select a site/customer from the top dropdown to place order
              </p>
            )}
          </div>
        </div>
      )}

      {/* MY ORDERS & POs TAB */}
      {activeTab === 'orders' && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '95px' }}>Order ID</th>
                <th style={{ minWidth: '140px' }}>PO Number</th>
                <th style={{ minWidth: '170px' }}>Site / Customer</th>
                <th style={{ width: '105px' }}>Date</th>
                <th style={{ minWidth: '220px' }}>Items Ordered</th>
                <th style={{ width: '110px' }}>Total</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ textAlign: 'right', minWidth: '180px' }}>Purchase Order (PO)</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    <Package size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>No orders found</div>
                    <div style={{ fontSize: '0.8rem' }}>Go to Store Catalog to place a new order and generate a Purchase Order.</div>
                  </td>
                </tr>
              ) : orderHistory.map(order => (
                <tr key={order.id} className="table-row">
                  {/* Order ID */}
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    {order.id}
                  </td>

                  {/* PO Number */}
                  <td>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.35rem', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px', 
                      background: 'rgba(37, 99, 235, 0.08)', 
                      color: 'var(--accent-color)', 
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      whiteSpace: 'nowrap'
                    }}>
                      <FileText size={12} />
                      <span>{order.poNumber || `PO-2026-${order.id}`}</span>
                    </div>
                  </td>

                  {/* Site / Customer */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.86rem' }}>{order.siteName}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{order.ocNumber}</div>
                  </td>

                  {/* Date */}
                  <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {order.date}
                  </td>

                  {/* Items Ordered */}
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </td>

                  {/* Total */}
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    ${Number(order.total).toFixed(2)}
                  </td>

                  {/* Status */}
                  <td>
                    <span style={{ 
                      padding: '0.2rem 0.55rem', 
                      borderRadius: '99px', 
                      fontSize: '0.74rem', 
                      fontWeight: 700,
                      background: order.status === 'PENDING' ? '#FEF3C7' : (order.status === 'APPROVED' ? '#DBEAFE' : (order.status === 'REJECTED' ? '#FEE2E2' : '#F0FDF4')),
                      color: order.status === 'PENDING' ? '#D97706' : (order.status === 'APPROVED' ? '#2563EB' : (order.status === 'REJECTED' ? '#B91C1C' : '#16A34A')),
                      border: `1px solid ${order.status === 'PENDING' ? '#FDE68A' : (order.status === 'APPROVED' ? '#BFDBFE' : '#BBF7D0')}`
                    }}>
                      {order.status}
                    </span>
                  </td>

                  {/* PO Actions: View PO & Download PO */}
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button 
                        type="button"
                        className="btn btn-secondary btn-small"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                        onClick={() => setSelectedPoOrder(order)}
                        title="View Purchase Order"
                      >
                        <Eye size={12} /> View PO
                      </button>

                      <button 
                        type="button"
                        className="btn btn-secondary btn-small"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                        onClick={() => handleDownloadPo(order)}
                        title="Download Purchase Order Document"
                      >
                        <Download size={12} /> Download PO
                      </button>

                      {order.status === 'PENDING' && (
                        <button 
                          className="btn btn-primary btn-small" 
                          style={{ background: '#16A34A', fontSize: '0.72rem', padding: '0.25rem 0.45rem' }} 
                          onClick={() => handleUpdateOrderStatus(order.siteId || (confirmedSites.find(s => s.customerName === order.siteName) || {}).id, order.id, 'APPROVED')}
                          title="Approve Order"
                        >
                          <Check size={11} /> Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW & PRINT PURCHASE ORDER (PO) MODAL */}
      {selectedPoOrder && (
        <div className="modal-overlay" onClick={() => setSelectedPoOrder(null)} style={{ zIndex: 1300, overflowY: 'auto' }}>
          <div className="modal-content" style={{ maxWidth: '780px', width: '95%', maxHeight: '92vh', overflowY: 'auto', padding: 0 }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Controls Header */}
            <div className="modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-surface)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="var(--accent-color)" />
                  <span>Purchase Order #{selectedPoOrder.poNumber || `PO-2026-${selectedPoOrder.id}`}</span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Order Ref: {selectedPoOrder.id} • Issued on: {selectedPoOrder.date}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-small"
                  onClick={() => handleDownloadPo(selectedPoOrder)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Download size={13} /> Download (.html)
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary btn-small"
                  onClick={() => window.print()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Printer size={13} /> Print / Save PDF
                </button>
                <button 
                  type="button" 
                  className="close-btn"
                  onClick={() => setSelectedPoOrder(null)}
                  style={{ padding: '0.2rem' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="modal-body" style={{ padding: '2rem', background: '#FFFFFF', color: '#1E293B', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Document Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--accent-color)', paddingBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-color)', letterSpacing: '0.02em' }}>
                    XPREDICT AUTOMATION SOLUTIONS
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem', fontWeight: 500 }}>
                    Industrial Water & Wastewater Treatment Equipment & Spares Division
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.15rem' }}>
                    Plot 48, Peenya Industrial Area, Phase II, Bengaluru - 560058
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-block', background: '#DBEAFE', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                    PURCHASE ORDER
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    {selectedPoOrder.poNumber || `PO-2026-${selectedPoOrder.id}`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.15rem' }}>
                    Order ID: <strong>{selectedPoOrder.id}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Date: <strong>{selectedPoOrder.date}</strong>
                  </div>
                </div>
              </div>

              {/* Vendor & Client Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {/* Buyer / Client */}
                <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    BUYER / SITE DETAILS
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                    {selectedPoOrder.siteName || selectedPoOrder.customerDetails?.name || 'Customer'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.3rem', lineHeight: 1.4 }}>
                    {selectedPoOrder.customerDetails?.address || 'Site Delivery Location'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>
                    Contact: {selectedPoOrder.customerDetails?.phone || '+91 98451 22340'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.15rem' }}>
                    OC Reference: <strong>{selectedPoOrder.ocNumber || 'N/A'}</strong>
                  </div>
                </div>

                {/* Supplier */}
                <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    SUPPLIER / VENDOR
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                    Xpredict Automation Solutions Pvt Ltd
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.3rem', lineHeight: 1.4 }}>
                    Central Spares & Component Depot
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>
                    Email: procurement@xpredict.com | Phone: +91 80 4123 4567
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.15rem' }}>
                    GSTIN: <strong>29AAACX1234F1Z8</strong>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                      <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', fontSize: '0.8rem', color: '#475569', width: '40px' }}>#</th>
                      <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', fontSize: '0.8rem', color: '#475569' }}>Description</th>
                      <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontSize: '0.8rem', color: '#475569', width: '70px' }}>Qty</th>
                      <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontSize: '0.8rem', color: '#475569', width: '110px' }}>Unit Price</th>
                      <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontSize: '0.8rem', color: '#475569', width: '120px' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPoOrder.items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: '#64748B' }}>{idx + 1}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0F172A' }}>{item.name}</div>
                          {item.specs && item.specs.length > 0 && (
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem' }}>
                              {item.specs.join(' • ')}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.88rem', fontWeight: 600 }}>{item.quantity}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.88rem' }}>${Number(item.price).toFixed(2)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.88rem', fontWeight: 700 }}>
                          ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Notes */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                <div style={{ maxWidth: '380px', fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Terms & Delivery:</div>
                  <div>1. Delivery within 3-5 business days upon order confirmation.</div>
                  <div>2. All parts covered under standard 1-year manufacturer replacement warranty.</div>
                  <div>3. Prices include freight charges to site location.</div>
                </div>

                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569' }}>
                    <span>Subtotal:</span>
                    <span>${(selectedPoOrder.subtotal || selectedPoOrder.total / 1.18 || selectedPoOrder.total).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#475569' }}>
                    <span>Tax (18% GST):</span>
                    <span>${(selectedPoOrder.tax || selectedPoOrder.total * 0.18 / 1.18 || 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-color)', borderTop: '2px solid var(--accent-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                    <span>Grand Total:</span>
                    <span>${Number(selectedPoOrder.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Sign-off footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed #CBD5E1' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>System Generated Purchase Order</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <CheckCircle2 size={13} /> Digitally Verified & Approved
                  </div>
                </div>
                <div style={{ textAlign: 'center', minWidth: '160px' }}>
                  <div style={{ height: '36px', borderBottom: '1px solid #94A3B8', marginBottom: '0.35rem' }}></div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Authorized Signatory</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Procurement & Accounts</div>
                </div>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="modal-footer" style={{ padding: '0.9rem 1.5rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setSelectedPoOrder(null)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => handleDownloadPo(selectedPoOrder)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={14} /> Download PO
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
