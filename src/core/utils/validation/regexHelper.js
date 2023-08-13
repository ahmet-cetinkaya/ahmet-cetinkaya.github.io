/* eslint-disable import/prefer-default-export */

export function isUrl(string) {
  const regex =
    /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
  return regex.test(string);
}

// is email name@email.com or email link (mailto:name@email.com)
export function isEmail(string) {
  const regex =
    /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  return regex.test(string);
}
