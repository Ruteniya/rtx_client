import { Modal, Upload, Button, message } from 'antd'
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/lib/upload'
import { useState } from 'react'
import Papa from 'papaparse'
import { useImportGroupsCsvMutation } from '@api/groups-api'

interface CsvGroupRow {
  'Назва команди': string
  Категорія: string
  'Кількість учасників': string
  'Email 1': string
  'Email 2': string
  'Email 3': string
}

const UploadGroupsModal = ({ isVisible, closeModal }: { isVisible: boolean; closeModal: () => void }) => {
  const [file, setFile] = useState<RcFile | null>(null)
  const [bulkCreateGroups, { isLoading }] = useImportGroupsCsvMutation()

  const handleBeforeUpload = (file: RcFile) => {
    setFile(file)
    return false // prevent auto upload
  }

  const handleUpload = () => {
    if (!file) return message.error('Оберіть файл для завантаження')

    Papa.parse<CsvGroupRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const invalidRows: string[] = []

          const groupsToCreate = results.data.map((row, index) => {
            const emails = [row['Email 1'], row['Email 2'], row['Email 3']].filter(Boolean)
            const invalidEmail = emails.find((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            if (!row['Назва команди'] || !row['Категорія'] || !row['Кількість учасників'] || invalidEmail) {
              invalidRows.push(`${index + 2} рядок`)
            }
            return {
              name: row['Назва команди'],
              categoryName: row['Категорія'],
              numberOfParticipants: Number(row['Кількість учасників']),
              emails
            }
          })

          console.log('groupsToCreate:', groupsToCreate)

          if (invalidRows.length > 0) {
            return message.error(`Помилки у рядках: ${invalidRows.join(', ')}`)
          }

          await bulkCreateGroups({ groups: groupsToCreate })
            .unwrap()
            .then(() => {
              message.success('Команди успішно завантажено')
              closeModal()
              setFile(null)
            })
            .catch((err) => {
              console.error(err)
              message.error('Помилка при завантаженні груп')
            })
        } catch (err) {
          console.error(err)
          message.error('Помилка при завантаженні груп')
        } finally {
          setFile(null)
        }
      }
    })
  }

  const downloadTemplate = () => {
    const template: CsvGroupRow[] = [
      {
        'Назва команди': '',
        Категорія: '',
        'Кількість учасників': '',
        'Email 1': '',
        'Email 2': '',
        'Email 3': ''
      }
    ]

    const csv = Papa.unparse(template)

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'groups_template.csv')
    link.click()

    URL.revokeObjectURL(link.href)
  }

  return (
    <Modal
      title="Додати команди з CSV"
      open={isVisible}
      onCancel={closeModal}
      onOk={handleUpload}
      confirmLoading={isLoading}
      footer={[
        <Button key="upload" type="primary" loading={isLoading} onClick={handleUpload}>
          Завантажити
        </Button>
      ]}
    >
      <br />

      <Button key="template" icon={<DownloadOutlined />} onClick={downloadTemplate}>
        Завантажити шаблон
      </Button>

      <br />
      <br />

      <p>
        Щоб завантажити команди, підготуйте CSV файл із такими колонками: <br />
        <strong>Назва команди</strong>, <strong>Категорія</strong>, <strong>Кількість учасників</strong>,
        <strong>Email 1</strong>, <strong>Email 2</strong>, <strong>Email 3</strong>.
      </p>

      <br />

      <Upload beforeUpload={handleBeforeUpload} accept=".csv" maxCount={1}>
        <Button icon={<UploadOutlined />}>Оберіть CSV файл</Button>
      </Upload>
    </Modal>
  )
}

export default UploadGroupsModal
