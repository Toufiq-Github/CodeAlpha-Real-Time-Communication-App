
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  scheduledAt?: string;
  isActive: boolean;
  summary?: string;
}

export interface Participant {
  id: string;
  userId: string;
  displayName: string;
  joinedAt: string;
  isCameraOn: boolean;
  isMicOn: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface WhiteboardPath {
  id: string;
  userId: string;
  color: string;
  points: Array<{ x: number; y: number }>;
  createdAt: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  tooltip?: string;
}
