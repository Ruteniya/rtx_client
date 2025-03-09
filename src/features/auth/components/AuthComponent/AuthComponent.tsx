import { useAddToGroupMutation } from '@api/api-auth'
import { useLazyGetCurrentUserQuery } from '@api/api-users'
import { AppRoutes } from '@app/app-routes'
import { setUser } from '@app/user-slice'
import { useDefaultPage } from '@hooks/defaultPage'
import { Pto } from '@rtx/types'
import GroupService from '@services/group.service'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AuthComponent = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [addToGroup] = useAddToGroupMutation()
  const [getCurrentUser] = useLazyGetCurrentUserQuery()

  const { navigateToDefaultPage } = useDefaultPage()

  const handleUserValid = (user: Pto.Users.User) => {
    dispatch(setUser(user))
    GroupService.setGroupId(user.groupId || '')
    navigateToDefaultPage(user)
  }

  // Function to fetch current user and navigate to the default page
  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser().unwrap()
      handleUserValid(user)
    } catch (_) {
      navigate(AppRoutes.login)
    }
  }

  useEffect(() => {
    //callback from google (userId and groupId should be in params)
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')
    let groupId = urlParams.get('groupId')

    const fetchData = async () => {
      //default case
      if (!userId) {
        await fetchCurrentUser()
        return
      }

      if (!groupId) {
        groupId = GroupService.getGroupId()

        if (groupId) {
          await addToGroup({ groupId })
            .unwrap()
            .then((user: Pto.Users.User) => {
              handleUserValid(user)
            })
            .catch((error) => {
              navigate(AppRoutes.login)
              console.error(error)
            })
        } else {
          navigate(AppRoutes.login)
        }
      } else {
        await fetchCurrentUser()
        return
      }
    }
    fetchData()
  }, [dispatch])

  return <></>
}

export default AuthComponent
