
// ===== CURRENCY SYSTEM =====
const CURRENCY_RATES = {
    USD: 1, UGX: 3700, KES: 130, TZS: 2600, NGN: 1600,
    GHS: 15, ZAR: 18.5, EUR: 0.92, GBP: 0.79, SEK: 10.4, AED: 3.67, CNY: 7.25
};
const CURRENCY_SYMBOLS = {
    USD:'$', UGX:'USh', KES:'KSh', TZS:'TSh', NGN:'₦',
    GHS:'GH₵', ZAR:'R', EUR:'€', GBP:'£', SEK:'kr', AED:'AED', CNY:'¥'
};
let activeCurrency = localStorage.getItem('jobiCurrency') || 'USD';
let activeLang = localStorage.getItem('jobiLang') || 'en';

function convertPrice(usdPrice) {
    const rate = CURRENCY_RATES[activeCurrency] || 1;
    const converted = usdPrice * rate;
    const sym = CURRENCY_SYMBOLS[activeCurrency] || '$';
    if (activeCurrency === 'UGX' || activeCurrency === 'TZS' || activeCurrency === 'NGN') {
        return sym + ' ' + Math.round(converted).toLocaleString();
    }
    return sym + converted.toFixed(2);
}

function openLangCurrency() {
    const modal = document.getElementById('lang-currency-modal');
    if (!modal) return;
    const ls = document.getElementById('lang-select');
    const cs = document.getElementById('currency-select');
    if (ls) ls.value = activeLang;
    if (cs) cs.value = activeCurrency;
    modal.style.display = 'flex';
}
function closeLangCurrency() {
    const modal = document.getElementById('lang-currency-modal');
    if (modal) modal.style.display = 'none';
}
function saveLangCurrency() {
    const lang = document.getElementById('lang-select')?.value || 'en';
    const currency = document.getElementById('currency-select')?.value || 'USD';
    activeLang = lang;
    activeCurrency = currency;
    localStorage.setItem('jobiLang', lang);
    localStorage.setItem('jobiCurrency', currency);
    const display = document.getElementById('currency-display');
    if (display) display.textContent = currency;
    closeLangCurrency();
    // Re-render products with new currency
    if (window._allProducts) _renderProductCards(window._allProducts);
    showNotification('Currency set to ' + currency, 'success');
}
// Init currency display
document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('currency-display');
    if (display) display.textContent = activeCurrency;
    const cs = document.getElementById('currency-select');
    if (cs) cs.value = activeCurrency;
});

// ===== RFQ =====
function openRFQ() {
    const modal = document.getElementById('rfq-modal');
    if (!modal) return;
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const nameEl = document.getElementById('rfq-name');
    const emailEl = document.getElementById('rfq-email');
    if (nameEl && user.name) nameEl.value = user.name;
    if (emailEl && user.email) emailEl.value = user.email;
    modal.style.display = 'flex';
}
function closeRFQ() {
    const modal = document.getElementById('rfq-modal');
    if (modal) modal.style.display = 'none';
}
async function submitRFQ() {
    const product = document.getElementById('rfq-product')?.value.trim();
    const qty = document.getElementById('rfq-qty')?.value.trim();
    const name = document.getElementById('rfq-name')?.value.trim();
    const email = document.getElementById('rfq-email')?.value.trim();
    const details = document.getElementById('rfq-details')?.value.trim();
    const msg = document.getElementById('rfq-msg');
    if (!product || !qty || !name || !email) {
        if (msg) { msg.textContent = 'Please fill in all required fields.'; msg.style.cssText = 'display:block;padding:10px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#fee2e2;color:#991b1b;'; }
        return;
    }
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    try {
        await fetch(API_BASE + '/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, productName: product, quantity: parseInt(qty)||1, message: 'RFQ: ' + product + ' x' + qty + (details ? '. Details: ' + details : ''), userId: user.id || null })
        });
        if (msg) { msg.textContent = 'RFQ submitted! We\'ll get back to you shortly.'; msg.style.cssText = 'display:block;padding:10px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#dcfce7;color:#15803d;'; }
        setTimeout(closeRFQ, 2000);
    } catch(e) {
        if (msg) { msg.textContent = 'Failed to submit. Please try again.'; msg.style.cssText = 'display:block;padding:10px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#fee2e2;color:#991b1b;'; }
    }
}

