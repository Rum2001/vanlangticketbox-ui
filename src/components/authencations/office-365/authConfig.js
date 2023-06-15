import { PublicClientApplication } from '@azure/msal-browser';
export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: process.env.REACT_APP_MSAL_CLIENT_ID,
    authority: process.env.REACT_APP_MSAL_AUTHORITY,
    redirectUri: process.env.REACT_APP_MSAL_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
});
export const logout = () => {
  msalInstance.logoutRedirect();
};