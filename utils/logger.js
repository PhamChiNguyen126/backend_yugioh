// Logger utility cho debugging
const logger = {
  info: (message, data = '') => {
    console.log(`✅ [INFO] ${message}`, data);
  },
  error: (message, err = '') => {
    console.error(`❌ [ERROR] ${message}`, err);
  },
  warn: (message, data = '') => {
    console.warn(`⚠️  [WARN] ${message}`, data);
  },
  debug: (message, data = '') => {
    if (process.env.DEBUG) {
      console.log(`🔧 [DEBUG] ${message}`, data);
    }
  }
};

module.exports = logger;
