import { Alert, Container } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"
import { useSelector } from 'react-redux'
import Header from '../../components/header/index'
import Home from '../../components/home/index'
import NotFound from '../../components/404/index'
import Login from '../login'
import ProtectedRoute from '../../hoc/protected_route'

import './app.css'

const App = () => {
  const notification = useSelector(state => state.notification)
  
  return (
    <Container fluid className='main_container'>
      <Router>
        <Header />
        <Switch>
          <Route path='/login' component={Login} />
          <ProtectedRoute path='/home' component={Home} />
          <Route component={NotFound} />
        </Switch>
        {notification?.type ? <Alert className='notif' variant={notification.type}>{notification.message}</Alert> : null}
      </Router>
    </Container>
  )
}

export default App
