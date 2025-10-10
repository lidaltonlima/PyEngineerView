import { dialog, MenuItem, MenuItemConstructorOptions } from 'electron'
import { loadData } from './storage'

export const menuBarTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Open file',
				accelerator: 'Ctrl+O',
				click: () => {
					dialog
						.showOpenDialog({
							properties: ['openFile'],
							filters: [
								{
									name: 'JSON Files',
									extensions: ['json']
								}
							]
						})
						.then((result) => {
							// const focusedWin = BrowserWindow.getFocusedWindow()
							// focusedWin?.webContents.send('open-file', result)
							loadData(result.filePaths[0])
						})
						.catch((error) => {
							console.log(error)
						})
				}
			},
			{ label: 'Exit', accelerator: 'Alt+F4', role: 'quit' }
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
	}
]
