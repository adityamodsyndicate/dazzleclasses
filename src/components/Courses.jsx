import React, { useState } from 'react';

function Courses({ courses, showTitle = true, showToast, onInquirySubmitted }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [inquiryCourse, setInquiryCourse] = useState(null);

  // Form states for quick enrollment
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derive unique categories dynamically
  const categories = ['All', ...new Set(courses.map(c => c.category))];

  // Filters logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !inquiryCourse) {
      showToast('Please fill out all mandatory fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          courseId: inquiryCourse.id,
          notes: notes || `Interested in ${inquiryCourse.title}`
        })
      });

      if (res.ok) {
        showToast(`Inquiry for ${inquiryCourse.title} submitted successfully! Our counselors will contact you shortly.`);
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
        setInquiryCourse(null); // Close modal
        if (onInquirySubmitted) onInquirySubmitted();
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'Failed to submit inquiry.', 'error');
      }
    } catch (err) {
      showToast('Network error while submitting inquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openInquiryModal = (course) => {
    setInquiryCourse(course);
    setSelectedCourse(null); // close learn more modal if open
  };

  return (
    <div className="courses-wrapper">
      {showTitle && (
        <div className="section-header">
          <h2>Explore Programs</h2>
          <p>Choose from our extensive technical and academic syllabus.</p>
        </div>
      )}

      {/* Searching and Categorization Dashboard */}
      <div className="course-controls animate-fade">
        <div className="course-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Grid Layout */}
      {filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map((course, idx) => (
            <div 
              key={course.id} 
              className="glass course-card animate-fade"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="course-card-header">
                <span className="course-category-badge">{course.category}</span>
                <span className="course-duration">{course.duration}</span>
              </div>
              <h3>{course.title}</h3>
              <p className="course-desc">{course.description}</p>
              
              <div className="course-card-footer">
                <div className="course-fee">
                  <span className="fee-label">Course Fee</span>
                  <span className="fee-val">{course.fee}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => setSelectedCourse(course)}
                  >
                    Details
                  </button>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => openInquiryModal(course)}
                  >
                    Quick Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass" style={{ textAlign: 'center', padding: '60px', borderRadius: 'var(--radius-lg)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)', marginBottom: '16px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No courses match your search</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try broadening your keywords or resetting filters.</p>
        </div>
      )}

      {/* MODAL 1: LEARN MORE / COURSE DETAILS */}
      {selectedCourse && (
        <div className="modal-backdrop" onClick={() => setSelectedCourse(null)}>
          <div className="glass modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCourse.title} Details</h3>
              <button className="modal-close" onClick={() => setSelectedCourse(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <span className="course-category-badge">{selectedCourse.category}</span>
                <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>Duration: {selectedCourse.duration}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '1.05rem', lineHeight: '1.7' }}>
                {selectedCourse.description}
              </p>

              {/* Course Benefits Bulletpoints */}
              {selectedCourse.benefits && selectedCourse.benefits.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ marginBottom: '12px', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Syllabus Perks & Benefits</h4>
                  <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {selectedCourse.benefits.map((benefit, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
                <div>
                  <span className="fee-label">Course Fee: </span>
                  <span className="fee-val" style={{ fontSize: '1.6rem' }}>{selectedCourse.fee}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={() => setSelectedCourse(null)}>Close Details</button>
                  <button className="btn btn-primary" onClick={() => openInquiryModal(selectedCourse)}>Inquire Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INQUIRY FORM MODAL */}
      {inquiryCourse && (
        <div className="modal-backdrop" onClick={() => setInquiryCourse(null)}>
          <div className="glass modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>Enrollment Inquiry</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginTop: '4px' }}>Course: {inquiryCourse.title}</p>
              </div>
              <button className="modal-close" onClick={() => setInquiryCourse(null)}>×</button>
            </div>
            <form onSubmit={handleInquirySubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="student-name">Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    id="student-name"
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="student-phone">WhatsApp / Phone Number <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input
                      id="student-phone"
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="student-email">Email Address</label>
                    <input
                      id="student-email"
                      type="email"
                      className="form-control"
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="student-message">Batch / Queries or Timings Preference</label>
                  <textarea
                    id="student-message"
                    className="form-control"
                    placeholder="Wants morning batch, regular days classes, college guidance details etc..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '20px 30px', borderTop: '1px solid var(--border-glass)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setInquiryCourse(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
