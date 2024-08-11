/* eslint-disable react/prop-types */

const ModelSelector = ({ models, selectedModel, onSelectModel }) => {
  return (
    <div className="flex flex-col mb-4">
      <h2 className="text-lg font-bold mb-2 mt-5">Models:</h2>
      <div>
        {models?.map((data) => (
          <button
            key={data?.model}
            onClick={() => onSelectModel(data?.model)}
            className={`mr-2 py-2 px-4 rounded mt-2 ${
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
  );
};

export default ModelSelector;
