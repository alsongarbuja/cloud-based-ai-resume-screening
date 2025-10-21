
import { LOG_LEVELS, type LogLevel } from '@/config/constants';

interface LogContext {
  [key: string]: unknown;
}

interface LogOptions {
  context?: LogContext;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isServer = typeof window === 'undefined';
  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const env = this.isServer ? '[Server]' : '[Client]';

    let formatted = `${timestamp} ${env} [${level.toUpperCase()}] ${message}`;

    if (options?.context) {
      formatted += `\nContext: ${JSON.stringify(options.context, null, 2)}`;
    }

    return formatted;
  }


  error(message: string, options?: LogOptions): void {
    const formatted = this.formatMessage(LOG_LEVELS.ERROR, message, options);
    console.error(formatted);

    if (options?.error) {
      console.error('Error details:', options.error);
      console.error('Stack trace:', options.error.stack);
    }

    if (!this.isDevelopment && typeof window !== 'undefined') {
     
    }
  }


  warn(message: string, options?: LogOptions): void {
    const formatted = this.formatMessage(LOG_LEVELS.WARN, message, options);
    console.warn(formatted);

    if (options?.error) {
      console.warn('Error details:', options.error);
    }
  }

  info(message: string, options?: LogOptions): void {
    if (!this.isDevelopment) return;

    const formatted = this.formatMessage(LOG_LEVELS.INFO, message, options);
    console.log(formatted);
  }


  debug(message: string, options?: LogOptions): void {
    if (!this.isDevelopment) return;

    const formatted = this.formatMessage(LOG_LEVELS.DEBUG, message, options);
    console.debug(formatted);
  }

  query(operation: string, collection: string, filters?: Record<string, unknown>): void {
    if (!this.isDevelopment) return;

    this.debug(`Database ${operation}`, {
      context: {
        collection,
        filters,
      },
    });
  }

  api(method: string, path: string, statusCode?: number, duration?: number): void {
    if (!this.isDevelopment) return;

    this.info(`API ${method} ${path}`, {
      context: {
        statusCode,
        duration: duration ? `${duration}ms` : undefined,
      },
    });
  }
}

export const logger = new Logger();

export const { error, warn, info, debug, query, api } = logger;
