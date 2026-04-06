// API Configuration
const API_BASE_URL = '/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Shopping Cart Functionality
let cart = [];
let cartTotal = 0;

// DOM Elements
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const closeModal = document.querySelector('.close');

// Product filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateCartDisplay();
});

function initializeEventListeners() {
    // Cart modal events
    cartIcon.addEventListener('click', openCartModal);
    closeModal.addEventListener('click', closeCartModal);
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = parseFloat(this.dataset.price);
            addToCart(productId, productName, productPrice);
        });
    });

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterProducts(filter);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        subscribeNewsletter(email);
    });

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm(this);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .category-card, .feature').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Cart Functions
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
            image: getProductImage(id)
        });
    }
    
    updateCartDisplay();
    showAddToCartFeedback();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart total
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = cartTotal.toFixed(2);
    
    // Update cart items display
    renderCartItems();
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getProductImage(id) {
    const productImages = {
        '1': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&fit=crop',
        '2': 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop',
        '3': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
        '4': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        '5': 'https://images.unsplash.com/photo-1506629905607-c28b47d3e6b0?w=400&h=500&fit=crop',
        '6': 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400&h=500&fit=crop',
        '7': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
        '8': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop'
    };
    return productImages[id] || 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&fit=crop';
}

function openCartModal() {
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showAddToCartFeedback() {
    // Create and show a temporary notification
    const notification = document.createElement('div');
    notification.textContent = 'Item added to cart!';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d4af37;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Product Filtering
function filterProducts(filter) {
    productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Newsletter Subscription
function subscribeNewsletter(email) {
    // Simulate API call
    const button = document.querySelector('.newsletter-form button');
    const originalText = button.textContent;
    
    button.innerHTML = '<div class="loading"></div>';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = 'Subscribed!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#333';
            button.disabled = false;
            document.querySelector('.newsletter-form input').value = '';
        }, 2000);
    }, 1500);
}

// Contact Form Submission
function submitContactForm(form) {
    const button = form.querySelector('button');
    const originalText = button.textContent;
    
    button.innerHTML = '<div class="loading"></div>';
    button.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        button.textContent = 'Message Sent!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#d4af37';
            button.disabled = false;
            form.reset();
        }, 2000);
    }, 1500);
}

// Checkout Process
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('checkout-btn')) {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        if (!authToken) {
            showLoginPrompt();
            return;
        }
        
        showCheckoutModal();
    }
});

function showCheckoutModal() {
    if (!document.getElementById('checkout-modal')) {
        createCheckoutModal();
    }
    document.getElementById('checkout-modal').style.display = 'block';
    closeCartModal();
}

function createCheckoutModal() {
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'modal checkout-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Checkout</h3>
                <span class="close" onclick="closeCheckoutModal()">&times;</span>
            </div>
            <form id="checkout-form" class="checkout-form">
                <div class="form-section">
                    <h4>Shipping Address</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Full Name *</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" name="phone">
                        </div>
                    </div>
                    <div class="form-row full">
                        <div class="form-group">
                            <label>Street Address *</label>
                            <input type="text" name="street" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>City *</label>
                            <input type="text" name="city" required>
                        </div>
                        <div class="form-group">
                            <label>State *</label>
                            <input type="text" name="state" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>ZIP Code *</label>
                            <input type="text" name="zipCode" required>
                        </div>
                        <div class="form-group">
                            <label>Country *</label>
                            <input type="text" name="country" value="USA" required>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>Payment Method</h4>
                    <div class="payment-methods">
                        <div class="payment-method selected" data-method="credit_card">
                            <i class="fas fa-credit-card"></i>
                            Credit Card
                        </div>
                        <div class="payment-method" data-method="paypal">
                            <i class="fab fa-paypal"></i>
                            PayPal
                        </div>
                        <div class="payment-method" data-method="bank_transfer">
                            <i class="fas fa-university"></i>
                            Bank Transfer
                        </div>
                    </div>
                </div>
                
                <div class="order-summary">
                    <h4>Order Summary</h4>
                    <div id="checkout-items"></div>
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span id="checkout-subtotal">$0.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span id="checkout-shipping">$0.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax:</span>
                        <span id="checkout-tax">$0.00</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span id="checkout-total">$0.00</span>
                    </div>
                </div>
                
                <button type="submit" class="checkout-submit-btn">Place Order</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
    
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    updateCheckoutSummary();
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 75 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;

    const itemsContainer = document.getElementById('checkout-items');
    itemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}

