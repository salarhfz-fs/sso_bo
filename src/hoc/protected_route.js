import { Redirect, Route } from "react-router"
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const is_logged_in = useSelector(state => state.is_logged_in)
  return (
    <Route {...rest}
      render={props => {
        if (is_logged_in) {
          return <Component {...props} />
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: props.location,
              }}
            />
          )
        }
      }}
    />
  )
}
export default ProtectedRoute
