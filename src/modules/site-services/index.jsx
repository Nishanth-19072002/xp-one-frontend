import React, { useState } from 'react';
import { Calendar, FileText, Droplet, AlertTriangle, Plus, Save, ChevronDown, CheckCircle } from 'lucide-react';

export default function SiteServicesDashboard({ enquiries = [], setEnquiries }) {
  const [activeTab, setActiveTab] = useState('scheduled');

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
            Manage deployed machines, scheduling, reports, and complaints.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
        {activeTab === 'scheduled' && <ScheduledServicesTab sites={confirmedSites} updateSiteData={updateSiteData} />}
        {activeTab === 'reports' && <ServiceReportsTab sites={confirmedSites} addReport={addReportToSite} />}
        {activeTab === 'water' && <WaterReportsTab sites={confirmedSites} addReport={addReportToSite} />}
        {activeTab === 'complaints' && <ComplaintBoxTab sites={confirmedSites} addReport={addReportToSite} />}
      </div>
    </div>
  );
}

function ScheduledServicesTab({ sites, updateSiteData }) {
  const calculateNextDate = (lastDate, interval) => {
    if (!lastDate || !interval) return '';
    const d = new Date(lastDate);
    d.setDate(d.getDate() + parseInt(interval));
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Site / Customer</th>
            <th>OC & Machine</th>
            <th>DC Number (Editable)</th>
            <th>Service Interval</th>
            <th>Last Serviced</th>
            <th>Next Service Date</th>
          </tr>
        </thead>
        <tbody>
          {sites.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No deployed machines found. Confirm an order first.</td></tr>
          ) : sites.map(site => {
            const sd = site.siteData || {};
            const confirmedQuote = site.quotes?.find(q => q.id === site.confirmedQuoteId);
            const nextDate = calculateNextDate(sd.lastServiced, sd.serviceInterval);

            return (
              <tr key={site.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{site.customerName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{site.address}</div>
                </td>
                <td>
                  <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{site.ocNumber || 'Pending'}</div>
                  <div style={{ fontSize: '0.8rem' }}>{confirmedQuote?.title}</div>
                </td>
                <td>
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                    placeholder="e.g. DC/STP/26-27/001"
                    value={sd.dcNumber || ''}
                    onChange={(e) => updateSiteData(site.id, 'dcNumber', e.target.value)}
                  />
                </td>
                <td>
                  <select 
                    className="form-control" 
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                    value={sd.serviceInterval || ''}
                    onChange={(e) => updateSiteData(site.id, 'serviceInterval', e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="15">Every 15 Days</option>
                    <option value="30">Every 30 Days</option>
                  </select>
                </td>
                <td>
                  <input 
                    type="date" 
                    className="form-control" 
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                    value={sd.lastServiced || ''}
                    onChange={(e) => updateSiteData(site.id, 'lastServiced', e.target.value)}
                  />
                </td>
                <td>
                  {nextDate ? (
                    <span style={{ fontWeight: 600, color: 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>
                      {nextDate}
                    </span>
                  ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ServiceReportsTab({ sites, addReport }) {
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formSiteId, setFormSiteId] = useState('');
  const [newReport, setNewReport] = useState({ date: '', technician: '', workDone: '' });

  const displaySites = selectedSiteId ? sites.filter(s => s.id.toString() === selectedSiteId) : sites;
  const reports = displaySites.flatMap(s => (s.siteData?.serviceReports || []).map(r => ({ ...r, siteName: s.customerName, ocNumber: s.ocNumber })));

  const handleSave = (e) => {
    e.preventDefault();
    const targetSiteId = selectedSiteId || formSiteId;
    if (!targetSiteId) return alert('Please select a site first.');
    
    addReport(parseInt(targetSiteId), 'serviceReports', { id: Date.now(), ...newReport });
    setIsAdding(false);
    setFormSiteId('');
    setNewReport({ date: '', technician: '', workDone: '' });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select className="form-control" style={{ maxWidth: '300px' }} value={selectedSiteId} onChange={e => setSelectedSiteId(e.target.value)}>
          <option value="">All Deployed Sites</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.customerName} ({s.ocNumber || 'No OC'})</option>)}
        </select>
        <button className="btn btn-primary btn-small" onClick={() => setIsAdding(true)}>
          <Plus size={14} /> New Report
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Create Service Report</h3>
          
          {!selectedSiteId && (
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Select Site</label>
              <select required className="form-control" value={formSiteId} onChange={e => setFormSiteId(e.target.value)}>
                <option value="">-- Choose a site --</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.customerName} ({s.ocNumber || 'No OC'})</option>)}
              </select>
            </div>
          )}

          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div>
              <label className="form-label">Date of Service</label>
              <input required type="date" className="form-control" value={newReport.date} onChange={e => setNewReport({...newReport, date: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Technician Name</label>
              <input required type="text" className="form-control" value={newReport.technician} onChange={e => setNewReport({...newReport, technician: e.target.value})} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Work Done / Details</label>
            <textarea required className="form-control" rows="3" value={newReport.workDone} onChange={e => setNewReport({...newReport, workDone: e.target.value})}></textarea>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Report</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Date</th>
              <th>Technician</th>
              <th>Work Done</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No service reports found.</td></tr>
            ) : reports.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.siteName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.ocNumber}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{r.date}</td>
                <td>{r.technician}</td>
                <td>{r.workDone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WaterReportsTab({ sites, addReport }) {
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formSiteId, setFormSiteId] = useState('');
  const [newReport, setNewReport] = useState({ date: '', ph: '', tds: '', hardness: '', attachment: '' });

  const displaySites = selectedSiteId ? sites.filter(s => s.id.toString() === selectedSiteId) : sites;
  const reports = displaySites.flatMap(s => (s.siteData?.waterReports || []).map(r => ({ ...r, siteName: s.customerName, ocNumber: s.ocNumber })));

  const handleSave = (e) => {
    e.preventDefault();
    const targetSiteId = selectedSiteId || formSiteId;
    if (!targetSiteId) return alert('Please select a site first.');
    
    addReport(parseInt(targetSiteId), 'waterReports', { id: Date.now(), ...newReport });
    setIsAdding(false);
    setFormSiteId('');
    setNewReport({ date: '', ph: '', tds: '', hardness: '', attachment: '' });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select className="form-control" style={{ maxWidth: '300px' }} value={selectedSiteId} onChange={e => setSelectedSiteId(e.target.value)}>
          <option value="">All Deployed Sites</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.customerName} ({s.ocNumber || 'No OC'})</option>)}
        </select>
        <button className="btn btn-primary btn-small" onClick={() => setIsAdding(true)}>
          <Plus size={14} /> New Water Report
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Enter Water Quality Parameters</h3>
          
          {!selectedSiteId && (
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Select Site</label>
              <select required className="form-control" value={formSiteId} onChange={e => setFormSiteId(e.target.value)}>
                <option value="">-- Choose a site --</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.customerName} ({s.ocNumber || 'No OC'})</option>)}
              </select>
            </div>
          )}
          
          <div className="form-row" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div><label className="form-label">Date Tested</label><input required type="date" className="form-control" value={newReport.date} onChange={e => setNewReport({...newReport, date: e.target.value})} /></div>
            <div><label className="form-label">pH Level</label><input required type="text" className="form-control" value={newReport.ph} onChange={e => setNewReport({...newReport, ph: e.target.value})} /></div>
            <div><label className="form-label">TDS (ppm)</label><input required type="text" className="form-control" value={newReport.tds} onChange={e => setNewReport({...newReport, tds: e.target.value})} /></div>
            <div><label className="form-label">Hardness</label><input required type="text" className="form-control" value={newReport.hardness} onChange={e => setNewReport({...newReport, hardness: e.target.value})} /></div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Upload Report File (Optional)</label>
              <input type="file" className="form-control" style={{ padding: '0.35rem' }} onChange={e => setNewReport({...newReport, attachment: e.target.files[0]?.name || ''})} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Report</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Site</th><th>Date</th><th>pH Level</th><th>TDS</th><th>Hardness</th><th>Attachment</th></tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No water reports found.</td></tr>
            ) : reports.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.siteName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.ocNumber}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{r.date}</td>
                <td>{r.ph}</td><td>{r.tds} ppm</td><td>{r.hardness}</td>
                <td>{r.attachment ? <span style={{ color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}><FileText size={14}/> {r.attachment}</span> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComplaintBoxTab({ sites, addReport }) {
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formSiteId, setFormSiteId] = useState('');
  const [newTicket, setNewTicket] = useState({ date: '', issue: '' });

  const displaySites = selectedSiteId ? sites.filter(s => s.id.toString() === selectedSiteId) : sites;
  const complaints = displaySites.flatMap(s => (s.siteData?.complaints || []).map(c => ({ ...c, siteName: s.customerName, ocNumber: s.ocNumber })));

  const handleSave = (e) => {
    e.preventDefault();
    const targetSiteId = selectedSiteId || formSiteId;
    if (!targetSiteId) return alert('Please select a site first.');
    
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    addReport(parseInt(targetSiteId), 'complaints', { id: ticketId, status: 'OPEN', ...newTicket });
    setIsAdding(false);
    setFormSiteId('');
    setNewTicket({ date: '', issue: '' });
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
        <form onSubmit={handleSave} style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Raise a Complaint / Ticket</h3>
          
          {!selectedSiteId && (
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Select Site</label>
              <select required className="form-control" value={formSiteId} onChange={e => setFormSiteId(e.target.value)}>
                <option value="">-- Choose a site --</option>
                {sites.map(s => <option key={s.id} value={s.id}>{s.customerName} ({s.ocNumber || 'No OC'})</option>)}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Date</label>
            <input required type="date" className="form-control" style={{ maxWidth: '200px' }} value={newTicket.date} onChange={e => setNewTicket({...newTicket, date: e.target.value})} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label">Describe the Issue</label>
            <textarea required className="form-control" rows="3" value={newTicket.issue} onChange={e => setNewTicket({...newTicket, issue: e.target.value})}></textarea>
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
              <th>Site</th>
              <th>Ticket ID</th>
              <th>Date</th>
              <th>Issue Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No complaints raised.</td></tr>
            ) : complaints.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.siteName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.ocNumber}</div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{c.id}</td>
                <td>{c.date}</td>
                <td>{c.issue}</td>
                <td>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                    background: c.status === 'OPEN' ? '#FEF2F2' : '#F0FDF4',
                    color: c.status === 'OPEN' ? '#DC2626' : '#16A34A'
                  }}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
