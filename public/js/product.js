/* =========================================
   SHEEVER STITCHES
   HOMEPAGE PRODUCT DATA
========================================= */

const featuredProducts = [
    {
        id: "signature-dress",
        name: "Signature Dress",
        category: "Dresses",
        price: 85000,
        imageClass: "product-image-dress",
        image: "images/grey-dress.jpeg"
    },

    {
        id: "classic-blazer",
        name: "Classic Blazer",
        category: "Tailoring",
        price: 95000,
        imageClass: "product-image-blazer",
        image: "images/grey-dress.jpeg"
    },

    {
        id: "silk-evening-set",
        name: "Silk Evening Set",
        category: "Evening",
        price: 110000,
        imageClass: "product-image-evening",
        image: "images/grey-dress.jpeg"
    },

    {
        id: "tailored-trousers",
        name: "Tailored Trousers",
        category: "Tailoring",
        price: 75000,
        imageClass: "product-image-trousers",
        image: "images/grey-dress.jpeg"
    }
];

/* =========================================
   PRODUCT GRID
========================================= */

const featuredProductsContainer =
    document.getElementById("featuredProducts");





/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createProductCard(product) {

    return `
        <a
            href="product.html?id=${product.id}"
            class="product-card"
            aria-label="View ${product.name}"
        >

            <div class="product-image-wrapper">

                <div
                    class="product-image ${product.imageClass}"
                >

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>

                <span class="product-quick-view">
                    View Product
                </span>

            </div>


            <div class="product-info">

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-category">
                    ${product.category}
                </p>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

            </div>

        </a>
    `;
}

/* =========================================
   RENDER PRODUCTS
========================================= */

function renderFeaturedProducts() {

    if (!featuredProductsContainer) {
        return;
    }

    featuredProductsContainer.innerHTML =
        featuredProducts
            .map(createProductCard)
            .join("");
}


renderFeaturedProducts();

const catalogProducts = [
    {
        id: "signature-dress",
        name: "Signature Dress",
        category: "Dresses",
        price: 85000,
        description:
            "A refined silhouette designed with timeless elegance and effortless movement.",
        details:
            "Designed with a refined silhouette and considered proportions for a timeless finish.",
        sizes: ["XS", "S", "M", "L", "XL"],
        imageClass: "product-image-dress",
        image: "images/grey-dress.jpeg"
    },

    {
        id: "classic-blazer",
        name: "Classic Blazer",
        category: "Tailoring",
        price: 95000,
        description:
            "A structured essential designed to bring effortless refinement to every look.",
        details:
            "A considered tailored piece with clean lines and a timeless silhouette.",
        sizes: ["XS", "S", "M", "L", "XL"],
        imageClass: "product-image-blazer",
        image: "images/grey-dress.jpeg"
    },

    {
        id: "silk-evening-set",
        name: "Silk Evening Set",
        category: "Evening",
        price: 110000,
        description:
            "An elegant evening silhouette designed for refined occasions and effortless confidence.",
        details:
            "A sophisticated two-piece silhouette designed with fluid movement and evening elegance.",
        sizes: ["XS", "S", "M", "L", "XL"],
        imageClass: "product-image-evening",
        image: "images/grey-dress.jpeg"
    },

    {
        id: "tailored-trousers",
        name: "Tailored Trousers",
        category: "Tailoring",
        price: 75000,
        description:
            "Precisely tailored trousers designed to bring structure and ease to your wardrobe.",
        details:
            "A versatile tailored essential with a refined silhouette and considered proportions.",
        sizes: ["XS", "S", "M", "L", "XL"],
        imageClass: "product-image-trousers",
        image: "images/grey-dress.jpeg"
    }
];


const productCategory =
    document.getElementById("productCategory");

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const productDescription =
    document.getElementById("productDescription");

const productDetails =
    document.getElementById("productDetails");

const productImage =
    document.getElementById("productImageElement");



const sizeOptions =
    document.getElementById("sizeOptions");

const selectedSize =
    document.getElementById("selectedSize");

const quantityValue =
    document.getElementById("quantityValue");

const decreaseQuantity =
    document.getElementById("decreaseQuantity");

const increaseQuantity =
    document.getElementById("increaseQuantity");

const addToBag =
    document.getElementById("addToBag");

const productMessage =
    document.getElementById("productMessage");




function getProductFromUrl() {

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        params.get("id");

    return catalogProducts.find(
        product => product.id === productId
    );
}


const currentProduct =
    getProductFromUrl();


let selectedProductSize = null;
let quantity = 1;


