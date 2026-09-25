import React, { useState } from 'react';
import { Search, MapPin, Phone, MessageSquare, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function ConfirmedOrders({ enquiries }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);

  // Filter only confirmed enquiries
  const confirmedOrders = enquiries.filter(e => e.status === 'CONFIRMED' && (
    e.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (e.ocNumber && e.ocNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  const toggleRow = (id) => { setExpandedRowId(expandedRowId === id ? null : id); };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Confirmed Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Manage all your successfully confirmed orders and view their Order Confirmation (OC) Numbers.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name or OC No..." 
              className="form-control search-box"
              style={{ paddingLeft: '2.25rem', width: '220px', borderRadius: '999px', fontSize: '0.85rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Confirmed Quote</th>
              <th>OC Number</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {confirmedOrders.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No confirmed orders found. Confirm a quote in the Followups tab to see it here!
                </td>
              </tr>
            ) : (
              confirmedOrders.map((order) => {
                const confirmedQuote = order.quotes?.find(q => q.id === order.confirmedQuoteId);
                
                return (
                  <React.Fragment key={order.id}>
                    <tr className={`table-row ${expandedRowId === order.id ? 'expanded' : ''}`} onClick={() => toggleRow(order.id)} style={{ cursor: 'pointer' }}>
                      <td className="td-name">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {order.customerName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={11} /> {order.phone}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{order.contactPerson}</td>
                      <td>
                        {confirmedQuote ? (
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                              {confirmedQuote.title}
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              ₹ {confirmedQuote.amount.toLocaleString('en-IN')}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText size={14} color="var(--primary)" />
                          <span style={{ fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.02em' }}>
                            {order.ocNumber || 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="expand-btn" style={{ marginLeft: '0.25rem', padding: '0.35rem' }}>
                          {expandedRowId === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {expandedRowId === order.id && (
                      <tr>
                        <td colSpan="5" style={{ padding: 0 }}>
                          <div className="expanded-content">
                            <div className="detail-grid" style={{ gridTemplateColumns: '1fr' }}>
                              <div>
                                <div className="detail-section-title">Order Details</div>
                                <div className="info-row">
                                  <MapPin className="info-icon" size={15} />
                                  <span>{order.address}</span>
                                </div>
                                <div className="info-row">
                                  <MessageSquare className="info-icon" size={15} />
                                  <span>{order.remarks}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
