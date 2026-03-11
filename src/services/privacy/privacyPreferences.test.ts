import test from 'node:test';
import assert from 'node:assert/strict';
import { getPrivacySettingsSavePlan } from './privacyPreferences';

test('switching from standard to discreet mode requires and returns a normalized matching pin', () => {
  assert.deepEqual(
    getPrivacySettingsSavePlan({
      currentMode: 'standard',
      hasExistingPin: false,
      selectedMode: 'discreet',
      pinInput: '12x4',
      pinConfirmation: '12*4',
    }),
    {
      type: 'save',
      input: {
        mode: 'discreet',
        pinInput: '12*4',
      },
    }
  );
});

test('rejects mismatched discreet-mode pin confirmation', () => {
  assert.deepEqual(
    getPrivacySettingsSavePlan({
      currentMode: 'standard',
      hasExistingPin: false,
      selectedMode: 'discreet',
      pinInput: '12+4',
      pinConfirmation: '12+5',
    }),
    {
      type: 'error',
      errorKey: 'privacy.pinMismatch',
    }
  );
});

test('allows a no-op save when discreet mode is already active and the pin is unchanged', () => {
  assert.deepEqual(
    getPrivacySettingsSavePlan({
      currentMode: 'discreet',
      hasExistingPin: true,
      selectedMode: 'discreet',
      pinInput: '',
      pinConfirmation: '',
    }),
    {
      type: 'noop',
    }
  );
});

test('switching back to standard mode produces a standard save action', () => {
  assert.deepEqual(
    getPrivacySettingsSavePlan({
      currentMode: 'discreet',
      hasExistingPin: true,
      selectedMode: 'standard',
      pinInput: '',
      pinConfirmation: '',
    }),
    {
      type: 'save',
      input: {
        mode: 'standard',
      },
    }
  );
});
