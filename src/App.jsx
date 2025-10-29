import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import MSALLogin from "./pages/MSALLogin";
import Chat from "./pages/Chat";

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<MSALLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
