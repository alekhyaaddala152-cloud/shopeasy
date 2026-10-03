/* =====================================================
   SHOPSTYLE - FINAL JAVASCRIPT
===================================================== */

let cart = JSON.parse(localStorage.getItem("shopStyleCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("shopStyleWishlist")) || [];
let loggedUser = JSON.parse(localStorage.getItem("shopStyleUser")) || null;
let currentCategory = "all";
let userBudget = Number(localStorage.getItem("shopStyleBudget")) || 0;


/* =====================================================
   PRODUCTS
===================================================== */

const products = {

    "Designer Saree": {
        name: "Designer Saree",
        price: 799,
        category: "fashion"
    },

    "Women’s Kurti": {
        name: "Women’s Kurti",
        price: 599,
        category: "fashion"
    },

    "Casual Shoes": {
        name: "Casual Shoes",
        price: 999,
        category: "footwear"
    },

    "Stylish Handbag": {
        name: "Stylish Handbag",
        price: 699,
        category: "accessories"
    },

    "Smart Watch": {
        name: "Smart Watch",
        price: 1499,
        category: "electronics"
    },

    "Beauty Kit": {
        name: "Beauty Kit",
        price: 499,
        category: "beauty"
    },

    "Wireless Headphones": {
        name: "Wireless Headphones",
        price: 899,
        category: "electronics"
    },

    "Fashion Jewellery": {
        name: "Fashion Jewellery",
        price: 299,
        category: "accessories"
    },

    "Kitchen Storage Set": {
        name: "Kitchen Storage Set",
        price: 399,
        category: "home"
    }
};


/* =====================================================
   PRICE COMPARISON DATA
   DEMO / SAMPLE PRICES
===================================================== */

const comparisonData = {

    "Designer Saree": {
        shopstyle: 799,
        amazon: 749,
        flipkart: 829,

        amazonUrl:
            "https://www.amazon.in/s?k=Designer+Saree",

        flipkartUrl:
            "https://www.flipkart.com/search?q=Designer%20Saree"
    },

    "Women’s Kurti": {
        shopstyle: 599,
        amazon: 649,
        flipkart: 579,

        amazonUrl:
            "https://www.amazon.in/s?k=Women%27s+Kurti",

        flipkartUrl:
            "https://www.flipkart.com/search?q=Women%27s%20Kurti"
    },

    "Casual Shoes": {
        shopstyle: 999,
        amazon: 949,
        flipkart: 899,

        amazonUrl:
            "https://www.amazon.in/s?k=Casual+Shoes",

        flipkartUrl:
            "https://www.flipkart.com/search?q=Casual%20Shoes"
    },

    "Stylish Handbag": {
        shopstyle: 699,
        amazon: 729,
        flipkart: 649,

        amazonUrl:
            "https://www.amazon.in/s?k=Stylish+Handbag",

        flipkartUrl:
            "https://www.flipkart.com/search?q=Stylish%20Handbag"
    },

    "Smart Watch": {
        shopstyle: 1499,
        amazon: 1399,
        flipkart: 1449,

        amazonUrl:
            "https://www.amazon.in/s?k=Smart+Watch",

        flipkartUrl:
            "https://www.flipkart.com/search?q=Smart%20Watch"
    },

    "Beauty Kit": {
        shopstyle: 499,
        amazon: 519,
        flipkart: 469,

        amazonUrl:
            "https://www.amazon.in/s?k=Beauty+Kit",

        flipkartUrl:
            "https://www.flipkart.com/search?q=Beauty%20Kit"
    },

    "Wireless Headphones": {
        shopstyle: 899,
        amazon: 849,
        flipkart: 929,

        amazonUrl:
            "https://www.amazon.in/s?k=Wireless+Headphones",

        flipkartUrl:
            "https://www.flipkart.com/search?q=Wireless%20Headphones"
    },

    "Fashion Jewellery": {
        shopstyle: 299,
        amazon: 279,
        flipkart: 319,

        amazonUrl:
            "https://www.amazon.in/s?k=Fashion+Jewellery",

        flipkartUrl:
            "https://www.flipkart.com/search?q=Fashion%20Jewellery"
    },

    "Kitchen Storage Set": {
        shopstyle: 399,
        amazon: 429,
        flipkart: 379,

        amazonUrl:
            "https://www.amazon.in/s?k=Kitchen+Storage+Set",

        flipkartUrl:
            "https://www.flipkart.com/search?q=Kitchen%20Storage%20Set"
    }
};


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


/* =====================================================
   LOGIN CHECK
===================================================== */

function requireLogin() {

    if (!loggedUser) {

        showToast("Please login first to continue.");

        openLogin();

        return false;
    }

    return true;
}


/* =====================================================
   SECTION NAVIGATION
===================================================== */

function showSection(sectionId) {

    const protectedSections = [
        "products",
        "budget",
        "account",
        "wishlist",
        "cart",
        "comparison"
    ];

    if (
        protectedSections.includes(sectionId) &&
        !loggedUser
    ) {

        showToast(
            "Please login first to access this feature."
        );

        openLogin();

        return;
    }

    const section =
        document.getElementById(sectionId);

    if (!section) return;

    section.scrollIntoView({
        behavior: "smooth"
    });

    if (sectionId === "comparison") {
        populateComparisonProducts();
    }
}


function startShopping() {

    if (!requireLogin()) return;

    showSection("products");
}


function scrollToProducts() {

    startShopping();
}


/* =====================================================
   SEARCH
===================================================== */

function searchProducts() {

    const searchInput =
        document.getElementById("search");

    if (!searchInput) return;

    const search =
        searchInput.value.toLowerCase().trim();


    if (!loggedUser && search !== "") {

        showToast(
            "Please login to search products."
        );

        return;
    }


    document
        .querySelectorAll(".product-card")
        .forEach(product => {

            const name =
                product.dataset.name.toLowerCase();

            const category =
                product.dataset.category;

            const matchesSearch =
                name.includes(search);

            const matchesCategory =
                currentCategory === "all" ||
                category === currentCategory;

            product.style.display =
                matchesSearch && matchesCategory
                    ? "block"
                    : "none";
        });
}


/* =====================================================
   CATEGORY FILTER
===================================================== */

function filterProducts(category) {

    if (!requireLogin()) return;

    currentCategory = category;


    document
        .querySelectorAll(".product-card")
        .forEach(product => {

            product.style.display =
                category === "all" ||
                product.dataset.category === category
                    ? "block"
                    : "none";
        });


    showSection("products");
}


function showAllProducts() {

    if (!requireLogin()) return;

    currentCategory = "all";


    document
        .querySelectorAll(".product-card")
        .forEach(product => {

            product.style.display = "block";

        });
}


/* =====================================================
   CART
===================================================== */

function addCart(name, price) {

    if (!requireLogin()) return;


    const product = getProduct(name);

    if (!product) return;


    const existing =
        cart.find(item => item.name === name);


    if (existing) {

        if (
            userBudget > 0 &&
            calculateCartTotal() + Number(price) >
            userBudget
        ) {

            showToast(
                "This would exceed your budget."
            );

            return;
        }

        existing.quantity++;

    } else {

        if (
            userBudget > 0 &&
            calculateCartTotal() + Number(price) >
            userBudget
        ) {

            showToast(
                "This product exceeds your remaining budget."
            );

            return;
        }


        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }


    saveCart();

    updateCart();

    updateBudget();

    showToast(
        name + " added to cart 🛒"
    );
}


function saveCart() {

    localStorage.setItem(
        "shopStyleCart",
        JSON.stringify(cart)
    );
}


function updateCart() {

    const cartList =
        document.getElementById("cart-list");

    const cartCount =
        document.getElementById("cart-count");

    const totalItems =
        document.getElementById("total-items");

    const totalPrice =
        document.getElementById("total-price");


    let items = 0;

    let total = 0;


    cart.forEach(item => {

        items += Number(item.quantity);

        total +=
            Number(item.price) *
            Number(item.quantity);

    });


    if (cartCount) {
        cartCount.textContent = items;
    }


    if (totalItems) {
        totalItems.textContent = items;
    }


    if (totalPrice) {

        totalPrice.textContent =
            "₹" +
            total.toLocaleString("en-IN");
    }


    if (!cartList) return;


    if (cart.length === 0) {

        cartList.innerHTML =
            "<p>Your cart is empty.</p>";

        updateBudget();

        return;
    }


    cartList.innerHTML = "";


    cart.forEach((item, index) => {

        const div =
            document.createElement("div");

        div.className = "cart-item";


        const subtotal =
            Number(item.price) *
            Number(item.quantity);


        div.innerHTML = `

            <div>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${Number(item.price)
                        .toLocaleString("en-IN")}
                </p>

            </div>


            <div class="quantity">

                <button
                    onclick="decreaseQuantity(${index})"
                >
                    −
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    onclick="increaseQuantity(${index})"
                >
                    +
                </button>

            </div>


            <strong>
                ₹${subtotal.toLocaleString("en-IN")}
            </strong>


            <button
                class="remove-btn"
                onclick="removeCart(${index})"
            >
                Remove
            </button>

        `;


        cartList.appendChild(div);

    });


    updateBudget();
}


function increaseQuantity(index) {

    if (!cart[index]) return;


    if (
        userBudget > 0 &&
        calculateCartTotal() +
        Number(cart[index].price) >
        userBudget
    ) {

        showToast(
            "This would exceed your budget."
        );

        return;
    }


    cart[index].quantity++;

    saveCart();

    updateCart();
}


function decreaseQuantity(index) {

    if (!cart[index]) return;


    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }


    saveCart();

    updateCart();
}


function removeCart(index) {

    if (!cart[index]) return;


    const name =
        cart[index].name;


    cart.splice(index, 1);


    saveCart();

    updateCart();


    showToast(
        name + " removed from cart."
    );
}


function calculateCartTotal() {

    return cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
        0
    );
}


