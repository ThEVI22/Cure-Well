// ================== pharmacy.html: Add Products to Cart ===================== //
document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const quantity = parseInt(button.previousElementSibling.value);

            if (isNaN(quantity) || quantity <= 0) {
                alert("Please enter a valid quantity.");
                return;
            }

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            const existingProductIndex = cart.findIndex(product => product.name === name);
            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += quantity;
            } else {
                cart.push({ name, price, quantity });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${name} has been added to your cart.`);
        });
    });
});

// ================== cart.html: Display Cart Items ========================== //
document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.getElementById('cart-table-body');
    const totalElement = document.getElementById('cart-total');

    cartTableBody.innerHTML = '';
    let totalCost = 0;

    cart.forEach(product => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;
        row.appendChild(nameCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = `LKR ${product.price.toFixed(2)}`;
        row.appendChild(priceCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = product.quantity;
        row.appendChild(quantityCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = `LKR ${(product.price * product.quantity).toFixed(2)}`;
        row.appendChild(totalCell);

        cartTableBody.appendChild(row);
        totalCost += product.price * product.quantity;
    });

    totalElement.textContent = `Total: LKR ${totalCost.toFixed(2)}`;
});

// ======================= Clear Cart Function =========================== //
function clearCart() {
    localStorage.removeItem('cart');
    window.location.reload();
}

// =================== Redirect to Checkout Page ========================= //
function buyNow() {
    window.location.href = 'checkout.html';
}

// =================== Checkout Page: Calculate Totals =================== //
document.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    let subtotal = 0;

    cartItemsContainer.innerHTML = '';

    cart.forEach(product => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <p>${product.name} (x${product.quantity})</p>
            <p>LKR ${(product.price * product.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(itemDiv);

        subtotal += product.price * product.quantity;
    });

    subtotalElement.textContent = `LKR ${subtotal.toFixed(2)}`;
    totalElement.textContent = `LKR ${subtotal.toFixed(2)}`;
});

// ================= Toggle Credit Card Form ==================== //
function toggleCardForm() {
    const cardDetails = document.getElementById('card-details');
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (paymentMethod === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

// ================ Process Payment and Show Thank-You Message ================= //
function processPayment(event) {
    event.preventDefault();

    // Cart validation: Check if cart is empty
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to payment.");
        return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const city = document.getElementById('city').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name) return alert("Please enter your name.");
    if (!email.match(emailPattern)) return alert("Please enter a valid email.");
    if (!address) return alert("Please enter your address.");
    if (!/^\d{10}$/.test(phone)) return alert("Enter a valid 10-digit phone number.");
    if (!city) return alert("Please enter your city.");

    if (paymentMethod.value === 'card') {
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();

        if (!/^\d{16}$/.test(cardNumber)) return alert("Invalid card number.");
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) return alert("Invalid expiry date.");
        if (!/^\d{3}$/.test(cvv)) return alert("Invalid CVV.");
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const thankYouMessage = document.getElementById('thank-you-message');
    thankYouMessage.innerHTML = `
        <p>Thank you, ${name}!</p>
        <p>Your order will be delivered to <strong>${address}, ${city}</strong> by <strong>${deliveryDate.toLocaleDateString()}</strong>.</p>
    `;
    thankYouMessage.classList.add('show');

    localStorage.removeItem('cart');
    document.getElementById('checkout-form').reset();
    document.getElementById('cart-items').innerHTML = '';
}


// ===================== Save to Favourite Orders ======================= //
function saveToFavourites() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        city: document.getElementById('city').value.trim(),
        cart: cart
    };

    localStorage.setItem('favouriteOrder', JSON.stringify(formData));
    alert("Order saved as favourite.");
}

// ===================== Apply Favourite Orders ========================= //
function applyFavourites() {
    const favouriteOrder = JSON.parse(localStorage.getItem('favouriteOrder'));
    if (!favouriteOrder) return alert("No favourite order found.");

    document.getElementById('name').value = favouriteOrder.name;
    document.getElementById('email').value = favouriteOrder.email;
    document.getElementById('address').value = favouriteOrder.address;
    document.getElementById('phone').value = favouriteOrder.phone;
    document.getElementById('city').value = favouriteOrder.city;

    localStorage.setItem('cart', JSON.stringify(favouriteOrder.cart));
    window.location.reload();
}

// =================== Close Thank-You Message =========================== //
function closeMessage() {
    const thankYouMessage = document.getElementById('thank-you-message');
    thankYouMessage.classList.remove('show');
}
