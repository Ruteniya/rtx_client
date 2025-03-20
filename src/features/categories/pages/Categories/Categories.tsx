import { Divider, Flex } from 'antd'
import { CategoriesTable, ManageCategoriesMenu } from '@features/categories/components'

const Categories = () => {
  return (
    <div>
      <ManageCategoriesMenu />
      <Divider />
      <Flex className="overflow-auto">
        <CategoriesTable />
      </Flex>
    </div>
  )
}

export default Categories
