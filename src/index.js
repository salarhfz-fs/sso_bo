import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './containers/app/index'
import store from './store/index'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
