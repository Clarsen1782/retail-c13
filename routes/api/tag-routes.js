const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');


router.get('/', (req, res) => {
  Tag.findAll()
    .then((allTags) => {
      res.json(allTags);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.get('/:id', (req, res) => {
  const tagId = parseInt(req.params.id);
  Tag.findByPk(tagId)
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
        const tagIdArr = newTag.tagIds.map((tag_id) => {
          return {
            tag_id,
          };
        });
        return Tag.bulkCreate(tagIdArr);
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
        }).then((productTags) => {
          const tagIds = tagIds.map(({ tag_id }) => tag_id);
          const newTags = req.body.tagIds
            .filter((tag_id) => !tagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                tag_id,
              };
            });

          const tagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          return Promise.all([
            Tag.destroy({ where: { id: tagsToRemove } }),
            Tag.bulkCreate(newTags),
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
  const tagIds = parseInt(req.params.id);

  Tag.destroy({
    where: {
      id: tagIds,
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
