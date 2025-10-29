// MSAL Configuration
// Replace these with your actual Azure AD application credentials
export const msalConfig = {
  auth: {
    clientId: "63163e74-d327-4cdc-8df2-d0934feb082f", // Replace with your Azure AD client ID
    authority: "https://login.microsoftonline.com/412259ed-cfdd-49be-8186-814dfe58dc54", // Or use your specific tenant ID
    redirectUri: "http://localhost:5173", // Update this to match your app URL (Vite default is 5173)
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes for the API
export const loginRequest = {
  scopes: ["User.Read"], // Basic user profile scope
};

// Scopes for the backend API
export const apiRequest = {
  scopes: ["api://63163e74-d327-4cdc-8df2-d0934feb082f/access_as_user"], // Replace with your backend API scope
};
