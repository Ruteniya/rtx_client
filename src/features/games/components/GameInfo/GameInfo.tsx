import React from 'react'
import { Typography, Flex } from 'antd'
import { Pto } from '@rtx/types'
import GameLogo from '../GameLogo'

interface GameInfoProps {
  game: Pto.Games.Game
}

const GameInfo: React.FC<GameInfoProps> = ({ game }) => {
  return (
    <Flex vertical justify="center" align="center" className="text-center items-center">
      <GameLogo logo={game?.logo || ''} />
      <Typography.Title>{game.name}</Typography.Title>
      <Typography.Paragraph>{game.description}</Typography.Paragraph>
      <strong>Дата початку:</strong>{' '}
      {new Date(game.startDate).toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'long', // або '2-digit' для числового формату
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}
      <strong>Дата закінчення:</strong>{' '}
      {new Date(game.endDate).toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'long', // або '2-digit' для числового формату
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}
    </Flex>
  )
}

export default GameInfo
