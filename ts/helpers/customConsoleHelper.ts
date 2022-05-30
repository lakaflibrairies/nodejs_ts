import env from "../env";

const customConsole = {
  log(message?: any, ...optionalParams: any[]) {
    if (env.mode === "production") {
      console.log(message, ...optionalParams);
    }
    return;
  },
  error(message?: any, ...optionalParams: any[]) {
    if (env.mode === "production") {
      console.error(message, ...optionalParams);
    }
    return;
  },
};

export default customConsole;
