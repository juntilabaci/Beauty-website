let products = [];
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateCartCount();
  updateWishlistCount();
  syncHearts();
  restoreLoginState();
  setupHamburger();
  setupLoginModal();
  setupSearch();
});

// ─── Products ───────────────────────────────────────────────────────────────

async function loadProducts() {
  try {
    const res = await fetch("db.json");
    if (!res.ok) return;
    products = (await res.json()).products;
    renderProducts();
    window.productsReady = true;
  } catch (e) {}
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product" data-id="${p.id}" data-name="${p.name}" data-brand="${p.brand}" data-price="${p.price}">
      <img src="${p.image}" onerror="this.src='https://via.placeholder.com/400x400'" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <span>€${Number(p.price).toFixed(2)}</span>
      <button class="btn-add" onclick="addToCartFromCard(this)">Add to Cart</button>
      <span class="heart" onclick="toggleHeart(this)">♡</span>
    </div>
  `).join("");
  syncHearts();
}

// ─── Cart ────────────────────────────────────────────────────────────────────

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  cartItems = cart;
  updateCartCount();
}

function addToCartFromCard(btn) {
  const card = btn.closest(".product");
  const name = card.dataset.name;
  const price = parseFloat(card.dataset.price);
  const image = card.querySelector("img")?.src || "";

  let cart = getCart();
  const existing = cart.find(p => p.name === name);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }
  saveCart(cart);
  addLoyaltyPoints(Math.floor(price));
  showMessage(`✅ Shtuar në shportë`);
}

function addToCart(name, price, image = "") {
  let cart = getCart();
  const existing = cart.find(p => p.name === name);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }
  saveCart(cart);
  addLoyaltyPoints(Math.floor(price));
  showMessage(`✅ Shtuar në shportë`);
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, p) => sum + (p.qty || 1), 0);
  const el = document.getElementById("cart-count");
  if (el) el.innerText = total;
}

function openCart() {
  const modal = document.getElementById("cartModal");
  const table = document.getElementById("cartTable");
  const totalEl = document.getElementById("cartTotal");
  if (!modal) return;

  const cart = getCart();
  let total = 0;

  if (cart.length === 0) {
    table.innerHTML = "<tr><td colspan='5' style='text-align:center;padding:20px;'>Shporta është bosh 🛒</td></tr>";
  } else {
    table.innerHTML = `
      <tr style="font-size:12px;color:#888;border-bottom:2px solid #eee;">
        <th style="padding:6px;text-align:left;">Produkti</th>
        <th style="padding:6px;">Çmimi</th>
        <th style="padding:6px;">Sasia</th>
        <th style="padding:6px;">Totali</th>
        <th></th>
      </tr>` +
      cart.map(p => {
        const qty = p.qty || 1;
        const subtotal = (p.price * qty).toFixed(2);
        total += parseFloat(subtotal);
        return `
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:8px;font-size:13px;max-width:150px;">${p.name}</td>
            <td style="padding:8px;font-size:13px;">€${Number(p.price).toFixed(2)}</td>
            <td style="padding:8px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <button onclick="changeQty('${p.name}',-1)" class="qty-btn">−</button>
                <span style="min-width:20px;text-align:center;">${qty}</span>
                <button onclick="changeQty('${p.name}',1)" class="qty-btn">+</button>
              </div>
            </td>
            <td style="padding:8px;font-size:13px;">€${subtotal}</td>
            <td style="padding:8px;"><button onclick="removeCartItem('${p.name}')" class="remove-btn">✕</button></td>
          </tr>`;
      }).join("");
  }

  totalEl.innerText = cart.length ? `Total: €${total.toFixed(2)}` : "";
  modal.style.display = "flex";
}

function changeQty(name, delta) {
  let cart = getCart();
  const item = cart.find(p => p.name === name);
  if (!item) return;
  item.qty = (item.qty || 1) + delta;
  if (item.qty <= 0) cart = cart.filter(p => p.name !== name);
  saveCart(cart);
  openCart();
}

function removeCartItem(name) {
  let cart = getCart().filter(p => p.name !== name);
  saveCart(cart);
  openCart();
}

function closeCart() {
  const m = document.getElementById("cartModal");
  if (m) m.style.display = "none";
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

function toggleHeart(btn) {
  const card = btn.closest(".product");
  const name = card.dataset.name;
  const price = parseFloat(card.dataset.price);
  const image = card.querySelector("img")?.src || "";

  let wishlist = getWishlist();
  const exists = wishlist.find(p => p.name === name);

  if (!exists) {
    wishlist.push({ name, price, image });
    btn.innerText = "❤️";
    showMessage("❤️ Shtuar në wishlist");
  } else {
    wishlist = wishlist.filter(p => p.name !== name);
    btn.innerText = "♡";
    showMessage("Hequr nga wishlist");
  }

  saveWishlist(wishlist);
}

function updateWishlistCount() {
  const el = document.getElementById("wishlist-count");
  if (el) el.innerText = getWishlist().length;
}

function openFav() {
  const modal = document.getElementById("wishlistModal");
  const table = document.getElementById("wishlistTable");
  if (!modal) return;

  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    table.innerHTML = "<tr><td style='text-align:center;padding:20px;'>Wishlist është bosh ❤️</td></tr>";
  } else {
    table.innerHTML = wishlist.map(p => `
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:8px;font-size:13px;">${p.name}</td>
        <td style="padding:8px;font-size:13px;">€${Number(p.price).toFixed(2)}</td>
        <td style="padding:8px;">
          <button onclick="moveToCart('${p.name}')" class="qty-btn" title="Shto në shportë">🛒</button>
        </td>
        <td style="padding:8px;">
          <button onclick="removeWishlistItem('${p.name}')" class="remove-btn">✕</button>
        </td>
      </tr>`).join("");
  }

  modal.style.display = "flex";
}

function moveToCart(name) {
  const wishlist = getWishlist();
  const item = wishlist.find(p => p.name === name);
  if (item) {
    addToCart(item.name, item.price, item.image);
    removeWishlistItem(name);
  }
}

function removeWishlistItem(name) {
  saveWishlist(getWishlist().filter(p => p.name !== name));
  openFav();
  syncHearts();
}

function closeWishlist() {
  const m = document.getElementById("wishlistModal");
  if (m) m.style.display = "none";
}

function syncHearts() {
  const wishlist = getWishlist();
  document.querySelectorAll(".product").forEach(product => {
    const name = product.dataset.name;
    const heart = product.querySelector(".heart");
    if (!heart) return;
    heart.innerText = wishlist.find(p => p.name === name) ? "❤️" : "♡";
  });
}

// ─── Loyalty Points ──────────────────────────────────────────────────────────

function addLoyaltyPoints(pts) {
  const current = parseInt(localStorage.getItem("loyaltyPoints") || "0");
  localStorage.setItem("loyaltyPoints", current + pts);
}

// ─── Login ───────────────────────────────────────────────────────────────────

function setupLoginModal() {
  const loginModal = document.getElementById("loginModal");
  if (!loginModal) return;

  loginModal.addEventListener("click", e => {
    if (e.target === loginModal) closeLogin();
  });

  document.getElementById("loginBtn")?.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value;
    if (!email || !pass) { showMessage("Plotëso email dhe fjalëkalimin!"); return; }

    const users = JSON.parse(localStorage.getItem("solavieUsers") || "[]");
    const found = users.find(u => u.email === email && u.pass === pass);
    if (!found) { showMessage("Email ose fjalëkalim i gabuar!"); return; }

    localStorage.setItem("loggedUser", JSON.stringify(found));
    showMessage(`Mirë se erdhe ${found.user || email} ✅`);
    closeLogin();
    updateUserIcon();
  });

  document.getElementById("registerBtn")?.addEventListener("click", () => {
    const user = document.getElementById("loginUser").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value;
    if (!user || !email || !pass) { showMessage("Plotëso të gjitha fushat!"); return; }

    let users = JSON.parse(localStorage.getItem("solavieUsers") || "[]");
    if (users.find(u => u.email === email)) { showMessage("Ky email ekziston tashmë!"); return; }

    users.push({ user, email, pass });
    localStorage.setItem("solavieUsers", JSON.stringify(users));
    localStorage.setItem("loggedUser", JSON.stringify({ user, email }));
    showMessage(`U regjistrua me sukses ${user} 🎉`);
    closeLogin();
    updateUserIcon();
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
    updateUserIcon();
    closeLogin();
    showMessage("U çkyçe me sukses");
  });
}

function restoreLoginState() {
  updateUserIcon();
}

function updateUserIcon() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "null");
  const nameEl = document.getElementById("loggedUserName");
  const loginSection = document.querySelector("#loginModal .d-flex");
  const logoutSection = document.getElementById("logoutSection");
  const title = document.getElementById("loginModalTitle");

  if (loggedUser) {
    if (nameEl) nameEl.innerText = loggedUser.user || "";
    if (loginSection) loginSection.style.display = "none";
    if (logoutSection) logoutSection.style.display = "block";
    if (title) title.innerText = `👤 ${loggedUser.user || loggedUser.email}`;
  } else {
    if (nameEl) nameEl.innerText = "";
    if (loginSection) loginSection.style.display = "flex";
    if (logoutSection) logoutSection.style.display = "none";
    if (title) title.innerText = "Login / Register";
  }
}

function openLogin() {
  const m = document.getElementById("loginModal");
  if (m) { m.classList.add("show"); updateUserIcon(); }
}

function closeLogin() {
  const m = document.getElementById("loginModal");
  if (m) m.classList.remove("show");
}

// ─── Hamburger ───────────────────────────────────────────────────────────────

function setupHamburger() {
  const btn = document.getElementById("hamburgerBtn");
  const nav = document.getElementById("mainNav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
    btn.classList.toggle("active");
  });
}

// ─── Message ─────────────────────────────────────────────────────────────────

function showMessage(text) {
  const box = document.getElementById("messageBox");
  const msg = document.getElementById("messageText");
  if (!box || !msg) return;
  msg.innerText = text;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 2200);
}

// ─── Search ──────────────────────────────────────────────────────────────────

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchMobile = document.getElementById("searchInputMobile");
  const suggestionsBox = document.getElementById("suggestions");

  function handleSearch(value) {
    if (!suggestionsBox) return;
    suggestionsBox.innerHTML = "";
    if (!value) { suggestionsBox.style.display = "none"; return; }

    const filtered = products.filter(p =>
      (p.name || "").toLowerCase().includes(value) ||
      (p.brand || "").toLowerCase().includes(value)
    );

    if (filtered.length === 0) {
      suggestionsBox.innerHTML = "<div class='suggestion-item'>No results</div>";
    } else {
      filtered.slice(0, 8).forEach(p => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.innerText = p.name;
        div.onclick = () => { window.location.href = `shop.html?search=${encodeURIComponent(p.name)}`; };
        suggestionsBox.appendChild(div);
      });
    }
    suggestionsBox.style.display = "block";
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => handleSearch(searchInput.value.toLowerCase().trim()));
    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && searchInput.value.trim())
        window.location.href = `shop.html?search=${encodeURIComponent(searchInput.value.trim())}`;
    });
  }

  if (searchMobile) {
    searchMobile.addEventListener("keydown", e => {
      if (e.key === "Enter" && searchMobile.value.trim())
        window.location.href = `shop.html?search=${encodeURIComponent(searchMobile.value.trim())}`;
    });
  }

  document.addEventListener("click", e => {
    if (suggestionsBox && !e.target.closest(".search-wrapper"))
      suggestionsBox.style.display = "none";
  });
}

// ─── URL search param on page load ──────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const search = new URLSearchParams(window.location.search).get("search");
  if (!search) return;
  const interval = setInterval(() => {
    if (window.productsReady) { applySearch(search); clearInterval(interval); }
  }, 100);
});

function applySearch(value) {
  value = value.toLowerCase();
  const filtered = products.filter(p =>
    (p.name || "").toLowerCase().includes(value) ||
    (p.brand || "").toLowerCase().includes(value)
  );
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = filtered.map(p => `
    <div class="product" data-id="${p.id}" data-name="${p.name}" data-brand="${p.brand}" data-price="${p.price}">
      <img src="${p.image}" onerror="this.src='https://via.placeholder.com/400x400'" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <span>€${Number(p.price).toFixed(2)}</span>
      <button class="btn-add" onclick="addToCartFromCard(this)">Add to Cart</button>
      <span class="heart" onclick="toggleHeart(this)">♡</span>
    </div>
  `).join("");
  syncHearts();
}
