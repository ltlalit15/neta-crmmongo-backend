// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//     firstName: {
//         type: String,
//         required: [true, 'First name is required'],
//         trim: true
//     },
//     lastName: {
//         type: String,
//         required: [true, 'Last name is required'],
//         trim: true
//     },
//     email: {
//         type: String,
//         required: [true, 'Email is required'],
//             unique: true, 
//     },
//     phone: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required'],
//     },
//     role: {
//         type: String,
//         required: [true, 'Role is required'],
//         default: "user",
//     },
//     state: {
//         type: String,
//         required: true,
//     },
//     country: {
//         type: String,
//         required: true,
//     },
//     permissions: {
//         dashboardAccess: {
//             type: Boolean,
//             default: false
//         },
//         clientManagement: {
//             type: Boolean,
//             default: false
//         },
//         projectManagement: {
//             type: Boolean,
//             default: false
//         },
//         designTools: {
//             type: Boolean,
//             default: false
//         },
//         financialManagement: {
//             type: Boolean,
//             default: false
//         },
//         userManagement: {
//             type: Boolean,
//             default: false
//         },
//         reportGeneration: {
//             type: Boolean,
//             default: false
//         },
//         systemSettings: {
//             type: Boolean,
//             default: false
//         }
//     },
//     accessLevel: {
//         fullAccess: {
//             type: Boolean,
//             default: false
//         },
//         limitedAccess: {
//             type: Boolean,
//             default: false
//         },
//         viewOnly: {
//             type: Boolean,
//             default: false
//         }
//     },
//     isAdmin: {
//         type: Boolean,
//         default: false
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     },
//     profileImage: [],
// });



// const User = mongoose.model('User', userSchema);

// module.exports = User;



const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        default: "user",
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    assign:{
        type:String,
        required:true
    },
    permissions: {
        dashboardAccess: { type: Boolean, default: false },
        clientManagement: { type: Boolean, default: false },
        projectManagement: { type: Boolean, default: false },
        designTools: { type: Boolean, default: false },
        financialManagement: { type: Boolean, default: false },
        userManagement: { type: Boolean, default: false },
        reportGeneration: { type: Boolean, default: false },
        systemSettings: { type: Boolean, default: false }
    },
    accessLevel: {
        fullAccess: { type: Boolean, default: false },
        limitedAccess: { type: Boolean, default: false },
        viewOnly: { type: Boolean, default: false }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profileImage: [],
    googleSignIn: {
        type: Boolean,
        default: false
    },
    resetToken: String,
    resetTokenExpiry: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add method to generate and hash password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
