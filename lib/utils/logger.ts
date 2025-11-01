/**
 * Structured logging utility
 * Provides consistent logging interface with log levels
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  context?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Gets the minimum log level from environment
 * Defaults to 'info' in development, 'warn' in production
 */
function getMinLogLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase();
  if (envLevel === 'error' || envLevel === 'warn' || envLevel === 'info') {
    return envLevel;
  }
  return process.env.NODE_ENV === 'production' ? 'warn' : 'info';
}

const minLogLevel: LogLevel = getMinLogLevel();

/**
 * Checks if a log level should be output based on minimum level setting
 */
function shouldLog(level: LogLevel): boolean {
  const levels: LogLevel[] = ['info', 'warn', 'error'];
  const currentLevelIndex = levels.indexOf(level);
  const minLevelIndex = levels.indexOf(minLogLevel);
  return currentLevelIndex >= minLevelIndex;
}

/**
 * Formats log message with context and metadata
 */
function formatLogMessage(
  message: string,
  context?: string,
  metadata?: Record<string, unknown>
): string {
  const timestamp = new Date().toISOString();
  const contextPrefix = context ? `[${context}]` : '';
  const metadataStr = metadata
    ? ` ${JSON.stringify(metadata)}`
    : '';
  return `[${timestamp}]${contextPrefix} ${message}${metadataStr}`;
}

/**
 * Structured logger function
 * @param message - Log message
 * @param options - Optional log options (level, context, metadata)
 */
export function logger(
  message: string,
  options: LogOptions = {}
): void {
  const { level = 'info', context, metadata } = options;

  if (!shouldLog(level)) {
    return;
  }

  const formattedMessage = formatLogMessage(message, context, metadata);

  switch (level) {
    case 'error':
      console.error(formattedMessage);
      break;
    case 'warn':
      console.warn(formattedMessage);
      break;
    case 'info':
    default:
      console.log(formattedMessage);
      break;
  }
}

/**
 * Convenience functions for different log levels
 */
export const logInfo = (message: string, context?: string, metadata?: Record<string, unknown>) => {
  logger(message, { level: 'info', context, metadata });
};

export const logWarn = (message: string, context?: string, metadata?: Record<string, unknown>) => {
  logger(message, { level: 'warn', context, metadata });
};

export const logError = (message: string, context?: string, metadata?: Record<string, unknown>) => {
  logger(message, { level: 'error', context, metadata });
};
