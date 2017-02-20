import React, { Component, PropTypes } from 'react'
import {Redirect} from 'react-router-dom'

import {firebaseAuth} from './Firebase'

export default class Login extends Component {
  constructor () {
    super()
    this.state = {
      errorMessage: null,
      loading: false
    }
    this.login = this.login.bind(this)
    this.signup = this.signup.bind(this)
  }

  signup () {
    const email = this.emailInput.value
    const password = this.passwordInput.value
    this.setState({ loading: true })
    firebaseAuth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          errorMessage: null,
          loading: false
        })
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message,
          loading: false
        })
      })
  }

  login () {
    const email = this.emailInput.value
    const password = this.passwordInput.value
    this.setState({ loading: true })
    firebaseAuth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          errorMessage: null,
          loading: false
        })
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message,
          loading: false
        })
      })
  }

  render () {
    const from = this.props.location.state.from || { pathname: '/' }

    if (this.props.authed) {
      return (
        <Redirect to={from} />
      )
    }

    if (this.state.loading) {
      return (
        <div className='Login'>Authenticating with Firebase</div>
      )
    }

    const { errorMessage } = this.state
    return (
      <div className='Login'>
        {errorMessage && <p className='Error'>{errorMessage}</p>}
        <p>Authenticate to view <pre>{from.pathname}</pre></p>
        <input
          placeholder='email@example.com'
          type='email'
          ref={(input) => { this.emailInput = input }}
        />
        <input
          placeholder='your password'
          type='password'
          ref={(input) => { this.passwordInput = input }}
        />
        <button onClick={this.login}>Log in</button>
        <button onClick={this.signup}>Sign up</button>
      </div>
    )
  }
}

Login.propTypes = {
  location: PropTypes.object.isRequired
}
