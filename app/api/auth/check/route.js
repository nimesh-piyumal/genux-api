import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export async function GET(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    // Verify the token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Connect to MongoDB to get user data
      const client = await clientPromise;
      const db = client.db('genux-api');
      const usersCollection = db.collection('users');
      
      // Find user by ID - convert string ID to ObjectId
      const user = await usersCollection.findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { password: 0 } } // Exclude password
      );
      
      if (!user) {
        return NextResponse.json(
          { authenticated: false },
          { status: 401 }
        );
      }
      
      // Return user data
      return NextResponse.json(
        { 
          authenticated: true,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email
          }
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Token verification error:', error);
      // If verification fails, token is invalid
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}