/* =====================================================
   WISHLIST
===================================================== */

function addWishlist(name) {

    if (!requireLogin()) return;


    if (wishlist.includes(name)) {

        showToast(
            "Already in your wishlist ❤️"
        );

        return;
    }


    wishlist.push(name);

    saveWishlist();

    updateWishlist();


    showToast(
        name + " added to wishlist ❤️"
    );
}


function saveWishlist() {

    localStorage.setItem(
        "shopStyleWishlist",
        JSON.stringify(wishlist)
    );
}


function updateWishlist() {

    const list =
        document.getElementById(
            "wishlist-list"
        );

    if (!list) return;


    if (wishlist.length === 0) {

        list.innerHTML =
            "<p>Your wishlist is empty.</p>";

        return;
    }


    list.innerHTML = "";


    wishlist.forEach(name => {

        const product =
            getProduct(name);


        const item =
            document.createElement("div");

        item.className =
            "wishlist-item";


        item.innerHTML = `

            <h3>
                ${name}
            </h3>

            <strong>
                ₹${product
                    ? product.price.toLocaleString("en-IN")
                    : "0"}
            </strong>

            <button
                class="cart-btn"
                onclick="wishlistToCart('${name}')"
            >
                🛒 Add to Cart
            </button>

            <button
                class="remove-btn"
                onclick="removeWishlist('${name}')"
            >
                Remove
            </button>

        `;


        list.appendChild(item);

    });
}


