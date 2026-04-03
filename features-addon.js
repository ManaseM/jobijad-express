// ===== CURRENCY & LANGUAGE SYSTEM =====
const CURRENCY_RATES = {
    USD:1, UGX:3700, KES:130, TZS:2600, NGN:1600,
    GHS:15, ZAR:18.5, EUR:0.92, GBP:0.79, SEK:10.4, AED:3.67, CNY:7.25,
    JPY:149, CAD:1.36, AUD:1.53, CHF:0.89, INR:83
};
const CURRENCY_SYMBOLS = {
    USD:'$', UGX:'USh ', KES:'KSh ', TZS:'TSh ', NGN:'₦',
    GHS:'GH₵', ZAR:'R', EUR:'€', GBP:'£', SEK:'kr ', AED:'AED ',
    CNY:'¥', JPY:'¥', CAD:'CA$', AUD:'A$', CHF:'CHF ', INR:'₹'
};

// Full translations — every visible string on the site
const TRANSLATIONS = {
    en:{
        siteName:'Jobijad Express', siteTagline:'Premium African Fashion',
        search:'Search products, brands, categories...', signIn:'Sign In', signOut:'Sign Out',
        cart:'My Cart', checkout:'Proceed to Checkout', addToCart:'Add to Cart',
        featured:'Featured Products', welcome:'Welcome to Jobijad Express!',
        inquire:'Inquire', addFav:'Add to Favourites', freeShip:'Free Shipping',
        orders:'My Orders', account:'My Account', help:'Help', messages:'Messages',
        favourites:'Favourites', home:'Home', rfq:'RFQs',
        placeOrder:'Place Order', shippingAddr:'Shipping Address', payMethod:'Payment Method',
        orderSummary:'Order Summary', selectSize:'Select Size', noReviews:'No reviews yet',
        outOfStock:'Out of stock', soldOut:'sold out', oneSize:'One Size',
        deliveryInfo:'Free shipping on orders over $75 · Worldwide delivery',
        needHelp:'Need Help?', contactUs:'Contact us', easyReturns:'Easy Returns',
        returnPolicy:'14-day policy', securePayments:'Secure Payments', freeShipSub:'Orders over $75',
        discoverTitle:'Discover African Fashion Worldwide',
        discoverSub:'Premium Kitenge & more — shipped globally',
        women:'Women', men:'Men', children:'Children', accessories:'Accessories', all:'All',
        sortBy:'Sort by', priceLow:'Price: Low to High', priceHigh:'Price: High to Low',
        nameAZ:'Name: A–Z', featuredFirst:'Featured First',
        searchPlaceholder:'Describe what you\'re looking for...',
        backToShopping:'Back to Shopping', secureCheckout:'Secure Checkout',
        fullName:'Full Name', phone:'Phone', streetAddress:'Street Address',
        state:'State / Province', city:'City', postalCode:'Postal Code',
        countryRegion:'Country / Region', subtotal:'Subtotal', shipping:'Shipping',
        tax:'Tax (8%)', total:'Total', free:'FREE',
        orderPlaced:'Order Placed Successfully!', yourOrderNum:'Your order number is:',
        viewOrders:'View My Orders', continueShopping:'Continue Shopping',
        swishPay:'Pay with Swish', paypalPay:'Pay with PayPal', cardPay:'Credit / Debit Card',
        payOnDelivery:'Pay on Delivery', cardholderName:'Cardholder Name',
        cardNumber:'Card Number', expiryDate:'Expiry Date', cvv:'CVV',
        securedBy:'Secured by', sslNote:'256-bit SSL encryption',
        privacyPolicy:'Privacy Policy', termsOfService:'Terms of Service',
        returnsPolicy:'Returns Policy', contactFooter:'Contact Us',
        shopFooter:'Shop', accountFooter:'Account', loginRegister:'Login / Register',
        checkoutFooter:'Checkout', worldwideShipping:'Worldwide Shipping', createAccount:'Create Account', tapToViewAccount:'Tap to view account →', promoPlaceholder:'Promo code', applyPromo:'Apply', secureNote:'Secure checkout — your data is protected'
    },
    fr:{
        siteName:'Jobijad Express', siteTagline:'Mode Africaine Premium',
        search:'Rechercher des produits...', signIn:'Se connecter', signOut:'Se déconnecter',
        cart:'Mon Panier', checkout:'Passer à la caisse', addToCart:'Ajouter au panier',
        featured:'Produits en vedette', welcome:'Bienvenue sur Jobijad Express!',
        inquire:'Demander', addFav:'Ajouter aux favoris', freeShip:'Livraison gratuite',
        orders:'Mes commandes', account:'Mon compte', help:'Aide', messages:'Messages',
        favourites:'Favoris', home:'Accueil', rfq:'Devis',
        placeOrder:'Passer la commande', shippingAddr:'Adresse de livraison',
        payMethod:'Mode de paiement', orderSummary:'Récapitulatif',
        selectSize:'Choisir la taille', noReviews:'Aucun avis',
        outOfStock:'Rupture de stock', soldOut:'épuisé', oneSize:'Taille unique',
        deliveryInfo:'Livraison gratuite dès 75$ · Livraison mondiale',
        needHelp:'Besoin d\'aide?', contactUs:'Contactez-nous', easyReturns:'Retours faciles',
        returnPolicy:'Politique 14 jours', securePayments:'Paiements sécurisés',
        freeShipSub:'Commandes sup. à 75$',
        discoverTitle:'Découvrez la Mode Africaine Mondiale',
        discoverSub:'Kitenge premium & plus — livraison mondiale',
        women:'Femmes', men:'Hommes', children:'Enfants', accessories:'Accessoires', all:'Tout',
        sortBy:'Trier par', priceLow:'Prix: Croissant', priceHigh:'Prix: Décroissant',
        nameAZ:'Nom: A–Z', featuredFirst:'En vedette d\'abord',
        searchPlaceholder:'Décrivez ce que vous cherchez...',
        backToShopping:'Retour aux achats', secureCheckout:'Paiement sécurisé',
        fullName:'Nom complet', phone:'Téléphone', streetAddress:'Adresse',
        state:'État / Province', city:'Ville', postalCode:'Code postal',
        countryRegion:'Pays / Région', subtotal:'Sous-total', shipping:'Livraison',
        tax:'Taxe (8%)', total:'Total', free:'GRATUIT',
        orderPlaced:'Commande passée avec succès!', yourOrderNum:'Votre numéro de commande:',
        viewOrders:'Voir mes commandes', continueShopping:'Continuer les achats',
        swishPay:'Payer avec Swish', paypalPay:'Payer avec PayPal',
        cardPay:'Carte de crédit / débit', payOnDelivery:'Payer à la livraison',
        cardholderName:'Nom du titulaire', cardNumber:'Numéro de carte',
        expiryDate:'Date d\'expiration', cvv:'CVV',
        securedBy:'Sécurisé par', sslNote:'Chiffrement SSL 256 bits',
        privacyPolicy:'Politique de confidentialité', termsOfService:'Conditions d\'utilisation',
        returnsPolicy:'Politique de retour', contactFooter:'Nous contacter',
        shopFooter:'Boutique', accountFooter:'Compte', loginRegister:'Connexion / Inscription',
        checkoutFooter:'Paiement', worldwideShipping:'Livraison mondiale', createAccount:'Créer un compte', tapToViewAccount:'Voir le compte →', promoPlaceholder:'Code promo', applyPromo:'Appliquer', secureNote:'Paiement sécurisé — vos données sont protégées'
    },
    sw:{
        siteName:'Jobijad Express', siteTagline:'Mitindo ya Afrika ya Hali ya Juu',
        search:'Tafuta bidhaa...', signIn:'Ingia', signOut:'Toka',
        cart:'Kikapu Changu', checkout:'Endelea Kulipa', addToCart:'Ongeza kwenye Kikapu',
        featured:'Bidhaa Maarufu', welcome:'Karibu Jobijad Express!',
        inquire:'Uliza', addFav:'Ongeza kwenye Vipendwa', freeShip:'Usafirishaji Bure',
        orders:'Maagizo Yangu', account:'Akaunti Yangu', help:'Msaada', messages:'Ujumbe',
        favourites:'Vipendwa', home:'Nyumbani', rfq:'Ombi la Bei',
        placeOrder:'Weka Agizo', shippingAddr:'Anwani ya Usafirishaji',
        payMethod:'Njia ya Malipo', orderSummary:'Muhtasari wa Agizo',
        selectSize:'Chagua Ukubwa', noReviews:'Hakuna maoni',
        outOfStock:'Haipatikani', soldOut:'imeisha', oneSize:'Ukubwa Mmoja',
        deliveryInfo:'Usafirishaji bure zaidi ya $75 · Usafirishaji duniani kote',
        needHelp:'Unahitaji Msaada?', contactUs:'Wasiliana nasi', easyReturns:'Rudisha Kwa Urahisi',
        returnPolicy:'Sera ya siku 14', securePayments:'Malipo Salama',
        freeShipSub:'Maagizo zaidi ya $75',
        discoverTitle:'Gundua Mitindo ya Afrika Duniani',
        discoverSub:'Kitenge bora & zaidi — usafirishaji duniani kote',
        women:'Wanawake', men:'Wanaume', children:'Watoto', accessories:'Vifaa', all:'Yote',
        sortBy:'Panga kwa', priceLow:'Bei: Chini hadi Juu', priceHigh:'Bei: Juu hadi Chini',
        nameAZ:'Jina: A–Z', featuredFirst:'Maarufu Kwanza',
        searchPlaceholder:'Elezea unachotafuta...',
        backToShopping:'Rudi Kununua', secureCheckout:'Malipo Salama',
        fullName:'Jina Kamili', phone:'Simu', streetAddress:'Anwani ya Mtaa',
        state:'Jimbo / Mkoa', city:'Mji', postalCode:'Nambari ya Posta',
        countryRegion:'Nchi / Mkoa', subtotal:'Jumla Ndogo', shipping:'Usafirishaji',
        tax:'Kodi (8%)', total:'Jumla', free:'BURE',
        orderPlaced:'Agizo Limewekwa!', yourOrderNum:'Nambari yako ya agizo:',
        viewOrders:'Ona Maagizo Yangu', continueShopping:'Endelea Kununua',
        swishPay:'Lipa na Swish', paypalPay:'Lipa na PayPal',
        cardPay:'Kadi ya Mkopo / Debit', payOnDelivery:'Lipa Unapopokea',
        cardholderName:'Jina la Mmiliki wa Kadi', cardNumber:'Nambari ya Kadi',
        expiryDate:'Tarehe ya Kumalizika', cvv:'CVV',
        securedBy:'Imelindwa na', sslNote:'Usimbaji fiche wa SSL 256-bit',
        privacyPolicy:'Sera ya Faragha', termsOfService:'Masharti ya Huduma',
        returnsPolicy:'Sera ya Kurudisha', contactFooter:'Wasiliana Nasi',
        shopFooter:'Duka', accountFooter:'Akaunti', loginRegister:'Ingia / Jisajili',
        checkoutFooter:'Malipo', worldwideShipping:'Usafirishaji Duniani Kote', createAccount:'Fungua Akaunti', tapToViewAccount:'Bonyeza kuona akaunti →', promoPlaceholder:'Nambari ya punguzo', applyPromo:'Tumia', secureNote:'Malipo salama — data yako inalindwa'
    },
    ar:{
        siteName:'جوبيجاد إكسبريس', siteTagline:'أزياء أفريقية فاخرة',
        search:'ابحث عن المنتجات...', signIn:'تسجيل الدخول', signOut:'تسجيل الخروج',
        cart:'سلة التسوق', checkout:'المتابعة للدفع', addToCart:'أضف إلى السلة',
        featured:'المنتجات المميزة', welcome:'مرحباً بك في جوبيجاد إكسبريس!',
        inquire:'استفسار', addFav:'أضف للمفضلة', freeShip:'شحن مجاني',
        orders:'طلباتي', account:'حسابي', help:'مساعدة', messages:'الرسائل',
        favourites:'المفضلة', home:'الرئيسية', rfq:'طلب عرض سعر',
        placeOrder:'تأكيد الطلب', shippingAddr:'عنوان الشحن',
        payMethod:'طريقة الدفع', orderSummary:'ملخص الطلب',
        selectSize:'اختر المقاس', noReviews:'لا توجد تقييمات',
        outOfStock:'نفذ من المخزون', soldOut:'نفذ', oneSize:'مقاس واحد',
        deliveryInfo:'شحن مجاني للطلبات فوق 75$ · توصيل عالمي',
        needHelp:'تحتاج مساعدة؟', contactUs:'تواصل معنا', easyReturns:'إرجاع سهل',
        returnPolicy:'سياسة 14 يوم', securePayments:'مدفوعات آمنة',
        freeShipSub:'طلبات أكثر من 75$',
        discoverTitle:'اكتشف الأزياء الأفريقية حول العالم',
        discoverSub:'كيتنجي فاخر والمزيد — شحن عالمي',
        women:'نساء', men:'رجال', children:'أطفال', accessories:'إكسسوارات', all:'الكل',
        sortBy:'ترتيب حسب', priceLow:'السعر: من الأقل', priceHigh:'السعر: من الأعلى',
        nameAZ:'الاسم: أ–ي', featuredFirst:'المميز أولاً',
        searchPlaceholder:'صف ما تبحث عنه...',
        backToShopping:'العودة للتسوق', secureCheckout:'دفع آمن',
        fullName:'الاسم الكامل', phone:'الهاتف', streetAddress:'عنوان الشارع',
        state:'الولاية / المحافظة', city:'المدينة', postalCode:'الرمز البريدي',
        countryRegion:'الدولة / المنطقة', subtotal:'المجموع الفرعي', shipping:'الشحن',
        tax:'الضريبة (8%)', total:'الإجمالي', free:'مجاني',
        orderPlaced:'تم تقديم الطلب بنجاح!', yourOrderNum:'رقم طلبك:',
        viewOrders:'عرض طلباتي', continueShopping:'مواصلة التسوق',
        swishPay:'الدفع بـ Swish', paypalPay:'الدفع بـ PayPal',
        cardPay:'بطاقة ائتمان / خصم', payOnDelivery:'الدفع عند الاستلام',
        cardholderName:'اسم حامل البطاقة', cardNumber:'رقم البطاقة',
        expiryDate:'تاريخ الانتهاء', cvv:'رمز الأمان',
        securedBy:'مؤمّن بواسطة', sslNote:'تشفير SSL 256-bit',
        privacyPolicy:'سياسة الخصوصية', termsOfService:'شروط الخدمة',
        returnsPolicy:'سياسة الإرجاع', contactFooter:'تواصل معنا',
        shopFooter:'المتجر', accountFooter:'الحساب', loginRegister:'تسجيل الدخول / التسجيل',
        checkoutFooter:'الدفع', worldwideShipping:'شحن عالمي', createAccount:'إنشاء حساب', tapToViewAccount:'اضغط لعرض الحساب →', promoPlaceholder:'رمز الخصم', applyPromo:'تطبيق', secureNote:'دفع آمن — بياناتك محمية'
    },
    zh:{
        siteName:'乔比贾德快递', siteTagline:'非洲高端时尚',
        search:'搜索产品、品牌...', signIn:'登录', signOut:'退出登录',
        cart:'我的购物车', checkout:'去结账', addToCart:'加入购物车',
        featured:'精选产品', welcome:'欢迎来到乔比贾德快递！',
        inquire:'询价', addFav:'加入收藏', freeShip:'免费配送',
        orders:'我的订单', account:'我的账户', help:'帮助', messages:'消息',
        favourites:'收藏夹', home:'首页', rfq:'询价单',
        placeOrder:'下单', shippingAddr:'收货地址',
        payMethod:'支付方式', orderSummary:'订单摘要',
        selectSize:'选择尺码', noReviews:'暂无评价',
        outOfStock:'缺货', soldOut:'已售完', oneSize:'均码',
        deliveryInfo:'订单满$75免运费 · 全球配送',
        needHelp:'需要帮助？', contactUs:'联系我们', easyReturns:'轻松退货',
        returnPolicy:'14天退货政策', securePayments:'安全支付',
        freeShipSub:'订单满$75',
        discoverTitle:'探索全球非洲时尚',
        discoverSub:'优质肯特布及更多 — 全球配送',
        women:'女装', men:'男装', children:'童装', accessories:'配饰', all:'全部',
        sortBy:'排序', priceLow:'价格：从低到高', priceHigh:'价格：从高到低',
        nameAZ:'名称：A–Z', featuredFirst:'精选优先',
        searchPlaceholder:'描述您要找的商品...',
        backToShopping:'返回购物', secureCheckout:'安全结账',
        fullName:'全名', phone:'电话', streetAddress:'街道地址',
        state:'省/州', city:'城市', postalCode:'邮政编码',
        countryRegion:'国家/地区', subtotal:'小计', shipping:'运费',
        tax:'税费 (8%)', total:'总计', free:'免费',
        orderPlaced:'下单成功！', yourOrderNum:'您的订单号：',
        viewOrders:'查看我的订单', continueShopping:'继续购物',
        swishPay:'Swish支付', paypalPay:'PayPal支付',
        cardPay:'信用卡/借记卡', payOnDelivery:'货到付款',
        cardholderName:'持卡人姓名', cardNumber:'卡号',
        expiryDate:'有效期', cvv:'安全码',
        securedBy:'由...保障', sslNote:'256位SSL加密',
        privacyPolicy:'隐私政策', termsOfService:'服务条款',
        returnsPolicy:'退货政策', contactFooter:'联系我们',
        shopFooter:'商店', accountFooter:'账户', loginRegister:'登录/注册',
        checkoutFooter:'结账', worldwideShipping:'全球配送', createAccount:'创建账户', tapToViewAccount:'点击查看账户 →', promoPlaceholder:'优惠码', applyPromo:'使用', secureNote:'安全结账 — 您的数据受到保护'
    },
    sv:{
        siteName:'Jobijad Express', siteTagline:'Premium Afrikansk Mode',
        search:'Sök produkter, varumärken...', signIn:'Logga in', signOut:'Logga ut',
        cart:'Min Varukorg', checkout:'Gå till kassan', addToCart:'Lägg i varukorg',
        featured:'Utvalda Produkter', welcome:'Välkommen till Jobijad Express!',
        inquire:'Förfrågan', addFav:'Lägg till favoriter', freeShip:'Fri frakt',
        orders:'Mina beställningar', account:'Mitt konto', help:'Hjälp', messages:'Meddelanden',
        favourites:'Favoriter', home:'Hem', rfq:'Offertförfrågan',
        placeOrder:'Lägg beställning', shippingAddr:'Leveransadress',
        payMethod:'Betalningsmetod', orderSummary:'Ordersammanfattning',
        selectSize:'Välj storlek', noReviews:'Inga recensioner ännu',
        outOfStock:'Slut i lager', soldOut:'slutsåld', oneSize:'En storlek',
        deliveryInfo:'Fri frakt på beställningar över 75$ · Leverans världen över',
        needHelp:'Behöver du hjälp?', contactUs:'Kontakta oss', easyReturns:'Enkel retur',
        returnPolicy:'14-dagarspolicy', securePayments:'Säkra betalningar',
        freeShipSub:'Beställningar över 75$',
        discoverTitle:'Upptäck Afrikansk Mode Världen Över',
        discoverSub:'Premium Kitenge & mer — levereras globalt',
        women:'Dam', men:'Herr', children:'Barn', accessories:'Accessoarer', all:'Alla',
        sortBy:'Sortera efter', priceLow:'Pris: Lägst till Högst', priceHigh:'Pris: Högst till Lägst',
        nameAZ:'Namn: A–Ö', featuredFirst:'Utvalda Först',
        searchPlaceholder:'Beskriv vad du letar efter...',
        backToShopping:'Tillbaka till shopping', secureCheckout:'Säker kassa',
        fullName:'Fullständigt namn', phone:'Telefon', streetAddress:'Gatuadress',
        state:'Län / Provins', city:'Stad', postalCode:'Postnummer',
        countryRegion:'Land / Region', subtotal:'Delsumma', shipping:'Frakt',
        tax:'Moms (8%)', total:'Totalt', free:'GRATIS',
        orderPlaced:'Beställning lagd!', yourOrderNum:'Ditt ordernummer:',
        viewOrders:'Visa mina beställningar', continueShopping:'Fortsätt handla',
        swishPay:'Betala med Swish', paypalPay:'Betala med PayPal',
        cardPay:'Kredit-/betalkort', payOnDelivery:'Betala vid leverans',
        cardholderName:'Kortinnehavarens namn', cardNumber:'Kortnummer',
        expiryDate:'Utgångsdatum', cvv:'CVV',
        securedBy:'Säkrad av', sslNote:'256-bitars SSL-kryptering',
        privacyPolicy:'Integritetspolicy', termsOfService:'Användarvillkor',
        returnsPolicy:'Returpolicy', contactFooter:'Kontakta oss',
        shopFooter:'Butik', accountFooter:'Konto', loginRegister:'Logga in / Registrera',
        checkoutFooter:'Kassa', worldwideShipping:'Leverans världen över', createAccount:'Skapa konto', tapToViewAccount:'Tryck för att se konto →', promoPlaceholder:'Kampanjkod', applyPromo:'Använd', secureNote:'Säker kassa — dina uppgifter är skyddade'
    }
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
    if (['UGX','TZS','NGN','JPY','INR'].includes(activeCurrency)) {
        return sym + Math.round(converted).toLocaleString();
    }
    return sym + converted.toFixed(2);
}

