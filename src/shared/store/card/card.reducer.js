import {
  ADD_CARD_CLASS,
  REMOVE_CARD_CLASS,
  RESET_CARD_STATE,
  SET_CARD_STYLE,
} from './card.actions';

const initialState = {
  classes: [],
  style: {
    transform: undefined,
  },
};

// eslint-disable-next-line default-param-last
const cardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CARD_STYLE:
      return { ...state, style: { ...state.style, ...action.payload } };

    case ADD_CARD_CLASS:
      return { ...state, classes: [...state.classes, action.payload] };

    case REMOVE_CARD_CLASS:
      return {
        ...state,
        classes: state.classes.filter(
          (className) => className !== action.payload
        ),
      };

    case RESET_CARD_STATE: {
      if (!action.payload) return { ...initialState };

      const newState = { ...state };
      action.payload.forEach((key) => {
        newState[key] = initialState[key];
      });
      return newState;
    }

    default:
      return state;
  }
};

export default cardReducer;
