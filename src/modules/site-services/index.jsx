import React, { useState } from 'react';
import { Calendar, FileText, Droplet, AlertTriangle, Plus, Save, ChevronDown, CheckCircle, Paperclip, Phone, User, X, Image as ImageIcon, ExternalLink } from 'lucide-react';
import ServiceReportsTab from './ServiceReportsTab';

export default function SiteServicesDashboard({ enquiries = [], setEnquiries, activeModule, onModuleChange }) {
  const getTabFromModule = (mod) => {
    if (mod === 'site-scheduled') return 'scheduled';
    if (mod === 'site-reports') return 'reports';
    if (mod === 'site-water') return 'water';
    if (mod === 'site-complaints') return 'complaints';
    return 'scheduled';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromModule(activeModule));

  React.useEffect(() => {
    if (activeModule) {
      setActiveTab(getTabFromModule(activeModule));
    }
  }, [activeModule]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onModuleChange) {
      onModuleChange(`site-${tabId}`);
    }
  };

  const confirmedSites = enquiries.filter(e => e.status === 'CONFIRMED');

  const updateSiteData = (enquiryId, dataKey, value) => {
    setEnquiries(enquiries.map(enq => {
      if (enq.id === enquiryId) {
        const currentSiteData = enq.siteData || {};
        return {
          ...enq,
          siteData: {
            ...currentSiteData,
            [dataKey]: value
          }
        };
      }
      return enq;
    }));
  };

  const addReportToSite = (enquiryId, category, newReport) => {
    setEnquiries(enquiries.map(enq => {
      if (enq.id === enquiryId) {
        const currentSiteData = enq.siteData || {};
        const currentList = currentSiteData[category] || [];
        return {
          ...enq,
          siteData: {
            ...currentSiteData,
            [category]: [newReport, ...currentList]
          }
        };
      }
      return enq;
    }));
  };

  const updateReportInSite = (origEnquiryId, newEnquiryId, category, reportId, updatedReport) => {
    setEnquiries(enquiries.map(enq => {
      if (origEnquiryId === newEnquiryId) {
        if (enq.id === origEnquiryId) {
          const currentSiteData = enq.siteData || {};
          const currentList = currentSiteData[category] || [];
          return {
            ...enq,
            siteData: {
              ...currentSiteData,
              [category]: currentList.map(r => r.id === reportId ? { ...r, ...updatedReport } : r)
            }
          };
        }
        return enq;
      } else {
        if (enq.id === origEnquiryId) {
          const currentSiteData = enq.siteData || {};
          const currentList = currentSiteData[category] || [];
          return {
            ...enq,
            siteData: {
              ...currentSiteData,
              [category]: currentList.filter(r => r.id !== reportId)
            }
          };
        }
        if (enq.id === newEnquiryId) {
          const currentSiteData = enq.siteData || {};
          const currentList = currentSiteData[category] || [];
          return {
            ...enq,
            siteData: {
              ...currentSiteData,
              [category]: [{ ...updatedReport, id: reportId }, ...currentList]
            }
          };
        }
        return enq;
      }
    }));
  };

  const tabs = [
    { id: 'scheduled', label: 'Scheduled Services', icon: <Calendar size={16} /> },
    { id: 'reports', label: 'Service Reports', icon: <FileText size={16} /> },
    { id: 'water', label: 'Water Reports', icon: <Droplet size={16} /> },
    { id: 'complaints', label: 'Complaint Box', icon: <AlertTriangle size={16} /> }
  ];

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Site Services</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Manage deployed machines, schedule service visits, view reports, and track maintenance.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 0',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'scheduled' && (
          <ScheduledServicesTab 
            sites={confirmedSites} 
            updateSiteData={updateSiteData} 
            onSwitchToReports={() => handleTabChange('reports')}
          />
        )}
        {activeTab === 'reports' && <ServiceReportsTab sites={confirmedSites} addReport={addReportToSite} updateReport={updateReportInSite} />}
        {activeTab === 'water' && <WaterReportsTab sites={confirmedSites} addReport={addReportToSite} />}
        {activeTab === 'complaints' && <ComplaintBoxTab sites={confirmedSites} addReport={addReportToSite} updateReport={updateReportInSite} />}
      </div>
    </div>
  );
}

