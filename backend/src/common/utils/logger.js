const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

function stamp() {
  return `${c.dim}${new Date().toLocaleTimeString()}${c.reset}`;
}

export const log = {
  info(msg) {
    console.log(`${stamp()} ${c.cyan}ℹ${c.reset}  ${msg}`);
  },
  success(msg) {
    console.log(`${stamp()} ${c.green}✔${c.reset}  ${msg}`);
  },
  warn(msg) {
    console.log(`${stamp()} ${c.yellow}⚠${c.reset}  ${msg}`);
  },
  error(msg) {
    console.log(`${stamp()} ${c.red}✖${c.reset}  ${msg}`);
  },
  server({ port, env }) {
    console.log("");
    console.log(`  ${c.bold}${c.green}Booking API${c.reset}`);
    console.log(
      `  ${c.dim}────────────────────────────${c.reset}`
    );
    console.log(
      `  ${c.cyan}Local${c.reset}   ${c.bold}http://localhost:${port}${c.reset}`
    );
    console.log(`  ${c.cyan}Env${c.reset}     ${env}`);
    console.log("");
  },
};
