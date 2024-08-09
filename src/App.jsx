import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import ImageUploadPreview from "./components/ImageUploadPreview";

function App() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <ImageUploadPreview />
      <ToastContainer />
      </div>
    </>
  );
}

export default App;
