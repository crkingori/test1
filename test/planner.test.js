const test = require('node:test');
const assert = require('node:assert/strict');
const { suggestOutdoorPlan } = require('../src/planner');

test('returns a hike plan with bounded duration', () => {
  const result = suggestOutdoorPlan({
    activityType: 'hike',
    minutesAvailable: 25,
    weatherTolerance: 'high',
  });

  assert.equal(result.activity, 'Local Trail Hike');
  assert.equal(result.durationMinutes, 25);
  assert.ok(result.plan.length >= 3);
  assert.match(result.weatherTip, /longer route/i);
});

test('falls back to walk for unknown activities', () => {
  const result = suggestOutdoorPlan({ activityType: 'unknown' });
  assert.equal(result.activity, 'Neighborhood Walk');
});

test('clamps invalid minutes to safe bounds', () => {
  const result = suggestOutdoorPlan({ minutesAvailable: 9999 });
  assert.equal(result.durationMinutes, 240);
});
