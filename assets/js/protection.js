// Защита от горячих клавиш
document.addEventListener('keydown', (e) => {
    const blockedKeys = [
        'F12', // DevTools
        { ctrl: true, shift: true, key: 'I' }, // Ctrl+Shift+I
        { ctrl: true, shift: true, key: 'C' }, // Ctrl+Shift+C
        { ctrl: true, key: 'u' }, // Ctrl+U
        { ctrl: true, key: 's' }, // Ctrl+S
        { ctrl: true, key: 'a' }, // Ctrl+A
        { ctrl: true, key: 'c' }, // Ctrl+C
        { ctrl: true, key: 'v' }, // Ctrl+V
        { ctrl: true, key: 'x' }, // Ctrl+X
        { key: 'PrintScreen' } // Скриншот
    ];

    for (const block of blockedKeys) {
        if (typeof block === 'string' && e.key === block) {
            e.preventDefault();
            return false;
        } else if (typeof block === 'object' &&
            e.ctrlKey === !!block.ctrl &&
            e.shiftKey === !!block.shift &&
            e.key === block.key) {
            e.preventDefault();
            return false;
        }
    }
});

// Защита от контекстного меню, выделения, перетаскивания и копирования
['contextmenu', 'selectstart', 'dragstart', 'copy', 'paste', 'cut'].forEach(event => {
    document.addEventListener(event, (e) => {
        e.preventDefault();
        return false;
    });
});

// Обнаружение DevTools
const detectDevTools = () => {
    const threshold = 100;
    const isDevToolsOpen = (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold ||
        /./.toString().length > 30 // Проверка на debugger
    );
    if (isDevToolsOpen) {
        document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-family: Arial, sans-serif; text-align: center;"><h1 style="color: #ff0000;">Доступ запрещен!</h1><p>Этот сайт защищен от копирования.</p></div>';
        clearInterval(checkInterval);
    }
};
const checkInterval = setInterval(detectDevTools, 1000);
window.addEventListener('resize', detectDevTools);

// Защита консоли
const noop = () => {};
const consoleMethods = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'clear', 'count', 'countReset', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'table', 'time', 'timeEnd', 'timeLog', 'trace'];
consoleMethods.forEach(method => {
    console[method] = noop;
});
Object.defineProperty(window, 'console', { value: console, writable: false, configurable: false });

// Защита от изменений DOM
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
            // Логирование попыток изменения DOM (консоль отключена, можно отправить на сервер)
            // fetch('/log', { method: 'POST', body: JSON.stringify({ event: 'DOM modification attempt' }) });
        }
    });
});
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
});

// Защита заголовка и favicon
const originalTitle = document.title;
const originalFavicon = document.querySelector('link[rel="icon"]')?.href;
setInterval(() => {
    if (document.title !== originalTitle) document.title = originalTitle;
    const currentFavicon = document.querySelector('link[rel="icon"]');
    if (currentFavicon && originalFavicon && currentFavicon.href !== originalFavicon) {
        currentFavicon.href = originalFavicon;
    }
}, 1000);

// Добавление водяного знака
const addWatermark = () => {
    const watermark = document.createElement('div');
    watermark.style.position = 'fixed';
    watermark.style.top = '10px';
    watermark.style.right = '10px';
    watermark.style.opacity = '0.5';
    watermark.style.color = '#fff';
    watermark.style.fontSize = '20px';
    watermark.style.pointerEvents = 'none';
    watermark.innerText = '';
    document.body.appendChild(watermark);
};
window.onload = addWatermark;

// Анти-отладка
(function antiDebug() {
    if (/./.toString().length > 30) {
        document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; color: #fff; font-family: Arial, sans-serif; text-align: center;"><h1 style="color: #ff0000;">Отладка запрещена!</h1></div>';
    }
    setTimeout(antiDebug, 1000);
})();