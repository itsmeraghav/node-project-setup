module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  uploadFilePath: 'D:/school/api/public/uploads'
 
};
