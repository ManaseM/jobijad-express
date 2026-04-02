// ===== CURRENCY & LANGUAGE SYSTEM =====
const CURRENCY_RATES = {
    USD:1, UGX:3700, KES:130, TZS:2600, NGN:1600,
    GHS:15, ZAR:18.5, EUR:0.92, GBP:0.79, SEK:10.4, AED:3.67, CNY:7.25
};
const CURRENCY_SYMBOLS = {
    USD:'$', UGX:'USh ', KES:'KSh ', TZS:'TSh ', NGN:'₦',
    GHS:'GH₵', ZAR:'R', EUR:'€', GBP:'£', SEK:'kr ', AED:'AED ', CNY:'¥'
};
const TRANSLATIONS = {
    en:{ search:'Search products, brands, categories...', signIn:'Sign In', cart:'My Cart',
         checkout:'Proceed to Checkout', addToCart:'Add to Cart', featured:'Featured Products',
         welcome:'Welcome to Jobijad Express!', inquire:'Inquire', addFav:'Add to Favourites',
         freeShip:'Free Shipping', orders:'My Orders', account:'My Account', help:'Help',
         placeOrder:'Place Order', shippingAddr:'Shipping Address', payMethod:'Payment Method',
         orderSummary:'Order Summary', selectSize:'Select Size', noReviews:'No reviews yet',
         outOfStock:'Out of stock', soldOut:'sold out', oneSize:'One Size',
         deliveryInfo:'Free shipping on orders over $75 · Worldwide delivery' },
    fr:{ search:'Rechercher des produits...', signIn:'Se connecter', cart:'Mon Panier',
         checkout:'Passer à la caisse', addToCart:'Ajouter au panier', featured:'Produits en vedette',
         welcome:'Bienvenue sur Jobijad Express!', inquire:'Demander', addFav:'Ajouter aux favoris',
         freeShip:'Livraison gratuite', orders:'Mes commandes', account:'Mon compte', help:'Aide',
         placeOrder:'Passer la commande', shippingAddr:'Adresse de livraison', payMethod:'Mode de paiement',
         orderSummary:'Récapitulatif', selectSize:'Choisir la taille', noReviews:'Aucun avis',
         outOfStock:'Rupture de stock', soldOut:'épuisé', oneSize:'Taille unique',
         deliveryInfo:'Livraison gratuite dès 75$ · Livraison mondiale' },
    sw:{ search:'Tafuta bidhaa...', signIn:'Ingia', cart:'Kikapu Changu',
         checkout:'Endelea Kulipa', addToCart:'Ongeza kwenye Kikapu', featured:'Bidhaa Maarufu',
         welcome:'Karibu Jobijad Express!', inquire:'Uliza', addFav:'Ongeza kwenye Vipendwa',
         freeShip:'Usafirishaji Bure', orders:'Maagizo Yangu', account:'Akaunti Yangu', help:'Msaada',
         placeOrder:'Weka Agizo', shippingAddr:'Anwani ya Usafirishaji', payMethod:'Njia ya Malipo',
         orderSummary:'Muhtasari wa Agizo', selectSize:'Chagua Ukubwa', noReviews:'Hakuna maoni',
         outOfStock:'Haipatikani', soldOut:'imeisha', oneSize:'Ukubwa Mmoja',
         deliveryInfo:'Usafirishaji bure zaidi ya $75 · Usafirishaji duniani kote' },
    ar:{ search:'ابحث عن المنتجات...', signIn:'تسجيل الدخول', cart:'سلة التسوق',
         checkout:'المتابعة للدفع', addToCart:'أضف إلى السلة', featured:'المنتجات المميزة',
         welcome:'مرحباً بك في Jobijad Express!', inquire:'استفسار', addFav:'أضف للمفضلة',
         freeShip:'شحن مجاني', orders:'طلباتي', account:'حسابي', help:'مساعدة',
         placeOrder:'تأكيد الطلب', shippingAddr:'عنوان الشحن', payMethod:'طريقة الدفع',
         orderSummary:'ملخص الطلب', selectSize:'اختر المقاس', noReviews:'لا توجد تقييمات',
         outOfStock:'نفذ من المخزون', soldOut:'نفذ', oneSize:'مقاس واحد',
         deliveryInfo:'شحن مجاني للطلبات فوق 75$ · توصيل عالمي' },
    zh:{ search:'搜索产品、品牌...', signIn:'登录', cart:'我的购物车',
         checkout:'去结账', addToCart:'加入购物车', featured:'精选产品',
         welcome:'欢迎来到 Jobijad Express！', inquire:'询价', addFav:'加入收藏',
         freeShip:'免费配送', orders:'我的订单', account:'我的账户', help:'帮助',
         placeOrder:'下单', shippingAddr:'收货地址', payMethod:'支付方式',
         orderSummary:'订单摘要', selectSize:'选择尺码', noReviews:'暂无评价',
         outOfStock:'缺货', soldOut:'已售完', oneSize:'均码',
         deliveryInfo:'订单满$75免运费 · 全球配送' }
};

