import { Route, Routes } from 'react-router-dom'
import Authentication from 'components/pages/Authentication'
import Dashboard from 'components/pages/Dashboard'
import { RequireAuth } from 'context/Authentication'

function App() {
  return (
    <RequireAuth>
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </RequireAuth>
  )
}

export default App
