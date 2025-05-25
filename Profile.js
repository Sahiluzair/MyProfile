// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');
const currentYear = document.getElementById('current-year');

// Set current year in footer
currentYear.textContent = new Date().getFullYear();

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// Header scroll effect
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Intersection Observer for section animations
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Animate skill bars once
      if (entry.target.id === 'skills' && !entry.target.classList.contains('animated')) {
        animateSkillBars();
        entry.target.classList.add('animated');
      }
    }
  });
}, { threshold: 0.1 });

// Observe all sections
sections.forEach(section => sectionObserver.observe(section));

// Animate skill bars
function animateSkillBars() {
  skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    setTimeout(() => {
      bar.style.width = `${progress}%`;
    }, 300);
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
    targetElement.focus({ preventScroll: true });
  });
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous error messages and styles
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
    // Simulate form submission
    try {
      await fakeSendForm({
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim()
      });

      contactForm.reset();
      showToast();
    } catch (error) {
      console.error('Form submission failed', error);
    }
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

// Simulate sending form data (replace with real fetch request)
async function fakeSendForm(data) {
  return new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate 1s delay
}

function showToast() {
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initial animations
window.addEventListener('DOMContentLoaded', () => {
  const firstSection = document.querySelector('.section');
  if (firstSection) {
    firstSection.classList.add('visible');
  }
});