let activeCurrency = localStorage.getItem('jobiCurrency') || 'USD';
let activeLang = localStorage.getItem('jobiLang') || 'en';

function t(key) {
    var lang = TRANSLATIONS[activeLang] || TRANSLATIONS.en;
    return lang[key] || TRANSLATIONS.en[key] || key;
}

function convertPrice(usdPrice) {
    var rate = CURRENCY_RATES[activeCurrency] || 1;
    var converted = usdPrice * rate;
    var sym = CURRENCY_SYMBOLS[activeCurrency] || '$';
    if (activeCurrency === 'UGX' || activeCurrency === 'TZS' || activeCurrency === 'NGN') {
        return sym + Math.round(converted).toLocaleString();
    }
    return sym + converted.toFixed(2);
}

function applyLanguage() {
    // Search placeholders
    var hs = document.getElementById('header-search');
    if (hs) hs.placeholder = t('search');
    var bs = document.getElementById('bottom-search-input');
    if (bs) bs.placeholder = t('search');

    // Auth button text — only update if it's a generic sign-in label
    var authText = document.getElementById('auth-link-text');
    if (authText) {
        var cur = authText.textContent.trim();
        var isGeneric = Object.values(TRANSLATIONS).some(function(tr) { return tr.signIn === cur; });
        if (isGeneric || cur === 'Sign In') authText.textContent = t('signIn');
    }

    // Section title
    var st = document.getElementById('section-title');
    if (st) st.textContent = t('featured');

    // Cart panel header
    var cartH = document.querySelector('.cart-panel-header h2');
    if (cartH) cartH.innerHTML = '<i class="fas fa-shopping-cart"></i> ' + t('cart');

    // Checkout button
    var cb = document.querySelector('.checkout-btn');
    if (cb) cb.innerHTML = '<i class="fas fa-lock"></i> ' + t('checkout');

    // Sidebar welcome
    var sw = document.querySelector('#sidebar-logged-out p');
    if (sw) sw.textContent = t('welcome');

    // Help button text
    var helpTxt = document.querySelector('.help-btn-text');
    if (helpTxt) helpTxt.textContent = t('help');

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
        btn.innerHTML = '<i class="fas fa-cart-plus"></i> ' + t('addToCart');
    });

    // Inquiry buttons
    document.querySelectorAll('.inquiry-btn').forEach(function(btn) {
        btn.innerHTML = '<i class="fas fa-envelope"></i> ' + t('inquire');
    });

    // RTL for Arabic
    document.documentElement.dir = activeLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = activeLang;
}

