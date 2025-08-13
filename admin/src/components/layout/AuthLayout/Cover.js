import React, { cloneElement, useEffect, useState } from "react";
import Logo from "components/template/Logo";
import { APP_NAME } from "constants/app.constant";
import { getLogos } from "service/configService";

const Cover = ({ children, content, ...rest }) => {
  const imageArray = [
    "/img/others/auth-cover-bg.jpg",
    "/img/others/auth-cover-bg2.png",
    "/img/others/auth-cover-bg3.png",
    "/img/others/auth-cover-bg4.png",
    "/img/others/auth-cover-bg5.png",
  ];
  const [dynamicLogo, setDynamicLogo] = useState("");

  // Function to get a random image URL from the array
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    return imageArray[randomIndex];
  };

  // Set the random background image
  const backgroundImage = getRandomImage();

  const getLogosData = async () => {
    try {
      const resp = await getLogos();
      if (resp?.success) {
        let logoSrc = resp?.data?.filter((item) => {
          if (item?.logoMode === "dark") {
            return item;
          }
          return null;
        })[0];
        setDynamicLogo(logoSrc?.logoURI);
      }
    } catch (err) {
      console.log("err", err);
    } finally {
    }
  };

  useEffect(() => {
    getLogosData();
  }, []);

  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div
        className="col-span-2 bg-no-repeat bg-cover py-6 px-16 flex-col justify-between bg-white dark:bg-gray-800 hidden lg:flex"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      ></div>
      <div className="flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        {/* <div></div> */}
        <div className="text-center">
          <Logo
            isDynamic={true}
            src={dynamicLogo}
            type="full"
            imgClass="mx-auto"
            logoWidth={300}
            isAuth={true}
          />
        </div>
        <div className="xl:min-w-[450px] px-8">
          <div className="mb-8">{content}</div>
          {children ? cloneElement(children, { ...rest }) : null}
        </div>
        {/* <div className="my-4">
          <span className="">
            Copyright &copy; {`${new Date().getFullYear()}`}{" "}
            <span className="font-bold">{`${APP_NAME}`}</span>{" "}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default Cover;
