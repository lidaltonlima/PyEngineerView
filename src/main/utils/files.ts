import { app, BrowserWindow, dialog, OpenDialogReturnValue } from 'electron'
import { readFileSync } from 'fs'
import fs from 'fs'
import path from 'path'

export const getMainWindow = (): BrowserWindow => {
	return BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
}

function getAssetPath(...paths: string[]): string {
	if (app.isPackaged) {
		return path.join(process.resourcesPath, 'templates', ...paths)
	} else {
		return path.join(__dirname, '../../src/backend/pyengineer/templates', ...paths)
	}
}

// Open files /////////////////////////////////////////////////////////////////////////////////////
export const openJson = (result: OpenDialogReturnValue): object | void => {
	const mainWindow = getMainWindow()
	if (result.canceled || result.filePaths.length === 0) return
	mainWindow.webContents.send(
		'open-json-file',
		JSON.parse(readFileSync(result.filePaths[0], 'utf-8'))
	)
}

export const openExcel = (result: OpenDialogReturnValue): object | void => {
	const MainWindow = getMainWindow()
	MainWindow.webContents.send('open-excel-file', result)
}

export function openFileDialog(): void {
	const mainWindow = getMainWindow()
	dialog
		.showOpenDialog(mainWindow, {
			properties: ['openFile'],
			filters: [
				{
					name: 'Excel or Json Files',
					extensions: ['xlsx', 'json']
				}
			]
		})
		.then((result) => {
			if (!result.canceled && result.filePaths.length > 0) {
				const filePath = result.filePaths[0]
				const extension = path.extname(filePath)
				if (extension === '.json') openJson(result)
				else if (extension === '.xlsx') openExcel(result)
			}
		})
		.catch((error) => {
			console.log(error)
		})
}

// Save files /////////////////////////////////////////////////////////////////////////////////////
export async function copyExcel(): Promise<void> {
	const mainWindow = getMainWindow()

	const result = await dialog.showSaveDialog(mainWindow, {
		title: 'Save Excel Template',
		filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
	})

	if (result.canceled || !result.filePath) return

	const origem = getAssetPath('excel_template.xlsx')

	try {
		// Copy file
		await fs.promises.copyFile(origem, result.filePath)

		// Show success message
		await dialog.showMessageBox(mainWindow, {
			type: 'info',
			title: 'File Saved',
			message: `File copied successfully to:\n${result.filePath}`
		})
	} catch (error) {
		console.error(error)
		await dialog.showMessageBox(mainWindow, {
			type: 'error',
			title: 'Error',
			message: 'Failed to copy the file.',
			detail: String(error)
		})
	}
}

export async function saveJsonDialog(data: object): Promise<void> {
	const mainWindow = getMainWindow()
	try {
		const result = await dialog.showSaveDialog(mainWindow, {
			title: 'Save File',
			defaultPath: 'structure.json',
			buttonLabel: 'Save',
			filters: [
				{
					name: 'JSON',
					extensions: ['json']
				}
			]
		})

		if (!result.canceled && result.filePath) {
			// Save the content to the chosen path
			fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2))
		}
	} catch (error) {
		console.error('Error saving file:', error)
	}
}
