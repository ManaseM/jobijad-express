const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : window.location.origin + '/api';
let cart = JSON.parse(localStorage.getItem('jobiCart') || '[]');

function getToken() { return localStorage.getItem('jobiToken'); }

async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
}

// ===== AUTH =====
function checkAuthState() {
    const token = getToken();
    const headerBtn = document.getElementById('login-header-btn');
    const authText = document.getElementById('auth-link-text');
    const sidebarLink = document.getElementById('sidebar-auth-link');
    if (!token) return;

    apiCall('/auth/me').then(data => {
        const user = data.user || {};
        const name = user.name || 'Account';
        if (authText) authText.textContent = `Hi, ${name.split(' ')[0]}`;
        if (headerBtn) {
            headerBtn.href = '#';
            headerBtn.onclick = (e) => { e.preventDefault(); openAccountPanel(); };
        }
        if (sidebarLink) {
            sidebarLink.querySelector('span').textContent = `Hi, ${name.split(' ')[0]}`;
            sidebarLink.href = '#';
            sidebarLink.onclick = (e) => { e.preventDefault(); openAccountPanel(); };
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
    }).catch(() => localStorage.removeItem('jobiToken'));
}

function openAccountPanel() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const panel = document.getElementById('account-panel');
    if (!panel) return;

    const name = user.name || '—';
    const email = user.email || '—';
    const role = (user.role || 'customer').toUpperCase();
    const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'}) : '—';

    ['ap-name','ap-name2'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = name; });
    ['ap-email','ap-email2'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = email; });
    const roleEl = document.getElementById('ap-role'); if(roleEl) roleEl.textContent = role;
    const joinedEl = document.getElementById('ap-joined'); if(joinedEl) joinedEl.textContent = joined;

    // Show avatar if exists
    setAvatarDisplay(user.avatar || null);

    panel.classList.add('open');
    const overlay = document.getElementById('account-overlay');
    if (overlay) overlay.classList.add('active');
    // Always start in view mode
    const viewMode = document.getElementById('ap-view-mode');
    const editMode = document.getElementById('ap-edit-mode');
    if (viewMode) viewMode.style.display = 'block';
    if (editMode) editMode.style.display = 'none';
}

function setAvatarDisplay(src) {
    const img = document.getElementById('ap-avatar-img');
    const icon = document.getElementById('ap-avatar-icon');
    if (!img || !icon) return;
    if (src) {
        img.src = src;
        img.style.display = 'block';
        icon.style.display = 'none';
    } else {
        img.style.display = 'none';
        icon.style.display = 'block';
    }
}

function handleAvatarUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64 = e.target.result;
        setAvatarDisplay(base64);
        // Save to server
        try {
            const apiBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? 'http://localhost:3000/api'
                : window.location.origin + '/api';
            const res = await fetch(apiBase + '/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
                body: JSON.stringify({
                    name: JSON.parse(localStorage.getItem('currentUser') || '{}').name || '',
                    email: JSON.parse(localStorage.getItem('currentUser') || '{}').email || '',
                    avatar: base64
                })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                showNotification('Profile photo updated!', 'success');
            } else {
                showNotification(data.message || 'Failed to save photo', 'error');
            }
        } catch(e) {
            showNotification('Could not save photo — server not reachable', 'error');
        }
    };
    reader.readAsDataURL(file);
}

function closeAccountPanel() {
    const panel = document.getElementById('account-panel');
    const overlay = document.getElementById('account-overlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

function doLogout() {
    localStorage.removeItem('jobiToken');
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => location.reload(), 900);
}

function handleAccountBtn() {
    const token = getToken();
    if (token) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
        openAccountPanel();
    } else {
        window.location.href = 'login.html';
    }
}

function toggleEditMode(editing) {
    document.getElementById('ap-view-mode').style.display = editing ? 'none' : 'block';
    document.getElementById('ap-edit-mode').style.display = editing ? 'block' : 'none';
    if (editing) {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        document.getElementById('ap-edit-name').value = user.name || '';
        document.getElementById('ap-edit-email').value = user.email || '';
        const msg = document.getElementById('ap-edit-msg');
        msg.style.display = 'none';
    }
}

async function saveProfile() {
    const name = document.getElementById('ap-edit-name').value.trim();
    const email = document.getElementById('ap-edit-email').value.trim();
    const msg = document.getElementById('ap-edit-msg');
    const btn = document.getElementById('ap-save-btn');

    if (!name || !email) {
        msg.textContent = 'Name and email are required.';
        msg.style.cssText = 'display:block;padding:10px 12px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#fee2e2;color:#991b1b;';
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    try {
        const res = await fetch(API_BASE + '/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
            body: JSON.stringify({ name, email, avatar: JSON.parse(localStorage.getItem('currentUser') || '{}').avatar || undefined })
        });
        const data = await res.json();
        if (!res.ok) {
            msg.textContent = data.message || 'Failed to update profile.';
            msg.style.cssText = 'display:block;padding:10px 12px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#fee2e2;color:#991b1b;';
            btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            btn.disabled = false;
            return;
        }
        // Update localStorage and panel header
        const updated = data.user;
        localStorage.setItem('currentUser', JSON.stringify(updated));
        ['ap-name','ap-name2'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = updated.name; });
        ['ap-email','ap-email2'].forEach(id => { const el = document.getElementById(id); if(el) el.textContent = updated.email; });
        setAvatarDisplay(updated.avatar || null);
        const authText = document.getElementById('auth-link-text');
        if (authText) authText.textContent = 'Hi, ' + updated.name.split(' ')[0];

        msg.textContent = 'Profile updated successfully!';
        msg.style.cssText = 'display:block;padding:10px 12px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#dcfce7;color:#15803d;';
        btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        btn.disabled = false;
        setTimeout(() => toggleEditMode(false), 1200);
    } catch(e) {
        msg.textContent = 'Could not connect to server.';
        msg.style.cssText = 'display:block;padding:10px 12px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#fee2e2;color:#991b1b;';
        btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        btn.disabled = false;
    }
}

// ===== SIDEBAR =====
function initSidebar() {
    document.getElementById('menu-btn')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.add('active');
    });
    document.getElementById('sidebar-close')?.addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// ===== CART =====
function initCart() {
    document.getElementById('cart-toggle-btn')?.addEventListener('click', openCart);
    document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
    document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(this.closest('.product-card'));
        });
    });
    renderCart();
}

function openCart() {
    document.getElementById('cart-panel').classList.add('open');
    document.getElementById('cart-overlay').classList.add('active');
}
function closeCart() {
    document.getElementById('cart-panel').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('active');
}

function addToCart(card) {
    const title = card.querySelector('.product-title').textContent;
    const price = parseFloat(card.querySelector('.product-price').textContent.replace(/[^0-9.]/g, '')) || 0;
    const image = card.querySelector('.product-image img').src;
    const productId = card.dataset.productId || null;

    const existing = cart.find(i => i.title === title);
    if (existing) { existing.qty += 1; }
    else { cart.push({ title, price, image, qty: 1, productId }); }

    saveCart();
    renderCart();
    updateCartBadge();
    openCart();
    showNotification(`Added to cart`, 'success');

    if (getToken() && productId) {
        apiCall('/cart/add', 'POST', { productId, quantity: 1 }).catch(() => {});
    }
}

