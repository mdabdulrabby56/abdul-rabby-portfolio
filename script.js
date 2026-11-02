// Dark / Light theme switch (sun/moon icon visibility is handled in CSS)
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  if (light) {
    document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem('theme', 'dark'); } catch (e) {}
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    try { localStorage.setItem('theme', 'light'); } catch (e) {}
  }
});

// Mobile navigation
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

// Scroll reveal animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Contact form — opens the visitor's email app with the message pre-filled
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent('Portfolio enquiry from ' + name);
  const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
  window.location.href = 'mailto:rabby.fleexstudio@gmail.com?subject=' + subject + '&body=' + body;
  document.getElementById('formNote').textContent =
    'Opening your email app — your message is addressed to rabby.fleexstudio@gmail.com.';
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
