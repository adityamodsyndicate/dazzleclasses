import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Courses from './components/Courses';
import StudentPortal from './components/StudentPortal';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [courses, setCourses] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('adminUser')) || null);
  const [toast, setToast] = useState(null);

  // Setup theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load Initial Public Data
  useEffect(() => {
    fetchCourses();
    fetchDoubts();
  }, []);

  // Load Admin Data when authenticated
  useEffect(() => {
    if (adminToken) {
      fetchInquiries();
      fetchAnalytics();
    }
  }, [adminToken]);

  // Alert Banner Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
  };

  const fetchDoubts = async () => {
    try {
      const res = await fetch('/api/doubts');
      if (res.ok) {
        const data = await res.json();
        setDoubts(data);
      }
    } catch (err) {
      console.error('Error fetching doubts:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleAdminLogin = async (username, password) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        setAdminToken(data.token);
        setAdminUser(data.user);
        showToast(`Welcome back, ${data.user.name}! Login successful.`, 'success');
        return true;
      } else {
        showToast(data.message || 'Login failed. Invalid credentials.', 'error');
        return false;
      }
    } catch (err) {
      showToast('Connection to server failed.', 'error');
      return false;
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setAdminUser(null);
    showToast('Admin logged out successfully.');
    setActiveTab('home');
  };

  return (
    <div className="app-layout">
      {/* Dynamic Top Announcement Notice - PW.Live Style */}
      <div className="admission-ticker">
        <span className="badge">Admission Notice</span>
        <span>🔥 Summer Intake Batches for Classes (June-July 2026) are filling fast! Secure up to 40% scholarship today!</span>
      </div>

      {/* Sticky Top Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        adminToken={adminToken}
        onLogout={handleAdminLogout}
      />

      {/* Main Content Router */}
      <main className="main-content">
        {activeTab === 'home' && (
          <div className="home-container animate-fade">
            <Hero setActiveTab={setActiveTab} />
            
            {/* Quick About & USP Section */}
            <section className="usp-section section-padding">
              <div className="container">
                <div className="section-header">
                  <h2>Why Dazzle Academy?</h2>
                  <p>We provide industry-relevant computing and vocational education tailored for your success.</p>
                </div>
                <div className="pamphlet-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
                  <div className="stat-item glass">
                    <span className="stat-num">100%</span>
                    <span className="stat-label">Practical Training in Modern Labs</span>
                  </div>
                  <div className="stat-item glass">
                    <span className="stat-num">Small</span>
                    <span className="stat-label">Batches with Individual Care</span>
                  </div>
                  <div className="stat-item glass">
                    <span className="stat-num">Expert</span>
                    <span className="stat-label">Guidance & Mock Exams</span>
                  </div>
                  <div className="stat-item glass">
                    <span className="stat-num">ISO</span>
                    <span className="stat-label">9001:2015 Certified Center</span>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Courses Preview */}
            <section className="courses-preview-section section-padding" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-glass)' }}>
              <div className="container">
                <div className="section-header">
                  <h2>Popular Programs</h2>
                  <p>Explore some of our high-demand professional certification courses.</p>
                </div>
                <Courses 
                  courses={courses.slice(0, 6)} 
                  showTitle={false} 
                  showToast={showToast} 
                  onInquirySubmitted={() => {
                    fetchInquiries();
                    fetchAnalytics();
                  }}
                />
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button className="btn btn-primary" onClick={() => setActiveTab('courses')}>
                    View All Courses Catalog
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="container section-padding animate-fade">
            <div className="section-header">
              <h2>Our Comprehensive Courses</h2>
              <p>Find the perfect computer, engineering, or vocational course designed to accelerate your growth.</p>
            </div>
            <Courses 
              courses={courses} 
              showTitle={false} 
              showToast={showToast}
              onInquirySubmitted={() => {
                fetchInquiries();
                fetchAnalytics();
              }}
            />
          </div>
        )}

        {activeTab === 'student-portal' && (
          <div className="container section-padding animate-fade">
            <StudentPortal 
              courses={courses} 
              doubts={doubts} 
              fetchDoubts={fetchDoubts} 
              showToast={showToast}
            />
          </div>
        )}

        {activeTab === 'admin-portal' && (
          <div className="container section-padding animate-fade">
            <AdminPortal 
              adminToken={adminToken}
              adminUser={adminUser}
              onLogin={handleAdminLogin}
              onLogout={handleAdminLogout}
              courses={courses}
              inquiries={inquiries}
              doubts={doubts}
              analytics={analytics}
              fetchCourses={fetchCourses}
              fetchInquiries={fetchInquiries}
              fetchDoubts={fetchDoubts}
              fetchAnalytics={fetchAnalytics}
              showToast={showToast}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Global Alert Notification */}
      {toast && (
        <div className={`alert-toast ${toast.type}`}>
          {toast.type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