function removeFromCart(i) { cart.splice(i, 1); saveCart(); renderCart(); updateCartBadge(); }
function changeQty(i, d) {
    cart[i].qty += d;
    if (cart[i].qty <= 0) { removeFromCart(i); return; }
    saveCart(); renderCart(); updateCartBadge();
}
function saveCart() { localStorage.setItem('jobiCart', JSON.stringify(cart)); }

function renderCart() {
    const el = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    if (!el) return;
    if (cart.length === 0) {
        el.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>';
        if (footer) footer.style.display = 'none';
        return;
    }
    if (footer) footer.style.display = 'block';
    let total = 0;
    el.innerHTML = cart.map((item, i) => {
        total += item.price * item.qty;
        const linePrice = (typeof convertPrice === 'function') ? convertPrice(item.price * item.qty) : '$' + (item.price * item.qty).toFixed(2);
        return '<div class="cart-item">' +
            '<img class="cart-item-img" src="' + item.image + '" alt="' + item.title + '">' +
            '<div class="cart-item-details">' +
                '<div class="cart-item-title">' + item.title + '</div>' +
                '<div class="cart-item-price">' + linePrice + '</div>' +
                '<div class="cart-item-qty">' +
                    '<button class="qty-btn" onclick="changeQty(' + i + ',-1)">&#8722;</button>' +
                    '<span class="qty-value">' + item.qty + '</span>' +
                    '<button class="qty-btn" onclick="changeQty(' + i + ',1)">+</button>' +
                '</div>' +
            '</div>' +
            '<button class="cart-item-remove" onclick="removeFromCart(' + i + ')"><i class="fas fa-trash"></i></button>' +
        '</div>';
    }).join('');
    const totalDisplay = (typeof convertPrice === 'function') ? convertPrice(total) : '$' + total.toFixed(2);
    document.getElementById('cart-total').textContent = totalDisplay;
    if (typeof updateFreeShippingBar === 'function') updateFreeShippingBar();
}

function updateCartBadge() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = total;
}

function checkout() {
    if (cart.length === 0) return;
    saveCart();
    // Check purchase milestone — award promo code if eligible
    checkPurchaseMilestone();
    window.location.href = 'checkout.html';
}

// Award promo codes based on total purchase history (milestone system)
function checkPurchaseMilestone() {
    const orders = JSON.parse(localStorage.getItem('jobiOrders') || '[]');
    const totalSpent = orders.reduce(function(s, o) { return s + (parseFloat(o.total) || 0); }, 0);
    const cartTotal = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
    const newTotal = totalSpent + cartTotal;

    // Milestone thresholds
    const milestones = [
        { threshold: 100, code: 'LOYAL10', discount: 10, msg: '🎉 You\'ve spent over $100! Here\'s your reward code: LOYAL10 (10% off)' },
        { threshold: 250, code: 'VIP15', discount: 15, msg: '🌟 VIP milestone! You\'ve spent over $250! Code: VIP15 (15% off)' },
        { threshold: 500, code: 'GOLD20', discount: 20, msg: '👑 Gold customer! Over $500 spent! Code: GOLD20 (20% off)' },
        { threshold: 1000, code: 'ELITE25', discount: 25, msg: '💎 Elite status! Over $1000 spent! Code: ELITE25 (25% off)' }
    ];

    const awardedCodes = JSON.parse(localStorage.getItem('jobiAwardedCodes') || '[]');
    milestones.forEach(function(m) {
        if (newTotal >= m.threshold && !awardedCodes.includes(m.code)) {
            // Award the code
            awardedCodes.push(m.code);
            localStorage.setItem('jobiAwardedCodes', JSON.stringify(awardedCodes));
            // Add to active promo codes
            var codes = {};
            try { codes = JSON.parse(localStorage.getItem('jobiPromoCodes') || 'null') || {}; } catch(e) { codes = {}; }
            codes[m.code] = m.discount;
            localStorage.setItem('jobiPromoCodes', JSON.stringify(codes));
            // Show notification
            setTimeout(function() { showNotification(m.msg, 'success'); }, 500);
        }
    });
}

// ===== SEARCH =====
function doHeaderSearch() {
    const q = document.getElementById('header-search')?.value.trim();
    if (!q) return;
    filterProducts(q);
}

let attachedImageKeywords = '';
let attachedFileData = null;

function showAttachMenu(e) {
    e.stopPropagation();
    var menu = document.getElementById('attach-menu');
    if (!menu) return;
    // Position near the button
    var btn = e.currentTarget;
    var rect = btn.getBoundingClientRect();
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    menu.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
    menu.style.right = (window.innerWidth - rect.right + 0) + 'px';
    // Close on outside click
    setTimeout(function() {
        document.addEventListener('click', function closeMenu() {
            menu.style.display = 'none';
            document.removeEventListener('click', closeMenu);
        }, { once: true });
    }, 10);
}

function triggerAttach(accept) {
    var input = document.getElementById('attach-file-input');
    if (input) {
        input.accept = accept;
        input.click();
    }
    var menu = document.getElementById('attach-menu');
    if (menu) menu.style.display = 'none';
}

function handleAttachment(input) {
    const file = input.files[0];
    if (!file) return;

    const name = file.name;
    const type = file.type;
    const preview = document.getElementById('attach-preview');
    const nameEl = document.getElementById('attach-name');
    const iconEl = document.getElementById('attach-type-icon');

    // Determine icon and label by type
    let icon = 'fas fa-file';
    let color = '#f97316';
    let keywords = name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();

    if (type.startsWith('image/')) {
        icon = 'fas fa-image'; color = '#f97316';
    } else if (type.startsWith('video/')) {
        icon = 'fas fa-video'; color = '#8b5cf6';
        keywords = 'video ' + keywords;
    } else if (type === 'application/pdf') {
        icon = 'fas fa-file-pdf'; color = '#ef4444';
        keywords = 'document ' + keywords;
    } else if (type.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) {
        icon = 'fas fa-file-word'; color = '#2563eb';
        keywords = 'document ' + keywords;
    } else if (type.includes('excel') || type.includes('spreadsheet') || name.endsWith('.csv')) {
        icon = 'fas fa-file-excel'; color = '#16a34a';
    } else if (type.includes('powerpoint') || type.includes('presentation')) {
        icon = 'fas fa-file-powerpoint'; color = '#ea580c';
    } else if (type === 'text/plain') {
        icon = 'fas fa-file-alt'; color = '#64748b';
    }

    if (iconEl) { iconEl.className = icon; iconEl.style.color = color; }
    if (nameEl) nameEl.textContent = name.length > 16 ? name.substring(0, 14) + '…' : name;
    if (preview) preview.style.display = 'flex';

    attachedImageKeywords = keywords;
    attachedFileData = { name, type, size: file.size };

    // Pre-fill search box if empty
    const searchInput = document.getElementById('bottom-search-input');
    if (searchInput && !searchInput.value.trim() && keywords) {
        searchInput.value = keywords;
    }

    const typeLabel = type.startsWith('image/') ? 'Image' : type.startsWith('video/') ? 'Video' : 'File';
    showNotification(typeLabel + ' attached — tap Search to find similar products', 'info');
    input.value = '';
}

