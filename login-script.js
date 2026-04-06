// API Configuration
const API_BASE_URL = '/api';

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('toggle-link');
const loadingOverlay = document.getElementById('loading-overlay');
const successMessage = document.getElementById('success-message');

// State
let isLoginMode = true;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkExistingAuth();
});

function initializeEventListeners() {
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Form toggle
    toggleLink.addEventListener('click', toggleForm);
    
    // Password visibility toggles
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', togglePasswordVisibility);
    });
    
    // Social login buttons (placeholder functionality)
    document.querySelectorAll('.social-btn').forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });
    
    // Input animations
    document.querySelectorAll('.input-group input').forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
        input.addEventListener('input', handleInputChange);
    });
    
    // Add fade-in animation to form container
    document.querySelector('.form-container').classList.add('fade-in');
}

// Check if user is already authenticated
function checkExistingAuth() {
    const token = localStorage.getItem('jobiToken');
    if (token) {
        showSuccessMessage('Already logged in!', 'Redirecting to store...');
        setTimeout(() => {
            window.location.href = 'alibaba-style.html';
        }, 1500);
    }
}

// API Helper Function
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

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

// Form Handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    // Validate inputs
    if (!validateEmail(email)) {
        showError(e.target.querySelector('input[type="email"]'), 'Please enter a valid email address');
        return;
    }
    
    if (!password || password.length < 6) {
        showError(e.target.querySelector('input[type="password"]'), 'Password must be at least 6 characters');
        return;
    }
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<div class="spinner"></div><span>Signing In...</span>';
        submitBtn.disabled = true;
        showLoading('Signing you in...');
        
        // Make API call
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        // Store authentication data
        localStorage.setItem('jobiToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        sessionStorage.setItem('justLoggedIn', 'true');
        
        // Show success and redirect
        hideLoading();
        showSuccessMessage('Welcome back!', 'Redirecting to store...');
        
        setTimeout(() => {
            window.location.href = 'alibaba-style.html';
        }, 2000);
        
    } catch (error) {
        hideLoading();
        const msg = error.message || 'Login failed. Please check your credentials.';
        showError(e.target.querySelector('input[type="email"]'), msg);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const inputs = e.target.querySelectorAll('input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;
    
    // Validate inputs
    if (!name || name.length < 2) {
        showError(inputs[0], 'Name must be at least 2 characters');
        return;
    }
    
    if (!validateEmail(email)) {
        showError(inputs[1], 'Please enter a valid email address');
        return;
    }
    
    if (!password || password.length < 6) {
        showError(inputs[2], 'Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(inputs[3], 'Passwords do not match');
        return;
    }
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.innerHTML = '<div class="spinner"></div><span>Creating Account...</span>';
        submitBtn.disabled = true;
        showLoading('Creating your account...');
        
        // Make API call
        const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        
        // Store authentication data
        localStorage.setItem('jobiToken', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        sessionStorage.setItem('justLoggedIn', 'true');
        
        // Show success and redirect
        hideLoading();
        showSuccessMessage('Account created successfully!', 'Welcome to Jobijad Express!');
        
        setTimeout(() => {
            window.location.href = 'alibaba-style.html';
        }, 2000);
        
    } catch (error) {
        hideLoading();
        showError(inputs[1], error.message);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Form Toggle
function toggleForm(e) {
    e.preventDefault();
    
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        // Switch to login
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Sign in to your account to continue shopping';
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-link">Sign up</a>';
    } else {
        // Switch to register
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Join Jobijad Express and discover authentic African fashion';
        toggleText.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Sign in</a>';
    }
    
    // Re-attach event listener to new toggle link
    document.getElementById('toggle-link').addEventListener('click', toggleForm);
    
    // Add animation
    document.querySelector('.auth-form.active').classList.add('slide-in-right');
    setTimeout(() => {
        document.querySelector('.auth-form.active').classList.remove('slide-in-right');
    }, 500);
}

// Password Visibility Toggle
function togglePasswordVisibility(e) {
    const input = e.target.closest('.input-group').querySelector('input');
    const icon = e.target.querySelector('i') || e.target;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Social Login (Placeholder)
function handleSocialLogin(e) {
    const provider = e.target.closest('.social-btn').classList.contains('google') ? 'Google' : 'Facebook';
    alert(`${provider} login is not implemented yet. This would integrate with ${provider} OAuth.`);
}

// Input Handlers
function handleInputFocus(e) {
    const inputGroup = e.target.closest('.input-group');
    inputGroup.classList.add('focused');
    clearError(e.target);
}

function handleInputBlur(e) {
    const inputGroup = e.target.closest('.input-group');
    if (!e.target.value) {
        inputGroup.classList.remove('focused');
    }
}

function handleInputChange(e) {
    clearError(e.target);
    
    // Real-time validation
    if (e.target.type === 'email' && e.target.value) {
        if (!validateEmail(e.target.value)) {
            showError(e.target, 'Please enter a valid email address');
        }
    }
    
    if (e.target.type === 'password' && e.target.value) {
        if (e.target.value.length < 6) {
            showError(e.target, 'Password must be at least 6 characters');
        }
    }
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input, message) {
    const inputGroup = input.closest('.input-group');
    inputGroup.classList.add('error');
    
    let errorElement = inputGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        inputGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.focus();
}

function clearError(input) {
    const inputGroup = input.closest('.input-group');
    inputGroup.classList.remove('error');
    
    const errorElement = inputGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function showLoading(message = 'Loading...') {
    loadingOverlay.style.display = 'flex';
    loadingOverlay.querySelector('p').textContent = message;
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showSuccessMessage(title, subtitle) {
    const successContent = successMessage.querySelector('.success-content');
    successContent.querySelector('h3').textContent = title;
    successContent.querySelector('p').textContent = subtitle;
    successMessage.style.display = 'flex';
}

// Add some interactive animations
document.addEventListener('mousemove', function(e) {
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        const rect = heroImage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = (y / rect.height) * 10;
        const rotateY = (x / rect.width) * -10;
        
        heroImage.style.transform = `rotate(-5deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Reset hero image transform when mouse leaves
document.addEventListener('mouseleave', function() {
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.style.transform = 'rotate(-5deg)';
    }
});

// Add floating animation to features
document.querySelectorAll('.feature').forEach((feature, index) => {
    feature.style.animationDelay = `${index * 0.2}s`;
    feature.classList.add('fade-in');
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        const form = e.target.closest('form');
        if (form) {
            const inputs = Array.from(form.querySelectorAll('input[required]'));
            const currentIndex = inputs.indexOf(e.target);
            
            if (currentIndex < inputs.length - 1) {
                e.preventDefault();
                inputs[currentIndex + 1].focus();
            }
        }
    }
});