import { DEBUG_MODE, LOG_LEVEL } from '../consts/debug';

export const log = (message?: any, ...optionalParams: any[]) => {
  if (DEBUG_MODE && LOG_LEVEL < 1) {
    if (optionalParams.length === 0) {
      console.log(message);
    } else {
      console.log(message, optionalParams);
    }
  }
};

export const warn = (message: any, ...optionalParams: any[]) => {
  if (DEBUG_MODE && LOG_LEVEL < 2) {
    if (optionalParams.length === 0) {
      console.warn(message);
    } else {
      console.warn(message, optionalParams);
    }
  }
};

export const error = (message: any, ...optionalParams: any[]) => {
  if (DEBUG_MODE && LOG_LEVEL < 3) {
    if (optionalParams.length === 0) {
      console.error(message);
    } else {
      console.error(message, optionalParams);
    }
  }
};
