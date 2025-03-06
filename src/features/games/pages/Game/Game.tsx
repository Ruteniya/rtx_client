import React, { useState } from 'react'
import { Button } from 'antd'
import { useGetGameQuery } from '@api/api-games'
import { GameDetails, GameForm } from '@features/games/components'

const Game: React.FC = () => {
  const { data: game, isLoading, isError } = useGetGameQuery()
  const [isGameCreated, setIsGameCreated] = useState(false)

  if (isLoading) {
    return <div>Завантаження...</div>
  }

  if (isError || !game) {
    return (
      <div>
        <h3>Гра не створена</h3>
        <Button type="primary" onClick={() => setIsGameCreated(true)}>
          Створити гру
        </Button>
        {isGameCreated && <GameForm isEditMode={false} onSuccess={() => setIsGameCreated(false)} />}
      </div>
    )
  }

  return <GameDetails game={game} />
}

export default Game
