import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {CallLogEntry, ChatContact, ChatMessage, ChatThread} from '@Types/chatTypes';

export type ChatState = {
  threads: ChatThread[];
  contacts: ChatContact[];
  callLogs: CallLogEntry[];
  searchQuery: string;
};

const initialState: ChatState = {
  threads: [
    {
      id: '1',
      name: 'Product Team',
      avatar: 'https://i.pravatar.cc/100?u=10',
      lastMessage: 'Let us ship the wallet module next.',
      unread: 2,
      online: true,
      muted: false,
      pinned: true,
      messages: [
        {
          id: 'm1',
          text: 'Hey, is the chat module ready?',
          senderId: 'other',
          createdAt: new Date().toISOString(),
          read: true,
        },
        {
          id: 'm2',
          text: 'Let us ship the wallet module next.',
          senderId: 'other',
          createdAt: new Date().toISOString(),
          read: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Support',
      avatar: 'https://i.pravatar.cc/100?u=11',
      lastMessage: 'Your ticket was resolved.',
      unread: 0,
      online: false,
      muted: false,
      pinned: false,
      messages: [
        {
          id: 'm3',
          text: 'Your ticket was resolved.',
          senderId: 'other',
          createdAt: new Date().toISOString(),
          read: true,
        },
      ],
    },
  ],
  contacts: [
    {id: 'c1', name: 'Sara', avatar: 'https://i.pravatar.cc/100?u=2', online: true},
    {id: 'c2', name: 'Ali', avatar: 'https://i.pravatar.cc/100?u=3', online: false},
    {id: 'c3', name: 'Nour', avatar: 'https://i.pravatar.cc/100?u=4', online: true},
    {id: 'c4', name: 'Omar', avatar: 'https://i.pravatar.cc/100?u=5', online: false},
  ],
  callLogs: [
    {
      id: 'cl1',
      name: 'Sara',
      type: 'video',
      direction: 'outgoing',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cl2',
      name: 'Support',
      type: 'audio',
      direction: 'incoming',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cl3',
      name: 'Omar',
      type: 'audio',
      direction: 'missed',
      createdAt: new Date().toISOString(),
    },
  ],
  searchQuery: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (
      state,
      action: PayloadAction<{threadId: string; message: ChatMessage}>,
    ) => {
      const thread = state.threads.find(t => t.id === action.payload.threadId);
      if (thread) {
        thread.messages.push(action.payload.message);
        thread.lastMessage = action.payload.message.text;
      }
    },
    markRead: (state, action: PayloadAction<string>) => {
      const thread = state.threads.find(t => t.id === action.payload);
      if (thread) {
        thread.unread = 0;
        thread.messages.forEach(m => {
          if (m.senderId !== 'me') m.read = true;
        });
      }
    },
    deleteMessage: (
      state,
      action: PayloadAction<{threadId: string; messageId: string}>,
    ) => {
      const thread = state.threads.find(t => t.id === action.payload.threadId);
      if (thread) {
        thread.messages = thread.messages.filter(m => m.id !== action.payload.messageId);
        thread.lastMessage = thread.messages.at(-1)?.text || '';
      }
    },
    createThread: (state, action: PayloadAction<ChatThread>) => {
      state.threads.unshift(action.payload);
    },
    toggleMute: (state, action: PayloadAction<string>) => {
      const thread = state.threads.find(t => t.id === action.payload);
      if (thread) thread.muted = !thread.muted;
    },
    togglePin: (state, action: PayloadAction<string>) => {
      const thread = state.threads.find(t => t.id === action.payload);
      if (thread) thread.pinned = !thread.pinned;
    },
    clearThread: (state, action: PayloadAction<string>) => {
      const thread = state.threads.find(t => t.id === action.payload);
      if (thread) {
        thread.messages = [];
        thread.lastMessage = '';
        thread.unread = 0;
      }
    },
    setChatSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addCallLog: (state, action: PayloadAction<CallLogEntry>) => {
      state.callLogs.unshift(action.payload);
    },
  },
});

export const {
  sendMessage,
  markRead,
  deleteMessage,
  createThread,
  toggleMute,
  togglePin,
  clearThread,
  setChatSearchQuery,
  addCallLog,
} = chatSlice.actions;
export default chatSlice.reducer;
