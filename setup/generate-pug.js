/**
 * Pug ページ一括生成スクリプト
 *
 * 概要:
 *   setup/pages.json を読み、app/<path>/index.pug を雛形ベースで生成する。
 *   既存ファイルは上書きしない（スキップ・ログのみ）。
 *
 * 実行:
 *   npm run setup  （package.json の scripts.setup から呼ばれる）
 *
 * テンプレート:
 *   setup/pug-templates.js が必須。configBlock / pageHeader / oneColumn / twoColumn を export すること。
 *   無い・不足時はエラーで終了する。
 *
 * 前提:
 *   - setup/pages.json が存在し、配列形式であること
 *   - 各要素に path, label（または title）が含まれること
 *
 * レイアウト:
 *   pages.json の各要素に "layout": "base-twocolumn" を指定すると 2 カラム用テンプレートで生成する。
 */

const fs = require("fs");
const path = require("path");

// -----------------------------------------------------------------------------
// 定数・設定（変更時はここを編集）
// -----------------------------------------------------------------------------

const ROOT = path.join(__dirname, "..");
const CONFIG_PATH = path.join(__dirname, "pages.json");
const APP_DIR = path.join(ROOT, "app");
const PREFIX = "[setup]";

const LAYOUT = {
  BASE: "base",
  TWOCOLUMN: "base-twocolumn",
};

const EXTENDS_PATH = {
  [LAYOUT.BASE]: "/inc/foundation/_base.pug",
  [LAYOUT.TWOCOLUMN]: "/inc/foundation/_base-twocolumn.pug",
};

/** 外部テンプレート（setup/pug-templates.js）。必須。無い・失敗時はエラーで終了する */
let EXTERNAL_TEMPLATES = null;
function loadExternalTemplates() {
  if (EXTERNAL_TEMPLATES !== null) return EXTERNAL_TEMPLATES;
  const templatePath = path.join(__dirname, "pug-templates.js");
  if (!fs.existsSync(templatePath)) {
    exitWithError("setup/pug-templates.js が見つかりません。ファイルを作成してください。");
  }
  try {
    EXTERNAL_TEMPLATES = require(templatePath);
  } catch (err) {
    exitWithError(`setup/pug-templates.js の読み込みに失敗しました。${err.message}`);
  }
  const required = ["configBlock", "pageHeader", "oneColumn", "twoColumn"];
  for (const key of required) {
    if (!EXTERNAL_TEMPLATES[key]) {
      exitWithError(`setup/pug-templates.js に ${key} を export してください。`);
    }
  }
  return EXTERNAL_TEMPLATES;
}

/**
 * テンプレート文字列内の {{key}} を vars[key] で置換する。
 * @param {string} str
 * @param {Record<string, string|number>} vars
 * @returns {string}
 */
function applyPlaceholders(str, vars) {
  if (typeof str !== "string") return "";
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (Object.prototype.hasOwnProperty.call(vars, key)) {
      return String(vars[key]);
    }
    return `{{${key}}}`;
  });
}

// -----------------------------------------------------------------------------
// ユーティリティ
// -----------------------------------------------------------------------------

/**
 * path 文字列を正規化する（先頭・末尾のスラッシュ除去、連続スラッシュを1つに）。
 * @param {string} p - パス文字列
 * @returns {string} 正規化されたパス（空の場合は ""）
 */
function normalizePath(p) {
  if (typeof p !== "string") return "";
  return p.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");
}

/**
 * Pug の属性値用に文字列をエスケープする。
 * @param {string|null|undefined} s
 * @returns {string}
 */