function ScheduledServicesTab({ sites, updateSiteData, onSwitchToReports }) {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [scheduleForm, setScheduleForm] = useState({
    siteId: '',
    serviceType: 'Routine Preventive Maintenance (PMS)',
    scheduledDate: new Date().toISOString().split('T')[0],
    technician: '',
    serviceInterval: '30',
    dcNumber: '',
    notes: ''
  });

  const calculateNextDate = (lastDate, interval) => {
    if (!lastDate || !interval) return '';
    const d = new Date(lastDate);
    d.setDate(d.getDate() + parseInt(interval));
    return d.toISOString().split('T')[0];
  };

  const getDueStatus = (nextDateStr) => {
    if (!nextDateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(nextDateStr);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue by ${Math.abs(diffDays)}d`, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
    }
    if (diffDays <= 5) {
      return { label: `Due in ${diffDays}d`, color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' };
    }
    return { label: `Upcoming (${diffDays}d)`, color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' };
  };

  const handleOpenScheduleModal = (site = null) => {
    if (site) {
      const sd = site.siteData || {};
      setScheduleForm({
        siteId: site.id.toString(),
        serviceType: sd.serviceType || 'Routine Preventive Maintenance (PMS)',
        scheduledDate: sd.scheduledDate || calculateNextDate(sd.lastServiced, sd.serviceInterval) || new Date().toISOString().split('T')[0],
        technician: sd.technician || '',
        serviceInterval: sd.serviceInterval || '30',
        dcNumber: sd.dcNumber || '',
        notes: sd.notes || ''
      });
    } else {
      setScheduleForm({
        siteId: sites[0]?.id ? sites[0].id.toString() : '',
        serviceType: 'Routine Preventive Maintenance (PMS)',
        scheduledDate: new Date().toISOString().split('T')[0],
        technician: '',
        serviceInterval: '30',
        dcNumber: '',
        notes: ''
      });
    }
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!scheduleForm.siteId) return alert('Please select a site.');
    const siteId = parseInt(scheduleForm.siteId);

    // Save scheduled details into siteData
    updateSiteData(siteId, 'dcNumber', scheduleForm.dcNumber);
    updateSiteData(siteId, 'serviceInterval', scheduleForm.serviceInterval);
    updateSiteData(siteId, 'lastServiced', scheduleForm.scheduledDate);
    updateSiteData(siteId, 'technician', scheduleForm.technician);
    updateSiteData(siteId, 'serviceType', scheduleForm.serviceType);
    updateSiteData(siteId, 'notes', scheduleForm.notes);

    setIsScheduleModalOpen(false);
  };

  const displaySites = selectedSiteId ? sites.filter(s => s.id.toString() === selectedSiteId) : sites;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Action Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'var(--bg-surface)', 
          padding: '1rem 1.25rem', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '240px' }}>
          <select 
            className="form-control" 
            style={{ maxWidth: '300px' }} 
            value={selectedSiteId} 
            onChange={e => setSelectedSiteId(e.target.value)}
          >
            <option value="">All Deployed Sites ({sites.length})</option>
            {sites.map(s => (
              <option key={s.id} value={s.id}>
                {s.customerName} ({s.ocNumber || 'No OC'})
              </option>
            ))}
          </select>
        </div>

        {/* Schedule Service Button */}
        <button 
          className="btn btn-primary"
          onClick={() => handleOpenScheduleModal()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} /> Schedule Service
        </button>
      </div>

      {/* Scheduled Services Table */}
      <div className="table-container" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ minWidth: '180px' }}>Site / Customer</th>
              <th style={{ minWidth: '150px' }}>OC & Machine</th>
              <th style={{ minWidth: '160px' }}>Service Type & Tech</th>
              <th style={{ minWidth: '130px' }}>DC Number</th>
              <th style={{ minWidth: '130px' }}>Interval</th>
              <th style={{ minWidth: '120px' }}>Last Serviced</th>
              <th style={{ minWidth: '160px' }}>Next Service Date</th>
              <th style={{ minWidth: '140px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displaySites.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <Calendar size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                  <div style={{ fontWeight: 600 }}>No deployed machines found</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Confirmed orders will automatically show up here for routine service scheduling.</div>
                </td>
              </tr>
            ) : displaySites.map(site => {
              const sd = site.siteData || {};
              const confirmedQuote = site.quotes?.find(q => q.id === site.confirmedQuoteId);
              const nextDate = calculateNextDate(sd.lastServiced, sd.serviceInterval);
              const dueStatus = getDueStatus(nextDate);

              return (
                <tr key={site.id}>
                  {/* Site & Address */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{site.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{site.address || site.phone}</div>
                  </td>

                  {/* OC & Machine */}
                  <td>
                    <div style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {site.ocNumber || 'Pending OC'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {confirmedQuote?.title || 'Water Treatment Plant'}
                    </div>
                  </td>

                  {/* Service Type & Technician */}
                  <td>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                      {sd.serviceType || 'Routine Maintenance'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Tech: {sd.technician || 'Unassigned'}
                    </div>
                  </td>

                  {/* DC Number */}
                  <td>
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.82rem' }}
                      placeholder="e.g. DC/STP/01"
                      value={sd.dcNumber || ''}
                      onChange={(e) => updateSiteData(site.id, 'dcNumber', e.target.value)}
                    />
                  </td>

                  {/* Service Interval */}
                  <td>
                    <select 
                      className="form-control" 
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.82rem' }}
                      value={sd.serviceInterval || '30'}
                      onChange={(e) => updateSiteData(site.id, 'serviceInterval', e.target.value)}
                    >
                      <option value="15">15 Days</option>
                      <option value="30">30 Days (Monthly)</option>
                      <option value="60">60 Days</option>
                      <option value="90">90 Days (Quarterly)</option>
                    </select>
                  </td>

                  {/* Last Serviced */}
                  <td>
                    <input 
                      type="date" 
                      className="form-control" 
                      style={{ padding: '0.3rem 0.5rem', fontSize: '0.82rem' }}
                      value={sd.lastServiced || ''}
                      onChange={(e) => updateSiteData(site.id, 'lastServiced', e.target.value)}
                    />
                  </td>

                  {/* Next Service Date & Status Badge */}
                  <td>
                    {nextDate ? (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          {nextDate}
                        </div>
                        {dueStatus && (
                          <span 
                            style={{ 
                              display: 'inline-block',
                              padding: '0.15rem 0.45rem', 
                              borderRadius: '4px', 
                              fontSize: '0.7rem', 
                              fontWeight: 700,
                              background: dueStatus.bg,
                              color: dueStatus.color,
                              border: `1px solid ${dueStatus.border}`,
                              marginTop: '0.2rem'
                            }}
                          >
                            {dueStatus.label}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Set last date</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-small"
                        onClick={() => handleOpenScheduleModal(site)}
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                        title="Reschedule / Edit parameters"
                      >
                        Reschedule
                      </button>
                      
                      <button
                        type="button"
                        className="btn btn-primary btn-small"
                        onClick={() => onSwitchToReports && onSwitchToReports(site.id)}
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                        title="Log Service Report for this site"
                      >
                        Log Report
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* SCHEDULE SERVICE MODAL */}
      {isScheduleModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ maxWidth: '580px', width: '92%', maxHeight: '92vh', overflowY: 'auto' }}>
            
            <div className="modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-surface)' }}>
              <div>
                <h3 className="modal-title" style={{ fontSize: '1.1rem' }}>
                  Schedule Service Visit
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Assign maintenance date, technician, and service interval for deployed plant.
                </p>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setIsScheduleModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSchedule}>
              <div className="modal-body" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* 1. Select Site */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Select Site / Customer <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select 
                    required 
                    className="form-control"
                    value={scheduleForm.siteId}
                    onChange={e => setScheduleForm({ ...scheduleForm, siteId: e.target.value })}
                  >
                    <option value="">-- Choose Deployed Customer Site --</option>
                    {sites.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.customerName} ({s.ocNumber || 'No OC'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Service Type */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Service Type <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select 
                    className="form-control"
                    value={scheduleForm.serviceType}
                    onChange={e => setScheduleForm({ ...scheduleForm, serviceType: e.target.value })}
                  >
                    <option value="Routine Preventive Maintenance (PMS)">Routine Preventive Maintenance (PMS)</option>
                    <option value="RO Membrane Flushing & CIP Cleaning">RO Membrane Flushing & CIP Cleaning</option>
                    <option value="Filter & Sediment Cartridge Replacement">Filter & Sediment Cartridge Replacement</option>
                    <option value="UV Disinfection & Lamp Inspection">UV Disinfection & Lamp Inspection</option>
                    <option value="Pump & Blower Pressure Overhaul">Pump & Blower Pressure Overhaul</option>
                    <option value="Emergency Breakdown Inspection">Emergency Breakdown Inspection</option>
                  </select>
                </div>

                {/* 3. Scheduled Date & Interval */}
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Service Date <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input 
                      required
                      type="date"
                      className="form-control"
                      value={scheduleForm.scheduledDate}
                      onChange={e => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>
                      Service Interval <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select 
                      className="form-control"
                      value={scheduleForm.serviceInterval}
                      onChange={e => setScheduleForm({ ...scheduleForm, serviceInterval: e.target.value })}
                    >
                      <option value="15">Every 15 Days</option>
                      <option value="30">Every 30 Days (Monthly)</option>
                      <option value="60">Every 60 Days (Bi-monthly)</option>
                      <option value="90">Every 90 Days (Quarterly)</option>
                      <option value="180">Every 180 Days (Half-yearly)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Assigned Technician & DC Number */}
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Assigned Technician</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. Ramesh Kumar"
                      value={scheduleForm.technician}
                      onChange={e => setScheduleForm({ ...scheduleForm, technician: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Delivery Challan (DC Number)</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="e.g. DC/STP/26-27/045"
                      value={scheduleForm.dcNumber}
                      onChange={e => setScheduleForm({ ...scheduleForm, dcNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* 5. Instructions / Notes */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>Special Service Notes / Instructions</label>
                  <textarea 
                    rows={2}
                    className="form-control"
                    placeholder="e.g. Bring replacement 5-micron cartridges and antiscalant dosing chemical."
                    value={scheduleForm.notes}
                    onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  />
                </div>

              </div>

              <div className="modal-footer" style={{ position: 'sticky', bottom: 0, zIndex: 10, background: 'var(--bg-surface)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsScheduleModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Schedule
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}



function WaterReportsTab({ sites, addReport }) {
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getMinDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 3);
    return d.toISOString().split('T')[0];
  };

  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formSiteId, setFormSiteId] = useState('');
  const [previewReport, setPreviewReport] = useState(null);
  const [newReport, setNewReport] = useState({ 
    date: getTodayStr(), 
    reportName: '', 
    attachment: '', 
    attachmentUrl: '',
    isImage: false 
  });

  const displaySites = selectedSiteId ? sites.filter(s => s.id.toString() === selectedSiteId) : sites;
  const reports = displaySites.flatMap(s => (s.siteData?.waterReports || []).map(r => ({ ...r, siteName: s.customerName, ocNumber: s.ocNumber })));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setNewReport(prev => ({
        ...prev,
        attachment: file.name,
        attachmentUrl: ev.target.result,
        isImage: isImg,
        reportName: prev.reportName || file.name.replace(/\.[^/.]+$/, "")
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const targetSiteId = selectedSiteId || formSiteId;
    if (!targetSiteId) return alert('Please select a site first.');
    if (!newReport.attachment) return alert('Please upload the water report file.');
    
    addReport(parseInt(targetSiteId), 'waterReports', { 
      id: Date.now(), 
      date: newReport.date || getTodayStr(),
      reportName: newReport.reportName || newReport.attachment,
      attachment: newReport.attachment,
      attachmentUrl: newReport.attachmentUrl,
      isImage: newReport.isImage
    });

    setIsAdding(false);
    setFormSiteId('');
    setNewReport({ 
      date: getTodayStr(), 
      reportName: '', 
      attachment: '', 
      attachmentUrl: '',
      isImage: false 
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select className="form-control" style={{ maxWidth: '300px' }} value={selectedSiteId} onChange={e => setSelectedSiteId(e.target.value)}>
          <option value="">All Deployed Sites</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.customerName} ({s.ocNumber || 'No OC'})</option>)}
        </select>
        <button className="btn btn-primary btn-small" onClick={() => { setIsAdding(true); setNewReport(prev => ({ ...prev, date: getTodayStr() })); }}>
          <Plus size={14} /> New Water Report
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', maxWidth: '640px' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 700 }}>Upload Water Report</h3>
          
          {!selectedSiteId && (
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Select Site <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select required className="form-control" value={formSiteId} onChange={e => setFormSiteId(e.target.value)}>
                <option value="">-- Choose a site --</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.customerName} ({s.ocNumber || 'No OC'})</option>)}
              </select>
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Date <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input 
                required 
                type="date" 
                className="form-control" 
                min={getMinDateStr()} 
                max={getTodayStr()} 
                value={newReport.date} 
                onChange={e => setNewReport({...newReport, date: e.target.value})} 
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Defaults to today (allows up to 3 days back)
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Report Title / Remarks
              </label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Lab Water Test Analysis" 
                value={newReport.reportName} 
                onChange={e => setNewReport({...newReport, reportName: e.target.value})} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Upload Report File <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input 
              required 
              type="file" 
              className="form-control" 
              style={{ padding: '0.35rem' }} 
              accept=".pdf,image/*,.doc,.docx"
              onChange={handleFileChange} 
            />
            {newReport.attachment && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--accent-color)', fontWeight: 600 }}>
                <FileText size={13} />
                <span>{newReport.attachment}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Water Report</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ minWidth: '180px' }}>Site</th>
              <th style={{ width: '120px' }}>Date</th>
              <th style={{ minWidth: '220px' }}>Report Document</th>
              <th style={{ textAlign: 'right', width: '110px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No water reports found.</td></tr>
            ) : reports.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.siteName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.ocNumber}</div>
                </td>
                <td style={{ fontWeight: 600, fontSize: '0.84rem', whiteSpace: 'nowrap' }}>{r.date}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <FileText size={16} color="var(--accent-color)" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                        {r.reportName || r.attachment || 'Water_Analysis_Report.pdf'}
                      </div>
                      {r.attachment && r.reportName && r.reportName !== r.attachment && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.attachment}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {r.attachmentUrl ? (
                    <a 
                      href={r.attachmentUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-secondary btn-small"
                      style={{ fontSize: '0.74rem', padding: '0.25rem 0.55rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <ExternalLink size={12} /> View
                    </a>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-small"
                      style={{ fontSize: '0.74rem', padding: '0.25rem 0.55rem' }}
                      onClick={() => setPreviewReport(r)}
                    >
                      <FileText size={12} /> View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PREVIEW REPORT MODAL */}
      {previewReport && (
        <div className="modal-overlay" onClick={() => setPreviewReport(null)} style={{ zIndex: 1300 }}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                <Droplet size={16} color="var(--accent-color)" />
                <span>Water Report Details</span>
              </h2>
              <button className="close-btn" onClick={() => setPreviewReport(null)}><X size={20} /></button>
            </div>

            <div className="modal-body" style={{ padding: '1.25rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Site Name</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{previewReport.siteName} ({previewReport.ocNumber})</div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Date</div>
                <div style={{ fontWeight: 600 }}>{previewReport.date}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Attachment</div>
                <div style={{ fontWeight: 600, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <FileText size={15} />
                  <span>{previewReport.reportName || previewReport.attachment || 'Water_Analysis_Report.pdf'}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setPreviewReport(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComplaintBoxTab({ sites, addReport, updateReport }) {
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedViewAttachments, setSelectedViewAttachments] = useState(null);
  const [newTicket, setNewTicket] = useState({ 
    complainerName: '', 
    contactNumber: '', 
    issue: '',
    attachments: []
  });

  const displaySites = selectedSiteId ? sites.filter(s => s.id.toString() === selectedSiteId) : sites;
  const complaints = displaySites.flatMap(s => (s.siteData?.complaints || []).map(c => ({ 
    ...c, 
    siteId: s.id,
    siteName: s.customerName, 
    ocNumber: s.ocNumber 
  })));

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
        setNewTicket(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), newAttachment]
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveAttachment = (index) => {
    setNewTicket(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!newTicket.complainerName.trim()) return alert("Please enter complainer's name.");
    if (!newTicket.contactNumber.trim()) return alert("Please enter contact number.");
    if (!newTicket.issue.trim()) return alert("Please enter the issue details.");

    const targetSiteId = selectedSiteId || (sites[0]?.id ? sites[0].id : 1);
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentDate = new Date().toISOString().split('T')[0];

    addReport(parseInt(targetSiteId), 'complaints', { 
      id: ticketId, 
      status: 'OPEN', 
      complainerName: newTicket.complainerName.trim(),
      contactNumber: newTicket.contactNumber.trim(),
      date: currentDate,
      issue: newTicket.issue.trim(),
      attachments: newTicket.attachments || []
    });

    setIsAdding(false);
    setNewTicket({ 
      complainerName: '', 
      contactNumber: '', 
      issue: '',
      attachments: []
    });
  };

  const handleToggleStatus = (siteId, complaint) => {
    if (!updateReport) return;
    const nextStatus = complaint.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
    updateReport(siteId, siteId, 'complaints', complaint.id, { ...complaint, status: nextStatus });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select className="form-control" style={{ maxWidth: '300px' }} value={selectedSiteId} onChange={e => setSelectedSiteId(e.target.value)}>
          <option value="">All Deployed Sites</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.customerName} ({s.ocNumber || 'No OC'})</option>)}
        </select>
        <button className="btn btn-primary btn-small" onClick={() => setIsAdding(true)} style={{ background: '#EF4444' }}>
          <AlertTriangle size={14} /> Raise Ticket
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', maxWidth: '680px' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 700 }}>Raise a Complaint / Ticket</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Complainer's Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input 
                required 
                type="text" 
                className="form-control" 
                placeholder="Enter complainer's name" 
                value={newTicket.complainerName} 
                onChange={e => setNewTicket({...newTicket, complainerName: e.target.value})} 
              />
            </div>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>
                Contact Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input 
                required 
                type="tel" 
                className="form-control" 
                placeholder="Enter contact number" 
                value={newTicket.contactNumber} 
                onChange={e => setNewTicket({...newTicket, contactNumber: e.target.value})} 
              />
            </div>
          </div>

          {/* Attachments Section */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ fontWeight: 600, margin: 0 }}>
                Attachments
              </label>
              <label 
                className="btn btn-secondary btn-small"
                style={{ cursor: 'pointer', margin: 0, padding: '0.25rem 0.65rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Paperclip size={12} /> Add Photos / Files
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,.pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {newTicket.attachments && newTicket.attachments.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {newTicket.attachments.map((file, idx) => (
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

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Describe the Issue <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea 
              required 
              className="form-control" 
              rows={3} 
              placeholder="Enter complaint details or machine issue..." 
              value={newTicket.issue} 
              onChange={e => setNewTicket({...newTicket, issue: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ background: '#EF4444' }}>Submit Ticket</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>Ticket ID</th>
              <th style={{ minWidth: '150px' }}>Complainer</th>
              <th style={{ width: '130px' }}>Contact</th>
              <th style={{ width: '105px' }}>Date</th>
              <th style={{ minWidth: '200px' }}>Issue Description</th>
              <th style={{ width: '115px' }}>Attachments</th>
              <th style={{ width: '95px' }}>Status</th>
              <th style={{ textAlign: 'right', width: '105px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No complaints raised.</td></tr>
            ) : complaints.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>#{c.id}</td>
                <td>
                  <div style={{ fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span>{c.complainerName || c.servicePersonName || c.personName || c.siteName || 'Customer'}</span>
                  </div>
                </td>
                <td>
                  {c.contactNumber ? (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Phone size={11} style={{ opacity: 0.7 }} />
                      <span>{c.contactNumber}</span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                  )}
                </td>
                <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{c.date}</td>
                <td style={{ maxWidth: '280px', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>{c.issue}</td>
                <td>
                  {c.attachments && c.attachments.length > 0 ? (
                    <button 
                      type="button"
                      className="btn btn-secondary btn-small"
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.35rem', 
                        padding: '0.2rem 0.5rem', 
                        fontSize: '0.74rem', 
                        borderRadius: '4px',
                        background: 'var(--bg-surface-alt)'
                      }}
                      onClick={() => setSelectedViewAttachments(c)}
                      title="View attachments"
                    >
                      <Paperclip size={12} color="var(--accent-color)" />
                      <span>{c.attachments.length} {c.attachments.length === 1 ? 'file' : 'files'}</span>
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>
                  )}
                </td>
                <td>
                  <span style={{ 
                    padding: '0.2rem 0.55rem', 
                    borderRadius: '99px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    background: c.status === 'OPEN' ? '#FEF2F2' : '#F0FDF4',
                    color: c.status === 'OPEN' ? '#DC2626' : '#16A34A',
                    border: `1px solid ${c.status === 'OPEN' ? '#FECACA' : '#BBF7D0'}`
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                    onClick={() => handleToggleStatus(c.siteId, c)}
                    title={c.status === 'OPEN' ? 'Mark as resolved' : 'Reopen ticket'}
                  >
                    {c.status === 'OPEN' ? 'Mark Resolved' : 'Reopen'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW ATTACHMENTS MODAL */}
      {selectedViewAttachments && (
        <div className="modal-overlay" onClick={() => setSelectedViewAttachments(null)} style={{ zIndex: 1300 }}>
          <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
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
