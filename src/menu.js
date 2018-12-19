import { remote } from 'electron';

const { Menu } = remote;

const contextMenuTemplate = [
    { label: '重置', role: 'reload' },
    { label: '打开/关闭调试', role: 'toggledevtools' },
    { type: 'separator' },
    { label: '退出', role: 'quit' },
];

const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    contextMenu.popup(remote.getCurrentWindow());
});
