/* eslint-disable react/prop-types */

const ImagePreview = ({ preview }) => {
  return (
    <>
      <div
        className={`w-96 h-96 flex items-center justify-center bg-gray-100 rounded-md border`}
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
