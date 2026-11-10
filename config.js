export const workStaff = {
    Perss: [
        { id: 1, firstName: "Արմեն", lastName: "Մարտիրոսյան", position: "Կառավարիչ", password: 11111 },
        { id: 2, firstName: "Անի", lastName: "Գևորգյան", position: "Գանձապահ", password: 22222 },
        { id: 3, firstName: "Դավիթ", lastName: "Սարգսյան", position: "Մատուցող", password: 33333 },
        { id: 4, firstName: "Էլեն", lastName: "Հակոբյան", position: "Մատուցող", password: 44444 }
    ]
};

const createTables = (prefix, offset) => {
    return Array.from({ length: 20 }, (_, index) => ({
        id: offset + index + 1,
        name: `${prefix} ${index + 1}`,
        seats: 4,
        status: "free",
        guests: 0,
        orders: [],
        openTime: null
    }));
};

export const tablesData = {
    main: createTables("Սեղան", 0),
    vip: createTables("VIP", 100),
    balcony: createTables("Պատշգամբ", 200)
};

export const menuCategories = [
    {
        id: "salads",
        name: { hy: "🥗 Աղցաններ", ru: "🥗 Салаты", en: "🥗 Salads" },
        items: [
            { id: 1, name: { hy: "Հին Երևան", ru: "Старый Ереван", en: "Old Yerevan" }, price: 2200 },
            { id: 2, name: { hy: "Հին Հունական", ru: "Древнегреческий", en: "Ancient Greek" }, price: 2000 },
            { id: 3, name: { hy: "Հավով և ընկույզով", ru: "С курицей и орехами", en: "Chicken with walnuts" }, price: 2100 },
            { id: 4, name: { hy: "Ամառային", ru: "Летний", en: "Summer" }, price: 2500 }
        ]
    },
    {
        id: "steak",
        name: { hy: "🥩 Սթեյքեր", ru: "🥩 Стейки", en: "🥩 Steaks" },
        items: [
            { id: 9, name: { hy: "Ռիբայ", ru: "Рибай", en: "Ribeye" }, price: 4900 },
            { id: 10, name: { hy: "Ֆիլե մինյոն", ru: "Филе миньон", en: "Fillet mignon" }, price: 4900 }
        ]
    }
];