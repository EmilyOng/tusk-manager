import { Route, Routes } from 'react-router-dom'
import DashboardLayout from 'components/layouts/DashboardLayout'
import RequireAuth from 'components/organisms/RequireAuth'
import Authentication from 'components/pages/Authentication'
import BoardTagsDashboard from 'components/pages/BoardTagsDashboard'
import HomeDashboard from 'components/pages/HomeDashboard'
import TaskDashboard from 'components/pages/TaskDashboard'

function App() {
  return (
    <RequireAuth>
      <Routes>
        <Route path="/auth" element={<Authentication />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/:id" element={<TaskDashboard />} />
          <Route path="/:id/tags" element={<BoardTagsDashboard />} />
        </Route>
      </Routes>
    </RequireAuth>
  )
}

export default App
