import type { PlatformKey } from '@shared/openInApps';

/**
 * Build a shell-safe path argument for the current platform.
 * Windows uses cmd.exe quoting rules; POSIX uses single-quote escaping.
 */
export function quoteOpenInPath(pathValue: string, platform: PlatformKey): string {
  if (platform === 'win32') {
    return `"${pathValue.replace(/"/g, '""')}"`;
  }
  return `'${pathValue.replace(/'/g, "'\\''")}'`;
}

/**
 * Build the command probe used to verify whether a CLI exists on PATH.
 */
export function buildCommandExistsProbe(cmd: string, platform: PlatformKey): string {
  if (platform === 'win32') {
    return `where ${cmd} >nul 2>&1`;
  }
  return `command -v ${cmd} >/dev/null 2>&1`;
}
