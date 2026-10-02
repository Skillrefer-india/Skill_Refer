const SKILLREFER = {
  brand: 'SkillRefer',
  email: 'framxstudio22@gmail.com',
  whatsapp: '919011052546',
  whatsappLink: 'https://wa.me/919011052546',
  courses: {
    silver: {
      label: 'Silver',
      name: 'AI Business Design',
      topic: 'Business Flyers',
      price: 99,
      image: 'assets/course-silver.png',
      qr: 'assets/qr-silver.png'
    },
    gold: {
      label: 'Gold',
      name: 'Website Making With AI',
      topic: 'AI Website Creation',
      price: 249,
      image: 'assets/course-gold.png',
      qr: 'assets/qr-gold.png'
    },
    platinum: {
      label: 'Platinum',
      name: 'AI UGC Reel Creation',
      topic: 'UGC Workflows',
      price: 499,
      image: 'assets/course-platinum.png',
      qr: 'assets/qr-platinum.png'
    }
  }
};

const state = {
  selectedCourseKey: 'silver',
  step: 1,
  form: { name: '', email: '', phone: '' },
  modalOpen: false,
  language: 'en'
};

const purchaseModal = document.getElementById('purchase-modal');
const policyModal = document.getElementById('policy-modal');
const purchaseForm = document.getElementById('purchase-form');
const paymentWhatsappButton = document.getElementById('payment-whatsapp-btn');
const paymentSuccessState = document.getElementById('payment-success-state');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

function formatPrice(value) {
  return `₹${value}`;
}

function getCourse(key) {
  return SKILLREFER.courses[key] || SKILLREFER.courses.silver;
}

function setFooterYear() {
  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();
}

function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.querySelector(`[data-error-for="${fieldId}"]`);

  if (field) {
    field.classList.toggle('is-invalid', Boolean(message));
  }

  if (errorEl) {
    errorEl.textContent = message || '';
  }
}

function updateCourseSummary() {
  const course = getCourse(state.selectedCourseKey);

  const label = document.getElementById('selected-course-label');
  const name = document.getElementById('selected-course-name');
  const topic = document.getElementById('selected-course-topic');
  const price = document.getElementById('selected-course-price');
  const paymentCourse = document.getElementById('payment-course-name');
  const paymentAmount = document.getElementById('payment-amount');
  const paymentQr = document.getElementById('payment-qr');

  if (label) label.textContent = course.label || course.name.split(' ')[0];
  if (name) name.textContent = course.name;
  if (topic) topic.textContent = course.topic;
  if (price) price.textContent = formatPrice(course.price);
  if (paymentCourse) paymentCourse.textContent = course.name;
  if (paymentAmount) paymentAmount.textContent = formatPrice(course.price);
  if (paymentQr) {
    paymentQr.src = course.qr;
    paymentQr.alt = `${course.name} UPI QR code`;
  }
}

function setStep(step) {
  state.step = step;

  document.querySelectorAll('.step-dot').forEach((dot) => {
    const isActive = Number(dot.dataset.stepIndicator) === step;
    dot.classList.toggle('active', isActive);
  });

  const detailsPanel = document.getElementById('purchase-details-panel');
  const paymentPanel = document.getElementById('purchase-payment-panel');

  if (detailsPanel) detailsPanel.classList.toggle('is-active', step === 1);
  if (paymentPanel) paymentPanel.classList.toggle('is-active', step === 2);
}

function validateForm() {
  const name = document.getElementById('buyer-name').value.trim();
  const email = document.getElementById('buyer-email').value.trim();
  const phone = document.getElementById('buyer-phone').value.trim();

  let valid = true;

  if (name.length < 2) {
    setError('buyer-name', 'Please enter your full name.');
    valid = false;
  } else {
    setError('buyer-name', '');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    setError('buyer-email', 'Please enter a valid email address.');
    valid = false;
  } else {
    setError('buyer-email', '');
  }

  const indianPhonePattern = /^[6-9]\d{9}$/;
  if (!phone || !indianPhonePattern.test(phone)) {
    setError('buyer-phone', 'Please enter a valid Indian mobile number.');
    valid = false;
  } else {
    setError('buyer-phone', '');
  }

  state.form = { name, email, phone };
  return valid;
}

