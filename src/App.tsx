// src/App.tsx
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import ToastProvider from "./contexts/ToastProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
