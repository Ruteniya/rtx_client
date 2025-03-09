import React from 'react'

interface GameLogoProps {
  logo: string
  size?: number
}

const GameLogo: React.FC<GameLogoProps> = ({ logo, size = 100 }) => {
  return <img src={logo} alt="Логотип гри" style={{ width: size, height: size }} />
}

export default GameLogo
