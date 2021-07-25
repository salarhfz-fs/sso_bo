import { useEffect, useState } from 'react'
import {
  Button,
  Navbar,
} from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import './header.css'

const Header = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const is_logged_in = useSelector(state => state.is_logged_in)
  const history = useHistory()
  const [is_login_page, setLoginPage] = useState(history.location.pathname === '/login')

  const handleGoToLogin = () => history.push('/login')

  const handleLogout = () => {
    dispatch({
      type: 'SET_LOGIN_STATUS',
      payload: {
        is_logged_in: false,
        token: '',
      },
    })
    history.push('/login')
  }

  useEffect(() => {
    setLoginPage(location.pathname === '/login')
  }, [location])

  return (
    <Navbar bg="dark" variant="dark" className='main_header'>
      <Navbar.Brand href="/home">QA SSO Admin Dashboard</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          {is_logged_in ?
            <Button variant='danger' onClick={handleLogout}>Logout</Button> :
            !is_login_page && <Button variant='secondary' onClick={handleGoToLogin}>Login to Dashboard</Button>}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
