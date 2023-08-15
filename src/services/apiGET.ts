import axiosInstance from "@/config/axiosInstance";
import { Channel, CurrentServer, Group, Message, Server, User } from "@/lib/Types";

const handleRequest = async <T> (request: Promise<any>): Promise<T|null> => {
  try {
    const response = await request;
    return response.data as T;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};

export const getSearchResults = async (query: string) => {
  return await handleRequest<(User | Server)[]>(axiosInstance.get(`search/${query}`))
}

// Fetch users
export const getUsers = async () => {
  return await handleRequest<User[]>(axiosInstance.get("users/"));
};

// Fetch user info by userId
export const getUserInfo = async (userId: number) => {
  return await handleRequest<User>(axiosInstance.get(`user-info/${userId}/`));
};

// Fetch friends list
export const getFriends = async () => {
  return await handleRequest<User[]>(axiosInstance.get("friends/"));
};

// Fetch friends list
export const getOnlineUsers = async (onlineUsers: (number | string)[]) => {
  return await handleRequest<User[]>(axiosInstance.get('online-users/' + onlineUsers));
};


// Fetch pending friend requests
export const getPendingRequests = async () => {
  return await handleRequest<User[]>(axiosInstance.get("pending-requests/"));
};

// Fetch mutual friends by userId
export const getMutualFriends = async (userId: number) => {
  return await handleRequest<User[]>(axiosInstance.get(`mutual-friends/${userId}/`));
};

export const getFriendSuggestions = async () => {
  return await handleRequest<User[]>(axiosInstance.get("friend-suggestions/"));
};

// Fetch user messages for a given chat
export const getUserMessages = async (userId: number) => {
  return await handleRequest<Message[]>(axiosInstance.get(`get-thread-messages/${userId}`));
};

// Fetch user chat threads
export const getChatThreads = async () => {
  return await handleRequest<User[]>(axiosInstance.get<User[]>("get-chat-threads/"));
}


// Fetch group info
export const getGroupInfo = async (groupId: number) => {
  return await handleRequest<Group>(axiosInstance.get(`group-meta/${groupId}/`));
};

// Fetch group members for a given group
export const getGroupMembers = async (groupId: number) => {
  return await handleRequest<User[]>(axiosInstance.get(`group-members/${groupId}/`));
};

// Fetch group messages for a given group
export const getGroupMessages = async (groupId: number) => {
  return await handleRequest<Message[]>(axiosInstance.get(`group-messages/${groupId}`))
}

// Fetch all servers 
export const getServers = async () => {
  return await handleRequest<Server[]>(axiosInstance.get("servers/"))
}

// Fetch details of a server for given id 
export const getServerInfo = async (serverId: CurrentServer) => {
  return await handleRequest<Server>(axiosInstance.get(`servers/${serverId}`))
}

// Fetch servers of current user 
export const getUserServers = async () => {
  return await handleRequest<Server[]>(axiosInstance.get("user-servers/"))
}

// Fetch channels of current server
export const getChannels = async (serverId: CurrentServer) => {
  return await handleRequest<Channel[]>(axiosInstance.get(`channels/${serverId}`))
}


export const getChannelMessages = async (channelId: number) => {
  return await handleRequest<Message[]>(axiosInstance.get(`channel-messages/${channelId}`))
}