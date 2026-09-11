import re

with open("tests/unit/selection.test.ts", "r") as f:
    content = f.read()

mock_import = """import { vi } from 'vitest';
vi.mock('../../src/dictionary', () => ({
  lookupPali: vi.fn().mockResolvedValue({
    h: 'test',
    en: 'test',
    pt: 'test',
    es: 'test'
  })
}));"""

content = content.replace("import { describe, it, expect, vi, beforeEach } from 'vitest';", "import { describe, it, expect, vi, beforeEach } from 'vitest';\n" + mock_import)

with open("tests/unit/selection.test.ts", "w") as f:
    f.write(content)

