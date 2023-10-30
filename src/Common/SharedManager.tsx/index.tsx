export default class SharedManager {
  static myInstance = null;
  token = '';

  /**
   * @returns {SharedManager}
   */
  static getInstance() {
    if (SharedManager.myInstance == null) {
      //@ts-ignore
      SharedManager.myInstance = new SharedManager();
    }

    return this.myInstance;
  }
  getToken() {
    return this.token;
  }
  setToken(token: any) {
    this.token = token;
  }
}
