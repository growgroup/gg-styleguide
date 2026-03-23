---
name: figma-to-pug-scss
description: Implement Figma designs as Pug/SCSS in this repository. Use when user provides a Figma URL or asks design implementation for this project. Run figma-mcp-core first, then follow .cursor/docs rules for Pug/SCSS implementation.
metadata:
  mcp-server: user-figma, figma, figma-desktop
---

# Figma to Pug/SCSS

このスキルは「Pug/SCSS 実装規約」の適用に特化する。
Figma 取得工程は共通スキルを使う。

## 前提

- 先に `.cursor/skills/figma-mcp-core/SKILL.md` を実行し、設計情報とスクリーンショットを取得済みであること
- 規約の正:
  - `.cursor/docs/COMPONENT_STYLING.md`
  - `.cursor/docs/PUG_RULE.md`
  - `.cursor/docs/SCSS_RULE.md`

## 実装フロー（順守）

1. **実装先の確定**
   - 実装先 `.pug` が未定なら、最初に 1 回だけユーザーへ確認する。

2. **規約読込**
   - 上記 4 ドキュメントを読み、命名・mixin・配置・禁止事項を確定する。

3. **Pug 実装**
   - `+c/+e/+l/+pr`、`+a/+ae`、`+img/+picture` を優先して使う。
   - 見出し・本文・リストなどの意味的タグを守る。

4. **SCSS 実装**
   - FLOCSS + BEM に従う（`l-`/`c-`/`p-`/`u-` + `.is-*`）。
   - 既存 token/mixin を優先し、必要最小限で調整する。
   - 新規 SCSS を追加した場合は該当 `_index.scss` に `@import` を追加する。

5. **アセット運用（このプロジェクト方針）**
   - 必要な画像・SVG は原則プレースホルダーで対処する。

6. **照合**
   - Figma スクリーンショットを基準に 1:1 視覚一致を確認する。

## 補足

- Figma MCP 出力（React/Tailwind 等）は参考情報として扱い、最終コードは必ず本プロジェクトの Pug/SCSS 規約に合わせる。
- 取得系の手順（`get_design_context`、`get_metadata`、`get_screenshot`）は本スキルに重複記載しない。必要時は `figma-mcp-core` を参照する。

