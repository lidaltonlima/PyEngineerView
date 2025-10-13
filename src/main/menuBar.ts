import { MenuItem, MenuItemConstructorOptions } from 'electron'
import { copyExcel, openFileDialog, getMainWindow } from './utils/files'

export const menuBarTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Save',
				accelerator: 'Ctrl+S',
				click: () => {
					const MainWindow = getMainWindow()
					MainWindow.webContents.send('save-file')
				}
			},
			{
				label: 'Save As',
				accelerator: 'Ctrl+Shift+S',
				click: () => {
					const MainWindow = getMainWindow()
					MainWindow.webContents.send('save-as-file')
				}
			},
			{
				label: 'Open File',
				accelerator: 'Ctrl+O',
				click: openFileDialog
			},
			{ type: 'separator' },
			{ label: 'Exit', accelerator: 'Alt+F4', role: 'quit' }
		]
	},
	{
		label: 'Calculate',
		submenu: [
			{
				label: 'Calculate Structure',
				accelerator: 'Alt+C',
				click: () => {
					const mainWindow = getMainWindow()
					mainWindow.webContents.send('calculate-structure')
				}
			}
		]
	},
	{
		label: 'View',
		submenu: [
			{ label: 'Zoom In', accelerator: 'Ctrl+numAdd', role: 'zoomIn' },
			{ label: 'Zoom Out', accelerator: 'Ctrl+numSub', role: 'zoomOut' },
			{ label: 'Reset Zoom', accelerator: 'Ctrl+num0', role: 'resetZoom' },
			{ type: 'separator' },
			{ label: 'Reload', accelerator: 'Ctrl+R', role: 'reload' },
			{ label: 'Force Reload', accelerator: 'Ctrl+Shift+R', role: 'forceReload' },
			{ type: 'separator' },
			{ label: 'Toggle Full Screen', accelerator: 'F11', role: 'togglefullscreen' }
		]
	},
	{
		label: 'Window',
		submenu: [
			{ label: 'Minimize', accelerator: 'Ctrl+M', role: 'minimize' },
			{ label: 'Close', accelerator: 'Ctrl+W', role: 'close' }
		]
	},
	{
		label: 'Templates',
		submenu: [
			{
				label: 'Get Excel Template',
				click: copyExcel
			}
		]
	}
]
