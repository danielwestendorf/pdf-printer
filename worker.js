const debug           = require('debug')('pdf:worker');
const { exec, spawn } = require('child_process');

debug("Starting processor...");
const processor = spawn('node', ['process.js'], { env: process.env, stdio: 'inherit' });

setInterval(() => {
  debug("Retrying failed pings...");
  exec('pdf-bot', ['-c', './pdf-bot.config.js', 'ping:retry-failed']);
}, 10000);