function clearAttachment() {
    attachedImageKeywords = '';
    attachedFileData = null;
    document.getElementById('attach-preview').style.display = 'none';
    document.getElementById('attach-name').textContent = '';
}

function doBottomSearch() {
    const q = document.getElementById('bottom-search-input')?.value.trim() || attachedImageKeywords;
    if (!q) { showNotification('Please enter what you are looking for or attach an image', 'warning'); return; }
    filterProducts(q);
    showNotification('Showing results for "' + q + '"', 'info');
    clearAttachment();
    const searchInput = document.getElementById('bottom-search-input');
    if (searchInput) searchInput.value = '';
}
function filterProducts(q) {
    document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        card.style.display = title.includes(q.toLowerCase()) ? '' : 'none';
    });
}
function filterCategory(cat) {
    closeSidebar();
    document.querySelectorAll('.product-card').forEach(card => {
        if (!cat) { card.style.display = ''; return; }
        const badge = card.querySelector('.supplier-badge')?.textContent.toLowerCase() || '';
        card.style.display = badge.includes(cat.toLowerCase()) ? '' : 'none';
    });
    showNotification(cat ? `Showing ${cat} products` : 'Showing all products', 'info');
}

function showOffers() {
    closeSidebar();
    // Show only products with HOT or star badges (featured/on offer)
    let count = 0;
    document.querySelectorAll('.product-card').forEach(card => {
        const badge = card.querySelector('.product-badge');
        const hasBadge = badge && (badge.textContent.includes('HOT') || badge.textContent.includes('★') || badge.textContent.includes('⭐') || badge.innerHTML.includes('11088'));
        card.style.display = hasBadge ? '' : 'none';
        if (hasBadge) count++;
    });
    // Update section title
    const title = document.querySelector('.section-title');
    if (title) title.textContent = '🏷️ Special Offers & Featured Products';
    showNotification(count + ' special offers available!', 'success');
    // Add a "Show All" button if not already there
    if (!document.getElementById('show-all-btn')) {
        const btn = document.createElement('button');
        btn.id = 'show-all-btn';
        btn.textContent = '← Show All Products';
        btn.style.cssText = 'display:block;margin:0 auto 16px;background:none;border:1.5px solid #f97316;color:#f97316;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;';
        btn.onclick = function() {
            document.querySelectorAll('.product-card').forEach(c => c.style.display = '');
            const t = document.querySelector('.section-title');
            if (t) t.textContent = 'Featured Products';
            btn.remove();
        };
        const grid = document.getElementById('products-grid');
        if (grid) grid.parentNode.insertBefore(btn, grid);
    }
}

// ===== INQUIRY =====
function initInquiry() {
    document.querySelectorAll('.inquiry-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const title = this.closest('.product-card').querySelector('.product-title').textContent;
            showInquiryForm(title);
        });
    });
}
function showInquiryForm(title) {
    const modal = createModal('Send Inquiry', `
        <div class="inquiry-form">
            <p style="margin-bottom:14px;color:#666;font-size:13px">Product: <strong>${title}</strong></p>
            <div class="form-group"><label>Your Name *</label><input type="text" id="iq-name" placeholder="John Doe"></div>
            <div class="form-group"><label>Email *</label><input type="email" id="iq-email" placeholder="you@email.com"></div>
            <div class="form-group"><label>Quantity</label><input type="number" id="iq-qty" placeholder="1" min="1"></div>
            <div class="form-group"><label>Message *</label><textarea id="iq-msg" rows="3" placeholder="Describe your requirements..."></textarea></div>
            <div class="form-actions">
                <button class="cancel-btn" onclick="closeModal()">Cancel</button>
                <button class="submit-inquiry-btn" onclick="submitInquiry('${title.replace(/'/g,"\\'")}')">Send Inquiry</button>
            </div>
        </div>`);
    document.body.appendChild(modal);
}
function submitInquiry(title) {
    var name = document.getElementById('iq-name') ? document.getElementById('iq-name').value.trim() : '';
    var email = document.getElementById('iq-email') ? document.getElementById('iq-email').value.trim() : '';
    var qty = document.getElementById('iq-qty') ? document.getElementById('iq-qty').value : '1';
    var msg = document.getElementById('iq-msg') ? document.getElementById('iq-msg').value.trim() : '';
    if (!name || !email) { showNotification('Please fill in name and email', 'warning'); return; }
    if (!msg) { showNotification('Please enter a message', 'warning'); return; }

    var user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    var payload = { name: name, email: email, productName: title, quantity: parseInt(qty) || 1, message: msg, userId: user.id || null };

    fetch(API_BASE + '/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(function(res) { return res.json(); }).then(function() {
        closeModal();
        showNotification('Inquiry sent for "' + title.substring(0, 30) + '"', 'success');
    }).catch(function() {
        closeModal();
        showNotification('Inquiry sent!', 'success');
    });
}

// ===== PRODUCTS FROM DB =====
async function loadProductsFromDB() {
    try {
        const data = await apiCall('/products?limit=100');
        if (data.products && data.products.length > 0) {
            renderDBProducts(data.products);
            setTimeout(initScrollReveal, 50);
            document.dispatchEvent(new Event('productsLoaded'));
        } else {
            const grid = document.getElementById('products-grid');
            if (grid) grid.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#aaa;grid-column:1/-1;"><i class="fas fa-store" style="font-size:48px;color:#e0e0e0;display:block;margin-bottom:16px;"></i><p style="font-size:16px;font-weight:600;color:#555;margin-bottom:8px;">No products yet</p><p style="font-size:13px;">Check back soon — new arrivals coming!</p></div>';
        }
    } catch (e) { /* keep static products */ }
}
function renderDBProducts(products) {
    window._allProducts = products;
    _renderProductCards(products);
}

