document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
});

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div style="font-size:60px;">❤️</div>
        <h3>Wishlist është bosh</h3>
        <p>Shto produktet e preferuara nga shop.</p>
        <a href="shop.html" class="btn-back">Shko te Shop</a>
      </div>`;
    return;
  }

  grid.innerHTML = wishlist.map(p => `
    <div class="wish-card">
      <img src="${p.image || 'https://via.placeholder.com/200'}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/200'">
      <div class="wish-info">
        <h4>${p.name}</h4>
        <p>€${Number(p.price).toFixed(2)}</p>
        <div class="wish-actions">
          <button onclick="moveToCart('${p.name}')" class="btn-cart">🛒 Shto në shportë</button>
          <button onclick="removeItem('${p.name}')" class="btn-remove">✕ Hiq</button>
        </div>
      </div>
    </div>`).join("");
}

function moveToCart(name) {
  const wishlist = getWishlist();
  const item = wishlist.find(p => p.name === name);
  if (!item) return;

  let cart = getCart();
  const existing = cart.find(p => p.name === name);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ name: item.name, price: item.price, image: item.image, qty: 1 });
  }
  saveCart(cart);
  removeItem(name);

  const msg = document.getElementById("wl-message");
  if (msg) { msg.style.display = "block"; setTimeout(() => msg.style.display = "none", 2000); }
}

function removeItem(name) {
  saveWishlist(getWishlist().filter(p => p.name !== name));
  renderWishlist();
}
