import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentServer, Server, ServerState } from '@/lib/Types';

const initialState: ServerState = {
  servers: [],
  currentServer: 'dm',
};

const serverSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {
    setServers: (state, action: PayloadAction<Server[]>) => {
      state.servers = action.payload;
    },
    setCurrentServer: (state, action: PayloadAction<CurrentServer>) => {
      state.currentServer = action.payload;
    },
  },
});

export const { setServers, setCurrentServer } = serverSlice.actions;
export default serverSlice.reducer;