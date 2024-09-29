const uuid = require('uuid');


exports.saveImageInFolder =(db)=>async(req,res,next)=>{

    try{
        const image_id = uuid.v4();
        const user_id = req.user.rows[0].user_id;
        const image_url = req.body.transformedURL;
        const response = await db.query('INSERT INTO folder(image_id,user_id,image_url) VALUES ($1,$2,$3)',[image_id,user_id,image_url]);
        res.status(200).json({
            success:true,
            message:'Image saved successfully!',
            response
        })
    }
    catch(error){
        console.error(error);
    }
 
   

}


exports.getFolder = (db)=>async(req,res,next)=>{

    try{
        const user_id = req.user.rows[0].user_id;
        const response = await db.query('SELECT * FROM folder WHERE user_id=$1',[user_id]);
        console.log('response folder:',response);
        
        res.status(200).json({
            success:true,
            response
        })
    }
    catch(error){
        console.error(error);
    }

}