let products = [];
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateCartCount();
  updateWishlistCount();
  syncHearts();
});


async function loadProducts() {
  try {
    const res = await fetch("http://localhost:3000/products");

    if (!res.ok) {
      console.log("Server error:", res.status);
      return;
    }

    products = await res.json();

    renderProducts();

  } catch (err) {
    console.log("FETCH ERROR:", err);
  }
}

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

  syncHearts();
}


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


function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function toggleHeart(btn) {
  let card = btn.closest(".product");

  let name = card.dataset.name;
  let price = parseFloat(card.dataset.price);

  let wishlist = getWishlist();

  let exists = wishlist.find(p => p.name === name);

  if (!exists) {
    wishlist.push({ name, price });
    btn.innerText = "❤️";
  } else {
    wishlist = wishlist.filter(p => p.name !== name);
    btn.innerText = "♡";
  }

  saveWishlist(wishlist);
  updateWishlistCount();
}


function updateWishlistCount() {
  const el = document.getElementById("wishlist-count");
  if (el) el.innerText = getWishlist().length;
}


function syncHearts() {
  const wishlist = getWishlist();

  document.querySelectorAll(".product").forEach(product => {
    const name = product.dataset.name;
    const btn = product.querySelector("button[onclick='toggleHeart(this)']");

    if (!btn) return;

    if (wishlist.find(p => p.name === name)) {
      btn.innerText = "❤️";
    } else {
      btn.innerText = "♡";
    }
  });
}


updateCartCount();
updateWishlistCount();


function openFav() {
  const modal = document.getElementById("wishlistModal");
  const table = document.getElementById("wishlistTable");

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  table.innerHTML = "";

  if (wishlist.length === 0) {
    table.innerHTML = "<tr><td>Wishlist is empty</td></tr>";
  }

  wishlist.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>€${p.price}</td>
        <td><button onclick="removeWishlistItem('${p.name}')">X</button></td>
      </tr>
    `;
  });

  modal.style.display = "flex";
}

function removeWishlistItem(name) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlist = wishlist.filter(p => p.name !== name);

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  openFav();
  updateWishlistCount();
}

function openCart() {
  const modal = document.getElementById("cartModal");
  const table = document.getElementById("cartTable");
  const totalEl = document.getElementById("cartTotal");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  table.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    table.innerHTML = "<tr><td>Cart is empty</td></tr>";
  }

  cart.forEach(p => {
    total += Number(p.price);

    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>€${p.price}</td>
        <td><button onclick="removeCartItem('${p.name}')">X</button></td>
      </tr>
    `;
  });

  totalEl.innerText = "Total: €" + total.toFixed(2);

  modal.style.display = "flex";
}

function removeCartItem(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.filter(p => p.name !== name);

  localStorage.setItem("cart", JSON.stringify(cart));

  openCart();
  updateCartCount();
}

function closeWishlist() {
  document.getElementById("wishlistModal").style.display = "none";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}