import { useGetSmallNodesQuery } from '@api/api-nodes'
import { useGenerateResultsMutation, useGetResultsQuery } from '@api/api-results'
import { ResultsTable } from '@features/results/components'
import { Button, Divider, Flex, message, Typography } from 'antd'

const Results = () => {
  const [generateResults] = useGenerateResultsMutation()
  const { data: results } = useGetResultsQuery()
  const { data: nodesData } = useGetSmallNodesQuery()
  const handleGenerateResults = async () => {
    await generateResults()
      .unwrap()
      .then(() => message.success('Попередні результати згенеровано'))
      .catch()
  }
  return (
    <>
      <Flex justify="end">
        <Button onClick={handleGenerateResults}>Генерувати результат</Button>
      </Flex>

      <Typography.Title level={4}>Проміжні результи</Typography.Title>
      <Divider />

      <Flex justify="center" vertical className="overflow-auto">
        {results ? <ResultsTable results={results || []} nodes={nodesData?.items || []} /> : 'Результати відсутні'}
      </Flex>
    </>
  )
}

export default Results
