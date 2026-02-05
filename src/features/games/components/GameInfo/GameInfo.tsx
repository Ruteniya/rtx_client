import React from 'react'
import { Typography, Flex, Tag } from 'antd'
import { Pto } from 'rtxtypes'
import { GameLogo } from '..'

interface GameInfoProps {
  game: Pto.Games.Game
}

const GameInfo: React.FC<GameInfoProps> = ({ game }) => {

  const gameStatusOptions = [
    { value: Pto.Games.GameStatus.Draft, label: 'В процесі розробки' , color: 'orange'},
    { value: Pto.Games.GameStatus.Running, label: 'Активна' , color: 'green'},
    { value: Pto.Games.GameStatus.Stopped, label: 'Зупинена' , color: 'red'},
    { value: Pto.Games.GameStatus.Finished, label: 'Завершена' , color: 'blue'},
  ]

  return (
    <Flex vertical justify="center" align="center" className="text-center items-center w-full">
      <GameLogo logo={game?.logo || ''} />
      <Typography.Title>{game.name}</Typography.Title>
      <Typography.Paragraph>
      <span dangerouslySetInnerHTML={{ __html: game.description }} />
    </Typography.Paragraph>
      <Typography.Paragraph><strong>Статус:</strong> <Tag color={gameStatusOptions.find((status) => status.value === game.status)?.color}>{gameStatusOptions.find((status) => status.value === game.status)?.label}</Tag></Typography.Paragraph>
      <strong>Дата початку:</strong>{' '}
      {new Date(game.startDate).toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}
      <strong>Дата закінчення:</strong>{' '}
      {new Date(game.endDate).toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}
    </Flex>
  )
}

export default GameInfo
