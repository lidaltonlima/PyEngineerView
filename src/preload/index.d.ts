import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
	interface Window {
		electron: ElectronAPI
		api: unknown
		dialogAPI: {
			showError: (title: string, message: string) => void
			showInfo: (title: string, message: string) => void
		}
	}
}
