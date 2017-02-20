import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Link, Redirect, withRouter} from 'react-router-dom'

import Login from './Login'
import {firebaseAuth} from './Firebase'
import './index.css'

const Home = () => <h3 className='Home'>Home</h3>
const Dashboard = () => <h3 className='Dashboard'>Super Secret Dashboard</h3>

const ProtectedRoute = ({ component, authed, ...rest }) => {
  return (
    <Route {...rest} render={(props) => {
      if (authed) {
        return React.createElement(component, props)
      } else {
        return (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
        )
      }
    }
  } />
  )
}

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      authed: false,
      loading: true
    }
    this.AuthComponent = this.AuthComponent.bind(this)
  }

  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      this.setState({
        authed: user !== null,
        loading: false
      })
    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  AuthComponent () {
    const Auth = withRouter(({ push }) => (
        this.state.authed ? (
          <p>
            Welcome {firebaseAuth().currentUser.email}!
              <button onClick={() => {
                firebaseAuth().signOut()
                push('/')
              }}>Sign out</button>
          </p>
        ) : (
          <p>You are not logged in.</p>
        )
      ))
    return Auth
  }

  render () {
    const {authed, loading} = this.state
    if (loading) {
      return <h3> Loading </h3>
    }

    const Auth = this.AuthComponent()
    return (
      <Router>
        <div className='App'>
          <div className='Header'>
            <Auth />
            <ul>
              <li><Link to='/home'>Home (public)</Link></li>
              <li><Link to='/dashboard'>Dashboard (protected)</Link></li>
            </ul>
          </div>
          <div className='Content'>
            <Route path='/home' component={Home} />
            <Route path='/login' render={props => <Login authed={authed} {...props} />} />
            <ProtectedRoute path='/dashboard' component={Dashboard} authed={authed} />
          </div>
        </div>
      </Router>
    )
  }
}

