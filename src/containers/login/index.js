import { useState } from 'react'
import axios from "axios"
import {
  Alert,
  Form,
  Button,
} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as validators from '../../business/validations'

import './login.css'

const Login = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const is_logged_in = useSelector(state => state.is_logged_in)
  if (is_logged_in) {
    history.push('/home')
    return null
  }

  const handleLogin = async () => {
    let validation_result = validators.email.validate(email)
    if (validation_result.error) {
      setError(validation_result.error.message)
    } else {
      validation_result = validators.password.validate(password)
      if (validation_result.error) {
        setError(validation_result.error.message)
      } else {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ADMINS_LOGIN}`, {
          email,
          password
        })
        if (response.status === 200) {
          if (response.data?.code === 200) {
            const token = response.data.data.token
            dispatch({
              type: 'SET_LOGIN_STATUS',
              payload: {
                is_logged_in: true,
                token,
              },
            })
            dispatch({
              type: 'SET_NOTIFICATION',
              payload: {
                notification: {
                  message: 'Login successful',
                  type: 'success',
                }
              },
            })
            setTimeout(() => {
              dispatch({
                type: 'SET_NOTIFICATION',
                payload: {
                  message: '',
                  type: '',
                },
              })
            }, 3000)
            history.push('/home')
          } else {
            setError(response.data.message)
          }
        }
      }
    }
  }

  return (
    <div className='login_form'>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={e => { setError(''); setEmail(e.target.value) }} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={e => { setError(''); setPassword(e.target.value) }} />
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleLogin} disabled={error}>
          Login
        </Button>

        {error && <Alert className='form_error' variant='danger'>{error}</Alert>}
      </Form>
    </div>
  )
}

export default Login
