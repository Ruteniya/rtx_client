import { useGetGameQuery } from '@api/api-games'
import { GameInfo } from '@features/games/components'
import { Card, Flex } from 'antd'

const About = () => {
  const { data: game, isLoading, isError } = useGetGameQuery()

  if (isLoading) {
    return <div>Завантаження...</div>
  }

  if (isError) {
    return <div>Сталася помилка при завантаженні гри.</div>
  }

  return (
    <Flex vertical justify="center" align="center" className="h-dvh">
      {game ? (
        <Card title="Поточна гра" className="!m-4 max-w-[600px]">
          <GameInfo game={game} />
        </Card>
      ) : (
        'Гра не створена'
      )}
    </Flex>
  )
}

export default About
