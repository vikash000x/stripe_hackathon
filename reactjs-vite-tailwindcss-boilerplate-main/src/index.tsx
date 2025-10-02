import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from './App'
import "./styles/global.css";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";


const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
     <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
