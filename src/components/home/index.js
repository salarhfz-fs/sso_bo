import { useEffect, useRef, useState } from 'react'
import axios from "axios";
import { Button, Col, Form, FormControl, Row, Table } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import EditUsermodal from '../edit_user_modal/index'
import ChangePasswordmodal from '../change_password_modal/index'
import DeleteUserModal from '../delete_user_modal/index'
import NewUserModal from '../new_user_modal/index'

import './home.css'

const items_per_page = 10

const Home = () => {
  const initial_load_ref = useRef(true)
  const is_logged_in = useSelector(state => state.is_logged_in)
  const token = useSelector(state => state.token)
  const dispatch = useDispatch()
  const history = useHistory()
  const [users, setUsers] = useState([])
  const [current_page, setCurrentPage] = useState(0)
  const [users_selected, setUsersSelected] = useState(users.slice(current_page, items_per_page))
  const [total_pages, setTotalPages] = useState(Math.floor(users_selected.length / items_per_page) + (users_selected.length % items_per_page !== 0 ? 1 : 0))
  const [search, setSearch] = useState('')
  const [current_user, setCurrentUser] = useState(null)

  const [show_edit, setShowEdit] = useState(false)
  const [show_change_password, setShowChangePassword] = useState(false)
  const [show_delete, setShowDelete] = useState(false)
  const [show_new_user, setShowNewUser] = useState(false)

  const [should_refresh, setShouldRefresh] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      if (is_logged_in) {
        if (initial_load_ref.current === true || should_refresh === true) {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ADMINS_USERS}`, { headers: { "authorization": `Bearer ${token}` } })
          if (response.status === 200) {
            if (response.data?.code === 200) {
              const new_users = response.data.data
              setUsers(new_users)
              initial_load_ref.current = false
              setShouldRefresh(false)
              const new_users_selected = new_users.slice(current_page, items_per_page)
              setUsersSelected(new_users_selected)
              setTotalPages(Math.floor(new_users_selected.length / items_per_page) + (new_users_selected.length % items_per_page !== 0 ? 1 : 0))
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
          }
        }
      }
    }
    fetchUsers()
  }, [users?.length, should_refresh])

  useEffect(() => {
    const filtered_users = users.filter(user => user.username.includes(search) || user.email.includes(search))
    const filtered_users_pagination = filtered_users.slice(0, items_per_page)
    setCurrentPage(0)
    setTotalPages(Math.floor(filtered_users.length / items_per_page) + (filtered_users.length % items_per_page !== 0 ? 1 : 0))
    setUsersSelected(filtered_users_pagination)
  }, [search])

  const handlePagination = ({ selected }) => {
    setCurrentPage(selected)
    const start_index = selected * items_per_page
    setUsersSelected(users.slice(start_index, start_index + items_per_page))
  }

  const handleSearch = (e) => {
    setSearch((e.target.value).toString().trim())
  }

  return (
    <>
      <Form>
        <Row className='m-3'>
          <Col md='10'>
            <FormControl
              type="search"
              placeholder="Search for users with email or usernames..."
              className="mr-2"
              aria-label="Search for users with email or usernames..."
              onChange={handleSearch}
            />
          </Col>
          <Col md='2' className='new_user'>
            <Button id='new_user' variant='success' onClick={() => { setShowNewUser(true) }}>New User</Button>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users_selected.map(user =>
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.department}</td>
              <td>
                <Button className='user_actions' variant='secondary' onClick={() => { setCurrentUser(user); setShowEdit(true) }}>Edit User</Button>
                <Button className='user_actions' variant='warning' onClick={() => { setCurrentUser(user); setShowChangePassword(true) }}>Change Password</Button>
                <Button className='user_actions' variant='danger' onClick={() => { setCurrentUser(user); setShowDelete(true) }}>Delete</Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <section className='main_pagination'>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={total_pages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePagination}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </section>
      {show_edit && <EditUsermodal
        show={show_edit}
        handleClose={() => { setShowEdit(false); setShouldRefresh(true) }}
        user={current_user}
      />}
      {show_change_password &&
        <ChangePasswordmodal
          show={show_change_password}
          handleClose={() => { setShowChangePassword(false); setShouldRefresh(true) }}
          user={current_user}
        />}
      {show_delete &&
        <DeleteUserModal
          show={show_delete}
          handleClose={() => { setShowDelete(false); setShouldRefresh(true) }}
          user={current_user}
        />}
      {show_new_user &&
        <NewUserModal
          show={show_new_user}
          handleClose={() => { setShowNewUser(false); setShouldRefresh(true) }}
        />}
    </>
  )
}

export default Home
