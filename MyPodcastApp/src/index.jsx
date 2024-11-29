// Importing the StrictMode from React for running in development mode to help identify potential issues
import { StrictMode } from 'react';

// Importing createRoot from ReactDOM to render the React component in a DOM node
import { createRoot } from 'react-dom/client';

// Importing the main App component where the application logic resides
import App from '../src/App';

// Importing the global CSS file for styling the app
import '../src/index.css';

// Creating the root element of the app and rendering the App component inside StrictMode
createRoot(document.getElementById('root')).render(
  // StrictMode helps identify potential problems in the app during development
  <StrictMode>
    {/* The main App component gets rendered here */}
    <App />
  </StrictMode>,
);
