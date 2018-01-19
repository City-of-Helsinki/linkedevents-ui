export default () => {
    // Define appsettings for Jest tests
    const appSettings = {
      api_base: 'foourl',
      nocache: true,
      local_storage_user_expiry_time: 48
    }
    global.appSettings = appSettings  // Jest's global == window
}
