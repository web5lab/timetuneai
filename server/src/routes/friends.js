import express from 'express';
import User from '../../schemas/User.js';
import Friend from '../../schemas/Friend.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Send friend request by username
router.post('/request', authenticateUser, async (req, res) => {
  try {
    const { username } = req.body;
    const requesterId = req.user.id;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Find recipient by username
    const recipient = await User.findOne({ username: username.toLowerCase() });
    if (!recipient) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Can't send request to yourself
    if (recipient._id.toString() === requesterId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if friendship already exists
    const existingFriendship = await Friend.findFriendship(requesterId, recipient._id);
    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        return res.status(400).json({ error: 'You are already friends' });
      }
      if (existingFriendship.status === 'pending') {
        return res.status(400).json({ error: 'Friend request already sent' });
      }
      if (existingFriendship.status === 'blocked') {
        return res.status(400).json({ error: 'Cannot send friend request' });
      }
    }

    // Create friend request
    const friendRequest = new Friend({
      requester: requesterId,
      recipient: recipient._id,
      status: 'pending'
    });

    await friendRequest.save();
    await friendRequest.populate('recipient', 'name email picture username');

    res.json({ 
      success: true, 
      message: `Friend request sent to ${recipient.name}`,
      request: friendRequest
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Get pending friend requests (incoming)
router.get('/requests/incoming', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await Friend.getPendingRequests(userId);
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ error: 'Failed to get friend requests' });
  }
});

// Get sent friend requests (outgoing)
router.get('/requests/outgoing', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await Friend.getSentRequests(userId);
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Get outgoing requests error:', error);
    res.status(500).json({ error: 'Failed to get sent requests' });
  }
});

// Accept friend request
router.post('/accept/:requestId', authenticateUser, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const friendRequest = await Friend.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Only recipient can accept
    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to accept this request' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Request is no longer pending' });
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();
    await friendRequest.populate('requester recipient', 'name email picture username');

    res.json({ 
      success: true, 
      message: 'Friend request accepted',
      friendship: friendRequest
    });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// Decline friend request
router.post('/decline/:requestId', authenticateUser, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const friendRequest = await Friend.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    // Only recipient can decline
    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to decline this request' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Request is no longer pending' });
    }

    friendRequest.status = 'declined';
    await friendRequest.save();

    res.json({ 
      success: true, 
      message: 'Friend request declined'
    });
  } catch (error) {
    console.error('Decline friend request error:', error);
    res.status(500).json({ error: 'Failed to decline friend request' });
  }
});

// Get friends list
router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const friendships = await Friend.getFriends(userId);
    
    // Format friends list
    const friends = friendships.map(friendship => {
      const friend = friendship.requester._id.toString() === userId 
        ? friendship.recipient 
        : friendship.requester;
      
      return {
        id: friend._id,
        name: friend.name,
        email: friend.email,
        picture: friend.picture,
        username: friend.username,
        friendshipId: friendship._id,
        friendsSince: friendship.updatedAt
      };
    });

    res.json({ success: true, friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Failed to get friends list' });
  }
});

// Remove friend
router.delete('/:friendshipId', authenticateUser, async (req, res) => {
  try {
    const { friendshipId } = req.params;
    const userId = req.user.id;

    const friendship = await Friend.findById(friendshipId);
    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    // Only participants can remove friendship
    if (friendship.requester.toString() !== userId && friendship.recipient.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to remove this friendship' });
    }

    await Friend.findByIdAndDelete(friendshipId);

    res.json({ 
      success: true, 
      message: 'Friend removed successfully'
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

// Search users by username
router.get('/search/:query', authenticateUser, async (req, res) => {
  try {
    const { query } = req.params;
    const userId = req.user.id;

    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: userId } }, // Exclude current user
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).select('name email picture username').limit(20);

    // Get friendship status for each user
    const usersWithStatus = await Promise.all(
      users.map(async (user) => {
        const friendship = await Friend.findFriendship(userId, user._id);
        return {
          ...user.toObject(),
          friendshipStatus: friendship ? friendship.status : 'none'
        };
      })
    );

    res.json({ success: true, users: usersWithStatus });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

export default router;