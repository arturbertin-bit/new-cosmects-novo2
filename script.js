// ============================================
// SCRIPT.JS - NEW COSMECTS
// ============================================

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // MENU HAMBURGUER (Mobile)
    // ============================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Alterna o ícone do menu
            if (navLinks.classList.contains('active')) {
                menuToggle.textContent = '✕';
            } else {
                menuToggle.textContent = '☰';
            }
        });

        // Fecha o menu ao clicar em um link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }

    // ============================================
    // CARROSSEL DE PRODUTOS
    // ============================================
    let currentSlides = [0, 0]; // Armazena o slide atual de cada carrossel

    // Função para atualizar atributos ARIA
    function updateAriaAttributes(carouselIndex) {
        const carousel = document.querySelectorAll('.product-carousel')[carouselIndex];
        if (!carousel) return;

        const dots = carousel.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentSlides[carouselIndex]) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
        });
    }

    // Função para mudar de slide
    function changeSlide(carouselIndex, direction) {
        const carousel = document.querySelectorAll('.product-carousel')[carouselIndex];
        if (!carousel) return;

        const images = carousel.querySelectorAll('.carousel-image');
        const dots = carousel.querySelectorAll('.dot');

        // Remove a classe active do slide atual
        images[currentSlides[carouselIndex]].classList.remove('active');
        dots[currentSlides[carouselIndex]].classList.remove('active');

        // Calcula o próximo slide
        currentSlides[carouselIndex] += direction;

        // Loop circular
        if (currentSlides[carouselIndex] >= images.length) {
            currentSlides[carouselIndex] = 0;
        }
        if (currentSlides[carouselIndex] < 0) {
            currentSlides[carouselIndex] = images.length - 1;
        }

        // Adiciona a classe active no novo slide
        images[currentSlides[carouselIndex]].classList.add('active');
        dots[currentSlides[carouselIndex]].classList.add('active');

        // Atualiza atributos ARIA
        updateAriaAttributes(carouselIndex);
    }

    // Função para ir direto para um slide específico
    function goToSlide(carouselIndex, slideIndex) {
        const carousel = document.querySelectorAll('.product-carousel')[carouselIndex];
        if (!carousel) return;

        const images = carousel.querySelectorAll('.carousel-image');
        const dots = carousel.querySelectorAll('.dot');

        // Remove a classe active do slide atual
        images[currentSlides[carouselIndex]].classList.remove('active');
        dots[currentSlides[carouselIndex]].classList.remove('active');

        // Define o novo slide
        currentSlides[carouselIndex] = slideIndex;

        // Adiciona a classe active no novo slide
        images[currentSlides[carouselIndex]].classList.add('active');
        dots[currentSlides[carouselIndex]].classList.add('active');

        // Atualiza atributos ARIA
        updateAriaAttributes(carouselIndex);
    }

    // ============================================
    // EVENT LISTENERS DOS BOTÕES DO CARROSSEL
    // ============================================
    
    // Botões prev/next
    const carouselButtons = document.querySelectorAll('.carousel-btn');
    carouselButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carouselIndex = parseInt(this.getAttribute('data-carousel'));
            const direction = parseInt(this.getAttribute('data-direction'));
            changeSlide(carouselIndex, direction);
        });
    });

    // Dots de navegação
    const carouselDots = document.querySelectorAll('.carousel-dots .dot');
    carouselDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const carouselIndex = parseInt(this.getAttribute('data-carousel'));
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(carouselIndex, slideIndex);
        });

        // Adicionar navegação por teclado
        dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const carouselIndex = parseInt(this.getAttribute('data-carousel'));
                const slideIndex = parseInt(this.getAttribute('data-slide'));
                goToSlide(carouselIndex, slideIndex);
            }
        });
    });

    // ============================================
    // AUTO-PLAY DO CARROSSEL (Opcional)
    // ============================================
    let autoPlayInterval = setInterval(() => {
        changeSlide(0, 1);
        changeSlide(1, 1);
    }, 5000); // Muda a cada 5 segundos

    // Pausa o auto-play quando o usuário interage com o carrossel
    const allCarouselElements = document.querySelectorAll('.product-carousel');
    allCarouselElements.forEach(carousel => {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                changeSlide(0, 1);
                changeSlide(1, 1);
            }, 5000);
        });

        // Pausa auto-play para usuários de teclado
        carousel.addEventListener('focusin', () => {
            clearInterval(autoPlayInterval);
        });

        carousel.addEventListener('focusout', () => {
            autoPlayInterval = setInterval(() => {
                changeSlide(0, 1);
                changeSlide(1, 1);
            }, 5000);
        });
    });



    // ============================================
    // SCROLL SUAVE PARA ÂNCORAS
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // EFEITO SHRINK NO HEADER (Scroll)
    // ============================================
    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-shrink');
        } else {
            header.classList.remove('header-shrink');
        }
    });

    console.log('✅ Script.js carregado com sucesso!');
});
