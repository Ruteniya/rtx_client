import { AllUsersTable } from '@features/users/components'
import { Divider, Flex, Typography } from 'antd'

const Users = () => {
  return (
    <>
      <Typography.Title level={4}>Користувачі</Typography.Title>
      <Divider />

      <Flex justify="center">
        <AllUsersTable />
      </Flex>
    </>
  )
}

export default Users
