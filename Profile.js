// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');
const currentYear = document.getElementById('current-year');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeIcon = document.getElementById('dark-mode-icon');
const backToTopBtn = document.getElementById('back-to-top');

// Set current year in footer
currentYear.textContent = new Date().getFullYear();

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  mobileMenuBtn.setAttribute('aria-expanded', isOpen);
  mobileMenuBtn.querySelector('svg').innerHTML = isOpen
    ? '<path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    : '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.querySelector('svg').innerHTML = '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
  });
});

// Header scroll effect
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  backToTopBtn.classList.toggle('show', window.scrollY > 200);
});

// Intersection Observer for section animations
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          if (entry.target.id === 'skills' && !entry.target.classList.contains('animated')) {
            animateSkillBars();
            initializeSkillChart();
            entry.target.classList.add('animated');
          }
        }, index * 100);
      }
    });
  },
  { threshold: 0.1 }
);

// Observe all sections
sections.forEach(section => sectionObserver.observe(section));

// Animate skill bars
function animateSkillBars() {
  skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    bar.style.width = `${progress}%`;
  });
}

// Initialize skill chart
function initializeSkillChart() {
  const skillsData = [
    { label: 'Risk Management & Compliance', value: 95 },
    { label: 'Chargeback & Dispute Resolution', value: 95 },
    { label: 'Fraud Detection & Investigation', value: 90 },
    { label: 'SQL & Data Analytics', value: 90 },
    { label: 'Process Automation', value: 85 },
    { label: 'Regulatory & Network Rule Adherence', value: 90 }
  ];

  const ctx = document.getElementById('skills-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: skillsData.map(skill => skill.label),
      datasets: [{
        label: 'Proficiency (%)',
        data: skillsData.map(skill => skill.value),
        backgroundColor: ['#1a56db', '#3b82f6', '#1e40af', '#60a5fa', '#93c5fd', '#dbeafe'],
        borderColor: ['#1a56db', '#3b82f6', '#1e40af', '#60a5fa', '#93c5fd', '#dbeafe'],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Proficiency (%)'
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: context => `${context.raw}%`
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// Smooth scrolling with focus
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    targetElement.setAttribute('tabindex', '-1');
    targetElement.focus({ preventScroll: true });
  });
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('.submit-btn');
  submitBtn.disabled = true;

  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');
  contactForm.querySelectorAll('input, textarea').forEach(field => field.classList.remove('input-error'));

  // Get form values
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  let isValid = true;

  if (name.value.trim().length < 2) {
    showError(name, 'Name must be at least 2 characters');
    isValid = false;
  }
  if (!isValidEmail(email.value.trim())) {
    showError(email, 'Please enter a valid email address');
    isValid = false;
  }
  if (subject.value.trim().length < 5) {
    showError(subject, 'Subject must be at least 5 characters');
    isValid = false;
  }
  if (message.value.trim().length < 10) {
    showError(message, 'Message must be at least 10 characters');
    isValid = false;
  }

  if (isValid) {
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
      });
      if (!response.ok) throw new Error('Submission failed');
      contactForm.reset();
      showToast('Message Sent!', 'Thank you for your message. I will get back to you soon.');
    } catch (error) {
      showToast('Submission Failed', 'An error occurred. Please try again later.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  } else {
    submitBtn.disabled = false;
  }
});

function showError(input, message) {
  const errorSpan = document.getElementById(`${input.id}-error`);
  if (errorSpan) errorSpan.textContent = message;
  input.classList.add('input-error');
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showToast(title, description, type = 'success') {
  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-description').textContent = description;
  toast.classList.add('show', type);
  setTimeout(() => toast.classList.remove('show', type), 3000);
}

// PDF Download
downloadPdfBtn.addEventListener('click', () => {
  const element = document.body;
  const opt = {
    margin: 0.5,
    filename: 'Sahil_Khan_Profile.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
});

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  darkModeIcon.innerHTML = isDark
    ? '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  localStorage.setItem('darkMode', isDark);
});

// Back to Top
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  darkModeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
}

// Initial animations
window.addEventListener('DOMContentLoaded', () => {
  const firstSection = document.querySelector('.section');
  if (firstSection) firstSection.classList.add('visible');
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.querySelector('svg').innerHTML = '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
    mobileMenuBtn.focus();
  }
});
