---
name: webcore-vitals
description: Use when measuring or improving Web Core Vitals (LCP/CLS/INP) for pages built with this Pug+SCSS template. Measures the local dev server (npm start) via chrome-devtools-mcp, diagnoses bottlenecks against this template's files, and proposes fixes (does not auto-apply).
---

# Web Core Vitals 計測・改善

## いつ使うか
このテンプレで作ったページの Web Core Vitals（LCP / CLS / INP）を実測し、
Good 基準をクリアするための修正提案が欲しいとき。計測は chrome-devtools-mcp（Google 製）を使う。

**関連:** GSAP のパフォーマンス改善は `.claude/skills/gsap-performance` を参照。

## スコープ
計測 → 診断 → 修正提案まで。**修正は自動適用しない**（適用・検証は担当者）。適用後は再計測して判定を更新する。

## 前提チェック（最初に必ず）
1. **chrome-devtools-mcp が使えるか** を確認する。使えなければ `references/mcp-setup.md` の手順を案内し、導入後に再開する。
2. **開発サーバーが起動しているか** を確認する。`http://localhost:3000` に到達できなければ、ユーザーに `npm start` の実行を依頼する（このスキルはサーバーを勝手に起動しない）。
3. chrome-devtools-mcp の**ツール一覧を確認**し、以下で使う機能（ページ操作 / performance トレース / エミュレーション / ネットワーク・コンソール取得）の実際のツール名・引数を把握する。

## 計測ワークフロー
1. **対象ページ確定**: 開発中のパス（例 `/`, `/case/`, `/contact/`）をユーザーに確認。デフォルトは直近編集ページ。
2. **ページを開く**: `http://localhost:3000<path>` を新規ページで開く。
3. **モバイル条件を再現**: ネットワークを Slow 4G、CPU を 4x スローダウンにエミュレート（`references/thresholds.md`）。**必須**。
4. **ロード系計測（LCP / CLS / FCP / TTFB）**: リロード込みの performance トレースを取得し、LCP・CLS と各 insight（render-blocking、LCP breakdown、layout shift culprits 等）を回収する。FCP・TTFB はトレース/insight から得られる値を拾う。MCP のバージョンによって離散値として直接出ない場合は、insight・ネットワーク情報から近似し「参考値」として扱う（`references/thresholds.md` でも参考扱い）。
5. **INP 計測**: 対象ページの代表的 UI 操作（メニュー開閉・カルーセル送り・モーダル起動等）を実行して応答性を計測する。操作対象が無いページは「INP は要フィールド計測」と注記してスキップ。
6. **補助データ**: ネットワークリクエスト一覧（重い画像・フォント・JS の特定）とコンソールメッセージ（エラー/警告）を取得する。
7. **判定**: `references/thresholds.md` の Good しきい値と突き合わせ、各指標を 🟢 Good / 🟡 Needs Improvement / 🔴 Poor に分類する。

## 診断と提案
回収した insight・ネットワーク情報を `references/stack-playbook.md` に従い、本テンプレの実ファイル/mixin/設定に紐づけた修正提案へ翻訳する。提案は効果の大きい順、該当を `file_path:line` 形式で明示する。

## 出力レポート
Notion 貼り付け可能な Markdown で次を出力する:
- 計測条件（localhost:3000 / Slow 4G + 4x CPU / ラボ計測）
- 判定サマリ表（指標・実測・基準・判定）
- ボトルネックと修正提案（優先度順・該当ファイル/行・効果目安）
- 注意書き（**必須**）: 「ラボ計測です。実ユーザー値(CrUX/フィールド)とは異なります。INP は近似」「修正の適用・検証は担当者が実施してください（AI 出力は要検証）」

## 注意
- 計測はラボ値。フィールド値とは別物であることを常に明示する。
- 修正は提案まで。適用しない。
