const API_BASE = "http://localhost:3000/api";
let products = [];
let cart = [];
let money = 0;
let currentCategory = "all";
function displayProducts(list = products) {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    list.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-image"><img src="${product.image}" alt="${product.name}"></div>
            <hp3>${product.name}</hp3>
            <p class="descrition">${product.description}</p>
            <div class="product-bottom">
                <span class="price">${product.price} ฿</span>
                <span class="stock">เหลือ ${product.stock} ชิ้น</span>
            </div>
            <button class="add-button" onclick="addToCart(${product.id})" ${product.stock <= 0 ? "disabled" : ""}>🛒 หยิบใส่ตะกร้า</button>
        `;
        grid.appendChild(card);
    });
}
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product || product.stock <= 0) return;
    const existing = cart.find(item => item.id === id);
    if (existing) {
        if (existing.quantity < product.stock) {
            existing.quantity++;
        } else {
            showPopup("สินค้าไม่พอ", "สินค้านี้มีจำนวนจำกัด");
            return;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
}
function renderCart() {
    const container = document.getElementById("cartItems");
    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛍️</div>
                <p>ยังไม่มีสินค้า</p>
                <span>เลือกสินค้าที่ต้องการได้เลย</span>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <div class="cart-image"><img src="${item.image}" alt="${item.name}"></div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} ฿</p>
                </div>
                <div class="quantity">
                    <button onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            `;
            container.appendChild(cartItem);
        });
    }
    updatePayment();
    updateCartCount();
}
function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    const product = products.find(product => product.id === id);
    item.quantity += amount;
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }
    if (item.quantity > product.stock) {
        item.quantity = product.stock;
        showPopup("สินค้าไม่พอ", "ไม่สามารถเพิ่มสินค้าได้อีก");
    }
    renderCart();
}
function getTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}
function updatePayment() {
    const total = getTotal();
    const change = money >= total ? money - total : 0;
    document.getElementById("total").textContent = `${total} ฿`;
    document.getElementById("money").textContent = `${money} ฿`;
    document.getElementById("change").textContent = `${change} ฿`;
}
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = count;
}
function insertMoney(amount) {
    money += amount;
    updatePayment();
}
async function buyProducts() {
    const total = getTotal();
    if (cart.length === 0) {
        showPopup("ยังไม่มีสินค้า", "กรุณาเลือกสินค้าก่อนทำรายการ");
        return;
    }
    if (money < total) {
        showPopup("เงินไม่พอ", `กรุณาใส่เงินเพิ่มอีก ${total - money} บาท`);
        return;
    }
    const change = money - total;
    try {
        const response = await fetch(`${API_BASE}/purchase`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
            })
        });
        const result = await response.json();
        if (!response.ok) {
            showPopup("ทำรายการไม่สำเร็จ", result.error || "เกิดข้อผิดพลาด");
            return;
        }
        products = result.products;
        cart = [];
        money = 0;
        displayProducts();
        renderCart();
        showPopup("ซื้อสำเร็จ! 🎉", `ขอบคุณสำหรับการซื้อสินค้า เงินทอน ${change} บาท`);
    } catch (err) {
        showPopup("เชื่อมต่อไม่สำเร็จ", "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    }
}
function refund() {
    if (money === 0) {
        showPopup("ไม่มีเงิน", "ยังไม่มีเงินที่สามารถคืนได้");
        return;
    }
    const refundMoney = money;
    money = 0;
    updatePayment();
    showPopup("คืนเงินสำเร็จ", `คืนเงิน ${refundMoney} บาท`);
}
function clearCart() {
    cart = [];
    renderCart();
}
function filterProducts(category, button) {
    currentCategory = category;
    document.querySelectorAll(".category").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    if (category === "all") {
        displayProducts(products);
    } else {
        displayProducts(products.filter(product => product.category === category));
    }
}
function searchProducts() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    let filtered = products.filter(product => product.name.toLowerCase().includes(keyword));
    if (currentCategory !== "all") {
        filtered = filtered.filter(product => product.category === currentCategory);
    }
    displayProducts(filtered);
}
function showPopup(title, message) {
    document.getElementById("popupTitle").textContent = title;
    document.getElementById("popupMessage").textContent = message;
    document.getElementById("popup").classList.add("show");
}
function closePopup() {
    document.getElementById("popup").classList.remove("show");
}
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        products = await response.json();
    } catch (err) {
        showPopup("เชื่อมต่อไม่สำเร็จ", "ไม่สามารถโหลดสินค้าจากเซิร์ฟเวอร์ได้");
    }
    displayProducts();
    renderCart();
}
loadProducts();