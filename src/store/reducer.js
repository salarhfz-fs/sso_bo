const initial_state = {
  is_logged_in: localStorage.getItem('token') ? true : false,
  token: localStorage.getItem('token'),
  notification: {
    message: '',
    type: '',
  },
}

export default function reducer(current_state = initial_state, action) {
  switch (action.type) {
    case 'SET_LOGIN_STATUS':
      const { is_logged_in, token } = action.payload
      if (!is_logged_in) localStorage.removeItem('token')
      else localStorage.setItem('token', token)
      return {
        is_logged_in,
        token,
      }
    case 'SET_NOTIFICATION':
      const { notification } = action.payload
      return {
        ...current_state,
        notification,
      }
    default:
      return current_state
  }
}
