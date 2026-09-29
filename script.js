/* =====================================================
   SHOPSTYLE - FINAL JAVASCRIPT
===================================================== */


/* =====================================================
   DATA
===================================================== */

let cart =
    JSON.parse(localStorage.getItem("shopStyleCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("shopStyleWishlist")) || [];

let loggedUser =
    JSON.parse(localStorage.getItem("shopStyleUser")) || null;

let currentCategory = "all";

let userBudget =
    Number(localStorage.getItem("shopStyleBudget")) || 0;


/* =====================================================
   PRODUCT DATA
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
   TOAST
===================================================== */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2200);
}


/* =====================================================
   LOGIN ACCESS
===================================================== */

function requireLogin() {

    if (!loggedUser) {

        showToast(
            "Please login first to continue."
        );

        openLogin();

        return false;
    }

    return true;
}


/* =====================================================
   NAVIGATION
===================================================== */

function showSection(sectionId) {

    const protectedSections = [
        "products",
        "budget",
        "account",
        "wishlist",
        "cart"
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

}


function startShopping() {

    if (!requireLogin()) return;

    showSection("products");

}


/* =====================================================
   HOME
===================================================== */

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
        searchInput.value
            .toLowerCase()
            .trim();

    if (!loggedUser && search !== "") {

        showToast(
            "Please login to search products."
        );

        return;
    }

    const productCards =
        document.querySelectorAll(".product-card");

    productCards.forEach(function (product) {

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
   FILTER
===================================================== */

function filterProducts(category) {

    if (!requireLogin()) return;

    currentCategory = category;

    const productCards =
        document.querySelectorAll(".product-card");

    productCards.forEach(function (product) {

        const matches =
            category === "all" ||
            product.dataset.category === category;

        product.style.display =
            matches ? "block" : "none";

    });

    showSection("products");

}


function showAllProducts() {

    if (!requireLogin()) return;

    currentCategory = "all";

    const productCards =
        document.querySelectorAll(".product-card");

    productCards.forEach(function (product) {

        product.style.display = "block";

    });

}


/* =====================================================
   CART
===================================================== */

function addCart(name, price) {

    if (!requireLogin()) return;

    const product =
        getProduct(name);

    if (!product) return;


    const existing =
        cart.find(function (item) {

            return item.name === name;

        });


    if (existing) {

        existing.quantity++;

    } else {

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


    if (!cartList) return;


    let items = 0;

    let total = 0;


    cart.forEach(function (item) {

        items += item.quantity;

        total +=
            item.price *
            item.quantity;

    });


    if (cartCount) {

        cartCount.textContent = items;

    }


    if (totalItems) {

        totalItems.textContent = items;

    }


    if (totalPrice) {

        totalPrice.textContent =
            total.toLocaleString("en-IN");

    }


    if (cart.length === 0) {

        cartList.innerHTML =
            "<p>Your cart is empty.</p>";

        updateBudget();

        return;

    }


    cartList.innerHTML = "";


    cart.forEach(function (item, index) {

        const div =
            document.createElement("div");

        div.className =
            "cart-item";


        const subtotal =
            item.price *
            item.quantity;


        div.innerHTML = `

            <div>

                <h3>${item.name}</h3>

                <p>
                    ₹${item.price.toLocaleString("en-IN")}
                </p>

            </div>


            <div class="quantity">

                <button
                    onclick="decreaseQuantity(${index})">
                    −
                </button>

                <strong>
                    ${item.quantity}
                </strong>

                <button
                    onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>


            <strong>
                ₹${subtotal.toLocaleString("en-IN")}
            </strong>


            <button
                class="remove-btn"
                onclick="removeCart(${index})">
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
        calculateCartTotal() + cart[index].price >
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

    let total = 0;


    cart.forEach(function (item) {

        total +=
            item.price *
            item.quantity;

    });


    return total;

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
        document.getElementById("wishlist-list");


    if (!list) return;


    if (wishlist.length === 0) {

        list.innerHTML =
            "<p>Your wishlist is empty.</p>";

        return;
    }


    list.innerHTML = "";


    wishlist.forEach(function (name) {

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
                onclick="wishlistToCart('${name}')">
                🛒 Add to Cart
            </button>

            <button
                class="remove-btn"
                onclick="removeWishlist('${name}')">
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
        wishlist.filter(function (item) {

            return item !== name;

        });


    saveWishlist();

    updateWishlist();


    showToast(
        "Removed from wishlist."
    );

}


/* =====================================================
   GET PRODUCT
===================================================== */

function getProduct(name) {

    return products[name] || null;

}


/* =====================================================
   PRODUCT MODAL
===================================================== */

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
        Number(price).toLocaleString("en-IN");


    document.getElementById(
        "modal-rating"
    ).textContent = rating;


    document.getElementById(
        "modal-description"
    ).textContent = description;


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
   LOGIN MODAL
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

    document.getElementById(
        "login-form"
    ).style.display = "block";

    document.getElementById(
        "signup-form"
    ).style.display = "none";

}


function showSignup() {

    document.getElementById(
        "login-form"
    ).style.display = "none";

    document.getElementById(
        "signup-form"
    ).style.display = "block";

}


/* =====================================================
   SIGN UP
===================================================== */

function signup() {

    const name =
        document.getElementById(
            "signup-name"
        ).value.trim();


    const username =
        document.getElementById(
            "signup-username"
        ).value.trim();


    const password =
        document.getElementById(
            "signup-password"
        ).value.trim();


    if (
        name === "" ||
        username === "" ||
        password === ""
    ) {

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


/* =====================================================
   LOGIN
===================================================== */

function login() {

    const username =
        document.getElementById(
            "username"
        ).value.trim();


    const password =
        document.getElementById(
            "password"
        ).value.trim();


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


    window.location.hash =
        "home";

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


    if (!name) return;


    if (loggedUser) {

        name.textContent =
            loggedUser.name;

        username.textContent =
            loggedUser.username;

        loginButton.style.display =
            "none";

        logoutButton.style.display =
            "block";

    } else {

        name.textContent =
            "Guest User";

        username.textContent =
            "Not logged in";

        loginButton.style.display =
            "block";

        logoutButton.style.display =
            "none";

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


    window.location.hash =
        "home";

}


/* =====================================================
   BUDGET FIX
===================================================== */

function setBudget() {

    if (!requireLogin()) return;


    const input =
        document.getElementById(
            "budget-input"
        );


    const amount =
        Number(input.value);


    if (
        !amount ||
        amount <= 0
    ) {

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


    Object.values(products)
        .forEach(function (product) {

            const div =
                document.createElement("div");

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
                    ₹${product.price.toLocaleString("en-IN")}
                </p>

                <button
                    onclick="addBudgetProduct('${product.name}')"
                    ${wouldExceed ? "disabled" : ""}>
                    ${
                        wouldExceed
                            ? "Over Budget"
                            : "Add to Cart"
                    }
                </button>

            `;


            container.appendChild(div);

        });

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


    const currentTotal =
        calculateCartTotal();


    if (
        currentTotal +
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


    updateBudget();

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


    const total =
        calculateCartTotal();


    document.getElementById(
        "checkout-total"
    ).textContent =
        total.toLocaleString("en-IN");


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
   ORDER
===================================================== */

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    closeCheckout();


    document
        .getElementById("success-modal")
        .classList.add("show");


    cart = [];


    saveCart();

    updateCart();


    if (userBudget > 0) {

        updateBudget();

    }

}


function closeSuccess() {

    document
        .getElementById("success-modal")
        .classList.remove("show");


    window.location.hash =
        "home";

}


/* =====================================================
   MODAL CLICK OUTSIDE
===================================================== */

window.addEventListener(
    "click",
    function (event) {

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
            event.target === productModal
        ) {

            closeProduct();

        }


        if (
            event.target === loginModal
        ) {

            closeLogin();

        }


        if (
            event.target === checkoutModal
        ) {

            closeCheckout();

        }


        if (
            event.target === successModal
        ) {

            closeSuccess();

        }

    }
);


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

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
    function () {

        updateCart();

        updateWishlist();

        updateAccount();

        updateBudget();

        console.log(
            "ShopStyle loaded successfully."
        );

    }
);