function openLangCurrency() {
    var modal = document.getElementById('lang-currency-modal');
    if (!modal) return;
    var ls = document.getElementById('lang-select');
    var cs = document.getElementById('currency-select');
    if (ls) ls.value = activeLang;
    if (cs) cs.value = activeCurrency;
    modal.style.display = 'flex';
}
function closeLangCurrency() {
    var modal = document.getElementById('lang-currency-modal');
    if (modal) modal.style.display = 'none';
}
function saveLangCurrency() {
    var lang = document.getElementById('lang-select') ? document.getElementById('lang-select').value : 'en';
    var currency = document.getElementById('currency-select') ? document.getElementById('currency-select').value : 'USD';
    activeLang = lang;
    activeCurrency = currency;
    localStorage.setItem('jobiLang', lang);
    localStorage.setItem('jobiCurrency', currency);
    var display = document.getElementById('currency-display');
    if (display) display.textContent = currency;
    closeLangCurrency();
    applyLanguage();
    // Re-render products with new currency
    if (window._allProducts && typeof _renderProductCards === 'function') _renderProductCards(window._allProducts);
    if (typeof showNotification === 'function') showNotification('Language & currency updated!', 'success');
}

// ===== RFQ =====
function rfqQuickSelect(product) {
    var input = document.getElementById('rfq-product');
    if (input) input.value = product;
    // Highlight selected chip
    document.querySelectorAll('.rfq-chip').forEach(function(c) {
        c.classList.toggle('selected', c.textContent.trim() === product);
    });
    // Focus quantity next
    var qty = document.getElementById('rfq-qty');
    if (qty) setTimeout(function() { qty.focus(); }, 50);
}

function openRFQ() {
    var modal = document.getElementById('rfq-modal');
    if (!modal) return;
    var user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    var nameEl = document.getElementById('rfq-name');
    var emailEl = document.getElementById('rfq-email');
    if (nameEl && user.name) nameEl.value = user.name;
    if (emailEl && user.email) emailEl.value = user.email;
    // Reset chips
    document.querySelectorAll('.rfq-chip').forEach(function(c) { c.classList.remove('selected'); });
    modal.style.display = 'flex';
    // Focus product field
    setTimeout(function() { var el = document.getElementById('rfq-product'); if(el) el.focus(); }, 100);
}
function closeRFQ() {
    var modal = document.getElementById('rfq-modal');
    if (modal) modal.style.display = 'none';
}
async function submitRFQ() {
    var product = document.getElementById('rfq-product') ? document.getElementById('rfq-product').value.trim() : '';
    var qty = document.getElementById('rfq-qty') ? document.getElementById('rfq-qty').value.trim() : '';
    var name = document.getElementById('rfq-name') ? document.getElementById('rfq-name').value.trim() : '';
    var email = document.getElementById('rfq-email') ? document.getElementById('rfq-email').value.trim() : '';
    var details = document.getElementById('rfq-details') ? document.getElementById('rfq-details').value.trim() : '';
    var budget = document.getElementById('rfq-budget') ? document.getElementById('rfq-budget').value.trim() : '';
    var msg = document.getElementById('rfq-msg');
    var btn = document.getElementById('rfq-submit-btn');

    if (!product || !qty || !name || !email) {
        if (msg) { msg.textContent = 'Please fill in the required fields (product, quantity, name, email).'; msg.style.cssText = 'display:block;padding:10px 12px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#fee2e2;color:#991b1b;'; }
        // Shake the empty fields
        [['rfq-product',product],['rfq-qty',qty],['rfq-name',name],['rfq-email',email]].forEach(function(pair) {
            if (!pair[1]) {
                var el = document.getElementById(pair[0]);
                if (el) { el.style.borderColor = '#ef4444'; el.style.animation = 'shake .4s ease'; setTimeout(function() { el.style.animation = ''; }, 400); }
            }
        });
        return;
    }

    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; btn.disabled = true; }
    if (msg) msg.style.display = 'none';

    var user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    var apiBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3000/api' : window.location.origin + '/api';
    var fullMessage = 'RFQ: ' + product + ' x' + qty + (budget ? ' | Budget: ' + budget : '') + (details ? ' | Details: ' + details : '');
    try {
        await fetch(apiBase + '/inquiries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, productName: product, quantity: parseInt(qty)||1, message: fullMessage, userId: user.id || null })
        });
        if (msg) { msg.innerHTML = '<i class="fas fa-check-circle" style="color:#16a34a;margin-right:6px;"></i>Quote request sent! We\'ll reply to <strong>' + email + '</strong> within 24 hours.'; msg.style.cssText = 'display:block;padding:12px 14px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#dcfce7;color:#15803d;'; }
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Sent!'; btn.style.background = '#22c55e'; }
        setTimeout(function() {
            closeRFQ();
            if (btn) { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Quote Request'; btn.disabled = false; btn.style.background = ''; }
        }, 2200);
    } catch(e) {
        if (msg) { msg.textContent = 'Failed to send. Please try again.'; msg.style.cssText = 'display:block;padding:10px 12px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#fee2e2;color:#991b1b;'; }
        if (btn) { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Quote Request'; btn.disabled = false; }
    }
}

