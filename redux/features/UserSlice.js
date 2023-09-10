import { experaiId } from '@/utils/app';
import { createSlice } from '@reduxjs/toolkit';



const _initialState = {
  loaded: false,
  chatdata: [{content: "1 second, calling expert...", role: 'assistant'}],
  siginOpen: false,
  npcId: experaiId,
  upgradeModal: {
    open: false,
    message: ''
  }
}

export const userSlice = createSlice({
    name: 'user',
    initialState: _initialState,
    reducers: {
      setUserData: (state = [], action) => {
        const keys = Object.keys(action.payload);
          keys.forEach((key) => {
              state[key] = action.payload[key]
          })    
      },
      logout: (state) => {
        // const keys = Object.keys(state);
        // keys.forEach((key) => state[key] = '')
        state = _initialState;
      },
      addConversation: (state, action) => {
        const { conversation } = action.payload;
        state.conversations.push(conversation);
      },
      deleteConversation: (state, action) => {
        const { groupId } = action.payload;
        state.conversations = state.conversations.filter((convo) => convo.groupId !== groupId);
      },
      addMessage: (state, action) => {
        // keep context window of 10 messages
        let chatdata = state.chatdata;
        let len = chatdata.length;
        chatdata.push(action.payload);

        state.chatdata = chatdata;
      },
      loadMoreMessages: (state, action) => {
        const { messages } = action.payload;
        let currentMessages = state.activeGroup.messages;
        let newMessages = [...messages, ...currentMessages];
        state.activeGroup.messages = newMessages;
      }
    }
});

export const { setUserData,logout, addConversation, addMessage, loadMoreMessages, deleteConversation } = userSlice.actions;

export const selectUser = state => state?.user;

export default userSlice.reducer;