function _renderProductCards(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    const countEl = document.getElementById('product-count');
    if (countEl) countEl.textContent = products.length + ' product' + (products.length !== 1 ? 's' : '');
    grid.innerHTML = products.map(p => {
        const img = (p.images && p.images[0] && p.images[0].url) ? p.images[0].url : 'https://via.placeholder.com/400';
        const stock = (p.sizes||[]).reduce((t,s)=>t+(s.stock||0),0);
        const badge = p.featured ? '<span class="product-badge">Featured</span>' : '';
        return '<div class="product-card" data-product-id="'+p.id+'" data-price="'+p.price+'" data-name="'+p.name.replace(/"/g,"&quot;")+'">'+
            '<div class="product-image">'+
                '<img src="'+img+'" alt="'+p.name+'" loading="lazy">'+
                '<div class="product-overlay"><button class="overlay-btn"><i class="fas fa-search-plus"></i></button></div>'+
                badge+
            '</div>'+
            '<div class="product-info">'+
                '<h3 class="product-title">'+p.name+'</h3>'+
                '<div class="product-price">$'+p.price.toFixed(2)+'</div>'+
                '<div class="product-meta">Stock: '+stock+' pcs</div>'+
                '<span class="supplier-badge">'+p.category+'</span>'+
            '</div>'+
            '<div class="product-actions">'+
                '<button class="add-to-cart-btn"><i class="fas fa-cart-plus"></i> Add to Cart</button>'+
                '<button class="inquiry-btn"><i class="fas fa-envelope"></i> Inquire</button>'+
            '</div>'+
        '</div>';
    }).join('');
    initCart();
    initInquiry();
    initHeartButtons();
}

function sortProducts(val) {
    const products = window._allProducts || [];
    if (!products.length) return;
    let sorted = [...products];
    if (val === 'price-asc') sorted.sort((a,b) => a.price - b.price);
    else if (val === 'price-desc') sorted.sort((a,b) => b.price - a.price);
    else if (val === 'name-asc') sorted.sort((a,b) => a.name.localeCompare(b.name));
    else if (val === 'featured') sorted.sort((a,b) => (b.featured?1:0) - (a.featured?1:0));
    _renderProductCards(sorted);
    setTimeout(initScrollReveal, 50);
}

function showPolicy(type) {
    const policies = {
        privacy: { title: 'Privacy Policy', body: 'We collect your name, email, and order details to process your purchases. We never sell your data to third parties. Contact alitajudith2002@gmail.com to request data deletion.' },
        terms: { title: 'Terms of Service', body: 'By using Jobijad Express, you agree to provide accurate information when ordering. Prices are in USD. We reserve the right to cancel orders in cases of fraud. For disputes, contact us within 7 days of delivery.' },
        returns: { title: 'Returns Policy', body: 'We accept returns within 14 days of delivery for items in original condition. Contact us via WhatsApp (+46 762 593 231) or email with your order number. Return shipping costs are the customer responsibility unless the item was defective.' }
    };
    const p = policies[type];
    if (!p) return;
    const modal = createModal(p.title, '<p style="font-size:14px;color:#555;line-height:1.8;">'+p.body+'</p>');
    document.body.appendChild(modal);
}

// ===== MODAL & NOTIFICATION =====
function createModal(title, content) {
    const m = document.createElement('div');
    m.className = 'modal-overlay';
    m.innerHTML = `<div class="modal-content">
        <div class="modal-header"><h2>${title}</h2><button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button></div>
        <div class="modal-body">${content}</div>
    </div>`;
    m.addEventListener('click', e => { if (e.target === m) closeModal(); });
    return m;
}
function closeModal() { document.querySelector('.modal-overlay')?.remove(); }

function showNotification(msg, type = 'info') {
    const icons = { success:'check-circle', error:'exclamation-circle', warning:'exclamation-triangle', info:'info-circle' };
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `<div class="notification-content"><i class="fas fa-${icons[type]||'info-circle'}" style="color:${type==='success'?'#22c55e':type==='error'?'#ef4444':type==='warning'?'#f59e0b':'#3b82f6'}"></i><span>${msg}</span></div>`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

// ===== ENTER KEY SEARCH =====
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (document.activeElement?.id === 'header-search') doHeaderSearch();
        if (document.activeElement?.id === 'bottom-search-input') doBottomSearch();
    }
});

// ===== ENTER KEY SEARCH =====
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (document.activeElement?.id === 'header-search') doHeaderSearch();
        if (document.activeElement?.id === 'bottom-search-input') doBottomSearch();
    }
});

// ===== WISHLIST =====
let wishlist = JSON.parse(localStorage.getItem('jobiWishlist') || '[]');

function saveWishlist() { localStorage.setItem('jobiWishlist', JSON.stringify(wishlist)); }

