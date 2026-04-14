let products = [];
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateCartCount();
});

/* ================= LOAD PRODUCTS ================= */
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");

    if (!res.ok) {
      console.log("Server error:", res.status);
      return;
    }

    products = await res.json();

    console.log("PRODUCTS LOADED:", products.length);

    renderProducts();

  } catch (err) {
    console.log("FETCH ERROR:", err);
  }
}

/* ================= RENDER ================= */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  let html = "";

  products.forEach(p => {
    html += `
      <div class="product" data-name="${p.name}" data-brand="${p.brand}" data-price="${p.price}">

        <img src="${p.image}" onerror="this.src='https://via.placeholder.com/400x400'">

        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span>€${Number(p.price).toFixed(2)}</span>

        <button onclick="addToCartFromCard(this)">Add to Cart</button>
        <button onclick="toggleHeart(this)">♡</button>

      </div>
    `;
  });

  grid.innerHTML = html;
}

/* ================= CART ================= */
function addToCartFromCard(btn) {
  let card = btn.closest(".product");

  let name = card.dataset.name;
  let price = parseFloat(card.dataset.price);

  cartItems.push({ name, price });

  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.innerText = cartItems.length;
}

/* ================= WISHLIST ================= */
function toggleHeart(btn) {
  let card = btn.closest(".product");

  let name = card.dataset.name;
  let price = parseFloat(card.dataset.price);

  let exists = wishlist.find(p => p.name === name);

  if (!exists) {
    wishlist.push({ name, price });
    btn.innerText = "❤️";
  } else {
    wishlist = wishlist.filter(p => p.name !== name);
    btn.innerText = "♡";
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

/* ================= INIT ================= */
updateCartCount();