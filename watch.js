var watch = require('node-watch');
var node_ssh = require('node-ssh')
var ssh = new node_ssh()
var {sftp_login,work_folders}=require('./sftp.config.js');
var failed,successful;

var isBusy=false;
var uploadQueue=[];
var curUpload=-1;

function doUpload(){
  if(isBusy){
    return;
  };
  curUpload++;
  let local=uploadQueue[curUpload].local;
  let remote=uploadQueue[curUpload].remote;
  console.log("upload",local,remote);
  isBusy=true;
  ssh.connect(sftp_login)
  .then(()=>{
    failed=[];
    successful=[];
    return ssh.putDirectory(
      local,
      remote,
      {
        recursive: true,
        tick: (localPath, remotePath, error)=>{
          if (error) {
            failed.push(local+'/'+localPath)
          } else {
            successful.push(localPath)
          }
        }
      });
  })
  .then(status=>{
    console.log(local+' directory transfer was', status ? 'successful' : 'unsuccessful')
    if(failed.length){
      console.log('**************\n','failed transfers:\n', failed.join("\r\n"),'files');
    };
    if(successful.length){
      console.log('**************\n','successful transfers:\n', successful.length,'files');
    };
    var d=new Date();
    console.log(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds());
  })
  .then(()=>{
    ssh.dispose();
    isBusy=false;
    if(curUpload<uploadQueue.length-1){
      setTimeout(doUpload,10);
    };
  })
  .catch(err=>{
    console.log(err);
  });
}


function upload(local,remote){
  uploadQueue.push({
    local:local,
    remote:remote
  });
  doUpload();
}

work_folders.forEach(item=>{
  upload(item.local,item.remote);
  watch(item.local, { recursive: true }, (evt,name)=>{
    upload(item.local,item.remote);
  });
});
