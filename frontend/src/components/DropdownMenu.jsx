import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';


const DropdownMenu = ({ isAdmin, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} position="absolute" top="0" right="0" m="10px">
        Menu
      </MenuButton>
      <MenuList>
        {isAdmin && <MenuItem onClick={() => navigate('/admin')}>Parameters</MenuItem>}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default DropdownMenu;

