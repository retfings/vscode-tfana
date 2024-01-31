// Import the VS Code extensibility API
import * as vscode from 'vscode';
import * as fs from 'fs';
// Function to handle document save events
function handleDocumentSave(textDocument: vscode.TextDocument) {

    // Check if the saved document is a Python file
    if (textDocument.languageId === 'python') {
        // Show an information message when a Python file is saved

        // Your existing logic for handling document save
        console.log('Document saved:', textDocument.fileName);
        // vscode.window.showInformationMessage('Save OK!');

        // Additional logic for removing duplicate imports
        removeDuplicateImports(textDocument.uri);
    }
}

function handleFileCreation(uri: vscode.Uri) {
    // Check if the created file is a Python file
    if (uri.fsPath.endsWith('.py')) {
        // Show an information message
        vscode.window.showInformationMessage('Creating Python file...');

        // Shebang and encoding lines
        const shebang = '#!/usr/bin/env python3';
        const encoding = '# -*- coding: UTF-8 -*-';

        // Content to be written to the file
        const content = `${shebang}\n${encoding}\n`;

        // Write content to the file
        fs.writeFileSync(uri.fsPath, content, 'utf-8');

        // Show a success message
        vscode.window.showInformationMessage('Python file with shebang and encoding created!');

        // Open the newly created Python file and move the cursor to the third line
        vscode.workspace.openTextDocument(uri).then((document) => {
            vscode.window.showTextDocument(document).then((editor) => {
                const position = new vscode.Position(2, 0); // 3rd line, 1st character (zero-based index)
                const selection = new vscode.Selection(position, position);
                editor.selection = selection;
            });
        });
    }
}

function removeDuplicateImports(uri: vscode.Uri) {
    // Check if the file is a Python file
    if (uri.fsPath.endsWith('.py')) {
        // Read the content of the file
        const content = fs.readFileSync(uri.fsPath, 'utf-8');

        // Use a Set to store unique import statements
        const uniqueImports = new Set<string>();

        // Use a regular expression to find and filter duplicate import statements
        const importRegex = /^(\s*from .* import .*|^(\s*)import .*)$/gm;
        const uniqueContent = content.replace(importRegex, (match) => {
            // Extract the import statement without leading/trailing whitespaces
            const trimmedMatch = match.trim();

            // Check if the import statement is already in the Set
            if (!uniqueImports.has(trimmedMatch)) {
                uniqueImports.add(trimmedMatch);
                return match;
            }

            return '';
        });

        // Write the modified content back to the file
        fs.writeFileSync(uri.fsPath, uniqueContent, 'utf-8');

        // Show an information message
        // vscode.window.showInformationMessage('Duplicate imports removed!');
    }
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    // Output a message to the console when the extension is activated
    // Register the onDidSaveTextDocument event
    vscode.workspace.onDidSaveTextDocument(handleDocumentSave);
}

// This method is called when your extension is deactivated
export function deactivate() { }
