#!/usr/bin/env node

/**
 * Ensure HTML comments are surrounded by newlines so they appear
 * on their own lines once js-beautify formats the file.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

/**
 * Recursively collect all HTML files.
 * @param {string} dir
 * @returns {string[]}
 */
function collectHtmlFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectHtmlFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
  });
}

/**
 * Insert newline characters before/after comments that share a line
 * with other markup.
 * @param {string} source
 * @returns {string}
 */
function enforceCommentSpacing(source) {
  let result = source.replace(/(\S[^\r\n]*?)<!--/g, '$1\n<!--');
  result = result.replace(/-->([^\r\n]*?\S)/g, '-->\n$1');
  return result;
}

/**
 * Align standalone HTML comments to the indent level of the preceding
 * non-empty line. Falls back to the following non-empty line if none precedes.
 * @param {string} source
 * @returns {string}
 */
function alignCommentIndentation(source) {
  const lines = source.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (!/^[ \t]*<!--/.test(lines[i])) {
      continue;
    }

    // find previous non-empty line for indent; if not found, try next
    let indentLine = '';
    for (let j = i - 1; j >= 0; j -= 1) {
      if (lines[j].trim() !== '') {
        indentLine = lines[j];
        break;
      }
    }
    if (!indentLine) {
      for (let j = i + 1; j < lines.length; j += 1) {
        if (lines[j].trim() !== '') {
          indentLine = lines[j];
          break;
        }
      }
    }
    const indent = indentLine.match(/^[ \t]*/)?.[0] ?? '';
    lines[i] = indent + lines[i].trimStart();
  }
  return lines.join('\n');
}

/**
 * Ensure nested lists start on the next line without extra blank lines.
 * @param {string} source
 * @returns {string}
 */
function enforceNestedListSpacing(source) {
  // only adjust when nested list is on the same line; avoid touching already-split lines
  return source.replace(
    /^([ \t]*)(<li[^>]*>[^\n]*?)[ \t]*(<(?:ul|ol)\b)/gm,
    (_m, indent, liHead, nested) => `${indent}${liHead}\n${indent}\t${nested}`
  );
}

const htmlFiles = collectHtmlFiles(DIST_DIR);

htmlFiles.forEach((filePath) => {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = enforceNestedListSpacing(
    alignCommentIndentation(enforceCommentSpacing(original))
  );
  if (original !== updated) {
    fs.writeFileSync(filePath, updated, 'utf8');
    // console.log(`comment spacing fixed: ${path.relative(ROOT_DIR, filePath)}`);
  }
});
