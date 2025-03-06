import { useGetGameQuery } from '@api/api-games'
import { Flex, Spin } from 'antd'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

const DataRoute = () => {
  const { data, isLoading } = useGetGameQuery()

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
      <Outlet context={{ game: data, role: undefined }} />
    </Suspense>
  )
}

export default DataRoute
