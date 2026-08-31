const { spawnSync } = require('child_process');

const name = process.argv[2];
if (!name) {
  console.error('Usage: npm run migrate:new -- <name>');
  process.exit(1);
}

const result = spawnSync(
  'npx',
  [
    'db-migrate',
    'create',
    name,
    '--sql-file',
    '-m',
    'src/infrastructure/data-access/mysql/migrations',
    '--config',
    'src/infrastructure/data-access/mysql/database.json',
  ],
  { stdio: 'inherit', shell: true },
);

process.exit(result.status ?? 1);
