const getters: any = {
  user: (state: any): object => {
    return {
      loginName: state.loginName,
      sessionId: state.sessionId,
      userId: state.userId,
      userType: state.userType,
      phone: state.phone,
      remember: state.remember
    }
  }
}

export default getters
