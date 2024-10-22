const Book = require('../models/Book');
const fs = require('fs');

// Création d'un livre
exports.createBook = (req, res, next) => {
    try {
        if (!req.file) {
          return res.status(400).json({ message: 'Image file is required.' });
        }
    
        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;
        delete bookObject._userId;
    
        const book = new Book({
          ...bookObject,
          userId: req.auth.userId,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
    
        book.save()
          .then(() => res.status(201).json({ message: 'Book created successfully!' }))
          .catch(error => res.status(400).json({ error }));
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
};

// Obtenir un seul livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Book not found!' });
      }
      console.log('Book fetched:', book);
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// Modifier un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => {
        if (book.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

// Obtenir tous les livres
exports.getAllBook = (req, res, next) => {
    Book.find().then(
        (books) => {
            res.status(200).json(books);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

// Note un livre
exports.rateBook = (req, res, next) => {
  const bookId = req.params.id;
  const { userId, rating } = req.body;

  console.log('Corps de la requête:', req.body);

  const ratingNumber = parseFloat(rating);
  if (isNaN(ratingNumber) || ratingNumber < 0 || ratingNumber > 5) {
    console.log('Erreur: la note doit être un nombre valide entre 0 et 5.');
    return res.status(400).json({ message: 'Rating must be a number between 0 and 5.' });
  }

  Book.findOne({ _id: bookId })
    .then(book => {
      if (!book) {
        console.log('Livre non trouvé:', bookId);
        return res.status(404).json({ message: 'Book not found' });
      }

      console.log('Livre trouvé:', book);

      const userAlreadyRated = book.ratings.find(rating => rating.userId === userId);
      if (userAlreadyRated) {
        console.log('Utilisateur a déjà noté ce livre:', userId);
        return res.status(403).json({ message: 'You have already rated this book.' });
      }

      book.ratings.push({ userId, grade: ratingNumber });
      console.log('Notes après ajout:', book.ratings);

      const totalRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
      console.log('Total des notes:', totalRating);

      if (book.ratings.length > 0) {
        book.averageRating = totalRating / book.ratings.length;
        console.log('Moyenne calculée:', book.averageRating);
      } else {
        book.averageRating = 0;
        console.log('Pas de notes, moyenne définie à 0');
      }

      book.save()
        .then(updatedBook => {
          console.log('Livre mis à jour avec succès:', updatedBook);
          res.status(200).json(updatedBook);
        })
        .catch(error => {
          console.error('Erreur lors de la sauvegarde du livre:', error);
          res.status(400).json({ error });
        });
    })
    .catch(error => {
      console.error('Erreur lors de la recherche du livre:', error);
      res.status(500).json({ error });
    });
};

// Obtenir les meilleurs livres
exports.getBestRatedBook = (req, res, next) => {
    Book.find()
      .sort({ averageRating: -1 })
      .limit(3)  
      .then(books => {
        res.status(200).json(books);
      })
      .catch(error => {
        res.status(400).json({ error });
      });
};