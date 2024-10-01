const db = require('../config/db')

class DP {
    constructor(p1, p2, p3, p4, p5) {
      this.p1 = p1;
      this.p2 = p2;
      this.p3 = p3;
      this.p4 = p4;
      this.p5 = p5;
    }
  
    async save() {
      let sql = `insert into dining_phil(p1, p2, p3, p4, p5)
      values( '${this.p1}','${this.p2}','${this.p3}','${this.p4}','${this.p5}')`;
      
      const [newPost, _] = await db.execute(sql);
      return newPost;
    }
  
    static findAll() {
      let sql="select * from dining_phil;"
      return db.execute(sql);
    }
  }
  
  
  module.exports = DP;