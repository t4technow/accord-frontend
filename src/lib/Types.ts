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
}

export interface Group {
    id: number;
    name: string;
	avatar?: string;
}

export interface Message {
	message: string;
    files: { file: File; fileName: string, fileType?: "image" | "video" | "application"}[];
    file?: string;
    file_type?: "image" | "video" | "application";
	username: string;
	sender: number;
    profilePic?: string;
    chatType?: 'user' | 'group'
	receiver?: number;
	timestamp: string;
    is_group_chat: boolean
    group?: number
}

export interface AccessDetails {
	exp: number;
	iat: number;
	jti: string;
	token_type: string;
	user_id: number;
	username: string;
}


// State Interfaces
interface UserState {
    isAuthenticated?: boolean,
    userId?: number,
    username?: string,
    access?: string,
    refresh?: string,
}

export type CurrentServer = number | string;

export interface ServerState {
  servers: Server[];
  currentServer: CurrentServer;
}

export interface RootState {
    user: Partial<UserState>,
    server: Partial<ServerState>
}

