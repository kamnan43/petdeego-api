const config = {
  mongodb: {
    cluster: 'cluster0-shard-00-00-t0qef.mongodb.net:27017,cluster0-shard-00-01-t0qef.mongodb.net:27017,cluster0-shard-00-02-t0qef.mongodb.net:27017',
    // host: 'alphaem.documents.azure.com',
    // port: 10255,
    username: 'alphaem',
    password: '5pDTAqhBHw2RjWxScXRY7rjEloG5Q47ewTfI6vuZOu2BP3lVKez1RihhLhhBYyX608NBHOPSqBTSDu0nyasuLQ==',
    database: 'petdee',
    qs: '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
  },
  jwt: {
    secret: '25237FA87A9E911E420BB460716A192689970035F99264CECD77B1E679567145',
    default_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUoxYzJWeVgybGtJam9pUmsxVExUZ3lNelJoTlRCaU9HTXlZemM0WkdJaUxDSjFjMlZ5WDI1aGJXVWlPaUpFWlhZaUxDSnVZVzFsSWpvaVJHVjJaV3h2Y0dWeUlpd2laVzFoYVd3aU9pSmtaWFpBWlcxaGFXd3VZMjl0SWl3aWMyVnNiR1Z5WDJsa0lqb3dMQ0pqYUdGdWJtVnNYMmxrSWpwdWRXeHNMQ0pwYzE5aFpHMXBiaUk2ZEhKMVpTd2ljbTlzWlNJNlczc2lhV1FpT2pFc0ltNWhiV1VpT2lKRVpYWmxiRzl3WlhJaUxDSmtaWE5qY21sd2RHbHZiaUk2SWtSbGRtVnNiM0JsY2lJc0luQnNZWFJtYjNKdElqb2lVRE1pZlYwc0ltVjRjQ0k2TVRVMk16QXhNRFk0Tmpjek1IMC5IYjl3MmVLcldOR0RORENwc1pMNUhaTXd0a1NGQm5EVTBMbDBabExZZUZRIiwicGVybWlzc2lvbiI6WyJQM19DQU5fVklFV19ERUFMRVJfTElTVCIsIlAzX0NBTl9WSUVXX0RFQUxFUl9JTkZPIiwiUDNfQ0FOX0NSRUFURV9ERUFMRVJfSU5GTyIsIlAzX0NBTl9VUERBVEVfREVBTEVSX0lORk8iLCJQM19DQU5fREVMRVRFX0RFQUxFUl9JTkZPIiwiUDNfQ0FOX1ZJRVdfREVBTEVSX1NUT0NLUyIsIlAzX0NBTl9JTVBPUlRfREVBTEVSX1NUT0NLUyIsIlAzX0NBTl9WSUVXX0RFQUxFUl9BUkVBIiwiUDNfQ0FOX1ZJRVdfQUxMX1NUT0NLUyIsIlAzX0NBTl9WSUVXX1ZBQ0FUSU9OIiwiUDNfQ0FOX0NSRUFURV9WQUNBVElPTiIsIlAzX0NBTl9VUERBVEVfVkFDQVRJT04iLCJQM19DQU5fREVMRVRFX1ZBQ0FUSU9OIiwiUDNfQ0FOX1ZJRVdfSU1QT1JUX0RFQUxFUl9TVE9DS1NfSElTVE9SWSIsIlAzX0NBTl9WSUVXX09SREVSX0xJU1QiLCJQM19DQU5fVklFV19PUkRFUl9BU1NJR05NRU5UIiwiUDNfQ0FOX0FTU0lHTl9PUkRFUl9UT19ERUFMRVIiLCJQM19DQU5fVklFV19VU0VSX0xJU1QiLCJQM19DQU5fVklFV19VU0VSX0lORk8iLCJQM19DQU5fQ1JFQVRFX1VTRVJfSU5GTyIsIlAzX0NBTl9VUERBVEVfVVNFUl9JTkZPIiwiUDNfQ0FOX0RFTEVURV9VU0VSX0lORk8iLCJQM19DQU5fVklFV19ST0xFX0xJU1QiLCJQM19ERVZfSU1QT1JUX1NLVSIsIlAzX0RFVl9FWEFNUExFIiwiUDNfQ0FOX1VQREFURV9PUkRFUl9TVEFUVVMiLCJQM19DQU5fVklFV19PUkRFUl9ERVRBSUwiLCJQM19DQU5fVklFV19ERUFMRVJfUFVSQ0hBU0UiLCJQM19DQU5fVklFV19DQVIiLCJQM19DQU5fQ1JFQVRFX1FVT1RBVElPTiIsIlAzX0NBTl9WSUVXX1FVT1RBVElPTl9MSVNUIiwiUDNfQ0FOX0FTU0lHTl9RVU9UQVRJT04iLCJQM19DQU5fUVVPVEVfUVVPVEFUSU9OIiwiUDNfQ0FOX1ZJRVdfU0tVIiwiUDNfQ0FOX1ZJRVdfUVVPVEFUSU9OIiwiUDNfQ0FOX1VQREFURV9PUkRFUl9TQ09SRSIsIlAzX0NBTl9DUkVBVEVfT1JERVIiLCJQM19DQU5fR0VUX1NISVBQSU5HX0NPU1QiLCJQM19DQU5fVklFV19TSElQUElOR19DT1NUIiwiUDNfQ0FOX1ZJRVdfTkVXU19MSVNUIiwiUDNfQ0FOX0lNUE9SVF9ORVdTIiwiUDNfQ0FOX0lNUE9SVF9GUkVJR0hUIiwiUDNfQ0FOX1ZJRVdfUFJJQ0VfRU5HSU5FIiwiUDNfQ0FOX0lNUE9SVF9QUk9EVUNUIl0sImV4cCI6MTU2MzAxMDY4NjgyMH0.etUVP3lOHjk6TS7Bxe1vi653swkZDC1ZzespF5lSCDE',
  },
  azure: {
    storage: {
      account: 'azecomsa99',
      key: 'iXcu4kVYuZajlY1Dyvhs4F7EU/nC4hYPhj8cBmwxPHyM8dogTH4icgQur7D5/S+LU8TDqaRwzm6ju1pMJCSbaA==',
      container: 'develop',
    },
  },
  line: {
    channelAccessToken: '3wtcgqjnoV+ZEAXV6wnWC+pM4JhxkI70hza4ZnwL2eawUQ3DLBEDVHrwT/iSLzoTMSi6SVj79L9S8O1THT9jCLXa1Vus2x8cFp76z4CDeIipG2jGVn/AreFEibcviWGy5Go76HpbE919iuySm2+vXwdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'ee1e93ad38f7438443f6c47aa3a20ca3'
  },
  linepay: {
    api: 'https://sandbox-api-pay.line.me',
    channelId: '1634637036',
    channelSecret: 'e4804d3d1a51bb8a01058ffd76ecf9fd'
  },
  apiUrl: 'https://api.petdee.tech/api/v1',
  googleAppKey: 'AIzaSyBs77oWyIEnm2pD2LiwCVA6YRv-0_Rjgjs',
};

export default config;
