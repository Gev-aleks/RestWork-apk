import { workStaff } from './config.js';
import { t, getLang, setLang } from './i18n.js';

let pin = "";
const pinDisplay = document.getElementById("pinDisplay");
const loginScreen = document.getElementById("loginScreen");
const shiftScreen = document.getElementById("shiftScreen");

function handleInput(val) {
    if (val === "C") {
        pin = "";
    } else if (/^[0-9]$/.test(val)) {
        if (pin.length < 20) pin += val;
    } else if (val === "enter") {
        checkPin();
        return;
    }
    if (pinDisplay) pinDisplay.value = "•".repeat(pin.length);
}

document.querySelectorAll(".key-btn").forEach(btn => {
    btn.addEventListener("click", () => handleInput(btn.value));
});

function checkPin() {
    const emp = workStaff.Perss.find(p => String(p.password) === pin);
    if (emp) {
        localStorage.setItem("activeEmployee", JSON.stringify(emp));
        document.getElementById("shiftUserName").textContent = `${emp.firstName} ${emp.lastName}`;
        document.getElementById("shiftUserPosition").textContent = emp.position;
        loginScreen.classList.add("hidden");
        shiftScreen.classList.remove("hidden");
    } else {
        alert(t("invalidUser"));
        pin = "";
        if (pinDisplay) pinDisplay.value = "";
    }
}

document.getElementById("startShiftBtn")?.addEventListener("click", () => {
    window.location.href = "pers.html";
});