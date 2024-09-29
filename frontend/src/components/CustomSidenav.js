import React from 'react'
import { Sidenav, Nav, Toggle } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import 'rsuite/dist/rsuite.min.css';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

function CustomSidenav() {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState('1');
  return (
    
   
  <Sidebar >
  <Menu>
    <SubMenu label="Charts">
      <MenuItem> Pie charts </MenuItem>
      <MenuItem> Line charts </MenuItem>
    </SubMenu>
    <MenuItem href='/'> Home</MenuItem>
    <MenuItem href='removeObjects'> Remove Objects </MenuItem>
    <MenuItem href='sharpenImage'> Sharpen Image </MenuItem>
    <MenuItem href='imageFolder'> Image Folder</MenuItem>
    <MenuItem> qwqweqwe </MenuItem>
    <MenuItem> sss </MenuItem>  
    <MenuItem> Ca lendar </MenuItem>
    <MenuItem> Calendar </MenuItem>
    <MenuItem> Calendar </MenuItem>
    <MenuItem> Calendar </MenuItem> 
  </Menu>
</Sidebar>
  )
}

export default CustomSidenav;
