(() => {
  const root = document.documentElement;
  const site = document.querySelector('.site');
  const cards = document.querySelectorAll('.social');
  const menuBtn = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const toast = document.querySelector('.protection-toast');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ready = () => site.classList.add('ready');
  const preload = new Image();
  preload.src = 'ari-bg.png';
  if (preload.complete) ready();
  else preload.addEventListener('load', ready, { once: true });
  setTimeout(ready, 900);

  if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
    let tx = 0, ty = 0, x = 0, y = 0, raf = null;
    const tick = () => {
      x += (tx - x) * .075;
      y += (ty - y) * .075;
      root.style.setProperty('--bgx', `${x}px`);
      root.style.setProperty('--bgy', `${y}px`);
      if (Math.abs(tx-x) > .05 || Math.abs(ty-y) > .05) raf = requestAnimationFrame(tick);
      else raf = null;
    };
    addEventListener('pointermove', (e) => {
      const px = e.clientX / innerWidth - .5;
      const py = e.clientY / innerHeight - .5;
      tx = px * -13;
      ty = py * -9;
      root.style.setProperty('--mx', `${e.clientX}px`);
      root.style.setProperty('--my', `${e.clientY}px`);
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  cards.forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--cx', `${e.clientX-r.left}px`);
      card.style.setProperty('--cy', `${e.clientY-r.top}px`);
    });
  });

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }));
  }

  // Practical client-side deterrence for casual image saving.
  // Note: any image rendered by a browser can still be captured by screenshots,
  // browser developer tools, cache, or direct repository access.
  const showProtected = () => {
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(showProtected.t);
    showProtected.t = setTimeout(() => toast.classList.remove('show'), 1450);
  };

  document.addEventListener('contextmenu', e => {
    if (e.target.closest('.site')) {
      e.preventDefault();
      showProtected();
    }
  });
  document.addEventListener('dragstart', e => {
    if (e.target.closest('.site')) e.preventDefault();
  });
  document.addEventListener('selectstart', e => {
    if (e.target.closest('.protected-art')) e.preventDefault();
  });
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    const blocked = e.key === 'F12' || (e.ctrlKey && ['s','u','p'].includes(k)) || (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(k));
    if (blocked) {
      e.preventDefault();
      showProtected();
    }
  });
})();
