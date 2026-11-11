const bikes = [
  { name: "Classic Roadster", cat: "retro", brand: "Retro Line", price: 320, old: 400, img: 1, label: "Retro" },
  { name: "City Red", cat: "shahar", brand: "Urban", price: 290, img: 2 },
  { name: "Garden Vintage", cat: "retro", brand: "Retro Line", price: 350, img: 3, label: "Yangi" },
  { name: "Aero TT Pro", cat: "yol", brand: "Specialized", price: 2450, old: 2900, img: 4, label: "-15%" },
  { name: "Alpine Speed", cat: "yol", brand: "Cannondale", price: 2890, img: 5, label: "Top" },
  { name: "Carbon Racer", cat: "yol", brand: "Giant", price: 1990, img: 6 },
  { name: "Trek Domane", cat: "yol", brand: "Trek", price: 2150, old: 2400, img: 7 },
  { name: "E-Volt Urban", cat: "shahar", brand: "Merida", price: 1650, img: 8, label: "Elektr" },
  { name: "E-City Mint", cat: "shahar", brand: "Scott", price: 1390, img: 9, label: "Elektr" },
  { name: "Orange Breeze", cat: "retro", brand: "Retro Line", price: 380, img: 10 },
  { name: "Shimano Drive", cat: "yol", brand: "Specialized", price: 2650, img: 11, label: "Pro" },
  { name: "Lake Explorer", cat: "tog", brand: "Trek", price: 890, old: 1050, img: 12 },
  { name: "Forest Trail", cat: "tog", brand: "Giant", price: 760, img: 13 },
  { name: "Snow Rider", cat: "shahar", brand: "Urban", price: 340, img: 14 },
  { name: "Shadow Commuter", cat: "shahar", brand: "Scott", price: 420, img: 15 },
  { name: "BMX Jumper", cat: "tog", brand: "Merida", price: 540, img: 16, label: "Hit" },
  { name: "Dutch Black", cat: "retro", brand: "Retro Line", price: 460, img: 17 },
  { name: "Park Cruiser", cat: "shahar", brand: "Urban", price: 310, img: 18 },
  { name: "Arch Classic", cat: "retro", brand: "Retro Line", price: 395, img: 19 },
  { name: "Lady White", cat: "shahar", brand: "Giant", price: 360, img: 20, label: "Yangi" },
  { name: "Winter Beast", cat: "tog", brand: "Cannondale", price: 1180, img: 21 },
  { name: "Blue Hardtail", cat: "tog", brand: "Trek", price: 990, old: 1200, img: 22, label: "-18%" },
  { name: "Village Tour", cat: "shahar", brand: "Merida", price: 450, img: 23 },
  { name: "Omafiets Gold", cat: "retro", brand: "Retro Line", price: 510, img: 24 }
];

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
let cart = JSON.parse(localStorage.getItem("velo-cart") || "[]");
let filter = "all";

window.addEventListener("load", () => setTimeout(() => $("#loader").classList.add("hide"), 900));

function render() {
  const q = $("#search").value.toLowerCase();
  const list = bikes.filter(b => (filter === "all" || b.cat === filter) && b.name.toLowerCase().includes(q));
  $("#products").innerHTML = list.length ? list.map((b, i) => `
    <div class="product" style="animation-delay:${i * 0.05}s">
      ${b.label ? `<span class="p-label">${b.label}</span>` : ""}
      <button class="like" aria-label="Yoqtirish"><i class="fa-regular fa-heart"></i></button>
      <div class="p-img"><img src="images/p${b.img}.jpg" alt="${b.name}" loading="lazy"></div>
      <div class="p-body">
        <small>${b.brand}</small>
        <h3>${b.name}</h3>
        <div class="p-rate"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i></div>
        <div class="p-foot">
          <div class="price">$${b.price}${b.old ? `<del>$${b.old}</del>` : ""}</div>
          <button class="add" data-img="${b.img}" aria-label="Savatchaga"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
    </div>`).join("") : `<p class="empty"><i class="fa-solid fa-face-frown"></i> Hech narsa topilmadi</p>`;
}

$("#filters").addEventListener("click", e => {
  if (e.target.tagName !== "BUTTON") return;
  $$("#filters button").forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");
  filter = e.target.dataset.f;
  render();
});
$("#search").addEventListener("input", render);

$("#products").addEventListener("click", e => {
  const like = e.target.closest(".like");
  if (like) {
    like.classList.toggle("on");
    like.innerHTML = like.classList.contains("on") ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
    toast(like.classList.contains("on") ? "Sevimlilarga qo'shildi ❤" : "Sevimlilardan olib tashlandi");
  }
  const add = e.target.closest(".add");
  if (add) {
    const bike = bikes.find(b => b.img == add.dataset.img);
    const item = cart.find(c => c.img === bike.img);
    item ? item.qty++ : cart.push({ ...bike, qty: 1 });
    saveCart();
    toast(`${bike.name} savatchaga qo'shildi`);
  }
});

