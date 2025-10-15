document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Don't scroll for empty href
            if (this.getAttribute('href') === '#') return;

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust for fixed header height
                const headerOffset = document.getElementById('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Form Logic
    const planTypeSelect = document.getElementById('plan_type');
    const vidasContainer = document.getElementById('vidas-container');
    planTypeSelect.addEventListener('change', (event) => {
        if (event.target.value === 'pj') {
            vidasContainer.classList.remove('hidden');
        } else {
            vidasContainer.classList.add('hidden');
        }
    });

    // Form Submission Simulation
    const leadForm = document.getElementById('lead-form');
    const formContainer = document.getElementById('form-container');
    const successMessage = document.getElementById('success-message');
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Basic validation is handled by 'required' attribute
        formContainer.classList.add('hidden');
        successMessage.classList.remove('hidden');
        // Scroll to the success message for visibility
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Phone Mask (BR format)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 11);
        if (value.length > 2) {
            value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        }
        if (value.length > 9) {
            value = `${value.substring(0, 10)}-${value.substring(10)}`;
        }
        e.target.value = value;
    });

    // Fade-in animation on scroll
    const faders = document.querySelectorAll('.fade-in-up');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

});