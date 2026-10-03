import { Segment } from '../../types/models';

export async function loadChapter(id: string): Promise<Segment[]> {
  switch (id) {
    case 'ch01': return require('./ch01.json');
    case 'ch02': return require('./ch02.json');
    case 'ch03': return require('./ch03.json');
    case 'ch04': return require('./ch04.json');
    case 'ch05': return require('./ch05.json');
    case 'ch06': return require('./ch06.json');
    case 'ch07': return require('./ch07.json');
    case 'ch08': return require('./ch08.json');
    case 'ch09': return require('./ch09.json');
    default:
      console.warn(`Chapter ${id} not found, falling back to empty array.`);
      return [];
  }
}
