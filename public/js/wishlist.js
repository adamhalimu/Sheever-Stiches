
/* ========================================
   WISHLIST
======================================== */

const WISHLIST_KEY = "sheeverWishlist";
const CART_KEY = "sheeverCart";


/* ========================================
   GET WISHLIST
======================================== */

function getWishlist() {

    try {

        const wishlist =
            JSON.parse(
                localStorage.getItem(WISHLIST_KEY)
            );

        return Array.isArray(wishlist)
            ? wishlist
            : [];

    } catch (error) {

        return [];

    }

}


/* ========================================
   SAVE WISHLIST
======================================== */

function saveWishlist(wishlist) {

    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );

}


/* ========================================
   GET CART
======================================== */

function getCart() {

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(CART_KEY)
            );

        return Array.isArray(cart)
            ? cart
            : [];

    } catch (error) {

        return [];

    }

}


/* ========================================
   SAVE CART
======================================== */

function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* ========================================
   FORMAT PRICE
======================================== */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0
        }
    ).format(price);

}

function isInWishlist(id) {
    return getWishlist().some(item => item.id === id);
}

// Adds or removes an item. Returns true if it is now saved.
function toggleWishlistItem(product) {
    const wishlist = getWishlist();
    const index = wishlist.findIndex(item => item.id === product.id);

    if (index !== -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            category: product.categoryName || product.category || "",
            price: Number(product.price),
            image: product.image || "images/grey-dress.jpeg",
            imageClass: product.imageClass || ""
        });
    }

    saveWishlist(wishlist);
    updateCounts();

    return index === -1;
}


/* ========================================
   UPDATE COUNTS
======================================== */

function updateCounts() {

    const wishlist =
        getWishlist();

    const cart =
        getCart();

    const wishlistCount =
        document.getElementById("wishlistCount");

    const cartCount =
        document.getElementById("cartCount");

    const itemCount =
        document.getElementById("wishlistItemCount");


    const wishlistTotal =
        wishlist.length;

    const cartTotal =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity || 1),
            0
        );


    if (wishlistCount) {

        wishlistCount.textContent =
            wishlistTotal;

        wishlistCount.setAttribute(
            "aria-label",
            `${wishlistTotal} items in wishlist`
        );

    }


    if (cartCount) {

        cartCount.textContent =
            cartTotal;

        cartCount.setAttribute(
            "aria-label",
            `${cartTotal} items in shopping bag`
        );

    }


    if (itemCount) {

        itemCount.textContent =
            `${wishlistTotal} ${
                wishlistTotal === 1
                    ? "piece"
                    : "pieces"
            }`;

    }

}


/* ========================================
   CREATE WISHLIST CARD
======================================== */

function createWishlistCard(
    product,
    index
) {

    return `
        <article class="wishlist-card">

            <button
                type="button"
                class="wishlist-remove"
                data-action="remove"
                data-index="${index}"
                aria-label="Remove ${product.name} from wishlist"
            >
                ×
            </button>


            <a
                href="product.html?id=${product.id}"
                class="wishlist-card-image"
            >

                <img
                    src="${product.image || "images/grey-dress.jpeg"}"
                    alt="${product.name}"
                >

            </a>


            <div class="wishlist-card-details">

                <p class="wishlist-card-category">
                    ${product.category || ""}
                </p>

                <h2 class="wishlist-card-name">
                    ${product.name}
                </h2>

                <p class="wishlist-card-price">
                    ${formatPrice(product.price)}
                </p>


                <div class="wishlist-card-actions">

                    <button
                        type="button"
                        class="wishlist-add-bag"
                        data-action="add-to-bag"
                        data-index="${index}"
                    >
                        Add to Bag
                    </button>

                    <a
                        href="product.html?id=${product.id}"
                        class="wishlist-view-product"
                    >
                        View Piece
                    </a>

                </div>

            </div>

        </article>
    `;

}


/* ========================================
   RENDER WISHLIST
======================================== */

function renderWishlist() {

    const wishlistItems =
        document.getElementById(
            "wishlistItems"
        );

    const emptyWishlist =
        document.getElementById(
            "emptyWishlist"
        );

    const wishlist =
        getWishlist();


    if (!wishlistItems || !emptyWishlist) {
        return;
    }


    if (wishlist.length === 0) {

        wishlistItems.innerHTML = "";

        wishlistItems.hidden = true;

        emptyWishlist.hidden = false;

        updateCounts();

        return;

    }


    wishlistItems.hidden = false;

    emptyWishlist.hidden = true;


    wishlistItems.innerHTML =
        wishlist
            .map(
                (product, index) =>
                    createWishlistCard(
                        product,
                        index
                    )
            )
            .join("");


    updateCounts();

}


/* ========================================
   ADD TO BAG
======================================== */

function addWishlistItemToBag(index) {

    const wishlist =
        getWishlist();

    const product =
        wishlist[index];

    if (!product) {
        return;
    }


    const cart =
        getCart();

    const existingItem =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existingItem) {

        existingItem.quantity =
            Number(existingItem.quantity || 0) + 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            category:
                product.category || "",

            price:
                Number(product.price),

            image:
                product.image || "images/grey-dress.jpeg",

            imageClass:
                product.imageClass || "",

            size:
                product.size || "M",

            quantity: 1

        });

    }


    saveCart(cart);

    alert(
        `${product.name} has been added to your bag.`
    );

    renderWishlist();

}


/* ========================================
   WISHLIST ACTIONS
======================================== */

function handleWishlistAction(
    action,
    index
) {

    const wishlist =
        getWishlist();


    if (!wishlist[index]) {
        return;
    }


    if (action === "remove") {

        wishlist.splice(
            index,
            1
        );

        saveWishlist(wishlist);

        renderWishlist();

        return;

    }


    if (action === "add-to-bag") {

        addWishlistItemToBag(index);

    }

}


/* ========================================
   EVENT LISTENER
======================================== */
const wishlistItemsContainer =
    document.getElementById("wishlistItems");

if (wishlistItemsContainer) {

    wishlistItemsContainer.addEventListener("click", event => {

        const button = event.target.closest("[data-action]");

        if (!button) return;

        handleWishlistAction(
            button.dataset.action,
            Number(button.dataset.index)
        );

    });

}

/* ========================================
   INITIALIZE
======================================== */

renderWishlist();
updateCounts();
renderWishlist();

document.addEventListener("DOMContentLoaded", updateCounts);
window.addEventListener("load", updateCounts);