function wishlistToCart(name) {

    const product =
        getProduct(name);


    if (!product) {

        showToast(
            "Product not found."
        );

        return;
    }


    addCart(
        product.name,
        product.price
    );
}


function removeWishlist(name) {

    wishlist =
        wishlist.filter(
            item => item !== name
        );


    saveWishlist();

    updateWishlist();


    showToast(
        "Removed from wishlist."
    );
}


/* =====================================================
   PRODUCT MODAL
===================================================== */

function getProduct(name) {

    return products[name] || null;
}


function openProduct(
    name,
    image,
    price,
    rating,
    description
) {

    if (!requireLogin()) return;


    const modal =
        document.getElementById(
            "product-modal"
        );


    document.getElementById(
        "modal-image"
    ).src = image;


    document.getElementById(
        "modal-name"
    ).textContent = name;


    document.getElementById(
        "modal-price"
    ).textContent =
        "₹" +
        Number(price).toLocaleString("en-IN");


    document.getElementById(
        "modal-rating"
    ).textContent =
        "⭐".repeat(
            Math.round(Number(rating))
        );


    document.getElementById(
        "modal-description"
    ).textContent =
        description;


    const product =
        getProduct(name);


    document.getElementById(
        "modal-category"
    ).textContent =
        product
            ? product.category
            : "Product";


    document.getElementById(
        "modal-cart"
    ).onclick = function () {

        addCart(name, price);

        closeProduct();

    };


    modal.classList.add("show");
}


