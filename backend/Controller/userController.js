const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const cloudinary = require('../Config/cloudinary');
const UserProposal = require('../Model/Admin/UserProposalModel');
const nodemailer = require('nodemailer');
const { encodeToken } = require("../middlewares/decodeToken")
// Cloudinary config
cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

// JWT Token function
const genretToken = (id) => {
  return jwt.sign({ id }, 'your_jwt_secret_key', { expiresIn: '7d' });
};

// Register user
// old code
// const createUser = async (req, res) => {
//   try {
//     const {
//       firstName, lastName, email, password, passwordConfirm,
//       phone, role, state, country, permissions, accessLevel, assign
//     } = req.body;

//     const requiredFields = { firstName, lastName, email, password, passwordConfirm, phone, role, state, country, assign };
//     for (const [key, value] of Object.entries(requiredFields)) {
//       if (!value || value.toString().trim() === '') {
//         return res.status(400).json({ status: false, message: `${key} is required` });
//       }
//     }

//     if (password !== passwordConfirm) {
//       return res.status(400).json({ status: false, message: 'Passwords do not match' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists with same email" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     let profileImage = '';
//     if (req.files && req.files.image) {
//       const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
//         folder: 'user_profiles',
//         resource_type: 'image',
//       });
//       profileImage = result.secure_url;
//     }

//     const parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : permissions;
//     const parsedAccessLevel = typeof accessLevel === 'string' ? JSON.parse(accessLevel) : accessLevel;

//     const newUser = await User.create({
//       firstName,
//       lastName,
//       email,
//       phone,
//       password: hashedPassword,
//       role,
//       state,
//       country,
//       assign,
//       profileImage,
//       permissions: parsedPermissions,
//       accessLevel: parsedAccessLevel,
//     });

//     const token = genretToken(newUser._id);

//     res.status(201).json({
//       status: 'success',
//       data: { user: newUser, token }
//     });
//   } catch (err) {
//     res.status(400).json({ status: false, message: err.message });
//   }
// };


// new code
const createUser = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password, passwordConfirm,
      phone, role, state, country, assign,
      proposal, tasks, reports, user, client, dailylogs,
      projectsAndJobs, invoiceAndBilling
    } = req.body;

    // Required field validation
    const requiredFields = { firstName, lastName, email, password, passwordConfirm, phone, role, state, country, assign };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || value.toString().trim() === '') {
        return res.status(400).json({ status: false, message: `${key} is required` });
      }
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ status: false, message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with same email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile image if available
    let profileImage = '';
    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'user_profiles',
        resource_type: 'image',
      });
      profileImage = result.secure_url;
    }

    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      state,
      country,
      assign,
      profileImage
    });

    // Parse permission objects from form-data JSON
    const parsedProposal = JSON.parse(proposal || '{}');
    const parsedProjectsAndJobs = JSON.parse(projectsAndJobs || '{}');
    const parsedTasks = JSON.parse(tasks || '{}');
    const parsedReports = JSON.parse(reports || '{}');
    const parsedUser = JSON.parse(user || '{}');
    const parsedClient = JSON.parse(client || '{}');
    const parsedInvoiceAndBilling = JSON.parse(invoiceAndBilling || '{}');
    const parsedDailylogs = JSON.parse(dailylogs || '{}');

    // Create UserProposal document
    await UserProposal.create({
      userId: newUser._id,
      proposal: parsedProposal,
      projectsAndJobs: parsedProjectsAndJobs,
      tasks: parsedTasks,
      reports: parsedReports,
      user: parsedUser,
      client: parsedClient,
      invoiceAndBilling: parsedInvoiceAndBilling,
      dailylogs: parsedDailylogs
    });

    // Generate token
    const token = genretToken(newUser._id);

    res.status(201).json({
      status: 'success',
      data: { user: newUser, token }
    });

  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({ status: false, message: err.message });
  }
};


// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: 'Invalid email or password' });
    }

    const token = await genretToken(user._id);
    const encodeTokens = await encodeToken(token);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    // 🔐 Fetch permissions
    const permissions = await UserProposal.findOne({ userId: user._id });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token: encodeTokens,
      user: {
        ...userObj,
        permissions
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ✅ Email Function
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'packageitappofficially@gmail.com',
      pass: 'epvuqqesdioohjvi'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'sagarkher1999@gmail.com',
    to: options.email,
    subject: options.subject,
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Hi,</p>
        <p>We received a request to reset your password. Please click the button below to reset your password:</p>
        <a href="https://saaranik-api.netlify.app/resetPassword?token=${options.resetToken}" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p>This link will expire in 10 minutes for security reasons.</p>
        <br>
        <p>Regards,<br>PackageIt Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found with this email' });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: 'Reset Your Password',
      resetToken: resetToken
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email!',
      resetToken: resetToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'There was an error sending email.' });
  }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ status: 'fail', message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ status: 'fail', message: 'Passwords do not match.' });
    }

    // Hash the token to match with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with this token and check expiration
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ status: 'fail', message: 'Token is invalid or has expired.' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully.'
    });

  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    // Attach permissions from UserProposal
    const populatedUsers = await Promise.all(users.map(async user => {
      const permissions = await UserProposal.findOne({ userId: user._id });
      return {
        ...user.toObject(),
        permissions
      };
    }));

    res.status(200).json({
      status: 'success',
      results: populatedUsers.length,
      data: { users: populatedUsers }
    });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};


