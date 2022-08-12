import {combineReducers, createStore} from 'redux';


const reducers = combineReducers({
});

export default preloadedState => createStore(reducers, preloadedState);
