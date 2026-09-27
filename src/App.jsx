import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const STORAGE_KEY = 'atelier-forme-auth';
const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: 'The Meridian Loft',
    category: 'Urban living',
    description: 'A calm, tactile city home built around natural light and considered storage.',
    cover_image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 2,
    title: 'Sable Residence',
    category: 'Luxury home',
    description: 'Soft contrast, sculptural furniture, and warm stone create an easy sense of quiet luxury.',
    cover_image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 3,
    title: 'Noma Studio',
    category: 'Creative workspace',
    description: 'A high-energy studio with flexible zones for focused work and spontaneous collaboration.',
    cover_image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

const heroSlides = [
  {
    title: 'Curated spaces with intent.',
    subtitle: 'Warm, sculpted interiors for homes, boutique hotels, and modern living.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
    accent: 'Modern luxury',
    stats: ['250+ projects', '12 design awards', '4.9 client rating'],
  },
  {
    title: 'A home that feels premium.',
    subtitle: 'We blend tactile materials, ambient lighting, and tailored craftsmanship.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
    accent: 'Custom interiors',
    stats: ['From concept to styling', 'Bespoke finishes', 'Full project management'],
  },
  {
    title: 'Live beautifully, every day.',
    subtitle: 'From cozy apartments to standout commercial spaces, we design life around comfort.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
    accent: 'Biophilic calm',
    stats: ['Smart layouts', 'Natural textures', 'End-to-end styling'],
  },
];

const services = [
  { title: 'Interior design', text: 'Full-service design direction from concept boards to final styling.' },
  { title: 'Renovation planning', text: 'Space planning and build coordination with premium material advising.' },
  { title: 'Turnkey styling', text: 'Furniture, lighting, accessories, and final details that complete the story.' },
  { title: 'Commercial interiors', text: 'Boutique brands and hospitality spaces designed for memorable experiences.' },
];

const testimonials = [
  { name: 'Ariana M.', quote: 'The result feels like a luxury hotel, but it is completely ours.', role: 'Homeowner' },
  { name: 'Noah K.', quote: 'Every detail was considered. The team transformed our lounge beautifully.', role: 'Boutique owner' },
  { name: 'Mila S.', quote: 'Their design language is elegant, modern, and incredibly warm.', role: 'Interior client' },
];

const demoUsers = {
  admin: { email: 'admin@interior.com', password: 'Admin@123', role: 'admin', label: 'Admin' },
  employee: { email: 'employee@interior.com', password: 'Employee@123', role: 'employee', label: 'Employee' },
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_error) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('atelier-forme-token') || '');
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.ok ? res.json() : Promise.resolve(DEFAULT_PROJECTS))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch((error) => {
        console.error('Failed to load projects:', error);
        setProjects(DEFAULT_PROJECTS);
      });
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Session expired');
        }
        return response.json();
      })
      .then((payload) => {
        const nextUser = payload.user || null;
        if (nextUser) {
          setUser(nextUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        }
      })
      .catch(() => {
        setUser(null);
        setToken('');
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('atelier-forme-token');
      });
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('atelier-forme-token');
  };

  const handleLogin = async (email, password, role) => {
    const result = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const payload = await result.json();
    if (!result.ok) {
      throw new Error(payload.error || 'Login failed');
    }

    if (payload.user.role !== role) {
      throw new Error('Selected portal does not match account role');
    }

    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.user));
    localStorage.setItem('atelier-forme-token', payload.token);
    return payload.user;
  };

  return (
    <div className="app-shell">
      <Header user={user} logout={logout} />
      {apiError && <div className="api-error">API Error: {apiError}</div>}
      <Routes>
        <Route path="/" element={<LandingPage projects={projects} />} />
        <Route path="/projects" element={<ProjectsPage projects={projects} />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage projects={projects} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} user={user} />} />
        <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function Header({ user, logout }) {
  return (
    <header className="topbar">
      <Link to="/" className="brand-wrap">
        <div className="brand-mark">A</div>
        <div>
          <p className="eyebrow">Atelier Forme</p>
          <h1>Interior Studio</h1>
        </div>
      </Link>

      <nav className="nav-menu">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/#services">Services</NavLink>
        <NavLink to="/#contact">Contact</NavLink>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/dashboard" className="ghost-btn">Dashboard</Link>
            <button className="primary-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login?mode=employee" className="ghost-btn">Employee Login</Link>
            <Link to="/login?mode=admin" className="primary-btn">Admin Login</Link>
          </>
        )}
      </div>
    </header>
  );
}

