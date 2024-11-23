import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  try {
    // Get input from the workflow file: path
    const pathToScan = core.getInput('path', { required: true });

    // Function to generate file tree
    function generateFileTree(directory: string): string[] {
      const files = fs.readdirSync(directory);
      const tree: string[] = [];
      files.forEach(file => {
        const res = path.join(directory, file);
        const fileStatus = fs.statSync(res);
        if (fileStatus.isDirectory()) {
          tree.push(`${file}/`);
          const subTree = generateFileTree(res);
          tree.push(...subTree.map(subFile => `  ${subFile}`));
        } else {
          tree.push(file);
        }
      });
      return tree;
    }

    // Generate file tree and output it
    const fileTree = generateFileTree(pathToScan);
    core.setOutput('file-tree', fileTree.join('\n'));
    console.log(fileTree.join('\n'));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();