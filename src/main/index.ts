import { app, shell, BrowserWindow, nativeTheme, Menu, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { menuBarTemplate } from './menuBar'

import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import path from 'path'
import { saveJsonDialog } from './utils/files'

// Variables
let baseURL = ''

function createWindow(): void {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		show: false,
		backgroundColor: 'black',
		// autoHideMenuBar: true,
		...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false
		}
	})

	Menu.setApplicationMenu(Menu.buildFromTemplate(menuBarTemplate))

	mainWindow.on('ready-to-show', () => {
		mainWindow.maximize()
		mainWindow.show()
	})

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url)
		return { action: 'deny' }
	})

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
	// IPC //////////////////////////////////////////////////////////////////////////////////////////
	// Send port number to renderer process *********************************************************
	const port = await startPythonBackend()
	baseURL = `http://127.0.0.1:${port}`
	ipcMain.on('finish-load', (event) => {
		event.sender.send('backend-port', baseURL)
	})

	// Files **************************************************************************************
	ipcMain.on('save-as-file', (_event, data) => {
		saveJsonDialog(data)
	})

	// Dialogs **************************************************************************************
	ipcMain.on('dialog-error', (_event, title, message) => {
		dialog.showErrorBox(title, message)
	})
	ipcMain.on('dialog-info', (_event, title, message) => {
		dialog.showMessageBox({
			type: 'info',
			title,
			message
		})
	})
	/////////////////////////////////////////////////////////////////////////////////////////////////

	// Set app user model id for windows
	electronApp.setAppUserModelId('com.electron')

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	createWindow()

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})

	// Dark theme
	nativeTheme.themeSource = 'dark'
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

// Ensure the Python process is killed when the app is closed
app.on('before-quit', (event) => {
	event.preventDefault() // Prevent the default quit behavior
	killPythonProcess().finally(() => {
		app.exit() // Exit the app after killing the process
	})
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// Functions //////////////////////////////////////////////////////////////////////////////////////
let pyProc: ChildProcessWithoutNullStreams | null = null
async function startPythonBackend(): Promise<number> {
	return new Promise((resolve) => {
		const isDev = !app.isPackaged // Verify if we are in development or production

		// Path to the Python executable or script
		if (isDev) {
			const vEnvPython = path.join(__dirname, '../../src/backend/.venv/Scripts/python.exe')
			const backendPath = path.join(__dirname, '../../src/backend/main.py')
			pyProc = spawn(vEnvPython, [backendPath])
		} else {
			const backendPath = path.join(process.resourcesPath, 'backend', 'engineer.exe')
			pyProc = spawn(backendPath)
		}

		pyProc.stdout.on('data', (data) => {
			console.log(`Python: ${data}`)
			const line = data.toString()
			const match = line.match(/Using dynamic port:\s*(\d+)/)
			if (match) {
				resolve(parseInt(match[1], 10))
			}
		})

		pyProc.stderr.on('data', (data) => {
			console.error(`Python: ${data}`)
		})

		pyProc.on('close', (code) => {
			console.log(`Python process exited with code ${code}`)
		})
	})
}

async function killPythonProcess(): Promise<void> {
	if (!pyProc) {
		throw Error('No Python process to kill')
	}
	try {
		pyProc.kill('SIGTERM')
	} catch (err) {
		console.error('Error closing backend:', err)
	}
}
