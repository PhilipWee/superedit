import React, { useState } from "react";

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <button className="bg-blue-400" id="counter" type="button" onClick={() => setCount(count + 1)}>
      {count} times
    </button>
  );
};
