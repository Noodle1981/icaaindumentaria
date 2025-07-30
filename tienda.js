document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURACIÓN ---
    const WHATSAPP_NUMBER = '5492644533704';
    const PRODUCTS_PER_PAGE = 8; // Control decuántos productos se ven por página
    // -------------------

    let allProducts = [];
    let currentPage = 1;
    let currentFilteredProducts = [];

    const productGrid = document.getElementById('product-grid');
    const categoryFilters = document.getElementById('category-filters');
    const paginationContainer = document.getElementById('pagination-container');
    const productModal = new bootstrap.Modal(document.getElementById('product-detail-modal'));

    // DEFINICIÓN DE FUNCIONES // 

    const loadProducts = () => {
        try {
            allProducts = [
                {
                    "id": 1, "name": "Camisa Ignífuga X-PRO", "category": "Indumentaria Laboral", "image": "./img/camisaignifuga.jpg",
                    "description": "Diseñada para la máxima protección en entornos de alto riesgo. Tejido ignífugo certificado que ofrece seguridad sin sacrificar la movilidad y el confort.", "sizes": ["S", "M", "L", "XL", "XXL"],
                    "colors": [{ "name": "Naranja", "hex": "#FF4500" }, { "name": "Azul Marino", "hex": "#001f3f" }],
                    "pricingTiers": [{ "range": "1-2", "price": 65000 }, { "range": "3-6", "price": 50000 }, { "range": "7-12", "price": 45000 }], "discount": "20% OFF"
                },
                {
                    "id": 2, "name": "Tricota Táctica VIGIA", "category": "Fuerza de Seguridad", "image": "./img/tricota.jpg",
                    "description": "Resistencia y funcionalidad para cada jornada. Confeccionada con tela anti-desgarro y múltiples bolsillos estratégicos.", "sizes": ["S", "M", "L", "XL"],
                    "colors": [{ "name": "Negro", "hex": "#000000" }, { "name": "Verde Oliva", "hex": "#556B2F" }],
                    "pricingTiers": [{ "range": "1-5", "price": 48000 }, { "range": "6-15", "price": 42000 }, { "range": "16+", "price": 38000 }], "discount": null
                },
                {
                    "id": 3, "name": "Guardapolvo Escolar Clásico", "category": "Uniformes Escolares", "image": "./img/uniformesescolares.png",
                    "description": "El clásico guardapolvo blanco, reforzado con costuras dobles para resistir el día a día escolar. Tela de fácil planchado.", "sizes": ["6", "8", "10", "12", "14", "16"],
                    "colors": [{ "name": "Blanco", "hex": "#FFFFFF" }],
                    "pricingTiers": [{ "range": "1-10", "price": 25000 }, { "range": "11-30", "price": 22000 }, { "range": "31+", "price": 19500 }], "discount": "Vuelta al Cole"
                },
                {
                    "id": 4, "name": "Casco de Seguridad Certificado", "category": "Protección Personal (EPP)", "image": "./img/epp.jpg",
                    "description": "Casco de alto impacto con arnés regulable para un ajuste perfecto y cómodo. Cumple con normativas de seguridad vigentes.", "sizes": ["Único Regulable"],
                    "colors": [{ "name": "Amarillo", "hex": "#FFD700" }, { "name": "Blanco", "hex": "#FFFFFF" }, { "name": "Azul", "hex": "#007bff" }],
                    "pricingTiers": [{ "range": "1-20", "price": 18000 }, { "range": "21-50", "price": 16500 }, { "range": "51+", "price": 15000 }], "discount": null
                },
                
                {"id": 5, "name": "Botas de Seguridad Punta de Acero", "category": "Protección Personal (EPP)", "image": "./img/producto-placeholder.jpg", "description": "Descripción de las botas.", "sizes": ["39", "40", "41", "42", "43"], "colors": [{"name": "Negro", "hex": "#000000"}], "pricingTiers": [{"range": "1-10", "price": 35000}], "discount": null},
                {"id": 6, "name": "Pantalón Cargo Constructor", "category": "Indumentaria Laboral", "image": "./img/producto-placeholder.jpg", "description": "Descripción del pantalón.", "sizes": ["S", "M", "L"], "colors": [{"name": "Gris", "hex": "#808080"}], "pricingTiers": [{"range": "1-10", "price": 28000}], "discount": null},
                {"id": 7, "name": "Chomba Escolar Piqué", "category": "Uniformes Escolares", "image": "./img/producto-placeholder.jpg", "description": "Descripción de la chomba.", "sizes": ["8", "10", "12"], "colors": [{"name": "Azul", "hex": "#0000FF"}], "pricingTiers": [{"range": "1-20", "price": 15000}], "discount": null},
                {"id": 8, "name": "Chaleco Táctico Policial", "category": "Fuerza de Seguridad", "image": "./img/producto-placeholder.jpg", "description": "Descripción del chaleco.", "sizes": ["M", "L", "XL"], "colors": [{"name": "Negro", "hex": "#000000"}], "pricingTiers": [{"range": "1-5", "price": 55000}], "discount": null},
                {"id": 9, "name": "Guantes de Nitrilo Reforzados", "category": "Protección Personal (EPP)", "image": "./img/producto-placeholder.jpg", "description": "Descripción de los guantes.", "sizes": ["Único"], "colors": [{"name": "Azul", "hex": "#0000FF"}], "pricingTiers": [{"range": "1-50", "price": 5000}], "discount": "10% OFF"},
                {"id": 10, "name": "Mameluco de Trabajo Pesado", "category": "Indumentaria Laboral", "image": "./img/producto-placeholder.jpg", "description": "Descripción del mameluco.", "sizes": ["M", "L", "XL"], "colors": [{"name": "Azul", "hex": "#0000FF"}], "pricingTiers": [{"range": "1-10", "price": 40000}], "discount": null}
            ];
            currentFilteredProducts = allProducts;
            updateStoreView();
        } catch (error) {
            console.error(error);
            if (productGrid) productGrid.innerHTML = `<p class="text-center text-danger">Error al cargar productos.</p>`;
        }
    };

    const updateStoreView = () => {
        renderProducts();
        renderPagination();
    };

    const renderProducts = () => {
        if (!productGrid) return;
        productGrid.innerHTML = '';
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        const productsToShow = currentFilteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            productGrid.innerHTML = '<p class="text-center col-12">No se encontraron productos en esta categoría.</p>';
            return;
        }

        productsToShow.forEach(product => {
            const discountBadge = product.discount ? `<div class="discount-badge">${product.discount}</div>` : '';
            const card = document.createElement('div');
            card.className = 'col-lg-3 col-md-4 col-sm-6';
            card.innerHTML = `<div class="product-card"><div class="product-card-image"><img src="${product.image}" alt="${product.name}">${discountBadge}</div><div class="product-card-body"><h5>${product.name}</h5><p class="category">${product.category}</p></div></div>`;
            card.addEventListener('click', () => openProductModal(product));
            productGrid.appendChild(card);
        });
    };

    const renderPagination = () => {
        if (!paginationContainer) return;
        const totalPages = Math.ceil(currentFilteredProducts.length / PRODUCTS_PER_PAGE);
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const controls = document.createElement('div');
        controls.className = 'pagination-controls';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.dataset.page = i;
            controls.appendChild(pageBtn);
        }
        paginationContainer.appendChild(controls);
    };

    const setupFilters = () => {
        if (!categoryFilters) return;
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                const category = e.target.dataset.category;
                currentFilteredProducts = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
                currentPage = 1;
                updateStoreView();
            }
        });
    };
    
    const setupPaginationClicks = () => {
        if (!paginationContainer) return;
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-btn')) {
                currentPage = parseInt(e.target.dataset.page);
                updateStoreView();
                productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    };

    const openProductModal = (product) => {
        document.getElementById('modal-product-title').textContent = product.name;
        document.getElementById('modal-product-image').src = product.image;
        document.getElementById('modal-product-description').textContent = product.description;
        const sizesContainer = document.getElementById('modal-product-sizes');
        sizesContainer.innerHTML = product.sizes.map(size => `<span class="size-option">${size}</span>`).join('');
        const colorsContainer = document.getElementById('modal-product-colors');
        colorsContainer.innerHTML = product.colors.map(color => `<span class="color-option" style="background-color: ${color.hex};" title="${color.name}"></span>`).join('');
        const pricingContainer = document.getElementById('modal-product-pricing');
        pricingContainer.innerHTML = product.pricingTiers.map(tier => `<li class="list-group-item d-flex justify-content-between"><span>${tier.range} unidades</span><span class="price">$${tier.price.toLocaleString('es-AR')} c/u</span></li>`).join('');
        setupModalActions(product);
        productModal.show();
    };

    const setupModalActions = (product) => {
        const qtyInput = document.getElementById('quantity-input');
        const qtyMinus = document.getElementById('quantity-minus');
        const qtyPlus = document.getElementById('quantity-plus');
        const consultBtn = document.getElementById('consult-button');
        qtyInput.value = 1;
        qtyMinus.onclick = () => { if (qtyInput.value > 1) qtyInput.value--; };
        qtyPlus.onclick = () => { qtyInput.value++; };
        consultBtn.onclick = () => {
            const quantity = parseInt(qtyInput.value);
            const price = calculatePrice(quantity, product.pricingTiers);
            let message = `¡Hola! Vengo de la tienda de ICAA y quisiera consultar por el siguiente producto:\n\n*Producto:* ${product.name}\n*Cantidad:* ${quantity} unidades\n`;
            if (price) { message += `*Precio estimado por unidad:* $${price.toLocaleString('es-AR')}\n`; }
            message += `\nQuisiera saber más detalles y cómo adquirirlo. ¡Gracias!`;
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        };
    };

    const calculatePrice = (quantity, tiers) => {
        for (const tier of tiers) {
            const range = tier.range.split('-');
            const min = parseInt(range[0]);
            const max = range[1] ? parseInt(range[1]) : Infinity;
            if (quantity >= min && quantity <= max) { return tier.price; }
        }
        const lastTier = tiers[tiers.length - 1];
        if (lastTier.range.includes('+')) {
            const min = parseInt(lastTier.range.replace('+', ''));
            if (quantity >= min) { return lastTier.price; }
        }
        return null;
    };
    
    const handlePromoModal = () => {
        const promoModalEl = document.getElementById('promo-modal');
        if (!promoModalEl) return;
        promoModalEl.addEventListener('show.bs.modal', (event) => {
            const card = event.relatedTarget;
            const title = card.getAttribute('data-title');
            const image = card.getAttribute('data-image');
            const text = card.getAttribute('data-text');
            const ctaText = card.getAttribute('data-cta-text');
            const ctaLink = card.getAttribute('data-cta-link');
            const modalTitle = promoModalEl.querySelector('#promo-modal-title');
            const modalImage = promoModalEl.querySelector('#promo-modal-image');
            const modalText = promoModalEl.querySelector('#promo-modal-text');
            const modalCta = promoModalEl.querySelector('#promo-modal-cta');
            modalTitle.textContent = title;
            modalImage.src = image;
            modalText.textContent = text;
            modalCta.textContent = ctaText;
            modalCta.href = ctaLink;
            if (ctaLink.startsWith('https://wa.me')) {
                modalCta.target = '_blank';
            } else {
                modalCta.target = '_self';
            }
        });
    };

    const initApp = () => {
        loadProducts();
        setupFilters();
        setupPaginationClicks();
        handlePromoModal();
    };

    initApp();
});