import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Login from "./scenes/login/login";
import ProtectedRoute from "./Providers/ProtectedRoutes";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const isLoginPage = window.location.pathname === "/login";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
          {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
          <Routes>
          <Route
    path="/"
    element={<Login />}
  />
  <Route
    path="/dashboard"
    element={<ProtectedRoute Component={Dashboard} />}
  />
  <Route
    path="/team"
    element={<ProtectedRoute Component={Team} />}
  />
  <Route
    path="/contacts"
    element={<ProtectedRoute Component={Contacts} />}
  />
  <Route
    path="/invoices"
    element={<ProtectedRoute Component={Invoices} />}
  />
  <Route
    path="/form"
    element={<ProtectedRoute Component={Form} />}
  />
  <Route
    path="/bar"
    element={<ProtectedRoute Component={Bar} />}
  />
  <Route
    path="/pie"
    element={<ProtectedRoute Component={Pie} />}
  />
  <Route
    path="/line"
    element={<ProtectedRoute Component={Line} />}
  />
  <Route
    path="/faq"
    element={<ProtectedRoute Component={FAQ} />}
  />
  <Route
    path="/calendar"
    element={<ProtectedRoute Component={Calendar} />}
  />
  <Route
    path="/geography"
    element={<ProtectedRoute Component={Geography} />}
  />
  <Route
    path="/login"
    element={<Login />}
  />
</Routes>

          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
