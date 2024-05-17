import React, { useState, useEffect } from 'react';
import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { FormControl, FormLabel, Input, Select, useToast } from "@chakra-ui/react";

const NodeModal = ({ isOpen, onClose, onSubmit, onRemove, node, parent, onModify, treeData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    dateOfBirth: "",
    profession: "",
    relation: "",
  });
  const [viewInfo, setViewInfo] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && node && viewInfo) {
      setFormData({
        firstName: node.firstName || "",
        lastName: node.lastName || "",
        gender: node.gender || "",
        email: node.email || "",
        dateOfBirth: node.dateOfBirth || "",
        profession: node.profession || "",
        relation: "",
      });
      setIsReadOnly(true); 
    } else if (isOpen && !viewInfo) {
      resetForm();
    }
  }, [isOpen, node, viewInfo]);

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      dateOfBirth: "",
      profession: "",
      relation: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleViewInfo = () => {
    setViewInfo(true);
    setIsReadOnly(true);
  };

  const handleAddFamilyMember = () => {
    setViewInfo(false);
    resetForm();
    setIsReadOnly(false);
  };

  const handleRelationChange = (event) => {
    const newRelation = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      relation: newRelation,
      gender: newRelation === "spouse" && node ? (node.gender === "male" ? "female" : "male") : "",
    }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || (!formData.gender && formData.relation !== "spouse") || !formData.relation) {
      toast({
        title: "Missing required fields.",
        description: "First Name, Last Name, Gender, Email, and Relation are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!isEmailUnique(formData.email, treeData)) {
      toast({
        title: "Email already exists.",
        description: "The email address must be unique within the family tree.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const newMember = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      email: formData.email,
      dateOfBirth: formData.dateOfBirth,
      profession: formData.profession,
    };
    onSubmit(newMember, formData.relation);
  };

  const handleModifyInfo = () => {
    if (isReadOnly) {
      setIsReadOnly(false); 
    } else {
      onModify(node.attributes.id, formData); 
    }
  };

  const handleRemove = () => {
    if (window.confirm("Are you sure you want to remove this member and all their descendants?")) {
      onRemove(node);
    }
  };

  const RequiredLabel = ({ children }) => (
    <FormLabel>
      {children}
      <span style={{ color: 'red' }}> *</span>
    </FormLabel>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewInfo ? "Node Information" : "Add Family Member"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {viewInfo ? (
            <>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input value={formData.firstName} name="firstName" onChange={handleChange} isReadOnly={isReadOnly} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Last Name</FormLabel>
                <Input value={formData.lastName} name="lastName" onChange={handleChange} isReadOnly={isReadOnly} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input value={formData.email} name="email" onChange={handleChange} isReadOnly={isReadOnly} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Gender</FormLabel>
                <Select value={formData.gender} name="gender" onChange={handleChange} isReadOnly={isReadOnly}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Date of Birth</FormLabel>
                <Input type="date" value={formData.dateOfBirth} name="dateOfBirth" onChange={handleChange} isReadOnly={isReadOnly} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Profession</FormLabel>
                <Input value={formData.profession} name="profession" onChange={handleChange} isReadOnly={isReadOnly} />
              </FormControl>
              {node?.spouse && (
                <>
                  <FormControl mt={4}>
                    <FormLabel>Spouse's First Name</FormLabel>
                    <Input value={node.spouse.firstName} isReadOnly />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Spouse's Last Name</FormLabel>
                    <Input value={node.spouse.lastName} isReadOnly />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Spouse's Email</FormLabel>
                    <Input value={node.spouse.email} isReadOnly />
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Spouse's Gender</FormLabel>
                    <Input value={node.spouse.gender} isReadOnly />
                  </FormControl>
                </>
              )}
              <FormControl mt={4}>
                <FormLabel>Parent</FormLabel>
                <Input value={parent ? `${parent.firstName} ${parent.lastName}` : "No Parent"} isReadOnly />
              </FormControl>
            </>
          ) : (
            <>
              <FormControl mt={4}>
                <RequiredLabel>Relation</RequiredLabel>
                <Select
                  placeholder="Select relation"
                  value={formData.relation}
                  name="relation"
                  onChange={handleRelationChange}
                  required
                >
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="spouse">Spouse</option>
                </Select>
              </FormControl>
              <FormControl>
                <RequiredLabel>First Name</RequiredLabel>
                <Input
                  value={formData.firstName}
                  name="firstName"
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl mt={4}>
                <RequiredLabel>Last Name</RequiredLabel>
                <Input
                  value={formData.lastName}
                  name="lastName"
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl mt={4}>
                <RequiredLabel>Email</RequiredLabel>
                <Input
                  value={formData.email}
                  name="email"
                  onChange={handleChange}
                  required
                />
              </FormControl>
              {formData.relation !== "spouse" && (
                <FormControl mt={4}>
                  <RequiredLabel>Gender</RequiredLabel>
                  <Select
                    placeholder="Select gender"
                    value={formData.gender}
                    name="gender"
                    onChange={handleChange}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Select>
                </FormControl>
              )}
              <FormControl mt={4}>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  name="dateOfBirth"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Profession</FormLabel>
                <Input
                  value={formData.profession}
                  name="profession"
                  onChange={handleChange}
                />
              </FormControl>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {viewInfo ? (
            <>
              <Button colorScheme="blue" onClick={handleModifyInfo}>
                {isReadOnly ? "Modify Info" : "Save Modifications"}
              </Button>
              {isReadOnly && (
                <Button variant="outline" ml={3} onClick={handleAddFamilyMember}>
                  Add Family Member
                </Button>
              )}
              <Button variant="outline" ml={3} colorScheme="red" onClick={handleRemove}>
                Remove
              </Button>
            </>
          ) : (
            <>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                disabled={!formData.firstName || !formData.lastName || !formData.email || (!formData.gender && formData.relation !== "spouse") || !formData.relation}
              >
                Add
              </Button>
              <Button variant="outline" ml={3} onClick={handleViewInfo}>
                View Info
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NodeModal;

function isEmailUnique(email, node) {
  if (!node) return true;

  if (node.email === email) return false;

  if (node.children) {
    for (let child of node.children) {
      if (!isEmailUnique(email, child)) return false;
    }
  }

  if (node.spouse && node.spouse.email === email) {
    return false;
  }

  return true;
}
