
// 1. SMOOTH SCROLLING FOR NAVIGATION LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// 2. MOBILE HAMBURGER MENU
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// 3. ACTIVE NAVIGATION HIGHLIGHTING
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.style.color = '#b17457ff';
            link.style.fontWeight = 'bold';
        } else {
            link.style.color = '#333';
            link.style.fontWeight = 'normal';
        }
    });
}
setActiveNavLink();

// 4. BACK TO TOP BUTTON
const backToTopBtn = document.createElement('button');
backToTopBtn.id = 'backToTop';
backToTopBtn.innerHTML = '↑ Top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: #b17457ff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(177, 123, 87, 0.3);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'flex';
        backToTopBtn.style.alignItems = 'center';
        backToTopBtn.style.justifyContent = 'center';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

backToTopBtn.addEventListener('mouseover', () => {
    backToTopBtn.style.backgroundColor = '#a0634e';
    backToTopBtn.style.transform = 'scale(1.1)';
});

backToTopBtn.addEventListener('mouseout', () => {
    backToTopBtn.style.backgroundColor = '#b17457ff';
    backToTopBtn.style.transform = 'scale(1)';
});

// 5. PRODUCT CARD ANIMATIONS
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// 6. FORM VALIDATION
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const messageInput = contactForm.querySelector('#message');
        
        let isValid = true;
        
        // Validate name
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else {
            removeError(nameInput);
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        // Validate message
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, 'Message should be at least 10 characters');
            isValid = false;
        } else {
            removeError(messageInput);
        }
        
        if (isValid) {
            showSuccessMessage('Message sent successfully! We will get back to you soon.');
            contactForm.reset();
        }
    });
}

function showError(input, message) {
    removeError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #d32f2f;
        font-size: 12px;
        margin-top: 5px;
        margin-bottom: 10px;
    `;
    errorDiv.textContent = message;
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
    input.style.borderColor = '#d32f2f';
}

function removeError(input) {
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.style.borderColor = '#ddd';
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        background-color: #4caf50;
        color: white;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    contactForm.parentNode.insertBefore(successDiv, contactForm);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// 7. SHOPPING CART FUNCTIONALITY
let cart = JSON.parse(localStorage.getItem('yeti-cart')) || [];

function addToCart(productName, price) {
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    
    localStorage.setItem('yeti-cart', JSON.stringify(cart));
    updateCartCount();
    showCartNotification(productName);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcon = document.querySelector('.cart');
    
    let badge = cartIcon.querySelector('.cart-badge');
    if (!badge && totalItems > 0) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #b17457ff;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        `;
        cartIcon.appendChild(badge);
    }
    
    if (badge) {
        badge.textContent = totalItems;
        if (totalItems === 0) badge.remove();
    }
}

function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #b17457ff;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(177, 123, 87, 0.3);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = `${productName} added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <p>Your cart is empty</p>
                <a href="products.html" class="shop-now-btn">Shop Now</a>
            </div>
        `;
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }
    
    document.getElementById('cart-summary').style.display = 'block';
    
    
    const imageMap = {
        'Black T-Shirt': './src/images/b_shirt.png',
        'White T-Shirt': './src/images/w_shirt.png',
        'Training T-Shirt': './src/images/training_shirt.png',
        'Yeti Exclusive Bag': './src/images/bag.png',
        'Yeti Hat': './src/images/hat.png',
        'Yeti Cup': './src/images/cup.png'
    };
    
    let cartHTML = '<div class="cart-items-list">';
    
    cart.forEach((item, index) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        
        const imgSrc = imageMap[item.name] || './src/images/eyeslogo.png';
        
        cartHTML += `
            <div class="cart-item">
                <img src="${imgSrc}" alt="${item.name}" class="cart-item-image">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="decreaseQuantity(${index})">−</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                    <button class="qty-btn" onclick="increaseQuantity(${index})">+</button>
                </div>
                <div class="item-total">
                    <p>$${itemTotal}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });
    
    cartHTML += '</div>';
    cartItemsContainer.innerHTML = cartHTML;
    updateCartTotal();
}

function increaseQuantity(index) {
    cart[index].quantity++;
    localStorage.setItem('yeti-cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('yeti-cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    }
}

function updateQuantity(index, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
        cart[index].quantity = quantity;
        localStorage.setItem('yeti-cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    }
}

function removeFromCart(index) {
    const removedItem = cart[index].name;
    cart.splice(index, 1);
    localStorage.setItem('yeti-cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #d32f2f;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(211, 47, 47, 0.3);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = `${removedItem} removed from cart`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
}

function emptyCart() {
    if (confirm('Are you sure you want to empty your cart?')) {
        cart = [];
        localStorage.setItem('yeti-cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #ff9800;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = 'Cart emptied';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Set up cart page event listeners
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    
    const emptyCartBtn = document.getElementById('empty-cart-btn');
    if (emptyCartBtn) {
        emptyCartBtn.addEventListener('click', emptyCart);
    }
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Thank you for your order! This is a demo checkout.');
            cart = [];
            localStorage.setItem('yeti-cart', JSON.stringify(cart));
            updateCartCount();
            displayCartItems();
        });
    }
});

// Add "Add to Cart" buttons to product cards
document.querySelectorAll('.product-card').forEach(card => {
    const h3 = card.querySelector('h3');
    const priceText = card.querySelector('p').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    const productName = h3.textContent;
    
    const button = document.createElement('button');
    button.textContent = 'Add to Cart';
    button.style.cssText = `
        background-color: #b17457ff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        width: 100%;
        margin-top: 10px;
    `;
    
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#a0634e';
        button.style.transform = 'scale(1.02)';
    });
    
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#b17457ff';
        button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('click', () => addToCart(productName, price));
    card.appendChild(button);
});

// Initialize cart count on page load
updateCartCount();

// 8. SCROLL ANIMATIONS WITH CSS KEYFRAMES
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
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// 9. CONTACT METHOD CARDS HOVER EFFECT
document.querySelectorAll('.contact-method-card').forEach(card => {
    card.style.transition = 'all 0.3s ease';
    
    card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 16px rgba(177, 123, 87, 0.2)';
        card.style.borderLeft = '4px solid #b17457ff';
    });
    
    card.addEventListener('mouseout', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'none';
        card.style.borderLeft = 'none';
    });
});

// 10. PAGE LOAD ANIMATION
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('YETI Website - JavaScript loaded successfully!');
