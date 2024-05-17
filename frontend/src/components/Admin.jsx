import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Button, Heading, List, ListItem, Spinner, Flex, Input, InputGroup, InputLeftElement, Icon, Menu, MenuButton, MenuList, MenuItem, MenuDivider
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3000/auth/verify')
      .then(res => {
        if (res.data.status) {
          setIsAdmin(res.data.isAdmin);
          if (!res.data.isAdmin) {
            navigate('/home');
          } else {
            fetchUsers();
          }
        } else {
          navigate('/login');
        }
      }).catch(err => {
        console.error('Authentication verification failed:', err);
        navigate('/login');
      }).finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  const fetchUsers = () => {
    setIsLoading(true);
    axios.get('http://localhost:3000/auth/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(res => {
        if (res.data.status) {
          navigate('/login');
        }
      }).catch(err => {
        console.log(err);
      });
  };

  const handleRemoveUser = (userId) => {
    axios.delete(`http://localhost:3000/auth/users/${userId}`)
      .then(response => {
        if (response.data.status) {
          setUsers(users.filter(user => user._id !== userId));
        }
      })
      .catch(error => {
        console.error('Error removing user:', error);
      });
  };

  const handleMakeAdmin = (userId) => {
    axios.put(`http://localhost:3000/auth/users/${userId}/make-admin`)
      .then(response => {
        if (response.data.status) {
          setUsers(users.map(user => user._id === userId ? { ...user, isAdmin: true } : user));
        }
      })
      .catch(error => {
        console.error('Error updating user to admin:', error);
      });
  };

  const handleValidateUser = (userId) => {
    axios.put(`http://localhost:3000/auth/users/${userId}/validate`)
      .then(response => {
        if (response.data.status) {
          setUsers(users.map(user => user._id === userId ? { ...user, isValidated: true } : user));
        }
      })
      .catch(error => {
        console.error('Error validating user:', error);
      });
  };

  const handleViewTree = (userId) => {
    navigate(`/family-tree/${userId}`);
  };

  const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');

  const filteredUsers = users.filter(user =>
    normalizeString(user.firstName).includes(normalizeString(searchQuery)) ||
    normalizeString(user.lastName).includes(normalizeString(searchQuery)) ||
    normalizeString(user.email).includes(normalizeString(searchQuery))
  );

  if (isLoading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!isAdmin) {
    return <Box textAlign="center" mt="20"><Spinner size="xl" /></Box>;
  }

  return (
    <Box p="4" pt="50px"> {/* Added padding top to account for the absolutely positioned menu */}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          position="absolute"
          top="0"
          right="0"
          m="10px"
        >
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => navigate('/home')}>Go Back to Home</MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>

      <Flex justify="space-between" align="center" mb="6">
        <Heading>All Users</Heading>
      </Flex>
      <InputGroup mb="6" maxW="400px" mx="auto">
        <InputLeftElement pointerEvents="none">
          <Icon as={SearchIcon} color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      <List spacing={3} maxW="800px" mx="auto">
        {filteredUsers.map(user => (
          <ListItem
            key={user._id}
            p="4"
            borderWidth="1px"
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
            cursor="pointer"
            onClick={() => handleViewTree(user._id)}
          >
            <Flex justify="space-between" align="center">
              <Box>
                {user.firstName} {user.lastName} - {user.email} - {user.isAdmin ? 'Admin' : 'User'} - {user.isValidated ? 'Validated' : 'Not Validated'}
              </Box>
              <Flex>
                <Button colorScheme="red" size="sm" onClick={(e) => { e.stopPropagation(); handleRemoveUser(user._id); }} ml="3">Remove</Button>
                {!user.isAdmin && (
                  <Button colorScheme="blue" size="sm" onClick={(e) => { e.stopPropagation(); handleMakeAdmin(user._id); }} ml="3">Make Admin</Button>
                )}
                {!user.isValidated && (
                  <Button colorScheme="green" size="sm" onClick={(e) => { e.stopPropagation(); handleValidateUser(user._id); }} ml="3">Validate</Button>
                )}
              </Flex>
            </Flex>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Admin;
