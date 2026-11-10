import { menuCategories } from './config.js';
import { t, getLang, setLang } from './i18n.js';
import { releaseTable } from './chekTable.js';

let currentCategory = menuCategories[0]?.id || "salads";
let tempOrders = [];
let selectedIndexForComment = null;

const activeEmployee = JSON.parse(localStorage.getItem("activeEmployee"));
const selectedInfo = JSON.parse(localStorage.getItem("selectedTableInfo"));
const storedTables = JSON.parse(localStorage.getItem("tablesData"));

if (!activeEmployee || !selectedInfo || !storedTables || !storedTables[selectedInfo.zone]) {
    window.location.href = "pers.html";
}

const currentTable = storedTables[selectedInfo.zone]?.find(t => t.id === selectedInfo.id);

if (!currentTable) {
    window.location.href = "pers.html";
}

const isOwner = !currentTable.ownerId || currentTable.ownerId === activeEmployee.id;

function configureButtonsByPermission() {
    const cancelBtn = document.getElementById("cancelOrderBtn");
    const billBtn = document.getElementById("billBtn");
    const acceptBtn = document.getElementById("acceptOrderBtn");

    if (currentTable.status === "busy") {
        if (cancelBtn) {
            cancelBtn.textContent = t("exit");
            cancelBtn.onclick = () => {
                window.location.href = "pers.html";
            };
        }

        if (isOwner) {
            if (billBtn) {
                billBtn.classList.remove("hidden");
                billBtn.onclick = () => {
                    alert(`Հաշիվը տպված է ${currentTable.name}-ի համար:`);
                    currentTable.status = "free";
                    currentTable.guests = 0;
                    currentTable.orders = [];
                    currentTable.openTime = null;
                    currentTable.ownerId = null;

                    releaseTable(currentTable.id, selectedInfo.zone);
                    localStorage.setItem("tablesData", JSON.stringify(storedTables));
                    window.location.href = "pers.html";
                };
            }
        } else {
            if (billBtn) billBtn.classList.add("hidden");
        }
    } else {
        if (billBtn) billBtn.classList.add("hidden");
        if (cancelBtn) {
            cancelBtn.textContent = t("invalidate");
            cancelBtn.onclick = handleCancelOrder;
        }
    }

    if (acceptBtn) {
        acceptBtn.onclick = handleAcceptOrder;
    }
}

function handleCancelOrder() {
    if (confirm(t("confirmCancelOrder"))) {
        currentTable.status = "free";
        currentTable.guests = 0;
        currentTable.orders = [];
        currentTable.openTime = null;
        currentTable.ownerId = null;

        releaseTable(currentTable.id, selectedInfo.zone);
        localStorage.setItem("tablesData", JSON.stringify(storedTables));
        window.location.href = "pers.html";
    }
}

function handleAcceptOrder() {
    currentTable.orders = tempOrders;
    currentTable.status = tempOrders.length > 0 ? "busy" : "free";
    
    if (!currentTable.ownerId) {
        currentTable.ownerId = activeEmployee.id;
    }

    localStorage.setItem("tablesData", JSON.stringify(storedTables));
    window.location.href = "pers.html";
}

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === getLang());
    });
    configureButtonsByPermission();
    renderCategoryTabs();
    renderMenu();
    renderOrderList();
}

document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        setLang(btn.dataset.lang);
        applyTranslations();
    });
});

document.getElementById("tableNameDisplay").textContent = currentTable.name;
document.getElementById("tableGuestsDisplay").textContent = `${t("guests")}: ${currentTable.guests}`;
document.getElementById("orderWaiterName").textContent = `${activeEmployee.firstName} ${activeEmployee.lastName}`;
document.getElementById("tableOpenTimeDisplay").textContent = currentTable.openTime || new Date().toLocaleTimeString();

tempOrders = currentTable.orders ? JSON.parse(JSON.stringify(currentTable.orders)) : [];

function renderCategoryTabs() {
    const tabsContainer = document.querySelector(".category-tabs");
    if (!tabsContainer) return;
    tabsContainer.innerHTML = "";
    menuCategories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `cat-tab ${cat.id === currentCategory ? 'active' : ''}`;
        btn.textContent = t(cat.name);
        btn.addEventListener("click", () => {
            currentCategory = cat.id;
            renderCategoryTabs();
            renderMenu();
        });
        tabsContainer.appendChild(btn);
    });
}

