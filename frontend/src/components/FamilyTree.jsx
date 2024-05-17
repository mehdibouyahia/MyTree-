import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Tree from 'react-d3-tree';
import { Box, Stack, useToast, Button, Spinner, Flex } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import NodeModal from './NodeModal';

axios.defaults.withCredentials = true;

const FamilyTree = () => {
  const { userId } = useParams();
  const [treeData, setTreeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [parentNode, setParentNode] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const url = userId ? `http://localhost:3000/auth/family/tree/${userId}` : 'http://localhost:3000/auth/family/tree';
        const response = await axios.get(url);
        setTreeData(response.data || {});
      } catch (error) {
        toast({
          title: "Error fetching family tree.",
          description: "There was an error fetching the family tree. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setTreeData({}); 
        if (error.response && error.response.status === 401) {
          navigate('/login'); 
        }
      }
    };
    fetchTree();

    axios.get('http://localhost:3000/auth/verify')
      .then(res => {
        if (res.data.status) {
          setIsAdmin(res.data.isAdmin);
        }
      }).catch(err => {
        console.error('Error verifying admin status:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login'); 
        }
      });
  }, [userId, toast, navigate]);

  const handleNodeClick = useCallback((nodeData) => {
    const result = findNodeById(nodeData.attributes.id, treeData);
    if (result) {
      setSelectedNode(result.node);
      setParentNode(result.parent);
    } else {
      setSelectedNode(null);
      setParentNode(null);
    }
  }, [treeData]);

  const handleSubmit = useCallback((newMember, relation) => {
    const newNode = {
      ...newMember,
      attributes: { id: uuidv4() },
      children: [],
    };

    if (!isEmailUnique(newMember.email, treeData)) {
      toast({
        title: "Email already exists.",
        description: "The email address must be unique within the family tree.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const updatedTree = { ...treeData };
    const targetResult = findNodeById(selectedNode.attributes.id, updatedTree);

    if (!targetResult) {
      console.error('Node not found');
      return;
    }

    const { node: targetNode, parent: targetParent } = targetResult;

    if (relation === 'child') {
      targetNode.children.push(newNode);
    } else if (relation === 'parent') {
      if (targetParent) {
        toast({
          title: "Parent already exists.",
          description: "This node already has a parent.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      newNode.children.push(targetNode);
      setTreeData(newNode);
      setSelectedNode(null);
      return;
    } else if (relation === 'spouse') {
      targetNode.spouse = newNode;
    }

    setTreeData(updatedTree);
    setSelectedNode(null);
  }, [treeData, selectedNode, toast]);

  const handleModify = useCallback((nodeId, modifiedData) => {
    const updatedTree = { ...treeData };

    const updateNode = (node) => {
      if (node.attributes.id === nodeId) {
        Object.assign(node, modifiedData);
        return true;
      }
      if (node.children) {
        for (let child of node.children) {
          if (updateNode(child)) return true;
        }
      }
      if (node.spouse && node.spouse.attributes.id === nodeId) {
        Object.assign(node.spouse, modifiedData);
        return true;
      }
      return false;
    };

    if (updateNode(updatedTree)) {
      setTreeData(updatedTree);
      setSelectedNode(null);
    }

    const url = userId ? `http://localhost:3000/auth/family/tree/${userId}` : 'http://localhost:3000/auth/family/tree';
    axios.put(url, { familyTree: updatedTree })
      .then(response => {
        toast({
          title: "Family tree updated.",
          description: "Your family tree has been successfully updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error('Error updating family tree:', error);
        toast({
          title: "Error updating family tree.",
          description: "There was an error updating your family tree. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [treeData, toast, userId]);

  const handleRemove = useCallback((nodeToRemove) => {
    if (nodeToRemove.attributes.id === treeData.attributes.id) {
      toast({
        title: "Cannot remove root node.",
        description: "The root node cannot be removed.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const updatedTree = { ...treeData };
    const parentResult = findNodeById(nodeToRemove.attributes.id, updatedTree);

    if (parentResult.parent) {
      parentResult.parent.children = parentResult.parent.children.filter(
        child => child.attributes.id !== nodeToRemove.attributes.id
      );
      setTreeData(updatedTree);
      setSelectedNode(null);
    }
  }, [treeData, toast]);

  const saveTree = useCallback(() => {
    const url = userId ? `http://localhost:3000/auth/family/tree/${userId}` : 'http://localhost:3000/auth/family/tree';
    axios.put(url, { familyTree: treeData })
      .then(response => {
        toast({
          title: "Family tree saved.",
          description: "Your family tree has been successfully saved.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error('Error saving family tree:', error);
        toast({
          title: "Error saving family tree.",
          description: "There was an error saving your family tree. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [treeData, toast, userId]);

  const renderRectSvgNode = useMemo(() => ({ nodeDatum }, handleClick) => {
    let fillColor = "#777";
    if (nodeDatum.gender === "male") fillColor = "blue";
    else if (nodeDatum.gender === "female") fillColor = "pink";

    return (
      <g onClick={() => handleClick(nodeDatum)}>
        <rect width="100" height="50" x="-50" y="-25" fill={fillColor} />
        <text fill="black" strokeWidth="0.5" x="0" y="0" textAnchor="middle" alignmentBaseline="middle">
          {nodeDatum.firstName} {nodeDatum.lastName}
        </text>
      </g>
    );
  }, []);

  if (!treeData) {
    return <Box textAlign="center" mt="20"><Spinner size="xl" /></Box>;
  }

  return (
    <Stack direction="row" spacing="md" height="100vh" width="100vw">
      <Box w="100%" h="100%">
        {isAdmin && userId ? (
          <Flex direction="column" align="center" mb="4" pr="4">
            <Button onClick={() => navigate('/admin')} colorScheme="blue" mb="4">
              Back to Admin
            </Button>
            <Button onClick={saveTree} colorScheme="blue" mb="4">
              Save Tree
            </Button>
          </Flex>
        ) : (
          <Flex direction="column" align="center" mb="4">
            <Button onClick={saveTree} colorScheme="blue" mb="4">
              Save Tree
            </Button>
          </Flex>
        )}
        <Tree
          data={treeData}
          orientation="vertical"
          zoomable
          onNodeClick={handleNodeClick}
          translate={{ x: 200, y: 200 }}
          renderCustomNodeElement={(rd3tProps) =>
            renderRectSvgNode(rd3tProps, handleNodeClick)
          }
        />
        <NodeModal
          isOpen={Boolean(selectedNode)}
          onClose={() => setSelectedNode(null)}
          onSubmit={handleSubmit}
          onRemove={handleRemove}
          node={selectedNode}
          parent={parentNode}
          onModify={handleModify}
          treeData={treeData} 
        />
      </Box>
    </Stack>
  );
};

export default FamilyTree;

function findNodeById(id, node, parent = null) {
  if (node.attributes?.id === id) return { node, parent };

  if (node.children) {
    for (let child of node.children) {
      const result = findNodeById(id, child, node);
      if (result) return result;
    }
  }

  if (node.spouse && node.spouse.attributes.id === id) {
    return { node: node.spouse, parent: node };
  }

  return null;
}

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
