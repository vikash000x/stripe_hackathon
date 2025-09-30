import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResumeForm from "./components/ResumeForm";
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
