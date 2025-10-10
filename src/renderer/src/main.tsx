import './assets/main.scss'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { StructureProvider } from './contexts/Structure'
import { SceneProvider } from './contexts/Scene'
import { SelectionProvider } from './contexts/Selection'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SelectionProvider>
			<SceneProvider>
				<StructureProvider>
					<App />
				</StructureProvider>
			</SceneProvider>
		</SelectionProvider>
	</StrictMode>
)
