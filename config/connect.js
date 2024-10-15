const mongoose=require('mongoose');

mongoose.connect("mongodb+srv://covoittn:covoittn@covoittn.697vd.mongodb.net/?retryWrites=true&w=majority&appName=CovoitTN").then(() => {   
    console.log("Connected to database!");
  });
  