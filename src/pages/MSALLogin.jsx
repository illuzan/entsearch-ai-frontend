import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { loginRequest } from "../msal-config";

export default function MSALLogin() {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  // Redirect to chat if already logged in
  useEffect(() => {
    if (accounts.length > 0) {
      // User is already logged in, redirect to chat
      navigate("/");
    }
  }, [accounts, navigate]);

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);

      // Get access token
      if (response && response.accessToken) {
        sessionStorage.setItem("msal_access_token", response.accessToken);
      } else {
        // Get token using silent flow
        const tokenResponse = await instance.acquireTokenSilent(loginRequest);
        sessionStorage.setItem("msal_access_token", tokenResponse.accessToken);
      }

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Agentic AI
          </h1>
          <p className="text-gray-600">Sign in with Microsoft</p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
          </svg>
          Sign in with Microsoft
        </button>

        {/* Footer text */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Securely sign in using your Microsoft account
        </p>
      </div>
    </div>
  );
}
