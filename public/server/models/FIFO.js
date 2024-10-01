const db = require('../config/db')

class FIFO {
    constructor(frames, hitrate, faultrate) {
      this.frames = frames;
      this.hitrate = hitrate;
      this.faultrate = faultrate;
    }
  
    async save() {
      let sql = `insert into FIFO(frames, hitrate, faultrate)
      values( '${this.frames}','${this.hitrate}','${this.faultrate}')`;
      
      const [newPost, _] = await db.execute(sql);
      return newPost;
    }
  
    static findAll() {
      let sql="select * from FIFO;"
      return db.execute(sql);
    }
  }
  
  
  module.exports = FIFO;