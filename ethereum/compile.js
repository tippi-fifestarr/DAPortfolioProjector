// boilerplate code, uncommented.
// const path = require("path");
// const solc = require("solc");
// const fs = require("fs-extra");

// const buildPath = path.resolve(__dirname, "build");
// fs.removeSync(buildPath);

// const projectorPath = path.resolve(__dirname, "contracts", "Projector.sol");
// const source = fs.readFileSync(projectorPath, "utf8");
// const output = solc.compile(source, 1).contracts;

// fs.ensureDirSync(buildPath);

// for (let contract in output) {
//   fs.outputJsonSync(
//     path.resolve(buildPath, contract.replace(":", "") + ".json"),
//     output[contract]
//   );
// }


///@title full version here:

///@dev this time, compile our contract once, write output
// to new file inside of project and then access that compiled file 
// campaign.sol => ( _____ ) => { Projector.sol }
//feed it into solidity compiler and spit out two files to save somewhere

// step 0 import stuff
const path = require('path');
const solc = require('solc');
//gives us access to the filesystem on computer (community-made module)
const fs = require('fs-extra');

//step 1: delete the entire build folder (for while we are making changes)
//find the directory
const buildPath = path.resolve(__dirname, "build");
//the default node doesn't have a good way to remove in one command
fs.removeSync(buildPath);
//step 1 = start from scratch

//step 2: read the Projector.sol from /contracts/
const projectorPath = path.resolve(__dirname, 'contracts', 'Projector.sol');
// const projectorPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(projectorPath, 'utf8');
//step 2 = read the whole thing
//step 3: compile both contracts with the solidity compiler
const output = solc.compile(source, 1).contracts;
// contains two outputs (project and projector)
//step 3 = compile it

//step 4: write the output to the build directory
//check if it exists or create it
fs.ensureDirSync(buildPath);
// loop over the output and write to a new file in the build
for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(":", "") + '.json'),
        output[contract]
    )
}
//step 4 = compiled those json? files (abi and bytecode?)
//run to verify