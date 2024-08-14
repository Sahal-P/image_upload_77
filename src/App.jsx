import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ImageUploadPreview from "./pages/ImageProcessingTool";
import TrainModelPage from "./pages/TrainModelPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ImageUploadPreview />} />
          <Route path="/train" element={<TrainModelPage />} />
        </Routes>
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
