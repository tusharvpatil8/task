import {
  NAV_ITEM_TYPE_COLLAPSE,
  NAV_ITEM_TYPE_ITEM,
} from "constants/navigation.constant";
import {
  CATEGORY_PREFIX_PATH,
  CONFIGURATION_PREFIX_PATH,
  WRITER_PREFIX_PATH,
} from "constants/route.constant";
const configNavigationConfig = [
  {
    key: "apps.config",
    path: `${CONFIGURATION_PREFIX_PATH}`,
    title: "Configurations",
    icon: "config",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: [],
    subMenu: [
      {
        key: "apps.blogCategories",
        path: `${CONFIGURATION_PREFIX_PATH}${CATEGORY_PREFIX_PATH}`,
        title: "Blog Category",
        icon: " ",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      // {
      //   key: "cms.writer",
      //   path: `${CONFIGURATION_PREFIX_PATH}${WRITER_PREFIX_PATH}`,
      //   title: "Writer",
      //   type: NAV_ITEM_TYPE_ITEM,
      //   authority: [],
      //   subMenu: [],
      // },
    ],
  },
];

export default configNavigationConfig;
