// Produtos disponíveis
const products = {
    'creme': { name: 'Creme Hidratante Vegano', price: 89.90, emoji: '🧴', image: 'imagens/creme/creme_amarelo.png' },
    'oleo': { name: 'Óleo Corporal Nutritivo', price: 79.90, emoji: '💧', image: 'imagens/oleo/menta.png' }
};

// Cupons válidos
const coupons = {
    'BEMVINDO10': { discount: 10, type: 'percent' },
    'PRIMEIRACOMPRA': { discount: 15, type: 'percent' },
    'VEGANO20': { discount: 20, type: 'percent' },
    'DESCONTO30': { discount: 30, type: 'fixed' }
};

// Carregar do localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedCoupon = localStorage.getItem('coupon') || null;
let paymentMethod = 'pix';

// Salvar no localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (appliedCoupon) {
        localStorage.setItem('coupon', appliedCoupon);
    }
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products[productId];
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id: productId, ...product, qty: 1 });
    }
    
    saveCart();
    updateCartCount();
    alert('✅ Produto adicionado ao carrinho!');
}

// Remover do carrinho
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    showCart();
    updateCartCount();
}

// Mudar quantidade
function changeQty(productId, change) {
    const item = cart.find(item => item.id === productId);
    item.qty += change;
    if (item.qty <= 0) {
        removeItem(productId);
    } else {
        saveCart();
        showCart();
        updateCartCount();
    }
}

// Atualizar contador
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
}

// Calcular subtotal
function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// Calcular desconto
function calculateDiscount(subtotal) {
    let discount = 0;
    let discountText = '';
    
    // Desconto do cupom
    if (appliedCoupon) {
        const coupon = coupons[appliedCoupon];
        if (coupon) {
            if (coupon.type === 'percent') {
                discount += subtotal * (coupon.discount / 100);
                discountText = `Cupom ${coupon.discount}%`;
            } else {
                discount += coupon.discount;
                discountText = `Cupom R$ ${coupon.discount}`;
            }
        }
    }
    
    // Desconto da forma de pagamento
    if (paymentMethod === 'pix') {
        const pixDiscount = subtotal * 0.05;
        discount += pixDiscount;
        discountText += discountText ? ' + PIX 5%' : 'PIX 5%';
    } else if (paymentMethod === 'boleto') {
        const boletoDiscount = subtotal * 0.03;
        discount += boletoDiscount;
        discountText += discountText ? ' + Boleto 3%' : 'Boleto 3%';
    }
    
    return { discount, discountText };
}

// Mostrar carrinho
function showCart() {
    const itemsEl = document.getElementById('cart-items');
    const emptyEl = document.getElementById('cart-empty');
    
    if (cart.length === 0) {
        if (itemsEl) itemsEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }
    
    if (itemsEl) itemsEl.style.display = 'block';
    if (emptyEl) emptyEl.style.display = 'none';
    
    let html = '';
    const subtotal = calculateSubtotal();
    
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;

        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                </div>
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>R$ ${item.price.toFixed(2)}</p>
                    <button class="remove-btn" onclick="removeItem('${item.id}')">Remover</button>
                </div>
                <div class="cart-item-quantity-price">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="changeQty('${item.id}', -1)">-</button>
                        <span class="quantity-display">${item.qty}</span>
                        <button class="quantity-btn" onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                    <div class="cart-item-price">R$ ${itemTotal.toFixed(2)}</div>
                </div>
            </div>
        `;
    });
    
    if (itemsEl) itemsEl.innerHTML = html;
    const { discount, discountText } = calculateDiscount(subtotal);
    const total = subtotal - discount;

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;

    const discountLine = document.getElementById('discount-line');
    if (discount > 0) {
        discountLine.style.display = 'flex';
        document.getElementById('discount-type').textContent = discountText;
        document.getElementById('discount-amount').textContent = `- R$ ${discount.toFixed(2)}`;
    } else {
        discountLine.style.display = 'none';
    }

    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
}

// Ir para pagamento
function goToCheckout() {
    if (cart.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    window.location.href = 'pagamento.html';
}

// Aplicar cupom
function applyCoupon() {
    const input = document.getElementById('coupon-input');
    const message = document.getElementById('coupon-message');
    const couponCode = input.value.trim().toUpperCase();
    
    if (!couponCode) {
        message.className = 'coupon-message error';
        message.textContent = '❌ Digite um cupom válido';
        return;
    }
    
    if (!coupons[couponCode]) {
        message.className = 'coupon-message error';
        message.textContent = '❌ Cupom inválido';
        return;
    }
    
    appliedCoupon = couponCode;
    localStorage.setItem('coupon', appliedCoupon);
    const coupon = coupons[couponCode];
    
    message.className = 'coupon-message success';
    if (coupon.type === 'percent') {
        message.textContent = `✅ Cupom aplicado! ${coupon.discount}% de desconto`;
    } else {
        message.textContent = `✅ Cupom aplicado! R$ ${coupon.discount} de desconto`;
    }
    
    input.disabled = true;
    showCheckout();
}

// Atualizar método de pagamento
function updatePaymentMethod() {
    const selected = document.querySelector('input[name="payment"]:checked');
    paymentMethod = selected ? selected.value : 'pix';
    
    const cardFields = document.getElementById('card-fields');
    if (cardFields) {
        cardFields.style.display = paymentMethod === 'card' ? 'block' : 'none';
    }
    
    showCheckout();
}

// Mostrar resumo no checkout
function showCheckout() {
    const subtotal = calculateSubtotal();
    const { discount, discountText } = calculateDiscount(subtotal);
    const total = subtotal - discount;
    
    let html = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        html += `<div class="order-item"><span><img src="${item.image}" alt="${item.name}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 5px; margin-right: 10px;">${item.name} x${item.qty}</span><span>R$ ${itemTotal.toFixed(2)}</span></div>`;
    });
    
    document.getElementById('order-items').innerHTML = html;
    document.getElementById('checkout-subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    
    const discountLine = document.getElementById('discount-line');
    if (discount > 0) {
        discountLine.style.display = 'flex';
        document.getElementById('discount-type').textContent = discountText;
        document.getElementById('checkout-discount').textContent = `- R$ ${discount.toFixed(2)}`;
    } else {
        discountLine.style.display = 'none';
    }
    
    document.getElementById('checkout-total').textContent = `R$ ${total.toFixed(2)}`;
}

// Finalizar pedido
function finalizarPedido(e) {
    e.preventDefault();
    
    const paymentName = {
        'pix': 'PIX',
        'card': 'Cartão de Crédito',
        'boleto': 'Boleto Bancário'
    };
    
    const total = calculateSubtotal() - calculateDiscount(calculateSubtotal()).discount;
    
    alert(`🎉 Pedido realizado com sucesso!\n\nForma de pagamento: ${paymentName[paymentMethod]}\nTotal: R$ ${total.toFixed(2)}\n\nObrigado pela compra!`);
    
    // Limpar carrinho
    cart = [];
    appliedCoupon = null;
    localStorage.removeItem('cart');
    localStorage.removeItem('coupon');
    
    window.location.href = 'index.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    if (window.location.pathname.includes('carrinho.html')) {
        showCart();
    }
    
    if (window.location.pathname.includes('pagamento.html')) {
        if (cart.length === 0) {
            window.location.href = 'carrinho.html';
        } else {
            showCheckout();
            updatePaymentMethod();
            
            const form = document.getElementById('checkout-form');
            if (form) {
                form.onsubmit = finalizarPedido;
            }
        }
    }
});