// ===== LOCATION MODAL =====
const COUNTRY_CODES = { UG:'+256', KE:'+254', TZ:'+255', RW:'+250', NG:'+234', GH:'+233', ZA:'+27', SE:'+46', GB:'+44', US:'+1', AE:'+971', CN:'+86' };
function openLocationModal() {
    const modal = document.getElementById('location-modal');
    if (!modal) return;
    const saved = JSON.parse(localStorage.getItem('jobiLocation') || '{}');
    const locCountry = document.getElementById('loc-country');
    const locZip = document.getElementById('loc-zip');
    if (locCountry && saved.country) locCountry.value = saved.country;
    if (locZip && saved.zip) locZip.value = saved.zip;
    const token = localStorage.getItem('jobiToken');
    const signinBtn = document.getElementById('location-signin-btn');
    if (signinBtn) signinBtn.style.display = token ? 'none' : 'block';
    modal.style.display = 'flex';
}
function closeLocationModal() {
    const modal = document.getElementById('location-modal');
    if (modal) modal.style.display = 'none';
}
function updateLocationCountry(code) {
    // Auto-set currency based on country
    const countryCurrency = { UG:'UGX', KE:'KES', TZ:'TZS', RW:'USD', NG:'NGN', GH:'GHS', ZA:'ZAR', SE:'SEK', GB:'GBP', US:'USD', AE:'AED', CN:'CNY' };
    if (countryCurrency[code]) {
        activeCurrency = countryCurrency[code];
        localStorage.setItem('jobiCurrency', activeCurrency);
        const display = document.getElementById('currency-display');
        if (display) display.textContent = activeCurrency;
    }
}
function saveLocation() {
    const country = document.getElementById('loc-country')?.value;
    const zip = document.getElementById('loc-zip')?.value.trim();
    if (!country) { showNotification('Please select a country', 'warning'); return; }
    localStorage.setItem('jobiLocation', JSON.stringify({ country, zip }));
    updateLocationCountry(country);
    closeLocationModal();
    showNotification('Location saved!', 'success');
    if (window._allProducts) _renderProductCards(window._allProducts);
}

// ===== SIDEBAR AUTH STATE UPDATE =====
const _origCheckAuth = typeof checkAuthState === 'function' ? checkAuthState : null;
if (_origCheckAuth) {
    window.checkAuthState = function() {
        _origCheckAuth();
        const token = localStorage.getItem('jobiToken');
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const loggedOut = document.getElementById('sidebar-logged-out');
        const loggedIn = document.getElementById('sidebar-logged-in');
        const userName = document.getElementById('sidebar-user-name');
        if (token && user.name) {
            if (loggedOut) loggedOut.style.display = 'none';
            if (loggedIn) loggedIn.style.display = 'block';
            if (userName) userName.textContent = user.name;
        } else {
            if (loggedOut) loggedOut.style.display = 'block';
            if (loggedIn) loggedIn.style.display = 'none';
        }
    };
}