function openPurchaseModal(courseKey = null) {
  if (courseKey) {
    state.selectedCourseKey = courseKey;
  }

  if (purchaseModal) {
    purchaseModal.classList.add('is-open');
    purchaseModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  state.modalOpen = true;
  updateCourseSummary();
  setStep(1);
  populateFormFromState();
}

function closePurchaseModal() {
  if (purchaseModal) {
    purchaseModal.classList.remove('is-open');
    purchaseModal.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('modal-open');
  state.modalOpen = false;
}

function populateFormFromState() {
  document.getElementById('buyer-name').value = state.form.name;
  document.getElementById('buyer-email').value = state.form.email;
  document.getElementById('buyer-phone').value = state.form.phone;
}

function generateWhatsAppMessage() {
  const course = getCourse(state.selectedCourseKey);
  return [
    'Hello SkillRefer Support,',
    '',
    'I have completed the payment for my SkillRefer course.',
    '',
    `Name: ${state.form.name}`,
    `Email: ${state.form.email}`,
    `WhatsApp: ${state.form.phone}`,
    '',
    `Course: ${course.name}`,
    `Amount: ${formatPrice(course.price)}`,
    '',
    'Payment screenshot submitted for verification.',
    '',
    'Thank you.'
  ].join('\n');
}

function openWhatsAppWithPaymentEntry() {
  const message = generateWhatsAppMessage();
  const whatsappUrl = `https://wa.me/${SKILLREFER.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  if (paymentSuccessState) {
    paymentSuccessState.hidden = false;
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  if (!validateForm()) return;
  setStep(2);
}

function initFaqs() {
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach((faqItem) => {
        faqItem.classList.remove('active');
        if (faqItem.querySelector('.faq-question')) {
          faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      if (!isOpen) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initMobileMenu() {
  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('is-open', !expanded);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function wireCourseButtons() {
  document.querySelectorAll('.btn-course').forEach((button) => {
    button.addEventListener('click', () => {
      const courseKey = button.dataset.courseKey;
      openPurchaseModal(courseKey);
    });
  });
}

function bindPolicyButtons() {
  document.querySelectorAll('.btn-policy').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.policy;
      const pron = {
        terms: 'Affiliate Terms',
        refund: 'Refund Policy',
        privacy: 'Privacy Policy',
        referral: 'Referral Terms'
      };
      const detail = {
        terms: 'Referral commission and course access are governed by the applicable affiliate terms and platform policies.',
        refund: 'Refund eligibility is subject to the published refund policy and is reviewed on a case-by-case basis.',
        privacy: 'This site uses basic contact information solely for course and support communication, and any personal information is handled according to the applicable privacy policy.',
        referral: 'Referral rewards, where applicable, are based on qualifying course purchases and are subject to the platform terms.'
      };
      const titleEl = document.getElementById('policy-title');
      const contentEl = document.querySelector('#policy-modal .policy-content p');

      if (titleEl) titleEl.textContent = pron[type] || 'Policy';
      if (contentEl) contentEl.textContent = detail[type] || 'Please review the current terms before purchasing or sharing a referral link.';

      if (policyModal) {
        policyModal.classList.add('is-open');
        policyModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
      }
    });
  });
}

function bindCloseEvents() {
  document.querySelectorAll('.modal-close').forEach((button) => {
    button.addEventListener('click', () => {
      closePurchaseModal();
      if (policyModal && policyModal.classList.contains('is-open')) {
        policyModal.classList.remove('is-open');
        policyModal.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('modal-open');
    });
  });

  if (purchaseModal) {
    purchaseModal.addEventListener('click', (event) => {
      if (event.target === purchaseModal) {
        closePurchaseModal();
      }
    });
  }

  if (policyModal) {
    policyModal.addEventListener('click', (event) => {
      if (event.target === policyModal) {
        policyModal.classList.remove('is-open');
        policyModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePurchaseModal();
      if (policyModal) {
        policyModal.classList.remove('is-open');
        policyModal.setAttribute('aria-hidden', 'true');
      }
      document.body.classList.remove('modal-open');
    }
  });
}

function setupLanguageToggle() {
  document.querySelectorAll('[data-language-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.languageToggle;
      state.language = selected;

      document.querySelectorAll('[data-language-toggle]').forEach((langButton) => {
        const isActive = langButton.dataset.languageToggle === selected;
        langButton.classList.toggle('is-active', isActive);
        langButton.setAttribute('aria-pressed', String(isActive));
      });

      document.querySelectorAll('[data-lang-content]').forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.langContent === selected);
      });
    });
  });
}

function init() {
  setFooterYear();
  initMobileMenu();
  initFaqs();
  wireCourseButtons();
  bindPolicyButtons();
  bindCloseEvents();
  setupLanguageToggle();
  updateCourseSummary();
  setStep(1);

  if (purchaseForm) {
    purchaseForm.addEventListener('submit', handleFormSubmit);
  }

  if (paymentWhatsappButton) {
    paymentWhatsappButton.addEventListener('click', openWhatsAppWithPaymentEntry);
  }

  populateFormFromState();
}

document.addEventListener('DOMContentLoaded', init);
