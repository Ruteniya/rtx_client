import { Button, Dropdown, Flex, Input, Select } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import { Pto } from 'rtxtypes'
import { AnswersFilters } from '@features/answers/types'

interface Props {
  processed?: boolean
  filters: AnswersFilters
  groups: Pto.Groups.Group[] | null
  nodes: Pto.Nodes.NodeSmall[] | null
  isLoading: boolean
  onChange: (filters: AnswersFilters) => void
  getSearchDefaultValue?: string
  showCorrectFilter?: boolean
  onGroupSearch?: (value: string) => void
  groupSearchValue?: string
}

const AnswersFiltersBar = ({
  processed,
  filters,
  groups,
  nodes,
  isLoading,
  onChange,
  getSearchDefaultValue,
  showCorrectFilter = false,
  onGroupSearch,
  groupSearchValue
}: Props) => {
  const dropdownContent = (
    <Flex
      key={processed ? 'processed' : 'unprocessed'}
      vertical
      gap={8}
      className="bg-white rounded-lg shadow-lg m-2 w-[280px]"
      onClick={(e) => e.stopPropagation()}
    >
      {groups && (
        <Select
          mode="multiple"
          placeholder="Команди"
          loading={isLoading}
          value={filters.groupIds} // controlled value
          onChange={(value: string[]) => onChange({ ...filters, groupIds: value })}
          options={groups.map((group) => ({
            label: group.name,
            value: group.id
          }))}
          onSearch={onGroupSearch}
          searchValue={groupSearchValue || undefined} // preserves typed search
          optionFilterProp="label" // optional: filter by label
          allowClear
        />
      )}

      {nodes && (
        <Select
          mode="multiple"
          allowClear
          placeholder="Точки"
          loading={isLoading}
          defaultValue={filters.nodeIds}
          onChange={(value: string[]) => onChange({ ...filters, nodeIds: value })}
          options={nodes.map((node) => ({
            label: (
              <div className="flex items-center gap-2">
                {node.color && (
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: node.color }}
                  />
                )}
                <span>{node.name}</span>
              </div>
            ),
            value: node.id
          }))}
        />
      )}

      {showCorrectFilter && (
        <Select
          allowClear
          placeholder="Оцінка відповіді"
          defaultValue={filters.correct}
          onChange={(value?: boolean) => onChange({ ...filters, correct: value })}
          options={[
            { label: 'Правильні', value: true },
            { label: 'Неправильні', value: false }
          ]}
        />
      )}
    </Flex>
  )

  return (
    <Flex gap={12} align="center">
      <Input.Search
        key={filters.searchText}
        defaultValue={getSearchDefaultValue}
        placeholder="Шукати відповідь"
        allowClear
        onSearch={(value) => onChange({ ...filters, searchText: value })}
        className="w-[250px] [&_.ant-input-search-button]:!w-[42px] max-w-[300px]"
      />

      <Dropdown
        key={processed ? 'processed' : 'unprocessed'}
        trigger={['click']}
        placement="bottomRight"
        dropdownRender={() => dropdownContent}
      >
        <Button icon={<FilterOutlined />} className="flex items-center gap-1">
          Фільтри
        </Button>
      </Dropdown>
    </Flex>
  )
}

export default AnswersFiltersBar
