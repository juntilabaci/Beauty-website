let cartItems = [];
let wishlist = [];

/* ================= CART ================= */
function updateCartCount() {
  let cartCount = document.getElementById("cart-count"); // FIX OK
  if (cartCount) {
    cartCount.innerText = cartItems.length;
  }
}

function addToCart(name, price) {
  cartItems.push({ name, price });
  updateCartCount();
}

/* ================= CART FROM CARD ================= */
function addToCartFromCard(btn) {
  let card = btn.closest(".product") || btn.parentElement; // FIX: product

  let name =
    card.querySelector("h3")?.innerText ||
    card.querySelector("h4")?.innerText;

  let priceText =
    card.querySelector("span")?.innerText ||
    card.querySelector("p")?.innerText;

  let price = parseFloat(priceText?.replace("€", ""));

  if (!name || isNaN(price)) return;

  cartItems.push({ name, price });
  updateCartCount();
}

/* ================= OPEN CART ================= */
function openCart() {
  let table = document.getElementById("cartTable");
  let total = 0;

  if (!table) return;

  table.innerHTML = "";

  if (cartItems.length === 0) {
    table.innerHTML = "<tr><td>Shporta është bosh</td></tr>";
  } else {
    cartItems.forEach(item => {
      total += item.price;

      table.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>€${item.price}</td>
        </tr>
      `;
    });
  }

  let totalEl = document.getElementById("cartTotal");
  if (totalEl) totalEl.innerText = "Total: €" + total;

  let modal = document.getElementById("cartModal");
  if (modal) modal.classList.add("show");
}

function closeCart() {
  let modal = document.getElementById("cartModal");
  if (modal) modal.classList.remove("show");
}

/* ================= WISHLIST ================= */
function toggleHeart(el) {
  let card = el.closest(".product") || el.parentElement; // FIX: product

  let name =
    card.querySelector("h3")?.innerText ||
    card.querySelector("h4")?.innerText;

  if (!name) return;

  el.classList.toggle("active");

  if (el.classList.contains("active")) {
    el.innerText = "❤️";
    if (!wishlist.includes(name)) wishlist.push(name);
  } else {
    el.innerText = "♡";
    wishlist = wishlist.filter(p => p !== name);
  }
}

/* ================= OPEN WISHLIST ================= */
function openFav() {
  let table = document.getElementById("wishlistTable");
  if (!table) return;

  table.innerHTML = "";

  if (wishlist.length === 0) {
    table.innerHTML = "<tr><td>Wishlist është bosh</td></tr>";
  } else {
    wishlist.forEach(item => {
      table.innerHTML += `<tr><td>${item}</td></tr>`;
    });
  }

  let modal = document.getElementById("wishlistModal");
  if (modal) modal.classList.add("show");
}

function closeWishlist() {
  let modal = document.getElementById("wishlistModal");
  if (modal) modal.classList.remove("show");
}

/* ================= LOGIN ================= */
function openLogin() {
  let modal = document.getElementById("loginModal");
  if (modal) modal.classList.add("show");
}

function closeLogin() {
  let modal = document.getElementById("loginModal");
  if (modal) modal.classList.remove("show");
}

/* ================= PRODUCTS ================= */
let products = Array.from(document.querySelectorAll(".product"));

function filterBrand(brand) {
  products.forEach(p => {
    p.style.display =
      brand === "all" || p.dataset.brand === brand
        ? "block"
        : "none";
  });
}

/* ================= SEARCH ================= */
const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

function searchEngine(value) {
  if (!suggestionsBox) return;

  suggestionsBox.innerHTML = "";

  if (!value) {
    suggestionsBox.style.display = "none";
    return;
  }

  let results = products.filter(p =>
    p.dataset.name.toLowerCase().includes(value.toLowerCase())
  );

  results.forEach(p => {
    let div = document.createElement("div");
    div.className = "suggestion-item";

    div.innerHTML = `
      <strong>${p.dataset.name}</strong><br>
      <small>€${p.dataset.price}</small>
    `;

    div.onclick = () => {
      p.scrollIntoView({ behavior: "smooth" });
      suggestionsBox.style.display = "none";
    };

    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
}

if (searchInput) {
  searchInput.addEventListener("keyup", e => searchEngine(e.target.value));
}

/* ================= CLOSE MODALS CLICK OUTSIDE ================= */
window.onclick = function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("show");
  }
};