function LandingPage({ projects }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    project: 'Residential interior design',
    message: '',
  });
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const activeSlide = heroSlides[slideIndex];

  const updateField = (event) => {
    const { name, value } = event.target;
    setLeadForm((current) => ({ ...current, [name]: value }));
  };

  const submitLead = async (event) => {
    event.preventDefault();
    const payload = { ...leadForm };

    const response = await fetch(`${API_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();

    if (!response.ok) {
      setLeadError(result.error || 'Unable to submit inquiry');
      return;
    }

    setLeadSuccess(true);
    setLeadError('');
    setLeadForm({
      name: '',
      email: '',
      phone: '',
      project: 'Residential interior design',
      message: '',
    });
    setTimeout(() => setLeadSuccess(false), 3000);
  };

  return (
    <main>
      <section className="hero-panel">
        <div className="hero-copy fade-up">
          <span className="tag-pill">{activeSlide.accent}</span>
          <h2>{activeSlide.title}</h2>
          <p>{activeSlide.subtitle}</p>
          <div className="cta-row">
            <a href="#contact" className="primary-btn wide">Book a consultation</a>
            <Link to="/dashboard" className="ghost-btn wide">View dashboard</Link>
          </div>
          <div className="bullet-list">
            {activeSlide.stats.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="hero-visual fade-up">
          <div className="slider-frame">
            <div className="slider-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
              {heroSlides.map((slide) => (
                <div key={slide.title} className="slide-card">
                  <img src={slide.image} alt={slide.title} />
                </div>
              ))}
            </div>
          </div>
          <div className="slider-dots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                className={index === slideIndex ? 'dot active' : 'dot'}
                onClick={() => setSlideIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="stats-band">
        <div><strong>8+</strong><span>Years of design</span></div>
        <div><strong>1.5K</strong><span>Furniture selections</span></div>
        <div><strong>94%</strong><span>Client retention</span></div>
        <div><strong>24/7</strong><span>On-site support</span></div>
      </section>

      <section className="section-header">
        <div>
          <p className="eyebrow muted">Selected projects</p>
          <h3>Real-world interiors, beautifully executed.</h3>
        </div>
        <Link to="/projects" className="text-link">See all projects</Link>
      </section>

      <section className="projects-grid">
        {projects.slice(0, 4).map((project, index) => (
          <article key={project.id || project.title} className="project-card fade-up" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="project-image-wrap">
              <img src={project.cover_image || project.gallery?.[0]} alt={project.title} />
            </div>
            <div className="project-copy">
              <span>{project.category}</span>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <Link to={`/projects/${project.id}`} className="card-link">View details</Link>
            </div>
          </article>
        ))}
      </section>

      <section id="services" className="services-panel">
        <div className="section-header align-start">
          <div>
            <p className="eyebrow muted">Our expertise</p>
            <h3>Premium living, designed for everyday ease.</h3>
          </div>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.title} className="service-card">
              <div className="service-icon">✦</div>
              <h4>{service.title}</h4>
              <p>{service.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonial-panel">
        {testimonials.map((item) => (
          <article key={item.name} className="testimonial-card">
            <p>"{item.quote}"</p>
            <div>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </div>
          </article>
        ))}
      </section>

      <section id="contact" className="lead-panel">
        <div className="lead-copy">
          <p className="eyebrow muted">Lead generation</p>
          <h3>Tell us what you want to create.</h3>
          <p>Whether it is a new residence, a boutique layout, or a full property refresh, we will help shape the right story.</p>
          <a className="primary-btn wide wa-button" href="https://wa.me/15550000000?text=Hi%20Atelier%20Forme%2C%20I%27d%20like%20to%20book%20a%20consultation." target="_blank" rel="noreferrer">
            WhatsApp Concierge
          </a>
        </div>

        <form className="lead-form" onSubmit={submitLead}>
          <div className="field-row">
            <label>
              Name
              <input name="name" value={leadForm.name} onChange={updateField} placeholder="Your full name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={leadForm.email} onChange={updateField} placeholder="you@example.com" required />
            </label>
          </div>
          <div className="field-row">
            <label>
              Phone
              <input name="phone" value={leadForm.phone} onChange={updateField} placeholder="+1 (555) 000-0000" required />
            </label>
            <label>
              Project type
              <select name="project" value={leadForm.project} onChange={updateField}>
                <option value="Residential interior design">Residential interior design</option>
                <option value="Commercial refurbishment">Commercial refurbishment</option>
                <option value="Turnkey styling">Turnkey styling</option>
                <option value="Full-home renovation">Full-home renovation</option>
              </select>
            </label>
          </div>
          <label>
            Project brief
            <textarea name="message" value={leadForm.message} onChange={updateField} rows="4" placeholder="Tell us about your space, timeline, and design goals..." required />
          </label>
          <button className="primary-btn wide" type="submit">Send inquiry</button>
          {leadSuccess && <p className="status-badge">Your inquiry has been received successfully.</p>}
          {leadError && <p className="error-text">{leadError}</p>}
        </form>
      </section>
    </main>
  );
}

function ProjectsPage({ projects }) {
  return (
    <main className="content-page">
      <section className="section-header">
        <div>
          <p className="eyebrow muted">Portfolio</p>
          <h3>Interior stories worth living in.</h3>
        </div>
      </section>
      <section className="projects-grid large-grid">
        {projects.map((project) => (
          <article key={project.id || project.title} className="project-card">
            <div className="project-image-wrap">
              <img src={project.cover_image || project.gallery?.[0]} alt={project.title} />
            </div>
            <div className="project-copy">
              <span>{project.category}</span>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <Link to={`/projects/${project.id}`} className="card-link">Explore project</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function ProjectDetailPage({ projects }) {
  const { projectId } = useParams();
  const project = projects.find((item) => String(item.id) === String(projectId));

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <main className="content-page">
      <section className="project-detail-header">
        <div>
          <p className="eyebrow muted">{project.category}</p>
          <h3>{project.title}</h3>
        </div>
        <Link to="/projects" className="ghost-btn">Back to portfolio</Link>
      </section>

      <section className="project-detail-hero">
        <img src={project.cover_image || project.gallery?.[0]} alt={project.title} />
      </section>

      <section className="project-detail-body">
        <div>
          <h4>Project overview</h4>
          <p>{project.description}</p>
        </div>
        <div className="detail-callout">
          <span>Design brief</span>
          <strong>Premium, functional, and warm</strong>
          <a className="primary-btn wide" href="https://wa.me/15550000000?text=Hi%20Atelier%20Forme%2C%20I%20want%20to%20discuss%20this%20project%20concept." target="_blank" rel="noreferrer">Book a call</a>
        </div>
      </section>

      <section className="gallery-grid">
        {(project.gallery || []).map((image, index) => (
          <img key={`${project.id}-${index}`} src={image} alt={`${project.title} gallery ${index + 1}`} />
        ))}
      </section>
    </main>
  );
}

function LoginPage({ onLogin, user }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(new URLSearchParams(window.location.search).get('mode') || 'admin');
  const [email, setEmail] = useState(demoUsers[mode].email);
  const [password, setPassword] = useState(demoUsers[mode].password);
  const [error, setError] = useState('');

  useEffect(() => {
    const nextMode = new URLSearchParams(window.location.search).get('mode') || 'admin';
    setMode(nextMode);
    setEmail(demoUsers[nextMode].email);
    setPassword(demoUsers[nextMode].password);
  }, [window.location.search]);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const submitLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await onLogin(email, password, mode);
      navigate('/dashboard');
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in');
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="portal-header">
          <p className="eyebrow muted">Access portal</p>
          <h3>{mode === 'admin' ? 'Administrative login' : 'Employee login'}</h3>
        </div>

        <form className="login-form" onSubmit={submitLogin}>
          <div className="portal-segment">
            <button type="button" className={mode === 'admin' ? 'segment active' : 'segment'} onClick={() => {
              setMode('admin');
              setEmail(demoUsers.admin.email);
              setPassword(demoUsers.admin.password);
              window.history.pushState({}, '', '/login?mode=admin');
            }}>
              Admin
            </button>
            <button type="button" className={mode === 'employee' ? 'segment active' : 'segment'} onClick={() => {
              setMode('employee');
              setEmail(demoUsers.employee.email);
              setPassword(demoUsers.employee.password);
              window.history.pushState({}, '', '/login?mode=employee');
            }}>
              Employee
            </button>
          </div>

          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <button type="submit" className="primary-btn wide">Sign in</button>
          <p className="demo-note">Demo: {demoUsers[mode].email} / {demoUsers[mode].password}</p>
          {error && <p className="error-text">{error}</p>}
        </form>
      </section>
    </main>
  );
}

function DashboardPage({ user }) {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, closed: 0, revenue: '$0' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('atelier-forme-token');
    if (!token) return;

    fetch(`${API_URL}/api/leads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.ok ? response.json() : [])
      .then((rows) => {
        setLeads(rows);
        const newCount = rows.filter((item) => item.status === 'new').length;
        setStats({
          total: rows.length,
          new: newCount,
          closed: rows.filter((item) => item.status === 'closed').length,
          revenue: '$86K',
        });
        setLoading(false);
      })
      .catch(() => {
        setLeads([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <main className="dashboard-page"><p>Loading...</p></main>;

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow muted">Dashboard</p>
          <h3>Welcome back, {user.name}</h3>
        </div>
        <Link to="/" className="ghost-btn">View website</Link>
      </section>

      <section className="dashboard-summary">
        <div className="summary-card"><span>Total leads</span><strong>{stats.total}</strong></div>
        <div className="summary-card"><span>New</span><strong>{stats.new}</strong></div>
        <div className="summary-card"><span>Closed</span><strong>{stats.closed}</strong></div>
        <div className="summary-card"><span>Revenue</span><strong>{stats.revenue}</strong></div>
      </section>

      <section className="dashboard-grid">
        <div className="panel-block">
          <h4>Recent inquiries</h4>
          {leads.length === 0 ? (
            <p className="empty-state">No leads yet. The website is quiet right now.</p>
          ) : (
            <ul className="lead-list">
              {leads.slice(0, 8).map((lead) => (
                <li key={lead.id}>
                  <div>
                    <strong>{lead.name}</strong>
                    <span>{lead.project}</span>
                  </div>
                  <small>{new Date(lead.created_at).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel-block">
          <h4>Operations</h4>
          <ul className="quick-actions">
            <li>Project update review</li>
            <li>Material procurement board</li>
            <li>Property styling checklist</li>
            <li>Client follow-up queue</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default App;