function closeProduct() {

    document
        .getElementById("product-modal")
        .classList.remove("show");
}


/* =====================================================
   LOGIN / SIGNUP
===================================================== */

function openLogin() {

    document
        .getElementById("login-modal")
        .classList.add("show");


    showLogin();
}


function closeLogin() {

    document
        .getElementById("login-modal")
        .classList.remove("show");
}


function showLogin() {

    document
        .getElementById(
            "login-form-container"
        )
        .style.display = "block";


    document
        .getElementById(
            "signup-form-container"
        )
        .style.display = "none";
}


function showSignup() {

    document
        .getElementById(
            "login-form-container"
        )
        .style.display = "none";


    document
        .getElementById(
            "signup-form-container"
        )
        .style.display = "block";
}


function signup(event) {

    if (event) {
        event.preventDefault();
    }


    const name =
        document
            .getElementById("signup-name")
            .value
            .trim();


    const username =
        document
            .getElementById("signup-username")
            .value
            .trim();


    const password =
        document
            .getElementById("signup-password")
            .value
            .trim();


    if (!name || !username || !password) {

        showToast(
            "Please fill all fields."
        );

        return;
    }


    if (password.length < 4) {

        showToast(
            "Password needs at least 4 characters."
        );

        return;
    }


    const existingAccount =
        JSON.parse(
            localStorage.getItem(
                "shopStyleAccount"
            )
        );


    if (
        existingAccount &&
        existingAccount.username === username
    ) {

        showToast(
            "Username already exists."
        );

        return;
    }


    const user = {
        name: name,
        username: username,
        password: password
    };


    localStorage.setItem(
        "shopStyleAccount",
        JSON.stringify(user)
    );


    document.getElementById(
        "username"
    ).value = username;


    document.getElementById(
        "password"
    ).value = "";


    showLogin();


    showToast(
        "Account created successfully!"
    );
}


function login(event) {

    if (event) {
        event.preventDefault();
    }


    const username =
        document
            .getElementById("username")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value
            .trim();


    const account =
        JSON.parse(
            localStorage.getItem(
                "shopStyleAccount"
            )
        );


    if (!account) {

        showToast(
            "Please create an account first."
        );

        showSignup();

        return;
    }


    if (
        username !== account.username ||
        password !== account.password
    ) {

        showToast(
            "Incorrect username or password."
        );

        return;
    }


    loggedUser = {
        name: account.name,
        username: account.username
    };


    localStorage.setItem(
        "shopStyleUser",
        JSON.stringify(loggedUser)
    );


    closeLogin();

    updateAccount();


    showToast(
        "Login successful! Welcome 👋"
    );


    window.location.hash = "home";
}


/* =====================================================
   ACCOUNT
===================================================== */

function updateAccount() {

    const name =
        document.getElementById(
            "account-name"
        );


    const username =
        document.getElementById(
            "account-username"
        );


    const loginButton =
        document.getElementById(
            "account-login-btn"
        );


    const logoutButton =
        document.getElementById(
            "logout-btn"
        );


    if (!name || !username) return;


    if (loggedUser) {

        name.textContent =
            loggedUser.name;


        username.textContent =
            loggedUser.username;


        if (loginButton) {
            loginButton.style.display =
                "none";
        }


        if (logoutButton) {
            logoutButton.style.display =
                "block";
        }

    } else {

        name.textContent =
            "Guest User";


        username.textContent =
            "Please login to view your account.";


        if (loginButton) {
            loginButton.style.display =
                "inline-block";
        }


        if (logoutButton) {
            logoutButton.style.display =
                "none";
        }
    }
}


