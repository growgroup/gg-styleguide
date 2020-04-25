const spawn = require('child_process').spawn;
const process = require("process");

// 引数から取得
const component_id = process.argv[2];

const seckey = "QWqhFhbahkXvAeF%40HE8";
const endpoint = "https://grow-group.jp/designsystem/";

if (!component_id) {
  console.log("コンポーネントIDの指定は必ず行ってください。");
}

function getComponent(component_id){
  const markupDownload = spawn("wget", ["--content-disposition", "-P", "app/inc/components", endpoint + "?component_id=" + component_id + "&download=true&key=" + seckey + "&type=markup"]);
  markupDownload.stderr.on("data", data => {
    console.log(data.toString());
  });
  markupDownload.stdout.on("data", data => {
    console.log(data.toString());
  });
  markupDownload.on("close", code => {
    if (code !== 0) {
      console.error(`マークアップファイルのダウンロードに失敗しました : ${code}`)
    } else {
      console.log('マークアップデータファイルのダウンロードに成功しました。')
    }
  });

  const styleDownload = spawn("wget", ["--content-disposition", "-P", "app/assets/scss/object/components", endpoint + "?component_id=" + component_id + "&download=true&key=" + seckey + "&type=style"]);
  styleDownload.stderr.on("data", data => {
    console.log(data.toString());
  });
  styleDownload.stdout.on("data", data => {
    console.log(data.toString());
  });
  styleDownload.on("close", code => {
    if (code !== 0) {
      console.error(`スタイルマークアップファイルのダウンロードに失敗しました : ${code}`);
    } else {
      console.log('スタイルデータファイルのダウンロードに成功しました。')
    }
  });

  const javascriptDownload = spawn("wget", ["--content-disposition", "-P", "app/assets/js", endpoint + "?component_id=" + component_id + "&download=true&key=" + seckey + "&type=javascript"]);
  javascriptDownload.stderr.on("data", data => {
    console.log(data.toString());
  });
  javascriptDownload.stdout.on("data", data => {
    console.log(data.toString());
  });
  javascriptDownload.on("close", code => {
    if (code !== 0) {
      console.error(`JavaScriptファイルのダウンロードに失敗しました : ${code}`);
    } else {
      console.log('JavaScriptファイルのダウンロードに成功しました。')
    }
  });
}
var ids = component_id.split(",")
for(var i = 0; i < ids.length; i++){
  getComponent(ids[i]);
}
