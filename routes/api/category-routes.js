const router = require('express').Router();
const { Category, Product } = require('../../models');


router.get('/', (req, res) => {
  Category.findAll()
  .then((allCategories) => {
    res.json(allCategories);
  })
  .catch((error) =>{
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  });
});

router.get('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id); 
  const category = categories.find((category) => category.id === categoryId); 

  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: 'Category not found'});
  }
});

router.post('/', (req, res) => {
  const newCategory = req.body;
  
  if (!newCategory || !newCategory.name) {
    res.status(400).json({ message: 'Category name is required'});
  }
  const newCategoryId = categories.length + 1;
  const category = { id: newCategoryId, name: newCategory.name };
  categories.push(category);
  res.status(201).json(category);
});

router.put('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id);
  const updatedCategory = req.body;
  const category = categories.find((category) => category.id === categoryId);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  if (!updatedCategory || !updatedCategory.name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  category.name = updatedCategory.name;

  res.json(category);
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
