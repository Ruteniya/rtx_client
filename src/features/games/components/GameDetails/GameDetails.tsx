import React from 'react'
import { Card, Button } from 'antd'
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
        <p>
          <strong>Назва:</strong> {game.name}
        </p>
        <p>
          <strong>Опис:</strong> {game.description}
        </p>
        <p>
          <strong>Дата початку:</strong> {new Date(game.startDate).toLocaleString()}
        </p>
        <p>
          <strong>Дата закінчення:</strong> {new Date(game.endDate).toLocaleString()}
        </p>
        <img src={game.logo} alt="Логотип гри" style={{ width: 200, height: 200 }} />
      </Card>
      {isEditMode && <GameForm isEditMode={true} initialValues={game} onSuccess={() => setIsEditMode(false)} />}
    </div>
  )
}

export default GameDetails
