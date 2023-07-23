import React from 'react'

import ReactDOM from 'react-dom/client'
import { Provider } from 'urql'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { App } from './App/App'
import { SignIn } from './SignIn/SignIn'
import { UserProvider } from './hooks/useUser'
import { init } from './init'
import reportWebVitals from './reportWebVitals'
import { init_match_system_color_mode } from './system-colors'

init_match_system_color_mode()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

init().then((app) => {
  root.render(
    <React.StrictMode>
      {app ? (
        <UserProvider value={app.user}>
          <Provider value={app.gql_client}>
            <App />
          </Provider>
        </UserProvider>
      ) : (
        <SignIn />
      )}
    </React.StrictMode>
  )
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
