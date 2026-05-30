import React from 'react';

function Footer({ setActiveTab }) {
  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-glass)' }}>
      <div className="container footer-top">
        <div className="footer-grid">
          
          {/* Brand details and ISO badges */}
          <div className="footer-brand animate-fade">
            <div className="logo-section" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('home')}>
              <div className="logo-icon">⚡</div>
              <div className="logo-text">
                <span className="logo-main" style={{ color: 'var(--text-primary)' }}>DAZZLE</span>
                <span className="logo-sub" style={{ color: 'var(--secondary)' }}>Academy & Computer Hub</span>
              </div>
            </div>
            <p>
              An ISO 9001:2015 Certified computer training center. Offering vocational certifications, JBT/B.Ed guidelines, and programming courses since inception.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="hero-badge iso" style={{ fontSize: '0.75rem' }}>ISO 9001:2015 Certified</span>
              <span className="hero-badge" style={{ fontSize: '0.75rem', color: 'var(--success)' }}>100% Practical Labs</span>
            </div>
          </div>

          {/* Quick links navigation */}
          <div className="animate-fade" style={{ animationDelay: '0.1s' }}>
            <h4 className="footer-head">Navigation</h4>
            <ul className="footer-links">
              <li><span style={{ cursor: 'pointer' }} onClick={() => handleNavClick('home')}>Home Portal</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => handleNavClick('courses')}>Courses catalog</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => handleNavClick('student-portal')}>Student Panel</span></li>
              <li><span style={{ cursor: 'pointer' }} onClick={() => handleNavClick('admin-portal')}>Admin Panel Login</span></li>
            </ul>
          </div>

          {/* Location details card & mock maps */}
          <div className="animate-fade" style={{ animationDelay: '0.2s' }}>
            <h4 className="footer-head">Locate Our Hub</h4>
            <div className="glass" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>Dazzle Academy</strong><br />
                  1st Floor, Jhajjar Road,<br />
                  Opposite ITI College,<br />
                  Bahadurgarh, Haryana - 124507
                </div>
              </div>
              
              {/* Mock Google Maps visual panel */}
              <div style={{ 
                height: '110px', 
                background: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-sm)', 
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={() => window.open('https://www.google.com/maps/place/Dazzle+Academy+and+Computer+Hub/@28.6806587,76.9120523,17z/data=!4m6!3m5!1s0x390d0d99c845ebfd:0x62bd7d0bc002e9ea!8m2!3d28.6806587!4d76.9120523!16s%2Fg%2F11z74xpnc3', '_blank')}
              title="Click to view on Google Maps"
              >
                <div style={{
                  position: 'absolute',
                  width: '150%',
                  height: '150%',
                  backgroundImage: 'radial-gradient(var(--border-glass) 1px, transparent 0)',
                  backgroundSize: '12px 12px',
                  opacity: 0.4
                }}></div>
                <div style={{
                  position: 'absolute',
                  width: '28px',
                  height: '28px',
                  background: 'var(--danger)',
                  borderRadius: '50% 50% 50% 0',
                  transform: 'rotate(-45deg) translate(2px, -2px)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  zIndex: 2
                }}>
                  <span style={{ transform: 'rotate(45deg)', display: 'block', fontSize: '1.2rem', marginTop: '-3px' }}>•</span>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  background: 'rgba(11, 15, 25, 0.8)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  color: '#fff',
                  border: '1px solid var(--border-glass)',
                  zIndex: 3
                }}>
                  Open Google Maps ↗
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Dazzle Academy & Computer Hub. All Rights Reserved. ISO 9001:2015 Registered.</p>
          <p style={{ fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-muted)' }}>
            Code Your Success. Build Your Future. Developed in Bahadurgarh.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
