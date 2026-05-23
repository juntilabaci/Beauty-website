const grid = document.getElementById("productGrid");

let filtered = [];
let activeCategory = "all";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  updateWishlistCount();

  document.getElementById("brandFilter")?.addEventListener("change", applyFilters);
  document.getElementById("typeFilter")?.addEventListener("change", applyFilters);
  document.getElementById("concernFilter")?.addEventListener("change", applyFilters);
});


async function loadProducts() {
  if (grid) {
    grid.innerHTML = Array(8).fill('').map(() =>
      `<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-body"><div class="skeleton-line w-40"></div><div class="skeleton-line w-70"></div><div class="skeleton-line w-55"></div></div></div>`
    ).join('');
  }
  try {
    const res = await fetch("db.json");

    if (!res.ok) {
      console.log("Server error:", res.status);
      return;
    }

    const data = await res.json();

    products = Array.isArray(data) ? data : (data.products || []);
    filtered = products;
    window.productsReady = true;

    // Lexo URL parametrin PARA populateFilters() — keshtu filters jane korrekte
    const urlParams      = new URLSearchParams(window.location.search);
    const typeParam      = urlParams.get("type");
    const brandParam     = urlParams.get("brand");
    const searchParam    = urlParams.get("search");
    const categoryParam  = urlParams.get("category");

    if (categoryParam) activeCategory = categoryParam.toLowerCase();

    populateFilters();
    updateShopTitle();

    if (typeParam) {
      const typeFilter = document.getElementById("typeFilter");
      if (typeFilter) typeFilter.value = typeParam;
    }
    if (brandParam) {
      const brandFilter = document.getElementById("brandFilter");
      if (brandFilter) brandFilter.value = brandParam.toLowerCase();
    }

    if (typeParam || brandParam || categoryParam) {
      applyFilters();
    } else if (searchParam) {
      applySearch(searchParam);
      const searchInput = document.getElementById("searchInput");
      if (searchInput) searchInput.value = searchParam;
    } else {
      render(filtered);
    }

  } catch (err) {
    console.log("FETCH ERROR:", err);
  }
}


function matchesCat(p) {
  if (activeCategory === "all") return true;
  if (activeCategory === "skincare") return !p.category || p.category.toLowerCase() === "skincare";
  return (p.category || "").toLowerCase() === activeCategory;
}

