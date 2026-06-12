export type ChatMessage = {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  read: boolean;
  replyToId?: string;
};

export type ChatThread = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  online: boolean;
  muted: boolean;
  pinned: boolean;
  messages: ChatMessage[];
};

export type ChatContact = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
};

export type CallLogEntry = {
  id: string;
  name: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  createdAt: string;
};
