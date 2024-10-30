module.exports = {
  "extends": [
    "stylelint-config-recommended-scss"
  ],
  "rules": {
    //gg-styleguideのデフォルトでエラーが出すぎなのでいったんエラー出力を消す【要改善】
    "no-descending-specificity": null,
    "no-duplicate-selectors": null,
    "no-invalid-double-slash-comments": null,
    "font-family-no-duplicate-names": null,
    "block-no-empty": null,
    "scss/operator-no-unspaced": null,
    "scss/at-rule-no-unknown": null,
    "scss/at-extend-no-missing-placeholder": null,
    "scss/at-mixin-pattern": null,
    "scss/comment-no-empty": null,
    "scss/load-no-partial-leading-underscore": null,
    "scss/no-global-function-names": null,
    "scss/at-if-no-null": null,
    "selector-type-no-unknown": null,

    //画像のパスを / から始めることを禁止
    "declaration-property-value-disallowed-list": {
      "/^background|background-image|content|mask|mask-image$/": ["/^url\\(['\"]?\\//"]
    }
  }
}
