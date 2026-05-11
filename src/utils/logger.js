export class Logger {
  constructor({ debugMode }) {
    this.debugMode = debugMode || false
  }

  log(...messages) {
    if (!this.debugMode) {
      return
    }
    // eslint-disable-next-line no-console
    console.log(messages)
  }

  warn(...messages) {
    // eslint-disable-next-line no-console
    console.warn(messages)
  }

  error(...messages) {
    // eslint-disable-next-line no-console
    console.error(messages)
  }
}

// export const logger = new Logger({
//   debugMode: process.env.NODE_ENV === 'development'
// })

export const logger = new Logger({
  debugMode: false
})
