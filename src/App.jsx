import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Gallery from './pages/Gallery/Gallery';
import Experiences from './pages/Experiences/Experiences';
import Offers from './pages/Offers/Offers';
import Services from './pages/Services/Services';
import Restaurant from './pages/Restaurant/Restaurant';
import Layout from './components/Layout/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          {/* Support both /experience and /experiences */}
          <Route path="/experience" element={<Experiences />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/restaurant" element={<Restaurant />} />
          {/* Fallback to home for unknown routes */}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