// ===== LOCATION MODAL =====
var COUNTRY_CURRENCY_MAP = { UG:'UGX', KE:'KES', TZ:'TZS', RW:'USD', NG:'NGN', GH:'GHS', ZA:'ZAR', SE:'SEK', GB:'GBP', US:'USD', AE:'AED', CN:'CNY' };
function openLocationModal() {
    var modal = document.getElementById('location-modal');
    if (!modal) return;
    var saved = JSON.parse(localStorage.getItem('jobiLocation') || '{}');
    var locCountry = document.getElementById('loc-country');
    var locZip = document.getElementById('loc-zip');
    if (locCountry && saved.country) locCountry.value = saved.country;
    if (locZip && saved.zip) locZip.value = saved.zip;
    var token = localStorage.getItem('jobiToken');
    var signinBtn = document.getElementById('location-signin-btn');
    if (signinBtn) signinBtn.style.display = token ? 'none' : 'block';
    modal.style.display = 'flex';
}
function closeLocationModal() {
    var modal = document.getElementById('location-modal');
    if (modal) modal.style.display = 'none';
}
function updateLocationCountry(code) {
    if (COUNTRY_CURRENCY_MAP[code]) {
        activeCurrency = COUNTRY_CURRENCY_MAP[code];
        localStorage.setItem('jobiCurrency', activeCurrency);
        var display = document.getElementById('currency-display');
        if (display) display.textContent = activeCurrency;
    }
}
function saveLocation() {
    var country = document.getElementById('loc-country') ? document.getElementById('loc-country').value : '';
    var zip = document.getElementById('loc-zip') ? document.getElementById('loc-zip').value.trim() : '';
    if (!country) { if (typeof showNotification === 'function') showNotification('Please select a country', 'warning'); return; }
    localStorage.setItem('jobiLocation', JSON.stringify({ country: country, zip: zip }));
    updateLocationCountry(country);
    closeLocationModal();
    if (typeof showNotification === 'function') showNotification('Location saved!', 'success');
    if (window._allProducts && typeof _renderProductCards === 'function') _renderProductCards(window._allProducts);
}

// ===== SIDEBAR AUTH STATE =====
function updateSidebarAuth() {
    var token = localStorage.getItem('jobiToken');
    var user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    var loggedOut = document.getElementById('sidebar-logged-out');
    var loggedIn = document.getElementById('sidebar-logged-in');
    var userName = document.getElementById('sidebar-user-name');
    if (token && user.name) {
        if (loggedOut) loggedOut.style.display = 'none';
        if (loggedIn) loggedIn.style.display = 'block';
        if (userName) userName.textContent = user.name;
    } else {
        if (loggedOut) loggedOut.style.display = 'block';
        if (loggedIn) loggedIn.style.display = 'none';
    }
}

