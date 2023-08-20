import { createSlice } from '@reduxjs/toolkit';



const _initialState = {
  loaded: false,
  chatdata: [{content: "Hey I'm ExperAI! How can I help?", role: 'assistant'}],
  isCustomer: true,
  siginOpen: false,
  npcId: '46d9456d-c2ea-41ed-b436-8afb7131f90b',
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
        const keys = Object.keys(state);
        keys.forEach((key) => state[key] = '')
        state.loaded = true;
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
