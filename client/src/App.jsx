import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Redirect from "./pages/Redirect";
import Room from "./pages/Room";
import RoomEntry from "./pages/RoomEntry";
import Test from "./pages/Test";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/room" element={<RoomEntry />} />
        <Route path="/room/:roomCode" element={<Room />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
