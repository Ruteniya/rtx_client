interface ImageProps {
  src: string
  imageSize?: string | number
  alt?: string
}

const Image: React.FC<ImageProps> = ({ src, imageSize = 150, alt = 'image' }) => {
  return <img src={src} alt={alt} style={{ maxWidth: imageSize, maxHeight: imageSize || 'auto' }} />
}

export default Image
