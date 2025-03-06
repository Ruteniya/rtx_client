import { ConfigProvider } from 'antd'
import { FC, PropsWithChildren } from 'react'

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'var(--colorPrimary)',
          colorInfo: 'var(--colorPrimary)',
          colorSuccess: 'var(--colorSuccess)',
          colorWarning: 'var(--colorWarning)',
          colorError: 'var(--colorError)',
          colorTextBase: 'var(--colorPrimary)',
          borderRadius: 8,
          fontSize: 16
        },
        components: {
          Layout: {
            bodyBg: '#ffffff',
            headerBg: '#ffffff'
          },
          Table: {
            headerBg: '#EBF6FF',
            borderColor: 'var(--colorBorder)',
            fontWeightStrong: 500,
            boxShadowSecondary: 'none',
            cellFontSize: 14
          },
          //   Form: {
          //     labelFontSize: 14,
          //     fontSize: 14,
          //     lineHeight: 1,
          //     itemMarginBottom: 18,
          //     controlHeightSM: 18
          //   },
          Button: {
            // primaryColor: 'var(--primaryColor)',
            colorBgSolid: 'var(--primaryColor)',
            fontWeight: 600,
            paddingInline: 11,
            paddingBlockLG: 7,
            controlHeightLG: 42,
            colorBgBase: 'var(--colorPrimary)'
          },
          //   Drawer: {
          //     paddingLG: 16
          //   },
          Menu: {
            itemHoverBg: 'var(--colorSecondary)',
            itemActiveBg: 'var(--colorSecondaryDark)',
            itemSelectedBg: 'var(--colorSecondaryDark)',
            subMenuItemBg: '#ffffff',
            colorIconHover: 'var(--colorSecondaryDark)',
            colorBorder: 'var(--background)'
          }
          //   Slider: {
          //     handleSize: 11,
          //     dotSize: 14
          //   },
          //   Input: {
          //     paddingInline: 14,
          //     paddingBlock: 8,
          //     controlHeight: 42
          //   },
          //   Select: {
          //     controlHeightLG: 42
          //   }
        }
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default ThemeProvider
