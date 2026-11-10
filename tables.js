import { workStaff } from './config.js';
import { t, getLang, setLang } from './i18n.js';
import { releaseTable } from './chekTable.js';

let currentZone = "main";
let selectedTable = null;
let currentGuestCount = "";

const activeEmployee = JSON.parse(localStorage.getItem("activeEmployee"));
if (!activeEmployee) {
    window.location.href = "index.html";
}

document.getElementById("activeWaiterInfo").textContent = `${t("waiter")}՝ ${activeEmployee.firstName} ${activeEmployee.lastName}`;

let tablesData = JSON.parse(localStorage.getItem("tablesData")) || {
    main: Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `Սեղան ${i + 1}`, status: "free", guests: 0, orders: [] })),
    vip: Array.from({ length: 20 }, (_, i) => ({ id: 101 + i, name: `VIP ${i + 1}`, status: "free", guests: 0, orders: [] })),
    balcony: Array.from({ length: 20 }, (_, i) => ({ id: 201 + i, name: `Պատշգամբ ${i + 1}`, status: "free", guests: 0, orders: [] }))
};

function renderTables() {
    const grid = document.getElementById("tablesGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const zoneTables = tablesData[currentZone] || [];
    zoneTables.forEach(table => {
        const card = document.createElement("div");
        card.className = `table-card ${table.status}`;
        card.innerHTML = `
            <div class="table-name">${table.name}</div>
            <div class="table-info">
                <span>${table.status === 'free' ? t('free') : t('busy')}</span>
                <span>👤 ${table.guests}</span>
            </div>
        `;

        card.addEventListener("click", () => {
            selectedTable = table;
            if (table.status === "free") {
                openGuestsModal(table);
            } else {
                localStorage.setItem("selectedTableInfo", JSON.stringify({ id: table.id, zone: currentZone }));
                window.location.href = "order.html";
            }
        });

        grid.appendChild(card);
    });
}

function openGuestsModal(table) {
    const modal = document.getElementById("guestsModal");
    document.getElementById("modalTableName").textContent = table.name;
    currentGuestCount = "";
    document.getElementById("guestCountDisplay").textContent = "0";
    modal?.classList.remove("hidden");
}

document.querySelectorAll(".zone-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".zone-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentZone = btn.dataset.zone;
        renderTables();
    });
});

document.querySelectorAll(".guest-num").forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentGuestCount.length < 2) {
            currentGuestCount += btn.value;
            document.getElementById("guestCountDisplay").textContent = currentGuestCount;
        }
    });
});

document.getElementById("guestClearBtn")?.addEventListener("click", () => {
    currentGuestCount = "";
    document.getElementById("guestCountDisplay").textContent = "0";
});

document.getElementById("guestCancelBtn")?.addEventListener("click", () => {
    document.getElementById("guestsModal")?.classList.add("hidden");
});

document.getElementById("guestConfirmBtn")?.addEventListener("click", () => {
    const guests = parseInt(currentGuestCount);
    if (!guests || guests <= 0) {
        alert(t("enterMoreThanZero"));
        return;
    }

    if (selectedTable) {
        selectedTable.guests = guests;
        selectedTable.status = "busy";
        selectedTable.openTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem("tablesData", JSON.stringify(tablesData));
        
        localStorage.setItem("selectedTableInfo", JSON.stringify({ id: selectedTable.id, zone: currentZone }));
        window.location.href = "order.html";
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("activeEmployee");
    window.location.href = "index.html";
});

renderTables();