// "Түргэн Хазалт" - Үндсэн JS файл

const foods = [
  { id: 1, name: "Сонгодог Чизбургер", category: "burger", price: 12500, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80", desc: "Үхрийн махан котлет, бяслаг, тусгай сүмс" },
  { id: 2, name: "Давхар Махтай Бургер", category: "burger", price: 16900, img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80", desc: "Давхар үхрийн мах, давхар бяслаг, өргөст хэмх" },
  { id: 3, name: "Шаржигнуур Далавч (6ш)", category: "chicken", price: 15500, img: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=500&q=80", desc: "Халуун ногоотой хачиртай тахиа" },
  // ... 100 төрлийн хоолны дата
];

let cart = [];
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('food-grid')) {
    renderFoods(foods);
  }
});

function renderFoods(items) {
  const grid = document.getElementById('food-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (items.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Хоол олдсонгүй.</p>`;
    return;
  }
  items.forEach(food => {
    grid.innerHTML += `
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between">
        <div>
          <img src="${food.img}" alt="${food.name}" class="w-full h-48 object-cover" loading="lazy">
          <div class="p-5">
            <h3 class="font-bold text-lg text-gray-900 mb-1">${food.name}</h3>
            <p class="text-sm text-gray-500 mb-4 line-clamp-2">${food.desc}</p>
          </div>
        </div>
        <div class="p-5 pt-0 flex items-center justify-between">
          <span class="text-xl font-extrabold text-red-600">${food.price.toLocaleString()} ₮</span>
          <button onclick="addToCart(${food.id})" class="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1">
            <i class="fa-solid fa-plus text-xs"></i> Сагслах
          </button>
        </div>
      </div>
    `;
  });
}

function filterCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('bg-red-600', 'text-white');
    btn.classList.add('bg-white', 'text-gray-700');
  });
  if (window.event && window.event.target) {
    window.event.target.classList.remove('bg-white', 'text-gray-700');
    window.event.target.classList.add('bg-red-600', 'text-white');
  }

  if (cat === 'all') renderFoods(foods);
  else renderFoods(foods.filter(item => item.category === cat));
}

function searchFood() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filtered = foods.filter(item => 
    item.name.toLowerCase().includes(query) && 
    (activeCategory === 'all' || item.category === activeCategory)
  );
  renderFoods(filtered);
}

function addToCart(foodId) {
  const existing = cart.find(item => item.id === foodId);
  if (existing) existing.qty += 1;
  else {
    const item = foods.find(f => f.id === foodId);
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
  
  const cartItemsContainer = document.getElementById('cart-items');
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="text-gray-500 text-center py-8">Сагс хоосон байна.</p>`;
    } else {
      cartItemsContainer.innerHTML = '';
      cart.forEach(item => {
        cartItemsContainer.innerHTML += `
          <div class="flex items-center justify-between py-4">
            <div class="flex items-center gap-3">
              <img src="${item.img}" class="w-12 h-12 rounded-lg object-cover">
              <div>
                <h4 class="font-bold text-sm">${item.name}</h4>
                <p class="text-xs text-gray-500">${item.price.toLocaleString()} ₮</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 bg-gray-100 rounded-full font-bold hover:bg-gray-200">-</button>
              <span class="font-bold text-sm w-4 text-center">${item.qty}</span>
              <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 bg-gray-100 rounded-full font-bold hover:bg-gray-200">+</button>
            </div>
          </div>
        `;
      });
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = subtotal > 0 ? 4000 : 0;
  
  if (document.getElementById('subtotal-price'))
    document.getElementById('subtotal-price').innerText = `${subtotal.toLocaleString()} ₮`;
  if (document.getElementById('delivery-fee'))
    document.getElementById('delivery-fee').innerText = `${deliveryFee.toLocaleString()} ₮`;
  if (document.getElementById('total-price'))
    document.getElementById('total-price').innerText = `${(subtotal + deliveryFee).toLocaleString()} ₮`;
}

function changeQty(foodId, change) {
  const item = cart.find(i => i.id === foodId);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== foodId);
  }
  updateCartUI();
}

function toggleCart() {
  const modal = document.getElementById('cart-modal');
  if (modal) modal.classList.toggle('hidden');
}

function openCheckout() {
  if (cart.length === 0) { alert('Сагс хоосон байна!'); return; }
  toggleCart();
  const checkoutModal = document.getElementById('checkout-modal');
  if (checkoutModal) checkoutModal.classList.remove('hidden');
}

function closeCheckout() {
  const checkoutModal = document.getElementById('checkout-modal');
  if (checkoutModal) checkoutModal.classList.add('hidden');
}

function handleOrderSubmit(e) {
  e.preventDefault();
  alert('Захиалга амжилттай хийгдлээ!');
  cart = [];
  updateCartUI();
  closeCheckout();
}
