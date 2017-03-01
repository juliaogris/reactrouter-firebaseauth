// This is a React.JS app demostrating
//  * authentication with Firebase
//  * React Router for public and protected routes.
//
// Execute this file via:
// $ npm install -g create-react-app
// $ create-react-app sample-app
// $ cd sample-app
// $ npm install react-router-dom@next firebase --save
// $ cp -f <this_file.js> src/App.js
// $ npm start

import React, { Component } from 'react'
import {BrowserRouter as Router, Route, NavLink, Redirect} from 'react-router-dom'
import firebase from 'firebase'

const Home = () => <h1>Public Home</h1>
const Secret = () => <h1>Protected Secret</h1>

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      authed: false,
      loading: true,
      error: null
    }
    this.setLoading = this.setLoading.bind(this)
    this.setError = this.setError.bind(this)
  }

  componentDidMount () {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        authed: user !== null,
        loading: false
      })
    })
  }

  componentWillUnmount () {
    this.removeListener()
  }

  setLoading (loading) {
    this.setState({loading, error: null})
  }

  setError (error) {
    this.setState({error, loading: false})
  }

  render () {
    const {authed, loading, error} = this.state
    if (loading) {
      return <h1>Loading</h1>
    }

    const logout = () => { firebase.auth().signOut() }
    return (
      <Router>
        <div className='app'>
          <nav>
            <NavLink to='/home' activeClassName='active'>Home</NavLink>
            <NavLink to='/secret' activeClassName='active'>Secret</NavLink>
            {authed && <button onClick={logout}>Log out</button>}
          </nav>
          {error && <div className='error'>{error.message}</div>}
          <div>
            <Route path='/home' component={Home} />
            <ProtectedRoute path='/secret' component={Secret} authed={authed} />
            <Route path='/login' render={(props) => (
              <Login
                authed={authed}
                setLoading={this.setLoading}
                setError={this.setError} {...props}
              />)}
            />
          </div>
        </div>
      </Router>
    )
  }
}

const Login = ({authed, setLoading, setError, location}) => {
  let email = null
  let password = null

  const login = () => {
    setLoading(true)
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
      .then(() => { setLoading(false) })
      .catch((error) => { setError(error) })
  }

  const signup = () => {
    setLoading(true)
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
      .then(() => { setLoading(false) })
      .catch((error) => { setError(error) })
  }

  const from = location.state.from || { pathname: '/' }
  if (authed) {
    return <Redirect to={from} />
  }

  return (
    <form className='login' action='login'>
      <input placeholder='email@example.com' type='email' ref={c => (email = c)} />
      <input placeholder='your password' type='password' ref={c => (password = c)} />
      <div className='button-row'>
        <button onClick={login}> Log in </button>
        <button onClick={signup}> Sign up </button>
      </div>
    </form>
  )
}

const ProtectedRoute = ({ component, authed, ...rest }) => {
  const renderProtectedRoute = (props) => {
    if (authed) {
      return React.createElement(component, props)
    } else {
      const state = { from: props.location }
      return <Redirect to={{ pathname: '/login', state }} />
    }
  }
  return <Route {...rest} render={renderProtectedRoute} />
}

// Replace with your firebase config from
// https://console.firebase.google.com/project/<your_poject_id>
firebase.initializeApp({
  apiKey: 'AIzaSyBAb4AQG4jxyR_YmUz3pm0wqC9SVnpa2lw',
  authDomain: 'routing-bddc6.firebaseapp.com',
  databaseURL: 'https://routing-bddc6.firebaseio.com'
})
