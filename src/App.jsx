import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { NavProvider } from "./components/Link";
import { AuthProvider } from "./contexts/AuthContext";
import { ContentProvider } from "./contexts/ContentContext";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ContentProvider>
        <NavProvider>
          <AppRoutes />
        </NavProvider>
      </ContentProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
