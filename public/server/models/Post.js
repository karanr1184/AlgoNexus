const db = require('../config/db')

class Post {
  constructor(avgwt, avgta) {
    this.avgwt = avgwt;
    this.avgta = avgta;
  }

  async save() {
    let sql = `insert into sjf_values(avgwt, avgta) 
    values( '${this.avgwt}','${this.avgta}')`;

    const [newPost, _] = await db.execute(sql);
    return newPost;
  }

  static findAll() {
    let sql="select * from sjf_values;"
    return db.execute(sql);
  }
}


module.exports = Post;