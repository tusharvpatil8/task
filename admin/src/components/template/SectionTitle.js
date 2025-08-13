import React from "react";
import useThemeClass from "utils/hooks/useThemeClass";

const SectionTitle = ({ title }) => {
  const { textTheme } = useThemeClass();

  return (
    <>
      <div
        className={`mb-3 ${textTheme} dark:${textTheme} text-base font-bold`}
      >
        {title}
      </div>
    </>
  );
};

export default SectionTitle;
