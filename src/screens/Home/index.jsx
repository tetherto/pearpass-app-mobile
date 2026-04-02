import { useEffect, useMemo, useState } from 'react'

import { DESIGN_VERSION } from '@tetherto/pearpass-lib-constants'
import { useTheme } from '@tetherto/pearpass-lib-ui-kit'
import { FolderIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { useRecords, useVault } from '@tetherto/pearpass-lib-vault'

import { Container, CurrentFolder, FolderName } from './styles'
import { BottomSheetSortContent } from '../../containers/BottomSheetSortContent'
import { Categories } from '../../containers/Categories'
import { ContentContainer } from '../../containers/ContentContainer'
import { ContentHeader } from '../../containers/ContentHeader'
import { EmptyCollectionView } from '../../containers/EmptyCollectionView'
import { EmptyCollectionViewV2 } from '../../containers/EmptyCollectionViewV2'
import { EmptyResultsView } from '../../containers/EmptyResultsView'
import { Header } from '../../containers/Header'
import { ItemList } from '../../containers/ItemList'
import { ItemListV2 } from '../../containers/ItemListV2'
import { MultiSelectBar } from '../../containers/MultiSelectBar'
import { ScreenLayout } from '../../containers/ScreenLayout'
import { useBottomSheet } from '../../context/BottomSheetContext'
import {
  INITIAL_STATE,
  useSharedFilter
} from '../../context/SharedFilterContext'
import { useJobQueueProcessor } from '../../jobQueue'
import { groupRecordsByTimePeriod } from '../../utils/groupRecordsByTimePeriod'

const SORT_BY_TYPE = {
  Recent: {
    key: 'updatedAt',
    direction: 'desc'
  },
  'Newest to oldest': {
    key: 'createdAt',
    direction: 'desc'
  },
  'Oldest to newest': {
    key: 'createdAt',
    direction: 'asc'
  }
}

export const Home = () => {
  useJobQueueProcessor()

  const [recordType, setRecordType] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [isMultiSelectOn, setIsMultiSelectOn] = useState(false)
  const [selectedRecords, setSelectedRecords] = useState([])

  const { state, setState } = useSharedFilter()
  const { theme } = useTheme()
  const { expand } = useBottomSheet()

  const sort = useMemo(() => SORT_BY_TYPE[state.sort], [state.sort])

  const { data: vaultData } = useVault()

  const selectedFolder =
    state?.folder !== 'allFolder' && state?.folder !== 'favorite'
      ? state?.folder
      : undefined

  const { data: records } = useRecords({
    shouldSkip: true,
    variables: {
      filters: {
        folder: selectedFolder,
        searchPattern: searchValue,
        type: recordType === 'all' ? undefined : recordType,
        ...(state?.isFavorite ? { isFavorite: true } : {})
      },
      sort: sort
    }
  })

  const handleRecordType = (type) => {
    setRecordType((prevState) => (prevState === type ? 'all' : type))
  }

  const handleSearch = (value) => {
    setSearchValue(value)
  }

  useEffect(() => {
    if (vaultData?.id) {
      setSearchValue('')
      setRecordType('all')
      setState(INITIAL_STATE)
    }
  }, [vaultData?.id])

  useEffect(() => {
    if (vaultData?.id) {
      setSearchValue('')
      setRecordType('all')
    }
  }, [selectedFolder, state.isFavorite])

  const sections = useMemo(
    () => (DESIGN_VERSION === 2 ? groupRecordsByTimePeriod(records, sort) : []),
    [records, sort]
  )

  if (DESIGN_VERSION === 2) {
    const headerProps = {
      setIsMultiSelectOn,
      isMultiSelectOn,
      setSearchValue: handleSearch,
      selectedRecords,
      setSelectedRecords,
      searchValue,
      itemsFound: records?.length
    }

    return (
      <ScreenLayout
        header={<Header {...headerProps} />}
        contentStyle={{
          paddingHorizontal: 0,
          backgroundColor: theme.colors.colorBackground
        }}
      >
        <ContentContainer>
          <ContentHeader
            isMultiSelectOn={isMultiSelectOn}
            setIsMultiSelectOn={setIsMultiSelectOn}
            setSelectedRecords={setSelectedRecords}
            onSortPress={() =>
              expand({
                children: <BottomSheetSortContent />,
                snapPoints: ['10%', '25%', '25%']
              })
            }
          />

          {isMultiSelectOn && (
            <MultiSelectBar
              selectedRecords={selectedRecords}
              setSelectedRecords={setSelectedRecords}
              setIsMultiSelectOn={setIsMultiSelectOn}
              records={records}
            />
          )}

          {!!records.length && (
            <ItemListV2
              sections={sections}
              isMultiSelectOn={isMultiSelectOn}
              selectedRecords={selectedRecords}
              setSelectedRecords={setSelectedRecords}
              setIsMultiSelectOn={setIsMultiSelectOn}
            />
          )}

          {!records.length && !searchValue.length && <EmptyCollectionViewV2 />}

          {!records.length && !!searchValue.length && <EmptyResultsView />}
        </ContentContainer>
      </ScreenLayout>
    )
  }

  const headerProps = {
    setIsMultiSelectOn,
    isMultiSelectOn,
    setSearchValue: handleSearch,
    selectedRecords,
    setSelectedRecords,
    searchValue,
    itemsFound: records?.length
  }

  return (
    <Container>
      <Header {...headerProps} />

      <Categories setRecordType={handleRecordType} recordType={recordType} />

      {state?.folder && state?.folder !== 'allFolder' && (
        <CurrentFolder>
          <FolderIcon />
          <FolderName>{state?.folder}</FolderName>
        </CurrentFolder>
      )}

      {!!records.length && (
        <ItemList
          isMultiSelectOn={isMultiSelectOn}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
          records={records}
        />
      )}

      {!records.length && !searchValue.length && (
        <EmptyCollectionView selectedRecordType={recordType} />
      )}

      {!records.length && !!searchValue.length && <EmptyResultsView />}
    </Container>
  )
}
