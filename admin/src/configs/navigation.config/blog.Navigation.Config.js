import { NAV_ITEM_TYPE_ITEM } from "constants/navigation.constant";
import { BLOGS_PREFIX_PATH } from "constants/route.constant";

const blogNavigationConfig = [
   {
        key: 'apps.blogs',
        path: `${BLOGS_PREFIX_PATH}`,
        title: 'Blogs',
        icon: 'dashboard',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },


];

export default blogNavigationConfig;
