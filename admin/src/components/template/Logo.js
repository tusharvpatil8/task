import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { APP_NAME } from "constants/app.constant";

const LOGO_SRC_PATH = "/img/logo/";

const Logo = (props) => {
  const {
    isDynamic = false,
    isAuth = false,
    type,
    mode,
    gutter,
    className,
    imgClass,
    style,
    logoWidth,
    src,
  } = props;

  return (
    <div
      className={classNames("logo", className, gutter)}
      style={{
        ...style,
        ...{ width: logoWidth },
      }}
    >
      <img
        className={imgClass}
        src={
          isDynamic && src
            ? src
            : isAuth
            ? `${LOGO_SRC_PATH}logo-auth.png`
            : `${LOGO_SRC_PATH}logo-${mode}-${type}.png`
        }
        alt={`${APP_NAME} logo`}
      />
    </div>
  );
};

Logo.defaultProps = {
  mode: "light",
  type: "full",
  logoWidth: "auto",
};

Logo.propTypes = {
  mode: PropTypes.oneOf(["light", "dark"]),
  type: PropTypes.oneOf(["full", "streamline"]),
  gutter: PropTypes.string,
  imgClass: PropTypes.string,
  logoWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Logo;
