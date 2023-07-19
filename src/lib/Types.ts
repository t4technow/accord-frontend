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
}

interface UserState {
    isAuthenticated?: boolean,
    userId?: number,
    username?: string,
    access?: string,
    refresh?: string,
}

export interface RootState {
    user: Partial<UserState>,
}

export interface Message {
	message: string;
	username: string;
	sender: number;
	receiver?: number;
	timestamp: Date;
}

export interface AccessDetails {
	exp: number;
	iat: number;
	jti: string;
	token_type: string;
	user_id: number;
	username: string;
}
