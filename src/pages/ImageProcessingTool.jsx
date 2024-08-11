import axios from "axios";
import { useEffect, useState } from "react";
import "react-json-view-lite/dist/index.css";
import { toast } from "react-toastify";
import { GET_MODELS_API, POST_RUN_IMAGE } from "../axios/api";
import UploadControls from "../components/UploadControls";
import ModelSelector from "../components/ModelSelector";
import ImagePreview from "../components/ImagePreview";
import JsonResultViewer from "../components/JsonResultViewer";
import { Button } from "@mui/material";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import { useNavigate } from "react-router-dom";
import KeyValueInput from "../components/KeyValueInput";

const ImageProcessingTool = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outputImage, setOutputImage] = useState(null);
  const [jsonResult, setJsonResult] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(""); // Default model name
  const [userInput, setUserInput] = useState([]); // Default model name
  const [productStatus, setProductStatus] = useState(""); // Default model name

  const navigate = useNavigate();

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
        model_name: !userInput.length ? selectedModel : "",
        image_bytes: base64String,
        user_input: userInput,
      };

      try {
        const response = await axios.post(POST_RUN_IMAGE, payload);
        const { output_image, result, product_status, msg } = response.data;

        if (product_status) {
          if (product_status === "success") {
            setProductStatus("SUCCESS");
          } else if (product_status === "failed") {
            setProductStatus("FAILED");
          }
        }
        // Convert the output_image from base64 to a displayable format
        setOutputImage(`data:image/png;base64,${output_image}`);

        // Set the JSON result
        setJsonResult(result);
        if (msg) {
          toast.success(msg);
        } else {
          toast.success("Image uploaded successfully!");
        }
      } catch (error) {
        if (error?.response?.status === 500) {
          toast.error(error?.message);
        } else {
          toast.error("Failed to upload image. Please try again.");
        }

        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
  };
  return (
    <div className="flex flex-wrap justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full fixed top-2 left-2">
        <Button variant="outlined" onClick={() => navigate("/train")}>
          Train <ModelTrainingIcon />{" "}
        </Button>
      </div>
      <div className="flex flex-wrap flex-col items-center mt-8 w-96 min-w-[300px] mb-56">
        <ModelSelector
          models={models}
          onSelectModel={handleModelSelect}
          selectedModel={selectedModel}
        />
        <h2 className="text-lg font-bold mb-2 mt-5">Or:</h2>

        <KeyValueInput
          keyValuePairs={userInput}
          className={""}
          setKeyValuePairs={setUserInput}
        />
        <div>
          <h2 className="w-96 text-lg font-bold mb-2 mt-5">Test model:</h2>
        </div>

        <ImagePreview preview={preview} outputImage={outputImage} />
        <UploadControls
          image={image}
          loading={loading}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          onUploadImage={handleUploadImage}
        />
        {outputImage && (
          <div>
            <h2 className="text-lg font-bold mb-2 mt-10">Processed Image:</h2>
            <div
              className={` w-96 h-96 flex items-center justify-center rounded-md border border-gray-300 ${
                productStatus === "SUCCESS"
                  ? "border-green-500 border-[3px] p-2"
                  : productStatus === "FAILED"
                  ? "border-red-500 border-[3px] p-2"
                  : "border-gray-300"
              }`}
            >
              <img
                src={outputImage}
                alt="Processed Output"
                className="w-full h-full object-contain rounded-md"
              />
            </div>
          </div>
        )}

        {/* Display the JSON result */}
        {jsonResult && <JsonResultViewer jsonResult={jsonResult} />}
      </div>
    </div>
  );
};

export default ImageProcessingTool;
