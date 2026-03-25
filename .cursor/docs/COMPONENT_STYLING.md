## COMPONENT_STYLING.md

このドキュメントは、本リポジトリで **新規コンポーネントのスタイル（SCSS）を作成/拡張** する際に、既存コードベースの思想・設計・運用を引き継ぐための手順書です。

---

### 0. 対象とゴール

- **対象**: Figma（`figma.com/design/`）を元に、`pug + scss` で新規/改修するケース
- **ゴール**: 1:1の見た目に寄せつつ、既存の **FLOCSS + BEM / token運用 / mixin運用 / 低詳細度設計** を崩さずに実装できる状態にする

---

### 1. まず読む（既存ルールの正）

このドキュメントは「要約＋実装時の判断基準」です。詳細ルールは以下を正とします。

- **Figma→実装フロー**: `.cursor/skills/figma-to-pug-scss/SKILL.md`（スキル）および `.cursor/rules/figma-pug-scss.mdc`（ルール）
- **Pugルール**: `.cursor/docs/PUG_RULE.md`
- **SCSSルール**: `.cursor/docs/SCSS_RULE.md`

---

### 2. このプロジェクトのSCSS構造（importと置き場所）

- **エントリ**: `app/assets/scss/style.scss`
  - `foundation/` → `layout/` → `object/components/` → `object/project/` → `object/utility/` の順で読み込まれる
- **汎用コンポーネント（c-）**: `app/assets/scss/object/components/`
  - 追加したら `app/assets/scss/object/components/_index.scss` に `@import "<file>";` を追記する
- **ページ固有（p-）**: `app/assets/scss/object/project/`（追加時は `_index.scss` に追記）
- **レイアウト（l-）**: `app/assets/scss/layout/`（追加時は `_index.scss` に追記）
- **ユーティリティ（u-）**: `app/assets/scss/object/utility/`（追加時は `_index.scss` に追記）

---

### 3. 新規作成前に必ずやること（再利用を優先）

- **類似コンポーネントを検索**して、設計パターン（バリアントの切り方・レスポンシブ方針）を寄せる
  - 例: `c-banner-form`, `c-banner-middle-cta`, `c-card-feature`, `c-card-reason`, `c-block-column`

---

### 4. Figma→実装の手順（この順序で進める）
- **Step 0: 実装先の確定**
  - 実装先 `*.pug` が未指定なら、最初に **1回だけ**「どのpugに実装するか」を確認する
- **Step 1: Figma情報取得**
  - `get_design_context` と `get_screenshot` を取得（大きい場合は `get_metadata`→必要な子ノードに分割）
- **Step 2: 構造設計（Pug）**
  - `+c/+e/+l/+pr` のBEM生成mixinでクラスを作る（詳細は `PUG_RULE.md`）
  - 見出しは見出し、本文は `p`、リストは `ul/ol` 等、適切なタグを選ぶ
- **Step 3: スタイル実装（SCSS）**
  - 既存token/mixinを使い、バリアント設計まで含めて作る（本ドキュメントの「5. SCSS実装ルール」参照）
- **Step 4: 検証**
  - Figmaスクショと見比べて差分を潰す（TODO箇所は明示する）

---

### 5. SCSS実装ルール（このコードベースの“癖”を含む）

#### 5.1 命名（FLOCSS + BEM）

- **Block**: `.c-component-name` / `.p-page-name` / `.l-layout-name` / `.u-utility-name`
- **Element**: `&__element`（例: `.c-card-reason__card-title`）
- **Modifier**: `.is-*`（例: `.c-banner-form.is-bottom`）

#### 5.2 低詳細度（:where を活用して“上書きしやすく”）

このPJは `:where()` を使って **詳細度を上げない** 書き方が多いです。

- **推奨**: `&:where(:nth-child(2)) { ... }`（`card-feature.scss` など）
- **推奨**: 既存mixinの `hover/group-hover` も `:where`/`:is` を使い、過剰なセレクタ強化を避けている

#### 5.3 token / 変数の優先順位（「迷ったらこれ」）
- **フォントサイズ**: `@include text-...` mixin が存在すれば優先
- **色**: `foundation/_settings.scss` の `$color-*` を優先

**Figmaのローカル「テキストスタイル」が指定されている場合**

Figma側で「ローカルスタイル（Text Styles）」が当たっているときは、値を直書きせず、**対応するテキストmixin** を使って統一します（`app/assets/scss/foundation/_mixin.scss`）。

