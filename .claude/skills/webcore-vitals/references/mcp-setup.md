# chrome-devtools-mcp 導入手順

Google 製の Chrome DevTools MCP。CWV 計測に使う。Node と Chrome が必要。

## 方法A: プロジェクトの .mcp.json に追記（チーム共有向け・推奨）
リポジトリ直下の `.mcp.json`（無ければ新規作成）に以下を追記:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

Claude Code を再起動し、プロジェクト MCP の承認プロンプトを許可する。

## 方法B: CLI で追加（自分の環境だけ）
```bash
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

## 動作確認
1. Claude Code のツール一覧に chrome-devtools 系ツール（ページ操作 / performance トレース / エミュレーション等）が出ることを確認。
2. 出ない場合: Node のバージョン、`npx chrome-devtools-mcp@latest` が単体で起動するか、Chrome が導入済みかを確認する。

## 注意
- 初回は `npx` がパッケージを取得するため時間がかかることがある。
- 実際のツール名・引数はバージョンで変わりうる。SKILL.md の前提チェックでツール一覧を確認してから使うこと。
