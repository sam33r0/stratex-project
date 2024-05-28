import sequelize from './dbConfig.js';
import User from './../models/user.model.js';
import Book from './../models/book.model.js';
import Seller from './../models/seller.model.js';
async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync all models
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
    const email="seller5@gmail.co"

    // const seller = await User.create({
      
    //   name: 'seller541',
    //   email: 'seller5@gmail.co',
    //   password: 'user1password',
    //   ref_token: 'gd51gagdgd'
    // });
    const user = await User.findOne({ where: { id: 1 } });
    if(user)
    {
        const op =await user.generateAccessToken()
        console.log(op);
    }
    // Create a user
    // const seller = await Seller.create({
      
    //   name: 'seller541',
    //   email: 'seller5@gmail.co',
    //   password: '1241g3r4',
    //   ref_token: 'gd51gagdgd'
    // });
    // console.log("aT\t",seller);

    // const book = await Book.create({
    //   title: 'My First Post',
    //   author: 'This is the content of my first post.',
    //   publishDate:'465365436',
    //   price:'ljhljh',     
    //   seller_id: seller.id,
    // });
    // console.log("book at\t",book);
    // console.log('User and Post created successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default connect;