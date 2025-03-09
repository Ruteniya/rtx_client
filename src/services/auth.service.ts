import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate instead of useHistory
import { useAddToGroupMutation } from '@api/api-auth'
import GroupService from './group.service'
import { AppRoutes } from '@app/app-routes'
import { Pto } from '@rtx/types'

const AuthProtectedComponent = () => {
  const navigate = useNavigate() // Replace history with navigate
  const [addToGroup] = useAddToGroupMutation()

  useEffect(() => {
    // Extract userId and groupId from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')
    let groupId = urlParams.get('groupId')

    if (userId) {
      // If groupId is null or undefined but exists in localStorage, send the request
      if (!groupId) {
        groupId = GroupService.getGroupId()
      }

      if (groupId) {
        // Send the add to group request
        addToGroup({ userId, groupId })
          .unwrap()
          .then((user) => {
            // Handle successful response, store user info, etc.
            // Redirect to home or dashboard
            console.log(Pto.Users2.Mock)
            const fun = (dsfsdf: Pto.Users.UserRole) => {
              console.log(dsfsdf)
            }
            fun(Pto.Users.UserRole.Admin)
            if (user?.role === 'user') {
              navigate(AppRoutes.about) // Use navigate instead of history.push
            } else {
              navigate(AppRoutes.game) // Use navigate instead of history.push
            }
            // navigate(AppRoutes.about) // Use navigate instead of history.push
          })
          .catch((error) => {
            navigate(AppRoutes.login)
            console.error(error)
          })
      } else {
        // If no groupId available, handle the case (maybe redirect to group selection page)
        navigate(AppRoutes.login)
      }
    } else {
      // If no userId, redirect to login page
      navigate(AppRoutes.login)
    }
  }, [navigate, addToGroup])

  return null
}

export default AuthProtectedComponent