async function handleCheckout(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const button = form.querySelector('.checkout-submit-btn');

    button.disabled = true;
    button.textContent = 'Processing...';

    try {
        const shippingAddress = {
            name: formData.get('name'),
            street: formData.get('street'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            country: formData.get('country'),
            phone: formData.get('phone')
        };

        const paymentMethod = document.querySelector('.payment-method.selected').dataset.method;

        const orderData = {
            shippingAddress,
            paymentMethod
        };

        const result = await createOrder(orderData);
        
        closeCheckoutModal();
        alert(`Order placed successfully! Order number: ${result.order.orderNumber}`);
        
    } catch (error) {
        alert('Order failed: ' + error.message);
    } finally {
        button.disabled = false;
        button.textContent = 'Place Order';
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 1rem;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);
// API Helper Functions
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication Functions
async function login(email, password) {
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        updateAuthUI();
        await loadUserCart();
        
        return data;
    } catch (error) {
        throw error;
    }
}

async function register(userData) {
    try {
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        updateAuthUI();
        await loadUserCart();
        
        return data;
    } catch (error) {
        throw error;
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    cart = [];
    updateAuthUI();
    updateCartDisplay();
}

// Product Functions
async function loadProducts(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const data = await apiCall(`/products?${queryParams}`);
        return data;
    } catch (error) {
        console.error('Error loading products:', error);
        return { products: [], pagination: {} };
    }
}

// Cart Functions (API Integration)
async function loadUserCart() {
    if (!authToken) return;

    try {
        const data = await apiCall('/cart');
        cart = data.items.map(item => ({
            id: item._id,
            productId: item.product._id,
            name: item.product.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.product.images[0]?.url || getProductImage(item.product._id)
        }));
        updateCartDisplay();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

async function addToCartAPI(productId, quantity = 1, size = null, color = null) {
    if (!authToken) {
        showLoginPrompt();
        return;
    }

    try {
        const data = await apiCall('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity, size, color })
        });

        await loadUserCart();
        showAddToCartFeedback();
        return data;
    } catch (error) {
        alert('Error adding item to cart: ' + error.message);
        throw error;
    }
}

async function updateCartItemAPI(itemId, quantity) {
    if (!authToken) return;

    try {
        const data = await apiCall(`/cart/update/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });

        await loadUserCart();
        return data;
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
}

async function removeFromCartAPI(itemId) {
    if (!authToken) return;

    try {
        const data = await apiCall(`/cart/remove/${itemId}`, {
            method: 'DELETE'
        });

        await loadUserCart();
        return data;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}

// Order Functions
async function createOrder(orderData) {
    if (!authToken) {
        showLoginPrompt();
        return;
    }

    try {
        const data = await apiCall('/orders/create', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });

        cart = [];
        updateCartDisplay();
        return data;
    } catch (error) {
        throw error;
    }
}

async function getUserOrders() {
    if (!authToken) return [];

    try {
        const data = await apiCall('/orders/my-orders');
        return data.orders;
    } catch (error) {
        console.error('Error loading orders:', error);
        return [];
    }
}

// UI Update Functions
function updateAuthUI() {
    const userLink = document.querySelector('.user-link');
    const userIcon = userLink ? userLink.querySelector('.fa-user') : document.querySelector('.fa-user');

    if (currentUser) {
        // User is logged in - replace user link with user menu
        if (userLink && !document.querySelector('.user-menu')) {
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <span class="user-name">
                    <i class="fas fa-user"></i>
                    Hi, ${currentUser.name.split(' ')[0]}
                </span>
                <div class="user-dropdown">
                    <a href="#" onclick="showProfile()">
                        <i class="fas fa-user-circle"></i>
                        My Profile
                    </a>
                    <a href="#" onclick="showOrders()">
                        <i class="fas fa-shopping-bag"></i>
                        My Orders
                    </a>
                    <a href="#" onclick="showAccount()">
                        <i class="fas fa-cog"></i>
                        Account Settings
                    </a>
                    <a href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </a>
                </div>
            `;
            userLink.parentNode.replaceChild(userMenu, userLink);
        }
    } else {
        // User is not logged in - ensure login link is present
        if (document.querySelector('.user-menu')) {
            const loginLink = document.createElement('a');
            loginLink.href = 'login.html';
            loginLink.className = 'user-link';
            loginLink.innerHTML = '<i class="fas fa-user"></i>';
            document.querySelector('.user-menu').parentNode.replaceChild(loginLink, document.querySelector('.user-menu'));
        }
    }
}

function showLoginPrompt() {
    if (confirm('Please log in to add items to cart. Would you like to log in now?')) {
        showLoginModal();
    }
}

function showLoginModal() {
    // Create login modal if it doesn't exist
    if (!document.getElementById('login-modal')) {
        createLoginModal();
    }
    document.getElementById('login-modal').style.display = 'block';
}

function createLoginModal() {
    const modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Login / Register</h3>
                <span class="close" onclick="closeLoginModal()">&times;</span>
            </div>
            <div class="auth-forms">
                <div class="auth-tabs">
                    <button class="auth-tab active" onclick="showLoginForm()">Login</button>
                    <button class="auth-tab" onclick="showRegisterForm()">Register</button>
                </div>
                
                <form id="login-form" class="auth-form">
                    <input type="email" placeholder="Email" required>
                    <input type="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
                
                <form id="register-form" class="auth-form" style="display: none;">
                    <input type="text" placeholder="Full Name" required>
                    <input type="email" placeholder="Email" required>
                    <input type="password" placeholder="Password" required>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add event listeners
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const button = form.querySelector('button');

    button.disabled = true;
    button.textContent = 'Logging in...';

    try {
        await login(email, password);
        closeLoginModal();
        alert('Login successful!');
    } catch (error) {
        alert('Login failed: ' + error.message);
    } finally {
        button.disabled = false;
        button.textContent = 'Login';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const button = form.querySelector('button');

    button.disabled = true;
    button.textContent = 'Registering...';

    try {
        await register({ name, email, password });
        closeLoginModal();
        alert('Registration successful!');
    } catch (error) {
        alert('Registration failed: ' + error.message);
    } finally {
        button.disabled = false;
        button.textContent = 'Register';
    }
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && authToken) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
        loadUserCart();
        
        // Show welcome message if user just logged in
        const justLoggedIn = sessionStorage.getItem('justLoggedIn');
        if (justLoggedIn) {
            showWelcomeMessage(currentUser.name);
            sessionStorage.removeItem('justLoggedIn');
        }
    }
});

