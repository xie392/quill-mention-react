import { createRoot } from 'react-dom/client'
import App from './App'
import { createElement } from 'react'

createRoot(document.getElementById('root')!).render(createElement(App))