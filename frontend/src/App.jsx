import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ForRent from "./pages/ForRent";
import ForBuy from "./pages/ForBuy";
import Service from "./pages/Service";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rent" element={<ForRent />} />
        <Route path="/buy" element={<ForBuy />} />
        <Route path="/service" element={<Service />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
