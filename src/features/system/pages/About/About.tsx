import { GameInfo } from '@features/games/components'
import { useAppSelector } from '@hooks/useSelector'
import { Card, Flex } from 'antd'

const About = () => {
  const game = useAppSelector((state) => state.user.game)

  return (
    <Flex vertical align="center" className="h-full">
      {game ? (
        <Card title="Поточна гра" className="max-w-[600px]">
          <GameInfo game={game} />
        </Card>
      ) : (
        'Гра не створена'
      )}
    </Flex>
  )
}

export default About
