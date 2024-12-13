// pharmacy.html: Add products to cart and save to localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for all Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const quantity = parseInt(button.previousElementSibling.value);

            // Get the current cart from localStorage (if any)
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if product already exists in cart
            const existingProductIndex = cart.findIndex(product => product.name === name);
            if (existingProductIndex > -1) {
                // Update quantity of existing product
                cart[existingProductIndex].quantity += quantity;
            } else {
                // Add new product to the cart
                cart.push({ name, price, quantity });
            }

            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Optionally, show a message or alert
            alert(`${name} has been added to your cart.`);
        });
    });
});

// cart.html: Display the cart items in a table
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Select the cart table body
    const cartTableBody = document.getElementById('cart-table-body');
    
    // Clear any existing rows in the cart table
    cartTableBody.innerHTML = '';

    // Loop through cart items and add them to the table
    cart.forEach(product => {
        const row = document.createElement('tr');

        // Create table cells for each product property
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

        // Append the row to the table
        cartTableBody.appendChild(row);
    });

    // Calculate total cost
    const totalCost = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    document.getElementById('cart-total').textContent = `Total: LKR ${totalCost.toFixed(2)}`;
});

// Optional: Clear Cart function for clearing the cart from localStorage
function clearCart() {
    localStorage.removeItem('cart');
    window.location.reload(); // Refresh the page to see the empty cart
}
// JavaScript Function to Navigate to Checkout Page
function buyNow() {
    // Redirect to checkout page where user can enter their order details
    window.location.href = 'checkout.html';  // You can adjust the URL as needed
}

//CREDIT CARD INFO

function toggleCardForm() {
    const cardDetails = document.getElementById('card-details');
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (paymentMethod === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}


//==============================Calculating the Cart total and make it show in the checkout section===================//

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Select the container and total elements
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    // Clear any existing items in the cart items container
    cartItemsContainer.innerHTML = '';

    let subtotal = 0;


    // Loop through cart items and add them to the cart summary
    cart.forEach(product => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <p>${product.name} (x${product.quantity})</p>
            <p>LKR ${(product.price * product.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(itemDiv);

        // Calculate the subtotal
        subtotal += product.price * product.quantity;
    });

    // Update the subtotal, shipping, and total in the summary
    subtotalElement.textContent = `LKR ${subtotal.toFixed(2)}`;
    shippingElement.textContent = `LKR ${shippingCost.toFixed(2)}`;
    totalElement.textContent = `LKR ${(subtotal + shippingCost).toFixed(2)}`;
});


// ========================================Process Payment and Display Thank-You Message=========================//

function processPayment(event) {
    event.preventDefault(); // Prevent form submission

    // Gather form inputs
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const city = document.getElementById('city').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked');

    // Input validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name === "") {
        alert("Please enter your full name.");
        return;
    }
    if (!email.match(emailPattern)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (address === "") {
        alert("Please enter your delivery address.");
        return;
    }
    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }
    if (city === "") {
        alert("Please enter your city.");
        return;
    }

       // Validate payment method (if Credit/Debit Card selected, validate card details)
       if (paymentMethod && paymentMethod.value === "card") {
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        // Validate Card Number (16 digits)
        if (!/^\d{16}$/.test(cardNumber)) {
            alert("Please enter a valid 16-digit card number.");
            return;
        }

        // Validate Expiry Date (MM/YY format)
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            alert("Please enter a valid expiry date in MM/YY format.");
            return;
        }

        // Validate CVV (3 or 4 digits)
        if (!/^\d{3}$/.test(cvv)) {
            alert("Please enter a valid CVV (3 or 4 digits).");
            return;
        }
    }
    
    // Get the cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Generate a delivery date (3 days from today)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const formattedDate = deliveryDate.toLocaleDateString();

    // Display thank-you message
    const thankYouMessage = document.getElementById('thank-you-message');
    thankYouMessage.innerHTML = `
        <button class="close-btn" onclick="closeMessage()">x</button>
        <p>Thank you, ${name}, for your purchase!</p>
        <p>Your items will be delivered to <strong>${address}, ${city}</strong> by <strong>${formattedDate}</strong>.</p>
    `;
    thankYouMessage.classList.add('show'); // Show the message with animation

    // Optionally, clear the cart and form
    localStorage.removeItem('cart');
    document.getElementById('checkout-form').reset();
    document.getElementById('cart-items').innerHTML = '';
    document.getElementById('subtotal').textContent = 'Rs 0.00';
    document.getElementById('total').textContent = 'Rs 0.00';
}

// Save Order to Favourites
function saveToFavourites() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        city: document.getElementById('city').value.trim(),
        cart: cart,
    };

    // Save to localStorage as "favouriteOrder"
    localStorage.setItem('favouriteOrder', JSON.stringify(formData));
    alert('Order has been saved as a favourite.');
}

// Apply Favourites
function applyFavourites() {
    const favouriteOrder = JSON.parse(localStorage.getItem('favouriteOrder'));

    if (favouriteOrder) {
        // Populate form fields
        document.getElementById('name').value = favouriteOrder.name;
        document.getElementById('email').value = favouriteOrder.email;
        document.getElementById('address').value = favouriteOrder.address;
        document.getElementById('phone').value = favouriteOrder.phone;
        document.getElementById('city').value = favouriteOrder.city;

        // Populate cart
        const cart = favouriteOrder.cart || [];
        localStorage.setItem('cart', JSON.stringify(cart));

        const cartItemsContainer = document.getElementById('cart-items');
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <p>${item.name} (x${item.quantity})</p>
                <p>Rs ${(item.price * item.quantity).toFixed(2)}</p>
            `;
            cartItemsContainer.appendChild(itemDiv);

            subtotal += item.price * item.quantity;
        });

        // Update totals
        document.getElementById('subtotal').textContent = `Rs ${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `Rs ${subtotal.toFixed(2)}`;
    } else {
        alert('No favourite order found.');
    }
}

// The thank-you message close function
function closeMessage() {
    const thankYouMessage = document.getElementById('thank-you-message');
    thankYouMessage.classList.remove('show');
}


