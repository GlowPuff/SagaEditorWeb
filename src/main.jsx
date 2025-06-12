import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
//my library
import { createTranslatorTheme } from "./lib/core.js";
//mui
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//routes
import ErrorPage from "./components/ErrorPage";
import CampaignManagerPanel from "./components/CampaignManager/CampaignManagerPanel.jsx";
// fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
//mui aria hidden label fix
import MuiAriaFix from "./components/MuiAriaFix.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/campaign-manager",
    element: <CampaignManagerPanel />,
  },
]);

const darkTheme = createTheme(createTranslatorTheme);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <div> */}
    <MuiAriaFix rootSelector="#root" />
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
    {/* </div> */}
  </StrictMode>
);
