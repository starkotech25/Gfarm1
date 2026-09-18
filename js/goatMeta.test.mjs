import test from 'node:test';
import assert from 'node:assert/strict';

import { getNextSuggestedGoatId, GOAT_BREEDS } from './goatMeta.js';

test('next goat tag suggestion jumps to the first free number', () => {
  assert.equal(getNextSuggestedGoatId(['GF-001', 'GF-002', 'GF-003']), 'GF-004');
  assert.equal(getNextSuggestedGoatId(['GF-001', 'GF-003', 'GF-007']), 'GF-002');
  assert.equal(getNextSuggestedGoatId(['GF-007']), 'GF-008');
});

test('breed list includes common goat breeds from around the world', () => {
  assert.ok(GOAT_BREEDS.includes('Sirohi'));
  assert.ok(GOAT_BREEDS.includes('Boer'));
  assert.ok(GOAT_BREEDS.includes('Alpine'));
  assert.ok(GOAT_BREEDS.includes('Nubian'));
});
