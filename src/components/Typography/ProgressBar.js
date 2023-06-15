import { useEffect, useState } from "react";

export const ProgressBar = ({ step }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((step - 1) * 33.33);
  }, [step]);

  return (
    <div className="relative pt-1">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
        <div
          style={{ width: `${progress}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <div>Name &amp; Title</div>
        <div>Image</div>
        <div>Submit</div>
      </div>
    </div>
  );
};
