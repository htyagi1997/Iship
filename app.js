const express=require('express');
const adminRoutes=require('./routes/admin');
const shopRoutes=require('./routes/shop');
const transRoutes=require('./routes/transport');
const body_parser=require('body-parser');
const errorController = require('./controllers/error');
const path=require('path');
const run=express();
const User=require('./models/user');
const session=require('express-session');
const mongoDbStore=require('connect-mongodb-session')(session);
//const csrf=require('csurf');
const flash=require('connect-flash');
const multer=require('multer');

const authRoutes = require('./routes/auth');


const mongoose = require('mongoose');


//for setting up the ejs templetes
run.set('view engine','ejs');
run.set('views','views');


const MONGODB_URI={a:'mongodb+srv://anonymous:vikas1998@cluster0-dxaw0.mongodb.net/shop?retryWrites=true&w=majority', b:{ useNewUrlParser: true }};

const store=new mongoDbStore({
  uri:MONGODB_URI.a,
  collection:'sessions'

});
//const csrfProtection=csrf();
const fileStorage= multer.diskStorage({
destination:(req,file,cb)=>{
  cb(null,'images');
},
filename:(req,file,cb)=>{
cb(null,Math.random()+ '-'+file.originalname);
}
});
const fileFilter=(req,file,cb)=>{
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg'|| file.mimetype === 'image/jpeg'){
  cb(null,true);
}else {
  cb(null,false);
}
};
//use to fetch the body data irrespective of its type in json form
run.use(body_parser.urlencoded({extended:false}));
//to fetch the file form data
run.use(multer({storage:fileStorage, fileFilter: fileFilter}).single('image'));
// use to access a public folder which is exccebble from anywhere
run.use(express.static(path.join(__dirname,'public')));
run.use('/images',express.static(path.join(__dirname,'images')));
//for session
run.use(session({secret:'my secret',resave:false,saveUninitialized:false,store:store}));
//csrf protection
//run.use(csrfProtection);
//for displaying flash messages 
run.use(flash());

run.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
    User.findById(req.session.user._id)
      .then(user => {
        if(!user){
          return  next();
        }
        req.user = user;
      next();
      })
      .catch(err => {
        console.log(err);
      });
  });
  run.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn,
   // res.locals.csrfToken=req.csrfToken();
  next();
  });



run.use('/admin',adminRoutes);
// //routes with shop.js
run.use(shopRoutes);
run.use(transRoutes);
run.use(authRoutes);




run.use(errorController.get404)

mongoose
  .connect(
   MONGODB_URI.a,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    }
  )
  .then(result => {
  
    console.log('Connected!!');
    run.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


