// Mapa de iconos heredados → Bootstrap Icons.
//
// La base de datos guarda los iconos del menú con clases heredadas de FontAwesome
// (`fa fa-graduation-cap`) y de la fuente "educate" de Atlantis (`educate-icon educate-event`).
// Este módulo las traduce a Bootstrap Icons (`bi bi-*`) en tiempo de render, para no
// depender de las fuentes FontAwesome/educate (retiradas del frontend).
//
// Uso: `tool.icono(claseHeredada)` (ver src/services/tools.js).
// Mantener al día cuando la BD incorpore iconos nuevos (ver CATALOGO_CONTROLES.md §2.2).

const MAPA = {
    // --- FontAwesome (logic / engine) ---
    "fa-arrow-up": "arrow-up",
    "fa-bars": "list",
    "fa-book": "book",
    "fa-building": "building",
    "fa-bullhorn": "megaphone",
    "fa-calculator": "calculator",
    "fa-calendar": "calendar",
    "fa-calendar-alt": "calendar-event",
    "fa-calendar-check": "calendar-check",
    "fa-calendar-times": "calendar-x",
    "fa-calendar-plus": "calendar-plus",
    "fa-calendar-minus": "calendar-minus",
    "fa-certificate": "award",
    "fa-chalkboard-teacher": "person-workspace",
    "fa-chart-bar": "bar-chart",
    "fa-chart-line": "graph-up",
    "fa-chart-pie": "pie-chart",
    "fa-check-circle": "check-circle",
    "fa-check-square": "check-square",
    "fa-child": "person",
    "fa-church": "building",
    "fa-clipboard-list": "clipboard-check",
    "fa-clock": "clock",
    "fa-cloud-download-alt": "cloud-arrow-down",
    "fa-cog": "gear",
    "fa-cogs": "gear-wide-connected",
    "fa-door-open": "door-open",
    "fa-edit": "pencil-square",
    "fa-envelope": "envelope",
    "fa-envelope-open": "envelope-open",
    "fa-exclamation-triangle": "exclamation-triangle",
    "fa-eye": "eye",
    "fa-file-import": "file-earmark-arrow-down",
    "fa-file-pdf": "file-earmark-pdf",
    "fa-file-signature": "file-earmark-text",
    "fa-file-text": "file-text",
    "fa-fire-extinguisher": "fire",
    "fa-flag": "flag",
    "fa-folder-open": "folder2-open",
    "fa-gear": "gear",
    "fa-glasses": "eyeglasses",
    "fa-graduation-cap": "mortarboard",
    "fa-grin-beam-sweat": "emoji-frown",
    "fa-heart": "heart",
    "fa-home": "house",
    "fa-key": "key",
    "fa-list": "list-ul",
    "fa-list-alt": "card-list",
    "fa-map-marker": "geo-alt",
    "fa-map-pin": "geo-alt",
    "fa-money": "cash",
    "fa-money-bill-alt": "cash",
    "fa-ok": "check-lg",
    "fa-paper-plane": "send",
    "fa-pen": "pencil",
    "fa-pencil-alt": "pencil",
    "fa-plus": "plus-lg",
    "fa-plus-circle": "plus-circle",
    "fa-power-off": "power",
    "fa-question-circle": "question-circle",
    "fa-search": "search",
    "fa-tasks": "list-task",
    "fa-th-large": "grid-3x3-gap",
    "fa-tint": "droplet",
    "fa-times": "x-lg",
    "fa-trash-alt": "trash",
    "fa-university": "bank",
    "fa-user": "person",
    "fa-user-check": "person-check",
    "fa-user-edit": "person-gear",
    "fa-user-plus": "person-plus",
    "fa-users": "people",
    "fa-whatsapp": "whatsapp",
    "fa-window-close": "x-square",

    // --- Fuente "educate" de Atlantis ---
    "educate-apps": "grid",
    "educate-bell": "bell",
    "educate-charts": "bar-chart",
    "educate-course": "journal-bookmark",
    "educate-data-table": "table",
    "educate-event": "calendar-event",
    "educate-form": "ui-checks",
    "educate-home": "house",
    "educate-info": "info-circle",
    "educate-interface": "layout-text-window",
    "educate-landing": "house-door",
    "educate-library": "book",
    "educate-menu": "list",
    "educate-message": "chat-dots",
    "educate-price-tag": "tag",
    "educate-professor": "person-video3",
    "educate-settings": "gear",
    "educate-star": "star",
    "educate-student": "mortarboard"
};

// Traduce una clase heredada a Bootstrap Icons. Si ya trae `bi-`, se respeta.
// Los tokens desconocidos con prefijo `fa-` se mapean por nombre (fa-arrow-up → bi-arrow-up).
export function icono(clase) {
    if (!clase || typeof clase !== "string") return "bi bi-circle";
    if (/\bbi-[a-z0-9-]+/.test(clase)) return clase.trim();

    const tokens = clase.match(/\b(?:fa-[a-z0-9-]+|educate-[a-z0-9-]+)/g) || [];
    const reales = tokens.filter((t) => t !== "educate-icon");
    if (reales.length === 0) return clase.trim() || "bi bi-circle";

    const extra = clase
        .replace(/\b(?:fa|educate)-[a-z0-9-]+/g, "") // quita tokens de icono (fa-*/educate-*)
        .replace(/\bfa[srlbdt]*\b/g, "")             // quita tokens de estilo (fas/far/fab…)
        .replace(/\s+/g, " ")
        .replace(/^[\s-]+|[\s-]+$/g, "")
        .trim();

    const bi = reales
        .map((t) => "bi bi-" + (MAPA[t] || (t.startsWith("fa-") ? t.slice(3) : "circle")))
        .join(" ");

    return (extra ? extra + " " : "") + bi;
}

export default { icono, MAPA };
