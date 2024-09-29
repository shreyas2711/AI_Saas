const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');


const hashPassword = async(plainTextPassword)=>{

    try{
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(plainTextPassword,salt);
        return hash;
    }
    catch(error){
        console.error('Error hashing the password',error.message);
    }
    
}

exports.UserSignUp=(db)=>async(req,res,next)=>{
    
   try{
    const user_id = uuid.v4(); 
    const {user_name,email,password} = req.body;
    console.log("user_name:",user_name);
    const hashedPassword = await hashPassword(password);
    
    const user = await db.query('INSERT INTO users (user_id ,email, password, user_name) VALUES ($1, $2, $3, $4)', [user_id, email, hashedPassword, user_name]);

    res.status(200).json({
        success:true,
        message:'User created successfully!',
        user
    })
}
catch(error){

    console.error('Error Creating user!',error);
    res.status(500).json({
        error:'Internal server error'
    })
}
}


exports.UserSignIn=(db)=>async(req,res,next)=>{

    try{
        const {email,password} = req.body;

        const response = await db.query('SELECT * FROM users WHERE email=$1',[email]);
        const user = response.rows[0];

        if(user){

            const hashedPassword = user.password;
            const passwordMatch  = await bcrypt.compare(password,hashedPassword);

            if(passwordMatch){
                const token = jwt.sign({userId:user.user_id},'sdsdasdasdasjsdsad',{expiresIn:3600});
                res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, sameSite: 'Lax' });
                
                res.json({
                    success: true,
                    message: 'Successfully signed in!',
                    token,
                    user
                });
            }
            else{
                res.status(401).json({
                    success:false,
                    message:'Invalid Credentials!'
                });

            }
        }
        else{
            res.status(401).json({
                success:false,
                message:'Invalid Credentials!'
            });

        }   
    }
    catch (error) {
        console.error('Error singing in!', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}


exports.UserLogOut = (db)=>async(req,res,next)=>{

    res.clearCookie('token');
    res.status(200).json({
        success:true,
        message:"Logged out successsfully!!"
    })
}


exports.getUsers = (db)=>async(req,res,next)=>{

    try{
        const user = await db.query('SELECT * FROM users');

        res.status(200).json({
            success:true,
            user
        })
    }
    catch(error){
        console.error(error);
    }
}

exports.TransformUser = (db)=>async(req,res)=>{

    try{    
        const user_id = req.user.rows[0].user_id;
        const response = await db.query('UPDATE users SET user_credit = user_credit - 0.5 WHERE user_id=$1',[user_id]);
        res.status(200).json({
            success:true,
            response
        })

    }
    catch(error){
        console.error(error);
    }
}
