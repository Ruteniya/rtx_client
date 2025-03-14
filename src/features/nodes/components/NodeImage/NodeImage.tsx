import React from 'react'

interface NodeImageProps {
  src: string
  alt?: string
  size?: number
}

const NodeImage: React.FC<NodeImageProps> = ({ src, alt, size = 100 }) => {
  return <img src={src} alt={alt || 'Фото'} style={{ width: 'auto', height: size }} />
}

export default NodeImage