function saveCart() {
  localStorage.setItem("velo-cart", JSON.stringify(cart));
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const el = $("#cartCount");
  el.textContent = count;
  el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
  $("#cartTotal").textContent = "$" + cart.reduce((s, c) => s + c.qty * c.price, 0).toLocaleString();
  $("#cartItems").innerHTML = cart.length ? cart.map(c => `
    <div class="c-item">
      <img src="images/p${c.img}.jpg" alt="">
      <div><h5>${c.name}</h5><span>$${c.price}</span>
        <div class="qty"><button data-a="-" data-i="${c.img}">-</button>${c.qty}<button data-a="+" data-i="${c.img}">+</button></div>
      </div>
      <button class="c-del" data-a="x" data-i="${c.img}"><i class="fa-solid fa-trash"></i></button>
    </div>`).join("") : `<p class="empty">Savatcha bo'sh</p>`;
}

$("#cartItems").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  const item = cart.find(c => c.img == b.dataset.i);
  if (b.dataset.a === "+") item.qty++;
  if (b.dataset.a === "-") item.qty--;
  if (b.dataset.a === "x" || item.qty < 1) cart = cart.filter(c => c !== item);
  saveCart();
});

const openCart = () => { $("#cart").classList.add("open"); $("#overlay").classList.add("show"); };
const closeCart = () => { $("#cart").classList.remove("open"); $("#overlay").classList.remove("show"); $("#menu").classList.remove("open"); };
$("#cartBtn").onclick = openCart;
$("#closeCart").onclick = closeCart;
$("#overlay").onclick = closeCart;
$("#checkout").onclick = () => {
  if (!cart.length) return toast("Avval velosiped tanlang!");
  cart = []; saveCart(); closeCart();
  toast("Buyurtmangiz qabul qilindi! 🚴");
};

$("#burger").onclick = () => { $("#menu").classList.toggle("open"); $("#overlay").classList.toggle("show"); };
$$("#menu a").forEach(a => a.onclick = closeCart);

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
}

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  $("#nav").classList.toggle("scrolled", y > 60);
  $("#toTop").classList.toggle("show", y > 600);
  $$("section[id]").forEach(s => {
    if (y >= s.offsetTop - 150 && y < s.offsetTop + s.offsetHeight - 150) {
      $$("#menu a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + s.id));
    }
  });
});
$("#toTop").onclick = () => window.scrollTo({ top: 0 });

const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
}), { threshold: 0.15 });
$$(".reveal,.reveal-left,.reveal-right").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 0.1 + "s"; io.observe(el); });

const cio = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target, target = +el.dataset.target;
  let n = 0;
  const step = () => { n += Math.ceil(target / 60); if (n >= target) { el.textContent = target.toLocaleString() + "+"; return; } el.textContent = n.toLocaleString(); requestAnimationFrame(step); };
  step(); cio.unobserve(el);
}));
$$(".counter").forEach(c => cio.observe(c));

const slides = $("#slides"), total = slides.children.length;
let idx = 0;
$("#dots").innerHTML = Array.from({ length: total }, (_, i) => `<span data-i="${i}"></span>`).join("");
function go(i) {
  idx = (i + total) % total;
  slides.style.transform = `translateX(-${idx * 100}%)`;
  $$("#dots span").forEach((d, k) => d.classList.toggle("on", k === idx));
}
$("#next").onclick = () => go(idx + 1);
$("#prev").onclick = () => go(idx - 1);
$("#dots").onclick = e => e.target.dataset.i && go(+e.target.dataset.i);
let auto = setInterval(() => go(idx + 1), 5000);
$(".slider").addEventListener("mouseenter", () => clearInterval(auto));
$(".slider").addEventListener("mouseleave", () => auto = setInterval(() => go(idx + 1), 5000));
go(0);

$$(".faq-item button").forEach(b => b.onclick = () => {
  const item = b.parentElement, open = item.classList.contains("open");
  $$(".faq-item").forEach(f => f.classList.remove("open"));
  if (!open) item.classList.add("open");
});

const end = Date.now() + 5 * 864e5 + 7 * 36e5;
setInterval(() => {
  const d = Math.max(0, end - Date.now());
  const pad = n => String(Math.floor(n)).padStart(2, "0");
  $("#d").textContent = pad(d / 864e5);
  $("#h").textContent = pad(d / 36e5 % 24);
  $("#m").textContent = pad(d / 6e4 % 60);
  $("#s").textContent = pad(d / 1e3 % 60);
}, 1000);

$("#form").onsubmit = e => { e.preventDefault(); e.target.reset(); toast("Xabaringiz yuborildi! Tez orada bog'lanamiz ✔"); };
$("#news").onsubmit = e => { e.preventDefault(); e.target.reset(); toast("Obuna bo'ldingiz! 🎉"); };

render();
saveCart();
