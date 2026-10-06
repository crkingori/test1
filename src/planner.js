function suggestOutdoorPlan({
  activityType = 'walk',
  minutesAvailable = 30,
  weatherTolerance = 'mild',
} = {}) {
  const normalizedActivity = String(activityType).toLowerCase();
  const normalizedTolerance = String(weatherTolerance).toLowerCase();
  const safeMinutes = Number.isFinite(minutesAvailable)
    ? Math.max(10, Math.min(240, Math.round(minutesAvailable)))
    : 30;

  const activityCatalog = {
    hike: {
      title: 'Local Trail Hike',
      checklist: ['Water bottle', 'Comfortable shoes', 'Small snack', 'Charged phone'],
      quickStart: 'Pick the closest marked trail and start with a short loop.',
    },
    run: {
      title: 'Outdoor Run',
      checklist: ['Running shoes', 'Water', 'Light layer'],
      quickStart: 'Start with a gentle warm-up jog for 5 minutes.',
    },
    birding: {
      title: 'Birdwatching Session',
      checklist: ['Binoculars (optional)', 'Notebook or notes app', 'Quiet route'],
      quickStart: 'Head to trees or water and pause every 5 minutes to listen.',
    },
    garden: {
      title: 'Garden Sprint',
      checklist: ['Gloves', 'Hand trowel', 'Compost or water can'],
      quickStart: 'Focus on one bed: weed, water, and plant one item.',
    },
    walk: {
      title: 'Neighborhood Walk',
      checklist: ['Walking shoes', 'Water bottle'],
      quickStart: 'Take a route with parks or tree-lined streets.',
    },
  };

  const selected = activityCatalog[normalizedActivity] || activityCatalog.walk;

  const weatherTipMap = {
    low: 'Choose shaded routes and keep it brief if weather is rough.',
    mild: 'Dress in layers and pick a route with easy return options.',
    high: 'You can commit to a longer route and bring extra water.',
  };

  const weatherTip =
    weatherTipMap[normalizedTolerance] || weatherTipMap.mild;

  const warmup = Math.min(10, Math.max(3, Math.round(safeMinutes * 0.15)));
  const main = Math.max(5, safeMinutes - warmup - 5);

  return {
    activity: selected.title,
    durationMinutes: safeMinutes,
    plan: [
      `Warm up for ${warmup} minutes.`,
      `Main activity for ${main} minutes.`,
      'Cool down for 5 minutes and log one highlight.',
    ],
    checklist: selected.checklist,
    quickStart: selected.quickStart,
    weatherTip,
  };
}

module.exports = { suggestOutdoorPlan };
