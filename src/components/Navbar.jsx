import React, { useState, useEffect } from 'react';

function Navbar({ activeTab, setActiveTab, theme, toggleTheme, adminToken, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Branding Logo */}
        <div className="logo-section" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('home')}>
          <div className="logo-icon">⚡</div>
          <div className="logo-text">
            <span className="logo-main">DAZZLE</span>
            <span className="logo-sub">Academy & Computer Hub</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <span 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} 
            onClick={() => handleNavClick('home')}
          >
            Home
          </span>
          <span 
            className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`} 
            onClick={() => handleNavClick('courses')}
          >
            Courses offered
          </span>
          <span 
            className={`nav-link ${activeTab === 'student-portal' ? 'active' : ''}`} 
            onClick={() => handleNavClick('student-portal')}
          >
            Student Panel
          </span>
          <span 
            className={`nav-link ${activeTab === 'admin-portal' ? 'active' : ''}`} 
            onClick={() => handleNavClick('admin-portal')}
          >
            Admin Panel {adminToken && <span style={{ color: 'var(--success)', fontSize: '0.7rem' }}>●</span>}
          </span>
        </nav>

        {/* Global Action Buttons */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>

          {/* Unified Login Portal Dropdown Selector */}
          <div style={{ position: 'relative' }}>
            {adminToken ? (
              <button className="btn btn-secondary btn-sm" onClick={onLogout}>
                Logout Admin
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-sm glow-btn" 
                onClick={() => setLoginDropdownOpen(prev => !prev)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Login</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: loginDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            )}

            {/* Dropdown Floating Options Card */}
            {loginDropdownOpen && !adminToken && (
              <>
                {/* Backdrop overlay to close when clicking outside */}
                <div 
                  onClick={() => setLoginDropdownOpen(false)}
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
                />
                
                <div className="glass login-dropdown-card animate-fade" style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: '280px',
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-glass)',
                  padding: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {/* Option 1: Student Portal */}
                  <div 
                    className="login-dropdown-item" 
                    onClick={() => {
                      handleNavClick('student-portal');
                      setLoginDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <span style={{ fontSize: '1.3rem', marginTop: '2px' }}>👤</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '750', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Student Portal</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3', marginTop: '2px' }}>Submit inquiries, track slots & ask doubts</span>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div style={{ height: '1px', background: 'var(--border-glass)', margin: '4px 0' }}></div>

                  {/* Option 2: Admin Portal */}
                  <div 
                    className="login-dropdown-item" 
                    onClick={() => {
                      handleNavClick('admin-portal');
                      setLoginDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '12px',
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <span style={{ fontSize: '1.3rem', marginTop: '2px' }}>🛡️</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '750', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Admin Portal</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3', marginTop: '2px' }}>Manage courses, review applications & Q&As</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Hamburger Mobile Menu Toggle */}
          <button 
            className="theme-toggle mobile-menu-toggle" 
            style={{ display: 'none' }} /* Simple display handling in CSS for mobile views */
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer glass animate-fade" style={{
          position: 'absolute',
          top: '100%',
          left: '24px',
          right: '24px',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-glass)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginTop: '10px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 999
        }}>
          <span 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            style={{ padding: '8px' }}
            onClick={() => handleNavClick('home')}
          >
            Home
          </span>
          <span 
            className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
            style={{ padding: '8px' }}
            onClick={() => handleNavClick('courses')}
          >
            Courses offered
          </span>
          <span 
            className={`nav-link ${activeTab === 'student-portal' ? 'active' : ''}`}
            style={{ padding: '8px' }}
            onClick={() => handleNavClick('student-portal')}
          >
            Student Panel
          </span>
          <span 
            className={`nav-link ${activeTab === 'admin-portal' ? 'active' : ''}`}
            style={{ padding: '8px' }}
            onClick={() => handleNavClick('admin-portal')}
          >
            Admin Panel
          </span>
        </div>
      )}
    </header>
  );
}

export default Navbar;
