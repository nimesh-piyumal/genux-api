import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Make sure your auth check API returns the profile picture
export async function GET(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
      );
    }
    
    // Verify token and get user ID
    let userId;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.userId;
    } catch (error) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 }
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
        { authenticated: false },
        { status: 200 }
      );
    }
    
    // Update last login time
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { lastLogin: new Date() } }
    );
    
    return NextResponse.json(
      { 
        authenticated: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          profilePicture: user.profilePicture // Make sure to include profile picture
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 200 }
    );
  }
}