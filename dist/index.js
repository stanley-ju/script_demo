"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get input from the workflow file: path
            const pathToScan = core.getInput('path', { required: true });
            // Function to generate file tree
            function generateFileTree(directory) {
                const files = fs.readdirSync(directory);
                const tree = [];
                files.forEach(file => {
                    const res = path.join(directory, file);
                    const fileStatus = fs.statSync(res);
                    if (fileStatus.isDirectory()) {
                        tree.push(`${file}/`);
                        const subTree = generateFileTree(res);
                        tree.push(...subTree.map(subFile => `  ${subFile}`));
                    }
                    else {
                        tree.push(file);
                    }
                });
                return tree;
            }
            // Generate file tree and output it
            const fileTree = generateFileTree(pathToScan);
            core.setOutput('file-tree', fileTree.join('\n'));
            console.log(fileTree.join('\n'));
            console.log('Hello World');
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
