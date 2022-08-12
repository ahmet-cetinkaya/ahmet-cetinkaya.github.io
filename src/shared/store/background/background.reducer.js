import {SET_BACKGROUND_STYLE} from './background.actions';

const initialState = {style: {backgroundPosition: undefined}};

// eslint-disable-next-line default-param-last
const backgroundReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BACKGROUND_STYLE:
      return {...state, style: {...state.style, ...action.payload}};

    default:
      return state;
  }
};

export default backgroundReducer;
