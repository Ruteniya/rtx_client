import { Button, Dropdown, Flex, Input, message, Modal, Select, Table, Tag, Tooltip } from 'antd'
import { useDeleteGroupMutation, useGetGroupsQuery, useLazyGetGroupsCsvQuery } from '@api/groups-api'
import { useGetCategoriesQuery } from '@api/api-categories'

import { Pto } from 'rtxtypes'
import { DeleteOutlined, DownloadOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import useModal from '@hooks/useModal'
import ManageGroupsModal from '@features/groups/components/ManageGroupModal'
import { useNavigate } from 'react-router-dom'
import { AppRoutes } from '@app/app-routes'
import { usePagination } from '@hooks/usePagination'
import { ARRAY_DELIMITER, useQueryParams } from '@hooks/useQueryParam'

export type GroupsFilters = {
  searchText?: string
  categoryIds?: string[]
  hasEmailResults?: boolean
}

enum PaginationKeys {
  Search = 'searchText',
  CategoryIds = 'categoryIds',
  HasEmailResults = 'hasEmailResults'
}

const pageKey: keyof Pto.App.Pagination = 'page'

type GroupsTableProps = {
  selection?: {
    selectedGroupIds: string[]
    onSelectGroupIds: (ids: string[]) => void
  }
}

const GroupsTable = ({ selection }: GroupsTableProps) => {
  const { page, size, onPageSizeChange } = usePagination(10)
  const { getParamArray, setParams, getParam } = useQueryParams()
  const filters: GroupsFilters & { hasEmailResults?: boolean } = useMemo(
    () => ({
      searchText: (getParam(PaginationKeys.Search) as GroupsFilters['searchText']) || undefined,
      categoryIds: getParamArray(PaginationKeys.CategoryIds).length
        ? (getParamArray(PaginationKeys.CategoryIds) as GroupsFilters['categoryIds'])
        : undefined,
      hasEmailResults:
        getParam(PaginationKeys.HasEmailResults) === 'true'
          ? true
          : getParam(PaginationKeys.HasEmailResults) === 'false'
          ? false
          : undefined
    }),
    [
      getParam(PaginationKeys.Search),
      getParamArray(PaginationKeys.CategoryIds),
      getParam(PaginationKeys.HasEmailResults)
    ]
  )

  const { data, isLoading } = useGetGroupsQuery({ page, size, ...filters })
  const { data: categoriesData } = useGetCategoriesQuery()
  const categories = categoriesData?.items ?? []
  const [deleteGroup] = useDeleteGroupMutation()
  const [getGroupsCsv, { isLoading: isCsvLoading }] = useLazyGetGroupsCsvQuery()
  const { openModal: openEditModal, isVisible: isEditModalVisible, closeModal: closeEditModal } = useModal()
  const [currentGroup, setCurrentGroup] = useState<Pto.Groups.Group>()
  const navigate = useNavigate()
  const groups = data?.items

  const handleFiltersChange = (newFilters: GroupsFilters) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      const currentParam = Array.isArray(value) ? getParamArray(key) : getParam(key)
      if (currentParam?.toString() !== value?.toString()) {
        setParams({
          [pageKey]: '1',
          [key]: Array.isArray(value) ? value.join(ARRAY_DELIMITER) : value?.toString() ?? ''
        })
      }
    })
  }

  const pagination = {
    current: page,
    onChange: (page: number, pageSize: number) => {
      onPageSizeChange(page, pageSize)
    },
    total: data?.total ?? 0,
    pageSizeOptions: [2, 5, 10, 15, 20],
    pageSize: size,
    showSizeChanger: true
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Видалити команду?',
      onOk: async () => {
        await deleteGroup(id).then(message.success('Команду видалено'))
      }
    })
  }

  const handleEdit = (record: Pto.Groups.Group) => {
    setCurrentGroup(record)
    openEditModal()
  }

  const exportToCSV = async () => {
    try {
      await getGroupsCsv()
        .unwrap()
        .then(({ url }) => {
          window.open(url, '_blank')
          message.success('CSV завантажено')
        })
        .catch(() => {
          message.error('Не вдалося завантажити CSV')
        })
    } catch {
      message.error('Не вдалося завантажити CSV')
    }
  }

  const columns = [
    {
      title: 'Назва команди',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Кількість учасників',
      dataIndex: 'numberOfParticipants',
      key: 'numberOfParticipants'
    },
    {
      title: 'Категорія',
      dataIndex: 'category',
      key: 'category',
      render: (category: Pto.Categories.Category) => (
        <Tag color={category.color || 'grey'} className="text-white font-bold">
          {category?.name || 'Невизначено'}
        </Tag>
      )
    },
    {
      title: 'Email відправлення',
      dataIndex: 'emailResults',
      key: 'emailResults',
      render: (emailResults: Pto.Groups.GroupEmailResult[]) => {
        if (!emailResults || !emailResults.length) return 0
        const tooltipContent = emailResults
          .map((r) => `${r.email} — ${new Date(r.createdAt).toLocaleString()}`)
          .join('\n')
        return (
          <Tooltip title={<pre className="whitespace-pre-wrap">{tooltipContent}</pre>}>
            <Tag color="blue">{emailResults.length}</Tag>
          </Tooltip>
        )
      }
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: unknown, record: Pto.Groups.Group) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Редагувати',
                icon: <EditOutlined />,
                onClick: (_) => {
                  handleEdit(record)
                }
              },
              {
                key: 'delete',
                label: 'Видалити',
                icon: <DeleteOutlined />,
                onClick: () => handleDelete(record.id)
              }
            ],
            onClick: (e) => e.domEvent.stopPropagation()
          }}
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      )
    }
  ]

  const rowSelection = selection
    ? {
        selectedRowKeys: selection?.selectedGroupIds ?? [],
        onChange: (selectedRowKeys: React.Key[]) => {
          selection?.onSelectGroupIds(selectedRowKeys as string[])
        }
      }
    : undefined

  return (
    <>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }} wrap="wrap" gap={8}>
        <Flex wrap="wrap" gap={8} align="center">
          <Input.Search
            defaultValue={getParam(PaginationKeys.Search) ?? ''}
            placeholder="Шукати команду"
            allowClear
            onSearch={(value) => handleFiltersChange({ ...filters, searchText: value })}
            style={{ width: 250 }}
            className="[&_.ant-input-search-button]:!w-[42px]"
          />
          <Select
            mode="multiple"
            allowClear
            placeholder="Категорії"
            style={{ minWidth: 200 }}
            value={filters.categoryIds ?? []}
            onChange={(value: string[]) =>
              handleFiltersChange({ ...filters, categoryIds: value.length ? value : undefined })
            }
            options={categories.map((cat) => ({
              label: (
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-gray-300 shrink-0"
                    style={{ backgroundColor: cat.color ?? 'grey' }}
                  />
                  {cat.name}
                </span>
              ),
              value: cat.id
            }))}
          />
          <Select
            placeholder="Email відправлення"
            style={{ minWidth: 200 }}
            value={filters.hasEmailResults === undefined ? undefined : filters.hasEmailResults ? 'true' : 'false'}
            onChange={(value: string) => {
              handleFiltersChange({
                ...filters,
                hasEmailResults: value === 'true' ? true : value === 'false' ? false : undefined
              })
            }}
            options={[
              { label: 'Усі', value: '' },
              { label: 'Є email', value: 'true' },
              { label: 'Нема email', value: 'false' }
            ]}
          />
        </Flex>

        <Button icon={<DownloadOutlined />} onClick={exportToCSV} loading={isCsvLoading}>
          Завантажити CSV
        </Button>
      </Flex>
      <Table
        rowSelection={rowSelection}
        className="!max-w-[850px] min-w-fit sm:min-w-[80%]"
        dataSource={groups || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={pagination}
        onRow={(record: Pto.Groups.Group) => {
          return { onClick: () => navigate(`${AppRoutes.groups}/${record.id}`) }
        }}
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
      />
      <ManageGroupsModal isVisible={isEditModalVisible} closeModal={closeEditModal} groupData={currentGroup} />
    </>
  )
}

export default GroupsTable
