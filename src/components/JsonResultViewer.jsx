/* eslint-disable react/prop-types */
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";

const JsonResultViewer = ({jsonResult}) => {
  return (
    <div className="mt-8 w-[90%]">
    <h2 className="text-lg font-bold mb-2">Results:</h2>
    <JsonView
      data={jsonResult}
      shouldExpandNode={allExpanded}
      style={defaultStyles}
    />
  </div>
  )
}

export default JsonResultViewer
