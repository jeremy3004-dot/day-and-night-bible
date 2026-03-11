import { normalizePrivacyPin, validatePrivacyPin } from './privacyMode';
import type { PrivacyAppIconMode } from '../../types';

interface PrivacySettingsSavePlanInput {
  currentMode: PrivacyAppIconMode;
  hasExistingPin: boolean;
  selectedMode: PrivacyAppIconMode;
  pinInput: string;
  pinConfirmation: string;
}

type PrivacySaveInput =
  | {
      mode: 'standard';
    }
  | {
      mode: 'discreet';
      pinInput: string;
    };

export type PrivacySettingsSavePlan =
  | {
      type: 'noop';
    }
  | {
      type: 'error';
      errorKey: string;
    }
  | {
      type: 'save';
      input: PrivacySaveInput;
    };

export const getPrivacySettingsSavePlan = ({
  currentMode,
  hasExistingPin,
  selectedMode,
  pinInput,
  pinConfirmation,
}: PrivacySettingsSavePlanInput): PrivacySettingsSavePlan => {
  const hasTypedPin = pinInput.trim().length > 0 || pinConfirmation.trim().length > 0;

  if (selectedMode === 'standard') {
    if (currentMode === 'standard') {
      return {
        type: 'noop',
      };
    }

    return {
      type: 'save',
      input: {
        mode: 'standard',
      },
    };
  }

  if (currentMode === 'discreet' && hasExistingPin && !hasTypedPin) {
    return {
      type: 'noop',
    };
  }

  const normalizedPin = normalizePrivacyPin(pinInput);
  const normalizedConfirmation = normalizePrivacyPin(pinConfirmation);

  if (normalizedPin !== normalizedConfirmation) {
    return {
      type: 'error',
      errorKey: 'privacy.pinMismatch',
    };
  }

  const validation = validatePrivacyPin(normalizedPin);
  if (!validation.isValid || !validation.normalized) {
    return {
      type: 'error',
      errorKey: validation.errorKey ?? 'privacy.pinTooShort',
    };
  }

  return {
    type: 'save',
    input: {
      mode: 'discreet',
      pinInput: validation.normalized,
    },
  };
};
