import "./App.css";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages/dasboard";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar at the top */}
        <Navbar />

        {/* Main content area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Footer at the bottom */}
        <Footer />
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
