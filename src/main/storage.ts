import { BrowserWindow } from 'electron'
import { readFileSync } from 'fs'

export const loadData = (filePath: string): object | void => {
	const focusedWin = BrowserWindow.getFocusedWindow()
	focusedWin?.webContents.send('open-file', JSON.parse(readFileSync(filePath, 'utf-8')))
}
