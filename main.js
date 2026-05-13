// Yumey Fashions — Full SPA Logic (All 12 Screens)

document.addEventListener('DOMContentLoaded', () => {

    // ─── DATA ─────────────────────────────────────
    const products = [
        // ── Accesorios ────────────────────────────────────────────────────────
        {
            id: 1, name: 'Noir Leather Handbag', category: 'accesorios', price: 1250,
            img: 'assets/handbag.png', filter: '', accent: '#8c4b55',
            description: 'Pieza arquitectónica en piel de becerro con herrajes en oro rosa.'
        },
        {
            id: 7, name: 'Rose Gold Chain Belt', category: 'accesorios', price: 320,
            img: 'assets/belt.png', filter: '', accent: '#b8860b',
            description: 'Cinturón de cadena en oro rosa 18k. El toque final de cualquier look.'
        },
        {
            id: 8, name: 'Silk Scarf Crème', category: 'accesorios', price: 185,
            img: 'assets/scarf.png', filter: '', accent: '#b5896a',
            description: 'Pañuelo de seda pura con estampado artesanal exclusivo en crema.'
        },
        // ── Vestidos ──────────────────────────────────────────────────────────
        {
            id: 2, name: 'Rose Silk Gown', category: 'vestidos', price: 2400,
            img: 'assets/dress.png', filter: '', accent: '#8c4b55',
            description: 'Vestido de seda fluida en rosa empolvado para eventos de gala.'
        },
        {
            id: 6, name: 'Midnight Velvet Gown', category: 'vestidos', price: 1800,
            img: 'assets/dress.png', filter: 'hue-rotate(200deg) saturate(0.8) brightness(0.7)', accent: '#2c3e6b',
            description: 'Terciopelo azul noche con escote profundo y caída espectacular.'
        },
        {
            id: 10, name: 'Ivory Slip Dress', category: 'vestidos', price: 980,
            img: 'assets/dress.png', filter: 'saturate(0.15) brightness(1.35)', accent: '#a89070',
            description: 'Satén marfil cortado al bies. Fluye con cada movimiento del cuerpo.'
        },
        // ── Tops (Using hero.png which shows a model in a dress/tunic) ────────
        {
            id: 4, name: 'Editorial Silk Tunic', category: 'tops', price: 450,
            img: 'assets/hero.png', filter: 'saturate(0.6) brightness(1.05)', accent: '#8c4b55',
            description: 'Túnica de seda blanca con corte asimétrico. El básico de lujo definitivo.'
        },
        {
            id: 13, name: 'Minimalist Silk Dress', category: 'tops', price: 860,
            img: 'assets/hero.png', filter: 'hue-rotate(80deg) saturate(0.45) brightness(1.1)', accent: '#6a8c5a',
            description: 'Vestido de lino orgánico con hombros estructurados. Artesanía consciente.'
        },
        {
            id: 14, name: 'Asymmetric Silk Kaftan', category: 'tops', price: 520,
            img: 'assets/hero.png', filter: 'hue-rotate(290deg) saturate(0.9) brightness(0.95)', accent: '#9b5c7a',
            description: 'Kaftán asimétrico en satén champagne. Define la silueta con elegancia.'
        },
        // ── Calzado ───────────────────────────────────────────────────────────
        {
            id: 3, name: 'Champagne Stilettos', category: 'calzado', price: 850,
            img: 'assets/shoes.png', filter: '', accent: '#b8860b',
            description: 'Tacones de aguja con acabado satinado y plantilla ergonómica artesanal.'
        },
        {
            id: 17, name: 'Noir Patent Pumps', category: 'calzado', price: 730,
            img: 'assets/shoes.png', filter: 'grayscale(100%) brightness(0.45)', accent: '#222',
            description: 'Salones en charol negro con puntera afilada. El clásico reinventado.'
        },
        {
            id: 18, name: 'Rose Strappy Sandals', category: 'calzado', price: 490,
            img: 'assets/shoes.png', filter: 'hue-rotate(310deg) saturate(1.4) brightness(1.1)', accent: '#c27a80',
            description: 'Sandalias de tiras finas en ante rosa blush con hebilla dorada.'
        },
    ];

    let cart     = JSON.parse(localStorage.getItem('yumey_cart'))     || [];
    let wishlist = JSON.parse(localStorage.getItem('yumey_wishlist')) || [];
    let isLoggedIn = localStorage.getItem('yumey_user') === 'true';
    let currentSection = 'home';

    // ─── ELEMENTS ─────────────────────────────────
    const sections = document.querySelectorAll('.page-section');
    const cartSidebar     = document.getElementById('cart-sidebar');
    const mobileMenu      = document.getElementById('mobile-menu');
    const sizeGuideModal  = document.getElementById('size-guide-modal');
    const toast           = document.getElementById('toast');

    // ─── ROUTER ───────────────────────────────────
    function navigateTo(id) {
        if (!id) return;
        // Profile guard
        if (id === 'profile' && !isLoggedIn) { navigateTo('auth'); return; }

        sections.forEach(s => s.classList.remove('active'));
        const target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            currentSection = id;
        }

        // Section-specific rendering
        if (id === 'home')    renderHome();
        if (id === 'catalog') renderCatalog();
        if (id === 'wishlist') renderWishlist();
        if (id === 'checkout') renderCheckoutSummary();
        if (id === 'lookbook-ete') window.scrollTo({top:0});
        if (id === 'lookbook-editorial') window.scrollTo({top:0});
        if (id === 'elegancia-atemporal') window.scrollTo({top:0});

        // Close overlays
        cartSidebar.classList.remove('open');
        mobileMenu.classList.remove('open');
        closeSizeGuide();

        // Update active state in mobile bottom nav
        document.querySelectorAll('.mob-nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-link') === id);
        });
    }


    // Attach all [data-link] anchors (including those injected later via JS)
    document.addEventListener('click', e => {
        const link = e.target.closest('[data-link]');
        if (link) {
            e.preventDefault();
            navigateTo(link.getAttribute('data-link'));
        }
        // Global data-action="add" buttons (lookbook, etc.)
        const addBtn = e.target.closest('[data-action="add"]');
        if (addBtn) {
            const id = parseInt(addBtn.getAttribute('data-id'));
            const p  = products.find(p => p.id === id);
            if (p) addToCart(p);
        }
        // Size selector
        const sizeBtn = e.target.closest('.size-btn');
        if (sizeBtn) {
            sizeBtn.closest('.size-options').querySelectorAll('.size-btn')
                   .forEach(b => b.classList.remove('active'));
            sizeBtn.classList.add('active');
        }
    });

    // ─── OVERLAYS ────────────────────────────────
    document.getElementById('cart-trigger')?.addEventListener('click', e => {
        e.preventDefault();
        cartSidebar.classList.add('open');
    });
    document.getElementById('cart-close')?.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    document.getElementById('menu-open')?.addEventListener('click', () => {
        mobileMenu.classList.add('open');
    });
    document.getElementById('menu-close')?.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });

    // ─── TOAST ────────────────────────────────────
    function showToast(msg, type = 'success') {
        toast.textContent = msg;
        toast.className = `toast show ${type}`;
        clearTimeout(toast._t);
        toast._t = setTimeout(() => toast.classList.remove('show'), 3200);
    }

    // ─── RENDER HOME ──────────────────────────────
    function renderHome() {
        const c = document.getElementById('home-featured-products');
        if (!c) return;
        c.innerHTML = '';
        // Show 4 products on home instead of 3 for a better grid
        products.slice(0, 4).forEach(p => c.appendChild(createCard(p)));
    }

    // ─── RENDER CATALOG ───────────────────────────
    function renderCatalog(filter = 'all') {
        const c     = document.getElementById('catalog-products');
        const count = document.getElementById('product-count');
        if (!c) return;
        c.innerHTML = '';
        const list  = filter === 'all' ? products : products.filter(p => p.category === filter);
        count.textContent = `Mostrando ${list.length} producto${list.length !== 1 ? 's' : ''}`;
        list.forEach(p => c.appendChild(createCard(p)));
    }

    // ─── PRODUCT CARD FACTORY ─────────────────────
    function createCard(p) {
        const div = document.createElement('div');
        div.className = 'product-card img-reveal';
        const wishlisted = wishlist.some(w => w.id === p.id);
        const filterStyle = p.filter ? `filter:${p.filter};` : '';
        div.innerHTML = `
            <div class="product-image" style="cursor:pointer;">
                <img src="${p.img}" alt="${p.name}" loading="lazy" style="${filterStyle}">
            </div>
            <div class="product-info">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <h3 class="product-name">${p.name}</h3>
                        <p class="product-price">${p.price.toLocaleString('es-ES')} €</p>
                    </div>
                    <button class="wishlist-btn" data-id="${p.id}" title="Lista de deseos"
                        style="background:none;border:none;cursor:pointer;font-size:1.1rem;color:${wishlisted ? 'var(--color-secondary)' : 'var(--color-outline)'};">
                        <i class="fa-${wishlisted ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        div.querySelector('.product-image').addEventListener('click', () => showProductDetail(p.id));
        div.querySelector('.wishlist-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWishlist(p, div);
        });
        return div;
    }

    // ─── PRODUCT DETAIL ───────────────────────────
    function showProductDetail(id) {
        const p   = products.find(x => x.id === id);
        const box = document.getElementById('detail-container');
        if (!p || !box) return;
        navigateTo('product-detail');
        box.innerHTML = `
            <div class="detail-image img-reveal">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="detail-content">
                <span style="font-size:.7rem;text-transform:uppercase;letter-spacing:0.3em;color:var(--color-outline);display:block;margin-bottom:12px;">${p.category}</span>
                <h1 style="margin-bottom:16px; font-weight:300;">${p.name}</h1>
                <p class="detail-price" style="font-family:var(--font-body); font-size:1.5rem; color:var(--color-on-surface); opacity:0.8; margin-bottom:32px;">${p.price.toLocaleString('es-ES')} €</p>
                <p class="detail-description" style="line-height:2; margin-bottom:48px;">${p.description}</p>

                <div class="size-selector">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                        <p style="margin:0; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.1em; font-weight:600;">Seleccionar Talla</p>
                        <button id="open-size-guide" style="background:none;border:none;font-size:.65rem;text-transform:uppercase;letter-spacing:0.1em;cursor:pointer;color:var(--color-outline);">Guía de tallas</button>
                    </div>
                    <div class="size-options">
                        <button class="size-btn">XS</button>
                        <button class="size-btn active">S</button>
                        <button class="size-btn">M</button>
                        <button class="size-btn">L</button>
                        <button class="size-btn">XL</button>
                    </div>
                </div>

                <div style="display:flex;gap:16px;margin-top:48px;">
                    <button class="btn" id="detail-add-cart" style="flex:1;" data-id="${p.id}" data-action="add">Añadir a la Bolsa</button>
                    <button class="btn btn-outline wishlist-btn" data-id="${p.id}" style="width:64px; border-color:rgba(0,0,0,0.1);">
                        <i class="fa-${wishlist.some(w=>w.id===p.id)?'solid':'regular'} fa-heart"></i>
                    </button>
                </div>

                <div style="margin-top:80px;border-top:1px solid rgba(0,0,0,0.05);padding-top:40px;">
                    <details style="margin-bottom:24px;">
                        <summary style="font-weight:600;cursor:pointer;text-transform:uppercase;font-size:.65rem;letter-spacing:.2em;list-style:none;display:flex;justify-content:space-between;opacity:0.6;">
                            Composición y Cuidados <span>+</span>
                        </summary>
                        <p style="padding:20px 0;font-size:.875rem;color:var(--color-outline);line-height:1.8;">100% Seda natural de Mulberry. Lavado en seco únicamente. Fabricado artesanalmente en nuestros talleres de Madrid.</p>
                    </details>
                    <details>
                        <summary style="font-weight:600;cursor:pointer;text-transform:uppercase;font-size:.65rem;letter-spacing:.2em;list-style:none;display:flex;justify-content:space-between;opacity:0.6;">
                            Envío y Devoluciones <span>+</span>
                        </summary>
                        <p style="padding:20px 0;font-size:.875rem;color:var(--color-outline);line-height:1.8;">Envío express gratuito en todos los pedidos. Devoluciones de cortesía dentro de los 14 días siguientes a la entrega.</p>
                    </details>
                </div>
            </div>
        `;
        document.getElementById('open-size-guide').addEventListener('click', openSizeGuide);
        box.querySelector('.wishlist-btn').addEventListener('click', () => {
            toggleWishlist(p, box.querySelector('.wishlist-btn'));
        });
    }

    // ─── WISHLIST ─────────────────────────────────
    function toggleWishlist(p, el) {
        const idx = wishlist.findIndex(w => w.id === p.id);
        if (idx === -1) {
            wishlist.push(p);
            showToast(`${p.name} guardado en Lista de Deseos ♡`);
        } else {
            wishlist.splice(idx, 1);
            showToast(`${p.name} eliminado de Lista de Deseos`);
        }
        localStorage.setItem('yumey_wishlist', JSON.stringify(wishlist));
        // Update icon
        const icon = el.querySelector ? el.querySelector('i') : el;
        const inList = wishlist.some(w => w.id === p.id);
        if (icon) {
            icon.className = `fa-${inList ? 'solid' : 'regular'} fa-heart`;
            el.style.color = inList ? 'var(--color-secondary)' : 'var(--color-outline)';
        }
        if (currentSection === 'wishlist') renderWishlist();
    }

    function renderWishlist() {
        const grid = document.getElementById('wishlist-grid');
        if (!grid) return;
        grid.innerHTML = '';
        if (wishlist.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:80px 0;color:var(--color-outline);">
                    <i class="fa-regular fa-heart" style="font-size:3rem;display:block;margin-bottom:20px;"></i>
                    <p>Aún no has guardado ninguna pieza.</p>
                    <a href="#" data-link="catalog" class="btn" style="margin-top:30px;display:inline-block;">Explorar Colección</a>
                </div>`;
            return;
        }
        wishlist.forEach(p => grid.appendChild(createCard(p)));
    }

    // ─── CART ─────────────────────────────────────
    function addToCart(p) {
        cart.push(p);
        localStorage.setItem('yumey_cart', JSON.stringify(cart));
        updateCartUI();
        cartSidebar.classList.add('open');
        showToast(`${p.name} añadido a tu bolsa ✓`);
    }

    function removeFromCart(idx) {
        cart.splice(idx, 1);
        localStorage.setItem('yumey_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        const countEl  = document.getElementById('cart-count');
        const itemsBox = document.getElementById('cart-items-container');
        const totalEl  = document.getElementById('cart-total-value');
        if (!itemsBox) return;

        countEl.textContent = cart.length;
        itemsBox.innerHTML  = '';

        if (cart.length === 0) {
            itemsBox.innerHTML = `<p style="text-align:center;color:var(--color-outline);padding:40px 0;">Tu bolsa está vacía.</p>`;
            totalEl.textContent = '0 €';
            return;
        }

        let total = 0;
        cart.forEach((item, i) => {
            total += item.price;
            const d = document.createElement('div');
            d.className = 'cart-item';
            d.innerHTML = `
                <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">${item.price.toLocaleString('es-ES')} €</p>
                    <button class="remove-cart-btn" data-idx="${i}"
                        style="margin-top:8px;font-size:.7rem;text-transform:uppercase;
                               color:var(--color-outline);border-bottom:1px solid;background:none;border-top:none;border-left:none;border-right:none;cursor:pointer;padding:0;">
                        Eliminar
                    </button>
                </div>
            `;
            d.querySelector('.remove-cart-btn').addEventListener('click', () => removeFromCart(i));
            itemsBox.appendChild(d);
        });
        totalEl.textContent = `${total.toLocaleString('es-ES')} €`;
    }

    // ─── CHECKOUT SUMMARY ─────────────────────────
    function renderCheckoutSummary() {
        const s = document.getElementById('checkout-summary');
        if (!s) return;
        const total = cart.reduce((sum, x) => sum + x.price, 0);
        s.innerHTML = `
            <div class="glass" style="padding:40px;border-radius:var(--radius-lg);">
                <h3 style="margin-bottom:24px;">Resumen del Pedido</h3>
                ${cart.map(x => `
                    <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:.875rem;">
                        <span>${x.name}</span>
                        <span>${x.price.toLocaleString('es-ES')} €</span>
                    </div>`).join('')}
                <div style="display:flex;justify-content:space-between;margin:16px 0;font-size:.875rem;color:var(--color-outline);">
                    <span>Envío</span><span>Gratis</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:1.5rem;font-weight:700;border-top:1px solid var(--color-outline);padding-top:16px;margin-top:8px;">
                    <span>Total</span><span>${total.toLocaleString('es-ES')} €</span>
                </div>
            </div>`;
    }

    // ─── SIZE GUIDE MODAL ─────────────────────────
    function openSizeGuide() {
        sizeGuideModal.style.display = 'flex';
    }
    function closeSizeGuide() {
        if (sizeGuideModal) sizeGuideModal.style.display = 'none';
    }
    document.getElementById('size-guide-close').addEventListener('click', closeSizeGuide);
    sizeGuideModal.addEventListener('click', e => { if (e.target === sizeGuideModal) closeSizeGuide(); });

    // ─── HEADER SCROLL ────────────────────────────
    window.addEventListener('scroll', () => {
        document.getElementById('main-header').classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ─── CART SIDEBAR ─────────────────────────────
    document.getElementById('cart-trigger').addEventListener('click', e => {
        e.preventDefault();
        cartSidebar.classList.add('open');
    });
    document.getElementById('cart-close').addEventListener('click', () => cartSidebar.classList.remove('open'));
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            cartSidebar.classList.remove('open');
            mobileMenu.classList.remove('open');
            closeSizeGuide();
        }
    });

    // ─── MOBILE MENU ──────────────────────────────
    document.getElementById('menu-open').addEventListener('click', () => mobileMenu.classList.add('open'));
    document.getElementById('menu-close').addEventListener('click', () => mobileMenu.classList.remove('open'));

    // ─── FILTERS ──────────────────────────────────
    document.getElementById('category-filter').addEventListener('click', e => {
        const li = e.target.closest('li');
        if (!li) return;
        document.querySelectorAll('#category-filter li').forEach(x => x.classList.remove('active'));
        li.classList.add('active');
        renderCatalog(li.getAttribute('data-category'));
    });

    // ─── CHECKOUT BTN ─────────────────────────────
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) { showToast('Tu bolsa está vacía', 'error'); return; }
        navigateTo('checkout');
    });

    document.getElementById('complete-order-btn').addEventListener('click', () => {
        showToast('¡Pedido completado! Gracias por confiar en Yumey. 🎉');
        cart = [];
        localStorage.removeItem('yumey_cart');
        updateCartUI();
        setTimeout(() => navigateTo('home'), 2000);
    });

    // ─── AUTH ─────────────────────────────────────
    document.getElementById('login-btn').addEventListener('click', () => {
        isLoggedIn = true;
        localStorage.setItem('yumey_user', 'true');
        showToast('Bienvenida de nuevo ✨');
        updateAuthUI();
        navigateTo('profile');
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        isLoggedIn = false;
        localStorage.removeItem('yumey_user');
        showToast('Sesión cerrada');
        updateAuthUI();
        navigateTo('home');
    });

    function updateAuthUI() {
        const btn = document.getElementById('user-profile-btn');
        if (!btn) return;
        btn.innerHTML = isLoggedIn
            ? '<i class="fa-solid fa-circle-user"></i>'
            : '<i class="fa-regular fa-user"></i>';
        btn.setAttribute('data-link', isLoggedIn ? 'profile' : 'auth');
    }

    // ─── INIT ─────────────────────────────────────
    updateCartUI();
    updateAuthUI();
    renderHome();
    navigateTo('home');
});
