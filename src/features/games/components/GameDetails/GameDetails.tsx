import React from 'react'
import { Card, Button } from 'antd'
import { Pto } from '@rtx/types'
import { useState } from 'react'
import GameForm from '../GameForm'
import GameInfo from '../GameInfo'

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
        {isEditMode ? '...' : <GameInfo game={game} />}
      </Card>
      {isEditMode && <GameForm isEditMode={true} initialValues={game} onSuccess={() => setIsEditMode(false)} />}
    </div>
  )
}

export default GameDetails