function logout() {

    loggedUser = null;


    localStorage.removeItem(
        "shopStyleUser"
    );


    updateAccount();


    showToast(
        "You have been logged out."
    );


    window.location.hash = "home";
}


/* =====================================================
   BUDGET
===================================================== */

function setBudget() {

    if (!requireLogin()) return;


    const input =
        document.getElementById(
            "budget-input"
        );


    const amount =
        Number(input.value);


    if (!amount || amount <= 0) {

        showToast(
            "Please enter a valid budget."
        );

        return;
    }


    userBudget = amount;


    localStorage.setItem(
        "shopStyleBudget",
        userBudget
    );


    updateBudget();


    showToast(
        "Budget set successfully 💰"
    );
}


function updateBudget() {

    const budgetTotal =
        document.getElementById(
            "budget-total"
        );


    const budgetSpent =
        document.getElementById(
            "budget-spent"
        );


    const budgetRemaining =
        document.getElementById(
            "budget-remaining"
        );


    const budgetMessage =
        document.getElementById(
            "budget-message"
        );


    if (!budgetTotal) return;


    const spent =
        calculateCartTotal();


    const remaining =
        userBudget - spent;


    budgetTotal.textContent =
        "₹" +
        userBudget.toLocaleString("en-IN");


    budgetSpent.textContent =
        "₹" +
        spent.toLocaleString("en-IN");


    if (userBudget === 0) {

        budgetRemaining.textContent =
            "₹0";


        budgetMessage.textContent =
            "Set your budget to start smart shopping.";

    } else if (remaining >= 0) {

        budgetRemaining.textContent =
            "₹" +
            remaining.toLocaleString("en-IN");


        budgetMessage.textContent =
            "You are within your budget. Keep shopping smart! 💰";

    } else {

        budgetRemaining.textContent =
            "-₹" +
            Math.abs(remaining)
                .toLocaleString("en-IN");


        budgetMessage.textContent =
            "Your cart has exceeded your budget. Remove some products.";
    }


    renderBudgetProducts();
}


function renderBudgetProducts() {

    const container =
        document.getElementById(
            "budget-product-list"
        );


    if (!container) return;


    container.innerHTML = "";


    Object.values(products).forEach(
        product => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "budget-product";


            const wouldExceed =
                userBudget > 0 &&
                calculateCartTotal() +
                product.price >
                userBudget;


            div.innerHTML = `

                <h4>
                    ${product.name}
                </h4>

                <p>
                    ₹${product.price
                        .toLocaleString("en-IN")}
                </p>

                <button
                    onclick="addBudgetProduct('${product.name}')"
                    ${wouldExceed ? "disabled" : ""}
                >
                    ${
                        wouldExceed
                            ? "Over Budget"
                            : "Add to Cart"
                    }
                </button>

            `;


            container.appendChild(div);
        }
    );
}


function addBudgetProduct(name) {

    if (!requireLogin()) return;


    if (userBudget <= 0) {

        showToast(
            "Please set your budget first."
        );

        return;
    }


    const product =
        getProduct(name);


    if (!product) return;


    if (
        calculateCartTotal() +
        product.price >
        userBudget
    ) {

        showToast(
            "This product exceeds your remaining budget."
        );

        return;
    }


    addCart(
        product.name,
        product.price
    );
}


/* =====================================================
   PRICE COMPARISON
===================================================== */

function populateComparisonProducts() {

    const select =
        document.getElementById(
            "compare-product"
        );


    if (!select) return;


    const currentValue =
        select.value;


    if (select.options.length === 1) {

        Object.keys(products).forEach(
            name => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value = name;

                option.textContent = name;


                select.appendChild(option);
            }
        );
    }


    if (currentValue) {

        select.value =
            currentValue;
    }
}


function compareProduct(name) {

    const select =
        document.getElementById(
            "compare-product"
        );


    if (!select) return;


    populateComparisonProducts();


    select.value = name;


    showSection("comparison");


    showComparison();
}


