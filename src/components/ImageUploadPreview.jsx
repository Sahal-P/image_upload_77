import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { toast } from "react-toastify";
import { GET_MODELS_API, POST_RUN_IMAGE } from "../axios/api";

const ImageUploadPreview = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outputImage, setOutputImage] = useState(null);
  const [jsonResult, setJsonResult] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(""); // Default model name

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get(GET_MODELS_API);
        setModels(response?.data?.models); // Assuming the API returns a list of models in 'models' field
        handleModelSelect(response?.data?.models?.[0]?.model);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setPreview(null);
    setJsonResult(null);
    setOutputImage(null);
  };

  const handleUploadImage = async () => {
    if (!image) {
      console.log("Please select an image to upload.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onloadend = async () => {
      const base64String = reader.result.split(",")[1];

      const payload = {
        model_name: selectedModel,
        image_bytes: base64String,
      };

      try {
        const response = await axios.post(POST_RUN_IMAGE, payload);
        const { output_image, result } = response.data;

        // Convert the output_image from base64 to a displayable format
        setOutputImage(`data:image/png;base64,${output_image}`);

        // Set the JSON result
        setJsonResult(result);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        if (error?.response?.status === 500) {
          toast.error(error?.message);
        } else {
          toast.error("Failed to upload image. Please try again.");
        }

        setLoading(false);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  };
  return (
    <div className="flex flex-col items-center mt-8 w-full mb-56">
      <div className="flex flex-col mb-4">
        <h2 className="text-lg font-bold mb-2 mt-5">Test models:</h2>
        <div>
          {models?.map((data) => (
            <button
              key={data?.model}
              onClick={() => handleModelSelect(data?.model)}
              className={`mr-4 py-2 px-4 rounded ${
                selectedModel === data?.model
                  ? "bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {data?.model}
            </button>
          ))}
        </div>
      </div>
      <div className="w-96 h-96 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-contain rounded-md"
          />
        ) : (
          <span className="text-gray-500">No Image Selected</span>
        )}
      </div>
      <div className="mt-4">
        <label
          htmlFor="imageUpload"
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {image ? "Change Image" : "Upload Image"}
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {image && (
          <>
            <button
              onClick={handleImageRemove}
              className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Remove
            </button>
            <button
              onClick={handleUploadImage}
              className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Run"
              )}
            </button>
          </>
        )}
      </div>
      {outputImage && (
        <>
          <h2 className="text-lg font-bold mb-2 mt-5">Processed Image:</h2>
          <div className="mt-8 w-96 h-96 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300">
            <img
              src={outputImage}
              alt="Processed Output"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        </>
      )}

      {/* Display the JSON result */}
      {jsonResult && (
        <div className="mt-8 w-[90%]">
          <h2 className="text-lg font-bold mb-2">Results:</h2>
          <JsonView
            data={jsonResult}
            shouldExpandNode={allExpanded}
            style={defaultStyles}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadPreview;
