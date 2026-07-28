---
name: figma-mcp-core
description: Core workflow for Figma MCP operations. Use when a task starts from Figma (URL or selected node) and you need to extract node IDs, fetch design context, capture screenshots, split large responses, and prepare asset decisions before implementation.
metadata:
  mcp-server: figma, figma-desktop, user-figma
---

# Figma MCP Core

Figma 実装タスクの「取得工程」だけを扱う共通スキル。実装規約（React/Pug/SCSS など）は各派生スキルで扱う。

## 取得フロー（順守）

1. **Node の特定**
   - URL がある場合は `fileKey` と `nodeId` を抽出する。
   - URL 形式: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
   - `figma-desktop` でノード選択済みの場合は、選択ノードを使う（必要なら `nodeId` のみ）。

2. **設計データの取得**
   - `get_design_context(fileKey, nodeId)` を実行する。
   - 返却が大きい/欠落する場合は次を行う:
     1. `get_metadata(fileKey, nodeId)` で子ノード構造を確認
     2. 必要な子ノードのみ `get_design_context` を再実行

3. **視覚参照の取得**
   - `get_screenshot(fileKey, nodeId)` を実行する。
   - 実装中と最終確認で同一スクリーンショットを基準にする。

4. **アセット方針の決定**
   - まずプロジェクト固有スキルの方針に従う（優先）。
   - 方針が未定義なら以下を既定とする:
     - MCP が返す `localhost` アセットを優先使用
     - 新規 icon package の追加はしない
     - `localhost` ソースがあるのにプレースホルダー化しない

## このスキルの出力

後続スキルに引き渡す情報を明示してから実装へ進む:

- 対象 `fileKey` / `nodeId`
- 参照対象の子ノード一覧（分割取得した場合）
- 比較基準のスクリーンショット
- 採用したアセット方針（プロジェクト固有 or 既定）

