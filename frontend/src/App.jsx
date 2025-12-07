import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Home from "./pages/Home";
import ForRent from "./pages/ForRent";
import ForBuy from "./pages/ForBuy";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AddProperty from "./pages/AddProperty";
import MyProperties from "./pages/MyProperties";
import EditProperty from "./pages/EditProperty";
import PropertyDetails from "./pages/PropertyDetails";
import Header from "./components/Header";
import Messages from "./pages/Messages";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rent" element={<ForRent />} />
          <Route path="/buy" element={<ForBuy />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/properties/:id/edit" element={<EditProperty />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
