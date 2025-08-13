import React from "react";

const Total = (props) => {
  const { total } = props;
  return (
    <div className="pagination-total">
      Total <span>{total}</span>
    </div>
  );
};

export default Total;
