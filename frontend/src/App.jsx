import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import ForRent from "./pages/ForRent";
import ForBuy from "./pages/ForBuy";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProperty from "./pages/AddProperty";
import MyProperties from "./pages/MyProperties";
import EditProperty from "./pages/EditProperty";
import PropertyDetails from "./pages/PropertyDetails";
import Header from "./components/Header";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rent" element={<ForRent />} />
        <Route path="/buy" element={<ForBuy />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/properties/:id/edit" element={<EditProperty />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
