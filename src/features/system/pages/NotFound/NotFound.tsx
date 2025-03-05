import { Button, Card, Flex, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { AppRoutes } from '../../../../app/app-routes'
import { ExclamationCircleOutlined, HomeOutlined } from '@ant-design/icons'

const NotFound = () => {
  return (
    <Flex vertical justify="center" align="center" gap={16} className="h-full text-center">
      <Flex vertical gap={16} justify="center" align="center" className="max-w-xl px-4">
        <Flex justify="center" align="center">
          <Typography.Title level={2}>
            <ExclamationCircleOutlined style={{ fontSize: '25px', color: '#FF4D4F', marginRight: '10px' }} />
            404 - Сторінку не знайдено!
          </Typography.Title>
        </Flex>
        <Typography.Paragraph className="font-medium text-center text-base">
          Упс! Схоже, що сторінка, яку ви шукаєте, відсутня. Не хвилюйтеся, ми тут, щоб допомогти! Спробуйте повернутися
          на головну сторінку.
        </Typography.Paragraph>
        <Link to={AppRoutes.main}>
          <Button type="primary" size="large" icon={<HomeOutlined />}>
            Перейти на головну сторінку
          </Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export default NotFound
