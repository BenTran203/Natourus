const express = require('express');
const app = express();
const fs = require('fs');
const { request } = require('http');
const morgan = require('morgan');

app.use(express.json());

// 1) MIDDEL WARES

app.use(morgan('dev'));
app.use((req, res, next) => {
  // const token = req.header('x-auth-token');
  console.log('Hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req,res) =>{
//     res.status(200)
//     .json({message: 'Hello World!', app: 'Natours'})
// })

// app.post('/', (req,res) => {
//     res.send('You can post  to this endpoint')
// })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) Routes handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  // if(id> tours.length) {
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated Tour Here>',
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getUser = (req, res) => {
  res.status(200).json({
    status: 'error',
    message: 'This route is not yet define',
  });
};

const updateUser = (req, res) => {
  res.status(200).json({
    status: 'error',
    message: 'This route is not yet define',
  });
};
const createUser = (req, res) => {
  res.status(200).json({
    status: 'error',
    message: 'This route is not yet define',
  });
};


const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet define',
  })
};


// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) Routes

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// 4) Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
