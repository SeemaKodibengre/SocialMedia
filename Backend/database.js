const  mongoose =require("mongoose") ;
require("dotenv").config();
 const MongoDBURL=process.env.MONGO_URI;


//  const connectMongo=async()=>{
// try{
//     await mongoose.connect(MongoDBURL);
    

//     console.log("mongoDB connection sucessfull");
// }
// catch(err){
//     console.log("mongoDB connection unsuccessfull",err);
// }
// }

// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB Atlas:', error);
//   });
// module.exports=connectMongo;


