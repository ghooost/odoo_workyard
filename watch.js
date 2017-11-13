var watch = require('node-watch');
var node_ssh = require('node-ssh')
var ssh = new node_ssh()
var {sftp_login,work_folders}=require('./sftp.config.js');
var failed,successful;

upload();

var isBusy=false;
var postUpload=false;

function upload(){
  isBusy=true;
  ssh.connect(sftp_login)
  .then(()=>{
    failed=[];
    successful=[];
    return ssh.putDirectory(
      work_folders.local,
      work_folders.remote,
      {
        recursive: true,
        tick: (localPath, remotePath, error)=>{
          if (error) {
            failed.push(localPath)
          } else {
            successful.push(localPath)
          }
        }
      });
  })
  .then(status=>{
    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
    if(failed.length){
      console.log('**************\n','failed transfers:\n', failed.join('\n'));
    };
    if(successful.length){
      console.log('**************\n','successful transfers:\n', successful.join('\n'));
    };
  })
  .then(()=>{
    ssh.dispose();
    if(postUpload){
      postUpload=false;
      setTimeout(upload,10);
    } else {
      isBusy=false;
    }
  });
}

watch(work_folders.local, { recursive: true }, (evt,name)=>{
  if(isBusy){
    postUpload=true;
  } else {
    upload();
  };
});
