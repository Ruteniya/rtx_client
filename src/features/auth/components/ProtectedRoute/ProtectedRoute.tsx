import { Navigate, Outlet } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import { useAppSelector } from '@hooks/useSelector'
import { Pto } from 'rtxtypes'

interface ProtectedRouteProps {
  allowedRoles?: Pto.Users.UserRoleType[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = useAppSelector((state) => state.user.user)

  if (!user || !user.groupId || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to={AppRoutes.main} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
