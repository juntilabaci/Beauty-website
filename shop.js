let cartItems = [];
let wishlist = [];

let products = [];
let selectedBrand = "all";
let selectedType = "all";
let selectedConcern = "all";

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", function () {

  updateCartCount();
  updateWishCount();

  // PRODUCTS
  products = document.querySelectorAll(".card");

  // CART ICON
  const cartIcon = document.getElementById("cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", openCart);
  }

  // FILTERS
  const brandFilter = document.getElementById("brandFilter");
  const typeFilter = document.getElementById("typeFilter");
  const concernFilter = document.getElementById("concernFilter");

  if (brandFilter) {
    brandFilter.addEventListener("change", e => filterBrand(e.target.value));
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", e => filterType(e.target.value));
  }

  if (concernFilter) {
    concernFilter.addEventListener("change", e => filterConcern(e.target.value));
  }

});

/* ================= FILTERS ================= */

function filterBrand(value) {
  selectedBrand = value.toLowerCase();
  applyFilters();
}

function filterType(value) {
  selectedType = value.toLowerCase();
  applyFilters();
}

function filterConcern(value) {
  selectedConcern = value.toLowerCase();
  applyFilters();
}

function applyFilters() {
  products.forEach(card => {

    let brand = card.querySelector("p")?.innerText.toLowerCase() || "";
    let type = card.dataset.type?.toLowerCase() || "";
    let concern = card.dataset.concern?.toLowerCase() || "";

    let show =
      (selectedBrand === "all" || brand.includes(selectedBrand)) &&
      (selectedType === "all" || type.includes(selectedType)) &&
      (selectedConcern === "all" || concern.includes(selectedConcern));

    card.style.display = show ? "" : "none";
  });
}

/* ================= CART ================= */

function addToCart(name, price) {
  cartItems.push({ name, price });
  alert(name + " u shtua në shportë!");
  updateCartCount();
}

function addToCartFromCard(btn) {
  let card = btn.closest(".card");

  let name = card.querySelector("h4")?.innerText || "Produkt";
  let priceText = card.querySelector("span")?.innerText || "€0";

  let price = parseFloat(priceText.replace("€", ""));

  cartItems.push({ name, price });

  alert(name + " u shtua në shportë!");
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  el.innerText = cartItems.length;
}

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
  if (modal) modal.style.display = "flex";
}

function closeCart() {
  const modal = document.getElementById("cartModal");
  if (modal) modal.style.display = "none";
}

/* ================= WISHLIST ================= */

function toggleHeart(el) {
  let card = el.closest(".card");

  let name =
    card?.querySelector("h3")?.innerText ||
    card?.querySelector("h4")?.innerText;

  if (!name) return;

  el.classList.toggle("active");

  if (el.classList.contains("active")) {
    el.innerText = "❤️";
    if (!wishlist.includes(name)) wishlist.push(name);
  } else {
    el.innerText = "♡";
    wishlist = wishlist.filter(p => p !== name);
  }

  updateWishCount();
}

function updateWishCount() {
  const el = document.getElementById("wish-count");
  if (!el) return;
  el.innerText = wishlist.length;
}

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
  if (modal) modal.style.display = "flex";
}

function closeWishlist() {
  let modal = document.getElementById("wishlistModal");
  if (modal) modal.style.display = "none";
}

/* ================= LOGIN ================= */

function openLogin() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "flex";
}

function closeLogin() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
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

  let results = Array.from(products).filter(p =>
    (p.querySelector("h4")?.innerText || "")
      .toLowerCase()
      .includes(value.toLowerCase())
  );

  results.forEach(p => {
    let div = document.createElement("div");
    div.className = "suggestion-item";

    div.innerHTML = `
      <strong>${p.querySelector("h4")?.innerText || ""}</strong><br>
      <small>${p.querySelector("span")?.innerText || ""}</small>
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

/* ================= OUTSIDE CLICK ================= */

window.onclick = function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
};