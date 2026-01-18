import React, { useState } from 'react'
import { Button, Flex, Typography, Spin } from 'antd'
import { useGetGameQuery } from '@api/api-games'
import { GameDetails, GameForm } from '@features/games/components'

const { Title, Text } = Typography

const Game: React.FC = () => {
  const { data: game, isLoading, isError } = useGetGameQuery()
  const [isGameCreated, setIsGameCreated] = useState(false)

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    )
  }

  if (isError || !game) {
    return (
      <Flex vertical align="center" justify="center" gap={16} style={{ minHeight: '60vh', padding: 24 }}>
        <Title level={3}>Гра ще не створена</Title>

        <Text type="secondary" style={{ textAlign: 'center', maxWidth: 420 }}>
          Створіть нову гру, щоб почати керувати налаштуваннями та переглядати деталі
        </Text>

        {!isGameCreated && (
          <Button type="primary" size="large" onClick={() => setIsGameCreated(true)}>
            Створити гру
          </Button>
        )}

        {isGameCreated && (
          <Flex style={{ width: '100%', maxWidth: 600, marginTop: 24 }}>
            <GameForm isEditMode={false} onSuccess={() => setIsGameCreated(false)} />
          </Flex>
        )}
      </Flex>
    )
  }

  return <GameDetails game={game} />
}

export default Game
