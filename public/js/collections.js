/* ========================================
   PRODUCT DATA
======================================== */

const products = [

    {
        id: "signature-dress",
        name: "Signature Dress",
        category: "dresses",
        categoryName: "Dresses",
        price: 85000,
        imageClass: "product-image-dress",
        image: "images/grey-dress.jpeg"
    },

    {
        id: "classic-blazer",
        name: "Classic Blazer",
        category: "tailoring",
        categoryName: "Tailoring",
        price: 95000,
        imageClass: "product-image-blazer",
        image: "images/grey-dress.jpeg"
    },

    {
        id: "silk-evening-set",
        name: "Silk Evening Set",
        category: "evening",
        categoryName: "Evening",
        price: 110000,
        imageClass: "product-image-evening",
        image: "images/grey-dress.jpeg"
    },

    {
        id: "tailored-trousers",
        name: "Tailored Trousers",
        category: "tailoring",
        categoryName: "Tailoring",
        price: 75000,
        imageClass: "product-image-trousers",
        image: "images/grey-dress.jpeg"
    }

];


/* ========================================
   DOM ELEMENTS
======================================== */

const categoryFilter =
    document.getElementById("categoryFilter");

const collectionsGrid =
    document.getElementById("collectionsGrid");

const productCount =
    document.getElementById("productCount");

const noProducts =
    document.getElementById("noProducts");


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


/* ========================================
   CREATE CATEGORY LIST
======================================== */

function getCategories() {

    const categories =
        products.map(product => product.category);

    return [
        "all",
        ...new Set(categories)
    ];

}


/* ========================================
   CATEGORY DISPLAY NAME
======================================== */

function getCategoryName(category) {

    if (category === "all") {
        return "All Pieces";
    }

    const product =
        products.find(
            item => item.category === category
        );

    return product
        ? product.categoryName
        : category;
}


/* ========================================
   RENDER CATEGORY FILTER
======================================== */

function renderCategoryFilter(activeCategory) {

    const categories =
        getCategories();

    categoryFilter.innerHTML =
        categories
            .map(category => {

                const activeClass =
                    category === activeCategory
                        ? "active"
                        : "";

                return `
                    <button
                        type="button"
                        class="category-button ${activeClass}"
                        data-category="${category}"
                        aria-pressed="${category === activeCategory}"
                    >
                        ${getCategoryName(category)}
                    </button>
                `;

            })
            .join("");


    const categoryButtons =
        categoryFilter.querySelectorAll(
            ".category-button"
        );


    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            const category =
                button.dataset.category;

            updateUrl(category);

            renderCategoryFilter(category);

            renderProducts(category);

        });

    });

}


/* ========================================
   UPDATE URL
======================================== */

function updateUrl(category) {

    const url =
        new URL(window.location.href);


    if (category === "all") {

        url.searchParams.delete("category");

    } else {

        url.searchParams.set(
            "category",
            category
        );

    }


    window.history.pushState(
        {},
        "",
        url
    );

}


/* ========================================
   GET ACTIVE CATEGORY
======================================== */

function getActiveCategory() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const category =
        params.get("category");


    const validCategories =
        getCategories();


    if (
        category &&
        validCategories.includes(category)
    ) {

        return category;

    }


    return "all";

}


/* ========================================
   FILTER PRODUCTS
======================================== */

function filterProducts(category) {

    if (category === "all") {

        return products;

    }


    return products.filter(
        product =>
            product.category === category
    );

}


/* ========================================
   CREATE PRODUCT CARD
======================================== */
function createProductCard(product) {

    const saved = isInWishlist(product.id);

    return `
        <div class="collection-card-wrap">

            <a
                href="product.html?id=${product.id}"
                class="collection-product-card"
                aria-label="View ${product.name}"
            >
                <div
                    class="collection-product-image ${product.imageClass}"
                >
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >
                </div>

                <div class="collection-product-info">
                    <h3 class="collection-product-name">
                        ${product.name}
                    </h3>

                    <p class="collection-product-category">
                        ${product.categoryName}
                    </p>

                    <p class="collection-product-price">
                        ${formatPrice(product.price)}
                    </p>
                </div>
            </a>

            <button
                type="button"
                class="card-wishlist ${saved ? "is-saved" : ""}"
                data-id="${product.id}"
                aria-pressed="${saved}"
                aria-label="${saved ? "Remove from" : "Add to"} wishlist: ${product.name}"
            >${saved ? "♥" : "♡"}</button>
        </div>
    `;
}
/* ========================================
   RENDER PRODUCTS
======================================== */

function renderProducts(category) {

    const filteredProducts =
        filterProducts(category);

    collectionsGrid.innerHTML =
        filteredProducts
            .map(createProductCard)
            .join("");

    productCount.textContent =
        `${filteredProducts.length} ${
            filteredProducts.length === 1
                ? "piece"
                : "pieces"
        }`;

    noProducts.hidden =
        filteredProducts.length !== 0;

}
/* ========================================
   INITIALIZE
======================================== */

const activeCategory =
    getActiveCategory();


renderCategoryFilter(
    activeCategory
);

renderProducts(
    activeCategory
);
/* ========================================
   WISHLIST HEARTS
======================================== */

if (collectionsGrid) {

    collectionsGrid.addEventListener("click", event => {

        const button = event.target.closest(".card-wishlist");

        if (!button) return;

        const product = products.find(
            item => item.id === button.dataset.id
        );

        if (!product) return;

        const saved = toggleWishlistItem(product);

        button.classList.toggle("is-saved", saved);
        button.textContent = saved ? "♥" : "♡";
        button.setAttribute("aria-pressed", saved);
        button.setAttribute(
            "aria-label",
            `${saved ? "Remove from" : "Add to"} wishlist: ${product.name}`
        );

    });

}

// Re-draw hearts when coming back via the Back button
window.addEventListener("pageshow", event => {
    if (event.persisted) {
        renderProducts(getActiveCategory());
    }
});


/* ========================================
   BROWSER HISTORY
======================================== */

window.addEventListener(
    "popstate",
    () => {

        const category =
            getActiveCategory();

        renderCategoryFilter(category);
        renderProducts(category);

    }
);

updateCounts();