import React from "react";

const AccessDenied = () => {
  return (
    <div className="h-full">
      <div className="h-full flex flex-col items-center justify-center">
        <div className="mt-6 text-center">
          <h3 className="mb-2">Access Denied!</h3>
          <p className="text-base">You have no permission to visit this page</p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
