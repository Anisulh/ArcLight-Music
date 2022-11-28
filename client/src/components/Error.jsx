import React from "react";

function Error({ message }) {
  return (
    <p className="text-white bg-red-600 text-sm flex justify-center items-center">
      Error: {message}
    </p>
  );
}

export default Error;
