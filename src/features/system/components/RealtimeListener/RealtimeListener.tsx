import { settings } from '../../../../settings'
import { apiSlice } from '@api/api-slice'
import { useAppSelector } from '@hooks/useSelector'
import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAppDispatch } from '@hooks/useDispatch'
import { Pto } from 'rtxtypes'
import { message } from 'antd'

const RealtimeListener = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.user)

  useEffect(() => {
    const isSystemAdmin = user?.role === Pto.Users.UserRole.SystemAdmin
    if (!user?.id || !isSystemAdmin) return

    const socket: Socket = io(`${settings.backendHost}/realtime`, {
      withCredentials: true
    })

    socket.on('results.generated', () => {
      dispatch(apiSlice.util.invalidateTags(['Results']))
      message.success('Результати згенеровано')
    })

    return () => {
      socket.disconnect()
    }
  }, [dispatch, user?.id, user?.role])

  return null
}

export default RealtimeListener
