import React, { useState } from 'react';
import { 
  PhoneCall, 
  Search, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Phone, 
  X, 
  User, 
  Edit2,
  Check,
  RotateCcw,
  Paperclip,
  FileText,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';

export const initialCallRequests = [
  {
    id: 'RFC-101',
    customerName: 'TechCorp Solutions',
    contactName: 'Sarah Jenkins',
    contactNumber: '+1 (555) 123-4567',
    query: 'Need guidance regarding 1000 LPH RO machine installation and electrical wiring.',
    attachments: [
      { name: 'panel_wiring_diagram.png', type: 'IMAGE', size: '240 KB' }
    ],
    status: 'Pending',
    createdAt: '25 Sep 2026, 11:30 AM'
  },
  {
    id: 'RFC-102',
    customerName: 'Global Industries',
    contactName: 'Mike Ross',
    contactNumber: '+1 (555) 987-6543',
    query: 'Water softener multiport valve regeneration query - hardness reading is high after recharge.',
    attachments: [
      { name: 'valve_pressure_gauge.jpg', type: 'IMAGE', size: '1.2 MB' },
      { name: 'water_test_report.pdf', type: 'FILE', size: '450 KB' }
    ],
    status: 'Pending',
    createdAt: '25 Sep 2026, 09:15 AM'
  },
  {
    id: 'RFC-103',
    customerName: 'Sri Lakshmi Industries',
    contactName: 'Kishore Kumar',
    contactNumber: '+91 98451 22340',
    query: 'Requesting clarification on daily maintenance log sheet and membrane replacement interval.',
    attachments: [],
    status: 'Resolved',
    createdAt: '24 Sep 2026, 03:45 PM'
  }
];

const CURRENT_USER = {
  name: 'John Doe',
  role: 'Sales Executive',
  phone: '+91 98451 22340',
  avatar: 'JD'
};

export default function ReqForCallDashboard({ 
  enquiries = [], 
  requests: propRequests, 
  setRequests: propSetRequests 
}) {
  const [localRequests, setLocalRequests] = useState(initialCallRequests);
  const requests = propRequests !== undefined ? propRequests : localRequests;
  const setRequests = propSetRequests !== undefined ? propSetRequests : setLocalRequests;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedViewAttachments, setSelectedViewAttachments] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Form State: Query and Attachments only (Date is auto-fetched for today)
  const [formData, setFormData] = useState({
    query: '',
    attachments: []
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      query: '',
      attachments: []
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (req) => {
    setEditingId(req.id);
    setFormData({
      query: req.query || '',
      attachments: req.attachments ? [...req.attachments] : []
    });
    setIsModalOpen(true);
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const isImg = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const newAttachment = {
          name: file.name,
          size: file.size ? `${(file.size / 1024).toFixed(0)} KB` : 'Unknown size',
          type: isImg ? 'IMAGE' : 'FILE',
          dataUrl: uploadEvent.target.result
        };
        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), newAttachment]
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Remove Attachment
  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Submit Handler (Create or Edit)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.query.trim()) return;

    const todayDate = new Date();
    const formattedDate = todayDate.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });

    if (editingId) {
      // Update existing record
      setRequests(requests.map(r => r.id === editingId ? {
        ...r,
        query: formData.query.trim(),
        attachments: formData.attachments || []
      } : r));

      setIsModalOpen(false);
      setSuccessToast(`Request #${editingId} updated successfully.`);
    } else {
      // Create new record with auto ID, auto date, status = "Pending", and auto-fetched user & phone
      const newId = `RFC-${String(requests.length + 101).padStart(3, '0')}`;

      const newRequest = {
        id: newId,
        customerName: CURRENT_USER.name,
        contactName: CURRENT_USER.name,
        contactNumber: CURRENT_USER.phone,
        userRole: CURRENT_USER.role,
        query: formData.query.trim(),
        attachments: formData.attachments || [],
        status: 'Pending',
        createdAt: formattedDate
      };

      setRequests([newRequest, ...requests]);
      setIsModalOpen(false);
      setSuccessToast(`Request #${newId} created successfully! Status is Pending.`);
    }

    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  // Toggle Status: Pending <-> Resolved
  const toggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Resolved' : 'Pending';
    setRequests(requests.map(r => r.id === id ? { ...r, status: nextStatus } : r));
    setSuccessToast(`Request #${id} marked as ${nextStatus}.`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2500);
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesSearch = 
      (req.customerName && req.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.contactName && req.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.contactNumber && req.contactNumber.includes(searchTerm)) ||
      (req.id && req.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (req.query && req.query.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Counts
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const resolvedCount = requests.filter(r => r.status === 'Resolved').length;

  return (
    <div style={{ maxWidth: '1100px' }}>
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

      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Requests</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>{totalCount}</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem', boxShadow: 'var(--shadow-card)', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending Calls</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#B45309', marginTop: '0.15rem' }}>{pendingCount}</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem', boxShadow: 'var(--shadow-card)', borderLeft: '4px solid #10B981' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Resolved</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#047857', marginTop: '0.15rem' }}>{resolvedCount}</div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search request, user, phone..."
              className="form-control search-box"
              style={{ paddingLeft: '2.4rem', borderRadius: '999px', fontSize: '0.82rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter chips */}
          <div className="filter-chips-wrapper" style={{ margin: 0, padding: 0 }}>
            {['All', 'Pending', 'Resolved'].map(st => (
              <button
                key={st}
                className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-small" onClick={handleOpenCreate}>
          <PlusCircle size={15} /> Request a Call
        </button>
      </div>

      {/* Requests Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '85px', padding: '0.75rem 1rem' }}>Req ID</th>
              <th style={{ minWidth: '170px', padding: '0.75rem 1rem' }}>Requested By</th>
              <th style={{ minWidth: '220px', maxWidth: '320px', padding: '0.75rem 1rem' }}>Query</th>
              <th style={{ width: '130px', padding: '0.75rem 1rem' }}>Attachments</th>
              <th style={{ width: '140px', padding: '0.75rem 1rem' }}>Status & Date</th>
              <th style={{ textAlign: 'right', width: '140px', padding: '0.75rem 1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  <PhoneCall size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>No Call Requests Found</div>
                  <div style={{ fontSize: '0.8rem' }}>Click "Request a Call" above to submit a new callback inquiry.</div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req.id} className="table-row">
                  {/* Request ID */}
                  <td style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '0.85rem', whiteSpace: 'nowrap', padding: '0.75rem 1rem' }}>
                    #{req.id}
                  </td>

                  {/* Requested By (Name + Auto-fetched Phone) */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.86rem' }}>
                      <User size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span>{req.contactName || req.customerName || CURRENT_USER.name}</span>
                    </div>
                    {(req.contactNumber || CURRENT_USER.phone) && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <Phone size={11} style={{ opacity: 0.7 }} />
                        <span>{req.contactNumber || CURRENT_USER.phone}</span>
                      </div>
                    )}
                  </td>

                  {/* Query */}
                  <td style={{ maxWidth: '320px', padding: '0.75rem 1rem' }}>
                    <div 
                      style={{ 
                        fontSize: '0.82rem', 
                        color: 'var(--text-secondary)', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        lineHeight: 1.4
                      }}
                      title={req.query}
                    >
                      {req.query}
                    </div>
                  </td>

                  {/* Attachments Column */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {req.attachments && req.attachments.length > 0 ? (
                      <button 
                        type="button"
                        className="btn btn-secondary btn-small"
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          padding: '0.25rem 0.55rem', 
                          fontSize: '0.75rem', 
                          borderRadius: '4px',
                          background: 'var(--bg-surface-alt)'
                        }}
                        onClick={() => setSelectedViewAttachments(req)}
                        title="View attachments"
                      >
                        <Paperclip size={12} color="var(--accent-color)" />
                        <span>{req.attachments.length} {req.attachments.length === 1 ? 'file' : 'files'}</span>
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>
                    )}
                  </td>

                  {/* Status & Date */}
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div>
                      {req.status === 'Pending' ? (
                        <span className="badge-status-pending" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                          <Clock size={11} /> Pending
                        </span>
                      ) : (
                        <span className="badge-status-resolved" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                          <CheckCircle2 size={11} /> Resolved
                        </span>
                      )}
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', whiteSpace: 'nowrap' }}>
                        {req.createdAt}
                      </div>
                    </div>
                  </td>

                  {/* Actions: Edit & Status Toggle (No Call Button) */}
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap', padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {/* Edit Button */}
                      <button 
                        type="button"
                        className="btn btn-secondary btn-small"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => handleOpenEdit(req)}
                        title="Edit details"
                      >
                        <Edit2 size={12} /> Edit
                      </button>

                      {/* Status Toggle Action */}
                      {req.status === 'Pending' ? (
                        <button 
                          type="button"
                          className="btn btn-small"
                          style={{ background: 'var(--success)', color: '#FFFFFF', border: 'none', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => toggleStatus(req.id, 'Pending')}
                          title="Mark call as resolved"
                        >
                          <Check size={12} /> Resolve
                        </button>
                      ) : (
                        <button 
                          type="button"
                          className="btn btn-secondary btn-small"
                          style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', opacity: 0.85 }}
                          onClick={() => toggleStatus(req.id, 'Resolved')}
                          title="Reopen as pending"
                        >
                          <RotateCcw size={11} /> Reopen
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* REQUEST A CALL / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)} style={{ zIndex: 1200 }}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId ? `Edit Request #${editingId}` : 'Request a Call'}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', padding: '1.25rem' }}>
                
                {/* Requester Info Card (Clean - no "auto-fetched" text) */}
                <div style={{ 
                  background: 'var(--bg-surface-alt)', 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border-color)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ 
                      width: '34px', 
                      height: '34px', 
                      borderRadius: '50%', 
                      background: 'var(--accent-color)', 
                      color: '#FFFFFF', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '0.8rem', 
                      flexShrink: 0 
                    }}>
                      {CURRENT_USER.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {CURRENT_USER.name} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.78rem' }}>({CURRENT_USER.role})</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                        <Phone size={11} style={{ color: 'var(--accent-color)' }} />
                        <span>{CURRENT_USER.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Date</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                {/* 1. Query Field */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Describe the Query / Issue <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <textarea
                    required
                    className="form-control"
                    rows={4}
                    placeholder="Enter what you need technical assistance with..."
                    value={formData.query}
                    onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                  />
                </div>

                {/* 2. Attachments Section */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>
                      Attachments
                    </label>
                    <label 
                      className="btn btn-secondary btn-small"
                      style={{ cursor: 'pointer', margin: 0, padding: '0.25rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Paperclip size={12} /> Add Files / Photos
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*,.pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {formData.attachments && formData.attachments.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {formData.attachments.map((file, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: 'var(--bg-surface-alt)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.3rem 0.55rem',
                            fontSize: '0.76rem'
                          }}
                        >
                          {file.type === 'IMAGE' && file.dataUrl ? (
                            <img src={file.dataUrl} alt={file.name} style={{ width: '20px', height: '20px', borderRadius: '3px', objectFit: 'cover' }} />
                          ) : (
                            <Paperclip size={12} color="var(--accent-color)" />
                          )}
                          <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                            {file.name}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveAttachment(idx)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center' }}
                            title="Remove"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Save Changes' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ATTACHMENTS MODAL */}
      {selectedViewAttachments && (
        <div className="modal-overlay" onClick={() => setSelectedViewAttachments(null)} style={{ zIndex: 1300 }}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Paperclip size={16} color="var(--accent-color)" />
                <span>Attachments (#{selectedViewAttachments.id})</span>
              </h2>
              <button className="close-btn" onClick={() => setSelectedViewAttachments(null)}><X size={20} /></button>
            </div>

            <div className="modal-body" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {selectedViewAttachments.attachments?.map((att, i) => (
                  <div 
                    key={i} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.8rem',
                      background: 'var(--bg-surface-alt)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
                      {att.type === 'IMAGE' ? (
                        att.dataUrl ? (
                          <img src={att.dataUrl} alt={att.name} style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                        ) : (
                          <ImageIcon size={18} color="var(--accent-color)" />
                        )
                      ) : (
                        <FileText size={18} color="var(--accent-color)" />
                      )}
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {att.name}
                        </div>
                        {att.size && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{att.size}</div>
                        )}
                      </div>
                    </div>

                    {att.dataUrl && (
                      <a 
                        href={att.dataUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-secondary btn-small"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', textDecoration: 'none' }}
                      >
                        <ExternalLink size={11} /> View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedViewAttachments(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
