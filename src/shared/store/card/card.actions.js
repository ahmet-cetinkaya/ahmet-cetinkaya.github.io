const prefix = '[CARD]';

export const SET_CARD_STYLE = `${prefix} SET_CARD_STYLE`;
export const createSetCardStyleAction = (style) => ({
  type: SET_CARD_STYLE,
  payload: style,
});

export const ADD_CARD_CLASS = `${prefix} ADD_CARD_CLASS`;
export const createAddCardClassAction = (className) => ({
  type: ADD_CARD_CLASS,
  payload: className,
});

export const REMOVE_CARD_CLASS = `${prefix} REMOVE_CARD_CLASS`;
export const createRemoveCardClassAction = (className) => ({
  type: REMOVE_CARD_CLASS,
  payload: className,
});

export const RESET_CARD_STATE = `${prefix} RESET_CARD_STATE`;
export const createResetCardStateAction = (propertyKeysArray = undefined) => ({
  type: RESET_CARD_STATE,
  payload: propertyKeysArray,
});
