import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css'; 
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { appStore } from "./store/appStore.ts";
import { BrowserRouter as Router } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={appStore}>
      <Router>
        <ThemeProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </ThemeProvider>
        </Router>
    </Provider>
  </StrictMode>
);
