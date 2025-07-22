import { create } from "zustand";

/**
 * Global logging store to control all console logging functionality
 */
const useLoggerStore = create((set) => ({
  isEnabled: true,
  logLevel: "warn", // 'debug', 'info', 'warn', 'error'

  setEnabled: (enabled) => set({ isEnabled: enabled }),
  setLogLevel: (level) => set({ logLevel: level }),
}));

/**
 * Custom hook that provides centralized logging functionality
 * with the ability to globally enable/disable logs
 */
const useLogger = () => {
  const { isEnabled, logLevel, setEnabled, setLogLevel } = useLoggerStore();

  // Log level hierarchy: debug < info < warn < error
  const logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  const currentLogLevelValue = logLevels[logLevel];

  const shouldLog = (level) => {
    return isEnabled && logLevels[level] >= currentLogLevelValue;
  };

  const debug = (...args) => {
    if (shouldLog("debug")) {
      console.debug("[DEBUG]", ...args);
    }
  };

  const log = (...args) => {
    if (shouldLog("info")) {
      console.log("[INFO]", ...args);
    }
  };

  const info = (...args) => {
    if (shouldLog("info")) {
      console.info("[INFO]", ...args);
    }
  };

  const warn = (...args) => {
    if (shouldLog("warn")) {
      console.warn("[WARN]", ...args);
    }
  };

  const error = (...args) => {
    if (shouldLog("error")) {
      console.error("[ERROR]", ...args);
    }
  };

  /**
   * Group related logs together with a title
   */
  const group = (title, fn, collapsed = false) => {
    if (!isEnabled) return;

    const groupFn = collapsed ? console.groupCollapsed : console.group;
    groupFn(`[GROUP] ${title}`);

    try {
      fn();
    } finally {
      console.groupEnd();
    }
  };

  return {
    debug,
    log,
    info,
    warn,
    error,
    group,
    isEnabled,
    setEnabled,
    logLevel,
    setLogLevel,
  };
};

export default useLogger;
