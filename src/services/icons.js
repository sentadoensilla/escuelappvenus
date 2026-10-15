// Mapa de iconos heredados → Iconify (Tabler Icons).
//
// La base de datos guarda los iconos del menú con clases heredadas de FontAwesome
// (`fa fa-graduation-cap`) y de la fuente "educate" de Atlantis (`educate-icon educate-event`).
// Este módulo las traduce a nombres Iconify de Tabler (`tabler:school`) en tiempo de render.
//
// Uso: `tool.icono(claseHeredada)` y render con `<AppIcon icon={...} />` (ver
// src/services/tools.js y src/pages/components/head.js).
// Iconografía: ver CATALOGO_CONTROLES.md §Iconos.

const MAPA = {
    // --- FontAwesome (logic / engine) ---
    'fa-arrow-up': 'arrow-up',
    'fa-bars': 'menu-2',
    'fa-book': 'book',
    'fa-building': 'building',
    'fa-bullhorn': 'speakerphone',
    'fa-calculator': 'calculator',
    'fa-calendar': 'calendar',
    'fa-calendar-alt': 'calendar-event',
    'fa-calendar-check': 'calendar-check',
    'fa-calendar-times': 'calendar-x',
    'fa-calendar-plus': 'calendar-plus',
    'fa-calendar-minus': 'calendar-minus',
    'fa-certificate': 'certificate',
    'fa-chalkboard-teacher': 'school',
    'fa-chart-bar': 'chart-bar',
    'fa-chart-line': 'chart-line',
    'fa-chart-pie': 'chart-pie',
    'fa-check-circle': 'circle-check',
    'fa-check-square': 'checkbox',
    'fa-child': 'mood-kid',
    'fa-church': 'building-church',
    'fa-clipboard-list': 'clipboard-list',
    'fa-clock': 'clock',
    'fa-cloud-download-alt': 'cloud-download',
    'fa-cog': 'settings',
    'fa-cogs': 'settings',
    'fa-door-open': 'door-enter',
    'fa-edit': 'edit',
    'fa-envelope': 'mail',
    'fa-envelope-open': 'mail-opened',
    'fa-exclamation-triangle': 'alert-triangle',
    'fa-eye': 'eye',
    'fa-file-import': 'file-import',
    'fa-file-pdf': 'file-type-pdf',
    'fa-file-signature': 'file-text',
    'fa-file-text': 'file-text',
    'fa-fire-extinguisher': 'fire-extinguisher',
    'fa-flag': 'flag',
    'fa-folder-open': 'folder-open',
    'fa-gear': 'settings',
    'fa-glasses': 'eye',
    'fa-graduation-cap': 'school',
    'fa-grin-beam-sweat': 'mood-sad',
    'fa-heart': 'heart',
    'fa-home': 'home',
    'fa-key': 'key',
    'fa-list': 'list',
    'fa-list-alt': 'list-details',
    'fa-map-marker': 'map-pin',
    'fa-map-pin': 'map-pin',
    'fa-money': 'cash',
    'fa-money-bill-alt': 'cash',
    'fa-ok': 'check',
    'fa-paper-plane': 'send',
    'fa-pen': 'pencil',
    'fa-pencil-alt': 'pencil',
    'fa-plus': 'plus',
    'fa-plus-circle': 'circle-plus',
    'fa-power-off': 'power',
    'fa-question-circle': 'help-circle',
    'fa-search': 'search',
    'fa-tasks': 'list-check',
    'fa-th-large': 'layout-grid',
    'fa-tint': 'droplet',
    'fa-times': 'x',
    'fa-trash-alt': 'trash',
    'fa-university': 'building-bank',
    'fa-user': 'user',
    'fa-user-check': 'user-check',
    'fa-user-edit': 'user-edit',
    'fa-user-plus': 'user-plus',
    'fa-users': 'users',
    'fa-whatsapp': 'brand-whatsapp',
    'fa-window-close': 'square-x',

    // --- Fuente "educate" de Atlantis ---
    'educate-apps': 'layout-grid',
    'educate-bell': 'bell',
    'educate-charts': 'chart-bar',
    'educate-course': 'notebook',
    'educate-data-table': 'table',
    'educate-event': 'calendar-event',
    'educate-form': 'forms',
    'educate-home': 'home',
    'educate-info': 'info-circle',
    'educate-interface': 'layout-dashboard',
    'educate-landing': 'home',
    'educate-library': 'book',
    'educate-menu': 'menu-2',
    'educate-message': 'message',
    'educate-price-tag': 'tag',
    'educate-professor': 'school',
    'educate-settings': 'settings',
    'educate-star': 'star',
    'educate-student': 'school'
};

// Traduce una clase heredada a un nombre Iconify de Tabler (`tabler:*`).
// Si ya trae un nombre Iconify (`set:name`), se respeta.
export function icono(clase) {
    if (!clase || typeof clase !== 'string') return 'tabler:circle';
    if (/^[a-z0-9-]+:[a-z0-9-]+$/i.test(clase.trim())) return clase.trim();

    const tokens = clase.match(/\b(?:fa-[a-z0-9-]+|educate-[a-z0-9-]+)/g) || [];
    const reales = tokens.filter((t) => t !== 'educate-icon');
    if (reales.length === 0) return 'tabler:circle';

    const nombre = reales[0]; // el menú usa un solo icono por entrada
    const bi = MAPA[nombre] || (nombre.startsWith('fa-') ? nombre.slice(3) : 'circle');
    return 'tabler:' + bi;
}

export default { icono, MAPA };
