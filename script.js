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
    window.productsReady = true;

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
      <div class="product"
        data-id="${p.id}"
        data-name="${p.name}"
        data-brand="${p.brand}"
        data-price="${p.price}">

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

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

/* ===================== WISHLIST ===================== */
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

function openFav() {
  const modal = document.getElementById("wishlistModal");
  const table = document.getElementById("wishlistTable");

  const wishlist = getWishlist();

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
  let wishlist = getWishlist();

  wishlist = wishlist.filter(p => p.name !== name);

  saveWishlist(wishlist);
  openFav();
  updateWishlistCount();
}

function closeWishlist() {
  document.getElementById("wishlistModal").style.display = "none";
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

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("suggestions");

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase().trim();

    suggestionsBox.innerHTML = "";

    if (!value) {
      suggestionsBox.style.display = "none";
      return;
    }

    const filtered = products.filter(p =>
      (p.name || "").toLowerCase().includes(value)
    );

    if (filtered.length === 0) {
      suggestionsBox.innerHTML = "<div class='suggestion-item'>No results</div>";
      suggestionsBox.style.display = "block";
      return;
    }

    filtered.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("suggestion-item");
      div.innerText = p.name;

      div.onclick = () => {
        searchInput.value = p.name;
        suggestionsBox.style.display = "none";

        const productEl = document.querySelector(`.product[data-name="${p.name}"]`);

        if (productEl) {
          productEl.scrollIntoView({ behavior: "smooth", block: "center" });

          productEl.style.border = "2px solid #4da6ff";

          setTimeout(() => {
            productEl.style.border = "none";
          }, 1500);
        }
      };

      suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
      suggestionsBox.style.display = "none";
    }
  });
});
const loginModal = document.getElementById("loginModal");

function openLogin() {
  loginModal.classList.add("show");
}

function closeLogin() {
  loginModal.classList.remove("show");
}

loginModal.addEventListener("click", (e) => {
  if (e.target === loginModal) closeLogin();
});

function showMessage(text) {
  let box = document.getElementById("messageBox");
  let msg = document.getElementById("messageText");

  msg.innerText = text;
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = loginModal.querySelectorAll("button");

  const loginBtn = buttons[0];
  const registerBtn = buttons[1];

  loginBtn.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPass").value;

    if (!email || !pass) {
      showMessage("Plotëso email dhe password!");
      return;
    }

    showMessage(`Mirë se erdhe ${user || email} ✅`);
    closeLogin();
  });

  registerBtn.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value;
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPass").value;

    if (!user || !email || !pass) {
      showMessage("Plotëso të gjitha fushat!");
      return;
    }

    showMessage(`U regjistrua me sukses ${user} 🎉`);
    closeLogin();
  });
});
function showMessage(text) {
  const box = document.getElementById("messageBox");
  const msg = document.getElementById("messageText");

  msg.innerText = text;
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 2000);
}
function addToCart(name, price) {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  cartItems.push({ name, price });

  localStorage.setItem("cart", JSON.stringify(cartItems));

  updateCartCount();
}