function renderProduct(product) {
     if (!productName) 
        return;
    if (!product) {
        productName.textContent = "Product Not Found";

        productCategory.textContent = "";

        productPrice.textContent = "";

        productDescription.textContent =
            "The product you are looking for could not be found.";

        productDetails.textContent = "";

        addToBag.disabled = true;

        return;
    }


    productCategory.textContent =
        product.category;

    productName.textContent =
        product.name;

    productPrice.textContent =
        formatPrice(product.price);

    productDescription.textContent =
        product.description;

    productDetails.textContent =
        product.details;

   productImage.className =
    `product-main-image ${product.imageClass}`;

productImage.src =
    product.image;

productImage.alt =
    product.name;




    sizeOptions.innerHTML =
        product.sizes
            .map(size => `
                <button
                    type="button"
                    class="size-button"
                    data-size="${size}"
                >
                    ${size}
                </button>
            `)
            .join("");


    setupSizeButtons();
}


function setupSizeButtons() {

    const sizeButtons =
        document.querySelectorAll(".size-button");

    sizeButtons.forEach(button => {

        button.addEventListener("click", () => {

            sizeButtons.forEach(
                item => item.classList.remove("selected")
            );

            button.classList.add("selected");

            selectedProductSize =
                button.dataset.size;

            selectedSize.textContent =
                selectedProductSize;

            productMessage.textContent = "";
        });

    });
}


function updateQuantity() {

    quantityValue.textContent =
        quantity;
}


if (decreaseQuantity) {

    decreaseQuantity.addEventListener("click", () => {

        if (quantity > 1) {
            quantity--;
            updateQuantity();
        }

    });

}


if (increaseQuantity) {

    increaseQuantity.addEventListener("click", () => {

        quantity++;
        updateQuantity();

    });

}


if (addToBag) {

    addToBag.addEventListener("click", () => {

        const defaultBagText = addToBag.textContent.trim();
    let bagTextTimer;

        if (!currentProduct) {
            return;
        }

        if (!selectedProductSize) {
            productMessage.textContent =
                "Please select a size before adding this piece to your bag.";
            return;
        }

        addToCart(
            {
                id: currentProduct.id,
                name: currentProduct.name,
                category: currentProduct.category,
                price: currentProduct.price,
                size: selectedProductSize,
                image: currentProduct.image,
                imageClass: currentProduct.imageClass
            },
            quantity
        );

        productMessage.textContent =
            `${currentProduct.name} has been added to your bag.`;

             // Change the button text, then restore it after 2 seconds
        addToBag.textContent = "Added to Bag ✓";
        addToBag.classList.add("is-added");

        clearTimeout(bagTextTimer);

        bagTextTimer = setTimeout(() => {
            addToBag.textContent = defaultBagText;
            addToBag.classList.remove("is-added");
        }, 2000);

    });

}





/* ========================================
   WISHLIST
======================================== */






function updateWishlistButton(product) {

    const button =
        document.getElementById("addToWishlist");

    if (!button) {
        return;
    }


    const wishlist =
        getWishlist();

    const isSaved =
        wishlist.some(
            item =>
                item.id === product.id
        );


    if (isSaved) {

        button.classList.add("is-saved");

        button.innerHTML =
            `
                <span aria-hidden="true">♥</span>
                Saved to Wishlist
            `;

    } else {

        button.classList.remove("is-saved");

        button.innerHTML =
            `
                <span aria-hidden="true">♡</span>
                Add to Wishlist
            `;

    }

}


function toggleWishlist(product) {

    const wishlist =
        getWishlist();

    const existingIndex =
        wishlist.findIndex(
            item =>
                item.id === product.id
        );


    if (existingIndex !== -1) {

        wishlist.splice(
            existingIndex,
            1
        );

    } else {

        wishlist.push({

            id: product.id,

            name: product.name,

            category:
                product.category || "",

            price:
                Number(product.price),

            image:
                product.image || "images/grey-dress.jpeg",

            imageClass:
                product.imageClass || ""

        });

    }


    saveWishlist(wishlist);

    updateWishlistButton(product);
    updateCounts();

}

/* ========================================
   WISHLIST BUTTON
======================================== */

const addToWishlist =
    document.getElementById("addToWishlist");

if (addToWishlist) {

    addToWishlist.addEventListener("click", () => {

        if (!currentProduct) {
            return;
        }

        toggleWishlist(currentProduct);

    });

}


/* ========================================
   INITIAL STATE
======================================== */

renderProduct(currentProduct);

if (currentProduct) {
    updateWishlistButton(currentProduct);
}

updateCounts();