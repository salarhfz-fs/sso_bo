import { useState } from 'react'
import axios from "axios";
import {
  Alert,
  Button,
  Modal,
  Form
} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as validators from '../../business/validations'

const NewUserModal = ({
  show,
  handleClose,
}) => {
  const is_logged_in = useSelector(state => state.is_logged_in)
  const token = useSelector(state => state.token)
  const dispatch = useDispatch()

  const history = useHistory()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [repeat_password, setRepeatPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    let validation_result = validators.email.validate(email)
    if (validation_result.error) {
      setError(validation_result.error.message)
    } else {
      validation_result = validators.username.validate(username)
      if (validation_result.error) {
        setError(validation_result.error.message)
      } else {
        validation_result = validators.password.validate(password)
        if (validation_result.error) {
          setError(validation_result.error.message)
        } else {
          validation_result = validators.password.validate(repeat_password)
          if (validation_result.error) {
            setError(validation_result.error.message)
          } else {
            if (password !== repeat_password) {
              setError('Passwords should match')
            } else {
              validation_result = validators.department.validate(department)
              if (validation_result.error) {
                setError(validation_result.error.message)
              } else {
                if (is_logged_in) {
                  const response = await axios.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ADMINS_USERS}`,
                    {
                      username: username,
                      email: email,
                      department: department,
                      password: password,
                    },
                    { headers: { "authorization": `Bearer ${token}` } }
                  )
                  if (response.status === 200) {
                    if (response.data?.code === 201) {
                      handleClose()
                      dispatch({
                        type: 'SET_NOTIFICATION',
                        payload: {
                          notification: {
                            message: 'User added successfuly',
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
              }
            }
          }
        }
      }
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Create a new user</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Email" onChange={e => { setError(''); setEmail(e.target.value) }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" onChange={e => { setError(''); setUsername(e.target.value) }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={e => { setError(''); setPassword(e.target.value) }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPasswordRepeat">
            <Form.Label>Retype password</Form.Label>
            <Form.Control type="password" placeholder="Retype password" onChange={e => { setError(''); setRepeatPassword(e.target.value) }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Control type="email" placeholder="Department" onChange={e => { setError(''); setDepartment(e.target.value) }} />
          </Form.Group>

          {error && <Alert className='form_error' variant='danger'>{error}</Alert>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create User
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewUserModal
