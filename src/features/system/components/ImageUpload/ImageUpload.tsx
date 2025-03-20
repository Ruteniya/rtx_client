import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import Image from '../Image/Image'

interface ImageUploadProps {
  onUpload: (result: string | ArrayBuffer | null) => void
  initialValue?: string
  showImage?: boolean
  imageSize?: string | number
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  showImage = true,
  imageSize = 150,
  initialValue = null
}) => {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(initialValue)

  const handleUpload = (file: File): boolean => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      setImageSrc(result)
      onUpload(result)
    }
    reader.readAsDataURL(file)
    return false // Запобігає стандартній поведінці завантаження
  }

  const handleRemove = () => {
    setImageSrc(null)
    onUpload(null)
  }

  return (
    <div>
      <Upload beforeUpload={handleUpload} showUploadList={true} accept="image/*" onRemove={handleRemove} maxCount={1}>
        <Button icon={<UploadOutlined />} className="!whitespace-normal !min-h-fit">
          Завантажити зображення
        </Button>
      </Upload>
      {showImage && imageSrc && (
        <div className="my-2">
          <Image src={imageSrc as string} alt="Uploaded preview" imageSize={imageSize} expandable={true} />
        </div>
      )}
    </div>
  )
}

export default ImageUpload
