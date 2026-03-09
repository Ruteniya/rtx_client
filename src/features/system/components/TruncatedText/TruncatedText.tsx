import { Tooltip } from 'antd'
import { FC } from 'react'

interface TruncatedTextProps {
  text?: string
  maxLength?: number
}

const TruncatedText: FC<TruncatedTextProps> = ({ text, maxLength = 100 }) => {
  if (!text) return null

  const isLong = text.length > maxLength
  const truncated = isLong ? `${text.slice(0, maxLength)}...` : text

  const content = <span>{truncated}</span>

  return isLong ? (
    <Tooltip title={text}>{content}</Tooltip>
  ) : (
    content
  )
}

export default TruncatedText