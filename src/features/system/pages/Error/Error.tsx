import { HomeOutlined } from '@ant-design/icons'
import { Button, Flex, Typography } from 'antd'
import { AppRoutes } from '@app/app-routes'
import { FC } from 'react'
import { Link } from 'react-router-dom'

const Error: FC<{ message?: string }> = ({ message = 'Сталась непередбачувана помилка!' }) => {
  return (
    <Flex vertical className="w-screen h-dvh lg:h-screen" justify="center" align="center" gap={16}>
      <Flex vertical gap={16} justify="center" align="center" className="max-w-xl px-4 text-center">
        <Flex>
          <Typography.Title level={2}>{message}</Typography.Title>
        </Flex>
        <Typography.Paragraph className="font-medium text-center text-base">
          Не хвилюйтеся, ми тут, щоб допомогти! Спробуйте повернутися на головну сторінку.
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

export default Error
