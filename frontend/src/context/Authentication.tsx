import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { RequestAPI } from 'api/request'
import { User, AuthUser } from 'types/user'
import LoadingBar from 'components/organisms/LoadingBar'

type noop = (res: any) => void

interface AuthContextType {
  user: User | null
  signUp: (user: AuthUser, onComplete: noop, onError: noop) => void
  login: (user: Omit<AuthUser, 'name'>, onComplete: noop, onError: noop) => void
  logout: (onComplete: noop, onError: noop) => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC = ({ children }) => {
  const Request = new RequestAPI()
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)

  function signUp(user: AuthUser, onComplete: noop, onError: noop) {
    Request.post('http://localhost:5000/api/auth/signup', {
      Name: user.name,
      Email: user.email,
      Password: user.password,
    }).then((res) => {
      if (res.error) {
        onError(res)
      } else {
        setUser({
          name: user.name,
          email: user.email,
        })
        onComplete(res)
      }
    })
  }

  function login(
    user: Omit<AuthUser, 'name'>,
    onComplete: noop,
    onError: noop
  ) {
    Request.post('http://localhost:5000/api/auth/login', {
      Email: user.email,
      Password: user.password,
    }).then((res) => {
      if (res.error) {
        onError(res)
      } else {
        setUser({
          name: res.Name,
          email: res.Email,
        })
        onComplete(res)
      }
    })
  }

  function logout() {
    console.log('logout')
  }

  const memo: AuthContextType = useMemo(
    () => ({
      user: user || null,
      signUp,
      login,
      logout,
    }),
    [user]
  )

  useEffect(() => {
    setLoading(true)
    Request.get('http://localhost:5000/api/auth/token')
      .then((res) => {
        if (res.error) {
          return
        }
        setUser({
          name: res.Name,
          email: res.Email,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={memo}>
      {loading ? <LoadingBar /> : (children as JSX.Element)}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export const RequireAuth: React.FC = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth" state={{ from: '/' }} />
  }

  return children as JSX.Element
}
