import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Hide the pre-loader once the app is rendered
const loader = document.getElementById('loader');
if (loader) {
  loader.style.display = 'none';
}
