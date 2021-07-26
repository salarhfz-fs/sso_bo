import { useState } from 'react'
import axios from "axios";
import {
  Alert,
  Button,
  Modal,
  Form,
} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as validators from '../../business/validations'

const ChangePasswordmodal = ({
  show,
  handleClose,
  user,
}) => {
  const is_logged_in = useSelector(state => state.is_logged_in)
  const token = useSelector(state => state.token)
  const dispatch = useDispatch()
  const history = useHistory()
  const [password, setPassword] = useState('')
  const [repeat_password, setRepeatPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    let validation_result = validators.password.validate(password)
    if (validation_result.error) {
      setError(validation_result.error.message)
    } else {
      setPassword(validation_result.value)
      validation_result = validators.password.validate(repeat_password)
      if (validation_result.error) {
        setError(validation_result.error.message)
      } else {
        setRepeatPassword(validation_result.value)
        if (password === repeat_password) {
          if (is_logged_in) {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ADMINS_USERS_CHANGE_PASSWORD}${user.id}`,
              {
                password: password,
              },
              { headers: { "authorization": `Bearer ${token}` } }
            )
            if (response.status === 200) {
              if (response.data?.code === 200) {
                handleClose()
                dispatch({
                  type: 'SET_NOTIFICATION',
                  payload: {
                    notification: {
                      message: 'Password changed successfuly',
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
                }, 3000);
              } else if (response.data?.code === 401) {
                dispatch({
                  type: 'SET_LOGIN_STATUS',
                  payload: {
                    is_logged_in: false,
                    token: '',
                  },
                })
                dispatch({
                  type: 'SET_NOTIFICATION',
                  payload: {
                    notification: {
                      message: 'Session expired. Please log in...',
                      type: 'danger',
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
                }, 3000);
                history.push('/login')
              }
            } else {

            }
          } else {
            history.push('/login')
          }
        } else {
          setError('Passwords should match')
        }
      }
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Change password for {user.username}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>New password</Form.Label>
            <Form.Control type="password" placeholder="New password" defaultValue={password} onChange={e => { setError(''); setPassword(e.target.value) }} />
          </Form.Group>
        </Form>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
            <Form.Label>Retype new password</Form.Label>
            <Form.Control type="password" placeholder="Retype new password" defaultValue={repeat_password} onChange={e => { setError(''); setRepeatPassword(e.target.value) }} />
          </Form.Group>

          {error && <Alert className='form_error' variant='danger'>{error}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ChangePasswordmodal
