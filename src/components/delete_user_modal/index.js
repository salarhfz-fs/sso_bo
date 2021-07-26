import {
  Button,
  Modal
} from 'react-bootstrap'
import axios from "axios";
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

const DeleteUserModal = ({
  show,
  handleClose,
  user,
}) => {
  const is_logged_in = useSelector(state => state.is_logged_in)
  const token = useSelector(state => state.token)
  const dispatch = useDispatch()

  const history = useHistory()

  const handleSubmit = async () => {
    if (is_logged_in) {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ADMINS_USERS_DELETE}${user.id}`,
        { headers: { "authorization": `Bearer ${token}` } }
      )
      if (response.status === 200) {
        if (response.data?.code === 200) {
          handleClose()
          dispatch({
            type: 'SET_NOTIFICATION',
            payload: {
              notification: {
                message: 'User deleted successfuly',
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

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Delete {user?.username}</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete {user?.username}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteUserModal
