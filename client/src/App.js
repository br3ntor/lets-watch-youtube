import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MyRoutes from "./MyRoutes";
import AppBar from "./components/AppBar";
import { ProvideAuth } from "./libs/use-auth.js";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <ProvideAuth>
        <BrowserRouter>
          <AppBar />
          <MyRoutes />
        </BrowserRouter>
      </ProvideAuth>
    </ThemeProvider>
  );
}
