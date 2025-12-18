export interface Logger {
  trace(message: string, ...interpolationValues: unknown[]): void;
  trace(data: unknown, message: string, ...interpolationValues: unknown[]): void;

  debug(message: string, ...interpolationValues: unknown[]): void;
  debug(data: unknown, message: string, ...interpolationValues: unknown[]): void;

  info(message: string, ...interpolationValues: unknown[]): void;
  info(data: unknown, message: string, ...interpolationValues: unknown[]): void;

  warn(message: string, ...interpolationValues: unknown[]): void;
  warn(data: unknown, message: string, ...interpolationValues: unknown[]): void;

  error(message: string, ...interpolationValues: unknown[]): void;
  error(data: unknown, message: string, ...interpolationValues: unknown[]): void;

  fatal(message: string, ...interpolationValues: unknown[]): void;
  fatal(data: unknown, message: string, ...interpolationValues: unknown[]): void;
}