// Show welcome message for new logins
function showWelcomeMessage(userName) {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
        <h3>Welcome back, ${userName}!</h3>
        <p>Ready to discover amazing African fashion?</p>
    `;
    
    document.body.insertBefore(welcomeDiv, document.body.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        welcomeDiv.style.animation = 'welcomeSlide 0.5s ease reverse';
        setTimeout(() => welcomeDiv.remove(), 500);
    }, 5000);
}

// Update the existing addToCart function to use API
function addToCart(id, name, price) {
    if (authToken) {
        addToCartAPI(id, 1);
    } else {
        // Fallback to local cart for non-authenticated users
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1,
                image: getProductImage(id)
            });
        }
        
        updateCartDisplay();
        showAddToCartFeedback();
    }
}// User Menu Functions
function showProfile() {
    alert('Profile page would be implemented here. This would show user details, edit profile, etc.');
}

function showOrders() {
    if (!authToken) {
        showLoginPrompt();
        return;
    }
    
    // Create orders modal
    createOrdersModal();
}

function showAccount() {
    alert('Account settings would be implemented here. This would allow users to change password, preferences, etc.');
}

async function createOrdersModal() {
    const modal = document.createElement('div');
    modal.id = 'orders-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>My Orders</h3>
                <span class="close" onclick="closeOrdersModal()">&times;</span>
            </div>
            <div class="orders-content">
                <div class="loading-orders">
                    <div class="spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    try {
        const orders = await getUserOrders();
        displayOrders(orders);
    } catch (error) {
        document.querySelector('.orders-content').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load orders. Please try again.</p>
            </div>
        `;
    }
}

