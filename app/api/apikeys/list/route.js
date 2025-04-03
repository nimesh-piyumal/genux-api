import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('genux-api');
    
    // Get user's API keys
    const apiKeysCollection = db.collection('apikeys');
    const apiKeys = await apiKeysCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Map the API keys to a more friendly format
    const mappedApiKeys = apiKeys.map(key => ({
      _id: key._id.toString(),
      name: key.name,
      key: key.key,
      createdAt: key.createdAt,
      lastUsed: key.lastUsed
    }));
    
    return NextResponse.json({
      success: true,
      apiKeys: mappedApiKeys
    });
  } catch (error) {
    console.error('API keys list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}