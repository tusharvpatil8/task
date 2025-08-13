import { useConfig } from "components/ui";

function useThemeClass() {
  const { themeColor, primaryColorLevel } = useConfig();
  const isCustom = themeColor.includes("#-");
  const color = isCustom
    ? `${themeColor}`
    : `${themeColor}-${primaryColorLevel}`;
  return {
    ringTheme: `ring-${color}`,
    borderTheme: `border-${color}`,
    bgTheme: `bg-${color}`,
    textTheme: `text-${color}`,
    themeColorAndLevel: isCustom
      ? `${themeColor}`
      : `${themeColor}-${primaryColorLevel}`,
  };
}

export default useThemeClass;
