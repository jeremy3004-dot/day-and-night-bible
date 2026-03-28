import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldHideTabBarOnNestedRoute } from './tabBarVisibility';

test('shouldHideTabBarOnNestedRoute only hides the root tabs for the active Bible reader session', () => {
  assert.equal(shouldHideTabBarOnNestedRoute(undefined), false);
  assert.equal(shouldHideTabBarOnNestedRoute('BibleBrowser'), false);
  assert.equal(shouldHideTabBarOnNestedRoute('ChapterSelector'), false);
  assert.equal(shouldHideTabBarOnNestedRoute('BibleReader'), true);
  assert.equal(shouldHideTabBarOnNestedRoute('MeditationJourney'), true);
  assert.equal(shouldHideTabBarOnNestedRoute('PrayerJourney'), true);
});

test('shouldHideTabBarOnNestedRoute keeps the shell visible for legacy lesson detail routes', () => {
  assert.equal(shouldHideTabBarOnNestedRoute('LessonDetail'), false);
});

test('shouldHideTabBarOnNestedRoute keeps the tab bar visible for other nested routes', () => {
  assert.equal(shouldHideTabBarOnNestedRoute('GatherHome'), false);
  assert.equal(shouldHideTabBarOnNestedRoute('PrayerWall'), false);
  assert.equal(shouldHideTabBarOnNestedRoute('GroupList'), false);
  assert.equal(shouldHideTabBarOnNestedRoute('GroupDetail'), false);
  assert.equal(shouldHideTabBarOnNestedRoute('ReadingPlanList'), false);
});
