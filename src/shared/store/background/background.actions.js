const prefix = '[BACKGROUND]';

export const SET_BACKGROUND_STYLE = `${prefix} SET_BACKGROUND_STYLE`;
export const createSetBackgroundStyleAction = style => ({
  type: SET_BACKGROUND_STYLE,
  payload: style,
});
