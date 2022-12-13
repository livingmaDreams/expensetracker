const Download = require('../models/download');
const aws = require('aws-sdk');

exports.getDownloadLinks = (req,res,next) =>{
  
    req.user
    .getDownloads()
    .then(data => {
        res.status(200).json({links:data})
    })
    .catch(err => res.status(404).json({status:'Something went wrong'}));

}

function uploadToS3(data,filename){
   
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    let s3Bucket = new aws.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET
    });
  
    var params = {
      Bucket: BUCKET_NAME,
      Key:filename,
      Body:data,
      ACL: 'public-read'
    };

    return new Promise((res,rej) =>{
        s3Bucket.upload(params,(err,s3res) =>{
            if(err)
            rej(err)
            else
            res(s3res.Location);
        });
    })
 
}
exports.createLink = async (req,res,next) =>{
    try{
    const exp = await req.user.getExpenses();
    const jsonExp = JSON.stringify(exp);
    const userId = req.user.id;
    const filename = `expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(jsonExp,filename);
     await req.user.createDownload({link:fileUrl});
     res.status(200).json({url: fileUrl,status:'success'});
    }
    catch(err){
        res.status(500).json({status:'false'})
    }
    
}