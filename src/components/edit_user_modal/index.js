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

const EditUsermodal = ({
  show,
  handleClose,
  user,
}) => {
  const is_logged_in = useSelector(state => state.is_logged_in)
  const token = useSelector(state => state.token)
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState(user.email)
  const [username, setUsername] = useState(user.username)
  const [department, setDepartment] = useState(user.department)
  const [is_enabled, setEnabled] = useState(user.is_enabled)
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
        validation_result = validators.department.validate(department)
        if (validation_result.error) {
          setError(validation_result.error.message)
        } else {
          if (is_logged_in) {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ADMINS_USERS_UPDATE}${user.id}`,
              {
                username: username,
                email: email,
                department: department,
                is_enabled: is_enabled,
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
                      message: 'User updated successfuly',
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

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Edit username or email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Email" defaultValue={email} onChange={e => { setError(''); setEmail(e.target.value) }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" defaultValue={username} onChange={e => { setError(''); setUsername(e.target.value) }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDepartment">
            <Form.Label>Department</Form.Label>
            <Form.Control type="text" placeholder="Department" defaultValue={department} onChange={e => { setError(''); setDepartment(e.target.value) }} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Is enabled?" defaultChecked={is_enabled} onChange={e => { setEnabled(e.target.is_checked) }} />
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

export default EditUsermodal
