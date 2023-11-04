const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Product.findAll()
    .then((allTags) => {
      res.json(allTags);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.get('/:id', (req, res) => {
  const tagId = parseInt(req.params.id)
  fetchTag(tagId)
    .then((tag) => {
      if (tag) {
        res.json(tag);
      } else {
        res.status(404).json({ message: 'Tag not found' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', (req, res) => {
  const newTag = req.body;
  Tag.create(newTag)
    .then((tag) => {
      if (newTag.tagIds && newTag.tagIds.length) {
        const TagIdArr = newTag.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return Tag.bulkCreate(TagIdArr);
      }
      res.status(201).json(tag);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {

        Tag.findAll({
          where: { tag_id: req.params.id }
        }).then((tags) => {
          const tagIds = tags.map(({ tag_id }) => tag_id);
          const newTags = req.body.tagIds
            .filter((tag_id) => !tagIds.includes(tag_id))
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
  const tagId = parseInt(req.params.id);

  Product.destroy({
    where: {
      id: tagId,
    }
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        res.status(404).json({ message: 'Tag not found' });
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
