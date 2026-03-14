import React, { useState, useEffect } from 'react'
import { Typography, Flex, Tag, Alert } from 'antd'
import { Pto } from 'rtxtypes'
import { GameLogo } from '..'

interface GameInfoProps {
  game: Pto.Games.Game
}

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return '0 днів 00:00:00'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  if (days > 0) {
    return `${days} дн. ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

const GameInfo: React.FC<GameInfoProps> = ({ game }) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [countdownLabel, setCountdownLabel] = useState<string>('')

  useEffect(() => {
    const startDate = new Date(game.startDate).getTime()
    const endDate = new Date(game.endDate).getTime()

    const update = () => {
      const now = Date.now()
      if (now < startDate) {
        setCountdownLabel('До початку гри')
        setTimeLeft(formatTimeLeft(startDate - now))
      } else if (now < endDate) {
        setCountdownLabel('До закінчення гри')
        setTimeLeft(formatTimeLeft(endDate - now))
      } else {
        setCountdownLabel('Гра завершена')
        setTimeLeft('—')
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [game.startDate, game.endDate])

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

      {timeLeft !== null && game.status !== Pto.Games.GameStatus.Finished && (
       <Alert className='!mt-3' message={
        <div className="w-[300px]">
          <Typography.Paragraph className="!mb-0">
            <strong>{countdownLabel}:</strong>{' '}
            <Typography.Text strong type={countdownLabel === 'Гра завершена' ? 'secondary' : undefined}>
              {timeLeft}
            </Typography.Text>
          </Typography.Paragraph>
        </div>

          } type="info" showIcon />
      )}
    </Flex>
  )
}

export default GameInfo
