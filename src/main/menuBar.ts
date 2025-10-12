import { dialog, MenuItem, MenuItemConstructorOptions, BrowserWindow } from 'electron'
import { openJson, openExcel, copyExcel } from './utils/files'

const getMainWindow = (): BrowserWindow => {
	return BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
}

export const menuBarTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Open Excel',
				accelerator: 'Ctrl+O',
				click: () => {
					const mainWindow = getMainWindow()
					dialog
						.showOpenDialog(mainWindow, {
							properties: ['openFile'],
							filters: [
								{
									name: 'Excel Files',
									extensions: ['xlsx']
								}
							]
						})
						.then((result) => {
							openExcel(result)
						})
						.catch((error) => {
							console.log(error)
						})
				}
			},
			{
				label: 'Open Json',
				accelerator: 'Ctrl+J',
				click: () => {
					const mainWindow = getMainWindow()
					dialog
						.showOpenDialog(mainWindow, {
							properties: ['openFile'],
							filters: [
								{
									name: 'JSON Files',
									extensions: ['json']
								}
							]
						})
						.then((result) => {
							openJson(result)
						})
						.catch((error) => {
							console.log(error)
						})
				}
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
