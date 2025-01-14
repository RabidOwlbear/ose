const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

/**
 * @typedef {{dataPath: string; symLinkName: string;}} FoundryConfig
 */

const argv = yargs(hideBin(process.argv))
  .option("clean", {
    alias: "c",
    type: "boolean",
    default: false,
  })
  .parseSync();

/**
 * @type {FoundryConfig}
 */
const foundryConfig = fs.readJSONSync(
  path.resolve(__dirname, "..", "foundryconfig.json")
);

const linkDirectory = path.resolve(
  foundryConfig.dataPath,
  "Data",
  "systems",
  foundryConfig.symLinkName
);

function createSymlink() {
  console.log(`Linking dist to ${linkDirectory}.`);
  const systemsDirectory = path.resolve(linkDirectory, "..");
  if (!fs.pathExistsSync(systemsDirectory)) {
    throw new Error(
      `Link directory parent folder "${systemsDirectory}" not found.`
    );
  }

  if (!fs.existsSync(linkDirectory)) {
    // link path doesn't exist, create it.
    fs.symlinkSync(path.resolve(__dirname, ".."), linkDirectory);
  }
}

function removeSymlink() {
  console.log(`Removing build in ${linkDirectory}.`);
  fs.removeSync(linkDirectory);
}

if (argv.clean) {
  removeSymlink();
} else {
  createSymlink();
}
