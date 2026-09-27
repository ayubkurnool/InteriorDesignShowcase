import { useEffect, useMemo, useState } from 'react';

const heroSlides = [
  {
    title: 'Curated spaces with intent.',
    subtitle: 'Warm, sculpted interiors for homes, boutique hotels, and modern living.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
    accent: 'Modern luxury',
    stats: ['250+ projects', '12 design awards', '4.9 client rating'],
  },
  {
    title: 'A home that feels premium.',
    subtitle: 'We blend tactile materials, ambient lighting, and tailored craftsmanship.',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
    accent: 'Custom interiors',
    stats: ['From concept to styling', 'Bespoke finishes', 'Full project management'],
  },
  {
    title: 'Live beautifully, every day.',
    subtitle: 'From cozy apartments to standout commercial spaces, we design life around comfort.',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
    accent: 'Biophilic calm',
    stats: ['Smart layouts', 'Natural textures', 'End-to-end styling'],
  },
];

const portfolioProjects = [
  {
    title: 'The Meridian Loft',
    category: 'Urban living',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    tag: 'Architectural calm',
  },
  {
    title: 'Sable Residence',
    category: 'Luxury home',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    tag: 'Soft contrast',
  },
  {
    title: 'Noma Studio',
    category: 'Creative workspace',
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    tag: 'Productive flow',
  },
  {
    title: 'Maison Miro',
    category: 'Boutique villa',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    tag: 'Warm minimalism',
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

const defaultCredentials = {
  admin: { email: 'admin@interior.com', password: 'Admin@123', role: 'Admin' },
  employee: { email: 'employee@interior.com', password: 'Employee@123', role: 'Employee' },
};

const getStoredLeads = () => {
  try {
    const items = localStorage.getItem('interiorLeads');
    return items ? JSON.parse(items) : [];
  } catch (error) {
    return [];
  }
};

function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    project: 'Residential interior design',
    message: '',
  });
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [portalType, setPortalType] = useState('admin');
  const [authUser, setAuthUser] = useState(() => {
    try {
      const saved = localStorage.getItem('interiorAuth');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      return null;
    }
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [leads, setLeads] = useState(getStoredLeads());

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('interiorLeads', JSON.stringify(leads));
  }, [leads]);

  const activeSlide = heroSlides[slideIndex];

  const dashboardStats = useMemo(
    () => [
      { label: 'New leads', value: String(leads.length) },
      { label: 'Design jobs', value: '23' },
      { label: 'Monthly revenue', value: '$86K' },
      { label: 'Team hours', value: '1,240' },
    ],
    [leads.length]
  );

  const handleLeadChange = (event) => {
    const { name, value } = event.target;
    setLeadForm((current) => ({ ...current, [name]: value }));
  };

  const handleLeadSubmit = (event) => {
    event.preventDefault();

    const nextLead = {
      id: Date.now().toString(),
      name: leadForm.name,
      email: leadForm.email,
      phone: leadForm.phone,
      project: leadForm.project,
      message: leadForm.message,
      createdAt: new Date().toISOString(),
    };

    setLeads((current) => [nextLead, ...current]);
    setLeadSuccess(true);
    setLeadForm({
      name: '',
      email: '',
      phone: '',
      project: 'Residential interior design',
      message: '',
    });

    setTimeout(() => setLeadSuccess(false), 3000);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const credentials = defaultCredentials[portalType];
    if (
      loginForm.email.trim() === credentials.email &&
      loginForm.password === credentials.password
    ) {
      const user = { name: credentials.role === 'Admin' ? 'Ava Hart' : 'Leah Chen', role: credentials.role };
      setAuthUser(user);
      localStorage.setItem('interiorAuth', JSON.stringify(user));
      setLoginError('');
      setLoginForm({ email: '', password: '' });
      return;
    }

    setLoginError('Invalid credentials. Please try the demo login for this portal.');
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem('interiorAuth');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">A</div>
          <div>
            <p className="eyebrow">Atelier Forme</p>
            <h1>Interior Studio</h1>
          </div>
        </div>

        <nav className="nav-menu">
          <a href="#about">About</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <button className="ghost-btn" onClick={() => setPortalType('employee')}>
            Employee Login
          </button>
          <button className="primary-btn" onClick={() => setPortalType('admin')}>
            Admin Login
          </button>
        </div>
      </header>

      <main>
        <section className="hero-panel">
          <div className="hero-copy fade-up">
            <span className="tag-pill">{activeSlide.accent}</span>
            <h2>{activeSlide.title}</h2>
            <p>{activeSlide.subtitle}</p>
            <div className="cta-row">
              <a href="#contact" className="primary-btn wide">
                Book a consultation
              </a>
              <button className="ghost-btn wide" onClick={() => setPortalType('admin')}>
                View dashboard
              </button>
            </div>
            <div className="bullet-list">
              {activeSlide.stats.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="hero-visual fade-up">
            <div className="slider-frame">
              <div
                className="slider-track"
                style={{ transform: `translateX(-${slideIndex * 100}%)` }}
              >
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
          <div>
            <strong>8+</strong>
            <span>Years of design</span>
          </div>
          <div>
            <strong>1.5K</strong>
            <span>Furniture selections</span>
          </div>
          <div>
            <strong>94%</strong>
            <span>Client retention</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>On-site support</span>
          </div>
        </section>

        <section id="portfolio" className="section-header">
          <div>
            <p className="eyebrow muted">Selected projects</p>
            <h3>Real-world interiors, beautifully executed.</h3>
          </div>
          <a href="#contact" className="text-link">Start a project</a>
        </section>

        <section className="projects-grid">
          {portfolioProjects.map((project, index) => (
            <article key={project.title} className="project-card fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="project-image-wrap">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-copy">
                <span>{project.category}</span>
                <h4>{project.title}</h4>
                <p>{project.tag}</p>
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
              <p>“{item.quote}”</p>
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
            <p>
              Whether it is a new residence, a boutique layout, or a full property refresh, we will help shape the right story.
            </p>
          </div>

          <form className="lead-form" onSubmit={handleLeadSubmit}>
            <div className="field-row">
              <label>
                Name
                <input name="name" value={leadForm.name} onChange={handleLeadChange} placeholder="Your full name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={leadForm.email} onChange={handleLeadChange} placeholder="you@example.com" required />
              </label>
            </div>
            <div className="field-row">
              <label>
                Phone
                <input name="phone" value={leadForm.phone} onChange={handleLeadChange} placeholder="+1 (555) 000-0000" required />
              </label>
              <label>
                Project type
                <select name="project" value={leadForm.project} onChange={handleLeadChange}>
                  <option value="Residential interior design">Residential interior design</option>
                  <option value="Commercial refurbishment">Commercial refurbishment</option>
                  <option value="Turnkey styling">Turnkey styling</option>
                  <option value="Full-home renovation">Full-home renovation</option>
                </select>
              </label>
            </div>
            <label>
              Project brief
              <textarea
                name="message"
                value={leadForm.message}
                onChange={handleLeadChange}
                rows="4"
                placeholder="Tell us about your space, timeline, and design goals..."
                required
              />
            </label>

            <button className="primary-btn wide" type="submit">
              Send inquiry
            </button>
            {leadSuccess && <p className="status-badge">Your inquiry has been received successfully.</p>}
          </form>
        </section>
      </main>

      <aside className="portal-panel">
        <div className="portal-header">
          <p className="eyebrow muted">Access portal</p>
          <h3>{portalType === 'admin' ? 'Administrative login' : 'Employee login'}</h3>
        </div>

        {!authUser ? (
          <form className="login-form" onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="name@company.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter password"
                required
              />
            </label>
            <div className="portal-segment">
              <button type="button" className={portalType === 'admin' ? 'segment active' : 'segment'} onClick={() => setPortalType('admin')}>
                Admin
              </button>
              <button type="button" className={portalType === 'employee' ? 'segment active' : 'segment'} onClick={() => setPortalType('employee')}>
                Employee
              </button>
            </div>
            <button type="submit" className="primary-btn wide">
              Sign in
            </button>
            <p className="demo-note">
              Demo credentials: {defaultCredentials[portalType].email} / {defaultCredentials[portalType].password}
            </p>
            {loginError && <p className="error-text">{loginError}</p>}
          </form>
        ) : (
          <div className="dashboard-box">
            <div className="dashboard-topline">
              <div>
                <p className="eyebrow muted">Signed in</p>
                <h4>{authUser.name}</h4>
              </div>
              <button className="ghost-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="dashboard-summary">
              {dashboardStats.map((stat) => (
                <div key={stat.label} className="summary-card">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>

            <div className="lead-table">
              <h5>Recent leads</h5>
              {leads.length === 0 ? (
                <p>No incoming leads yet.</p>
              ) : (
                <ul>
                  {leads.slice(0, 4).map((lead) => (
                    <li key={lead.id}>
                      <div>
                        <strong>{lead.name}</strong>
                        <span>{lead.project}</span>
                      </div>
                      <small>{new Date(lead.createdAt).toLocaleDateString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default App;