// ===== SHIPPING COST CALCULATOR =====
// Sweden: max $1 (often free), other countries tiered like major e-commerce
const SHIPPING_RATES = {
    'Sweden': { threshold: 0, cost: 0.99, freeThreshold: 30 },       // Free over $30 in Sweden
    'Norway': { threshold: 0, cost: 4.99, freeThreshold: 75 },
    'Denmark': { threshold: 0, cost: 4.99, freeThreshold: 75 },
    'Finland': { threshold: 0, cost: 4.99, freeThreshold: 75 },
    'United Kingdom': { threshold: 0, cost: 6.99, freeThreshold: 75 },
    'Germany': { threshold: 0, cost: 5.99, freeThreshold: 75 },
    'France': { threshold: 0, cost: 5.99, freeThreshold: 75 },
    'Netherlands': { threshold: 0, cost: 5.99, freeThreshold: 75 },
    'United States': { threshold: 0, cost: 9.99, freeThreshold: 75 },
    'Canada': { threshold: 0, cost: 9.99, freeThreshold: 75 },
    'Australia': { threshold: 0, cost: 12.99, freeThreshold: 100 },
    'UAE': { threshold: 0, cost: 8.99, freeThreshold: 75 },
    'Uganda': { threshold: 0, cost: 4.99, freeThreshold: 50 },
    'Kenya': { threshold: 0, cost: 4.99, freeThreshold: 50 },
    'Tanzania': { threshold: 0, cost: 4.99, freeThreshold: 50 },
    'Rwanda': { threshold: 0, cost: 4.99, freeThreshold: 50 },
    'Nigeria': { threshold: 0, cost: 7.99, freeThreshold: 75 },
    'Ghana': { threshold: 0, cost: 7.99, freeThreshold: 75 },
    'South Africa': { threshold: 0, cost: 8.99, freeThreshold: 75 },
    'China': { threshold: 0, cost: 6.99, freeThreshold: 75 },
    'default': { threshold: 0, cost: 14.99, freeThreshold: 100 }
};

