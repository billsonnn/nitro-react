import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.scss';

//@ts-ignore
library.add(fas);

createRoot(document.getElementById('root')).render(<App />);
