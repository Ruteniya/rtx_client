import { useBulkDeleteGroupsMutation } from '@api/groups-api'
import { Button, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

type BulkDeleteGroupsButtonProps = {
  groupIds: string[]
  onClearedSelection?: () => void
}

const BulkDeleteGroupsButton = ({ groupIds, onClearedSelection }: BulkDeleteGroupsButtonProps) => {
  const [bulkDelete, { isLoading }] = useBulkDeleteGroupsMutation()

  const handleBulkDelete = () => {
    if (!groupIds.length) return

    Modal.confirm({
      title: 'Видалити обрані команди?',
      content:
        'Буде видалено обрані команди, усіх користувачів у них (крім системних адміністраторів) та записи про надсилання листів. Групи з системним адміном будуть пропущені (користувачі-не-адміни в них все одно видаляться).',
      okText: 'Видалити',
      okButtonProps: { danger: true },
      onOk: async () => {
        const result = await bulkDelete({ groupIds }).unwrap()
        const deletedCount = result.deleted.length
        const skippedCount = result.skipped.length
        if (deletedCount > 0 && skippedCount > 0) {
          Modal.success({
            title: 'Готово',
            content: `Видалено команд: ${deletedCount}. Пропущено (групи з системним адміном): ${skippedCount}.`
          })
        } else if (deletedCount > 0) {
          Modal.success({ title: 'Готово', content: `Видалено команд: ${deletedCount}.` })
        } else if (skippedCount > 0) {
          Modal.info({
            title: 'Групи пропущені',
            content: `Усі обрані групи містять системного адміністратора (${skippedCount}). Користувачі-не-адміни в них видалені.`
          })
        }
        onClearedSelection?.()
      }
    })
  }

  return (
    <Button danger icon={<DeleteOutlined />} disabled={!groupIds.length} loading={isLoading} onClick={handleBulkDelete}>
      Видалити обрані
    </Button>
  )
}

export default BulkDeleteGroupsButton