function getShippingCost(subtotalUSD, country) {
    var rate = SHIPPING_RATES[country] || SHIPPING_RATES['default'];
    if (subtotalUSD >= rate.freeThreshold) return 0;
    return rate.cost;
}

function getShippingDisplay(subtotalUSD, country) {
    var cost = getShippingCost(subtotalUSD, country);
    if (cost === 0) return t('free');
    return convertPrice(cost);
}

// ===== FULL PAGE LANGUAGE APPLICATION =====
function applyLanguage() {
    var lang = activeLang;

    // Page title
    document.title = t('siteName') + ' - ' + t('siteTagline');

    // ALL data-i18n elements — the primary translation mechanism
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        var val = t(key);
        if (val && val !== key) {
            // Preserve child elements (badges, icons) — only update text nodes
            var hasChildren = el.querySelector('span, i, button, a');
            if (hasChildren) {
                // Update only the first text node
                for (var i = 0; i < el.childNodes.length; i++) {
                    if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim()) {
                        el.childNodes[i].textContent = val + ' ';
                        break;
                    }
                }
            } else {
                el.textContent = val;
            }
        }
    });

    // data-i18n-placeholder elements
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-placeholder');
        var val = t(key);
        if (val && val !== key) el.placeholder = val;
    });

    // data-i18n-html elements (for HTML content like hero title with <span>)
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-html');
        var val = t(key);
        if (val && val !== key) {
            // Wrap the highlighted word in a span
            var highlighted = val.replace(/African|Africaine|Afrika|Afrikansk|أفريقية|非洲|Afrika/g, '<span>$&</span>');
            el.innerHTML = highlighted;
        }
    });

    // Search placeholders
    var hs = document.getElementById('header-search');
    if (hs) hs.placeholder = t('search');
    var bs = document.getElementById('bottom-search-input');
    if (bs) bs.placeholder = t('searchPlaceholder');

    // Auth button text (header)
    var authText = document.getElementById('auth-link-text');
    if (authText) {
        var cur = authText.textContent.trim();
        var allSignIns = Object.values(TRANSLATIONS).map(function(tr) { return tr.signIn; });
        if (allSignIns.includes(cur) || cur === 'Sign In') authText.textContent = t('signIn');
    }

    // Section title
    var st = document.getElementById('section-title');
    if (st) st.textContent = t('featured');

    // Sort select options
    var sortSel = document.getElementById('sort-select');
    if (sortSel) {
        var opts = sortSel.querySelectorAll('option');
        var sortKeys = ['sortBy','','priceLow','priceHigh','nameAZ','featuredFirst'];
        opts.forEach(function(opt, i) { if (sortKeys[i] && t(sortKeys[i])) opt.textContent = t(sortKeys[i]); });
    }

    // Cart panel header
    var cartH = document.querySelector('.cart-panel-header h2 span[data-i18n]');
    if (!cartH) {
        var cartHFull = document.querySelector('.cart-panel-header h2');
        if (cartHFull) cartHFull.innerHTML = '<i class="fas fa-shopping-cart"></i> ' + t('cart');
    }

    // Checkout button
    var cb = document.querySelector('.checkout-btn span[data-i18n]');
    if (!cb) {
        var cbFull = document.querySelector('.checkout-btn');
        if (cbFull) cbFull.innerHTML = '<i class="fas fa-lock"></i> ' + t('checkout');
    }

    // Help button
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

    // Trust bar shipping sub
    var trustShipSub = document.getElementById('trust-shipping-sub');
    if (trustShipSub) trustShipSub.textContent = t('freeShipSub');

    // Footer links
    var footerLinks = {
        'footer-shop': 'shopFooter', 'footer-account': 'accountFooter',
        'footer-contact': 'contactFooter', 'footer-privacy': 'privacyPolicy',
        'footer-terms': 'termsOfService', 'footer-returns': 'returnsPolicy'
    };
    Object.keys(footerLinks).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = t(footerLinks[id]);
    });

    // RTL for Arabic
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Currency display
    var display = document.getElementById('currency-display');
    if (display) display.textContent = activeCurrency;
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
    closeLangCurrency();
    applyLanguage();
    if (window._allProducts && typeof _renderProductCards === 'function') _renderProductCards(window._allProducts);
    if (typeof showNotification === 'function') showNotification(t('siteName') + ' — ' + t('siteTagline'), 'success');
}

