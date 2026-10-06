const { suggestOutdoorPlan } = require('./planner');

function parseArgs(argv) {
  const options = {
    activityType: 'walk',
    minutesAvailable: 30,
    weatherTolerance: 'mild',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--activity' && argv[i + 1]) {
      options.activityType = argv[i + 1];
      i += 1;
    } else if (arg === '--minutes' && argv[i + 1]) {
      options.minutesAvailable = Number(argv[i + 1]);
      i += 1;
    } else if (arg === '--weather' && argv[i + 1]) {
      options.weatherTolerance = argv[i + 1];
      i += 1;
    }
  }

  return options;
}

function printPlan(result) {
  console.log(`\n🌿 TrailBuddy Plan: ${result.activity}`);
  console.log(`Duration: ${result.durationMinutes} minutes`);
  console.log(`Weather tip: ${result.weatherTip}\n`);

  console.log('Steps:');
  result.plan.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`);
  });

  console.log('\nChecklist:');
  result.checklist.forEach((item) => console.log(`- ${item}`));

  console.log(`\nQuick start: ${result.quickStart}\n`);
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  const result = suggestOutdoorPlan(options);
  printPlan(result);
}

module.exports = { parseArgs, printPlan };
