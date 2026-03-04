import { describe, expect, it } from 'vitest';
import { buildCommandExistsProbe, quoteOpenInPath } from '../openInShell';

describe('openInShell', () => {
  it('uses cmd.exe-style quoting on Windows', () => {
    expect(quoteOpenInPath('C:\\Users\\renan\\My "Repo"', 'win32')).toBe(
      '"C:\\Users\\renan\\My ""Repo"""'
    );
  });

  it('uses POSIX single-quote escaping on Unix-like platforms', () => {
    expect(quoteOpenInPath("/tmp/repo/it's-here", 'linux')).toBe("'/tmp/repo/it'\\''s-here'");
  });

  it('builds the command existence probe per platform', () => {
    expect(buildCommandExistsProbe('code', 'win32')).toBe('where code >nul 2>&1');
    expect(buildCommandExistsProbe('code', 'darwin')).toBe('command -v code >/dev/null 2>&1');
  });
});
