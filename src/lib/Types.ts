
export interface Server {
    id: number
    name: string
    owner: string
    is_paid: boolean
    avatar?: string
    cover?: string
    description?: string
    category?: string
    created_at: Date
}

export interface Channel {
    id: number
    name: string
    server: string
    avatar?: string
    channel_type: string
    created_at: Date
}

export interface UserProfile {
    avatar?: string;
    cover?: string;
    phone_number?: string;
    bio?: string;
}

export interface User {
    id: number;
    friend_id: number | null;
    username: string;
    email: string;
    profile?: UserProfile;
    friend_profile?: UserProfile;
    date_joined: Date;
    type?: string;
    name?: string
    is_admin?: boolean;
    avatar?: string;
    chat_type?: 'user' | 'group';
    unread_count?: number;
    pending_requests?: number;
}

export interface Group {
    id: number;
    name: string;
    avatar?: string;
}

export interface Message {
    message: string;
    files: { file: File; fileName: string, fileType?: "image" | "video" | "application"; file_thumb?: string; }[];
    file?: string;
    file_name?: string;
    file_thumb?: string;
    file_type?: "image" | "video" | "application";
    username: string;
    sender: number;
    profilePic?: string;
    chatType?: 'user' | 'group'
    receiver?: number;
    timestamp: string;
    is_group_chat: boolean
    group?: number
    is_read?: boolean
    delivery_status?: boolean
    delivered_to?: (number |string)[]
    read_by?: (number |string)[]
    channel_id?: number;

}

export interface AccessDetails {
    exp: number;
    iat: number;
    jti: string;
    token_type: string;
    user_id: number;
    username: string;
}


export interface ServerCreationInfo {
	category: string;
	name: string;
	avatar: File | null;
}


export interface OnlineStatusData {
	type: "online_status";
	user: User; // Replace User with the actual type of user data
	online_status: "online" | "offline";
}


// State Interfaces
export interface UserState {
    isAuthenticated?: boolean,
    userId?: CurrentChat,
    username?: string,
    access?: string,
    refresh?: string,
    loggedUser: User | null,
}

export interface OnlineUsers {
    users: string[]
}

export type CurrentServer = number | string;

export type CurrentChat = number | null;
export type ChatType = 'user' | 'group' | 'channel' | '';
export interface ChatState {
    currentChat: CurrentChat;
    chatType: ChatType;
    target: CurrentChat;
    showSidebar: boolean;

}
export interface ServerState {
    servers: Server[];
    currentServer: CurrentServer;
}

export interface FriendsState {
    pendingRequests: User[];
    friendsList: User[];
    blockedFriends: User[];
}

export interface RootState {
    user: Partial<UserState>,
    server: Partial<ServerState>
    friends: Partial<FriendsState>
    onlineUsers: Partial<OnlineUsers>,
    chat: Partial<ChatState>;
}