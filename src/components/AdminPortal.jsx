import React, { useState, useEffect } from 'react';

function AdminPortal({
  adminToken,
  adminUser,
  onLogin,
  onLogout,
  courses,
  inquiries,
  doubts,
  analytics,
  fetchCourses,
  fetchInquiries,
  fetchDoubts,
  fetchAnalytics,
  showToast
}) {
  // Login form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Portal inner tabs
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'inquiries' | 'courses' | 'doubts'

  // Inquiry update states
  const [editingInquiryId, setEditingInquiryId] = useState(null);
  const [counselorNotes, setCounselorNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Course form states (CRUD)
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Basic Computers');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseFee, setCourseFee] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseBenefits, setCourseBenefits] = useState('');

  // Doubt responder state
  const [answeringDoubtId, setAnsweringDoubtId] = useState(null);
  const [doubtReply, setDoubtReply] = useState('');

  // Auto-sync stats when admin tab is mounted
  useEffect(() => {
    if (adminToken) {
      fetchInquiries();
      fetchDoubts();
      fetchAnalytics();
    }
  }, [adminToken, adminTab]);

  const handleFormLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('Please complete both fields.', 'error');
      return;
    }
    setIsLoggingIn(true);
    const success = await onLogin(username, password);
    setIsLoggingIn(false);
    if (success) {
      setUsername('');
      setPassword('');
      setAdminTab('overview');
    }
  };

  const handleInquiryStatusChange = async (inqId, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${inqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast('Inquiry status updated successfully.');
        fetchInquiries();
        fetchAnalytics();
      } else {
        showToast('Failed to update status.', 'error');
      }
    } catch (err) {
      showToast('Network error updating status.', 'error');
    }
  };

  const handleInquirySaveNotes = async (inqId) => {
    try {
      const res = await fetch(`/api/inquiries/${inqId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: counselorNotes })
      });
      if (res.ok) {
        showToast('Counselor feedback notes saved.');
        setEditingInquiryId(null);
        setCounselorNotes('');
        fetchInquiries();
      } else {
        showToast('Failed to save notes.', 'error');
      }
    } catch (err) {
      showToast('Network error saving notes.', 'error');
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDuration.trim() || !courseFee.trim()) {
      showToast('Please enter title, duration, and fee.', 'error');
      return;
    }

    const payload = {
      title: courseTitle,
      category: courseCategory,
      duration: courseDuration,
      fee: courseFee,
      description: courseDesc,
      benefits: courseBenefits
    };

    try {
      let res;
      if (isEditingCourse && editingCourseId) {
        // Edit Mode
        res = await fetch(`/api/courses/${editingCourseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Add Mode
        res = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showToast(isEditingCourse ? 'Course updated successfully!' : 'New course added successfully!');
        resetCourseForm();
        fetchCourses();
        fetchAnalytics();
      } else {
        showToast('Failed to save course changes.', 'error');
      }
    } catch (err) {
      showToast('Server connection error.', 'error');
    }
  };

  const resetCourseForm = () => {
    setIsEditingCourse(false);
    setEditingCourseId(null);
    setCourseTitle('');
    setCourseCategory('Basic Computers');
    setCourseDuration('');
    setCourseFee('');
    setCourseDesc('');
    setCourseBenefits('');
  };

  const handleEditCourseClick = (course) => {
    setIsEditingCourse(true);
    setEditingCourseId(course.id);
    setCourseTitle(course.title);
    setCourseCategory(course.category);
    setCourseDuration(course.duration);
    setCourseFee(course.fee);
    setCourseDesc(course.description);
    setCourseBenefits(course.benefits ? course.benefits.join(', ') : '');
    // Scroll form into view
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteCourseClick = async (courseId) => {
    if (!confirm('Are you sure you want to permanently delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Course was successfully deleted.');
        fetchCourses();
        fetchAnalytics();
      } else {
        showToast('Failed to delete course.', 'error');
      }
    } catch (err) {
      showToast('Connection error deleting course.', 'error');
    }
  };

  const handleDoubtReplySubmit = async (e, doubtId) => {
    e.preventDefault();
    if (!doubtReply.trim()) {
      showToast('Reply message cannot be empty.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/doubts/${doubtId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: doubtReply })
      });
      if (res.ok) {
        showToast('Doubt answered successfully! Email has been mocked.');
        setAnsweringDoubtId(null);
        setDoubtReply('');
        fetchDoubts();
      } else {
        showToast('Failed to send reply.', 'error');
      }
    } catch (err) {
      showToast('Server connection error.', 'error');
    }
  };

  // Render Login state first if not authenticated
  if (!adminToken) {
    return (
      <div className="admin-login-container glass animate-fade">
        <h2>Administrator Hub</h2>
        <p>Enter administrative credentials to access course configs and inquiries tracker.</p>
        
        <form onSubmit={handleFormLogin}>
          <div className="form-group">
            <label>Admin Username</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Security Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              💡 Demo credentials: Username: <code>admin</code> | Password: <code>dazzle@admin123</code>
            </p>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={isLoggingIn}>
            {isLoggingIn ? 'Verifying Credentials...' : 'Authenticate Login'}
          </button>
        </form>
      </div>
    );
  }

  // Active inquiries filtering
  const filteredInquiries = inquiries.filter(i => filterStatus === 'All' || i.status === filterStatus);

  return (
    <div className="admin-portal-wrapper animate-fade">
      {/* Header Board */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2>Admin Console Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <strong>{adminUser?.name || 'Administrator'}</strong> | Role: {adminUser?.role}</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onLogout}>
          Sign Out Console
        </button>
      </div>

      {/* Internal Navigation Menu Tabs */}
      <div className="course-controls" style={{ padding: '8px 16px', marginBottom: '30px' }}>
        <div className="course-filters">
          <button className={`filter-btn ${adminTab === 'overview' ? 'active' : ''}`} onClick={() => setAdminTab('overview')}>
            Overview Stats
          </button>
          <button className={`filter-btn ${adminTab === 'inquiries' ? 'active' : ''}`} onClick={() => setAdminTab('inquiries')}>
            Manage Inquiries ({inquiries.length})
          </button>
          <button className={`filter-btn ${adminTab === 'courses' ? 'active' : ''}`} onClick={() => setAdminTab('courses')}>
            Course CRUD Editor ({courses.length})
          </button>
          <button className={`filter-btn ${adminTab === 'doubts' ? 'active' : ''}`} onClick={() => setAdminTab('doubts')}>
            Q&A Doubt Solver ({doubts.filter(d => d.status === 'Pending').length} Pending)
          </button>
        </div>
      </div>

      {/* ====================================================================
          TAB 1: OVERVIEW STATS
          ==================================================================== */}
      {adminTab === 'overview' && analytics && (
        <div className="animate-fade">
          {/* Key metrics grid */}
          <div className="analytics-grid">
            <div className="glass analytic-card">
              <div className="analytic-icon">⚡</div>
              <div className="analytic-info">
                <h5>Total Inquiries</h5>
                <span className="analytic-num">{analytics.totalInquiries}</span>
              </div>
            </div>
            
            <div className="glass analytic-card">
              <div className="analytic-icon enrolled">✓</div>
              <div className="analytic-info">
                <h5>Enrolled Students</h5>
                <span className="analytic-num">{analytics.enrolledStudents}</span>
              </div>
            </div>

            <div className="glass analytic-card">
              <div className="analytic-icon pending">⌛</div>
              <div className="analytic-info">
                <h5>Pending Review</h5>
                <span className="analytic-num">{analytics.pendingInquiries}</span>
              </div>
            </div>

            <div className="glass analytic-card">
              <div className="analytic-icon doubts">💬</div>
              <div className="analytic-info">
                <h5>Unsolved Doubts</h5>
                <span className="analytic-num">{analytics.pendingDoubts}</span>
              </div>
            </div>
          </div>

          {/* Quick lists and charts */}
          <div className="admin-dashboard-split">
            {/* Recent inquiries */}
            <div className="glass" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Recent Registrations</h3>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Selected Course</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentInquiries.map(inq => (
                      <tr key={inq.id}>
                        <td>
                          <div style={{ fontWeight: '600' }}>{inq.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inq.phone}</div>
                        </td>
                        <td>{inq.courseTitle}</td>
                        <td>{inq.date}</td>
                        <td>
                          <span className={`status-badge ${inq.status}`} style={{ fontSize: '0.7rem' }}>
                            {inq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Course statistics distributions list */}
            <div className="glass" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Popular Course Analytics</h3>
              {analytics.courseBreakdown.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {analytics.courseBreakdown.map(item => {
                    const pct = analytics.totalInquiries > 0 ? Math.round((item.count / analytics.totalInquiries) * 100) : 0;
                    return (
                      <div key={item.courseId}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                          <span>{item.title}</span>
                          <span style={{ fontWeight: '700' }}>{item.count} Inq ({pct}%)</span>
                        </div>
                        {/* Custom visual progress bar */}
                        <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>No registrations registered yet to plot distributions.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 2: MANAGE INQUIRIES
          ==================================================================== */}
      {adminTab === 'inquiries' && (
        <div className="glass animate-fade" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)' }}>Student Inquiry & Admission Logs</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Filter status:</span>
              <select 
                className="form-control" 
                style={{ width: '160px', padding: '6px 12px' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Inquiries</option>
                <option value="Pending">Pending Review</option>
                <option value="Contacted">Contacted / Call Done</option>
                <option value="Enrolled">Enrolled / Confirmed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {filteredInquiries.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student Contact</th>
                    <th>Applied Course</th>
                    <th>Date</th>
                    <th>Status Action</th>
                    <th>Counselor Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map(inq => {
                    const course = courses.find(c => c.id === inq.courseId);
                    return (
                      <tr key={inq.id}>
                        <td>
                          <div style={{ fontWeight: '600' }}>{inq.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>☏ {inq.phone}</div>
                          {inq.email && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>✉ {inq.email}</div>}
                        </td>
                        <td>{course ? course.title : inq.courseId}</td>
                        <td>{inq.date}</td>
                        <td>
                          <select
                            className={`form-control status-badge ${inq.status}`}
                            style={{ padding: '4px 10px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid var(--border-glass)' }}
                            value={inq.status}
                            onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Enrolled">Enrolled</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td>
                          {editingInquiryId === inq.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <textarea 
                                className="form-control" 
                                style={{ minHeight: '60px', padding: '6px 8px', fontSize: '0.85rem' }}
                                value={counselorNotes}
                                onChange={(e) => setCounselorNotes(e.target.value)}
                              />
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button className="btn btn-primary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleInquirySaveNotes(inq.id)}>Save</button>
                                <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setEditingInquiryId(null)}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ maxWidth: '240px', fontSize: '0.85rem', color: 'var(--text-secondary)', position: 'relative' }}>
                              {inq.notes || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No follow-up notes</span>}
                              <button 
                                style={{ marginLeft: '8px', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.75rem' }}
                                onClick={() => {
                                  setEditingInquiryId(inq.id);
                                  setCounselorNotes(inq.notes || '');
                                }}
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>
                        <td>
                          <button 
                            className="table-action-btn delete"
                            onClick={async () => {
                              if (confirm('Delete this inquiry record?')) {
                                try {
                                  const res = await fetch(`/api/inquiries/${inq.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Rejected' }) });
                                  if (res.ok) { fetchInquiries(); }
                                } catch (e) {}
                              }
                            }}
                          >
                            Cancel/Reject
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>No inquiries matching selected status.</p>
          )}
        </div>
      )}

      {/* ====================================================================
          TAB 3: COURSE CRUD EDITOR
          ==================================================================== */}
      {adminTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* CRUD Form Drawer */}
          <div className="glass animate-fade" style={{ padding: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
              {isEditingCourse ? 'Modify Course Syllabus' : 'Host New Course Syllabus'}
            </h3>
            
            <form onSubmit={handleCourseSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Course Title *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Python Programming & AI"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course Category Group</label>
                  <select 
                    className="form-control"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                  >
                    <option value="Basic Computers">Basic Computers</option>
                    <option value="Programming">Programming Languages</option>
                    <option value="Professional Skills">Professional Skills</option>
                    <option value="Degrees & Tutoring">Academic Degrees & Tutoring</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Batch Duration *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 3 Months, 4 Weeks"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Enrollment Fee *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. ₹6,000, Call for pricing"
                    value={courseFee}
                    onChange={(e) => setCourseFee(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Syllabus Detailed Description</label>
                <textarea 
                  className="form-control"
                  placeholder="Elaborated summary of topics covered, lab targets..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Syllabus Highlights / Benefits (Comma separated strings)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. 100% Practical training, ISO Certified Exam, Cisco Packet Labs"
                  value={courseBenefits}
                  onChange={(e) => setCourseBenefits(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={resetCourseForm}>Cancel / Reset</button>
                <button type="submit" className="btn btn-primary">
                  {isEditingCourse ? 'Update Syllabus Config' : 'Publish Course Syllabus'}
                </button>
              </div>
            </form>
          </div>

          {/* Courses Active Catalog Listings */}
          <div className="glass" style={{ padding: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '20px' }}>Active Courses catalog ({courses.length})</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Course Title</th>
                    <th>Duration</th>
                    <th>Fee Config</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id}>
                      <td><span className="course-category-badge">{course.category}</span></td>
                      <td style={{ fontWeight: '700' }}>{course.title}</td>
                      <td>{course.duration}</td>
                      <td style={{ color: 'var(--success)', fontWeight: '600' }}>{course.fee}</td>
                      <td>
                        <button className="table-action-btn edit" onClick={() => handleEditCourseClick(course)}>Edit</button>
                        <button className="table-action-btn delete" onClick={() => handleDeleteCourseClick(course.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 4: Q&A DOUBT SOLVER
          ==================================================================== */}
      {adminTab === 'doubts' && (
        <div className="glass animate-fade" style={{ padding: '30px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '20px' }}>Counseling Doubt Resolver</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Answer general student inquiries and academic concerns submitted via the Doubt Solver widget.
          </p>

          {doubts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {doubts.map(dbt => (
                <div key={dbt.id} className="glass" style={{ padding: '24px', borderLeft: dbt.status === 'Answered' ? '4px solid var(--success)' : '4px solid var(--warning)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '1.1rem' }}>{dbt.name}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '12px' }}>✉ {dbt.email} | Asked: {dbt.date}</span>
                    </div>
                    <span className={`status-badge ${dbt.status === 'Answered' ? 'Enrolled' : 'Pending'}`} style={{ fontSize: '0.75rem' }}>
                      {dbt.status}
                    </span>
                  </div>

                  <p style={{ fontStyle: 'italic', background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Q: "{dbt.message}"
                  </p>

                  {dbt.status === 'Answered' ? (
                    <div style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                      <strong style={{ color: 'var(--success)' }}>✓ Submitted Reply:</strong>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>{dbt.reply}</p>
                    </div>
                  ) : (
                    <div>
                      {answeringDoubtId === dbt.id ? (
                        <form onSubmit={(e) => handleDoubtReplySubmit(e, dbt.id)}>
                          <div className="form-group">
                            <label>Draft Response Reply Message</label>
                            <textarea 
                              className="form-control"
                              placeholder="Write reply instructions to email to student..."
                              value={doubtReply}
                              onChange={(e) => setDoubtReply(e.target.value)}
                              required
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAnsweringDoubtId(null)}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm">Submit counselor Reply</button>
                          </div>
                        </form>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => {
                          setAnsweringDoubtId(dbt.id);
                          setDoubtReply('');
                        }}>
                          Resolve & Reply Doubt
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px 0' }}>No student doubt queries found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPortal;
