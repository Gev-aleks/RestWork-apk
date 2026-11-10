export let taken = JSON.parse(sessionStorage.getItem("takenTables")) || [];

export function saveTaken() {
    sessionStorage.setItem("takenTables", JSON.stringify(taken));
}

export function releaseTable(tableId, zone) {
    const filtered = taken.filter(t => !(t.id === tableId && t.zone === zone));
    taken.length = 0;
    taken.push(...filtered);
    saveTaken();
}