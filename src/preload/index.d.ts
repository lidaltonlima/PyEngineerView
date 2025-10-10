import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
	interface Window {
		electron: ElectronAPI
		api: unknown
		electronData: {
			getData: (filePath) => Promise
			saveData: (data) => void
		}
	}
}