//GET SINGLE DeleteUser
//METHOD:DELETE
const deleteUser = async (req, res) => {
  let deleteUserID = req.params.id
  if (deleteUser) {
    const deleteUser = await User.findByIdAndDelete(deleteUserID, req.body);
    res.status(200).json("Delete Checklists Successfully")
  } else {
    res.status(400).json({ message: "Not Delete User" })
  }
}

//GET SINGLE UserUpdate
//METHOD:PUT
// const UpdateUser = async (req, res) => {
//   try {
//     const allowedFields = [
//       'firstName',
//       'lastName',
//       'email',
//       'phone',
//       'role',
//       'state',
//       'country',
//       'permissions',
//       'accessLevel'
//     ];

//     const updateData = {};

//     // Handle allowed text fields
//     allowedFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         updateData[field] = req.body[field];
//       }
//     });

//     // Handle profileImage if new image is uploaded
//     if (req.files && req.files.image) {
//       const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
//         folder: 'user_profiles',
//         resource_type: 'image',
//       });
//       updateData.profileImage = result.secure_url;
//     }

//     // If no data to update
//     if (Object.keys(updateData).length === 0) {
//       return res.status(400).json({ message: 'At least one field must be provided for update' });
//     }

//     // Update user
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: updatedUser
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
// const UpdateUser = async (req, res) => {
//   try {
//     const allowedFields = [
//       'firstName',
//       'lastName',
//       'email',
//       'phone',
//       'role',
//       'state',
//       'country',
//       'permissions',
//       'accessLevel'
//     ];

//     const updateData = {};

//     // Handle allowed text fields
//     allowedFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         // Check if permissions or accessLevel is string, then parse it
//         if ((field === 'permissions' || field === 'accessLevel') && typeof req.body[field] === 'string') {
//           try {
//             updateData[field] = JSON.parse(req.body[field]);
//           } catch (err) {
//             console.warn(`Failed to parse ${field}:`, req.body[field]);
//             updateData[field] = req.body[field]; // fallback: keep as is
//           }
//         } else {
//           updateData[field] = req.body[field];
//         }
//       }
//     });

//     // Handle profileImage if new image is uploaded
//     if (req.files && req.files.image) {
//       const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
//         folder: 'user_profiles',
//         resource_type: 'image',
//       });
//       updateData.profileImage = result.secure_url;
//     }

//     // If no data to update
//     if (Object.keys(updateData).length === 0) {
//       return res.status(400).json({ message: 'At least one field must be provided for update' });
//     }

//     // Update user
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: updatedUser
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
const UpdateUser = async (req, res) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'role',
      'state',
      'country',
      'assign'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Upload profile image if provided
    let imageFile = req.body.profileImage || '';
    if (req.files && req.files.profileImage) {
      try {
        imageFile = req.files.profileImage;
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: 'user_profiles',
          resource_type: 'image'
        });
        updateData.profileImage = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: 'Image upload failed', error: uploadError });
      }
    }

    if (Object.keys(updateData).length === 0 && !req.body.proposal) {
      return res.status(400).json({ message: 'At least one field or permission must be provided for update' });
    }

    // Update User
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    // Parse and update permissions if any
    const userProposal = await UserProposal.findOne({ userId: updatedUser._id });

    if (userProposal) {
      const permissionFields = [
        'proposal', 'tasks', 'reports', 'user', 'client',
        'projectsAndJobs', 'invoiceAndBilling', 'dailylogs'
      ];

      permissionFields.forEach(field => {
        if (req.body[field]) {
          try {
            userProposal[field] = JSON.parse(req.body[field]);
          } catch (e) {
            console.warn(`Invalid JSON for ${field}:`, req.body[field]);
          }
        }
      });

      await userProposal.save();
    }

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser, permissions: userProposal }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


//METHOD:Single
//TYPE:PUBLIC
const SingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const permissions = await UserProposal.findOne({ userId: user._id });

    const populatedUser = {
      ...user.toObject(),
      permissions
    };

    res.status(200).json({
      status: 'success',
      data: populatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error", error });
  }
};

module.exports = { createUser, loginUser, forgotPassword, resetPassword, getAllUsers, deleteUser, UpdateUser, SingleUser }
