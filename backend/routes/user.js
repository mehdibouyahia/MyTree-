import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/signup', upload.single('photo'), async (req, res) => {
  const { email, password, lastName, firstName, gender, dateOfBirth, profession, address, phoneNumber } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({ message: "User already existed" });
  }

  if (!email || !password || !lastName || !firstName) {
    return res.json({ message: "Email, Password, Last Name, and First Name are required." });
  }

  const hashpassword = await bcrypt.hash(password, 10);

  const isFirstUser = (await User.countDocuments({})) === 0;

  let familyTree = null;
  let treeRootUser = null;
  let isSpouse = false;
  let spouseInfo = null;

  const users = await User.find({});
  for (const user of users) {
    const result = findNodeByEmail(email, user.familyTree);
    if (result) {
      familyTree = user.familyTree;
      treeRootUser = user;
      break;
    }
  }

  if (!familyTree) {
    for (const user of users) {
      const spouseResult = findSpouseByEmail(email, user.familyTree);
      if (spouseResult) {
        spouseInfo = spouseResult;
        isSpouse = true;
        break;
      }
    }
  }

  if (isSpouse && spouseInfo) {
    familyTree = {
      firstName,
      lastName,
      gender: gender || null,
      email,
      dateOfBirth: dateOfBirth || null,
      profession: profession || '',
      spouse: {
        firstName: spouseInfo.firstName,
        lastName: spouseInfo.lastName,
        gender: spouseInfo.gender,
        email: spouseInfo.email,
        dateOfBirth: spouseInfo.dateOfBirth,
        profession: spouseInfo.profession,
      },
      attributes: { id: req.body._id || '' },
      children: [],
    };
  } else if (familyTree) {
    updateNodeByEmail(email, familyTree, { firstName, lastName, gender, email, dateOfBirth, profession });
  } else {
    familyTree = {
      firstName,
      lastName,
      gender: gender || null,
      email,
      dateOfBirth: dateOfBirth || null,
      profession: profession || '',
      spouse: null,
      attributes: { id: req.body._id || '' },
      children: [],
    };
  }

  const newUser = new User({
    email,
    password: hashpassword,
    lastName,
    firstName,
    gender: gender || null,
    dateOfBirth: dateOfBirth || null,
    profession: profession || '',
    contacts: {
      addresses: address ? [address] : [],
      phoneNumbers: phoneNumber ? [phoneNumber] : []
    },
    photo: req.file ? req.file.path : '',
    isAdmin: isFirstUser,
    isValidated: isFirstUser,
    familyTree,  
  });

  await newUser.save();

  if (treeRootUser && !isSpouse) {
    await User.findByIdAndUpdate(treeRootUser._id, { familyTree });
  }

  if (!isSpouse) {
    await propagateChanges(email, { firstName, lastName, gender, email, dateOfBirth, profession });
  }

  return res.json({ status: true, message: "Record registered" });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User is not registered" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.json({ message: "Password is incorrect" });
  }
  const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 3600 * 24 });
  return res.json({ status: true, message: "Login successfully" });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not registered" });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' });

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'blackjackv03@gmail.com',
        pass: 'trpa ygrb cfkg watb'
      }
    });
    const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");
    var mailOptions = {
      from: 'blackjackv03@gmail.com',
      to: email,
      subject: 'Reset Password',
      text: `http://localhost:5173/resetPassword/${encodedToken}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "Error sending email" });
      } else {
        return res.json({ status: true, message: "Email sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res.json({ status: true, message: "Updated password" });
  } catch (err) {
    return res.json("Invalid token");
  }
});

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: "No token" });
    }
    const decoded = await jwt.verify(token, process.env.KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ status: false, message: "Not authorized" });
  }
  next();
};

router.get('/users', verifyUser, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', verifyUser, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ status: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/make-admin', verifyUser, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { isAdmin: true });
    res.json({ status: true, message: 'User updated to admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/validate', verifyUser, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { isValidated: true });
    res.json({ status: true, message: 'User validated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/verify", verifyUser, (req, res) => {
  return res.json({
    status: true,
    isAdmin: req.user.isAdmin,
    isValidated: req.user.isValidated,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    gender: req.user.gender,
    email: req.user.email,
    dateOfBirth: req.user.dateOfBirth,
    profession: req.user.profession,
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ status: true });
});

router.get('/user/details', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      profession: user.profession
    };

    res.json(userDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

router.get('/family/tree', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.familyTree || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching family tree' });
  }
});

router.put('/family/tree', verifyUser, async (req, res) => {
  try {
    const { familyTree } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { familyTree }, { new: true });
    res.json(user.familyTree);

    const updatedNode = findNodeByEmail(user.email, familyTree);
    if (updatedNode) {
      await propagateChanges(user.email, updatedNode);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating family tree' });
  }
});

router.get('/family/tree/:userId', verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.familyTree || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching family tree' });
  }
});

router.put('/family/tree/:userId', verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { familyTree } = req.body;
    
    const user = await User.findByIdAndUpdate(userId, { familyTree }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.familyTree);

    const updatedNode = findNodeByEmail(user.email, familyTree);
    if (updatedNode) {
      await propagateChanges(user.email, updatedNode);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating family tree' });
  }
});

export { router as UserRouter, verifyUser };

const findNodeByEmail = (email, node) => {
  if (!node) return null;

  if (node.email === email) return node;

  if (node.children) {
    for (let child of node.children) {
      const result = findNodeByEmail(email, child);
      if (result) return result;
    }
  }

  if (node.spouse && node.spouse.email === email) {
    return null;
  }

  return null;
};

const findSpouseByEmail = (email, node) => {
  if (!node) return null;

  if (node.spouse && node.spouse.email === email) {
    return node;
  }

  if (node.children) {
    for (let child of node.children) {
      const result = findSpouseByEmail(email, child);
      if (result) return result;
    }
  }

  return null;
};

const updateNodeByEmail = (email, node, newInfo) => {
  if (!node) return;

  if (node.email === email) {
    Object.assign(node, newInfo);
    return;
  }

  if (node.children) {
    for (let child of node.children) {
      updateNodeByEmail(email, child, newInfo);
    }
  }

  if (node.spouse && node.spouse.email === email) {
    Object.assign(node.spouse, newInfo);
  }
};

const propagateChanges = async (email, updatedNode) => {
  const users = await User.find({});
  for (const user of users) {
    const node = findNodeByEmail(email, user.familyTree);
    if (node) {
      updateNodeByEmail(email, node, updatedNode);
      await User.findByIdAndUpdate(user._id, { familyTree: user.familyTree });
    }
  }
};