function toggleWishlist(title, price, image) {
    const idx = wishlist.findIndex(i => i.title === title);
    if (idx >= 0) {
        wishlist.splice(idx, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push({ title, price, image });
        showNotification('Added to wishlist', 'success');
    }
    saveWishlist();
    updateWishlistBadge();
    refreshHeartButtons();
}

function updateWishlistBadge() {
    const count = wishlist.length;
    const el = document.getElementById('wishlist-sidebar-count');
    if (!el) return;
    el.textContent = count;
    el.style.display = count > 0 ? 'inline' : 'none';
}

function refreshHeartButtons() {
    document.querySelectorAll('.heart-btn').forEach(btn => {
        const title = btn.dataset.title;
        const inList = wishlist.some(i => i.title === title);
        btn.classList.toggle('active', inList);
        btn.style.color = inList ? '#ef4444' : '';
    });
}

function openWishlist() {
    closeSidePanels();
    renderWishlistPanel();
    document.getElementById('wishlist-panel').classList.add('open');
    document.getElementById('side-panel-overlay').classList.add('active');
}
function closeWishlist() {
    document.getElementById('wishlist-panel').classList.remove('open');
    document.getElementById('side-panel-overlay').classList.remove('active');
}

function renderWishlistPanel() {
    const el = document.getElementById('wishlist-items');
    if (!el) return;
    if (!wishlist.length) {
        el.innerHTML = '<div class="msg-empty"><i class="fas fa-heart"></i><p>Your wishlist is empty.</p><p style="font-size:12px;margin-top:6px">Click the heart on any product to save it.</p></div>';
        return;
    }
    el.innerHTML = wishlist.map((item, i) => `
        <div class="wishlist-item">
            <img class="wishlist-item-img" src="${item.image}" alt="${item.title}">
            <div class="wishlist-item-info">
                <div class="wishlist-item-title">${item.title}</div>
                <div class="wishlist-item-price">`+(typeof convertPrice===""function""?convertPrice(item.price):""$""+item.price.toFixed(2))+`</div>
                <div class="wishlist-item-actions">
                    <button class="wl-cart-btn" onclick="addWishlistToCart(${i})"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                    <button class="wl-remove-btn" onclick="removeFromWishlist(${i})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>`).join('');
}

function addWishlistToCart(i) {
    const item = wishlist[i];
    if (!item) return;
    const existing = cart.find(c => c.title === item.title);
    if (existing) existing.qty += 1;
    else cart.push({ title: item.title, price: item.price, image: item.image, qty: 1, productId: null });
    saveCart();
    renderCart();
    updateCartBadge();
    showNotification(`Added to cart`, 'success');
}

function removeFromWishlist(i) {
    wishlist.splice(i, 1);
    saveWishlist();
    updateWishlistBadge();
    refreshHeartButtons();
    renderWishlistPanel();
}

function initHeartButtons() {
    document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('.product-title')?.textContent;
        const price = parseFloat(card.querySelector('.product-price')?.textContent.replace(/[^0-9.]/g, '')) || 0;
        const image = card.querySelector('.product-image img')?.src || '';
        if (!title) return;
        // avoid duplicates
        if (card.querySelector('.heart-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'heart-btn';
        btn.dataset.title = title;
        btn.title = 'Add to Wishlist';
        btn.innerHTML = '<i class="fas fa-heart"></i>';
        const inList = wishlist.some(i => i.title === title);
        if (inList) { btn.classList.add('active'); btn.style.color = '#ef4444'; }
        btn.addEventListener('click', e => {
            e.stopPropagation();
            toggleWishlist(title, price, image);
        });
        card.querySelector('.product-image').appendChild(btn);
    });
}

// ===== MESSAGES =====
function openMessages() {
    closeSidePanels();
    document.getElementById('messages-panel').classList.add('open');
    document.getElementById('side-panel-overlay').classList.add('active');
    loadMessages();
}
function closeMessages() {
    document.getElementById('messages-panel').classList.remove('open');
    document.getElementById('side-panel-overlay').classList.remove('active');
}

function closeSidePanels() {
    document.getElementById('wishlist-panel')?.classList.remove('open');
    document.getElementById('messages-panel')?.classList.remove('open');
    document.getElementById('side-panel-overlay')?.classList.remove('active');
}

async function loadMessages() {
    const body = document.getElementById('messages-body');
    const footer = document.getElementById('messages-footer');
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const email = user.email;

    if (!email) {
        body.innerHTML = '<div class="msg-empty"><i class="fas fa-lock"></i><p>Please <a href="login.html" style="color:#f97316;font-weight:600">log in</a> to view your messages.</p></div>';
        return;
    }

    body.innerHTML = '<div style="text-align:center;padding:40px;color:#aaa"><i class="fas fa-spinner fa-spin" style="font-size:24px;color:#f97316"></i><p style="margin-top:8px">Loading...</p></div>';

    try {
        const res = await fetch(`${API_BASE}/inquiries/my/${encodeURIComponent(email)}`);
        const data = await res.json();
        const inquiries = data.inquiries || [];

        // update badge
        const unread = inquiries.filter(i => i.status === 'replied').length;
        const badge = document.getElementById('messages-sidebar-count');
        if (badge) { badge.textContent = inquiries.length; badge.style.display = inquiries.length > 0 ? 'inline' : 'none'; }

        if (!inquiries.length) {
            body.innerHTML = '<div class="msg-empty"><i class="fas fa-envelope"></i><p>No messages yet.</p><p style="font-size:12px;margin-top:6px">Send an inquiry on any product to start a conversation.</p></div>';
            if (footer) footer.style.display = 'block';
            return;
        }

        body.innerHTML = inquiries.map(inq => {
            const statusClass = inq.status === 'replied' ? 'msg-status-replied' : 'msg-status-open';
            const statusLabel = inq.status === 'replied' ? 'Replied' : 'Pending';
            const date = new Date(inq.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
            return `<div class="msg-thread">
                <div class="msg-thread-product">
                    ${inq.productName ? `<i class="fas fa-tshirt"></i> ${inq.productName}` : '<i class="fas fa-envelope"></i> General Inquiry'}
                    <span class="msg-thread-date">${date}</span>
                </div>
                <div style="clear:both;margin-bottom:8px"><span class="msg-status ${statusClass}">${statusLabel}</span></div>
                <div class="msg-bubble sent">
                    <div class="msg-bubble-label">You</div>
                    ${inq.message}
                </div>
                ${inq.adminReply ? `<div class="msg-bubble reply">
                    <div class="msg-bubble-label"><i class="fas fa-store"></i> Jobijad Express</div>
                    ${inq.adminReply}
                </div>` : ''}
            </div>`;
        }).join('');

        if (footer) footer.style.display = 'block';
    } catch(e) {
        body.innerHTML = '<div class="msg-empty"><i class="fas fa-exclamation-circle"></i><p>Could not load messages. Make sure the server is running.</p></div>';
    }
}

function showNewMessageForm() {
    const modal = createModal('Send a Message', `
        <div class="inquiry-form">
            <div class="form-group"><label>Your Name *</label><input type="text" id="nm-name" placeholder="Your name"></div>
            <div class="form-group"><label>Email *</label><input type="email" id="nm-email" placeholder="you@email.com"></div>
            <div class="form-group"><label>Subject / Product</label><input type="text" id="nm-product" placeholder="e.g. Kitenge Dress, General question..."></div>
            <div class="form-group"><label>Message *</label><textarea id="nm-msg" rows="4" placeholder="Type your message..."></textarea></div>
            <div class="form-actions">
                <button class="cancel-btn" onclick="closeModal()">Cancel</button>
                <button class="submit-inquiry-btn" onclick="sendNewMessage()">Send Message</button>
            </div>
        </div>`);
    // prefill from currentUser
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    document.body.appendChild(modal);
    if (user.name) document.getElementById('nm-name').value = user.name;
    if (user.email) document.getElementById('nm-email').value = user.email;
}

function sendNewMessage() {
    const name = document.getElementById('nm-name')?.value.trim();
    const email = document.getElementById('nm-email')?.value.trim();
    const product = document.getElementById('nm-product')?.value.trim();
    const msg = document.getElementById('nm-msg')?.value.trim();
    if (!name || !email) { showNotification('Please fill in name and email', 'warning'); return; }
    if (!msg) { showNotification('Please enter a message', 'warning'); return; }
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const payload = { name, email, productName: product || 'General Inquiry', quantity: 1, message: msg, userId: user.id || null };
    fetch(`${API_BASE}/inquiries`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(r => r.json())
        .then(() => { closeModal(); showNotification('Message sent!', 'success'); loadMessages(); })
        .catch(() => { closeModal(); showNotification('Message sent!', 'success'); });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    initSidebar();
    initCart();
    initInquiry();
    updateCartBadge();
    updateWishlistBadge();
    loadProductsFromDB().then(() => {
        initHeartButtons();
    });
    // heart buttons on static cards too
    initHeartButtons();
});

// ===== GIFTS & GIVEAWAYS =====
function openGifts() {
    document.getElementById('gift-panel').style.transform = 'translateX(0)';
    document.getElementById('gift-overlay').style.opacity = '1';
    document.getElementById('gift-overlay').style.pointerEvents = 'all';
    loadGifts();
}

function closeGifts() {
    document.getElementById('gift-panel').style.transform = 'translateX(100%)';
    document.getElementById('gift-overlay').style.opacity = '0';
    document.getElementById('gift-overlay').style.pointerEvents = 'none';
}

async function loadGifts() {
    document.getElementById('gift-loading').style.display = 'block';
    document.getElementById('gift-list').style.display = 'none';
    document.getElementById('gift-empty').style.display = 'none';
    try {
        const res = await fetch(API_BASE + '/inquiries/gifts');
        const data = await res.json();
        const gifts = data.gifts || [];
        document.getElementById('gift-loading').style.display = 'none';
        if (!gifts.length) {
            document.getElementById('gift-empty').style.display = 'block';
        } else {
            document.getElementById('gift-list').style.display = 'block';
            document.getElementById('gift-list').innerHTML = gifts.map(g => `
                <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:10px;padding:14px;margin-bottom:12px;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <i class="fas fa-gift" style="color:#f97316;font-size:18px;"></i>
                        <span style="font-weight:700;color:#1a1a2e;font-size:14px;">${g.title || 'Special Giveaway'}</span>
                    </div>
                    <p style="font-size:13px;color:#555;margin-bottom:8px;">${g.message || ''}</p>
                    ${g.adminReply ? `<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:8px 10px;font-size:12px;color:#15803d;margin-top:6px;"><i class="fas fa-reply" style="margin-right:4px"></i>${g.adminReply}</div>` : ''}
                    <div style="font-size:11px;color:#aaa;margin-top:6px;">${new Date(g.createdAt).toLocaleDateString()}</div>
                </div>`).join('');
        }
    } catch(e) {
        document.getElementById('gift-loading').style.display = 'none';
        document.getElementById('gift-empty').style.display = 'block';
    }
}

async function sendGiftMessage() {
    const msg = document.getElementById('gift-msg-input').value.trim();
    if (!msg) { showNotification('Please type a message first', 'warning'); return; }
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    try {
        await fetch(API_BASE + '/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: user.name || 'Customer',
                email: user.email || '',
                productName: 'Gift Inquiry',
                message: msg,
                userId: user.id || null
            })
        });
        document.getElementById('gift-msg-input').value = '';
        showNotification('Message sent to admin!', 'success');
    } catch(e) {
        showNotification('Could not send message', 'error');
    }
}

// ===== SCROLL REVEAL (Intersection Observer) =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.product-card').forEach(c => observer.observe(c));
}

// ===== CART BADGE ANIMATION =====
const _origUpdateBadge = typeof updateCartBadge === 'function' ? updateCartBadge : null;
if (_origUpdateBadge) {
    window.updateCartBadge = function() {
        _origUpdateBadge();
        const badge = document.getElementById('cart-badge');
        const btn = document.getElementById('cart-toggle-btn');
        if (badge) { badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop'); }
        if (btn) { btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse'); }
    };
}

// Init on page load
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    // Page fade in
    document.body.classList.add('page-fade');
});


// ===== HELP CENTER =====
function toggleHelp() {
    const dd = document.getElementById('help-dropdown');
    dd.classList.toggle('open');
    // close on outside click
    if (dd.classList.contains('open')) {
        setTimeout(() => document.addEventListener('click', closeHelpDropdown, { once: true }), 10);
    }
}
function closeHelpDropdown(e) {
    const wrap = document.getElementById('help-dropdown-wrap');
    if (wrap && !wrap.contains(e.target)) {
        document.getElementById('help-dropdown').classList.remove('open');
    }
}

const HELP_CONTENT = {
    order: {
        title: 'How to Place an Order',
        icon: 'fas fa-box-open',
        steps: [
            { icon: 'fas fa-search', text: 'Browse products or use the search bar to find what you want.' },
            { icon: 'fas fa-hand-pointer', text: 'Tap a product to see details, choose your size, then tap <strong>Add to Cart</strong>.' },
            { icon: 'fas fa-shopping-cart', text: 'Open your cart (top right), review your items, then tap <strong>Proceed to Checkout</strong>.' },
            { icon: 'fas fa-map-marker-alt', text: 'Fill in your delivery address and choose a payment method.' },
            { icon: 'fas fa-check-circle', text: 'Tap <strong>Place Order</strong> — you\'ll get an order number to track your delivery.' }
        ]
    },
    payment: {
        title: 'Payment Options',
        icon: 'fas fa-credit-card',
        steps: [
            { icon: 'fas fa-mobile-alt', text: '<strong>Mobile Money (MTN / Airtel)</strong> — Enter your number and we\'ll confirm payment manually.' },
            { icon: 'fab fa-paypal', text: '<strong>PayPal</strong> — Pay securely using your PayPal card details.' },
            { icon: 'fas fa-credit-card', text: '<strong>Credit / Debit Card</strong> — Visa, Mastercard accepted.' },
            { icon: 'fas fa-university', text: '<strong>Bank Transfer</strong> — Transfer to our Stanbic Bank account and send proof.' },
            { icon: 'fas fa-shield-alt', text: 'All payments are reviewed by our team before your order is confirmed.' }
        ]
    },
    delivery: {
        title: 'Delivery & Tracking',
        icon: 'fas fa-truck',
        steps: [
            { icon: 'fas fa-clock', text: '<strong>East Africa:</strong> 3–6 business days after payment confirmation.' },
            { icon: 'fas fa-globe-africa', text: '<strong>Rest of Africa:</strong> 5–9 business days.' },
            { icon: 'fas fa-plane', text: '<strong>Europe / USA:</strong> 8–16 business days.' },
            { icon: 'fas fa-box', text: 'Once shipped, you\'ll receive a tracking number via email or WhatsApp.' },
            { icon: 'fas fa-receipt', text: 'Check your order status anytime in <strong>My Orders</strong>.' }
        ]
    },
    returns: {
        title: 'Returns & Refunds',
        icon: 'fas fa-undo',
        steps: [
            { icon: 'fas fa-calendar-check', text: 'Returns accepted within <strong>14 days</strong> of delivery.' },
            { icon: 'fas fa-box-open', text: 'Item must be in original condition — unworn, unwashed, with tags.' },
            { icon: 'fas fa-whatsapp', text: 'Contact us on WhatsApp (+46 762 593 231) with your order number to start a return.' },
            { icon: 'fas fa-money-bill-wave', text: 'Refunds are processed within 5–7 business days after we receive the item.' },
            { icon: 'fas fa-exclamation-circle', text: 'Defective or wrong items? We cover return shipping — contact us immediately.' }
        ]
    },
    sizes: {
        title: 'Size Guide',
        icon: 'fas fa-ruler',
        steps: [
            { icon: 'fas fa-tshirt', text: '<strong>XS</strong> — Chest: 32–34", Waist: 24–26"' },
            { icon: 'fas fa-tshirt', text: '<strong>S</strong> — Chest: 34–36", Waist: 26–28"' },
            { icon: 'fas fa-tshirt', text: '<strong>M</strong> — Chest: 36–38", Waist: 28–30"' },
            { icon: 'fas fa-tshirt', text: '<strong>L</strong> — Chest: 38–40", Waist: 30–32"' },
            { icon: 'fas fa-tshirt', text: '<strong>XL</strong> — Chest: 40–42", Waist: 32–34"' },
            { icon: 'fas fa-info-circle', text: 'Not sure? Message us on WhatsApp with your measurements and we\'ll help you pick the right size.' }
        ]
    },
    account: {
        title: 'Account & Login',
        icon: 'fas fa-user-circle',
        steps: [
            { icon: 'fas fa-user-plus', text: 'Tap <strong>Sign In</strong> in the top right to create an account or log in.' },
            { icon: 'fas fa-lock', text: 'Use a strong password (at least 6 characters). Never share it with anyone.' },
            { icon: 'fas fa-key', text: 'Forgot your password? Use the <strong>Forgot Password</strong> link on the login page.' },
            { icon: 'fas fa-user-edit', text: 'Update your name, email, or profile photo from the Account panel.' },
            { icon: 'fas fa-sign-out-alt', text: 'Always <strong>Sign Out</strong> when using a shared or public device.' }
        ]
    }
};

function openHelp(topic) {
    document.getElementById('help-dropdown').classList.remove('open');
    const content = HELP_CONTENT[topic];
    if (!content) return;
    const stepsHtml = content.steps.map(s =>
        '<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #f8f8f8;align-items:flex-start;">' +
        '<div style="width:32px;height:32px;background:#fff7ed;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="' + s.icon + '" style="color:#f97316;font-size:14px;"></i></div>' +
        '<div style="font-size:14px;color:#444;line-height:1.6;padding-top:5px;">' + s.text + '</div>' +
        '</div>'
    ).join('');
    document.getElementById('help-modal-body').innerHTML =
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">' +
        '<div style="width:40px;height:40px;background:#fff7ed;border-radius:10px;display:flex;align-items:center;justify-content:center;"><i class="' + content.icon + '" style="color:#f97316;font-size:18px;"></i></div>' +
        '<h3 style="font-size:17px;font-weight:700;color:#1a1a2e;margin:0;">' + content.title + '</h3>' +
        '</div>' + stepsHtml;
    document.getElementById('help-modal').style.display = 'flex';
}
function closeHelpModal() {
    document.getElementById('help-modal').style.display = 'none';
}
document.addEventListener('click', function(e) {
    const modal = document.getElementById('help-modal');
    if (modal && e.target === modal) closeHelpModal();
});

// ===== PRODUCT DETAIL MODAL =====
let _selectedSize = null;
let _currentDetailProduct = null;

function openProductDetail(p) {
    _currentDetailProduct = p;
    _selectedSize = null;
    addToRecentlyViewed(p);

    const avg = p.ratingAverage || 0;
    const count = p.ratingCount || 0;
    const stars = [1,2,3,4,5].map(i =>
        '<span class="' + (i <= Math.round(avg) ? 'star' : 'star-e') + '">&#9733;</span>'
    ).join('');

    const sizes = (p.sizes || []);
    const sizesHtml = sizes.length ? sizes.map(s =>
        '<button class="pd-size-btn' + (s.stock === 0 ? ' out-of-stock' : '') + '" ' +
        (s.stock === 0 ? 'disabled title="Out of stock"' : 'onclick="selectSize(this,\'' + s.size + '\')"') +
        '>' + s.size + (s.stock === 0 ? ' (sold out)' : '') + '</button>'
    ).join('') : '<span style="font-size:13px;color:#888;">One Size</span>';

    const img = (p.images && p.images[0] && p.images[0].url) ? p.images[0].url : 'https://via.placeholder.com/400';
    const inWishlist = wishlist.some(w => w.title === p.name);

    document.getElementById('product-detail-body').innerHTML =
        '<img class="pd-img" src="' + img + '" alt="' + p.name + '">' +
        '<div class="pd-body">' +
            '<div class="pd-title">' + p.name + '</div>' +
            '<div class="pd-price">$' + p.price.toFixed(2) + '</div>' +
            '<div class="pd-stars">' + stars +
                '<span class="pd-rating-text">' + (count > 0 ? avg.toFixed(1) + ' (' + count + ' review' + (count !== 1 ? 's' : '') + ')' : 'No reviews yet') + '</span>' +
            '</div>' +
            '<div class="pd-desc">' + (p.description || '') + '</div>' +
            (sizes.length ? '<div class="pd-section-label">Select Size</div><div class="pd-sizes" id="pd-sizes-row">' + sizesHtml + '</div>' : '') +
            '<div class="pd-actions">' +
                '<button class="pd-add-btn" onclick="addToCartFromDetail()"><i class="fas fa-cart-plus"></i> Add to Cart</button>' +
                '<button class="pd-wish-btn' + (inWishlist ? ' active' : '') + '" id="pd-wish-btn" onclick="toggleWishlistFromDetail()" title="Wishlist"><i class="fas fa-heart"></i></button>' +
            '</div>' +
            '<div class="pd-delivery-info"><i class="fas fa-truck"></i> Free shipping on orders over $75 · Worldwide delivery</div>' +
            (count > 0 ? '<div class="pd-reviews"><div class="pd-section-label" style="margin-bottom:12px;">Customer Reviews</div><div id="pd-reviews-list"><div style="text-align:center;padding:20px;color:#aaa;"><i class="fas fa-spinner fa-spin"></i></div></div></div>' : '') +
        '</div>';

    document.getElementById('product-detail-modal').style.display = 'flex';
    if (count > 0) loadProductReviews(p.name);
}

function selectSize(btn, size) {
    document.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    _selectedSize = size;
}

function addToCartFromDetail() {
    if (!_currentDetailProduct) return;
    const p = _currentDetailProduct;
    const sizes = p.sizes || [];
    if (sizes.length > 0 && !_selectedSize) {
        showNotification('Please select a size first', 'warning');
        document.getElementById('pd-sizes-row')?.classList.add('shake');
        setTimeout(() => document.getElementById('pd-sizes-row')?.classList.remove('shake'), 500);
        return;
    }
    const existing = cart.find(i => i.title === p.name && i.size === _selectedSize);
    if (existing) existing.qty += 1;
    else cart.push({ title: p.name, price: p.price, image: (p.images&&p.images[0]&&p.images[0].url)||'', qty: 1, productId: p.id, size: _selectedSize });
    saveCart(); renderCart(); updateCartBadge();
    showNotification('Added to cart' + (_selectedSize ? ' — Size ' + _selectedSize : ''), 'success');
    closeProductDetail();
    openCart();
}

function toggleWishlistFromDetail() {
    if (!_currentDetailProduct) return;
    const p = _currentDetailProduct;
    const img = (p.images&&p.images[0]&&p.images[0].url)||'';
    toggleWishlist(p.name, p.price, img);
    const btn = document.getElementById('pd-wish-btn');
    if (btn) btn.classList.toggle('active', wishlist.some(w => w.title === p.name));
}

function closeProductDetail() {
    document.getElementById('product-detail-modal').style.display = 'none';
    _currentDetailProduct = null;
    _selectedSize = null;
}
document.addEventListener('click', function(e) {
    const modal = document.getElementById('product-detail-modal');
    if (modal && e.target === modal) closeProductDetail();
});

async function loadProductReviews(productName) {
    const el = document.getElementById('pd-reviews-list');
    if (!el) return;
    try {
        const data = await apiCall('/feedback');
        const reviews = (data.feedbacks || []).slice(0, 5);
        if (!reviews.length) { el.innerHTML = '<p style="font-size:13px;color:#aaa;">No reviews yet.</p>'; return; }
        el.innerHTML = reviews.map(r => {
            const stars = [1,2,3,4,5].map(i => '<span style="color:' + (i <= (r.rating||5) ? '#f97316' : '#e0e0e0') + ';font-size:13px;">&#9733;</span>').join('');
            return '<div class="pd-review-item">' +
                '<div class="pd-review-name"><i class="fas fa-user-circle" style="color:#f97316;margin-right:5px;"></i>' + (r.customerName||r.name||'Customer') + ' ' + stars + '</div>' +
                '<div class="pd-review-text">' + (r.comment||r.message||'') + '</div>' +
                '</div>';
        }).join('');
    } catch(e) { if (el) el.innerHTML = ''; }
}

// ===== WIRE UP PRODUCT CARD CLICK → DETAIL MODAL =====
// Override _renderProductCards to attach click handler
const _origRenderCards = typeof _renderProductCards === 'function' ? _renderProductCards : null;
if (_origRenderCards) {
    window._renderProductCards = function(products) {
        _origRenderCards(products);
        attachProductCardClicks(products);
    };
}
function attachProductCardClicks(products) {
    document.querySelectorAll('.product-card').forEach((card, idx) => {
        // Add star rating to card
        const p = products[idx];
        if (p) {
            const avg = p.ratingAverage || 0;
            const count = p.ratingCount || 0;
            const starsHtml = [1,2,3,4,5].map(i =>
                '<i class="fas fa-star ' + (i <= Math.round(avg) ? 'star-filled' : 'star-empty') + '"></i>'
            ).join('');
            const ratingDiv = document.createElement('div');
            ratingDiv.className = 'product-stars';
            ratingDiv.innerHTML = starsHtml + '<span class="rating-count">(' + (count || 0) + ')</span>';
            const meta = card.querySelector('.product-meta');
            if (meta) meta.parentNode.insertBefore(ratingDiv, meta);
        }
        // Click opens detail modal (but not on action buttons)
        card.addEventListener('click', function(e) {
            if (e.target.closest('.add-to-cart-btn') || e.target.closest('.inquiry-btn') || e.target.closest('.heart-btn')) return;
            if (p) openProductDetail(p);
        });
    });
}

// ===== RECENTLY VIEWED =====
let recentlyViewed = JSON.parse(localStorage.getItem('jobiRecent') || '[]');

function addToRecentlyViewed(p) {
    recentlyViewed = recentlyViewed.filter(r => r.id !== p.id);
    recentlyViewed.unshift({ id: p.id, name: p.name, price: p.price, image: (p.images&&p.images[0]&&p.images[0].url)||'' });
    if (recentlyViewed.length > 8) recentlyViewed.pop();
    localStorage.setItem('jobiRecent', JSON.stringify(recentlyViewed));
    renderRecentlyViewed();
}

function renderRecentlyViewed() {
    const section = document.getElementById('recently-viewed-section');
    const list = document.getElementById('recently-viewed-list');
    if (!section || !list || recentlyViewed.length < 2) { if (section) section.style.display = 'none'; return; }
    section.style.display = 'block';
    list.innerHTML = recentlyViewed.map(r =>
        '<div class="rv-item" onclick="openRecentProduct(\'' + r.id + '\')">' +
        '<img src="' + r.image + '" alt="' + r.name + '" loading="lazy">' +
        '<div class="rv-item-title">' + r.name + '</div>' +
        '<div class="rv-item-price">$' + r.price.toFixed(2) + '</div>' +
        '</div>'
    ).join('');
}

function openRecentProduct(id) {
    const p = (window._allProducts || []).find(x => x.id === id);
    if (p) openProductDetail(p);
}

// ===== FREE SHIPPING PROGRESS BAR =====
const FREE_SHIPPING_THRESHOLD = 75;
const PROMO_CODES = { 'JOBIJAD10': 10, 'WELCOME5': 5, 'AFRICA15': 15 };
let appliedDiscount = 0;

function updateFreeShippingBar() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const bar = document.getElementById('free-shipping-bar');
    const progress = document.getElementById('free-shipping-progress');
    const text = document.getElementById('free-shipping-text');
    if (!bar) return;
    const pct = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
    if (progress) progress.style.width = pct + '%';
    if (total >= FREE_SHIPPING_THRESHOLD) {
        if (text) text.innerHTML = '<strong style="color:#15803d;"><i class="fas fa-check-circle"></i> You\'ve unlocked FREE shipping!</strong>';
        if (progress) progress.style.background = '#22c55e';
    } else {
        const remaining = FREE_SHIPPING_THRESHOLD - total;
        const remainingDisplay = (typeof convertPrice === 'function') ? convertPrice(remaining) : '$' + remaining.toFixed(2);
        if (text) text.innerHTML = 'Add <strong>' + remainingDisplay + '</strong> more for <strong>FREE shipping!</strong>';
        if (progress) progress.style.background = '#f97316';
    }
}
        if (text) text.innerHTML = 'Add <strong>$' + remaining + '</strong> more for <strong>FREE shipping!</strong>';
        if (progress) progress.style.background = '#f97316';
    }
}

// ===== PROMO CODE =====
// Promo codes are NEVER shown to users — only awarded after qualifying purchases
// Admin sets codes via the Promo Codes tab in admin panel
function getPromoCodes() {
    try {
        var adminCodes = JSON.parse(localStorage.getItem('jobiPromoCodes') || 'null');
        if (adminCodes && typeof adminCodes === 'object') return adminCodes;
    } catch(e) {}
    // Default codes — NOT shown to users, only used for validation
    return { 'JOBIJAD10': 10, 'WELCOME5': 5, 'AFRICA15': 15, 'SWEDEN20': 20 };
}

function applyPromo() {
    const code = (document.getElementById('promo-input')?.value || '').trim().toUpperCase();
    const msg = document.getElementById('promo-msg');
    if (!code) { showPromoMsg('Please enter your promo code', false); return; }
    const codes = getPromoCodes();
    const discount = codes[code];
    if (discount) {
        appliedDiscount = discount;
        showPromoMsg('✓ Promo code applied! ' + discount + '% off your order.', true);
        renderCart();
        // Mark code as used
        const usedCodes = JSON.parse(localStorage.getItem('jobiUsedCodes') || '[]');
        if (!usedCodes.includes(code)) {
            usedCodes.push(code);
            localStorage.setItem('jobiUsedCodes', JSON.stringify(usedCodes));
        }
    } else {
        appliedDiscount = 0;
        showPromoMsg('Invalid promo code. Codes are awarded after qualifying purchases.', false);
    }
}
function showPromoMsg(text, success) {
    const el = document.getElementById('promo-msg');
    if (!el) return;
    el.textContent = text;
    el.style.cssText = 'display:block;font-size:12px;margin-bottom:8px;padding:6px 10px;border-radius:5px;background:' + (success ? '#dcfce7;color:#15803d;' : '#fee2e2;color:#991b1b;');
}

// ===== SECURITY: SESSION TIMEOUT WARNING =====
let _sessionWarningTimer, _sessionLogoutTimer;
const SESSION_WARN_MS = 25 * 60 * 1000;  // warn at 25 min
const SESSION_LOGOUT_MS = 30 * 60 * 1000; // logout at 30 min

function resetSessionTimers() {
    clearTimeout(_sessionWarningTimer);
    clearTimeout(_sessionLogoutTimer);
    if (!getToken()) return;
    _sessionWarningTimer = setTimeout(() => {
        showNotification('Your session will expire in 5 minutes. Click anywhere to stay logged in.', 'warning');
    }, SESSION_WARN_MS);
    _sessionLogoutTimer = setTimeout(() => {
        showNotification('Session expired. Please log in again.', 'error');
        setTimeout(() => { localStorage.removeItem('jobiToken'); localStorage.removeItem('currentUser'); location.reload(); }, 2000);
    }, SESSION_LOGOUT_MS);
}
['click','keypress','touchstart','scroll'].forEach(ev => document.addEventListener(ev, resetSessionTimers, { passive: true }));
resetSessionTimers();

// ===== SECURITY: HTTPS ENFORCEMENT =====
if (location.protocol === 'http:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    location.replace('https:' + location.href.substring(5));
}

// ===== PATCH renderCart TO INCLUDE FREE SHIPPING + DISCOUNT =====
const _origRenderCart = typeof renderCart === 'function' ? renderCart : null;
if (_origRenderCart) {
    window.renderCart = function() {
        _origRenderCart();
        updateFreeShippingBar();
        // Apply discount to displayed total
        if (appliedDiscount > 0) {
            const totalEl = document.getElementById('cart-total');
            if (totalEl) {
                const raw = cart.reduce((s, i) => s + i.price * i.qty, 0);
                const discounted = raw * (1 - appliedDiscount / 100);
                totalEl.textContent = '$' + discounted.toFixed(2);
                totalEl.title = 'After ' + appliedDiscount + '% discount';
            }
        }
    };
}

// Init recently viewed on load
document.addEventListener('DOMContentLoaded', () => {
    renderRecentlyViewed();
    updateFreeShippingBar();
});


