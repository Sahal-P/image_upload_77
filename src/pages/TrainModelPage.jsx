import { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import KeyValueInput from "../components/KeyValueInput";
import axios from "axios";
import { TRAIN_MODEL } from "../axios/api";

const TrainModelPage = () => {
  const [productName, setProductName] = useState("");
  const [goodImages, setGoodImages] = useState([]);
  const [badImages, setBadImages] = useState([]);
  const [keyValuePairs, setKeyValuePairs] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e, setImages) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [
      ...prevImages,
      ...files.slice(0, 30 - prevImages.length),
    ]);
  };

  const handleImageRemove = (image, setImages) => {
    setImages((prevImages) => prevImages.filter((img) => img !== image));
  };

  const handleTrainModel = async () => {
    if (
      !productName ||
      !goodImages.length ||
      !badImages.length ||
      !keyValuePairs.length
    ) {
      toast.error("Please fill in all the fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("product_name", productName);

      goodImages.forEach((image) => {
        formData.append("good_images", image);
      });

      badImages.forEach((image) => {
        formData.append("bad_images", image);
      });

      formData.append("key_values", JSON.stringify(keyValuePairs));

      console.log(formData);

      const response = await axios.post(TRAIN_MODEL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data?.message) {
        toast.success(response.data?.message);
        toast.info('The training process may take up to 2 hours to complete.');
      }
    } catch (error) {
      toast.error("Failed to train model. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row p-6 space-y-6 lg:space-y-0 lg:space-x-6 min-h-screen">
        <div className="flex flex-col w-full lg:w-2/3 space-y-4">
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2 pb-2">
                Upload Good Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="goodImages"
                onChange={(e) => handleImageUpload(e, setGoodImages)}
              />
              <label
                htmlFor="goodImages"
                className="cursor-pointe py-2 px-4 rounded"
              >
                <AddPhotoAlternateIcon
                  fontSize="large"
                  className="text-green-500 border rounded-sm hover:cursor-pointer hover:text-green-700"
                />
              </label>
              <div className="flex flex-wrap mt-4">
                {goodImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative mr-2 mb-2 border rounded-md transition-all duration-300 scale-100 hover:scale-105"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Good Preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <button
                      onClick={() => handleImageRemove(image, setGoodImages)}
                      className="absolute top-0 right-1 text-red-500"
                    >
                      <RemoveCircleIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2 pb-2">
                Upload Bad Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="badImages"
                onChange={(e) => handleImageUpload(e, setBadImages)}
              />
              <label
                htmlFor="badImages"
                className="cursor-pointer py-2 px-4 rounded"
              >
                <AddPhotoAlternateIcon
                  fontSize="large"
                  className="text-red-500 hover:text-red-700 border rounded-sm hover:cursor-pointer hover:yellow-green-700"
                />
              </label>
              <div className="flex flex-wrap mt-4">
                {badImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative mr-2 mb-2 border rounded-md transition-all duration-300 scale-100 hover:scale-105"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Bad Preview"
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <button
                      onClick={() => handleImageRemove(image, setBadImages)}
                      className="absolute top-0 right-1 text-red-500"
                    >
                      <RemoveCircleIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex h-screen flex-col space-y-4">
          <KeyValueInput
            keyValuePairs={keyValuePairs}
            setKeyValuePairs={setKeyValuePairs}
          />
          <div className="flex p-4 justify-between">
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setBadImages([]);
                setGoodImages([]);
                setProductName("");
                setKeyValuePairs([]);
              }}
            >
              Clear All
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleTrainModel}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  Train Model
                  <ModelTrainingIcon className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainModelPage;
