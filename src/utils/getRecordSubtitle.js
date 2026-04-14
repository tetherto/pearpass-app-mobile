export const getRecordSubtitle = (record) =>
  record.data?.username ||
  record.data?.email ||
  record.data?.name ||
  record.data?.fullName ||
  ''
