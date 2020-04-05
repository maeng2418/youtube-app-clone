import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const LeftMenu = (props) => {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <Link to='/'>Home</Link>
      </Menu.Item>
      <Menu.Item key="subscript">
        <Link to='/subscription'>Subscription</Link>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
