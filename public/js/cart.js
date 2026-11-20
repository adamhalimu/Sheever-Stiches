/* ========================================
   DOM ELEMENTS
======================================== */

const cartItemsContainer =
    document.getElementById("cartItems");

const cartSubtotal =
    document.getElementById("cartSubtotal");

const cartTotal =
    document.getElementById("cartTotal");

const cartItemCount =
    document.getElementById("cartItemCount");

const emptyCart =
    document.getElementById("emptyCart");

const checkoutButton =
    document.getElementById("checkoutButton");

const checkoutSection =
    document.getElementById("checkoutSection");

const customerName =
    document.getElementById("customerName");

const customerEmail =
    document.getElementById("customerEmail");

const customerPhone =
    document.getElementById("customerPhone");

const orderReferenceCard =
    document.getElementById("orderReferenceCard");

const orderReference =
    document.getElementById("orderReference");

const paymentCard =
    document.getElementById("paymentCard");

const paystackButton =
    document.getElementById("paystackButton");

const bankTransferButton =
    document.getElementById("bankTransferButton");

const bankTransferDetails =
    document.getElementById("bankTransferDetails");

const bankTransferAmount =
    document.getElementById("bankTransferAmount");

const bankOrderReference =
    document.getElementById("bankOrderReference");

const whatsappButton =
    document.getElementById("whatsappButton");


/* ========================================
   PAYSTACK PUBLIC KEY
======================================== */
// Local Live Server talks to the backend on port 5000; when deployed, use the same site
const BACKEND_URL = window.location.port === "5500" ? "http://localhost:5000" : "";   // change to your deployed URL later
const PAYSTACK_PUBLIC_KEY =
    "pk_test_0152f310a0a7e8ab539860cad33265c4b7df5cec";


/* ========================================
   CART DATA
======================================== */

function getCart() {
 try {
        const cart = JSON.parse(localStorage.getItem("sheeverCart"));
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }

}


/* ========================================
   SAVE CART
======================================== */

function saveCart(cart) {

    localStorage.setItem(
        "sheeverCart",
        JSON.stringify(cart)
    );

}


/* ========================================
   PRICE FORMATTER
======================================== */

function formatPrice(price) {

    return new Intl.NumberFormat("en-NG", {

        style: "currency",

        currency: "NGN",

        maximumFractionDigits: 0

    }).format(price);

}

// ======================================== // CREATE CART ITEM // ======================================== */
function createCartItem(item, index) { return ` <article class="cart-item"> <div class="cart-item-image ${item.imageClass || ""}" > <img src="${item.image || "images/grey-dress.jpeg"}" alt="${item.name}" > </div> <div class="cart-item-content"> <p class="cart-item-category"> ${item.category} </p> <h2 class="cart-item-name"> ${item.name} </h2> <p class="cart-item-price"> ${formatPrice(item.price)} </p> <p class="cart-item-size"> Size: <strong> ${item.size} </strong> </p> <div class="cart-item-actions"> <div class="cart-quantity" aria-label="Quantity for ${item.name}" > <button type="button" class="cart-quantity-button" data-action="decrease" data-index="${index}" aria-label="Decrease quantity" > − </button> <span class="cart-quantity-value" aria-live="polite" > ${item.quantity} </span> <button type="button" class="cart-quantity-button" data-action="increase" data-index="${index}" aria-label="Increase quantity" > + </button> </div> <button type="button" class="remove-item" data-action="remove" data-index="${index}" > Remove </button> </div> </div> </article> `; }
/* ========================================
   CREATE CART ITEM
======================================== 

function createCartItem(item, index) {

    return `

        <article class="cart-item">

            <div
                class="cart-item-image ${item.imageClass || ""}"
                aria-hidden="true"
            >

                <span>
                    ${item.name}
                </span>

            </div>


            <div class="cart-item-content">

                <p class="cart-item-category">
                    ${item.category}
                </p>


                <h2 class="cart-item-name">
                    ${item.name}
                </h2>


                <p class="cart-item-price">
                    ${formatPrice(item.price)}
                </p>


                <p class="cart-item-size">

                    Size:

                    <strong>
                        ${item.size}
                    </strong>

                </p>


                <div class="cart-item-actions">


                    <div
                        class="cart-quantity"
                        aria-label="Quantity for ${item.name}"
                    >

                        <button
                            type="button"
                            class="cart-quantity-button"
                            data-action="decrease"
                            data-index="${index}"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>


                        <span
                            class="cart-quantity-value"
                            aria-live="polite"
                        >
                            ${item.quantity}
                        </span>


                        <button
                            type="button"
                            class="cart-quantity-button"
                            data-action="increase"
                            data-index="${index}"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                    </div>


                    <button
                        type="button"
                        class="remove-item"
                        data-action="remove"
                        data-index="${index}"
                    >
                        Remove
                    </button>

                </div>

            </div>

        </article>

    `;

}  ----------*/


