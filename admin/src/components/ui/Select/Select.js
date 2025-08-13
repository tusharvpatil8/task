import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import ReactSelect from "react-select";
import tw, { theme } from "twin.macro";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useConfig } from "../ConfigProvider";
import { useForm } from "../Form/context";
import { useInputGroup } from "../InputGroup/context";
import { HiCheck, HiChevronDown, HiX } from "react-icons/hi";
import Spinner from "../Spinner";
import { CONTROL_SIZES, SIZES } from "../utils/constant";
import useThemeClass from "utils/hooks/useThemeClass";

const DefaultOption = ({
  innerProps,
  label,
  selectProps,
  isSelected,
  isDisabled,
}) => {
  const { themeColor } = selectProps;
  return (
    <div
      className={`select-option ${isSelected && "selected"} ${
        isDisabled && "disabled"
      }`}
      {...innerProps}
    >
      <span className="ml-2">{label}</span>
      {isSelected && (
        <HiCheck className={`text-${themeColor} dark:text-white text-xl`} />
      )}
    </div>
  );
};

const DefaultDropdownIndicator = () => {
  return (
    <div className="select-dropdown-indicator">
      <HiChevronDown />
    </div>
  );
};

const DefaultClearIndicator = (props) => {
  const {
    innerProps: { ref, ...restInnerProps },
  } = props;
  return (
    <div {...restInnerProps} ref={ref}>
      <div className="select-clear-indicator">
        <HiX />
      </div>
    </div>
  );
};

const DefaultLoadingIndicator = ({ selectProps }) => {
  const { themeColor } = selectProps;
  return <Spinner className={`select-loading-indicatior text-${themeColor}`} />;
};

const Select = React.forwardRef((props, ref) => {
  const {
    size,
    style,
    className,
    form,
    field,
    icon,
    components,
    componentAs: Component,
    ...rest
  } = props;
  const { themeColorAndLevel } = useThemeClass();

  const { controlSize } = useConfig();
  const formControlSize = useForm()?.size;
  const inputGroupSize = useInputGroup()?.size;

  const selectSize = size || inputGroupSize || formControlSize || controlSize;

  const twColor = theme`colors`;
  const twHeight = theme`height`;

  let isInvalid = false;

  if (!isEmpty(form)) {
    const { touched, errors } = form;

    const touchedField = get(touched, field.name);
    const errorField = get(errors, field.name);

    isInvalid = touchedField && errorField;
  }

  const getBoxShadow = (state) => {
    const shadaowBase = "0 0 0 1px ";

    if (isInvalid) {
      return shadaowBase + twColor.red["500"];
    }

    if (state.isFocused) {
      return shadaowBase;
    }

    return "none";
  };

  const styles = {
    control: (provided, state) => {
      return {
        ...provided,
        height: twHeight[CONTROL_SIZES[selectSize]],
        minHeight: twHeight[CONTROL_SIZES[selectSize]],
        "&:hover": {
          boxShadow: getBoxShadow(state),
          cursor: "pointer",
        },
        boxShadow: getBoxShadow(state),
        borderRadius: tw`rounded-md`.borderRadius,
        paddingLeft: icon ? `20px` : ``,
        ...(isInvalid ? { borderColor: twColor.red["500"] } : {}),
      };
    },
    input: (css) => {
      return {
        ...css,
        input: {
          outline: "none",
          outlineOffset: 0,
          boxShadow: "none !important",
        },
      };
    },
    menu: (provided) => ({ ...provided, zIndex: 50 }),
    ...style,
  };

  const selectClass = classNames("select", `select-${selectSize}`, className);

  return (
    <>
      {icon && (
        <div className="absolute z-30 top-1/2 my-[5px] ml-2">{icon}</div>
      )}
      <Component
        className={`${selectClass}`}
        classNamePrefix={"select"}
        ref={ref}
        styles={styles}
        themeColor={`${themeColorAndLevel}`}
        components={{
          IndicatorSeparator: () => null,
          Option: DefaultOption,
          LoadingIndicator: DefaultLoadingIndicator,
          DropdownIndicator: DefaultDropdownIndicator,
          ClearIndicator: DefaultClearIndicator,
          ...components,
        }}
        {...field}
        {...rest}
      />
    </>
  );
});

Select.propTypes = {
  size: PropTypes.oneOf([SIZES.LG, SIZES.MD, SIZES.SM]),
  componentAs: PropTypes.elementType,
};

Select.defaultProps = {
  componentAs: ReactSelect,
};

export default Select;
