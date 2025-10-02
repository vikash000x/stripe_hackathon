import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResumeForm from "./pages/ResumeForm";
import Home from "./pages/Home";
import "./styles/global.css";
import AssessmentIntro from "./pages/AssessmentIntro";
import AssessmentStart from "./pages/AssessmentStart";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import CandidateDetailPage from "./pages/CandidateDetailPage";


export default function App() {
  return (
  
    <Router>
       <Navbar />
      <Routes>
       
        <Route path="/" element={<ResumeForm />} />
        <Route path="/home" element={<Home />} />
          <Route path="/assessment/start" element={<AssessmentIntro />} />
        <Route path="/assessment/start/:id" element={<AssessmentStart />} />
         <Route path="/interviewer/dashboard" element={<DashboardPage />} />
        <Route path="/interviewer/candidate/:userId" element={<CandidateDetailPage />} />
      </Routes>
       <footer className="bg-amber-800 text-white py-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Interview Assistant — Crafted By Vikash Sinha
        </p>
      </footer>
    </Router>
  );
}
