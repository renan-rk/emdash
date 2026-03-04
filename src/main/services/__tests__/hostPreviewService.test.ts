import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { hostPreviewService } from '../hostPreviewService';

const makeMissingPath = () =>
  path.join(
    os.tmpdir(),
    `emdash-host-preview-missing-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

describe('hostPreviewService', () => {
  it('fails start gracefully for invalid task path without throwing', async () => {
    const taskId = `preview-start-${Date.now()}`;
    const missingPath = makeMissingPath();
    const events: Array<{ type?: string; status?: string }> = [];
    const off = hostPreviewService.onEvent((evt) => events.push(evt));
    try {
      const result = await hostPreviewService.start(taskId, missingPath);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Task path does not exist');
      expect(events.some((evt) => evt.type === 'setup' && evt.status === 'error')).toBe(true);
      expect(events.some((evt) => evt.type === 'exit')).toBe(true);
    } finally {
      off();
      hostPreviewService.stop(taskId);
    }
  });

  it('fails setup gracefully for invalid task path without throwing', async () => {
    const taskId = `preview-setup-${Date.now()}`;
    const missingPath = makeMissingPath();
    const events: Array<{ type?: string; status?: string }> = [];
    const off = hostPreviewService.onEvent((evt) => events.push(evt));
    try {
      const result = await hostPreviewService.setup(taskId, missingPath);
      expect(result.ok).toBe(false);
      expect(result.error).toContain('Task path does not exist');
      expect(events.some((evt) => evt.type === 'setup' && evt.status === 'error')).toBe(true);
      expect(events.some((evt) => evt.type === 'exit')).toBe(true);
    } finally {
      off();
      hostPreviewService.stop(taskId);
    }
  });
});