function showComparison() {

    const select =
        document.getElementById(
            "compare-product"
        );


    const results =
        document.getElementById(
            "comparison-results"
        );


    if (!select || !results) return;


    const name =
        select.value;


    if (
        !name ||
        !comparisonData[name]
    ) {

        results.innerHTML = `

            <div class="comparison-empty">

                <div>
                    ⚖️
                </div>

                <h3>
                    Choose a product
                </h3>

                <p>
                    The comparison table will appear here.
                </p>

            </div>

        `;

        return;
    }


    const data =
        comparisonData[name];


    const prices = [

        {
            site: "ShopStyle",
            price: data.shopstyle,
            url: "",
            own: true
        },

        {
            site: "Amazon",
            price: data.amazon,
            url: data.amazonUrl,
            own: false
        },

        {
            site: "Flipkart",
            price: data.flipkart,
            url: data.flipkartUrl,
            own: false
        }

    ];


    const lowestPrice =
        Math.min(
            ...prices.map(
                item => item.price
            )
        );


    const rows =
        prices.map(item => {

            const isLowest =
                item.price ===
                lowestPrice;


            const action =
                item.own

                    ? `
                        <span>
                            Current ShopStyle Price
                        </span>
                    `

                    : `
                        <button
                            class="comparison-action"
                            onclick="openComparisonLink('${item.url}')"
                        >
                            Search on ${item.site}
                        </button>
                    `;


            return `

                <tr
                    class="${
                        item.own
                            ? "shopstyle-row"
                            : ""
                    }"
                >

                    <td>
                        <strong>
                            ${item.site}
                        </strong>
                    </td>


                    <td class="comparison-price">

                        ₹${item.price
                            .toLocaleString("en-IN")}

                    </td>


                    <td>

                        ${
                            isLowest

                                ? `
                                    <span class="comparison-badge">
                                        Lowest sample price
                                    </span>
                                `

                                : `
                                    <span class="same-price">
                                        —
                                    </span>
                                `
                        }

                    </td>


                    <td>
                        ${action}
                    </td>

                </tr>

            `;

        }).join("");


    const cheaperCompetitors =
        prices.filter(item =>
            !item.own &&
            item.price < data.shopstyle
        );


    let message;


    if (cheaperCompetitors.length > 0) {

        const cheapest =
            cheaperCompetitors.reduce(
                (a, b) =>
                    a.price < b.price
                        ? a
                        : b
            );


        message = `

            <div class="comparison-badge">

                A lower sample price is available on
                ${cheapest.site}:
                ₹${cheapest.price
                    .toLocaleString("en-IN")}

            </div>

        `;

    } else {

        message = `

            <div class="comparison-badge">

                No lower sample price was found
                in this demo comparison.

            </div>

        `;
    }


    results.innerHTML = `

        <div class="comparison-title">

            <h3>
                ${name}
            </h3>

            <p>
                ${message}
            </p>

        </div>


        <div class="comparison-table-wrap">

            <table class="comparison-table">

                <thead>

                    <tr>

                        <th>
                            Shopping Site
                        </th>

                        <th>
                            Sample Price
                        </th>

                        <th>
                            Price Status
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

    `;
}


