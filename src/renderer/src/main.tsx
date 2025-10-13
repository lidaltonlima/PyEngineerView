import './assets/main.scss'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { StructureProvider } from './contexts/Structure'
import { SceneProvider } from './contexts/Scene'
import { SelectionProvider } from './contexts/Selection'
import { FilesProvider } from './contexts/files'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<FilesProvider>
			<SelectionProvider>
				<SceneProvider>
					<StructureProvider>
						<App />
					</StructureProvider>
				</SceneProvider>
			</SelectionProvider>
		</FilesProvider>
	</StrictMode>
)
