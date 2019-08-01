import nodeResolve from "rollup-plugin-node-resolve";
import run11ty from "./rollup-plugins/11ty-plugin.js";
import startSequence from "./rollup-plugins/start-sequence-plugin.js";
import globInput from "./rollup-plugins/glob-input-input.js";
import renegade from "./rollup-plugins/renegade-plugin.js";
import emit from "./rollup-plugins/emit-plugin.js";
import tags from "./rollup-plugins/tag-plugin.js";
import passthrough from "./rollup-plugins/passthrough-plugin.js";
import chunkName from "./rollup-plugins/chunk-name-plugin.js";
import { sync as rmdir } from "rimraf";
import { join } from "path";

rmdir("_site");

const baseDir = join(__dirname, ".tmp");
export default {
  output: {
    dir: "_site",
    format: "esm"
  },
  plugins: [
    nodeResolve(),
    startSequence(),
    run11ty(),
    globInput(".tmp/**/*.html"),
    renegade({
      extensions: ["html", "css"]
    }),
    passthrough({
      extensions: [
        "svg",
        "png",
        "jpg",
        "woff",
        "woff2",
        "eot",
        "gif",
        "mp4",
        "webm"
      ]
    }),
    emit({ baseDir }),
    tags({
      imgTagRegexp: /<(?:img|video|source|script)[^>]+src=["'](?!(?:[a-z]+:)?\/\/)([^"'()]+)["'][^>]*>/i,
      baseDir
    }),
    chunkName()
  ]
};
