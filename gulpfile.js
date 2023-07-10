import gulp from "gulp";
import esbuild from "gulp-esbuild";
import cp from "child_process";
import c from "ansi-colors";
import { deleteAsync } from "del";
import 'dotenv/config'

function _cleanDist() {
  return deleteAsync(["dist/**/*"]);
}

function _build() {
  return gulp
    .src(["src/**/*.ts"])
    .pipe(
      esbuild({
        resolveExtensions: ['.js', '.ts', '.mjs', '.cjs'],
        sourcemap: "inline",
        format: "esm",
        target: "node22",
        loader: {
          ".ts": "ts",
        },
      })
    )
    .pipe(gulp.dest(process.env.OUTDIR || 'dist'));
}

function _watch(cb) {
  const spawn = cp.spawn("nodemon dist/bot.js --delay 1", { shell: true });

  spawn.stdout.on("data", (data) => {
    console.log(c.white(`${data}`.trim()));
  });

  spawn.stderr.on("data", (data) => {
    console.error(c.red(`${data}`.trim()));
  });

  spawn.on("close", () => cb());

  gulp.watch("src/**/*.ts", { delay: 500 }, gulp.series(_cleanDist, _build));
}

export const watch = gulp.series(_cleanDist, _build, _watch);
export const build = gulp.series(_cleanDist, _build);
