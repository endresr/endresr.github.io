function setLang(lang) {
  // Simple text swap for elements with data-en and data-no
  document.querySelectorAll('[data-en][data-no]').forEach(function(el) {
    var val = el.getAttribute('data-' + lang);
    if (val !== null) el.textContent = val;
  });
  // Block-level show/hide for complex content
  document.querySelectorAll('[data-lang]').forEach(function(el) {
    el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
  });
  // Update active language button
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'no' ? 'nb' : 'en';
}

function toggleMobileNav() {
  document.getElementById('nav-links').classList.toggle('open');
}

// Close mobile nav when a link is clicked
document.querySelectorAll('.nav-links a').forEach(function(a) {
  a.addEventListener('click', function() {
    document.getElementById('nav-links').classList.remove('open');
  });
});

// Initialise language from localStorage or default to Norwegian
var savedLang = localStorage.getItem('lang') || 'no';
setLang(savedLang);

// Scroll reveal
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});
