import {combineReducers, createStore} from 'redux';

import backgroundReducer from './background/background.reducer';
import cardReducer from './card/card.reducer';

const reducers = combineReducers({
  backgroundReducer,
  cardReducer,
});

export default preloadedState => createStore(reducers, preloadedState);
