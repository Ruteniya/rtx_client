import React from 'react'
import { Card, Button, Typography, Flex } from 'antd'
import { Pto } from '@rtx/types'
import { useState } from 'react'
import GameForm from '../GameForm'

interface GameDetailsProps {
  game: Pto.Games.Game
}

const GameDetails: React.FC<GameDetailsProps> = ({ game }) => {
  const [isEditMode, setIsEditMode] = useState(false)

  return (
    <div>
      <Card title="Інформація про гру" extra={<Button onClick={() => setIsEditMode(true)}>Редагувати</Button>}>
        <Flex vertical justify="center" align="center" className="text-center items-center">
          <img src={game.logo} alt="Логотип гри" style={{ width: 100, height: 100 }} />
          <Typography.Title>{game.name}</Typography.Title>
          <Typography.Paragraph>{game.description}</Typography.Paragraph>
          <strong>Дата початку:</strong> {new Date(game.startDate).toLocaleString()}
          <strong>Дата закінчення:</strong> {new Date(game.endDate).toLocaleString()}
        </Flex>
      </Card>
      {isEditMode && <GameForm isEditMode={true} initialValues={game} onSuccess={() => setIsEditMode(false)} />}
    </div>
  )
}

export default GameDetails
