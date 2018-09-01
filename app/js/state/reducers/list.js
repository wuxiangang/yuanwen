const initialState = {};

export default function listReducer(state = initialState, action) {
  let payload = {};
  
  switch(action.type) {
      case 'FETCH_SUCCESS':  
          payload[action.key] = action.payload;
          payload[action.key].page = 1;
          return Object.assign({},state,payload) ;
      case 'CLEAR_PROPS_DATA':  
          delete state[action.key]
          return state;
      case 'ASSIGN_PROPS_DATA':
          payload[action.key] = state[action.key];
          const page = payload[action.key].page || 1;
          payload[action.key].page = page + 1;
          payload[action.key].content.list = payload[action.key].content.list.concat(action.payload.content.list);
          return Object.assign({},state,payload) ;
      case 'ADD_SHELF':
          if (!state[action.key]) return;
          state[action.key].content.collect_status = action.show;
          return state;
      default: return state;
  }
}