// ===== TRUST BAR FUNCTIONS =====
function showSecurePaymentsInfo() {
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:4000;display:flex;align-items:center;justify-content:center;padding:16px;';
    modal.innerHTML = '<div style="background:#fff;border-radius:16px;width:100%;max-width:420px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.25);">' +
        '<div style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:20px 22px;display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;background:rgba(34,197,94,.25);border-radius:8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-shield-alt" style="color:#22c55e;font-size:16px;"></i></div>' +
        '<div style="color:#fff;font-size:15px;font-weight:700;">' + t('securePayments') + '</div></div>' +
        '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:rgba(255,255,255,.1);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button></div>' +
        '<div style="padding:20px;">' +
        '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f0fdf4;border-radius:8px;margin-bottom:10px;"><i class="fas fa-lock" style="color:#22c55e;font-size:18px;width:24px;text-align:center;"></i><div><div style="font-size:13px;font-weight:700;color:#1a1a2e;">256-bit SSL Encryption</div><div style="font-size:12px;color:#888;">All data is encrypted in transit</div></div></div>' +
        '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f0fdf4;border-radius:8px;margin-bottom:10px;"><i class="fas fa-credit-card" style="color:#22c55e;font-size:18px;width:24px;text-align:center;"></i><div><div style="font-size:13px;font-weight:700;color:#1a1a2e;">Secure Card Processing</div><div style="font-size:12px;color:#888;">Card details never stored on our servers</div></div></div>' +
        '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f0fdf4;border-radius:8px;margin-bottom:10px;"><i class="fab fa-paypal" style="color:#003087;font-size:18px;width:24px;text-align:center;"></i><div><div style="font-size:13px;font-weight:700;color:#1a1a2e;">PayPal Buyer Protection</div><div style="font-size:12px;color:#888;">Dispute resolution for eligible purchases</div></div></div>' +
        '<div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f0fdf4;border-radius:8px;"><i class="fas fa-mobile-alt" style="color:#00a550;font-size:18px;width:24px;text-align:center;"></i><div><div style="font-size:13px;font-weight:700;color:#1a1a2e;">Swish Instant Payment</div><div style="font-size:12px;color:#888;">Verified by your Swedish bank</div></div></div>' +
        '</div></div>';
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

function showFreeShippingInfo() {
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:4000;display:flex;align-items:center;justify-content:center;padding:16px;';
    modal.innerHTML = '<div style="background:#fff;border-radius:16px;width:100%;max-width:440px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.25);">' +
        '<div style="background:linear-gradient(135deg,#1a1a2e,#0f3460);padding:20px 22px;display:flex;align-items:center;justify-content:space-between;">' +
        '<div style="display:flex;align-items:center;gap:10px;"><div style="width:36px;height:36px;background:rgba(249,115,22,.25);border-radius:8px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-truck" style="color:#f97316;font-size:16px;"></i></div>' +
        '<div style="color:#fff;font-size:15px;font-weight:700;">' + t('freeShip') + ' & Delivery Rates</div></div>' +
        '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:rgba(255,255,255,.1);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button></div>' +
        '<div style="padding:16px 20px;max-height:70vh;overflow-y:auto;">' +
        '<div style="background:#f0fff8;border:1.5px solid #00a550;border-radius:8px;padding:12px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;">' +
        '<span style="font-size:20px;">🇸🇪</span><div><div style="font-size:13px;font-weight:700;color:#00a550;">Sweden — Special Rate</div><div style="font-size:12px;color:#555;">Free shipping on orders over $30 · Otherwise only $0.99</div></div></div>' +
        _shippingTableRows() +
        '<div style="font-size:11px;color:#aaa;margin-top:12px;text-align:center;"><i class="fas fa-info-circle" style="color:#f97316;margin-right:4px;"></i>Rates are in USD. Delivery times: Sweden 2-4 days, Europe 5-10 days, Worldwide 8-16 days.</div>' +
        '</div></div>';
    modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
}

function _shippingTableRows() {
    var regions = [
        { flag:'🇸🇪', name:'Sweden', rate:'$0.99', free:'$30+', time:'2–4 days' },
        { flag:'🇳🇴🇩🇰🇫🇮', name:'Scandinavia', rate:'$4.99', free:'$75+', time:'4–7 days' },
        { flag:'🇬🇧🇩🇪🇫🇷', name:'Europe', rate:'$5.99–$6.99', free:'$75+', time:'5–10 days' },
        { flag:'🇺🇬🇰🇪🇹🇿', name:'East Africa', rate:'$4.99', free:'$50+', time:'5–9 days' },
        { flag:'🇳🇬🇬🇭🇿🇦', name:'West/South Africa', rate:'$7.99–$8.99', free:'$75+', time:'7–12 days' },
        { flag:'🇺🇸🇨🇦', name:'North America', rate:'$9.99', free:'$75+', time:'8–14 days' },
        { flag:'🇦🇺', name:'Australia', rate:'$12.99', free:'$100+', time:'10–16 days' },
        { flag:'🇦🇪🇨🇳', name:'Middle East / Asia', rate:'$6.99–$8.99', free:'$75+', time:'8–14 days' },
        { flag:'🌍', name:'Rest of World', rate:'$14.99', free:'$100+', time:'10–18 days' }
    ];
    return '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
        '<thead><tr style="background:#f8f9fa;"><th style="padding:8px 10px;text-align:left;color:#555;font-weight:700;">Region</th><th style="padding:8px 10px;text-align:center;color:#555;font-weight:700;">Rate</th><th style="padding:8px 10px;text-align:center;color:#555;font-weight:700;">Free From</th><th style="padding:8px 10px;text-align:center;color:#555;font-weight:700;">Time</th></tr></thead>' +
        '<tbody>' + regions.map(function(r, i) {
            return '<tr style="border-bottom:1px solid #f5f5f5;background:' + (i%2===0?'#fff':'#fafafa') + ';">' +
                '<td style="padding:8px 10px;">' + r.flag + ' ' + r.name + '</td>' +
                '<td style="padding:8px 10px;text-align:center;font-weight:600;color:#f97316;">' + r.rate + '</td>' +
                '<td style="padding:8px 10px;text-align:center;color:#22c55e;font-weight:600;">' + r.free + '</td>' +
                '<td style="padding:8px 10px;text-align:center;color:#888;">' + r.time + '</td></tr>';
        }).join('') + '</tbody></table>';
}

// ===== RFQ =====
function rfqQuickSelect(product) {
    var input = document.getElementById('rfq-product');
    if (input) input.value = product;
    document.querySelectorAll('.rfq-chip').forEach(function(c) {
        c.classList.toggle('selected', c.textContent.trim() === product);
    });
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
    document.querySelectorAll('.rfq-chip').forEach(function(c) { c.classList.remove('selected'); });
    modal.style.display = 'flex';
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
        if (msg) { msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.'; msg.style.cssText = 'display:block;padding:10px 12px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#fee2e2;color:#991b1b;'; }
        return;
    }
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; btn.disabled = true; }
    if (msg) msg.style.display = 'none';
    var user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    var apiBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:3000/api' : window.location.origin + '/api';
    var fullMessage = 'RFQ: ' + product + ' x' + qty + (budget ? ' | Budget: ' + budget : '') + (details ? ' | Details: ' + details : '');
    try {
        await fetch(apiBase + '/inquiries', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, productName: product, quantity: parseInt(qty)||1, message: fullMessage, userId: user.id || null })
        });
        if (msg) { msg.innerHTML = '<i class="fas fa-check-circle" style="color:#16a34a;margin-right:6px;"></i>Quote request sent! We\'ll reply to <strong>' + email + '</strong> within 24 hours.'; msg.style.cssText = 'display:block;padding:12px 14px;border-radius:7px;font-size:13px;margin-bottom:12px;background:#dcfce7;color:#15803d;'; }
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Sent!'; btn.style.background = '#22c55e'; }
        setTimeout(function() { closeRFQ(); if (btn) { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Quote Request'; btn.disabled = false; btn.style.background = ''; } }, 2200);
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
    localStorage.setItem('jobiLocation', JSON.stringify({ country, zip }));
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
        // Sync avatar in sidebar
        var sidebarAvatarImg = document.getElementById('sidebar-avatar-img');
        var sidebarAvatarIcon = document.getElementById('sidebar-avatar-icon');
        if (user.avatar && sidebarAvatarImg) {
            sidebarAvatarImg.src = user.avatar;
            sidebarAvatarImg.style.display = 'block';
            if (sidebarAvatarIcon) sidebarAvatarIcon.style.display = 'none';
        } else if (sidebarAvatarImg) {
            sidebarAvatarImg.style.display = 'none';
            if (sidebarAvatarIcon) sidebarAvatarIcon.style.display = 'block';
        }
    } else {
        if (loggedOut) loggedOut.style.display = 'block';
        if (loggedIn) loggedIn.style.display = 'none';
    }
}

// ===== PRODUCT DETAIL MODAL =====
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

// ===== PATCH _renderProductCards =====
var _origRenderCards2 = null;
function _patchRenderCards() {
    if (typeof _renderProductCards !== 'function') { setTimeout(_patchRenderCards, 200); return; }
    if (_origRenderCards2) return;
    _origRenderCards2 = _renderProductCards;
    window._renderProductCards = function(products) {
        _origRenderCards2(products);
        document.querySelectorAll('.product-card').forEach(function(card, idx) {
            var p = products[idx];
            if (!p) return;
            var priceEl = card.querySelector('.product-price');
            if (priceEl) priceEl.textContent = convertPrice(p.price);
            card.addEventListener('click', function(e) {
                if (e.target.closest('.add-to-cart-btn') || e.target.closest('.inquiry-btn') || e.target.closest('.heart-btn')) return;
                openProductDetail(p);
            });
        });
    };
}

// ===== PROFILE PHOTO =====
function initAvatarInteraction() {
    var avatarWrap = document.getElementById('ap-avatar-wrap');
    if (avatarWrap && !avatarWrap._avatarInited) {
        avatarWrap._avatarInited = true;
        avatarWrap.style.cursor = 'pointer';
        avatarWrap.title = 'Tap to change profile photo';
        avatarWrap.addEventListener('click', function(e) {
            if (e.target.closest('label')) return;
            var inp = document.getElementById('ap-avatar-input');
            if (inp) inp.click();
        });
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    var display = document.getElementById('currency-display');
    if (display) display.textContent = activeCurrency;
    applyLanguage();
    updateSidebarAuth();
    setTimeout(_patchRenderCards, 100);
    initAvatarInteraction();
    var accountPanel = document.getElementById('account-panel');
    if (accountPanel) {
        var observer = new MutationObserver(function() { initAvatarInteraction(); });
        observer.observe(accountPanel, { attributes: true, attributeFilter: ['class'] });
    }
});
document.addEventListener('productsLoaded', _patchRenderCards);