function escapePugString(s) {
  if (s == null) return "";
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * エラーメッセージを表示してプロセスを終了する。
 * @param {string} message - 表示するメッセージ（PREFIX と「エラー:」は本関数内で付与する）
 */
function exitWithError(message) {
  console.error(`${PREFIX} エラー: ${message}`);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// ページメタ情報の算出
// -----------------------------------------------------------------------------

/**
 * エントリと正規化パスからページ用のメタ情報を算出する。
 * @param {{ label?: string, title?: string, id?: string, path: string }} entry - pages.json の1要素
 * @param {string} normalizedPath - 正規化済み path
 * @returns {{ title: string, id: string, depth: number, currentPath: string, segments: string[] }}
 */
function getPageMeta(entry, normalizedPath) {
  const segments =
    normalizedPath === "" ? [] : normalizedPath.split("/").filter(Boolean);
  const title = entry.label ?? entry.title;
  const id =
    entry.id ?? (normalizedPath === "" ? "top" : segments[segments.length - 1]);
  const depth = normalizedPath === "" ? 1 : segments.length + 1;
  const currentPath = normalizedPath === "" ? "/" : `/${normalizedPath}/`;
  return { title, id, depth, currentPath, segments };
}

// -----------------------------------------------------------------------------
// Pug ブロック文字列の組み立て
// -----------------------------------------------------------------------------

/**
 * パンくずの paths 配列の中身を Pug 用文字列で組み立てる。
 * @param {number} depth - ページ階層
 * @param {string[]} segments - パスのセグメント配列
 * @param {Record<string, string>} pathToLabel - 正規化 path → label のマップ
 * @param {number} [itemIndent=8] - paths 各要素の行頭スペース数（breadcrumb のインデント揃え用）
 * @returns {string} 空文字、または "        {url: \"seg\", text: \"ラベル\"},\n" の並び（ [ ] の中身のみ）
 */
function buildBreadcrumbPathsPugString(depth, segments, pathToLabel, itemIndent = 8) {
  if (depth < 2) return "";
  const paths = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const parentPath = segments.slice(0, i + 1).join("/");
    const url = segments[i];
    const text = pathToLabel[parentPath] ?? url;
    paths.push({ url, text });
  }
  const indent = " ".repeat(itemIndent);
  return paths
    .map((p) => `${indent}{url: "${p.url}", text: "${escapePugString(p.text)}"}`)
    .join(",\n");
}

/**
 * block append config の Pug 文字列を組み立てる。
 */
function buildConfigBlock(id, title, currentPath, depth) {
  const t = loadExternalTemplates();
  return applyPlaceholders(t.configBlock, {
    id: escapePugString(id),
    title: escapePugString(title),
    currentPath: escapePugString(currentPath),
    depth,
  });
}

// -----------------------------------------------------------------------------
// レイアウト別 Pug 本文の組み立て（ブロック名は維持すること）
// -----------------------------------------------------------------------------

function buildOneColumnContent(extendsPath, configBlock, pageHeaderBlock) {
  const t = loadExternalTemplates();
  return applyPlaceholders(t.oneColumn, {
    extendsPath,
    configBlock,
    pageHeaderBlock,
  });
}

function buildTwoColumnContent(extendsPath, configBlock, pageHeaderBlock) {
  const t = loadExternalTemplates();
  return applyPlaceholders(t.twoColumn, {
    extendsPath,
    configBlock,
    pageHeaderBlock,
  });
}

// -----------------------------------------------------------------------------
// 1 ページ分の Pug 全文を生成
// -----------------------------------------------------------------------------

/**
 * 1 エントリ分の Pug 全文を生成する。
 * @param {{ label?: string, title?: string, id?: string, path: string, layout?: string }} entry
 * @param {string} normalizedPath
 * @param {Record<string, string>} pathToLabel
 * @param {string} layout - LAYOUT.BASE または LAYOUT.TWOCOLUMN
 * @returns {string}
 */
function generatePugContent(entry, normalizedPath, pathToLabel, layout) {
  const meta = getPageMeta(entry, normalizedPath);
  const { title, id, depth, currentPath, segments } = meta;

  const extendsPath = EXTENDS_PATH[layout] ?? EXTENDS_PATH[LAYOUT.BASE];
  const configBlock = buildConfigBlock(id, title, currentPath, depth);
  const pathsStr = buildBreadcrumbPathsPugString(depth, segments, pathToLabel);
  const pathsBlock =
    pathsStr === "" ? "[]" : `[\n${pathsStr}\n      ]`;
  const t = loadExternalTemplates();
  const pageHeaderBlock = applyPlaceholders(t.pageHeader, { pathsBlock });

  return layout === LAYOUT.TWOCOLUMN
    ? buildTwoColumnContent(extendsPath, configBlock, pageHeaderBlock)
    : buildOneColumnContent(extendsPath, configBlock, pageHeaderBlock);
}

// -----------------------------------------------------------------------------
// 設定の読み込み・検証
// -----------------------------------------------------------------------------

/**
 * 単一エントリの検証。保守性のため検証ルールはここに集約する。
 * @param {{ path?: string, label?: string, title?: string }} entry
 * @param {number} index
 * @returns {{ ok: true } | { ok: false, message: string }}
 */
function validateEntry(entry, index) {
  const suffix = `（該当インデックス: ${index}）`;
  const requiredMsg = `各要素に path と label（または title）が必要です。${suffix}`;
  if (entry == null || typeof entry !== "object") {
    return { ok: false, message: requiredMsg };
  }
  const pathVal = entry.path;
  const labelOrTitle = entry.label ?? entry.title;
  if (pathVal == null || pathVal === "") return { ok: false, message: requiredMsg };
  if (labelOrTitle == null || labelOrTitle === "") return { ok: false, message: requiredMsg };
  const norm = normalizePath(pathVal);
  if (norm.includes("..")) {
    return { ok: false, message: `不正な path です: "${pathVal}"。".." は使用できません。` };
  }
  return { ok: true };
}

function loadConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") {
      exitWithError("setup/pages.json が見つかりません。");
    }
    if (err instanceof SyntaxError) {
      exitWithError(
        "setup/pages.json の形式が正しくありません。JSON を確認してください。"
      );
    }
    exitWithError(`setup/pages.json を読み込めません。 ${err.message}`);
  }
}

