/* eslint-disable import/prefer-default-export */

export function isUrl(string) {
  const regex =
    /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
  return regex.test(string);
}
