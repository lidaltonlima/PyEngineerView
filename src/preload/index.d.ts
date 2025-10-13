import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
	interface Window {
		electron: ElectronAPI
		api: unknown
		dialogAPI: {
			showError: (title: string, message: string) => void
			showInfo: (title: string, message: string) => void
		}
		filesAPI: {
			saveFile: (
				data: object,
				path: string | undefined
			) => Promise<{ success: boolean; canceled?: boolean; error?: Error }>
			saveAsFile: (data: object) => Promise<{ success: boolean; canceled?: boolean; error?: Error }>
		}
	}
}
