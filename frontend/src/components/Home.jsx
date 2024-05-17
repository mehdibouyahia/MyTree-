import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Heading, Spinner } from "@chakra-ui/react";
import FamilyTree from './FamilyTree';
import DropdownMenu from './DropdownMenu';

const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3000/auth/verify')
      .then(res => {
        if (res.data.status) {
          setIsAdmin(res.data.isAdmin);
          setIsValidated(res.data.isValidated);
        } else {
          navigate('/');
        }
      }).catch(err => {
        console.error('Authentication verification failed:', err);
        navigate('/login');
      }).finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(res => {
        if (res.data.status) {
          navigate('/login');
        }
      }).catch(err => {
        console.log(err);
      });
  }

  if (isLoading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!isValidated) {
    return (
      <Box textAlign="center" mt="20">
        <Heading>Waiting for validation from admin</Heading>
      </Box>
    );
  }

  return (
    <Box>
      {isAdmin ? (
        <DropdownMenu isAdmin={isAdmin} handleLogout={handleLogout} />
      ) : (
        <Button
          onClick={handleLogout}
          position="absolute"
          top="0"
          right="0"
          m="10px"
          color="white"
          backgroundColor="red"
          fontSize="12px"
          padding="5px 10px"
        >
          Logout
        </Button>
      )}
      <Box textAlign="center" mt="20">
        <Heading>Family Tree</Heading>
        <FamilyTree /> 
      </Box>
    </Box>
  );
}

export default Home;
