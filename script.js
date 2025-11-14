const books = [
  { title: "Logika Dasar", price: 55000, image: "img/logika-dasar.jpg" },
  { title: "Logika Formal", price: 75000, image: "img/logika-formal.jpg" },
  { title: "Logika Pemrograman", price: 55000, image: "img/logika-coding.jpg" },
  { title: "Logika Filsafat", price: 60000, image: "img/logika-filsafat.jpg" },
  { title: "Logika Bisnis", price: 65000, image: "img/logika-bisnis.jpg" },
  { title: "Logika Matematika", price: 58000, image: "img/logika-matematika.jpg" },
  { title: "Logika Aristoteles", price: 62000, image: "img/logika-aristoteles.jpg" },
  { title: "Logika Modern", price: 64000, image: "img/logika-modern.jpg" },
  { title: "Logika Praktis", price: 50000, image: "img/logika-praktis.jpg" },
  { title: "Logika Keputusan", price: 53000, image: "img/logika-keputusan.jpg" },
  { title: "Logika Analitik", price: 61000, image: "img/logika-analitik.jpg" },
  { title: "Logika Deduktif", price: 49000, image: "img/logika-deduktif.jpg" },
  { title: "Logika Induktif", price: 51000, image: "img/logika-induktif.jpg" },
  { title: "Logika untuk Anak", price: 40000, image: "img/logika-anak.jpg" },
  { title: "Logika Visual", price: 56000, image: "img/logika-visual.jpg" },
  { title: "Logika Terapan", price: 58000, image: "img/logika-terapan.jpg" },
  { title: "Logika dan Etika", price: 60000, image: "img/logika-etika.jpg" },
  { title: "Logika dan Bahasa", price: 62000, image: "img/logika-bahasa.jpg" },
  { title: "Logika dan AI", price: 155000, image: "img/logika-ai.jpg" },
  { title: "Logika dan Algoritma", price: 120000, image: "img/logika-algoritma.jpg" }
];

const bookList = document.getElementById("bookList");
const cartCount = document.getElementById("cartCount");

function renderBooks(filter = "") {
  bookList.innerHTML = "";
  books
    .filter(book => book.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(book => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <img src="${book.image}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>Rp${book.price.toLocaleString()}</p>
        <button class="add-btn" onclick="addToCart('${book.title}', ${book.price}, this)">Tambah ke Keranjang</button>
      `;
      bookList.appendChild(card);
    });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function addToCart(title, price, button) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ title, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCount.textContent = cart.length;

  // 🔔 Toast
  showToast(`📚 ${title} ditambahkan ke keranjang!`);

  // 🔄 Bounce tombol
  button.classList.add("bounce");
  setTimeout(() => button.classList.remove("bounce"), 300);

  // 🔄 Flash badge
  cartCount.classList.add("flash");
  setTimeout(() => cartCount.classList.remove("flash"), 500);

  // ✈️ Fly-to-cart animasi
  const card = button.closest(".book-card");
  const img = card.querySelector("img");
  const clone = img.cloneNode(true);
  const rect = img.getBoundingClientRect();
  const cartRect = document.getElementById("cartBtn").getBoundingClientRect();

  clone.classList.add("fly-to-cart");
  clone.style.top = `${rect.top}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.position = "fixed";

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.2)`;
    clone.style.opacity = "0";
  });

  setTimeout(() => {
    clone.remove();
  }, 800);
}

document.getElementById("searchInput").addEventListener("input", e => {
  renderBooks(e.target.value);
});

renderBooks();
cartCount.textContent = JSON.parse(localStorage.getItem("cart") || "[]").length;