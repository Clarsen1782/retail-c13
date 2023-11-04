const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  Category.findAll()
    .then((allCategories) => {
      res.json(allCategories);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.get('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);

  Category.findByPk(categoryId)
    .then((category) => {
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    })
});

router.post('/', (req, res) => {
  const newCategory = req.body;
  if (!newCategory || !newCategory.name) {
    res.status(400).json({ message: 'Category name is required' });
  } else {
    Category.create({
      name: newCategory.name,
    })
      .then((category) => {
        res.status(201).jason(category);
      })
      .catch((error) => {
        console.error(error);
      })
  }
});

router.put('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const updatedCategory = req.body;

  Category.findByPk(categoryId)
    .then((category) => {
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
      } else if (!updatedCategory || !updatedCategory.name) {
        res.status(400).json({ message: 'Category name is required' });
      } else {
        category.name = updatedCategory.name;
        category.save()
          .then(() => {
            res.json(category);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          });
      }
    });
});

router.delete('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  Category.destroy({
    where: {
      id: categoryId,
    }
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        res.status(404).json({ message: 'Category not found' });
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
