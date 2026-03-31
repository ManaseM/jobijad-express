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
        const res = await fetch('http://localhost:3000/api/users/profile', {
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
        return `<div class="cart-item">
            <img class="cart-item-img" src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${i})"><i class="fas fa-trash"></i></button>
        </div>`;
    }).join('');
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function updateCartBadge() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = total;
}

function checkout() {
    if (cart.length === 0) return;
    saveCart();
    window.location.href = 'checkout.html';
}

// ===== SEARCH =====
function doHeaderSearch() {
    const q = document.getElementById('header-search')?.value.trim();
    if (!q) return;
    filterProducts(q);
}

let attachedImageKeywords = '';

function handleAttachment(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showNotification('Please attach an image file', 'warning'); return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        // Show preview chip
        document.getElementById('attach-thumb').src = e.target.result;
        document.getElementById('attach-name').textContent = file.name.length > 14 ? file.name.substring(0,12) + '…' : file.name;
        document.getElementById('attach-preview').style.display = 'flex';
        // Extract keywords from filename (e.g. "kitenge_dress.jpg" → "kitenge dress")
        attachedImageKeywords = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
        // Pre-fill search box if empty
        const searchInput = document.getElementById('bottom-search-input');
        if (searchInput && !searchInput.value.trim() && attachedImageKeywords) {
            searchInput.value = attachedImageKeywords;
        }
        showNotification('Image attached — tap Search to find similar products', 'info');
    };
    reader.readAsDataURL(file);
    input.value = ''; // reset so same file can be re-attached
}

function clearAttachment() {
    attachedImageKeywords = '';
    document.getElementById('attach-preview').style.display = 'none';
    document.getElementById('attach-thumb').src = '';
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
        if (data.products && data.products.length > 0) renderDBProducts(data.products);
    } catch (e) { /* keep static products */ }
}
function renderDBProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card" data-product-id="${p.id}">
            <div class="product-image">
                <img src="${p.images[0]?.url || 'https://via.placeholder.com/400'}" alt="${p.name}">
                <div class="product-overlay"><button class="overlay-btn"><i class="fas fa-search-plus"></i></button></div>
                ${p.featured ? '<span class="product-badge">⭐</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <div class="product-price">$${p.price.toFixed(2)}</div>
                <div class="product-meta">Stock: ${p.sizes.reduce((t,s)=>t+s.stock,0)} pcs</div>
                <span class="supplier-badge">${p.category}</span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart-btn"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button class="inquiry-btn"><i class="fas fa-envelope"></i> Send Inquiry</button>
            </div>
        </div>`).join('');
    initCart();
    initInquiry();
    initHeartButtons();
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
                <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
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
