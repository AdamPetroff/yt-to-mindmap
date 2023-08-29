import {
  getTranscriptParts,
  openAiResultToNiceJSON,
  getMindMapJsonFromOpenApiInitial,
  ytCaptionsScriptResultToText,
  work,
} from "./src/functions";
import fs from "fs";

(async () => {
  // ytCaptionsScriptResultToText();
  const res = await work();

  console.log(res);
  fs.writeFileSync(`res.json`, JSON.stringify(res));
  // openAiResultToNiceJSON();
})();
