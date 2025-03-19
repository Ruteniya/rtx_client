import { Flex } from 'antd'
import { AnswersTable } from '@features/answers/components'

const Answers = ({ processed }: { processed?: boolean }) => {
  return (
    <div>
      <Flex justify="center">
        <AnswersTable processed={processed} />
      </Flex>
    </div>
  )
}

export default Answers
