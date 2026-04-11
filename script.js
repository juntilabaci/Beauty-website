let cart = 0;
let cartItems = [];


function addToCart(name, price) {
  cart++;
  cartItems.push({ name, price });

  document.getElementById("cartCount").innerText = cart;
}


function toggleHeart(el) {
  el.classList.toggle("active");

  if (el.classList.contains("active")) {
    el.innerText = "❤️";
  } else {
    el.innerText = "♡";
  }
}


const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

let products = Array.from(document.querySelectorAll(".product"));

function highlight(text, match) {
  let regex = new RegExp(match, "gi");
  return text.replace(regex, m => `<span class="highlight">${m}</span>`);
}

function searchEngine(value) {
  suggestionsBox.innerHTML = "";

  if (!value) {
    suggestionsBox.style.display = "none";
    return;
  }

  let results = products.filter(p =>
    p.dataset.name.toLowerCase().includes(value.toLowerCase())
  );

  if (results.length === 0) {
    suggestionsBox.innerHTML = `<div class="suggestion-item">No results found</div>`;
    suggestionsBox.style.display = "block";
    return;
  }

  results.forEach(p => {
    let name = p.dataset.name;
    let price = p.dataset.price;

    let div = document.createElement("div");
    div.className = "suggestion-item";

    div.innerHTML = `
      <strong>${highlight(name, value)}</strong><br>
      <small>€${price}</small>
    `;

    div.onclick = () => {
      p.scrollIntoView({ behavior: "smooth", block: "center" });
      p.style.border = "2px solid #4da6ff";
      setTimeout(() => p.style.border = "none", 1500);
      suggestionsBox.style.display = "none";
    };

    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
}


function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

searchInput.addEventListener("keyup", debounce(function () {
  searchEngine(this.value);
}, 150));


document.addEventListener("click", function(e){
  if (!e.target.closest(".search-wrapper")) {
    suggestionsBox.style.display = "none";
  }
});


function filterBrand(brand) {
  products.forEach(p => {
    if (brand === "all" || p.dataset.brand === brand) {
      p.style.display = "block";
    } else {
      p.style.display = "none";
    }
  });
}


function toggleMenu() {
  document.querySelector(".menu").classList.toggle("active");
}

function openCart() {
  alert("Cart items: " + cartItems.length);
}

function openFav() {
  let favs = document.querySelectorAll(".heart.active").length;
  alert("Wishlist items: " + favs);
}

function subscribe() {
  let email = document.getElementById("newsletterEmail").value;

  if (email === "" || !email.includes("@")) {
    alert("Shkruaj një email të saktë!");
    return;
  }

  localStorage.setItem("tempEmail", email);

  window.location.href = "register.html";
}


document.querySelectorAll(".footer-links a").forEach(link => {
  link.addEventListener("click", function(e) {

    if (this.getAttribute("href") === "#") {
      e.preventDefault();
      alert(this.innerText + " do vijë së shpejti!");
    }

  });
});
function openLogin(){
  document.getElementById("loginModal").style.display="flex";
}

function closeLogin(){
  document.getElementById("loginModal").style.display="none";
}

/* ===== WISHLIST ===== */
let wishlist = [];

function toggleHeart(el){
  el.classList.toggle("active");

  let product = el.parentElement.querySelector("h3").innerText;

  if(el.classList.contains("active")){
    el.innerText = "❤️";
    wishlist.push(product);
  } else {
    el.innerText = "♡";
    wishlist = wishlist.filter(p => p !== product);
  }
}

function openFav(){
  let table = document.getElementById("wishlistTable");
  table.innerHTML = "";

  if(wishlist.length === 0){
    table.innerHTML = "<tr><td>Wishlist është bosh</td></tr>";
  } else {
    wishlist.forEach(item=>{
      table.innerHTML += `<tr><td>${item}</td></tr>`;
    });
  }

  document.getElementById("wishlistModal").style.display="flex";
}

function closeWishlist(){
  document.getElementById("wishlistModal").style.display="none";
}

window.onclick = function(e){
  if(e.target.classList.contains("modal")){
    e.target.style.display="none";
  }
}