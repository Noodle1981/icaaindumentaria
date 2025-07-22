document.addEventListener('DOMContentLoaded', () => {
    
    // Función de inicialización principal
    const initApp = () => {
        handleNavbarEffect();
        initAnimationsOnScroll();
        initImpactCounters();
        handleInfiniteLogoScroller();
        handleSmoothScrolling();
    };

    /**
     * 1. EFECTO DE LA BARRA DE NAVEGACIÓN
     * Cambia la apariencia del navbar al hacer scroll para mejorar la visibilidad.
     * También cambia el logo de la versión blanca a la de color.
     */
    const handleNavbarEffect = () => {
    const navbar = document.getElementById('main-navbar');
    // Si no encuentra el navbar, no hacemos nada para evitar errores.
    if (!navbar) return;

    const logo = navbar.querySelector('.navbar-brand img');
    // Si no encuentra la imagen del logo, tampoco hacemos nada.
    if (!logo) return;

    // --- LA CORRECCIÓN CLAVE ESTÁ AQUÍ ---
    // Añadimos la ruta completa a la carpeta 'img'.
    const originalLogoSrc = './img/logoh.png'; 
    const scrolledLogoSrc = './img/logov.png'; 

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (!navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.add('navbar-scrolled');
                logo.src = scrolledLogoSrc; // Ahora encontrará 'logov.png' dentro de la carpeta 'img'
            }
        } else {
            if (navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.remove('navbar-scrolled');
                logo.src = originalLogoSrc; // Ahora encontrará 'logoh.png' dentro de la carpeta 'img'
            }
        }
    });
};
    /**
     * 2. INICIALIZACIÓN DE ANIMACIONES AL HACER SCROLL (AOS)
     * Usamos la librería Animate On Scroll (AOS) para animaciones de entrada elegantes y eficientes.
     */
    const initAnimationsOnScroll = () => {
        AOS.init({
            duration: 800,       // Duración de la animación
            easing: 'ease-in-out', // Curva de animación
            once: true,          // La animación ocurre solo una vez
            offset: 50,          // Activa la animación un poco antes de que el elemento sea visible
        });
    };

    /**
     * 3. CONTADORES DE IMPACTO ANIMADOS
     * Utiliza la Intersection Observer API para activar la animación solo cuando
     * los contadores son visibles, asegurando un rendimiento óptimo.
     */
    const initImpactCounters = () => {
        const countersSection = document.getElementById('impact-counters');
        if (!countersSection) return;

        const animateCounter = (element) => {
            const target = +element.dataset.target;
            let current = 0;
            const duration = 2000; // 2 segundos de animación
            const stepTime = Math.abs(Math.floor(duration / target));
            
            const timer = setInterval(() => {
                current += 1;
                element.innerText = current;
                if (current === target) {
                    clearInterval(timer);
                }
            }, stepTime);
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.counter-number').forEach(animateCounter);
                    observer.unobserve(entry.target); // Desconecta el observer después de animar
                }
            });
        }, { threshold: 0.8 });

        observer.observe(countersSection);
    };

    /**
     * 4. CARRUSEL DE LOGOS INFINITO Y DINÁMICO
     * Clona los logos para crear un bucle perfecto y pausa la animación
     * cuando el usuario pasa el cursor por encima.
     */
    const handleInfiniteLogoScroller = () => {
        const scroller = document.querySelector('.logo-scroller-inner');
        if (!scroller) return;

        // Clonar logos para efecto infinito
        const scrollerContent = Array.from(scroller.children);
        scrollerContent.forEach(item => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute('aria-hidden', true);
            scroller.appendChild(duplicatedItem);
        });
        
        // Pausar animación en hover
        const scrollerParent = document.querySelector('.logo-scroller');
        scrollerParent.addEventListener('mouseover', () => {
            scroller.style.animationPlayState = 'paused';
        });
        scrollerParent.addEventListener('mouseout', () => {
            scroller.style.animationPlayState = 'running';
        });
    };

    /**
     * 5. SCROLL SUAVE PARA LINKS DE ANCLAJE
     * Mejora la navegación interna de la página.
     */
    const handleSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if(targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Iniciar toda la aplicación
    initApp();
});