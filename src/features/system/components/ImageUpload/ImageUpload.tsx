import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import Image from '../Image/Image'

interface ImageUploadProps {
  onUpload: (file: File | null) => void
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

  const handleRemove = () => {
    setPreview(null)
    onUpload(null)
  }

  return (
    <div>
      <Upload beforeUpload={handleUpload} showUploadList={true} accept="image/*" onRemove={handleRemove} maxCount={1}>
        <Button icon={<UploadOutlined />} className="!whitespace-normal !min-h-fit">
          Завантажити зображення
        </Button>
      </Upload>

      {showImage && preview && (
        <div className="my-2">
          <Image src={preview} alt="Uploaded preview" imageSize={imageSize} expandable={true} />
        </div>
      )}
    </div>
  )
}

export default ImageUpload
