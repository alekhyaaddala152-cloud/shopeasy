/* =====================================================
   SHOPSTYLE - FRONTEND JAVASCRIPT
===================================================== */


/* ================= DATA ================= */

let cart = JSON.parse(
    localStorage.getItem("shopStyleCart")
) || [];

let wishlist = JSON.parse(
    localStorage.getItem("shopStyleWishlist")
) || [];

let loggedUser = JSON.parse(
    localStorage.getItem("shopStyleUser")
) || null;

let currentCategory = "all";


/* ================= TOAST ================= */

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 2000);
}


/* ================= HOME ================= */

function scrollToProducts() {

    document.getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* ================= SEARCH ================= */

function searchProducts() {

    const search = document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();

    const products = document.querySelectorAll(".product-card");

    products.forEach(function (product) {

        const name = product
            .dataset.name
            .toLowerCase();

        const category = product
            .dataset.category;

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


/* ================= FILTER ================= */

function filterProducts(category) {

    currentCategory = category;

    const products =
        document.querySelectorAll(".product-card");

    products.forEach(function (product) {

        if (
            category === "all" ||
            product.dataset.category === category
        ) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }

    });

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function showAllProducts() {

    currentCategory = "all";

    document
        .querySelectorAll(".product-card")
        .forEach(function (product) {

            product.style.display = "block";

        });

}


/* ================= CART ================= */

function addCart(name, price) {

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


    cart.forEach(function (item) {

        items += item.quantity;

        total +=
            item.price *
            item.quantity;

    });


    cartCount.textContent = items;

    totalItems.textContent = items;

    totalPrice.textContent =
        total.toLocaleString("en-IN");


    if (cart.length === 0) {

        cartList.innerHTML =
            "<p>Your cart is empty.</p>";

        return;
    }


    cartList.innerHTML = "";


    cart.forEach(function (item, index) {

        const div =
            document.createElement("div");

        div.className = "cart-item";


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

}


function increaseQuantity(index) {

    if (!cart[index]) return;

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


/* ================= WISHLIST ================= */

function addWishlist(name) {

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


    if (wishlist.length === 0) {

        list.innerHTML =
            "<p>Your wishlist is empty.</p>";

        return;
    }


    list.innerHTML = "";


    wishlist.forEach(function (name) {

        const item =
            document.createElement("div");

        item.className =
            "wishlist-item";


        item.innerHTML = `

            <h3>${name}</h3>

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

        showToast("Product not found.");

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


/* ================= PRODUCT DATA ================= */

function getProduct(name) {

    const products = {

        "Designer Saree": {
            name: "Designer Saree",
            price: 799
        },

        "Women’s Kurti": {
            name: "Women’s Kurti",
            price: 599
        },

        "Casual Shoes": {
            name: "Casual Shoes",
            price: 999
        },

        "Stylish Handbag": {
            name: "Stylish Handbag",
            price: 699
        },

        "Smart Watch": {
            name: "Smart Watch",
            price: 1499
        },

        "Beauty Kit": {
            name: "Beauty Kit",
            price: 499
        },

        "Wireless Headphones": {
            name: "Wireless Headphones",
            price: 899
        },

        "Fashion Jewellery": {
            name: "Fashion Jewellery",
            price: 299
        },

        "Kitchen Storage Set": {
            name: "Kitchen Storage Set",
            price: 399
        }

    };

    return products[name] || null;
}


/* ================= PRODUCT DETAILS ================= */

function openProduct(
    name,
    image,
    price,
    rating,
    description
) {

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


/* ================= LOGIN ================= */

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


/* ================= SIGN UP ================= */

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


/* ================= LOGIN FUNCTION ================= */

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

    showToast(
        "Login successful! Welcome 👋"
    );


    window.location.hash = "home";

}


/* ================= CHECKOUT ================= */

function checkout() {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    let total = 0;


    cart.forEach(function (item) {

        total +=
            item.price *
            item.quantity;

    });


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


/* ================= ORDER ================= */

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

}


function closeSuccess() {

    document
        .getElementById("success-modal")
        .classList.remove("show");


    window.location.hash = "home";

}


/* ================= CLOSE MODALS ================= */

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


        if (event.target === productModal) {
            closeProduct();
        }

        if (event.target === loginModal) {
            closeLogin();
        }

        if (event.target === checkoutModal) {
            closeCheckout();
        }

        if (event.target === successModal) {
            closeSuccess();
        }

    }
);


/* ================= ESCAPE KEY ================= */

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


/* ================= INITIAL LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCart();

        updateWishlist();

        console.log(
            "ShopStyle loaded successfully."
        );

    }
);