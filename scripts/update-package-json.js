
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add test script if it doesn't exist
if (!packageJson.scripts.test) {
  packageJson.scripts.test = 'vitest run';
}
if (!packageJson.scripts['test:watch']) {
  packageJson.scripts['test:watch'] = 'vitest';
}
if (!packageJson.scripts['test:coverage']) {
  packageJson.scripts['test:coverage'] = 'vitest run --coverage';
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Updated package.json with test scripts');
