export let logLevel = 0;
/**
 * Set log level.(2 is suggested)
 * @param level 0:log, 1:warn, 2:error
 */
export const setLogLevel = (level: number) => {
  logLevel = level;
};

export const log = (message?: any, ...optionalParams: any[]) => {
  if (logLevel < 1) {
    if (optionalParams.length === 0) {
      console.log(message);
    } else {
      console.log(message, optionalParams);
    }
  }
};

export const warn = (message: any, ...optionalParams: any[]) => {
  if (logLevel < 2) {
    if (optionalParams.length === 0) {
      console.warn(message);
    } else {
      console.warn(message, optionalParams);
    }
  }
};

export const error = (message: any, ...optionalParams: any[]) => {
  if (logLevel < 3) {
    if (optionalParams.length === 0) {
      console.error(message);
    } else {
      console.error(message, optionalParams);
    }
  }
};