// ========================================
// CALCULATE TOTALS
// ========================================

function calculateSubtotal(cart) {

    return cart.reduce(
        (total, item) => {

            return total +
                (item.price * item.quantity);

        },
        0
    );

}


// ========================================
// UPDATE CART COUNT
// ========================================

function updateCartCount(cart) {


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    cartCount.textContent =
        totalQuantity;

    cartCount.setAttribute(
        "aria-label",
        `${totalQuantity} ${
            totalQuantity === 1
                ? "item"
                : "items"
        } in shopping bag`
    );

}


function addToCart(product, quantity = 1) {
    const cart = getCart();

    const existing = cart.find(
        item => item.id === product.id && item.size === product.size
    );

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity});
    }

    saveCart(cart);
    renderCart();
}
    


// ========================================
// RENDER CART
// ========================================

function renderCart() {

    const cart = getCart();

    updateCartCount(cart);

    // Not the cart page, so stop here
    if (!cartItemsContainer || !cartItemCount) return;

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartItemCount.textContent =
        `${totalQuantity} ${
            totalQuantity === 1
                ? "piece"
                : "pieces"
        }`;

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = "";

        cartItemsContainer.hidden = true;

        emptyCart.hidden = false;

        cartSubtotal.textContent =
            "₦0";

        cartTotal.textContent =
            "₦0";

        checkoutButton.disabled =
            true;

        if (checkoutSection) {

            checkoutSection.hidden =
                true;

        }

        return;
    }

    cartItemsContainer.hidden =
        false;

    emptyCart.hidden =
        true;

    checkoutButton.disabled =
        false;

    cartItemsContainer.innerHTML =
        cart
            .map(createCartItem)
            .join("");

    const subtotal =
        calculateSubtotal(cart);

    cartSubtotal.textContent =
        formatPrice(subtotal);

    cartTotal.textContent =
        formatPrice(subtotal);

    setupCartActions();

} 


// ========================================
// CART ACTIONS
// ========================================

function setupCartActions() {

    const actionButtons =
        cartItemsContainer.querySelectorAll(
            "[data-action]"
        );

    actionButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;

                const index =
                    Number(
                        button.dataset.index
                    );

                handleCartAction(
                    action,
                    index
                );

            }
        );

    });

}


// ========================================
// HANDLE CART ACTION
/*
function handleCartAction(action, index) { const cart = getCart(); if (!cart[index]) { return; } if (action === "increase") { cart[index].quantity++; } if (action === "decrease") { if (cart[index].quantity > 1) { cart[index].quantity--; } } if (action === "remove") { cart.splice(index, 1); } } */

/* ========================================
function handleCartAction(
    action,
    index
) {

    const cart = getCart();

    if (!cart[index]) {
        return;
    }

    if (action === "increase") {

        cart[index].quantity++;

    }

    if (action === "decrease") {

        if (cart[index].quantity > 1) {

            cart[index].quantity--;

        }

    }

    if (action === "remove") {

        cart.splice(index, 1);

    }

    saveCart(cart);

    renderCart();

}
--------*/
function handleCartAction(action, index) {
    const cart = getCart();

    if (!cart[index]) return;

    if (action === "increase") {
        cart[index].quantity++;
    }

    if (action === "decrease" && cart[index].quantity > 1) {
        cart[index].quantity--;
    }

    if (action === "remove") {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}
// ========================================
// ORDER REFERENCE
// ========================================

function generateOrderReference() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    const randomNumber =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    return `SHE-${year}${month}${day}-${randomNumber}`;

}


// ========================================
// CHECKOUT REFERENCE
// ========================================

function getCheckoutReference() {

    return localStorage.getItem(
        "sheeverOrderReference"
    );

}


function createCheckoutReference() {

    let reference =
        getCheckoutReference();

    if (!reference) {

        reference =
            generateOrderReference();

        localStorage.setItem(
            "sheeverOrderReference",
            reference
        );

    }

    return reference;

}


// ========================================
// SHOW CHECKOUT
// ========================================