function openComparisonLink(url) {

    if (!url) return;


    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =====================================================
   CHECKOUT
===================================================== */

function checkout() {

    if (!requireLogin()) return;


    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    document.getElementById(
        "checkout-total"
    ).textContent =
        "₹" +
        calculateCartTotal()
            .toLocaleString("en-IN");


    document
        .getElementById("checkout-modal")
        .classList.add("show");
}


function closeCheckout() {

    document
        .getElementById("checkout-modal")
        .classList.remove("show");
}


/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    const customerName =
        document
            .getElementById("customer-name")
            .value
            .trim();


    const customerPhone =
        document
            .getElementById("customer-phone")
            .value
            .trim();


    const customerAddress =
        document
            .getElementById("customer-address")
            .value
            .trim();


    const customerCity =
        document
            .getElementById("customer-city")
            .value
            .trim();


    const customerPincode =
        document
            .getElementById("customer-pincode")
            .value
            .trim();


    const payment =
        document
            .getElementById("payment")
            .value;


    const paymentNames = {

        cod: "Cash on Delivery",

        upi: "UPI - Demo",

        card: "Card - Demo"
    };


    const total =
        calculateCartTotal();


    const orderDetails = {

        orderId:
            "SS" +
            Date.now()
                .toString()
                .slice(-8),

        orderDate:
            new Date()
                .toLocaleString("en-IN"),

        customerName:
            customerName,

        customerPhone:
            customerPhone,

        customerAddress:
            customerAddress,

        customerCity:
            customerCity,

        customerPincode:
            customerPincode,

        payment:
            paymentNames[payment] ||
            payment,

        items:
            cart.map(item => ({

                name:
                    item.name,

                price:
                    item.price,

                quantity:
                    item.quantity,

                subtotal:
                    item.price *
                    item.quantity

            })),

        total:
            total
    };


    localStorage.setItem(
        "shopStyleLastOrder",
        JSON.stringify(orderDetails)
    );


    displayOrderDetails(
        orderDetails
    );


    closeCheckout();


    document
        .getElementById("success-modal")
        .classList.add("show");


    cart = [];


    saveCart();

    updateCart();

    updateBudget();
}


/* =====================================================
   DISPLAY ORDER DETAILS
===================================================== */

function displayOrderDetails(order) {

    const container =
        document.getElementById(
            "order-details"
        );


    if (!container) return;


    const itemsHTML =
        order.items.map(item => `

            <div class="order-product">

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        Quantity:
                        ${item.quantity}
                    </p>

                    <p>
                        Price:
                        ₹${item.price
                            .toLocaleString("en-IN")}
                    </p>

                </div>


                <strong>

                    ₹${item.subtotal
                        .toLocaleString("en-IN")}

                </strong>

            </div>

        `).join("");


    container.innerHTML = `

        <div class="order-success-info">

            <div class="order-id-box">

                🧾 Order ID:

                <strong>
                    ${order.orderId}
                </strong>

            </div>


            <p>

                <strong>
                    📅 Order Date:
                </strong>

                ${order.orderDate}

            </p>


            <hr>


            <h3>
                👤 Customer Details
            </h3>


            <div class="customer-details-box">

                <p>
                    <strong>Name:</strong>
                    ${order.customerName}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${order.customerPhone}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${order.customerAddress}
                </p>

                <p>
                    <strong>City:</strong>
                    ${order.customerCity}
                </p>

                <p>
                    <strong>Pincode:</strong>
                    ${order.customerPincode}
                </p>

            </div>


            <hr>


            <h3>
                🛍️ Ordered Products
            </h3>


            ${itemsHTML}


            <hr>


            <p>

                <strong>
                    💳 Payment Method:
                </strong>

                ${order.payment}

            </p>


            <div class="order-total">

                <span>
                    Total Amount
                </span>

                <strong>
                    ₹${order.total
                        .toLocaleString("en-IN")}
                </strong>

            </div>

        </div>

    `;
}


function closeSuccess() {

    document
        .getElementById("success-modal")
        .classList.remove("show");


    window.location.hash =
        "home";
}


/* =====================================================
   MODAL EVENTS
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const productModal =
            document.getElementById(
                "product-modal"
            );


        const loginModal =
            document.getElementById(
                "login-modal"
            );


        const checkoutModal =
            document.getElementById(
                "checkout-modal"
            );


        const successModal =
            document.getElementById(
                "success-modal"
            );


        if (
            event.target ===
            productModal
        ) {

            closeProduct();
        }


        if (
            event.target ===
            loginModal
        ) {

            closeLogin();
        }


        if (
            event.target ===
            checkoutModal
        ) {

            closeCheckout();
        }


        if (
            event.target ===
            successModal
        ) {

            closeSuccess();
        }

    }
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeProduct();

            closeLogin();

            closeCheckout();

            closeSuccess();
        }

    }
);


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCart();

        updateWishlist();

        updateAccount();

        updateBudget();

        populateComparisonProducts();


        console.log(
            "ShopStyle loaded successfully."
        );

    }
);
