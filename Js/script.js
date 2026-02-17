
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let allProductsData = [];


const showSkeleton = () => {
    const productList = document.getElementById("product-list");
    const trendingList = document.getElementById("trending-products");

    const skeletonHTML = `
        <div class="flex flex-col gap-4 border border-gray-100 p-4 rounded-2xl">
            <div class="skeleton h-52 w-full rounded-xl"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-6 w-full"></div>
            <div class="skeleton h-4 w-20"></div>
            <div class="flex gap-2 mt-2">
                <div class="skeleton h-10 flex-1"></div>
                <div class="skeleton h-10 flex-1"></div>
            </div>
        </div>
    `;

    if (productList) {
        productList.innerHTML = skeletonHTML.repeat(8);
    }

    if (trendingList) {
        trendingList.innerHTML = skeletonHTML.repeat(3);
    }
};


const updateCartUI = () => {
    const cartCountElement = document.getElementById("cart-count");
    const cartItemsList = document.getElementById("cart-items-list");
    const cartTotalElement = document.getElementById("cart-total");

    cartCountElement.innerText = cart.length;
    localStorage.setItem("cart", JSON.stringify(cart));

    if (cartItemsList) {
        if (cart.length === 0) {
            cartItemsList.innerHTML = `<p class="text-gray-400 text-center mt-10">Your cart is empty!</p>`;
            cartTotalElement.innerText = "$0.00";
        } else {
            cartItemsList.innerHTML = "";
            let total = 0;
            cart.forEach((item) => {
                total += item.price;
                const itemDiv = document.createElement("div");
                itemDiv.className = "flex gap-4 bg-gray-50 p-3 rounded-xl items-center mb-3";
                itemDiv.innerHTML = `
                    <img src="${
                        item.image
                    }" class="w-12 h-12 object-contain bg-white p-1 rounded" />
                    <div class="flex-grow">
                        <h4 class="text-xs font-bold line-clamp-1">${item.title}</h4>
                        <p class="text-primary font-bold text-sm">$${item.price}</p>
                    </div>
                    <button onclick='toggleCart(${JSON.stringify(item).replace(
                        /'/g,
                        "&apos;",
                    )})' class="btn btn-xs btn-circle btn-ghost text-error">
                        <i class="fa-solid fa-trash text-base"></i>
                    </button>
                `;
                cartItemsList.appendChild(itemDiv);
            });
            cartTotalElement.innerText = `$${total.toFixed(2)}`;
        }
    }
};

const toggleCart = (product) => {
    const productIndex = cart.findIndex((item) => item.id === product.id);

    if (productIndex === -1) {
        cart.push(product);
    } else {
        cart.splice(productIndex, 1);
    }

    updateCartUI();

    if (document.getElementById("product-list")) {
        displayProducts(allProductsData);
    }

    if (document.getElementById("trending-products")) {
        displayTrendingProducts(allProductsData);
    }
};

const handleAddToCart = (_btn, product) => {
    toggleCart(product);
};


const getAllProducts = async () => {
    showSkeleton();

    try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        allProductsData = data;

        setTimeout(() => {
            displayProducts(data);
            displayTrendingProducts(data);
        }, 500);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

const getAllCategories = async () => {
    try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        const data = await res.json();
        displayCategories(data);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

const filterProducts = async (category, element) => {
    const allButtons = document.querySelectorAll(".category-btn");
    allButtons.forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-ghost", "btn-outline", "text-gray-700", "border-gray-300");
    });
    element.classList.remove("btn-ghost", "btn-outline", "text-gray-700", "border-gray-300");
    element.classList.add("btn-primary");

    showSkeleton();

    let url =
        category === "all"
            ? "https://fakestoreapi.com/products"
            : `https://fakestoreapi.com/products/category/${category}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        allProductsData = data;
        displayProducts(data);
    } catch (error) {
        console.error("Error filtering products:", error);
    }
};


const displayProducts = (products) => {
    const productList = document.getElementById("product-list");
    if (!productList) return;
    productList.innerHTML = "";

    products.forEach((product) => {
        const isInCart = cart.some((item) => item.id === product.id);
        const productDiv = document.createElement("div");

        productDiv.innerHTML = `
            <div class="card bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-full">
                <figure class="bg-[#F3F4F6] p-5 h-64 flex justify-center items-center">
                    <img src="${product.image}" alt="${
            product.title
        }" class="h-full object-contain mix-blend-multiply" loading="lazy" />
                </figure>
                <div class="card-body p-5 pt-2">
                    <div class="flex justify-between items-center mb-2">
                        <span class="badge badge-ghost text-primary bg-blue-100 border-none text-[10px] font-bold py-3 uppercase">${
                            product.category
                        }</span>
                        <div class="flex items-center gap-1 text-sm font-medium text-gray-600">
                            <i class="fa-solid fa-star text-yellow-400 text-xs"></i> ${
                                product.rating.rate
                            }
                            <span>(${product.rating.count})</span>
                        </div>
                    </div>
                    <h3 class="text-gray-800 font-bold text-base mb-1 truncate" title="${
                        product.title
                    }">${product.title}</h3>
                    <p class="text-xl font-extrabold text-gray-900 mb-6">$${product.price}</p>
                    <div class="mt-auto flex gap-3">
                        <button onclick="loadProductDetails(${
                            product.id
                        })" class="btn btn-outline border-gray-300 flex-1 hover:bg-gray-100 font-semibold normal-case text-xs"><i class="fa-regular fa-eye mr-2"></i> Details</button>
                        <button onclick='toggleCart(${JSON.stringify(product).replace(
                            /'/g,
                            "&apos;",
                        )})' 
                            class="btn ${
                                isInCart
                                    ? "btn-error text-white"
                                    : "btn-primary bg-[#5851FF] border-none"
                            } flex-1 font-semibold normal-case text-xs">
                            <i class="fa-solid ${
                                isInCart ? "fa-trash" : "fa-cart-shopping"
                            } mr-1"></i>
                            ${isInCart ? "Remove" : "Add"}
                        </button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });
};

