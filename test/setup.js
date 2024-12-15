const mongoose = require('mongoose');

before(async () => {
  try {
    await mongoose.connect("mongodb+srv://covoittn:covoittn@covoittn.697vd.mongodb.net/?retryWrites=true&w=majority&appName=CovoitTN", {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for testing');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
});

after(async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
});
