import { useState } from 'react'
import { Flex, Modal } from 'antd'

interface ImageProps {
  src: string
  imageSize?: string | number
  alt?: string
  expandable?: boolean
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void
}

const Image: React.FC<ImageProps> = ({ src, imageSize = 150, alt = 'image', expandable = false, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = (e: React.MouseEvent<HTMLImageElement>) => {
    if (expandable) setIsModalOpen(true)
    e.stopPropagation()
  }

  return (
    <div onClick={onClick}>
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: imageSize, maxHeight: imageSize || 'auto', cursor: expandable ? 'pointer' : 'default' }}
        onClick={handleOpen}
      />

      {expandable && (
        <Modal open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)} centered>
          <Flex justify="center">
            <img src={src} alt={alt} style={{ width: '90%' }} />
          </Flex>
        </Modal>
      )}
    </div>
  )
}

export default Image
