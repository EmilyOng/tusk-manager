import BoardTask from 'components/organisms/BoardTask'
import { Category } from 'types/category'
import './Dashboard.css'

// sample
const categories: Category[] = [...Array(10)].map((_, idx) => {
  return {
    id: idx.toString(),
    name: `Test-${idx.toString()}`,
    color: ''
  }
})

function Dashboard() {
  return (
    <div className="container categories">
      {categories.map(category => <BoardTask key={category.id} category={category} />)}
    </div>
  )
}

export default Dashboard
