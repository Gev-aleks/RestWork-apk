let currentLang = localStorage.getItem("appLang") || "hy";

export const translations = {
    hy: {
        welcomeTitle: "Բարի գալուստ",
        welcomeSub: "Մուտք գործելու համար հավաքեք ձեր անհատական PIN կոդը։",
        terminal: "Տերմինալ",
        invalidUser: "Սխալ PIN կոդ",
        openShift: "Բացել անձնական հերթափոխը",
        subtotal: "Ապրանքների գումար",
        serviceFee: "Սպասարկում (10%)",
        total: "Ընդամենը",
        noOrders: "Պատվերներ չկան",
        confirmCancelOrder: "Վստա՞հ եք, որ ցանկանում եք չեղարկել պատվերը:",
        guests: "Հյուրեր",
        waiter: "Մատուցող",
        dateTime: "Օր / Ժամ",
        openTime: "Բացման ժամ",
        addedOrders: "Ավելացված պատվերներ",
        invalidate: "✕ Անվավեր",
        accept: "✓ Ընդունել",
        exit: "🚪 Ելք",
        bill: "🧾 Հաշիվ",
        cancel: "Չեղարկել",
        addComment: "Մեկնաբանություն",
        saveComment: "Պահպանել",
        itemCommentLabel: "Մեկնաբանություն ուտեստին․",
        mainZone: "Գլխավոր Սրահ",
        vipZone: "VIP Սենյակներ",
        balconyZone: "Պատշգամբ",
        logout: "Փակել էջը (Log Out)",
        enterMoreThanZero: "Խնդրում ենք մուտքագրել 0-ից մեծ թիվ",
        free: "Ազատ",
        busy: "Զբաղված"
    },
    ru: {
        welcomeTitle: "Добро пожаловать",
        welcomeSub: "Введите ваш личный PIN-код для входа.",
        terminal: "Терминал",
        invalidUser: "Неверный PIN-код",
        openShift: "Открыть личную смену",
        subtotal: "Сумма товаров",
        serviceFee: "Обслуживание (10%)",
        total: "Итого",
        noOrders: "Заказов нет",
        confirmCancelOrder: "Вы уверены, что хотите отменить заказ?",
        guests: "Гости",
        waiter: "Официант",
        dateTime: "Дата / Время",
        openTime: "Время открытия",
        addedOrders: "Добавленные заказы",
        invalidate: "✕ Отмена",
        accept: "✓ Принять",
        exit: "🚪 Выход",
        bill: "🧾 Счет",
        cancel: "Отмена",
        addComment: "Комментарий",
        saveComment: "Сохранить",
        itemCommentLabel: "Комментарий к блюду:",
        mainZone: "Главный Зал",
        vipZone: "VIP Комнаты",
        balconyZone: "Балкон",
        logout: "Выйти (Log Out)",
        enterMoreThanZero: "Пожалуйста, введите число больше 0",
        free: "Свободен",
        busy: "Занят"
    },
    en: {
        welcomeTitle: "Welcome",
        welcomeSub: "Enter your personal PIN code to login.",
        terminal: "Terminal",
        invalidUser: "Invalid PIN code",
        openShift: "Open Personal Shift",
        subtotal: "Subtotal",
        serviceFee: "Service Fee (10%)",
        total: "Total",
        noOrders: "No items added",
        confirmCancelOrder: "Are you sure you want to cancel the order?",
        guests: "Guests",
        waiter: "Waiter",
        dateTime: "Date / Time",
        openTime: "Open Time",
        addedOrders: "Added Orders",
        invalidate: "✕ Cancel",
        accept: "✓ Accept",
        exit: "🚪 Exit",
        bill: "🧾 Bill",
        cancel: "Cancel",
        addComment: "Add Comment",
        saveComment: "Save",
        itemCommentLabel: "Item Comment:",
        mainZone: "Main Hall",
        vipZone: "VIP Rooms",
        balconyZone: "Balcony",
        logout: "Log Out",
        enterMoreThanZero: "Please enter a number greater than 0",
        free: "Free",
        busy: "Busy"
    }
};

export function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("appLang", lang);
}

export function getLang() {
    return currentLang;
}

export function t(key) {
    if (typeof key === 'object' && key !== null) {
        return key[currentLang] || key['hy'] || '';
    }
    return translations[currentLang]?.[key] || key;
}