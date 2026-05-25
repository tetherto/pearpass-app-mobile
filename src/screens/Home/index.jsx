import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRecords, useVault } from '@tetherto/pearpass-lib-vault'

import { SORT_BY_TYPE } from '../../constants/sortOptions'
import { ContentHeader } from '../../containers/ContentHeader'
import { EmptyCollectionView } from '../../containers/EmptyCollectionView'
import { EmptyResultsView } from '../../containers/EmptyResultsView'
import { Header } from '../../containers/Header'
import { ItemList } from '../../containers/ItemList'
import { Layout } from '../../containers/Layout'
import { MultiSelectBar } from '../../containers/MultiSelectBar'
import {
  INITIAL_STATE,
  useSharedFilter
} from '../../context/SharedFilterContext'
import { useBackHandler } from '../../hooks/useBackHandler'
import { useJobQueueProcessor } from '../../jobQueue'
import { groupRecordsByTimePeriod } from '../../utils/groupRecordsByTimePeriod'

export const Home = () => {
  useJobQueueProcessor()

  const [recordType, setRecordType] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [isMultiSelectOn, setIsMultiSelectOn] = useState(false)
  const [selectedRecords, setSelectedRecords] = useState([])

  const { state, setState } = useSharedFilter()
  const sort = useMemo(() => SORT_BY_TYPE[state.sort], [state.sort])

  const { data: vaultData } = useVault()

  const handleExitMultiSelect = useCallback(() => {
    setSelectedRecords([])
    setIsMultiSelectOn(false)
  }, [])

  useBackHandler({
    callback: isMultiSelectOn ? handleExitMultiSelect : undefined
  })

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
    }
  }, [selectedFolder, state.isFavorite])

  const sections = useMemo(
    () => groupRecordsByTimePeriod(records, sort),
    [records, sort]
  )

  const headerProps = {
    setIsMultiSelectOn,
    isMultiSelectOn,
    setSearchValue: handleSearch,
    selectedRecords,
    setSelectedRecords,
    searchValue,
    itemsFound: records?.length,
    recordType
  }

  return (
    <Layout
      header={<Header {...headerProps} />}
      contentStyle={{ padding: 0 }}
      isBuiltin={false}
    >
      <ContentHeader
        isMultiSelectOn={isMultiSelectOn}
        recordType={recordType}
        onCategoryChange={handleRecordType}
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
        <ItemList
          sections={sections}
          isMultiSelectOn={isMultiSelectOn}
          selectedRecords={selectedRecords}
          setSelectedRecords={setSelectedRecords}
          setIsMultiSelectOn={setIsMultiSelectOn}
        />
      )}

      {!records.length && !searchValue.length && (
        <EmptyCollectionView recordType={recordType} />
      )}

      {!records.length && !!searchValue.length && <EmptyResultsView />}
    </Layout>
  )
}
