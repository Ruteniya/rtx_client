import { Upload, Button, Flex } from 'antd'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'
import Image from '../Image/Image'

interface ImageUploadProps {
  onUpload: (file: File | null) => void
  onDelete?: () => void
  initialValue?: string | null
  showImage?: boolean
  imageSize?: string | number
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onDelete,
  showImage = true,
  imageSize = 150,
  initialValue = null
}) => {
  const [preview, setPreview] = useState<string | null>(initialValue)

  const handleUpload = (file: File): boolean => {
    onUpload(file)

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    return false
  }

  const handleDelete = () => {
    setPreview(null)
    onUpload(null)
    onDelete?.()
  }

  return (
    <div>
      <Upload beforeUpload={handleUpload} showUploadList={false} accept="image/*" maxCount={1}>
        <Button icon={<UploadOutlined />} className="!whitespace-normal !min-h-fit">
          Завантажити зображення
        </Button>
      </Upload>

      {showImage && preview && (
        <div className="my-2">
          <Flex justify="end">
            <Button icon={<DeleteOutlined />} onClick={handleDelete} type="link" danger />
          </Flex>

          <Image src={preview} alt=" Uploaded preview" imageSize={imageSize} expandable={true} />
        </div>
      )}
    </div>
  )
}

export default ImageUpload
