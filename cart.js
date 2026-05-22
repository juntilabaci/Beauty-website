document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const grid = document.getElementById("cartGrid");
  const totalEl = document.getElementById("total");
  const cart = getCart();

  if (cart.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div style="font-size:60px;">🛒</div>
        <h3>Shporta është bosh</h3>
        <p>Shto produkte për të vazhduar me porosinë.</p>
        <a href="shop.html" class="btn-back">Shko te Shop</a>
      </div>`;
    if (totalEl) totalEl.innerText = "";
    return;
  }

  let total = 0;
  grid.innerHTML = cart.map(p => {
    const qty = p.qty || 1;
    const subtotal = (p.price * qty).toFixed(2);
    total += parseFloat(subtotal);
    return `
      <div class="cart-row">
        <img src="${p.image || 'https://via.placeholder.com/80'}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/80'">
        <div class="cart-info">
          <h4>${p.name}</h4>
          <p>€${Number(p.price).toFixed(2)} / copë</p>
        </div>
        <div class="cart-qty">
          <button onclick="changeQty('${p.name}', -1)">−</button>
          <span>${qty}</span>
          <button onclick="changeQty('${p.name}', 1)">+</button>
        </div>
        <div class="cart-subtotal">€${subtotal}</div>
        <button class="cart-remove" onclick="removeItem('${p.name}')">✕</button>
      </div>`;
  }).join("");

  if (totalEl) totalEl.innerText = `Total: €${total.toFixed(2)}`;
}

function changeQty(name, delta) {
  let cart = getCart();
  const item = cart.find(p => p.name === name);
  if (!item) return;
  item.qty = (item.qty || 1) + delta;
  if (item.qty <= 0) cart = cart.filter(p => p.name !== name);
  saveCart(cart);
  renderCart();
}

function removeItem(name) {
  saveCart(getCart().filter(p => p.name !== name));
  renderCart();
}
