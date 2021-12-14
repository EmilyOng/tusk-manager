import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthAPI } from 'api/auth'
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
  const Auth = new AuthAPI()
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)

  function signUp(user: AuthUser, onComplete: noop, onError: noop) {
    Auth.signUp(user).then((res) => {
      if (res.error) {
        onError(res)
      } else {
        setUser(res)
        onComplete(res)
      }
    })
  }

  function login(
    user: Omit<AuthUser, 'name'>,
    onComplete: noop,
    onError: noop
  ) {
    Auth.login(user).then((res) => {
      if (res.error) {
        onError(res)
      } else {
        setUser(res)
        onComplete(res)
      }
    })
  }

  function logout() {
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
    Auth.getAuthUser()
      .then((res) => {
        if (res.error) {
          return
        }
        setUser(res)
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
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true })
    }
  }, [user])

  return children as JSX.Element
}
