import { User } from '../models/index.model.js';
import { generateTokenAndCookie } from '../utils/generateTokenAndCookie.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



//signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};



//login
 export const login = async (req, res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email}).select('+password');
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message: 'Invalid password'
            })
        }

        generateTokenAndCookie(res,user.id);

        const token = jwt.sign({id:user._id},
          process.env.JWT_SECRET,
          {
              expiresIn: '1d',
          }
        )
        res.status(200).json({
            success:true,
            message: 'Login successful',
            token,
            data:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
  }


  //logout
  export const logout = async (req,res)=>{
    try {
      res.cookie("token","",{
        maxAge:0,
        httpOnly:true,
        sameSite:"strict",
      });

      res.status(200).json({
        success:true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Server error during logout' });
    }
  }


  // update user
export const updateUser = async (req, res) => {
  const { name, email, password, newPassword } = req.body;
  const { userId } = req.user;

  try {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update email
    if (email && email !== user.email) {
      const emailAlreadyExists = await User.findOne({ email });
      if (emailAlreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      user.email = email;
    }

    // Update name
    if (name && name !== user.name) {
      user.name = name;
    }

    // Update password
    if (password && newPassword) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }

      if (password === newPassword) {
        return res.status(400).json({
          success: false,
          message: "New password cannot be the same as old password",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error during user update" });
  }
};




  export const deleteUser = async (req, res)=>{
    const {userIdToDelete} = req.query;
    const {userId,role} = req.user;

    try {
      if(role !== 'admin'){
        return res.status(401).json({
          success:false,
          message: 'Unauthorized! Only admins can delete users'
        });
      }

      const userToDelete = await User.findById(userIdToDelete);
      if(!userToDelete){
        return res.status(404).json({
          success:false,
          message: 'User not found'
        });
      }

      if(userToDelete.role === 'admin'){
        return res.status(400).json({
          success:false,
          message: 'Cannot delete admin user'
        });
      }

      await User.findByIdAndDelete(userIdToDelete);
      res.status(200).json({
        success:true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ message: 'Server error during user deletion' });
    }
  }



  export const checkAuth = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Check auth error:", error);
    res.status(500).json({ message: "Server error during auth check" });
  }
};
