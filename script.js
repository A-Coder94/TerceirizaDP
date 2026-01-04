// Alterar cor do header ao rolar a página
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scroll');
    } else {
        header.classList.remove('scroll');
    }
});

// Set active navigation link based on current page
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(a => {
        if (a.getAttribute('href') === currentPage) {
            a.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();

    // Mobile nav toggle (hamburger)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(!!isOpen));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Ensure menu is reset on resize (desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
const whatsappForm = document.getElementById('whatsapp-form');

if (whatsappForm) {
    whatsappForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Pega os valores dos campos
        const nome = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const servico = document.getElementById('servico').value;
        const mensagem = document.getElementById('message').value;

        // 2. Configura o número do WhatsApp (apenas números, com DDD)
        const telefone = "5511970152735";

        // 3. Monta a mensagem formatada
        const texto = `Olá, meu nome é *${nome}*.\n` +
            `Meu e-mail: ${email}\n` +
            `Estou interessado em: *${servico}*\n` +
            `Mensagem: ${mensagem}`;

        // 4. Codifica o texto para URL
        const textoEncoded = encodeURIComponent(texto);

        // 5. Cria o link final
        const url = `https://wa.me/${telefone}?text=${textoEncoded}`;

        // 6. Abre o WhatsApp em uma nova aba
        window.open(url, '_blank');
    });
}

// Animação simples de entrada para os cards (for servicos.html)
const cards = document.querySelectorAll('.card');
if (cards.length > 0) {
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = '0.8s ease-out';
        observer.observe(card);
    });
}