function displayOrders(orders) {
    const ordersContent = document.querySelector('.orders-content');
    
    if (orders.length === 0) {
        ordersContent.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-shopping-bag"></i>
                <h4>No orders yet</h4>
                <p>Start shopping to see your orders here!</p>
                <button onclick="closeOrdersModal()" class="shop-now-btn">Start Shopping</button>
            </div>
        `;
        return;
    }
    
    ordersContent.innerHTML = `
        <div class="orders-list">
            ${orders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <div class="order-number">Order #${order.orderNumber}</div>
                        <div class="order-status status-${order.orderStatus}">${order.orderStatus.toUpperCase()}</div>
                    </div>
                    <div class="order-details">
                        <div class="order-date">Placed on ${new Date(order.createdAt).toLocaleDateString()}</div>
                        <div class="order-total">Total: $${order.total.toFixed(2)}</div>
                    </div>
                    <div class="order-items">
                        ${order.items.slice(0, 3).map(item => `
                            <div class="order-item-preview">
                                <img src="${item.image || 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=100&fit=crop'}" alt="${item.name}">
                                <span>${item.name} x${item.quantity}</span>
                            </div>
                        `).join('')}
                        ${order.items.length > 3 ? `<div class="more-items">+${order.items.length - 3} more items</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function closeOrdersModal() {
    const modal = document.getElementById('orders-modal');
    if (modal) {
        modal.remove();
    }
}

// Update the existing addToCart function to use API when authenticated
function addToCart(id, name, price) {
    if (authToken) {
        addToCartAPI(id, 1);
    } else {
        // Fallback to local cart for non-authenticated users
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1,
                image: getProductImage(id)
            });
        }
        
        updateCartDisplay();
        showAddToCartFeedback();
    }
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && authToken) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
        loadUserCart();
        
        // Show welcome message if user just logged in
        const justLoggedIn = sessionStorage.getItem('justLoggedIn');
        if (justLoggedIn) {
            showWelcomeMessage(currentUser.name);
            sessionStorage.removeItem('justLoggedIn');
        }
    }
});

// Show welcome message for new logins
function showWelcomeMessage(userName) {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
        <h3>Welcome back, ${userName}!</h3>
        <p>Ready to discover amazing African fashion?</p>
    `;
    
    document.body.insertBefore(welcomeDiv, document.body.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        welcomeDiv.style.animation = 'welcomeSlide 0.5s ease reverse';
        setTimeout(() => welcomeDiv.remove(), 500);
    }, 5000);
}// Enhanced Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancedFeatures();
});

function initializeEnhancedFeatures() {
    // Add scroll reveal animations
    initializeScrollReveal();
    
    // Add ripple effects to buttons
    addRippleEffects();
    
    // Add parallax scrolling
    initializeParallax();
    
    // Add smooth page transitions
    initializePageTransitions();
    
    // Add enhanced cart animations
    enhanceCartAnimations();
    
    // Add product quick view
    initializeQuickView();
    
    // Add search functionality
    initializeSearch();
    
    // Add wishlist functionality
    initializeWishlist();
}

// Scroll Reveal Animation
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Add scroll reveal to elements
    document.querySelectorAll('.product-card, .category-card, .feature, .about-text, .contact-item').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// Ripple Effect for Buttons
function addRippleEffects() {
    document.querySelectorAll('.cta-button, .checkout-btn, .submit-btn, .add-to-cart').forEach(button => {
        button.classList.add('ripple');
    });
}

