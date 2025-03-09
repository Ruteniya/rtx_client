import { useGetGameQuery } from '@api/api-games'
import { Flex, Spin } from 'antd'
import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { setGame } from '@app/user-slice'
import { useAppDispatch } from '@hooks/useDispatch'

const DataRoute = () => {
  const dispatch = useAppDispatch()
  const { data, isLoading } = useGetGameQuery()

  useEffect(() => {
    if (data) {
      dispatch(setGame(data))
    }
  }, [data, dispatch])

  if (isLoading) {
    return (
      <Flex className="w-screen h-dvh lg:h-screen" justify="center" align="center">
        <Spin spinning={true} size="large" />
      </Flex>
    )
  }

  return (
    <Suspense
      fallback={
        <Flex className="w-screen h-dvh lg:h-screen" justify="center" align="center">
          <Spin spinning={true} size="large" />
        </Flex>
      }
    >
      <Outlet />
    </Suspense>
  )
}

export default DataRoute
