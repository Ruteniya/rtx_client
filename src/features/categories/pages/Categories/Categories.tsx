import { Divider, Flex } from 'antd'
import { CategoriesTable, ManageCategoriesMenu } from '@features/categories/components'

const Categories = () => {
  return (
    <div>
      <ManageCategoriesMenu />
      <Divider />
      <Flex justify="center">
        <CategoriesTable />
      </Flex>
    </div>
  )
}

export default Categories
