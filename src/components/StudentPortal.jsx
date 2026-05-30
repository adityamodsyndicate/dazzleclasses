import React, { useState } from 'react';

function StudentPortal({ courses, doubts, fetchDoubts, showToast }) {
  const [activeSubTab, setActiveSubTab] = useState('track'); // 'track' | 'schedule' | 'doubts'
  
  // Search inputs
  const [lookupValue, setLookupValue] = useState('');
  const [matchedInquiries, setMatchedInquiries] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Doubt submission states
  const [doubtName, setDoubtName] = useState('');
  const [doubtEmail, setDoubtEmail] = useState('');
  const [doubtMsg, setDoubtMsg] = useState('');
  const [isSubmittingDoubt, setIsSubmittingDoubt] = useState(false);
  const [lookupDoubtEmail, setLookupDoubtEmail] = useState('');
  const [studentDoubts, setStudentDoubts] = useState([]);
  const [doubtSearched, setDoubtSearched] = useState(false);

  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    if (!lookupValue.trim()) {
      showToast('Please enter your email or phone number.', 'error');
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const allInquiries = await res.json();
        const matches = allInquiries.filter(i => 
          i.email.toLowerCase() === lookupValue.toLowerCase().trim() ||
          i.phone.includes(lookupValue.trim())
        );
        setMatchedInquiries(matches);
        setSearched(true);
      } else {
        showToast('Failed to connect to tracker server.', 'error');
      }
    } catch (err) {
      showToast('Server connection failed.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleDoubtSubmit = async (e) => {
    e.preventDefault();
    if (!doubtName.trim() || !doubtEmail.trim() || !doubtMsg.trim()) {
      showToast('Please fill in all mandatory fields.', 'error');
      return;
    }

    setIsSubmittingDoubt(true);
    try {
      const res = await fetch('/api/doubts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: doubtName,
          email: doubtEmail,
          message: doubtMsg
        })
      });

      if (res.ok) {
        showToast('Your question was submitted. The counselor will reply via email!');
        setDoubtName('');
        setDoubtEmail('');
        setDoubtMsg('');
        fetchDoubts(); // refresh parent state
      } else {
        showToast('Could not save your doubt. Please try again.', 'error');
      }
    } catch (err) {
      showToast('Connection error. Try again.', 'error');
    } finally {
      setIsSubmittingDoubt(false);
    }
  };

  const handleDoubtLookup = (e) => {
    e.preventDefault();
    if (!lookupDoubtEmail.trim()) {
      showToast('Please enter your email to find replies.', 'error');
      return;
    }

    const matches = doubts.filter(d => d.email.toLowerCase() === lookupDoubtEmail.toLowerCase().trim());
    setStudentDoubts(matches);
    setDoubtSearched(true);
  };

  return (
    <div className="student-portal-wrapper">
      <div className="section-header">
        <h2>Student Panel</h2>
        <p>Manage your application tracker, batch timetables, and academic communication hub.</p>
      </div>

      <div className="glass portal-grid animate-fade">
        {/* Left Side menu navigation */}
        <div className="portal-sidebar" style={{ borderRight: '1px solid var(--border-glass)' }}>
          <div className="sidebar-menu">
            <button 
              className={`sidebar-btn ${activeSubTab === 'track' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('track')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Track Enrollment
            </button>
            <button 
              className={`sidebar-btn ${activeSubTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('schedule')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Batch Schedules
            </button>
            <button 
              className={`sidebar-btn ${activeSubTab === 'doubts' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('doubts')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Counselor Q&A
            </button>
          </div>
        </div>

        {/* Right Side Content Drawer */}
        <div className="portal-content">
          
          {/* SUBTAB 1: TRACKING ENROLLMENT */}
          {activeSubTab === 'track' && (
            <div className="animate-fade">
              <h3 className="portal-heading">Check Registration Status</h3>
              <p className="portal-desc">
                Input the phone number or email address used during your registration to check the current review stage.
              </p>

              <form onSubmit={handleLookupSubmit} className="lookup-form-container">
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Enter email or phone (e.g. 9876543210)"
                  value={lookupValue}
                  onChange={(e) => setLookupValue(e.target.value)}
                  style={{ flexGrow: 1 }}
                />
                <button type="submit" className="btn btn-primary" disabled={isSearching}>
                  {isSearching ? 'Tracking...' : 'Search Tracker'}
                </button>
              </form>

              {searched && (
                <div style={{ marginTop: '30px' }} className="animate-fade">
                  {matchedInquiries.length > 0 ? (
                    <div>
                      <h4 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Registrations Found</h4>
                      {matchedInquiries.map(inq => {
                        const course = courses.find(c => c.id === inq.courseId);
                        return (
                          <div key={inq.id} className="glass lookup-card animate-fade">
                            <div className="lookup-info">
                              <h4>{course ? course.title : inq.courseId}</h4>
                              <p>Registration ID: {inq.id} | Date: {inq.date}</p>
                              {inq.notes && (
                                <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                                  <strong>Your Batch Note:</strong> {inq.notes}
                                </p>
                              )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span className={`status-badge ${inq.status}`}>{inq.status}</span>
                              {inq.status === 'Enrolled' && (
                                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--success)' }}>
                                  ✓ Batch assigned! View schedules tab.
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="glass" style={{ padding: '30px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        No records found matching "<strong>{lookupValue}</strong>". Make sure the spelling/digits are correct, or submit a new inquiry in the Courses catalog!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SUBTAB 2: CLASS TIMETABLES */}
          {activeSubTab === 'schedule' && (
            <div className="animate-fade">
              <h3 className="portal-heading">Current Batch Timetables</h3>
              <p className="portal-desc">
                Review available class slots at Dazzle Academy Bahadurgarh. Students can adjust batches in coordination with their counselor.
              </p>

              <div className="schedule-grid">
                <div className="schedule-card">
                  <div className="schedule-header">
                    <span>Morning Slot A</span>
                    <span>Daily (Mon-Fri)</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>09:00 AM - 11:00 AM</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Ideal for Basic Computer systems, MS Office, Advanced Excel.
                  </p>
                </div>

                <div className="schedule-card">
                  <div className="schedule-header">
                    <span>Morning Slot B</span>
                    <span>Daily (Mon-Fri)</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>11:30 AM - 01:30 PM</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Core Programming cohorts (Python, Java, C++, SQL).
                  </p>
                </div>

                <div className="schedule-card">
                  <div className="schedule-header">
                    <span>Afternoon Slot</span>
                    <span>Daily (Mon-Fri)</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>03:00 PM - 05:00 PM</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Creative & Vocational streams (Graphic Design, Video Editing, AutoCAD).
                  </p>
                </div>

                <div className="schedule-card">
                  <div className="schedule-header" style={{ color: 'var(--accent-light)' }}>
                    <span>Weekend Special</span>
                    <span>Sat-Sun Batch</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>10:00 AM - 02:00 PM</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Tailored for university scholars & working professionals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: COUNSELOR DOUBT CENTER */}
          {activeSubTab === 'doubts' && (
            <div className="animate-fade">
              <h3 className="portal-heading">Doubt Solver & Question Drawer</h3>
              <p className="portal-desc">
                Have a query regarding syllabi, fees, classes, or qualifications? Post it here and our CEO, Ms. Nisha Harit, or counselors will reply.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }}>
                {/* Doubt Submission form */}
                <form onSubmit={handleDoubtSubmit} className="glass" style={{ padding: '24px' }}>
                  <h4 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Ask a Counselor</h4>
                  
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. Karan Singh"
                      value={doubtName}
                      onChange={(e) => setDoubtName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Email *</label>
                    <input 
                      type="email" 
                      className="form-control"
                      placeholder="e.g. karan@example.com"
                      value={doubtEmail}
                      onChange={(e) => setDoubtEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Doubt / Query *</label>
                    <textarea 
                      className="form-control"
                      placeholder="Write your syllabus or timing questions..."
                      value={doubtMsg}
                      onChange={(e) => setDoubtMsg(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmittingDoubt} style={{ width: '100%' }}>
                    {isSubmittingDoubt ? 'Sending...' : 'Send Doubt Inquiry'}
                  </button>
                </form>

                {/* Reply lookups */}
                <div>
                  <div className="glass" style={{ padding: '24px', marginBottom: '20px' }}>
                    <h4 style={{ marginBottom: '12px', fontFamily: 'var(--font-display)' }}>Track Doubt Answers</h4>
                    <form onSubmit={handleDoubtLookup} style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Enter email to check replies"
                        value={lookupDoubtEmail}
                        onChange={(e) => setLookupDoubtEmail(e.target.value)}
                      />
                      <button type="submit" className="btn btn-secondary btn-sm">Find</button>
                    </form>
                  </div>

                  {doubtSearched && (
                    <div className="animate-fade">
                      {studentDoubts.length > 0 ? (
                        studentDoubts.map(d => (
                          <div key={d.id} className="glass doubt-card animate-fade">
                            <div className="doubt-header">
                              <span>Asked: {d.date}</span>
                              <span className={`status-badge ${d.status === 'Answered' ? 'Enrolled' : 'Pending'}`} style={{ fontSize: '0.7rem' }}>
                                {d.status}
                              </span>
                            </div>
                            <p className="doubt-msg">Q: {d.message}</p>
                            {d.reply ? (
                              <div className="doubt-reply">
                                <strong>Counselor Reply:</strong> {d.reply}
                              </div>
                            ) : (
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Awaiting response. Our team will get back within 24 hours.
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                          No doubts posted with "{lookupDoubtEmail}".
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default StudentPortal;
