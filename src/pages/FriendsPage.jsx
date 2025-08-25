import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Check, 
  X, 
  Send, 
  Clock,
  UserMinus,
  MessageCircle,
  MoreVertical
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { useSelector } from 'react-redux';
import { userSelector } from '../store/global.Selctor';
import axiosInstance from '../axios/axiosInstance';
import toast from 'react-hot-toast';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const user = useSelector(userSelector);

  useEffect(() => {
    loadFriendsData();
  }, []);

  const loadFriendsData = async () => {
    setIsLoading(true);
    try {
      const [friendsRes, incomingRes, outgoingRes] = await Promise.all([
        axiosInstance.get('/friends'),
        axiosInstance.get('/friends/requests/incoming'),
        axiosInstance.get('/friends/requests/outgoing')
      ]);

      setFriends(friendsRes.data.friends || []);
      setIncomingRequests(incomingRes.data.requests || []);
      setOutgoingRequests(outgoingRes.data.requests || []);
    } catch (error) {
      console.error('Error loading friends data:', error);
      toast.error('Failed to load friends data');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstance.get(`/friends/search/${encodeURIComponent(query)}`);
      setSearchResults(response.data.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (username) => {
    try {
      const response = await axiosInstance.post('/friends/request', { username });
      toast.success(response.data.message);
      
      // Update search results to reflect new status
      setSearchResults(prev => 
        prev.map(user => 
          user.username === username 
            ? { ...user, friendshipStatus: 'pending' }
            : user
        )
      );
      
      // Refresh outgoing requests
      const outgoingRes = await axiosInstance.get('/friends/requests/outgoing');
      setOutgoingRequests(outgoingRes.data.requests || []);
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(error.response?.data?.error || 'Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const response = await axiosInstance.post(`/friends/accept/${requestId}`);
      toast.success(response.data.message);
      loadFriendsData(); // Refresh all data
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error(error.response?.data?.error || 'Failed to accept friend request');
    }
  };

  const declineFriendRequest = async (requestId) => {
    try {
      const response = await axiosInstance.post(`/friends/decline/${requestId}`);
      toast.success(response.data.message);
      loadFriendsData(); // Refresh all data
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast.error(error.response?.data?.error || 'Failed to decline friend request');
    }
  };

  const removeFriend = async (friendshipId) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;
    
    try {
      const response = await axiosInstance.delete(`/friends/${friendshipId}`);
      toast.success(response.data.message);
      loadFriendsData(); // Refresh all data
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error(error.response?.data?.error || 'Failed to remove friend');
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchUsers(query);
    }, 300);
  };

  const getFriendshipStatusButton = (user) => {
    switch (user.friendshipStatus) {
      case 'accepted':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Friends
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Pending
          </span>
        );
      default:
        return (
          <button
            onClick={() => sendFriendRequest(user.username)}
            className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition-colors flex items-center space-x-1"
          >
            <UserPlus className="w-3 h-3" />
            <span>Add</span>
          </button>
        );
    }
  };

  const tabs = [
    { id: 'friends', name: 'Friends', icon: Users, count: friends.length },
    { id: 'requests', name: 'Requests', icon: Clock, count: incomingRequests.length },
    { id: 'sent', name: 'Sent', icon: Send, count: outgoingRequests.length },
    { id: 'search', name: 'Add Friends', icon: UserPlus, count: 0 },
  ];

  return (
    <div className="h-full bg-gray-50 dark:bg-slate-900 overflow-hidden flex flex-col transition-colors duration-200">
      <AppHeader />

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Friends</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your connections and friend requests
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              @{user?.username}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 transition-colors duration-200">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-b-2 border-orange-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.name}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Find Friends</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by username or name..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {isSearching ? 'Searching...' : `Search Results (${searchResults.length})`}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {searchResults.map((searchUser) => (
                      <div key={searchUser._id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={searchUser.picture}
                            alt={searchUser.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{searchUser.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@{searchUser.username}</p>
                          </div>
                        </div>
                        {getFriendshipStatusButton(searchUser)}
                      </div>
                    ))}
                    {!isSearching && searchResults.length === 0 && searchQuery && (
                      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No users found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Your Friends ({friends.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {friends.map((friend) => (
                  <div key={friend.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={friend.picture}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{friend.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{friend.username}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Friends since {new Date(friend.friendsSince).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFriend(friend.friendshipId)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {friends.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No friends yet</p>
                    <p className="text-sm">Start by searching for people to add!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Incoming Requests Tab */}
          {activeTab === 'requests' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Friend Requests ({incomingRequests.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {incomingRequests.map((request) => (
                  <div key={request._id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.requester.picture}
                        alt={request.requester.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{request.requester.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{request.requester.username}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => acceptFriendRequest(request._id)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => declineFriendRequest(request._id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {incomingRequests.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No pending friend requests</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Outgoing Requests Tab */}
          {activeTab === 'sent' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Sent Requests ({outgoingRequests.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {outgoingRequests.map((request) => (
                  <div key={request._id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.recipient.picture}
                        alt={request.recipient.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{request.recipient.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{request.recipient.username}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Sent {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      Pending
                    </span>
                  </div>
                ))}
                {outgoingRequests.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Send className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No sent requests</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;