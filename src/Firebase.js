import firebase from 'firebase'

firebase.initializeApp({
  apiKey: 'AIzaSyBAb4AQG4jxyR_YmUz3pm0wqC9SVnpa2lw',
  authDomain: 'routing-bddc6.firebaseapp.com',
  databaseURL: 'https://routing-bddc6.firebaseio.com'
})

export const firebaseAuth = firebase.auth
