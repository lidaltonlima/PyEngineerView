import { dialog, BrowserWindow, app } from 'electron'
import fs from 'fs/promises'
import path from 'path'

const getMainWindow = (): BrowserWindow => {
	return BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
}

function getAssetPath(...paths: string[]): string {
	if (app.isPackaged) {
		return path.join(process.resourcesPath, 'templates', ...paths)
	} else {
		return path.join(__dirname, '../../src/backend/pyengineer/templates', ...paths)
	}
}

export async function copyFile(): Promise<void> {
	const mainWindow = getMainWindow()

	const result = await dialog.showSaveDialog(mainWindow, {
		title: 'Save Excel Template',
		filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
	})

	if (result.canceled || !result.filePath) return

	const origem = getAssetPath('excel_template.xlsx')

	try {
		// Copy file
		await fs.copyFile(origem, result.filePath)

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
