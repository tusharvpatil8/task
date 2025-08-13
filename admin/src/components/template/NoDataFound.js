import React from "react";
import SectionTitle from "./SectionTitle";

const NoDataFound = () => {
  return (
    <>
      <div className="h-[60vh] flex flex-col justify-center items-center gap-4">
        <img
          src="/img/others/no-data-found.png"
          alt="No Data Found"
          width={100}
          height={100}
        />
        <SectionTitle title={`No Data Found`} />
      </div>
    </>
  );
};

export default NoDataFound;
