// checkout.js - Versão com CSS Corrigido

// Carregar dados do localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedCoupon = localStorage.getItem('coupon') || null;
let paymentMethod = 'pix';

// Cupons válidos
const coupons = {
    'BEMVINDO10': { discount: 10, type: 'percent' },
    'PRIMEIRACOMPRA': { discount: 15, type: 'percent' },
    'VEGANO20': { discount: 20, type: 'percent' },
    'DESCONTO30': { discount: 30, type: 'fixed' }
};

// Produtos
const products = {
    'creme': { name: 'Creme Hidratante Vegano', price: 89.90, emoji: '🧴', image: 'imagens/creme/creme_amarelo.png' },
    'oleo': { name: 'Óleo Corporal Nutritivo', price: 79.90, emoji: '💧', image: 'imagens/oleo/menta.png' }
};

// Calcular subtotal
function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// Calcular desconto
function calculateDiscount(subtotal) {
    let discount = 0;
    let discountText = '';
    
    // Desconto do cupom
    if (appliedCoupon && coupons[appliedCoupon]) {
        const coupon = coupons[appliedCoupon];
        if (coupon.type === 'percent') {
            discount += subtotal * (coupon.discount / 100);
            discountText = `Cupom ${coupon.discount}%`;
        } else {
            discount += coupon.discount;
            discountText = `Cupom R$ ${coupon.discount.toFixed(2)}`;
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

// Mostrar resumo do pedido
function showCheckout() {
    const subtotal = calculateSubtotal();
    const { discount, discountText } = calculateDiscount(subtotal);
    const total = subtotal - discount;
    
    // Mostrar itens do pedido
    let html = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        html += `
            <div class="order-item" style="display: flex; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid #e9ecef;">
                <span style="display: flex; align-items: center; gap: 10px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">
                    <span>${item.name} x${item.qty}</span>
                </span>
                <span style="font-weight: 600; color: #2d3436;">R$ ${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    const orderItemsEl = document.getElementById('order-items');
    if (orderItemsEl) {
        orderItemsEl.innerHTML = html;
    }
    
    // Atualizar valores
    const subtotalEl = document.getElementById('checkout-subtotal');
    if (subtotalEl) {
        subtotalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
    }
    
    const discountLine = document.getElementById('discount-line');
    if (discountLine) {
        if (discount > 0) {
            discountLine.style.display = 'flex';
            const discountTypeEl = document.getElementById('discount-type');
            const discountAmountEl = document.getElementById('checkout-discount');
            if (discountTypeEl) discountTypeEl.textContent = discountText;
            if (discountAmountEl) discountAmountEl.textContent = `- R$ ${discount.toFixed(2)}`;
        } else {
            discountLine.style.display = 'none';
        }
    }
    
    const totalEl = document.getElementById('checkout-total');
    if (totalEl) {
        totalEl.textContent = `R$ ${total.toFixed(2)}`;
    }
}

// Aplicar cupom - USANDO CLASSES CSS
function applyCoupon() {
    console.log('🔍 applyCoupon() chamada');
    
    const input = document.getElementById('coupon-input');
    const message = document.getElementById('coupon-message');
    const btnCoupon = document.querySelector('.btn-coupon');
    
    if (!input) {
        alert('❌ Erro: Campo de cupom não encontrado');
        return;
    }
    
    if (!message) {
        alert('❌ Erro: Elemento de mensagem não encontrado');
        return;
    }
    
    const couponCode = input.value.trim().toUpperCase();
    console.log('Código digitado:', couponCode);
    
    // Limpar classes anteriores
    message.className = 'coupon-message';
    message.textContent = '';
    
    // Validar vazio
    if (!couponCode) {
        message.className = 'coupon-message error show';
        message.textContent = '❌ Por favor, digite um código de cupom';
        console.log('❌ Campo vazio');
        return;
    }
    
    // Validar cupom
    if (!coupons[couponCode]) {
        message.className = 'coupon-message error show';
        message.textContent = `❌ Cupom "${couponCode}" é inválido`;
        console.log('❌ Cupom inválido:', couponCode);
        console.log('Cupons disponíveis:', Object.keys(coupons));
        return;
    }
    
    // Cupom válido!
    appliedCoupon = couponCode;
    localStorage.setItem('coupon', appliedCoupon);
    
    const coupon = coupons[couponCode];
    message.className = 'coupon-message success show';
    
    if (coupon.type === 'percent') {
        message.textContent = `✅ Cupom aplicado! ${coupon.discount}% de desconto`;
    } else {
        message.textContent = `✅ Cupom aplicado! R$ ${coupon.discount.toFixed(2)} de desconto`;
    }
    
    // Desabilitar input e botão
    input.disabled = true;
    input.style.background = '#f8f9fa';
    input.style.cursor = 'not-allowed';
    
    if (btnCoupon) {
        btnCoupon.disabled = true;
        btnCoupon.style.opacity = '0.5';
        btnCoupon.style.cursor = 'not-allowed';
        btnCoupon.textContent = 'Aplicado ✓';
    }
    
    // Atualizar resumo
    showCheckout();
    
    console.log('✅ Cupom aplicado com sucesso!');
}

// Atualizar método de pagamento
function updatePaymentMethod() {
    const selected = document.querySelector('input[name="payment"]:checked');
    paymentMethod = selected ? selected.value : 'pix';
    
    const cardFields = document.getElementById('card-fields');
    if (cardFields) {
        if (paymentMethod === 'card') {
            cardFields.style.display = 'block';
            const cardInputs = cardFields.querySelectorAll('input, select');
            cardInputs.forEach(input => {
                input.setAttribute('required', 'required');
            });
        } else {
            cardFields.style.display = 'none';
            const cardInputs = cardFields.querySelectorAll('input, select');
            cardInputs.forEach(input => {
                input.removeAttribute('required');
            });
        }
    }
    
    showCheckout();
}

// Finalizar pedido
function finalizarPedido(e) {
    e.preventDefault();
    
    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const paymentName = {
        'pix': 'PIX',
        'card': 'Cartão de Crédito',
        'boleto': 'Boleto Bancário'
    };
    
    const subtotal = calculateSubtotal();
    const { discount } = calculateDiscount(subtotal);
    const total = subtotal - discount;
    
    let successMessage = `🎉 Pedido realizado com sucesso!\n\n`;
    successMessage += `Forma de pagamento: ${paymentName[paymentMethod]}\n`;
    successMessage += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
    
    if (discount > 0) {
        successMessage += `Desconto: R$ ${discount.toFixed(2)}\n`;
    }
    
    successMessage += `Total: R$ ${total.toFixed(2)}\n\n`;
    
    if (appliedCoupon) {
        successMessage += `Cupom usado: ${appliedCoupon}\n`;
    }
    
    successMessage += `\nObrigado pela compra!\nVocê receberá um email com os detalhes.`;
    
    alert(successMessage);
    
    // Limpar dados
    cart = [];
    appliedCoupon = null;
    localStorage.removeItem('cart');
    localStorage.removeItem('coupon');
    
    window.location.href = 'index.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando checkout...');
    console.log('Carrinho:', cart);
    console.log('Cupom aplicado:', appliedCoupon);
    
    // Verificar carrinho
    if (cart.length === 0) {
        console.log('⚠️ Carrinho vazio, redirecionando...');
        window.location.href = 'carrinho.html';
        return;
    }
    
    // Configurar formulário
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', finalizarPedido);
        console.log('✅ Formulário configurado');
    }
    
    // Configurar métodos de pagamento
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', updatePaymentMethod);
    });
    console.log('✅ Métodos de pagamento configurados');
    
    // Inicializar
    updatePaymentMethod();
    showCheckout();
    
    // Restaurar cupom se já aplicado
    if (appliedCoupon && coupons[appliedCoupon]) {
        const input = document.getElementById('coupon-input');
        const message = document.getElementById('coupon-message');
        const btnCoupon = document.querySelector('.btn-coupon');
        
        if (input) {
            input.value = appliedCoupon;
            input.disabled = true;
            input.style.background = '#f8f9fa';
            input.style.cursor = 'not-allowed';
        }
        
        if (btnCoupon) {
            btnCoupon.disabled = true;
            btnCoupon.style.opacity = '0.5';
            btnCoupon.style.cursor = 'not-allowed';
            btnCoupon.textContent = 'Aplicado ✓';
        }
        
        if (message) {
            const coupon = coupons[appliedCoupon];
            message.className = 'coupon-message success show';
            
            if (coupon.type === 'percent') {
                message.textContent = `✅ Cupom aplicado! ${coupon.discount}% de desconto`;
            } else {
                message.textContent = `✅ Cupom aplicado! R$ ${coupon.discount.toFixed(2)} de desconto`;
            }
        }
        
        console.log('✅ Cupom restaurado:', appliedCoupon);
    }
    
    console.log('✅ Checkout inicializado com sucesso!');
});