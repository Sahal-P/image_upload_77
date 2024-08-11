/* eslint-disable react/prop-types */
import { CircularProgress } from "@mui/material";

const UploadControls = ({
  image,
  loading,
  onImageChange,
  onImageRemove,
  onUploadImage,
}) => {
  return (
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
        onChange={onImageChange}
      />
      {image && (
        <>
          <button
            onClick={onImageRemove}
            className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Remove
          </button>
          <button
            onClick={onUploadImage}
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
  );
};

export default UploadControls;
