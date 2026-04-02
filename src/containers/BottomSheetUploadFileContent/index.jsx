import { useState } from 'react'

import { BottomSheetView } from '@gorhom/bottom-sheet'
import { useLingui } from '@lingui/react/macro'
import { CommonFileIcon } from '@tetherto/pearpass-lib-ui-react-native-components'

import { Body, Header, Title } from './styles'
import { FileSizeWarning } from '../../components/FileSizeWarning'
import { withAutoLockBypass } from '../../HOCs'
import { ButtonSecondary } from '../../libComponents'
import {
  handleChooseFile,
  handleChooseMedia
} from '../../utils/handleChooseFile'

export const BottomSheetUploadFileContent = withAutoLockBypass(
  ({ onFileSelect }) => {
    const [isFileSizeWarning, setIsFileSizeWarning] = useState(false)
    const { t } = useLingui()

    const handleFileSizeWarning = () => {
      setIsFileSizeWarning(true)
    }

    return (
      <BottomSheetView style={{ padding: 20 }}>
        <Header>
          <CommonFileIcon />
          <Title>{t`Upload your files`}</Title>
        </Header>
        <FileSizeWarning isFileSizeWarning={isFileSizeWarning} />
        <Body>
          <ButtonSecondary
            onPress={() =>
              handleChooseFile(onFileSelect, handleFileSizeWarning)
            }
            stretch
          >{t`Choose File`}</ButtonSecondary>
          <ButtonSecondary
            onPress={() =>
              handleChooseMedia(onFileSelect, handleFileSizeWarning)
            }
            stretch
          >{t`Choose Photo / Video`}</ButtonSecondary>
        </Body>
      </BottomSheetView>
    )
  }
)
