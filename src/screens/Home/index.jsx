import { useEffect, useMemo, useState } from 'react'

import { FolderIcon } from '@tetherto/pearpass-lib-ui-react-native-components'
import { useRecords, useVault } from '@tetherto/pearpass-lib-vault'

import { Container, CurrentFolder, FolderName } from './styles'
import { SORT_BY_TYPE } from '../../constants/sortOptions'
import { BottomSheetSortContentV2 } from '../../containers/BottomSheetSortContentV2'
import { Categories } from '../../containers/Categories'
import { ContentHeader } from '../../containers/ContentHeader'
import { EmptyCollectionView } from '../../containers/EmptyCollectionView'
import { EmptyCollectionViewV2 } from '../../containers/EmptyCollectionViewV2'
import { EmptyResultsView } from '../../containers/EmptyResultsView'
import { Header } from '../../containers/Header'
import { ItemList } from '../../containers/ItemList'
import { ItemListV2 } from '../../containers/ItemListV2'
import { Layout } from '../../containers/Layout'
import { MultiSelectBar } from '../../containers/MultiSelectBar'
import { useBottomSheet } from '../../context/BottomSheetContext'
import {
  INITIAL_STATE,
  useSharedFilter
} from '../../context/SharedFilterContext'
import { useJobQueueProcessor } from '../../jobQueue'
import { groupRecordsByTimePeriod } from '../../utils/groupRecordsByTimePeriod'

export const Home = () => {
  useJobQueueProcessor()

  const [recordType, setRecordType] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [isMultiSelectOn, setIsMultiSelectOn] = useState(false)
  const [selectedRecords, setSelectedRecords] = useState([])

  const { state, setState } = useSharedFilter()
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
    () => (isV2() ? groupRecordsByTimePeriod(records, sort) : []),
    [records, sort]
  )

  if (isV2()) {
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
      <Layout
        header={<Header {...headerProps} />}
        contentStyle={{ padding: 0 }}
      >
        <ContentHeader
          isMultiSelectOn={isMultiSelectOn}
          setIsMultiSelectOn={setIsMultiSelectOn}
          setSelectedRecords={setSelectedRecords}
          recordType={recordType}
          onCategoryChange={handleRecordType}
          onSortPress={() =>
            expand({
              children: <BottomSheetSortContentV2 />
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
      </Layout>
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
