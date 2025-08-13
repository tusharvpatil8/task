import React from "react";
import { Avatar, Dropdown } from "components/ui";
import withHeaderItem from "utils/hoc/withHeaderItem";
import useAuth from "utils/hooks/useAuth";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { HiOutlineLogout, HiUser } from "react-icons/hi";
import useThemeClass from "utils/hooks/useThemeClass";

// const dropdownItemList = [
//   {
//     label: "Profile",
//     path: "/",
//     icon: <HiOutlineUser />,
//   },
// ];

export const UserDropdown = ({ className }) => {
  const { user } = useSelector((state) => state.auth);
  const { bgTheme } = useThemeClass();

  const { signOut } = useAuth();

  const UserAvatar = (
    <div className={classNames(className, `flex items-center gap-2 `)}>
      <Avatar
        className={`${bgTheme}`}
        size={32}
        shape="circle"
        icon={<HiUser />}
      />
      <div className="hidden md:block">
        <div className="text-xs capitalize">{user?.role || "guest"}</div>
        <div className="font-bold capitalize">{user?.code}</div>
      </div>
    </div>
  );

  return (
    <div>
      <Dropdown
        menuStyle={{ minWidth: 240 }}
        renderTitle={UserAvatar}
        placement="bottom-end"
      >
        <Dropdown.Item variant="header">
          <div className="py-2 px-3 flex items-center gap-2">
            <Avatar className={`${bgTheme}`} shape="circle" icon={<HiUser />} />
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100 capitalize">
                {user?.code}
              </div>
              <div className="text-xs">{user?.email}</div>
            </div>
          </div>
        </Dropdown.Item>
        {/* <Dropdown.Item variant="divider" />
        {dropdownItemList.map((item) => (
          <Dropdown.Item
            eventKey={item.label}
            key={item.label}
            className="mb-1"
          >
            <Link className="flex gap-2 items-center" to={item.path}>
              <span className="text-xl opacity-50">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </Dropdown.Item>
        ))} */}
        <Dropdown.Item variant="divider" />
        <Dropdown.Item onClick={signOut} eventKey="Sign Out" className="gap-2">
          <span className="text-xl opacity-50">
            <HiOutlineLogout />
          </span>
          <span>Sign Out</span>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default withHeaderItem(UserDropdown);
