import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import { Pto } from '@rtx/types'

export const useDefaultPage = () => {
  const navigate = useNavigate()

  // Function to navigate based on user role
  const navigateToDefaultPage = (user: Pto.Users.User) => {
    let url: string

    switch (user.role) {
      case 'admin':
      case 'systemAdmin':
        url = AppRoutes.game
        break
      default:
        url = AppRoutes.about
        break
    }
    navigate(url)
  }

  return { navigateToDefaultPage }
}
