import { menuCategories } from './config.js';
import { t, getLang, setLang } from './i18n.js';

// Application State Management
const state = {
    currentOrder: [],
    activeCategory: menuCategories[0]?.id || null,
    selectedItemForModal: null
};

// DOM Cache
const DOM = {
    categoriesList: document.getElementById("categoriesList"),
    menuItemsGrid: document.getElementById("menuItemsGrid"),
    orderItemsList: document.getElementById("orderItemsList"),
    subtotalPrice: document.getElementById("subtotalPrice"),
    serviceFee: document.getElementById("serviceFee"),
    totalPrice: document.getElementById("totalPrice"),
    itemModal: document.getElementById("itemModal"),
    modalItemTitle: document.getElementById("modalItemTitle"),
    modalItemComment: document.getElementById("modalItemComment"),
    confirmItemBtn: document.getElementById("confirmItemBtn"),
    cancelItemBtn: document.getElementById("cancelItemBtn"),
    sendOrderBtn: document.getElementById("sendOrderBtn")
};

function renderI18n() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.getAttribute("data-i18n"));
    });

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === getLang());
    });
}

function renderCategories() {
    if (!DOM.categoriesList) return;
    DOM.categoriesList.innerHTML = "";
    menuCategories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `category-btn ${cat.id === state.activeCategory ? 'active' : ''}`;
        btn.textContent = t(cat.name);
        btn.onclick = () => {
            state.activeCategory = cat.id;
            renderCategories();
            renderMenuItems();
        };
        DOM.categoriesList.appendChild(btn);
    });
}

function renderMenuItems() {
    if (!DOM.menuItemsGrid) return;
    DOM.menuItemsGrid.innerHTML = "";
    const category = menuCategories.find(c => c.id === state.activeCategory);

    if (category && category.items) {
        category.items.forEach(item => {
            const card = document.createElement("div");
            card.className = "item-card";
            card.innerHTML = `
                <h4>${t(item.name)}</h4>
                <p>${item.price} ֏</p>
            `;
            card.onclick = () => openModal(item);
            DOM.menuItemsGrid.appendChild(card);
        });
    }
}

function renderOrder() {
    if (!DOM.orderItemsList) return;
    DOM.orderItemsList.innerHTML = "";
    let subtotal = 0;

    state.currentOrder.forEach((item, index) => {
        const itemTotal = item.price * item.count;
        subtotal += itemTotal;

        const div = document.createElement("div");
        div.className = "order-item";
        div.innerHTML = `
            <div class="order-item-info">
                <strong>${t(item.name)} x ${item.count}</strong>
                ${item.comment ? `<div class="item-comment">💬 ${item.comment}</div>` : ''}
                <span>${itemTotal} ֏</span>
            </div>
            <div class="order-item-actions">
                <button class="count-btn" data-index="${index}" data-action="minus">-</button>
                <button class="count-btn" data-index="${index}" data-action="plus">+</button>
            </div>
        `;
        DOM.orderItemsList.appendChild(div);
    });

    // 10% Սպասարկման վճար
    const serviceFee = Math.round(subtotal * 0.10);
    const total = subtotal + serviceFee;

    if (DOM.subtotalPrice) DOM.subtotalPrice.textContent = subtotal;
    if (DOM.serviceFee) DOM.serviceFee.textContent = serviceFee;
    if (DOM.totalPrice) DOM.totalPrice.textContent = total;
}

function openModal(item) {
    state.selectedItemForModal = item;
    if (DOM.modalItemTitle) DOM.modalItemTitle.textContent = t(item.name);
    if (DOM.modalItemComment) DOM.modalItemComment.value = "";
    if (DOM.itemModal) DOM.itemModal.classList.remove("hidden");
}

function closeModal() {
    if (DOM.itemModal) DOM.itemModal.classList.add("hidden");
    state.selectedItemForModal = null;
}

function initEventListeners() {
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            setLang(btn.dataset.lang);
            renderI18n();
            renderCategories();
            renderMenuItems();
            renderOrder();
        });
    });

    if (DOM.cancelItemBtn) DOM.cancelItemBtn.addEventListener("click", closeModal);

    if (DOM.confirmItemBtn) {
        DOM.confirmItemBtn.addEventListener("click", () => {
            if (!state.selectedItemForModal) return;

            const commentText = DOM.modalItemComment ? DOM.modalItemComment.value.trim() : "";
            
            const existing = state.currentOrder.find(
                o => o.id === state.selectedItemForModal.id && o.comment === commentText
            );

            if (existing) {
                existing.count++;
            } else {
                state.currentOrder.push({
                    ...state.selectedItemForModal,
                    count: 1,
                    comment: commentText
                });
            }

            closeModal();
            renderOrder();
        });
    }

    if (DOM.orderItemsList) {
        DOM.orderItemsList.addEventListener("click", (e) => {
            if (e.target.classList.contains("count-btn")) {
                const index = Number(e.target.dataset.index);
                const action = e.target.dataset.action;

                if (action === "plus") {
                    state.currentOrder[index].count++;
                } else if (action === "minus") {
                    state.currentOrder[index].count--;
                    if (state.currentOrder[index].count <= 0) {
                        state.currentOrder.splice(index, 1);
                    }
                }
                renderOrder();
            }
        });
    }

    if (DOM.sendOrderBtn) {
        DOM.sendOrderBtn.addEventListener("click", () => {
            if (state.currentOrder.length === 0) {
                alert("Պատվերը դատարկ է:");
                return;
            }

            const payload = {
                items: state.currentOrder.map(i => ({
                    id: i.id,
                    name: t(i.name),
                    count: i.count,
                    price: i.price,
                    comment: i.comment
                })),
                subtotal: Number(DOM.subtotalPrice.textContent),
                serviceFee: Number(DOM.serviceFee.textContent),
                totalPrice: Number(DOM.totalPrice.textContent),
                createdAt: new Date().toISOString()
            };

            console.log("Order Submitted:", payload);
            alert("Պատվերը հաջողությամբ ուղարկվեց:");

            state.currentOrder = [];
            renderOrder();
        });
    }
}

function initApp() {
    renderI18n();
    renderCategories();
    renderMenuItems();
    renderOrder();
    initEventListeners();
}

initApp();