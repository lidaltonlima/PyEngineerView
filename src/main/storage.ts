import { BrowserWindow, OpenDialogReturnValue } from 'electron'
import { readFileSync } from 'fs'

export const loadJsonData = (filePath: string): object | void => {
	const focusedWin = BrowserWindow.getFocusedWindow()
	focusedWin?.webContents.send('open-json-file', JSON.parse(readFileSync(filePath, 'utf-8')))
}

export const loadExcelData = (result: OpenDialogReturnValue): object | void => {
	const focusedWin = BrowserWindow.getFocusedWindow()
	focusedWin?.webContents.send('open-excel-file', result)
}
