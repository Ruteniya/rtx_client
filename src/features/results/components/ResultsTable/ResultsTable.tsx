import React, { useEffect, useState } from 'react'
import { Button, Flex, message, Table, Typography } from 'antd'
import { Pto } from 'rtxtypes'
import { ColumnType } from 'antd/es/table'
import { TablePaginationConfig } from 'antd'
import { useLazyGetResultsCsvQuery } from '@api/api-results'

interface Props {
  results: Pto.Results.ResultPopulated[]
  nodes: Pto.Nodes.NodeSmall[]
  pagination?: false | TablePaginationConfig
  sortBy?: 'groupName' | 'totalPoints'
  sortOrder?: 'ASC' | 'DESC'
  onSortChange?: (sortBy?: 'groupName' | 'totalPoints', sortOrder?: 'ASC' | 'DESC') => void
}

const ResultsTable: React.FC<Props> = ({ results, nodes, pagination, sortBy, sortOrder, onSortChange }) => {
  const [updatedAt, setUpdatedAt] = useState('')
  const [getResultsCsv, { isLoading: isCsvLoading }] = useLazyGetResultsCsvQuery()

  useEffect(() => {
    const anyUpdatedAt = results.flatMap((team) => team.results).find((data) => data?.updatedAt)?.updatedAt

    if (anyUpdatedAt) {
      setUpdatedAt(
        new Date(anyUpdatedAt).toLocaleString('uk-UA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      )
    }
  }, [results])

  const handleTableChange = (_: unknown, __: unknown, sorter: unknown) => {
    if (!onSortChange) return
    const sorters = Array.isArray(sorter) ? sorter : sorter ? [sorter] : []
    const active = sorters.find(
      (s: { order?: 'ascend' | 'descend' | null }) => s.order === 'ascend' || s.order === 'descend'
    )
    if (!active) {
      onSortChange(undefined, undefined)
      return
    }
    const { field, order } = active as { field?: string; order?: 'ascend' | 'descend' }
    const backendField = field === 'total' ? 'totalPoints' : field
    if (backendField !== 'groupName' && backendField !== 'totalPoints') return
    onSortChange(backendField, order === 'ascend' ? 'ASC' : 'DESC')
  }

  const columns: ColumnType<any>[] = [
    {
      title: 'Команда',
      dataIndex: 'groupName',
      key: 'groupName',
      fixed: 'left',
      sorter: true,
      sortOrder: sortBy === 'groupName' ? (sortOrder === 'ASC' ? 'ascend' : 'descend') : undefined
    },
    {
      title: 'Категорія',
      dataIndex: 'categoryName',
      key: 'categoryName',
      fixed: 'left'
    },
    ...nodes?.map((node: Pto.Nodes.NodeSmall) => ({
      title: (
        <>
          <span
            className="inline-block h-3 w-3 rounded-full border border-gray-300 cursor-pointer mr-1"
            style={{ backgroundColor: node.color }}
          />
          <span>{node.name}</span>
        </>
      ),
      dataIndex: node.id,
      key: node.id
    })),
    {
      title: 'Сума',
      dataIndex: 'total',
      key: 'total',
      fixed: 'right',
      sorter: true,
      sortOrder: sortBy === 'totalPoints' ? (sortOrder === 'ASC' ? 'ascend' : 'descend') : undefined
    }
  ]

  const groupedData = results.map((team) => {
    const row: any = {
      groupName: team.name,
      categoryName: team.category.name,
      total: team.results.reduce((sum, r) => sum + (r.earnedPoints || 0), 0) // Сума балів
    }

    team.results.forEach((data) => {
      row[data.nodeId] = data.earnedPoints
    })

    return row
  })

  const exportToCSV = async () => {
    try {
      const { url } = await getResultsCsv().unwrap()
      window.open(url, '_blank')
      message.success('CSV завантажено')
    } catch {
      message.error('Не вдалося завантажити CSV')
    }
  }

  return (
    <>
      <Flex justify="space-between">
        <Typography.Text className="min-w-[150px]">{updatedAt}</Typography.Text>
        <Button onClick={exportToCSV} loading={isCsvLoading} className="mb-3">
          Завантажити всі результати в csv
        </Button>
      </Flex>

      <Table
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        columns={columns}
        dataSource={groupedData}
        rowKey="groupName"
        bordered
        pagination={pagination}
        onChange={handleTableChange}
      />
    </>
  )
}

export default ResultsTable
