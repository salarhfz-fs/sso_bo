import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import './404.css'

const NotFound = () =>
  <>
    <h4 id='not_found'>
      Sorry! The page you're looking for does not exist :(
    </h4>
    <p className='go_back'><Link to='/home'><Button>Go back to home</Button></Link></p>
  </>
export default NotFound
