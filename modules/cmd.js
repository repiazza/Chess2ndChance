const { exec } = require("child_process");
exec(
  "for dlwfile in `cat arq.txt | cut -d'\n' -f1`; do wget $dlwfile done",
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
  }
);

function downloadImage() {
  fetch(url, {
    mode: "no-cors",
  })
    .then((response) => response.blob())
    .then((blob) => {
      console.log(blob);
      // console.debug(blob);
    });
}
