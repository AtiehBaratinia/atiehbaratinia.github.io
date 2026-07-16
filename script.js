(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('atieh-theme'); } catch { /* Storage may be blocked in strict privacy contexts. */ }
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  themeToggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('atieh-theme', next); } catch { /* Theme still works for this visit. */ }
  });

  // Mobile navigation
  const closeMenu = () => {
    navLinks?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navLinks?.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));

  // Header and active nav section
  const sections = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a')];
  const setActiveNav = () => {
    header?.classList.toggle('scrolled', window.scrollY > 16);
    const marker = window.scrollY + window.innerHeight * 0.35;
    let current = '';
    sections.forEach(section => {
      if (section.offsetTop <= marker) current = section.id;
    });
    navAnchors.forEach(anchor => anchor.classList.toggle('active', anchor.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  // Reveal animation
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}ms`);
  });
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // Cursor glow
  const glow = document.querySelector('.cursor-glow');
  if (glow && !prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', event => {
      glow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    }, { passive: true });
  }

  // Rotating specialization
  const rotating = document.querySelector('.rotating-word');
  const words = ['graph algorithms', 'high-performance computing', 'efficient AI systems'];
  let wordIndex = 0;
  if (rotating && !prefersReducedMotion) {
    setInterval(() => {
      rotating.classList.add('changing');
      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        rotating.textContent = words[wordIndex];
        rotating.classList.remove('changing');
      }, 210);
    }, 2800);
  }

  // Magnetic buttons
  if (!prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * .12}px, ${y * .12}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });

    // Subtle 3D tilt
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Copy email
  const toast = document.querySelector('.toast');
  document.querySelector('.copy-email')?.addEventListener('click', async event => {
    const email = event.currentTarget.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      event.currentTarget.textContent = 'Copied';
      toast?.classList.add('show');
      setTimeout(() => {
        event.currentTarget.textContent = 'Copy email';
        toast?.classList.remove('show');
      }, 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });

  document.querySelector('#current-year').textContent = new Date().getFullYear();

  // Live public GitHub data. The page remains fully functional if the API is unavailable.
  const loadGitHubData = async () => {
    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch('https://api.github.com/users/AtiehBaratinia'),
        fetch('https://api.github.com/users/AtiehBaratinia/repos?per_page=100&sort=updated')
      ]);
      if (!userResponse.ok || !reposResponse.ok) return;
      const user = await userResponse.json();
      const repos = await reposResponse.json();
      const repoCount = document.querySelector('#repo-count');
      if (repoCount && Number.isFinite(user.public_repos)) repoCount.textContent = user.public_repos;
      document.querySelectorAll('[data-repo]').forEach(card => {
        const repo = repos.find(item => item.name === card.dataset.repo);
        const starEl = card.querySelector('[data-stars]');
        if (repo && starEl) starEl.textContent = repo.stargazers_count;
      });
    } catch (error) {
      console.info('GitHub profile data unavailable; using built-in content.', error);
    }
  };
  loadGitHubData();

  // Animated graph background
  const canvas = document.querySelector('#network-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let mouse = { x: null, y: null };
    let animationFrame;

    const cssColor = name => getComputedStyle(root).getPropertyValue(name).trim();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(82, Math.max(34, Math.floor(width / 18)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - .5) * .26,
        vy: (Math.random() - .5) * .26,
        r: Math.random() * 1.8 + .7
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const nodeColor = cssColor('--primary');
      const lineColor = cssColor('--primary-2');
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        if (mouse.x !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 170 && dist > 0) {
            p.x -= (dx / dist) * .18;
            p.y -= (dy / dist) * .18;
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance < 125) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = (1 - distance / 125) * .18;
            ctx.lineWidth = .7;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.globalAlpha = .54;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animationFrame = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', event => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    });
    canvas.addEventListener('pointerleave', () => { mouse = { x: null, y: null }; });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animationFrame);
      else draw();
    });
    resize();
    draw();
  }
})();
