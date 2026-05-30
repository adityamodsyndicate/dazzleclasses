import React from 'react';

function Hero({ setActiveTab }) {
  const handleActionClick = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Slogan and details */}
          <div className="hero-content animate-fade">
            <div className="hero-badges">
              <span className="hero-badge iso">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                ISO 9001:2015 Certified
              </span>
              <span className="hero-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                100% Practical Training
              </span>
            </div>
            <h1>
              Code Your Success.<br />
              <span className="gradient-text">Build Your Future.</span>
            </h1>
            <p>
              Join Bahadurgarh's premium Computer Academy and vocational guidance hub. Empowring you with cutting-edge industry training, small focused batches, and expert academic coaching.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary glow-btn" onClick={() => handleActionClick('student-portal')}>
                Register/Enroll Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
              <button className="btn btn-secondary" onClick={() => handleActionClick('courses')}>
                Explore Courses
              </button>
            </div>
          </div>

          {/* Interactive Profile / Stat card */}
          <div className="hero-visual animate-float" style={{ animationDuration: '6s' }}>
            <div className="hero-visual-bg"></div>
            <div className="glass glass-card-hero">
              <div className="profile-header">
                <div className="profile-avatar-container">
                  <div className="profile-avatar">
                    {/* Generates a nice placeholder avatar image illustrating dynamic leadership */}
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" 
                      alt="Ms. Nisha Harit" 
                    />
                  </div>
                  <div className="avatar-badge" title="Co-Founder is Online"></div>
                </div>
                <div className="profile-info">
                  <h3>Ms. Nisha Harit</h3>
                  <p>CEO & Co-Founder</p>
                  <div className="profile-degrees">
                    D.Ed, B.Ed, BCA, MCA, PGDCA, ADSM
                  </div>
                </div>
              </div>

              <div className="pamphlet-stats">
                <div className="stat-item">
                  <span className="stat-num">4.9 ★</span>
                  <span className="stat-label">Google Rating (150+ reviews)</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">12,000+</span>
                  <span className="stat-label">Certified Alumni</span>
                </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <span className="hero-badge iso" style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'center', background: 'rgba(37,99,235,0.06)', borderColor: 'rgba(37,99,235,0.15)', color: 'var(--brand-blue)' }}>
                  ✓ ISO 9001:2015 Registered Institution
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Trust Info Panel - Physics Wallah Style */}
      <div className="banner-contact">
        <div className="container banner-contact-flex">
          {/* Phone Numbers */}
          <div className="contact-card">
            <div className="contact-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div className="contact-details">
              <span>Counselor Student Hotline</span>
              <p>+91 95881 47506, +91 87082 90618</p>
            </div>
          </div>

          {/* Email Address */}
          <div className="contact-card">
            <div className="contact-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="contact-details">
              <span>Admissions Office Email</span>
              <p>dazzlecomputerhub@gmail.com</p>
            </div>
          </div>

          {/* Location details */}
          <div 
            className="contact-card"
            style={{ cursor: 'pointer' }}
            onClick={() => window.open('https://www.google.com/maps/place/Dazzle+Academy+and+Computer+Hub/@28.6806587,76.9120523,17z/data=!4m6!3m5!1s0x390d0d99c845ebfd:0x62bd7d0bc002e9ea!8m2!3d28.6806587!4d76.9120523!16s%2Fg%2F11z74xpnc3', '_blank')}
            title="Open in Google Maps"
          >
            <div className="contact-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div className="contact-details">
              <span>Bahadurgarh Campus Address</span>
              <p>1st Floor, Jhajjar Road, Bahadurgarh, HR</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
