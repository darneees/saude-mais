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

    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    yearSpan.textContent = new Date().getFullYear();

    // navigation in subpages links on footer - privacy policy and terms of use
    const MAIN_SECTIONS = ['hero', 'benefits', 'sobrenos', 'testimonials', 'plans', 'contact', 'faq'];

    // alias opcionais (ex.: #home → #hero)
    const ALIASES = { 'home': 'hero' };

    // subpáginas
    const SUBPAGES = {
        'privacy-policy': {
            id: 'privacy-policy',
            title: 'Política de Privacidade | Saúde com Mais Benefícios'
        },
        'terms-of-use': {
            id: 'terms-of-use',
            title: 'Termos de Uso | Saúde com Mais Benefícios'
        }
    };

    // util: aplica/remover classe hidden
    function toggleVisibility(idsToShow = [], idsToHide = []) {
        idsToShow.forEach(id => document.getElementById(id)?.classList.remove('hidden'));
        idsToHide.forEach(id => document.getElementById(id)?.classList.add('hidden'));
    }

    // marca link ativo (aria-current) para acessibilidade
    function markActiveLink(targetHash) {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            if (a.getAttribute('href') === targetHash) a.setAttribute('aria-current', 'page');
            else a.removeAttribute('aria-current');
        });
    }

    // fecha menu mobile (se aberto)
    function closeMobileMenuIfOpen() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }

    // rola até um id com offset do header fixo
    function scrollToWithOffset(id) {
        const target = document.getElementById(id);
        if (!target) return;
        const headerOffset = document.getElementById('header')?.offsetHeight || 0;
        const y = target.getBoundingClientRect().top + window.pageYOffset - (headerOffset + 16);
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // modo subpágina: esconde principais e mostra apenas a subpágina
    function setSubpage(subKey) {
        const sub = SUBPAGES[subKey];
        if (!sub) return setDefault(); // fallback
        closeMobileMenuIfOpen();

        // esconde tudo que é principal
        toggleVisibility([], MAIN_SECTIONS);

        // mostra só a subpágina e esconde a outra
        const otherSubs = Object.keys(SUBPAGES).filter(k => k !== subKey).map(k => SUBPAGES[k].id);
        toggleVisibility([sub.id], otherSubs);

        document.title = sub.title;
        markActiveLink(`#${sub.id}`);
        scrollToWithOffset(sub.id);
    }

    // modo padrão (home/seções): mostra tudo e, se houver hash de seção, rola até ela
    function setDefault(sectionId) {
        closeMobileMenuIfOpen();

        // mostra principais e esconde subpáginas
        toggleVisibility(MAIN_SECTIONS, Object.values(SUBPAGES).map(s => s.id));

        // título padrão (igual ao <title> do HTML)
        document.title = 'Planos de Saúde Empresariais e Individuais em SP | Saúde com Mais Benefícios';

        // rolar até a seção pedida (se houver)
        if (sectionId && MAIN_SECTIONS.includes(sectionId)) {
            markActiveLink(`#${sectionId}`);
            scrollToWithOffset(sectionId);
        } else {
            markActiveLink('#hero'); // marca "home" por padrão
        }
    }

    // normaliza hash (aplica aliases)
    function normalizeHash(rawHash) {
        const h = (rawHash || '').replace('#', '').trim();
        if (!h) return '';
        return ALIASES[h] || h;
    }

    // renderiza rota com base no hash atual
    function renderRoute() {
        const key = normalizeHash(location.hash);
        if (SUBPAGES[key]) {
            setSubpage(key);
        } else if (MAIN_SECTIONS.includes(key)) {
            setDefault(key);
        } else {
            // sem hash ou hash desconhecido → home
            setDefault('hero');
        }
    }

    // delegação de clique: intercepta TODO link hash e usa o router
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;

        const raw = a.getAttribute('href');
        if (raw === '#') return; // ignora âncoras vazias

        e.preventDefault();
        const key = normalizeHash(raw);
        // atualiza hash (sem recarregar) e renderiza
        history.pushState(null, '', `#${key}`);
        renderRoute();
    });

    // navegação back/forward
    window.addEventListener('hashchange', renderRoute);

    // render inicial (suporta acesso direto a /#privacy-policy, /#terms-of-use, /#benefits etc.)
    renderRoute();

});
