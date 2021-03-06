import AppState from 'v2/models/AppState';
import { FORMS_WITHOUT_SIGNOUT, FORMS_FOR_VERIFICATION, FORMS } from 'v2/ion/RemediationConstants';

describe('v2/models/AppState', function () {
  beforeEach(() => {
    this.initAppState = (idxObj, currentFormName) => {
      const appStateData = idxObj || { idx: { actions: {} } };
      if (currentFormName) {
        appStateData.currentFormName = currentFormName;
      }
      this.appState = new AppState(appStateData);
    };
  });

  describe('shouldShowSignOutLinkInCurrentForm', () => {
    it('returns false if there are no idx.actions', () => {
      this.initAppState();
      expect(this.appState.shouldShowSignOutLinkInCurrentForm()).toBe(false);
    });
    it('returns false if idx.actions.cancel is not defined', () => {
      this.initAppState({ idx: { actions: {} } });
      expect(this.appState.shouldShowSignOutLinkInCurrentForm()).toBe(false);
    });
    it('returns false if no idx.actions.cancel is not a function', () => {
      this.initAppState({ idx: { actions: { cancel: 'invalid' } } });
      expect(this.appState.shouldShowSignOutLinkInCurrentForm()).toBe(false);
    });
    it('returns false if the currentFormName is in FORMS_WITHOUT_SIGNOUT', () => {
      this.initAppState({ idx: { actions: { cancel: () => {} } } }, FORMS_WITHOUT_SIGNOUT[0]);
      expect(this.appState.shouldShowSignOutLinkInCurrentForm()).toBe(false);
    });
    it('returns false if param hideSignOutLinkInMFA is true currentFormName is part of FORMS_FOR_VERIFICATION', () => {
      this.initAppState({ idx: { actions: { cancel: () => {} } } }, FORMS_FOR_VERIFICATION[0]);
      expect(this.appState.shouldShowSignOutLinkInCurrentForm(true)).toBe(false);
    });
    it('returns true if all conditions are met', () => {
      this.initAppState({ idx: { actions: { cancel: () => {} } } }, FORMS_FOR_VERIFICATION[0]);
      expect(this.appState.shouldShowSignOutLinkInCurrentForm()).toBe(true);
    });
    it('returns true if param hideSignOutLinkInMFA is true but currentFormName is not part of FORMS_FOR_VERIFICATION', () => {
      this.initAppState({ idx: { actions: { cancel: () => {} } } }, FORMS.DEVICE_CHALLENGE_POLL);
      expect(this.appState.shouldShowSignOutLinkInCurrentForm(true)).toBe(true);
    });
  });
});
