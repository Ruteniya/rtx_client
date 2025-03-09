import React from 'react'
import { Card, Button, Typography, Flex } from 'antd'
import { Pto } from '@rtx/types'
import { useState } from 'react'
import GameForm from '../GameForm'
import GameLogo from '../GameLogo'

interface GameDetailsProps {
  game: Pto.Games.Game
}

const GameDetails: React.FC<GameDetailsProps> = ({ game }) => {
  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <div>
      <Card
        title="Поточна гра"
        extra={
          <Button onClick={() => setIsEditMode(!isEditMode)}>{isEditMode ? 'Згорнути форму' : 'Редагувати'}</Button>
        }
      >
        {isEditMode ? (
          '...'
        ) : (
          <Flex vertical justify="center" align="center" className="text-center items-center">
            <GameLogo logo={game?.logo || ''} />
            <Typography.Title>{game.name}</Typography.Title>
            <Typography.Paragraph>{game.description}</Typography.Paragraph>
            <strong>Дата початку:</strong> {new Date(game.startDate).toLocaleString()}
            <strong>Дата закінчення:</strong> {new Date(game.endDate).toLocaleString()}
          </Flex>
        )}
      </Card>
      {isEditMode && <GameForm isEditMode={true} initialValues={game} onSuccess={() => setIsEditMode(false)} />}
    </div>
  )
}

export default GameDetails
