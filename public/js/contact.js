/* =====================================================
   CONTACT FORM
===================================================== */

const contactForm = document.getElementById("contactForm");
const contactFormMessage =
    document.getElementById("contactFormMessage");

if (contactForm && contactFormMessage) {

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const subject =
            document.getElementById("subject").value;

        const message =
            document.getElementById("message").value.trim();


        /* =========================
           VALIDATION
        ========================== */

        if (!name || !email || !subject || !message) {

            contactFormMessage.textContent =
                "Please complete all fields before sending your enquiry.";

            return;
        }


        /* =========================
           SUCCESS MESSAGE
        ========================== */

        contactFormMessage.textContent =
            `Thank you, ${name}. Your enquiry has been received.`;


        /* =========================
           RESET FORM
        ========================== */

        contactForm.reset();

    });
}


/* =====================================================
   CART COUNT
===================================================== */

function updateContactCartCount() {

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const cart =
        JSON.parse(
            localStorage.getItem("sheeverCart")
        ) || [];

    const totalItems =
        cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

    cartCount.textContent = totalItems;
}

updateContactCartCount();