// ===== PRODUCT DETAIL MODAL — centered, multi-image, zoom =====
window.openProductDetail = function(p) {
    _currentDetailProduct = p;
    _selectedSize = null;
    if (typeof addToRecentlyViewed === 'function') addToRecentlyViewed(p);

    var images = (p.images && p.images.length > 0) ? p.images : [{ url: 'https://via.placeholder.com/400', alt: p.name }];
    var avg = p.ratingAverage || 0;
    var count = p.ratingCount || 0;
    var stars = [1,2,3,4,5].map(function(i) {
        return '<span style="color:' + (i <= Math.round(avg) ? '#f97316' : '#e0e0e0') + ';font-size:18px;">&#9733;</span>';
    }).join('');
    var sizes = p.sizes || [];
    var sizesHtml = sizes.length ? sizes.map(function(s) {
        return '<button class="pd-size-btn' + (s.stock === 0 ? ' out-of-stock' : '') + '" ' +
            (s.stock === 0 ? 'disabled' : 'onclick="selectSize(this,\'' + s.size + '\')"') +
            '>' + s.size + (s.stock === 0 ? ' (' + t('soldOut') + ')' : '') + '</button>';
    }).join('') : '<span style="font-size:13px;color:#888;">' + t('oneSize') + '</span>';
    var inWishlist = (typeof wishlist !== 'undefined') && wishlist.some(function(w) { return w.title === p.name; });
    var price = convertPrice(p.price);

    var thumbs = images.map(function(img, i) {
        return '<div onclick="switchDetailImage(' + i + ',this)" style="width:56px;height:56px;border-radius:6px;overflow:hidden;border:2px solid ' + (i === 0 ? '#f97316' : '#e0e0e0') + ';cursor:pointer;flex-shrink:0;transition:border-color .2s;">' +
            '<img src="' + img.url + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy"></div>';
    }).join('');

    var detailBody = document.getElementById('product-detail-body');
    if (!detailBody) return;

    detailBody.innerHTML =
        '<div style="display:flex;flex-wrap:wrap;">' +
        '<div style="flex:1;min-width:240px;padding:16px;display:flex;gap:10px;">' +
            '<div style="display:flex;flex-direction:column;gap:6px;overflow-y:auto;max-height:360px;">' + thumbs + '</div>' +
            '<div style="flex:1;position:relative;overflow:hidden;border-radius:10px;background:#f8f9fa;cursor:zoom-in;" id="pd-main-img-wrap" onmousemove="zoomImage(event,this)" onmouseleave="resetZoom(this)">' +
                '<img id="pd-main-img" src="' + images[0].url + '" alt="' + p.name + '" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;display:block;transition:transform .15s ease;transform-origin:center center;">' +
                '<div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.45);color:#fff;font-size:10px;padding:3px 8px;border-radius:10px;pointer-events:none;"><i class="fas fa-search-plus"></i> Hover to zoom</div>' +
            '</div>' +
        '</div>' +
        '<div class="pd-body" style="flex:1;min-width:240px;">' +
            '<div class="pd-title">' + p.name + '</div>' +
            '<div class="pd-price">' + price + '</div>' +
            '<div class="pd-stars">' + stars + '<span class="pd-rating-text">' + (count > 0 ? avg.toFixed(1) + ' (' + count + ' reviews)' : t('noReviews')) + '</span></div>' +
            '<div class="pd-desc">' + (p.description || '') + '</div>' +
            (sizes.length ? '<div class="pd-section-label">' + t('selectSize') + '</div><div class="pd-sizes" id="pd-sizes-row">' + sizesHtml + '</div>' : '') +
            '<div class="pd-actions">' +
                '<button class="pd-add-btn" onclick="addToCartFromDetail()"><i class="fas fa-cart-plus"></i> ' + t('addToCart') + '</button>' +
                '<button class="pd-wish-btn' + (inWishlist ? ' active' : '') + '" id="pd-wish-btn" onclick="toggleWishlistFromDetail()" title="' + t('addFav') + '"><i class="fas fa-heart"></i></button>' +
            '</div>' +
            '<div class="pd-delivery-info"><i class="fas fa-truck"></i> ' + t('deliveryInfo') + '</div>' +
            (count > 0 ? '<div class="pd-reviews"><div class="pd-section-label" style="margin-bottom:10px;">Customer Reviews</div><div id="pd-reviews-list"><div style="text-align:center;padding:16px;color:#aaa;"><i class="fas fa-spinner fa-spin"></i></div></div></div>' : '') +
        '</div></div>';

    var modal = document.getElementById('product-detail-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    if (count > 0 && typeof loadProductReviews === 'function') loadProductReviews(p.name);
};

window.switchDetailImage = function(idx) {
    var p = _currentDetailProduct;
    if (!p) return;
    var images = (p.images && p.images.length > 0) ? p.images : [];
    var mainImg = document.getElementById('pd-main-img');
    if (mainImg && images[idx]) mainImg.src = images[idx].url;
    var thumbs = document.querySelectorAll('#product-detail-body [onclick^="switchDetailImage"]');
    thumbs.forEach(function(th, i) { th.style.borderColor = i === idx ? '#f97316' : '#e0e0e0'; });
};

window.zoomImage = function(e, wrap) {
    var img = wrap.querySelector('img');
    if (!img) return;
    var rect = wrap.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = x + '% ' + y + '%';
    img.style.transform = 'scale(2.5)';
};
window.resetZoom = function(wrap) {
    var img = wrap.querySelector('img');
    if (img) { img.style.transform = 'scale(1)'; img.style.transformOrigin = 'center center'; }
};

// ===== PATCH _renderProductCards to attach card clicks + currency =====
var _origRenderCards2 = null;
function _patchRenderCards() {
    if (typeof _renderProductCards !== 'function') {
        // Try again shortly
        setTimeout(_patchRenderCards, 200);
        return;
    }
    if (_origRenderCards2) return; // already patched
    _origRenderCards2 = _renderProductCards;
    window._renderProductCards = function(products) {
        _origRenderCards2(products);
        // Update prices with active currency
        document.querySelectorAll('.product-card').forEach(function(card, idx) {
            var p = products[idx];
            if (!p) return;
            var priceEl = card.querySelector('.product-price');
            if (priceEl) priceEl.textContent = convertPrice(p.price);
            // Attach click to open detail modal
            card.addEventListener('click', function(e) {
                if (e.target.closest('.add-to-cart-btn') || e.target.closest('.inquiry-btn') || e.target.closest('.heart-btn')) return;
                openProductDetail(p);
            });
        });
    };
}

// ===== PROFILE PHOTO — avatar wrap clickable =====
function initAvatarInteraction() {
    var avatarWrap = document.getElementById('ap-avatar-wrap');
    if (avatarWrap && !avatarWrap._avatarInited) {
        avatarWrap._avatarInited = true;
        avatarWrap.style.cursor = 'pointer';
        avatarWrap.title = 'Tap to change profile photo';
        avatarWrap.addEventListener('click', function(e) {
            // Don't double-trigger if camera label was clicked
            if (e.target.closest('label')) return;
            var inp = document.getElementById('ap-avatar-input');
            if (inp) inp.click();
        });
    }
    // Also make the sidebar logged-in avatar clickable
    var sidebarAvatar = document.querySelector('#sidebar-logged-in > div');
    if (sidebarAvatar && !sidebarAvatar._avatarInited) {
        sidebarAvatar._avatarInited = true;
        sidebarAvatar.style.cursor = 'pointer';
        sidebarAvatar.addEventListener('click', function() {
            if (typeof openAccountPanel === 'function') openAccountPanel();
            if (typeof closeSidebar === 'function') closeSidebar();
        });
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    // Init currency display
    var display = document.getElementById('currency-display');
    if (display) display.textContent = activeCurrency;

    // Apply saved language
    applyLanguage();

    // Update sidebar auth
    updateSidebarAuth();

    // Patch render cards after a tick (so alibaba-script.js has defined it)
    setTimeout(_patchRenderCards, 100);

    // Avatar interaction
    initAvatarInteraction();

    // Re-init avatar when account panel opens (it may not exist yet on DOMContentLoaded)
    var accountPanel = document.getElementById('account-panel');
    if (accountPanel) {
        var observer = new MutationObserver(function() { initAvatarInteraction(); });
        observer.observe(accountPanel, { attributes: true, attributeFilter: ['class'] });
    }
});

// Also patch after products load
document.addEventListener('productsLoaded', _patchRenderCards);