function openCheckout() {

    const cart =
        getCart();

    if (cart.length === 0) {
        return;
    }

    const reference =
        createCheckoutReference();

    const subtotal =
        calculateSubtotal(cart);

    orderReference.textContent =
        reference;

    bankOrderReference.textContent =
        reference;

    bankTransferAmount.textContent =
        formatPrice(subtotal);

    checkoutSection.hidden =
        false;

    orderReferenceCard.hidden =
        false;

    paymentCard.hidden =
        false;

    checkoutSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ========================================
// VALIDATE CUSTOMER DETAILS
// ========================================

function validateCustomerDetails() {

    if (!customerName.value.trim()) {

        alert(
            "Please enter your full name."
        );

        customerName.focus();

        return false;
    }


    if (!customerEmail.value.trim()) {

        alert(
            "Please enter your email address."
        );

        customerEmail.focus();

        return false;
    }


    if (!customerPhone.value.trim()) {

        alert(
            "Please enter your phone number."
        );

        customerPhone.focus();

        return false;
    }


    if (!customerEmail.checkValidity()) {

        alert(
            "Please enter a valid email address."
        );

        customerEmail.focus();

        return false;
    }


    return true;

}


// ========================================
// WHATSAPP MESSAGE
// ========================================

function createWhatsAppMessage() {

    const cart =
        getCart();

    const reference =
        getCheckoutReference();

    const subtotal =
        calculateSubtotal(cart);

    let message =
        "Hello Sheever Stitches,\n\n";

    message +=
        "I have made a bank transfer for my order.\n\n";

    message +=
        `Order Reference: ${reference}\n`;

    message +=
        `Customer: ${customerName.value.trim()}\n`;

    message +=
        `Email: ${customerEmail.value.trim()}\n`;

    message +=
        `Phone: ${customerPhone.value.trim()}\n\n`;

    message +=
        "Order Details:\n";

    cart.forEach(item => {

        message +=
            `• ${item.name} — Size ${item.size} — Qty ${item.quantity}\n`;

    });

    message +=
        "\n";

    message +=
        `Total: ${formatPrice(subtotal)}\n\n`;

    message +=
        "Please confirm my payment.";

    return encodeURIComponent(
        message
    );

}


// ========================================
// OPEN BANK TRANSFER
// ========================================

if (bankTransferButton) {

    bankTransferButton.addEventListener(
        "click",
        () => {

            if (!validateCustomerDetails()) {
                return;
            }

            const cart =
                getCart();

            if (cart.length === 0) {

                alert(
                    "Your shopping bag is empty."
                );

                return;
            }

            const reference =
                createCheckoutReference();

            const subtotal =
                calculateSubtotal(cart);

            bankTransferDetails.hidden =
                false;

            bankTransferAmount.textContent =
                formatPrice(subtotal);

            bankOrderReference.textContent =
                reference;

            bankTransferDetails.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}
// ========================================
// BOOK A CONSULTATION (WHATSAPP)
// ========================================

function openConsultationChat() {
   const message =
        "Hello Sheever Stitches,\n\n" +
        "I would like to book a consultation.\n\n" +
        "I'm interested in (please delete what doesn't apply):\n" +
        "• A custom or made-to-measure piece\n" +
        "• Measurements and fit\n" +
        "• Style and fabric advice\n" +
        "• Questions about your pieces, pricing or timelines\n\n" +
        "Occasion (if any):\n" +
        "Preferred date and time:\n" +
        "Additional details:\n\n" +
        "Thank you!";


    const url =
        `https://wa.me/2347026456760?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    // Clear the shopping bag
    localStorage.removeItem("sheeverCart");

    // Remove the old order reference
    localStorage.removeItem("sheeverOrderReference");

    // Update the badge (and the cart page, if open)
    renderCart();
}

document.querySelectorAll(".consultation-button").forEach(button => {
    button.addEventListener("click", openConsultationChat);
});


// ========================================
// CONFIRM BANK TRANSFER ON WHATSAPP
// ========================================

if (whatsappButton) {

    whatsappButton.addEventListener(
        "click",
        () => {

            if (!validateCustomerDetails()) {
                return;
            }

            const cart =
                getCart();

            if (cart.length === 0) {

                alert(
                    "Your shopping bag is empty."
                );

                return;
            }

            const whatsappURL =
                `https://wa.me/2347026456760?text=${createWhatsAppMessage()}`;

            window.open(
                whatsappURL,
                "_blank"
            );

            // Clear the shopping bag
            localStorage.removeItem(
                "sheeverCart"
            );

            // Remove the old order reference
            localStorage.removeItem(
                "sheeverOrderReference"
            );

            // Re-render the cart
            renderCart();

        }
    );

}


// ========================================
// PAYSTACK PAYMENT
// ========================================

function showPaymentSuccess(order) {

    const lines = order.items
        .map(item =>
            `• ${item.name} — Size ${item.size} — Qty ${item.quantity}`
        )
        .join("\n");

    const message =
        "Hello Sheever Stitches,\n\n" +
        "I have paid for my order online.\n\n" +
        `Order Reference: ${order.orderReference}\n` +
        `Payment Reference: ${order.paymentReference}\n` +
        `Customer: ${order.name}\n` +
        `Email: ${order.email}\n` +
        `Phone: ${order.phone}\n\n` +
        `Order Details:\n${lines}\n\n` +
        `Total: ${formatPrice(order.total)}\n\n` +
        "Please confirm my order.";

    const whatsappURL =
        `https://wa.me/2347026456760?text=${encodeURIComponent(message)}`;

    checkoutSection.innerHTML = `
        <div class="checkout-inner">
            <div class="checkout-card">
                <div class="checkout-header">
                    <p class="checkout-eyebrow">Payment Received</p>
                    <h2>Thank you, ${order.name.split(" ")[0]}.</h2>
                    <p>
                        Your payment of ${formatPrice(order.total)} was
                        successful. Order reference:
                        <strong>${order.orderReference}</strong>
                    </p>
                </div>

                <a
                    href="${whatsappURL}"
                    class="whatsapp-button"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Send Order Details on WhatsApp
                    <span aria-hidden="true">→</span>
                </a>
            </div>
        </div>
    `;

    checkoutSection.hidden = false;
    emptyCart.hidden = true;

    checkoutSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


if (paystackButton) {

    paystackButton.addEventListener("click", () => {

        if (!validateCustomerDetails()) {
            return;
        }

        const cart = getCart();

        if (cart.length === 0) {
            alert("Your shopping bag is empty.");
            return;
        }

        if (typeof PaystackPop === "undefined") {
            alert(
                "Online payment is unavailable right now. " +
                "Please check your connection or pay by bank transfer."
            );
            return;
        }

        const total = calculateSubtotal(cart);
        const orderRef = createCheckoutReference();

        // A fresh reference per attempt, because Paystack rejects reused ones
        const paymentRef =
            `${orderRef}-${Date.now().toString(36).toUpperCase()}`;

        // Save the order details before the cart is cleared
        const order = {
            orderReference: orderRef,
            paymentReference: paymentRef,
            name: customerName.value.trim(),
            email: customerEmail.value.trim(),
            phone: customerPhone.value.trim(),
            total,
            items: cart.map(item => ({
                 id: item.id,   
                name: item.name,
                size: item.size,
                quantity: item.quantity
            }))
        };

        paystackButton.disabled = true;

        const popup = new PaystackPop();

        popup.newTransaction({
            key: PAYSTACK_PUBLIC_KEY,
            email: order.email,
            amount: Math.round(total * 100),   // kobo
            currency: "NGN",
            ref: paymentRef,
            metadata: {
                order_reference: orderRef,
                customer_name: order.name,
                customer_phone: order.phone,
                items: order.items
            },

           onSuccess: async transaction => {

    try {

        const response = await fetch(
            `${BACKEND_URL}/verify-payment/${encodeURIComponent(transaction.reference)}`
        );

        const result = await response.json();

        if (!result.status) {
            throw new Error(result.message);
        }

        localStorage.removeItem("sheeverCart");
        localStorage.removeItem("sheeverOrderReference");
        renderCart();
        showPaymentSuccess(order);

    } catch (error) {

    console.error("Verification failed:", error);

    alert(
        "We received your payment but could not confirm it automatically. " +
        `Please send your payment reference ${paymentRef} to us on WhatsApp.\n\n` +
        `(Reason: ${error.message})`
    );

} finally {

        paystackButton.disabled = false;

    }

},

            onCancel: () => {
                paystackButton.disabled = false;
            },

            onError: error => {
                alert("Payment could not start: " + error.message);
                paystackButton.disabled = false;
            }
        });

    });

}

// ========================================
// CHECKOUT BUTTON
// ========================================

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        () => {

            openCheckout();

        }
    );

}

window.addEventListener("storage", (event) => {
    if (event.key === "sheeverCart" || event.key === null) {
        renderCart();
    }
});

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        renderCart();
    }
});
// ========================================
// INITIALIZE CART
// ========================================

renderCart();