function validateConfig(config) {
  if (!Array.isArray(config)) {
    exitWithError("setup/pages.json は配列である必要があります。");
  }
  for (let i = 0; i < config.length; i++) {
    const result = validateEntry(config[i], i);
    if (!result.ok) {
      exitWithError(result.message);
    }
  }
}

/**
 * config から path → label のマップを構築する。
 * @param {Array<{ path: string, label?: string, title?: string }>} config
 * @returns {Record<string, string>}
 */
function buildPathToLabelMap(config) {
  const pathToLabel = {};
  for (const entry of config) {
    const norm = normalizePath(entry.path);
    const label = entry.label ?? entry.title;
    if (label != null) pathToLabel[norm] = label;
  }
  return pathToLabel;
}

// -----------------------------------------------------------------------------
// 出力パス・ファイル操作
// -----------------------------------------------------------------------------

/**
 * 正規化された path から出力 Pug ファイルの絶対パスを返す。
 * @param {string} normalizedPath
 * @returns {string}
 */
function getOutputPath(normalizedPath) {
  if (normalizedPath === "") {
    return path.join(APP_DIR, "index.pug");
  }
  return path.join(APP_DIR, normalizedPath, "index.pug");
}

/**
 * 1 エントリを処理し、ファイルが存在しなければ生成する。
 * @param {object} entry
 * @param {Record<string, string>} pathToLabel
 * @param {{ created: number, skipped: number }} counts - 更新するカウンタ
 */
function processEntry(entry, pathToLabel, counts) {
  const normalizedPath = normalizePath(entry.path);
  const layout =
    entry.layout === LAYOUT.TWOCOLUMN ? LAYOUT.TWOCOLUMN : LAYOUT.BASE;
  const outPath = getOutputPath(normalizedPath);

  if (fs.existsSync(outPath)) {
    console.log(
      `${PREFIX} スキップ: ${path.relative(ROOT, outPath)}（既に存在します）`
    );
    counts.skipped++;
    return;
  }

  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = generatePugContent(
    entry,
    normalizedPath,
    pathToLabel,
    layout
  );
  fs.writeFileSync(outPath, content, "utf8");
  console.log(`${PREFIX} 作成: ${path.relative(ROOT, outPath)}`);
  counts.created++;
}

// -----------------------------------------------------------------------------
// メイン処理
// -----------------------------------------------------------------------------

function main() {
  const config = loadConfig();
  validateConfig(config);

  const pathToLabel = buildPathToLabelMap(config);
  const counts = { created: 0, skipped: 0 };

  console.log(`${PREFIX} setup/pages.json を読み込み、Pug ファイルを生成します。`);

  for (const entry of config) {
    processEntry(entry, pathToLabel, counts);
  }

  if (counts.created === 0 && counts.skipped === 0) {
    console.log(
      `${PREFIX} 完了: 対象が 0 件のため、生成・スキップはありません。`
    );
  } else {
    console.log(
      `${PREFIX} 完了: 作成 ${counts.created} 件、スキップ ${counts.skipped} 件。`
    );
  }
}

main();
