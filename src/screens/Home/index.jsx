import { useEffect, useMemo, useState } from 'react'

import { FolderIcon } from 'pearpass-lib-ui-react-native-components'
import { useRecords, useVault } from 'pearpass-lib-vault'

import { Container, CurrentFolder, FolderName } from './styles'
import { Categories } from '../../containers/Categories'
import { EmptyCollectionView } from '../../containers/EmptyCollectionView'
import { EmptyResultsView } from '../../containers/EmptyResultsView'
import { Header } from '../../containers/Header'
import { ItemList } from '../../containers/ItemList'
import {
  INITIAL_STATE,
  useSharedFilter
} from '../../context/SharedFilterContext'
import { useJobQueueProcessor } from '../../jobQueue'

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

  return (
    <Container>
      <Header
        setIsMultiSelectOn={setIsMultiSelectOn}
        isMultiSelectOn={isMultiSelectOn}
        setSearchValue={handleSearch}
        selectedRecords={selectedRecords}
        setSelectedRecords={setSelectedRecords}
        searchValue={searchValue}
        itemsFound={records?.length}
      />

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
