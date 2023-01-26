import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/profilePage";
import {createTheme} from '@mui/material/styles';
import {CssBaseline, ThemeProvider} from '@mui/material';
import { themeSettings } from "./theme";
import { useSelector } from "react-redux";
import { useMemo } from "react";


function App() {
  const mode = useSelector((state) => state.mode);
  // const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <BrowserRouter>
    {/* <ThemeProvider theme={theme}> */}
      <CssBaseline/>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    {/* </ThemeProvider> */}
  </BrowserRouter>
  );
}

export default App;
