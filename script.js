let cartItems = [];
let wishlist = [];

/* ================= CART ================= */
function addToCart(name, price) {
  cartItems.push({ name, price });

  let cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.innerText = cartItems.length;
  }
}

/* ================= CART FROM CARD (SHOP) ================= */
function addToCartFromCard(btn) {
  let card = btn.closest(".card") || btn.parentElement;

  let name =
    card.querySelector("h3")?.innerText ||
    card.querySelector("h4")?.innerText;

  let priceText =
    card.querySelector("span")?.innerText ||
    card.querySelector("p")?.innerText;

  let price = parseFloat(priceText?.replace("€", ""));

  if (!name || isNaN(price)) return;

  cartItems.push({ name, price });

  let cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.innerText = cartItems.length;
  }
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
  if (modal) modal.style.display = "flex";
}

function closeCart() {
  let modal = document.getElementById("cartModal");
  if (modal) modal.style.display = "none";
}

/* ================= WISHLIST ================= */
function toggleHeart(el) {
  let card = el.closest(".card") || el.parentElement;

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
  if (modal) modal.style.display = "flex";
}

function closeWishlist() {
  let modal = document.getElementById("wishlistModal");
  if (modal) modal.style.display = "none";
}

/* ================= LOGIN ================= */
function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
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

/* ================= CLOSE MODALS ================= */
window.onclick = function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
};