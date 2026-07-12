import { Route, Routes, useParams } from "react-router-dom";

import Layouts from "../components/Layouts";
import Home from "../pages/Home";
import About from "../pages/About";
import Stays from "../pages/Stays";
import SuiteDetail from "../pages/SuiteDetail";
import Experiences from "../pages/Experiences";
import ExperienceDetail from "../pages/ExperienceDetail";
import Dining from "../pages/Dining";
import Gallery from "../pages/Gallery";
import Stories from "../pages/Stories";
import Book from "../pages/Book";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Offers from "../pages/Offers";
import OfferDetail from "../pages/OfferDetail";
import Services from "../pages/Services";

const SuiteDetailWrapper = () => {
  const { slug } = useParams();
  return <SuiteDetail slug={slug} />;
};

const ExperienceDetailWrapper = () => {
  const { slug } = useParams();
  return <ExperienceDetail slug={slug} />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Stand-alone pages (no navbar/footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />} />

      {/* Public site with Navbar + Footer */}
      <Route path="/" element={<Layouts />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="stays" element={<Stays />} />
        <Route path="stays/:slug" element={<SuiteDetailWrapper />} />
        <Route path="experiences" element={<Experiences />} />
        <Route path="experiences/:slug" element={<ExperienceDetailWrapper />} />
        <Route path="dining" element={<Dining />} />
        <Route path="restaurant" element={<Dining />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="offers" element={<Offers />} />
        <Route path="offers/:id" element={<OfferDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="stories" element={<Stories />} />
        <Route path="book" element={<Book />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

