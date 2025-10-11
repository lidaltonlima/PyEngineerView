import { BrowserWindow, OpenDialogReturnValue } from 'electron'
import { readFileSync } from 'fs'

export const loadJsonData = (result: OpenDialogReturnValue): object | void => {
	const focusedWin = BrowserWindow.getFocusedWindow()
	if (result.canceled || result.filePaths.length === 0) return
	focusedWin?.webContents.send(
		'open-json-file',
		JSON.parse(readFileSync(result.filePaths[0], 'utf-8'))
	)
}

export const loadExcelData = (result: OpenDialogReturnValue): object | void => {
	const focusedWin = BrowserWindow.getFocusedWindow()
	focusedWin?.webContents.send('open-excel-file', result)
}
