const Auction=require('../models/auction');
const Product = require('../models/product');
const TransUser = require('../models/transuser');

exports.getPage=(req,res,next)=>{
    res.render('transport/indexPage');
};
exports.getClearBidItem=(req,res,next)=>{
const prodId=req.body.prodId;
const itemId=req.body.itemId;
// console.log(prodId);
// console.log(itemId);
// Auction.findById(prodId).then(prods=>{
//   prods.products.forEach(element =>{
//     if(element.product._id==itemId){
//       element.product._id=null;
//       delete element.product._id;
//      return prods.save();
//     }
//   });

// }).catch(err=>console.log(err));
Auction.findById(prodId).then(prods=>{
  Auction.deleteOne({ _id: prodId },err=>{console.log(err);});})

res.redirect('/translist');
};

exports.getLogOut=(req,res,next)=>{
  res.redirect('/trans');
};
exports.quitBid=(req,res,next)=>{
  const prodId = req.body.BidId;
  const itemId=req.body.ItemId;
  const biddingamount=req.body.BiddingAmount;
  Auction.findById(prodId).then(prods =>{
    prods.bidding=true; 
    return prods.save();
  }).then(p=>{ const losingprice=(5/100)*biddingamount;
    console.log(prodId);
    console.log(itemId);
    return res.render('transport/losebidding',{
      loseamount:losingprice,
      prodId :prodId,
      itemId:itemId});
}).catch(err => console.log(err));
};



exports.postBid=(req,res,next)=>{
  const prodId = req.body.BidId;
  const BidValue=req.body.bidprice;
  const itemId=req.body.ItemId;
  
  Auction.findById(prodId).then(prods => {
     if((prods.currentprice==0 || BidValue<prods.currentprice) && prods.bidding==false){prods.currentprice=BidValue;}
    else{
      req.flash('error', 'Your Bidding Amount should be lower than the current Bidding Price.');
     
     }
     return prods.save();
  }).then(p=>{return res.redirect('/bids/'+prodId+'/'+itemId);}).catch(err => console.log(err));



  
} ;

exports.getProduct=(req,res,next)=>{
 
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

    const prodId = req.params.productId;
    const perprodId = req.params.PID;
    Auction.findById(prodId).then(prods => {
        prods.products.forEach(element => {
            if(element.product._id==perprodId && prods.bidding==false){
            // console.log(element.product);
                return    res.render('transport/productbidding', {
          prod: element.product,
          quantity: element.quantity,
          destAdd: prods.destAdd,
          currentprice:prods.currentprice,
          hiddenProdId: prodId,
          hiddenItemId:perprodId,
          
          errorMessage: message
        
        });
            }
            else if(prods.bidding==true){ 
              return  res.render('transport/wonbidding',{  
                 currentprice:prods.currentprice,
                prodId: prodId,
          itemId:perprodId
              }); }
        });
        // console.log(perprodId);
    
   
        
     //console.log(products);
   
      })
      .catch(err => console.log(err));
    // console.log(prodId);
    // console.log(perprodId);

};
exports.getList=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    Auction.find().then(products=>{
        
        res.render('transport/biddinglist',{  prods: products });
    }).catch(err => {
        console.log(err);
      });
      
};
exports.postLogin = (req, res, next) => {
   
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
        }
        bcrypt
          .compare(password, user.password)
          .then(doMatch => {
            if (doMatch) {
                Auction.find().then(products=>{
        
                    return  res.render('transport/biddinglist',{  prods: products });
                })
               
            }
            req.flash('error', 'Invalid email or password.');
            res.redirect('/trans');
          })
          .catch(err => {
            console.log(err);
            res.redirect('/trans');
          });
      })
      .catch(err => console.log(err));
  };