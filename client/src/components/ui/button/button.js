import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { CONTROL_SIZES, SIZES } from "../constant";
import Spinner from "../spinner";

const Button = React.forwardRef((props, ref) => {
  const {
    children,
    size,
    color,
    shape,
    variant,
    block,
    icon,
    className,
    disabled,
    loading,
    active,
    danger,
    ...rest
  } = props;
  const defaultClass = "button";
  const sizeIconClass = "inline-flex items-center justify-center";
  const splitedColor = color ||"#003A7B";
  const buttonSize = size || SIZES.LG;
  const buttonColor = splitedColor;

  const getButtonSize = () => {
    let sizeClass = "";
    switch (buttonSize) {
      case SIZES.LG:
        sizeClass = classNames(
          `h-${CONTROL_SIZES.lg}`,
          icon && !children
            ? `w-${CONTROL_SIZES.lg} ${sizeIconClass} text-2xl`
            : "px-8 py-2 text-base font-medium"
        );
        break;
      case SIZES.SM:
        sizeClass = classNames(
          `h-${CONTROL_SIZES.sm}`,
          icon && !children
            ? `w-${CONTROL_SIZES.sm} ${sizeIconClass} text-lg`
            : "px-3 py-2 text-sm font-medium"
        );
        break;
      case SIZES.XS:
        sizeClass = classNames(
          `h-${CONTROL_SIZES.xs}`,
          icon && !children
            ? `w-${CONTROL_SIZES.xs} ${sizeIconClass} text-base`
            : "px-3 py-1 text-xs font-medium"
        );
        break;
      default:
        sizeClass = classNames(
          `h-${CONTROL_SIZES.md}`,
          icon && !children
            ? `w-${CONTROL_SIZES.md} ${sizeIconClass} text-xl`
            : "px-8 py-2 font-medium"
        );
        break;
    }
    return `${sizeClass}`;
  };

  const disabledClass = "opacity-50 cursor-not-allowed";

  const solidColor = () => {
    const btn = {
      bgColor: active ? `bg-[${buttonColor}]` : `bg-[${buttonColor}]`,
      textColor: "text-white py-[10px]",
      // hoverColor: active ? "" : `hover:bg-[${buttonColor}]`,
      activeColor: `active:bg-[${buttonColor}]`,
    };
    return getBtnColor(btn);
  };

  const defaultColor = () => {
    const btn = {
      bgColor: active
        ? `bg-white  border-[2px] border-[${buttonColor}]`
        : ` bg-white border-[2px] border-[${buttonColor}]`,
      textColor: `text-[${buttonColor}]`,
      // hoverColor: active ? "" : `hover:bg-[${buttonColor}]  hover:text-black`,
      activeColor: `active:bg-[${buttonColor}]`,
    };
    return getBtnColor(btn);
  };

  const getBtnColor = ({ bgColor, hoverColor, activeColor, textColor }) => {
    return `${bgColor} ${
      disabled || loading ? disabledClass : hoverColor + " " + activeColor
    } ${textColor}`;
  };

  const btnColor = () => {
    switch (variant) {
      case "solid":
        return solidColor();

      case "default":
        return defaultColor();
      default:
        return defaultColor();
    }
  };

  const classes = classNames(
    defaultClass,
    btnColor(),
    `radius-${shape}`,
    getButtonSize(),
    className,
    block ? "w-full" : ""
  );

  const handleClick = (e) => {
    const { onClick } = props;
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const renderChildren = () => {
    if (loading && children) {
      return (
        <span className="flex items-center justify-center">
          <Spinner enableTheme={false} className="mr-1 text-white" />
          {children}
        </span>
      );
    }

    if (icon && !children && loading) {
      return <Spinner enableTheme={false} />;
    }

    if (icon && !children && !loading) {
      return <>{icon}</>;
    }

    if (icon && children && !loading) {
      return (
        <span className="flex items-center justify-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="ltr:ml-1 rtl:mr-1">{children}</span>
        </span>
      );
    }

    return <>{children}</>;
  };

  return (
    <button ref={ref} className={classes} {...rest} onClick={handleClick}>
      {renderChildren()}
    </button>
  );
});

Button.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  block: PropTypes.bool,
  shape: PropTypes.oneOf(["round", "circle", "none"]),
  className: PropTypes.string,
  size: PropTypes.oneOf([SIZES.LG, SIZES.SM, SIZES.XS, SIZES.MD]),
  color: PropTypes.string,
  variant: PropTypes.oneOf(["solid", "default"]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  active: PropTypes.bool,
};

Button.defaultProps = {
  variant: "default",
  shape: "round",
  active: false,
  loading: false,
  disabled: false,
  color: "",
};

export default Button;
