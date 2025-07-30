document.addEventListener('DOMContentLoaded', () => {
    
    // Función de inicialización principal
    const initApp = () => {
        handleNavbarEffect();
        initAnimationsOnScroll();
        initImpactCounters();
        handleInfiniteLogoScroller();
        handleSmoothScrolling();
        initInteractiveStaff();
        handleContactModal();

    };

    /** EFECTO DE LA BARRA DE NAVEGACIÓN **/
    const handleNavbarEffect = () => {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    const logo = navbar.querySelector('.navbar-brand img');
    
    if (!logo) return;

    const originalLogoSrc = './img/logoh.png'; 
    const scrolledLogoSrc = './img/logov.png'; 

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (!navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.add('navbar-scrolled');
                logo.src = scrolledLogoSrc; 
            }
        } else {
            if (navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.remove('navbar-scrolled');
                logo.src = originalLogoSrc; 
            }
        }
    });
};
    /** INICIALIZACIÓN DE ANIMACIONES AL HACER SCROLL **/
    const initAnimationsOnScroll = () => {
        AOS.init({
            duration: 800,       
            easing: 'ease-in-out',
            once: true,          
            offset: 50,          
        });
    };

    /** CONTADORES DE IMPACTO ANIMADOS **/
    const initImpactCounters = () => {
        const countersSection = document.getElementById('impact-counters');
        if (!countersSection) return;

        const animateCounter = (element) => {
            const target = +element.dataset.target;
            let current = 0;
            const duration = 2000; 
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
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.8 });

        observer.observe(countersSection);
    };

    /**. CARRUSEL DE LOGOS INFINITO Y DINÁMICO **/
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

    /** SCROLL SUAVE PARA LINKS DE ANCLAJE **/
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

     const initInteractiveStaff = () => {
        const staffData = {
            1: {
                name: 'Nancy Heredia',
                role: 'Fundadora y Directora',
                image: './img/staff/foto1.jpg',
                description: 'Con su visión y liderazgo, Nancy transformó un sueño personal en un proyecto colectivo, impulsando el desarrollo local y creando oportunidades reales en Jáchal.'
            },
            2: {
                name: 'Nombre Socio 2',
                role: 'Gerente de Producción',
                image: './img/staff/foto2.jpg',
                description: 'Experto en optimización de procesos textiles, asegura que cada prenda cumpla con los más altos estándares de calidad y eficiencia en la confección.'
            },
            3: {
                name: 'Nombre Socio 3',
                role: 'Encargado de Calidad',
                image: './img/staff/foto3.jpg',
                description: 'Su atención meticulosa al detalle garantiza que cada costura, material y acabado sea impecable, ofreciendo un producto final que inspira confianza.'
            },
            4: {
                name: 'Nombre Socio 4',
                role: 'Desarrollo Comercial',
                image: './img/staff/foto4.jpg',
                description: 'Construye relaciones sólidas con nuestros clientes, entendiendo sus necesidades para ofrecer soluciones textiles que potencian su identidad y seguridad.'
            }
        };

        const displayContainer = document.getElementById('staff-display');
        const selectorCards = document.querySelectorAll('.team-selector-card');

        if (!displayContainer || selectorCards.length === 0) return;

        function updateDisplay(memberId) {
            const member = staffData[memberId];
            if (!member) return;

            displayContainer.style.opacity = '0';

            setTimeout(() => {

                displayContainer.innerHTML = `
                    <img src="${member.image}" alt="Foto de ${member.name}" class="staff-display-image">
                    <div class="staff-display-info">
                        <h3>${member.name}</h3>
                        <span class="role">${member.role}</span>
                        <p class="description">${member.description}</p>
                    </div>
                `;

                displayContainer.style.opacity = '1';
            }, 300);

           
            selectorCards.forEach(card => {
                card.classList.toggle('active', card.dataset.member === memberId);
            });
        }

      
        updateDisplay('1');

      
        selectorCards.forEach(card => {
            card.addEventListener('click', () => {
                updateDisplay(card.dataset.member);
            });
        });
    };
        /** MODAL DE CONTACTO **/
       const handleContactModal = () => {
        const contactForm = document.getElementById('contact-form-modal');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const company = document.getElementById('contact-company').value;
            const message = document.getElementById('contact-message').value;

            // Validación simple
            if (!name || !email || !message) {
                alert('Por favor, completa todos los campos obligatorios (*).');
                return;
            }

            const recipientEmail = 'contacto@icaa.com.ar'; // PONER EMAIL DE ELLA O DEL HOSTING
            const subject = `Consulta desde la web de: ${company || name}`;
            const body = `Hola, mi nombre es ${name}.\n\nEmpresa: ${company || 'No especificada'}\nEmail de contacto: ${email}\n\nMensaje:\n${message}`;

            // Creamos y abrimos el link mailto:
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
        });
    };


    initApp();
});