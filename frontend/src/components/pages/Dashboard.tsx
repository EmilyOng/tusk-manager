import LoadingBar from 'components/molecules/LoadingBar'
import Notification, { NotificationType } from 'components/molecules/Notification'
import BoardTask from 'components/organisms/BoardTask'
import './Dashboard.css'
import { useCategories } from 'composables/category'

function Dashboard() {
  const { loading, error, categories } = useCategories()

  if (loading) {
    return <LoadingBar />
  }
  if (error) {
    return <Notification type={NotificationType.Error} message={error} />
  }
  return (
    <div className="container categories">
      {categories.map(category => <BoardTask key={category.id} category={category} />)}
    </div>
  )
}

export default Dashboard
