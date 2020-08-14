export const strict = false

export const state = () => ({
  configuration: null,
  message: {
    show: false,
    text: '',
    color: 'info'
  }
})

export const mutations = {
  setConfiguration (state, configuration) {
    state.configuration = configuration
  },
  setMessage (state, message) {
    state.message = message
  }
}
