import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import 'bulma/css/bulma.min.css'

import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from 'context/Authentication'

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
