import "./starterstyles.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SampleList from "./components/SampleList";
import EditSample from "./components/EditSample";
import ShareSample from "./components/Share";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<SampleList />} />
        <Route path="/editsample/:id" element={<EditSample />} />
        <Route path="/createsample" element={<EditSample />} />
        <Route path="/sharesample/:id" element={<ShareSample />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
