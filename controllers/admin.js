const Product = require('../models/product');
const User=require('../models/user');
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const sourceadd=req.body.sourceadd;
  if(!image){
   return  res.status(422).render('admin/edit-product',{
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    product: {
      title: title,
      price:price,
      description:description,
      sourceadd: sourceadd
    }
   });
  }
  const imageUrl=image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    sourceadd: sourceadd,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;
   const updatedsourceadd=req.body.sourceadd;
  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.sourceadd =updatedsourceadd;
      if(image){
        product.imageUrl = image.path;
      }
      
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      return User.find({} , (err, users) => {
        if(err){
          return console.log(err);
        }

        users.map(user => {
          return user.DeleteFromCart(prodId)
          
           
        });
    }).then(result => {
      res.redirect('/admin/products');
         })
      .catch(err => console.log(err));
}) .catch(err => console.log(err));
};
