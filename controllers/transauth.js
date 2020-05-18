const TransUser = require('../models/transuser');
exports.postTransLogin = (req, res, next) => {
    const email = req.body.email;
    const uid = req.body.password;
    TransUser.findOne({ email: email })
      .then(user => {
        if (!user) {
        
          return res.redirect('/trans');
        }
        if(uid===JSON.stringify(user.password))
        {
          return res.redirect('/translist');
       
         
            
          }
        
        else {
          return res.redirect('/trans');
        }
      })
      .catch(err => console.log(err));
  };
  //================
//   TransUser.findOne({uid: user.password})
//   .then(doMatch => {
//     if (doMatch) {
//       console.log("here");
//       return res.redirect('/');
      
//     }
//   //  req.flash('error', 'Invalid email or password.');
//   console.log("there");
//     res.redirect('/trans');
//   })
//   .catch(err => {
//     console.log(err);
//     res.redirect('/trans');
//   });
// })
// .catch(err => console.log(err));
// };