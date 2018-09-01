import listReducer from './list';
const initialState = {
};

export default function rootReducer(state = initialState, action) {
	return listReducer(state, action);
}