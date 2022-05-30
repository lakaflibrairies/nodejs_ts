const auth = {
  extractToken(authorization: string): string {
    return authorization
      .replace(".super_salt.", "")
      .replace("lakaf-token", "")
      .trim();
  },
};

export default auth;