// ===== UPDATED openProductDetail WITH MULTI-IMAGE + ZOOM =====
const _origOpenDetail = typeof openProductDetail === 'function' ? openProductDetail : null;
window.openProductDetail = function(p) {
    _currentDetailProduct = p;
    _selectedSize = null;
    addToRecentlyViewed(p);

    const images = (p.images && p.images.length > 0) ? p.images : [{ url: 'https://via.placeholder.com/400', alt: p.name }];
    const avg = p.ratingAverage || 0;
    const count = p.ratingCount || 0;
    const stars = [1,2,3,4,5].map(i => '<span style="color:' + (i <= Math.round(avg) ? '#f97316' : '#e0e0e0') + ';font-size:18px;">&#9733;</span>').join('');
    const sizes = p.sizes || [];
    const sizesHtml = sizes.length ? sizes.map(s =>
        '<button class="pd-size-btn' + (s.stock === 0 ? ' out-of-stock' : '') + '" ' +
        (s.stock === 0 ? 'disabled' : 'onclick="selectSize(this,\'' + s.size + '\')"') +
        '>' + s.size + (s.stock === 0 ? ' ✗' : '') + '</button>'
    ).join('') : '<span style="font-size:13px;color:#888;">One Size</span>';
    const inWishlist = wishlist.some(w => w.title === p.name);
    const price = convertPrice(p.price);

    // Thumbnail strip
    const thumbs = images.map((img, i) =>
        '<div class="pd-thumb' + (i === 0 ? ' active' : '') + '" onclick="switchDetailImage(' + i + ',this)" style="width:60px;height:60px;border-radius:6px;overflow:hidden;border:2px solid ' + (i === 0 ? '#f97316' : '#e0e0e0') + ';cursor:pointer;flex-shrink:0;">' +
        '<img src="' + img.url + '" style="width:100%;height:100%;object-fit:cover;"></div>'
    ).join('');

    document.getElementById('product-detail-body').innerHTML =
        '<div style="display:flex;flex-wrap:wrap;">' +
        // Left: image gallery
        '<div style="flex:1;min-width:280px;padding:20px;display:flex;gap:12px;">' +
        '<div style="display:flex;flex-direction:column;gap:8px;overflow-y:auto;max-height:400px;">' + thumbs + '</div>' +
        '<div style="flex:1;position:relative;overflow:hidden;border-radius:10px;background:#f8f9fa;cursor:crosshair;" id="pd-main-img-wrap" onmousemove="zoomImage(event,this)" onmouseleave="resetZoom(this)">' +
        '<img id="pd-main-img" src="' + images[0].url + '" alt="' + p.name + '" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;display:block;transition:transform .1s ease;transform-origin:center center;">' +
        '</div></div>' +
        // Right: details
        '<div class="pd-body" style="flex:1;min-width:260px;">' +
        '<div class="pd-title">' + p.name + '</div>' +
        '<div class="pd-price">' + price + '</div>' +
        '<div class="pd-stars">' + stars + '<span class="pd-rating-text">' + (count > 0 ? avg.toFixed(1) + ' (' + count + ' reviews)' : 'No reviews yet') + '</span></div>' +
        '<div class="pd-desc">' + (p.description || '') + '</div>' +
        (sizes.length ? '<div class="pd-section-label">Select Size</div><div class="pd-sizes" id="pd-sizes-row">' + sizesHtml + '</div>' : '') +
        '<div class="pd-actions">' +
        '<button class="pd-add-btn" onclick="addToCartFromDetail()"><i class="fas fa-cart-plus"></i> Add to Cart</button>' +
        '<button class="pd-wish-btn' + (inWishlist ? ' active' : '') + '" id="pd-wish-btn" onclick="toggleWishlistFromDetail()"><i class="fas fa-heart"></i></button>' +
        '</div>' +
        '<div class="pd-delivery-info"><i class="fas fa-truck"></i> Free shipping on orders over $75 · Worldwide delivery</div>' +
        (count > 0 ? '<div class="pd-reviews"><div class="pd-section-label" style="margin-bottom:12px;">Customer Reviews</div><div id="pd-reviews-list"><div style="text-align:center;padding:20px;color:#aaa;"><i class="fas fa-spinner fa-spin"></i></div></div></div>' : '') +
        '</div></div>';

    document.getElementById('product-detail-modal').style.display = 'flex';
    if (count > 0) loadProductReviews(p.name);
};

window._detailImages = [];
window.switchDetailImage = function(idx, thumbEl) {
    const p = _currentDetailProduct;
    if (!p) return;
    const images = (p.images && p.images.length > 0) ? p.images : [];
    const mainImg = document.getElementById('pd-main-img');
    if (mainImg && images[idx]) mainImg.src = images[idx].url;
    document.querySelectorAll('.pd-thumb').forEach((t, i) => {
        t.style.borderColor = i === idx ? '#f97316' : '#e0e0e0';
    });
};

window.zoomImage = function(e, wrap) {
    const img = wrap.querySelector('img');
    if (!img) return;
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = x + '% ' + y + '%';
    img.style.transform = 'scale(2.2)';
};
window.resetZoom = function(wrap) {
    const img = wrap.querySelector('img');
    if (img) { img.style.transform = 'scale(1)'; img.style.transformOrigin = 'center center'; }
};

// ===== CHECKOUT: COUNTRY SELECTOR WITH PHONE CODE =====
// This patches the checkout page if it's loaded
document.addEventListener('DOMContentLoaded', function() {
    // Update sidebar auth state
    const token = localStorage.getItem('jobiToken');
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const loggedOut = document.getElementById('sidebar-logged-out');
    const loggedIn = document.getElementById('sidebar-logged-in');
    const userName = document.getElementById('sidebar-user-name');
    if (token && user.name) {
        if (loggedOut) loggedOut.style.display = 'none';
        if (loggedIn) loggedIn.style.display = 'block';
        if (userName) userName.textContent = user.name;
    }
    // Init currency display
    const display = document.getElementById('currency-display');
    if (display) display.textContent = activeCurrency;
});