// Parallax Scrolling Effect
function initializeParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-image img');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Enhanced Cart Animations
function enhanceCartAnimations() {
    const originalAddToCart = window.addToCart;
    
    window.addToCart = function(id, name, price) {
        // Add flying animation
        const button = event.target;
        const cartIcon = document.querySelector('.cart-icon');
        
        // Create flying element
        const flyingItem = document.createElement('div');
        flyingItem.className = 'flying-item';
        flyingItem.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        
        const buttonRect = button.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        
        flyingItem.style.cssText = `
            position: fixed;
            left: ${buttonRect.left}px;
            top: ${buttonRect.top}px;
            z-index: 9999;
            color: #d4af37;
            font-size: 1.5rem;
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(flyingItem);
        
        // Animate to cart
        setTimeout(() => {
            flyingItem.style.left = cartRect.left + 'px';
            flyingItem.style.top = cartRect.top + 'px';
            flyingItem.style.transform = 'scale(0)';
            flyingItem.style.opacity = '0';
        }, 100);
        
        // Remove element and call original function
        setTimeout(() => {
            flyingItem.remove();
            cartIcon.style.animation = 'bounce 0.5s ease';
            setTimeout(() => cartIcon.style.animation = '', 500);
        }, 900);
        
        // Call original function
        originalAddToCart.call(this, id, name, price);
    };
}

// Quick View Modal
function initializeQuickView() {
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            const productDescription = productCard.querySelector('.product-description').textContent;
            
            showQuickViewModal(productName, productPrice, productImage, productDescription);
        });
    });
}

function showQuickViewModal(name, price, image, description) {
    const modal = document.createElement('div');
    modal.className = 'modal quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content quick-view-content">
            <span class="close">&times;</span>
            <div class="quick-view-body">
                <div class="quick-view-image">
                    <img src="${image}" alt="${name}">
                </div>
                <div class="quick-view-details">
                    <h2>${name}</h2>
                    <div class="price">${price}</div>
                    <p>${description}</p>
                    <div class="size-selector">
                        <label>Size:</label>
                        <select>
                            <option>XS</option>
                            <option>S</option>
                            <option selected>M</option>
                            <option>L</option>
                            <option>XL</option>
                        </select>
                    </div>
                    <div class="color-selector">
                        <label>Color:</label>
                        <div class="color-options">
                            <div class="color-option" style="background: #ff6b6b"></div>
                            <div class="color-option" style="background: #4ecdc4"></div>
                            <div class="color-option selected" style="background: #45b7d1"></div>
                            <div class="color-option" style="background: #f9ca24"></div>
                        </div>
                    </div>
                    <button class="add-to-cart-quick">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Close modal functionality
    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Color selection
    modal.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            modal.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Enhanced Search Functionality
function initializeSearch() {
    const searchIcon = document.querySelector('.fa-search');
    
    searchIcon.addEventListener('click', function() {
        showSearchModal();
    });
}

function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'modal search-modal';
    modal.innerHTML = `
        <div class="modal-content search-content">
            <span class="close">&times;</span>
            <div class="search-header">
                <h3>Search Products</h3>
                <div class="search-box">
                    <input type="text" placeholder="Search for African fashion..." id="search-input">
                    <button id="search-btn"><i class="fas fa-search"></i></button>
                </div>
            </div>
            <div class="search-results" id="search-results">
                <div class="search-suggestions">
                    <h4>Popular Searches</h4>
                    <div class="suggestion-tags">
                        <span class="tag">Kitenge Dress</span>
                        <span class="tag">Ankara Top</span>
                        <span class="tag">Dashiki</span>
                        <span class="tag">African Jewelry</span>
                        <span class="tag">Traditional Wear</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Focus on search input
    modal.querySelector('#search-input').focus();
    
    // Close modal functionality
    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Search functionality
    const searchInput = modal.querySelector('#search-input');
    const searchBtn = modal.querySelector('#search-btn');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase();
        if (query.length > 0) {
            // Simulate search results
            displaySearchResults(query);
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Tag click functionality
    modal.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            searchInput.value = this.textContent;
            performSearch();
        });
    });
}

function displaySearchResults(query) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = `
        <div class="search-results-header">
            <h4>Search Results for "${query}"</h4>
        </div>
        <div class="search-results-grid">
            <div class="search-result-item">
                <img src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=100&h=100&fit=crop" alt="Product">
                <div class="result-details">
                    <h5>Elegant Kitenge Dress</h5>
                    <p>$89.99</p>
                </div>
            </div>
            <div class="search-result-item">
                <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=100&h=100&fit=crop" alt="Product">
                <div class="result-details">
                    <h5>Ankara Print Top</h5>
                    <p>$45.99</p>
                </div>
            </div>
        </div>
    `;
}

// Wishlist Functionality
function initializeWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Add wishlist icons to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'wishlist-btn';
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
        
        const productId = card.querySelector('.add-to-cart').dataset.id;
        
        if (wishlist.includes(productId)) {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleWishlist(productId, this);
        });
        
        card.querySelector('.product-overlay').appendChild(wishlistBtn);
    });
    
    function toggleWishlist(productId, button) {
        if (wishlist.includes(productId)) {
            wishlist = wishlist.filter(id => id !== productId);
            button.classList.remove('active');
            button.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            wishlist.push(productId);
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Add animation
        button.style.animation = 'heartBeat 0.5s ease';
        setTimeout(() => button.style.animation = '', 500);
    }
}

// Page Transition Effects
function initializePageTransitions() {
    // Add fade-in effect to page load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
}

// Add bounce animation keyframes
const bounceKeyframes = `
    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
        40%, 43% { transform: translate3d(0,-30px,0); }
        70% { transform: translate3d(0,-15px,0); }
        90% { transform: translate3d(0,-4px,0); }
    }
    
    @keyframes heartBeat {
        0% { transform: scale(1); }
        14% { transform: scale(1.3); }
        28% { transform: scale(1); }
        42% { transform: scale(1.3); }
        70% { transform: scale(1); }
    }
`;

// Add keyframes to document
const styleSheet = document.createElement('style');
styleSheet.textContent = bounceKeyframes;
document.head.appendChild(styleSheet);