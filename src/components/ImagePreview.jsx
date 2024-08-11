/* eslint-disable react/prop-types */

const ImagePreview = ({ preview, productStatus }) => {
  return (
    <>
      <div
        className={`w-96 h-96 flex items-center justify-center bg-gray-100 rounded-md border ${
          productStatus === "SUCCESS"
            ? "border-green-500"
            : productStatus === "FAILED"
            ? "border-red-500"
            : "border-gray-300"
        }`}
      >
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
    </>
  );
};

export default ImagePreview;
