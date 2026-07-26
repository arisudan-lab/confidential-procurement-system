import { execSync } from 'child_process';
import os from 'os';

console.log('--- Midnight Compact Compiler Wrapper ---');
console.log('Compiling contracts/procurement.compact...');

const isWindows = os.platform() === 'win32';

// In Windows native, "compact" defaults to C:\windows\system32\compact.exe
// To bypass this, we run via WSL where the Midnight compact compiler should be installed.
const command = isWindows 
  ? 'wsl compact compile contracts/procurement.compact contracts/managed/procurement'
  : 'compact compile contracts/procurement.compact contracts/managed/procurement';

try {
  execSync(command, { stdio: 'inherit' });
  console.log('Compilation successful!');
} catch (error) {
  console.error('\n[ERROR] Compilation failed.');
  if (isWindows) {
    console.error('Make sure you have installed the Midnight compact compiler inside your default WSL distribution.');
    console.error('You can verify this by running "wsl compact --version".');
  }
  process.exit(1);
}