#### 5.4 レスポンシブ（breakpoint mixin）

- **基本**: `@include breakpoint(small down)` でSP対応（〜749px）
- **必要なら**: `small only`（SPのみ）/ `medium down`（〜949px）等を選ぶ
- **Figmaが944**なら「`.l-container.is-sm` 内で使われる前提」で数値変換/設計する

#### 5.6 カード/リストの等幅グリッドは `auto-fit/auto-fill + minmax()` を優先（ブレイクポイント最小化）
カード一覧のような「同じ形の要素を並べるUI」は、まず **CSS Gridの自動折り返し** でレスポンシブを成立させ、`breakpoint()` は最終手段にします。

- **推奨**: `grid-template-columns: repeat(auto-fill, minmax(<min>, 1fr));`
- **最小幅（min）**: `min()` で調整し、SPでも自然に 2列→1列 へ遷移させる


```scss
.c-card-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(250px, 100%), 1fr));
}
```

**補足**: デザイン要件として「SPだけ最小幅を強制的に変える」「SPだけ行数制限を変える」等がある場合にのみ、`@include breakpoint(...)` で差分を入れます。

#### 5.7 画像の基本パターン
- **枠**: `aspect-ratio` + `overflow: hidden`
- **img**: `@include img-option();`（object-fit等を共通化）

#### 5.8 見出し要素の基本パターン
`__title` / `__block-title` など **見出しになる可能性がある要素** には、上下マージンを **明示的に指定** する（`0` なら `0` と書く）。

- **理由**: `h1`〜`h6` タグにはブラウザデフォルトの `margin` があり、コンポーネント内で意図しない余白が生じる原因になる
- **推奨**: `margin: 0;` または `margin-block: 0;` を明示する

```scss
// ✅ Good: 明示的に0を指定
&__block-title {
  font-size: 18px;
  margin: 0; // h4タグのデフォルトmarginをリセット
}

// ❌ Bad: marginを指定しない（h1-h6使用時に意図しない余白が発生）
&__block-title {
  font-size: 18px;
}
```

#### 5.9 バリアント設計（CSSカスタムプロパティ `--_`）

コンポーネント内で可変にしたい値は、`--_` プレフィックスのCSS変数に寄せます。

- **基本**: ルートで `--_xxx` を定義 → `.is-*` / `:where(:nth-child())` で上書き
- **参考**: `card-feature.scss`, `card-reason.scss`, `block.scss`

```scss
.c-sample {
  --_bg: #{$color-background};
  background: var(--_bg);

  &:where(.is-primary) {
    --_bg: #{$color-primary};
  }
}
```

#### 5.10 hover/transition（必ずmixin経由）

- **hover**: `@include hover { ... }`
- **親ホバー**: `@include group-hover { ... }`
- **transition**: `@include transition-colors()` / `@include transition-transform()` を用途別に使う

#### 5.11 z-index / 重なり（最小限＋理由を残す）

- **基本**: z-indexは必要最小限
- **重なりが必要**: `position` と `isolation: isolate;` を活用（`banner-form.scss` のパターン）

#### 5.12 禁止・注意（運用上の地雷）

- **`!important`**: 原則禁止（ユーティリティ等の例外のみ。追加するなら理由コメント必須）
- **Figmaからの画像書き出し**: 原則しない（必要なら TODO と相談導線）
---

### 6. Pug側の最小ルール（スタイル設計を壊さないために）

- **BEM生成mixinを使う**: `+c/+e/+l/+pr`（`PUG_RULE.md`）
- **リンク**: `+a` /（BEM文脈なら）`+ae` を使う
- **画像**: `+img` / `+picture` を優先（altを適切に）
- **タグ選定**: 見出し/本文/リスト等の意味を守る

---

### 7. 仕上げチェックリスト（提出前セルフレビュー）

- **構造**
  - [ ] FLOCSSの層（`c-`/`p-`/`l-`/`u-`）が適切
  - [ ] BEM（`__`/`.is-`）で破綻していない
  - [ ] 新規ファイルを作ったら `_index.scss` に `@import` を追加した
- **設計**
  - [ ] hoverは `@include hover` 経由、transitionは用途別mixin
  - [ ] バリアントは `--_` 変数 or `.is-*` で整理されている
- **レスポンシブ**
  - [ ] `breakpoint(small down)` で崩れない
- **運用**
  - [ ] `!important` を増やしていない（例外は理由コメント）