function renderMenu() {
    const grid = document.getElementById("menuItemsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const category = menuCategories.find(c => c.id === currentCategory);
    if (!category || !category.items) return;

    category.items.forEach(item => {
        const card = document.createElement("div");
        card.className = "menu-card";
        card.innerHTML = `
            <div class="menu-item-name">${t(item.name)}</div>
            <div class="menu-item-price">${item.price} ֏</div>
        `;
        card.addEventListener("click", () => {
            const exist = tempOrders.find(o => o.id === item.id && !o.comment);
            if (exist) {
                exist.count += 1;
            } else {
                tempOrders.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    count: 1,
                    comment: ""
                });
            }
            renderOrderList();
        });
        grid.appendChild(card);
    });
}

const itemModal = document.getElementById("itemModal");
const modalItemTitle = document.getElementById("modalItemTitle");
const modalItemComment = document.getElementById("modalItemComment");

function openCommentModal(index) {
    selectedIndexForComment = index;
    const item = tempOrders[index];
    if (modalItemTitle) modalItemTitle.textContent = t(item.name);
    if (modalItemComment) modalItemComment.value = item.comment || "";
    itemModal?.classList.remove("hidden");
}

function closeModal() {
    itemModal?.classList.add("hidden");
    selectedIndexForComment = null;
}

document.getElementById("cancelItemBtn")?.addEventListener("click", closeModal);

document.getElementById("saveCommentBtn")?.addEventListener("click", () => {
    if (selectedIndexForComment === null) return;
    const commentText = modalItemComment.value.trim();
    tempOrders[selectedIndexForComment].comment = commentText;
    closeModal();
    renderOrderList();
});

function renderOrderList() {
    const list = document.getElementById("orderItemsList");
    if (!list) return;
    list.innerHTML = "";

    if (tempOrders.length === 0) {
        list.innerHTML = `<p class="empty-msg">${t("noOrders")}</p>`;
        document.getElementById("orderSubtotalPrice").textContent = "0 ֏";
        document.getElementById("orderServiceFee").textContent = "0 ֏";
        document.getElementById("orderTotalPrice").textContent = "0 ֏";
        return;
    }

    let subtotal = 0;
    tempOrders.forEach((item, index) => {
        const sum = item.price * item.count;
        subtotal += sum;
        
        const row = document.createElement("div");
        row.className = "order-item-row";
        row.innerHTML = `
            <div class="item-title-box" style="display:flex; flex-direction:column; flex:1; cursor:pointer;">
                <span class="item-title" style="font-weight:600; font-size: 16px;">${t(item.name)}</span>
                <span class="item-comment-text" style="font-size:11px; color:#ff9800;">
                    ${item.comment ? `💬 ${item.comment}` : `<i style="color:#777;">+ ${t("addComment")}</i>`}
                </span>
            </div>
            <div class="item-cnt-ctrl">
                <button class="cnt-btn minus">-</button>
                <span>${item.count}</span>
                <button class="cnt-btn plus">+</button>
            </div>
            <span class="item-sum">${sum} ֏</span>
        `;

        row.querySelector(".item-title-box").addEventListener("click", () => {
            openCommentModal(index);
        });

        row.querySelector(".minus").addEventListener("click", (e) => {
            e.stopPropagation();
            item.count -= 1;
            if (item.count <= 0) tempOrders.splice(index, 1);
            renderOrderList();
        });

        row.querySelector(".plus").addEventListener("click", (e) => {
            e.stopPropagation();
            item.count += 1;
            renderOrderList();
        });

        list.appendChild(row);
    });

    const serviceFee = Math.round(subtotal * 0.10);
    const totalPrice = subtotal + serviceFee;

    document.getElementById("orderSubtotalPrice").textContent = `${subtotal} ֏`;
    document.getElementById("orderServiceFee").textContent = `${serviceFee} ֏`;
    document.getElementById("orderTotalPrice").textContent = `${totalPrice} ֏`;
}

applyTranslations();