const displayTrendingProducts = (products) => {
    const trendingContainer = document.getElementById("trending-products");
    if (!trendingContainer) return;

    const topRated = [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 3);

    trendingContainer.innerHTML = "";

    topRated.forEach((product) => {
        const isInCart = cart.some((item) => item.id === product.id);
        const card = document.createElement("div");
        card.innerHTML = `
            <div class="card bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-full">
                <figure class="bg-[#E5E7EB] p-5 h-64 flex justify-center items-center">
                    <img src="${product.image}" alt="${
            product.title
        }" class="h-full object-contain mix-blend-multiply" />
                </figure>
                <div class="card-body p-5 pt-2">
                    <div class="flex justify-between items-center mb-2">
                        <span class="badge badge-ghost text-primary bg-blue-100 border-none text-[10px] font-bold py-3 uppercase">${
                            product.category
                        }</span>
                        <div class="flex items-center gap-1 text-sm font-medium text-gray-600">
                            <i class="fa-solid fa-star text-yellow-400 text-xs"></i> ${
                                product.rating.rate
                            }
                            <span>(${product.rating.count})</span>
                        </div>
                    </div>
                    <h3 class="text-gray-800 font-bold text-base mb-1 truncate" title="${
                        product.title
                    }">${product.title}</h3>
                    <p class="text-xl font-extrabold text-gray-900 mb-6">$${product.price}</p>
                    <div class="flex gap-3 mt-auto">
                        <button onclick="loadProductDetails(${
                            product.id
                        })" class="btn btn-outline border-gray-300 flex-1 hover:bg-gray-100 font-semibold normal-case text-xs"><i class="fa-regular fa-eye mr-2"></i> Details</button>
                        <button onclick='toggleCart(${JSON.stringify(product).replace(
                            /'/g,
                            "&apos;",
                        )})' 
                            class="btn ${
                                isInCart
                                    ? "btn-error text-white"
                                    : "btn-primary bg-[#5851FF] border-none"
                            } flex-1 font-semibold normal-case text-xs">
                            <i class="fa-solid ${
                                isInCart ? "fa-trash" : "fa-cart-shopping"
                            } mr-1"></i>
                            ${isInCart ? "Remove" : "Add"}
                        </button>
                    </div>
                </div>
            </div>
        `;
        trendingContainer.appendChild(card);
    });
};

const loadProductDetails = async (id) => {
    const modalContent = document.getElementById("modal-content");
    modalContent.innerHTML = `<div class="p-20 w-full flex justify-center"><span class="loading loading-bars loading-xl text-primary"></span></div>`;
    product_details_modal.showModal();

    try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        displayProductDetails(data);
    } catch (error) {
        console.error("Error:", error);
    }
};

const displayProductDetails = (product) => {
    const isInCart = cart.some((item) => item.id === product.id);
    const modalContent = document.getElementById("modal-content");

    modalContent.innerHTML = `
        <div class="md:w-1/2 bg-[#F3F4F6] p-10 flex justify-center items-center">
            <img src="${product.image}" alt="${
        product.title
    }" class="max-h-40 sm:max-h-80 object-contain mix-blend-multiply" />
        </div>
        <div class="md:w-1/2 p-8 flex flex-col justify-center">
            <span class="text-primary font-bold text-xs uppercase mb-2">${product.category}</span>
            <h3 class="text-2xl font-extrabold text-gray-900 mb-4 leading-tight">${
                product.title
            }</h3>
            <p class="text-gray-600 text-sm mb-6">${product.description}</p>
            <div class="flex items-center justify-between mb-8">
                <span class="text-3xl font-black text-gray-900">$${product.price}</span>
            </div>
            <div class="flex gap-4">
                <button onclick='toggleCart(${JSON.stringify(product).replace(
                    /'/g,
                    "&apos;",
                )}); product_details_modal.close();' 
                    class="btn ${
                        isInCart ? "btn-error" : "btn-primary bg-[#5851FF]"
                    } flex-1 border-none text-white font-bold">
                    ${isInCart ? "Remove from Cart" : "Add to Cart"}
                </button>
                <button class="btn btn-outline flex-1 font-bold">Buy Now</button>
            </div>
        </div>
    `;
};

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("product-categories");
    categoryContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.className = "category-btn btn btn-primary text-sm font-medium btn-sm rounded-full px-6";
    allBtn.innerText = "All";
    allBtn.onclick = (e) => filterProducts("all", e.target);
    categoryContainer.appendChild(allBtn);

    categories.forEach((category) => {
        const button = document.createElement("button");
        button.className =
            "category-btn btn btn-ghost btn-outline btn-sm text-sm font-medium text-gray-700 border-gray-300 rounded-full px-6 hover:bg-primary hover:text-white hover:border-primary capitalize";
        button.innerText = category;
        button.onclick = (e) => filterProducts(category, e.target);
        categoryContainer.appendChild(button);
    });
};


updateCartUI();
getAllCategories();
getAllProducts();