function populateFilters() {
  const catProducts = products.filter(matchesCat);

  /* ── Brands ── */
  const brands = [...new Set(
    catProducts.map(p => (p.brand || "").trim()).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const brandSel = document.getElementById("brandFilter");
  if (brandSel) {
    brandSel.innerHTML = '<option value="all">All Brands</option>';
    brands.forEach(b => {
      const opt = document.createElement("option");
      opt.value = b.toLowerCase();
      opt.textContent = b;
      brandSel.appendChild(opt);
    });
  }

  /* ── Types ── */
  const typeLabels = {
    cleanser:     "Cleanser",
    serum:        "Serum",
    toner:        "Toner",
    cream:        "Cream",
    sunscreen:    "Sunscreen",
    mask:         "Mask",
    patch:        "Patch",
    gel:          "Gel",
    essence:      "Essence",
    exfoliant:    "Exfoliant",
    retinol:      "Retinol",
    oil:          "Oil",
    moisturizer:  "Moisturizer",
    lipcare:      "Lip Care",
    pad:          "Pad",
    peel:         "Peel",
    lotion:       "Lotion",
    shampoo:      "Shampo",
    conditioner:  "Gërshet",
    treatment:    "Maskë & Trajtim",
    foundation:   "Fondotinte",
    lipstick:     "Buzëkuqe & Gloss",
    brushes:      "Furça",
    powder:       "Pudër & Bronzer",
    "body-lotion":"Krem & Locion",
    "body-wash":  "Xhel Dushi",
    "body-scrub": "Skrab",
    "body-oil":   "Vaj Trupi",
    "foot-cream": "Duar & Këmbë",
    edp:          "Eau de Parfum",
    edt:          "Eau de Toilette",
    "body-mist":  "Body Mist",
  };

  const types = [...new Set(
    catProducts.map(p => (p.type || "").trim().toLowerCase()).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const typeSel = document.getElementById("typeFilter");
  if (typeSel) {
    typeSel.innerHTML = '<option value="all">All Types</option>';
    types.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = typeLabels[t] || (t.charAt(0).toUpperCase() + t.slice(1));
      typeSel.appendChild(opt);
    });

    // Shto ofertën gjithmonë në fund
    const offerOpt = document.createElement("option");
    offerOpt.value = "ofertat";
    offerOpt.textContent = "🏷️ Ofertat";
    typeSel.appendChild(offerOpt);
  }

  /* ── Concerns ── */
  const concerns = [...new Set(
    catProducts.map(p => (p.concern || "").trim()).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  const concernSel = document.getElementById("concernFilter");
  if (concernSel) {
    if (concerns.length === 0) {
      concernSel.style.display = "none";
    } else {
      concernSel.style.display = "";
      concernSel.innerHTML = '<option value="all">All Concerns</option>';
      concerns.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.toLowerCase();
        opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
        concernSel.appendChild(opt);
      });
    }
  }
}


function updateShopTitle() {
  const titles = {
    skincare: "Kujdesi për Lëkurë",
    hair:     "Flokët",
    makeup:   "Make Up",
    body:     "Trupi",
    parfum:   "Parfume",
  };
  const h1 = document.querySelector(".shop-header h1");
  if (h1) h1.textContent = titles[activeCategory] || "Shop";
}


function applyFilters() {
  const brand   = (document.getElementById("brandFilter")?.value   || "all").toLowerCase();
  const type    = (document.getElementById("typeFilter")?.value    || "all").toLowerCase();
  const concern = (document.getElementById("concernFilter")?.value || "all").toLowerCase();

  filtered = products.filter(p => {
    const matchBrand =
      brand === "all" || (p.brand || "").toLowerCase() === brand;

    const matchType =
      type === "ofertat"
        ? p.offer === true
        : type === "all" || (p.type || "").toLowerCase() === type;

    const matchConcern =
      concern === "all" || (p.concern || "").toLowerCase().includes(concern);

    return matchBrand && matchType && matchConcern && matchesCat(p);
  });

  render(filtered);
}


const typeImages = {
  cleanser: [
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad7a7e?auto=format&fit=crop&w=600&q=80"
  ],
  serum: [
    "https://images.unsplash.com/photo-1612810436541-336d7c7a1b4b?auto=format&fit=crop&w=600&q=80"
  ],
  cream: [
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=600&q=80"
  ],
  toner: [
    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=600&q=80"
  ]
};

function getImage(type, id) {
  const images = typeImages[type];
  if (!images) return "https://via.placeholder.com/600x600?text=No+Image";
  return images[0];
}

function render(list) {
  if (!grid) return;

  if (!Array.isArray(list) || list.length === 0) {
    grid.innerHTML = `
      <div style="text-align:center;padding:70px 20px;grid-column:1/-1;">
        <div style="font-size:48px;margin-bottom:14px;">🔍</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:8px;color:#111;">Asnjë produkt nuk u gjet</h3>
        <p style="color:#888;margin-bottom:22px;">Provo me terma të tjera ose shiko të gjitha produktet.</p>
        <a href="shop.html" style="display:inline-block;padding:11px 26px;background:#111;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;">Shiko të gjitha →</a>
      </div>`;
    return;
  }

  const wishlist = getWishlist();

  grid.innerHTML = list.map(p => {
    const isFav      = wishlist.some(w => String(w.id) === String(p.id));
    const discount   = p.discount || 20;
    const finalPrice = p.offer
      ? (Number(p.price) * (1 - discount / 100)).toFixed(2)
      : null;
    const desc = (p.desc || "").length > 72
      ? p.desc.substring(0, 72) + "…"
      : (p.desc || "");

    return `
      <div class="card" onclick="goToProduct('${p.id}')">
        <div class="card-img-box">
          <img src="${p.image || getImage(p.type, p.id)}" alt="${p.name}"
               onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
          ${p.offer ? `<span class="offer-ribbon">-${discount}%</span>` : ""}
          <button class="card-wish${isFav ? " wished" : ""}"
                  onclick="event.stopPropagation(); addToWishlist('${p.id}', this)">
            ${isFav ? "❤️" : "♡"}
          </button>
          <div class="card-overlay">
            <button class="card-overlay-btn"
                    onclick="event.stopPropagation(); addToCart('${p.id}')">
              Shto në Shportë
            </button>
          </div>
        </div>
        <div class="card-body">
          <span class="card-brand-tag">${p.brand || ""}</span>
          <h4>${p.name}</h4>
          <p class="card-desc">${desc}</p>
          ${p.offer ? `<span class="stock-badge">⚡ Vetëm ${(p.id % 5) + 1} të mbetur!</span>` : ""}
          <div class="card-footer">
            <div class="card-prices">
              ${p.offer
                ? `<span class="old-price">€${Number(p.price).toFixed(2)}</span>
                   <span class="new-price">€${finalPrice}</span>`
                : `<span class="card-price">€${Number(p.price).toFixed(2)}</span>`
              }
            </div>
            <button class="card-add-btn"
                    onclick="event.stopPropagation(); addToCart('${p.id}')"
                    title="Shto në shportë">+</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}


function addToCart(id) {
  const item = products.find(p => String(p.id) === String(id));
  if (!item) return;

  const existing = cart.find(i => String(i.id) === String(id));
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.getElementById("cart-count").innerText = total;
}


function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function addToWishlist(id, btn) {
  const item = products.find(p => String(p.id) === String(id));
  if (!item) return;

  let wishlist = getWishlist();

  const exists = wishlist.some(p => String(p.id) === String(id));

  if (!exists) {
    wishlist.push(item);
    if (btn) btn.innerText = "❤️";
  } else {
    wishlist = wishlist.filter(p => String(p.id) !== String(id));
    if (btn) btn.innerText = "♡";
  }

  saveWishlist(wishlist);
  updateWishlistCount();
}


function updateWishlistCount() {
  const el = document.getElementById("wishlist-count");
  if (el) el.innerText = getWishlist().length;
}


function goToProduct(id) {
  window.location.href = "product.html?id=" + id;
}

function filterBrand(brand) {
  const sel = document.getElementById("brandFilter");
  if (!sel) return;
  const val = brand.toLowerCase();
  const wait = setInterval(() => {
    if (!window.productsReady) return;
    clearInterval(wait);
    // Reset kategorine kur filtrojme sipas brendit
    activeCategory = "all";
    populateFilters();
    updateShopTitle();
    sel.value = val;
    applyFilters();
    document.getElementById("mainNav")?.classList.remove("open");
  }, 50);
}

function applySearch(query) {
  query = (query || "").toLowerCase().trim();
  const list = products.filter(p =>
    matchesCat(p) && (
      (p.name  || "").toLowerCase().includes(query) ||
      (p.brand || "").toLowerCase().includes(query)
    )
  );
  render(list);
}

window.addToCart    = addToCart;
window.addToWishlist = addToWishlist;
window.goToProduct  = goToProduct;
window.applyFilters = applyFilters;
window.filterBrand  = filterBrand;
window.applySearch  = applySearch;
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
        <td><button onclick="removeWishlistItem('${p.id}')">X</button></td>
      </tr>
    `;
  });

  modal.style.display = "flex";
}

function openCart() {
  const modal = document.getElementById("cartModal");
  const table = document.getElementById("cartTable");
  const totalEl = document.getElementById("cartTotal");

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  table.innerHTML = "";

  let total = 0;

  if (cartItems.length === 0) {
    table.innerHTML = "<tr><td>Cart is empty</td></tr>";
  }

  cartItems.forEach(p => {
    total += Number(p.price);

    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
        <td>€${Number(p.price).toFixed(2)}</td>
        <td><button onclick="removeCartItem('${p.id}')">X</button></td>
      </tr>
    `;
  });

  totalEl.innerText = "Total: €" + total.toFixed(2);

  modal.style.display = "flex";
}

function removeCartItem(id) {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  cartItems = cartItems.filter(p => String(p.id) !== String(id));

  localStorage.setItem("cart", JSON.stringify(cartItems));

  openCart();
  document.getElementById("cart-count").innerText = cartItems.length;
}

function removeWishlistItem(id) {
  let wishlist = getWishlist();

  wishlist = wishlist.filter(p => String(p.id) !== String(id));

  saveWishlist(wishlist);

  openFav();
  updateWishlistCount();
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

function closeWishlist() {
  document.getElementById("wishlistModal").style.display = "none";
}
window.openCart = openCart;
window.openFav = openFav;
window.removeCartItem = removeCartItem;
window.removeWishlistItem = removeWishlistItem;
window.closeCart = closeCart;
window.closeWishlist = closeWishlist;
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const search = params.get("search");

  if (!search) return;

  const interval = setInterval(() => {
    if (window.productsReady) {
      applySearch(search);
      clearInterval(interval);
    }
  }, 100);
});

function applySearch(value) {
  value = value.toLowerCase();

  filtered = products.filter(p => {
    const matchText =
      (p.name || "").toLowerCase().includes(value) ||
      (p.brand || "").toLowerCase().includes(value);
    return matchText && matchesCat(p);
  });

  render(filtered);
}
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = searchInput.value.trim().toLowerCase();

      if (!value) return;

      applySearch(value);
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const suggestionsBox = document.getElementById("suggestions");

  if (!searchInput || !suggestionsBox) return;

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase().trim();

    suggestionsBox.innerHTML = "";

    if (!value) {
      suggestionsBox.style.display = "none";
      render(products);
      return;
    }

    const results = products.filter(p =>
      (p.name || "").toLowerCase().includes(value) ||
      (p.brand || "").toLowerCase().includes(value)
    );

    if (results.length === 0) {
      suggestionsBox.innerHTML = "<div class='suggestion-item'>No results</div>";
      suggestionsBox.style.display = "block";
      return;
    }

    results.slice(0, 6).forEach(p => {
      const div = document.createElement("div");
      div.classList.add("suggestion-item");

      div.innerText = `${p.name} (${p.brand})`;

      div.onclick = () => {
        suggestionsBox.style.display = "none";
        searchInput.value = p.name;

        applySearch(p.name);
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
let loginModal;

document.addEventListener("DOMContentLoaded", () => {
  loginModal = document.getElementById("loginModal");

  if (loginModal) {
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) closeLogin();
    });
  }
});

function openLogin() {
  if (!loginModal) return;
  loginModal.classList.add("show");
}

function closeLogin() {
  if (!loginModal) return;
  loginModal.classList.remove("show");
}

function showMessage(text) {
  const box = document.getElementById("messageBox");
  const msg = document.getElementById("messageText");

  msg.innerText = text;
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!loginModal) return;

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