import { Route, Routes } from 'react-router-dom'
import Authentication from 'components/pages/Authentication'
import HomeDashboard from 'components/pages/HomeDashboard'
import TaskDashboard from 'components/pages/TaskDashboard'
import DashboardLayout from 'components/layouts/DashboardLayout'
import { RequireAuth } from 'context/Authentication'

function App() {
  return (
    <RequireAuth>
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/:id" element={<TaskDashboard />} />
        </Route>
      </Routes>
    </RequireAuth>
  )
}

export default App
