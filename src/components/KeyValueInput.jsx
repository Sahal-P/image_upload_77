/* eslint-disable react/prop-types */
import { Button } from '@mui/material';
import { useState } from 'react';
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddIcon from '@mui/icons-material/Add';


const KeyValueInput = ({keyValuePairs, setKeyValuePairs}) => {
  const [currentKey, setCurrentKey] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const handleAddPair = () => {
    if (currentKey && currentValue) {
      setKeyValuePairs([...keyValuePairs, { key: currentKey, value: currentValue }]);
      setCurrentKey('');
      setCurrentValue('');
    }
  };

  const handleRemovePair = (index) => {
    setKeyValuePairs(keyValuePairs.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full mx-auto p-4 border rounded-md shadow-sm bg-white">
      <h2 className="text-lg font-bold mb-4">Add Key-Value Pairs</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Key"
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value)}
          className="border p-2 rounded-md w-1/2"
        />
        <input
          type="text"
          placeholder="Value"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          className="border p-2 rounded-md w-1/2"
        />
        <Button
          onClick={handleAddPair}
          variant='contained'
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Add
          <AddIcon />
        </Button>
      </div>

      <ul className="list-disc pl-5">
        {keyValuePairs.map((pair, index) => (
          <li key={index} className="flex justify-between mb-2 items-center">
            <span><span className='font-semibold'>{pair.key}</span> : {pair.value}</span>
            <Button
              onClick={() => handleRemovePair(index)}
            >
              <RemoveCircleIcon className='text-red-500 hover:text-red-700'/>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeyValueInput;
