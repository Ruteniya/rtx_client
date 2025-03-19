import { useAddToGroupMutation } from '@api/api-auth'
import { useLazyGetCurrentUserQuery } from '@api/api-users'
import { AppRoutes } from '@app/app-routes'
import { setUser } from '@app/user-slice'
import { useDefaultPage } from '@hooks/defaultPage'
import { Pto } from '@rtx/types'
import { StorageKey, StorageService } from '@services/group.service'
import { message } from 'antd'
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
    if (!user.groupId) {
      navigate(AppRoutes.login)
      message.error('Команду не знайдено')
      return
    }
    dispatch(setUser(user))
    StorageService.setItem(StorageKey.GroupId, user.groupId || '')
    StorageService.setItem(StorageKey.UserId, user.id)
    navigateToDefaultPage(user)
  }

  // Function to fetch current user and navigate to the default page
  const fetchCurrentUser = async () => {
    await getCurrentUser()
      .unwrap()
      .then((user) => {
        handleUserValid(user)
      })
      .catch(() => {
        console.log('redirect to login')
        navigate(AppRoutes.login)
      })
  }

  useEffect(() => {
    //callback from google (userId and groupId should be in params)
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')
    let groupId = urlParams.get('groupId')

    const fetchData = async () => {
      //default case
      if (!userId?.length) {
        await fetchCurrentUser()
        return
      }

      if (!groupId) {
        groupId = StorageService.getItem(StorageKey.GroupId)

        if (groupId) {
          await addToGroup({ groupId })
            .unwrap()
            .then((user: Pto.Users.User) => {
              handleUserValid(user)
            })
            .catch((error) => {
              console.log('redirect to login')
              navigate(AppRoutes.login)
              console.error(error)
            })
        } else {
          console.log('redirect to login')

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
