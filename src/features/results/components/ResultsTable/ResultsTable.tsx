import React, { useEffect, useState } from 'react'
import { Button, Flex, Table, Typography } from 'antd'
import { Pto } from 'rtxtypes'
import { ColumnType } from 'antd/es/table'
import Papa from 'papaparse'

interface Props {
  results: Pto.Results.ResultPopulated[]
  nodes: Pto.Nodes.NodeSmall[]
}

const ResultsTable: React.FC<Props> = ({ results, nodes }) => {
  const [updatedAt, setUpdatedAt] = useState('')

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

  const columns: ColumnType<any>[] = [
    {
      title: 'Команда',
      dataIndex: 'groupName',
      key: 'groupName',
      fixed: 'left',
      sorter: (a, b) => a.groupName.localeCompare(b.groupName)
    },
    {
      title: 'Категорія',
      dataIndex: 'categoryName',
      key: 'categoryName',
      fixed: 'left',
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName)
    },
    ...nodes?.map((node: Pto.Nodes.Node) => ({
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
      sorter: (a, b) => a.total - b.total
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

  const exportToCSV = () => {
    const csvData = [
      columns.map((col) => col.title),
      ...groupedData.map(
        (row) => columns.map((col) => row[col.dataIndex] ?? '') // Fill empty cells with ''
      )
    ]

    const csvString = Papa.unparse(csvData)
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'results.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Flex justify="space-between">
        <Typography.Text>{updatedAt}</Typography.Text>
        <Button onClick={exportToCSV} className="mb-3">
          Завантажити в csv
        </Button>
      </Flex>

      <Table
        scroll={{ scrollToFirstRowOnChange: true, x: true }}
        columns={columns}
        dataSource={groupedData}
        rowKey="groupName"
        bordered
      />
    </>
  )
}

export default ResultsTable
