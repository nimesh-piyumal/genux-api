import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify token and get user ID
    let userId;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.userId;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Get request data
    const { name, email, profilePicture, currentPassword, newPassword } = await request.json();
    
    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('genux-api');
    const usersCollection = db.collection('users');
    
    // Find user
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        );
      }
    }
    
    // Update user data
    const updateData = {
      name,
      email,
      updatedAt: new Date()
    };
    
    // Add profile picture if provided
    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }
    
    // Handle password change if requested
    if (newPassword) {
      // Verify current password
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password' },
          { status: 400 }
        );
      }
      
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateData.password = hashedPassword;
    }
    
    // Update user in database
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Profile updated successfully',
        user: {
          id: user._id.toString(),
          name: updateData.name,
          email: updateData.email,
          profilePicture: updateData.profilePicture || user.profilePicture
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}