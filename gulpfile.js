import gulp from "gulp";
import esbuild from "gulp-esbuild";
import cp from "child_process";
import chalk from "chalk";
import del from "del";

function _cleanDist() {
  return del(["dist/**/*"]);
}

function _build() {
  return gulp
    .src(["src/**/*.ts"])
    .pipe(
      esbuild({
        sourcemap: "inline",
        format: "esm",
        target: "node16",
        loader: {
          ".ts": "ts",
        },
      })
    )
    .pipe(gulp.dest("dist"));
}

function _watch(cb) {
  const spawn = cp.spawn("nodemon dist/main --delay 1", { shell: true });

  spawn.stdout.on("data", (data) => {
    console.log(chalk.white(`${data}`.trim()));
  });

  spawn.stderr.on("data", (data) => {
    console.error(chalk.red(`${data}`.trim()));
  });

  spawn.on("close", () => cb());

  gulp.watch("src/**/*.ts", { delay: 500 }, gulp.series(_cleanDist, _build));
}

export const watch = gulp.series(_cleanDist, _build, _watch);
export const build = gulp.series(_cleanDist, _build);
