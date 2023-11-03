const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', (req, res) => {
  Product.findAll()
  .then((allProducts) => {
    res.json(allProducts);
  })
  .catch((error) =>{
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  });
});

router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  .then((product) => {
    if (product) {
      res.json(product);
    }else {
      res.status(404).json({message: 'Product not found'});
    }
  })
  .catch((error) => {
      console.error(error);
      res.status(500).json({message:'Internal server error'});
    });
});

router.post('/', (req, res) => {
  const newProduct = req.body;

  Product.create(newProduct)
    .then((product) => {
      if (newProduct.tagIds && newProduct.tagIds.length) {
        const productTagIdArr = newProduct.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(201).json(product);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id);

  Product.destroy({
    where: {
      id: productId,
    }
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(204).end();
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;
