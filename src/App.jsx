import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { NavProvider } from "./components/Link";

const App = () => (
  <BrowserRouter>
    <NavProvider>
      <AppRoutes />
    </NavProvider>
  </BrowserRouter>
);

export default App;
