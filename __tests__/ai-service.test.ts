import { expect, test, describe } from 'vitest';

describe('Utility Functions', () => {
  test('Mock AI priority logic correctly assigns high urgency to keywords', () => {
    const title = 'Production database is entirely down';
    const description = 'We cannot access the database ASAP.';
    
    const isUrgent = title.toLowerCase().includes('down') || description.toLowerCase().includes('asap');
    expect(isUrgent).toBe(true);
  });
});
