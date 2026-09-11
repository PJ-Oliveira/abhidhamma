import { describe, it, expect } from 'vitest';
import { initExportPanel } from '../../src/export.js';
import type { Manifest } from '../../src/types.js';

describe('Export UI Panel', () => {
  it('should render the export panel UI', () => {
    const container = document.createElement('div');
    const mockManifest: Manifest = {
      groups: {
        'Test Group': [
          {
            id: 'test-work',
            title: 'Test Work',
            parts: {}
          }
        ]
      }
    };
    
    initExportPanel(mockManifest, container, () => 'test-work');
    
    expect(container.innerHTML).toContain('Test Work');
  });
});
