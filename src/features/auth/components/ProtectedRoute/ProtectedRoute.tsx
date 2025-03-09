import { Navigate, Outlet } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import { useAppSelector } from '@hooks/useSelector'
import { Pto } from '@rtx/types'

interface ProtectedRouteProps {
  allowedRoles?: Pto.Users.UserRoleType[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useAppSelector((state) => state.user.user)

  console.log('user in ProptectedRout: ', user)

  if (!user || !user.groupId) {
    console.log('redireact to login')

    return <Navigate to={AppRoutes.login} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={AppRoutes.main} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
