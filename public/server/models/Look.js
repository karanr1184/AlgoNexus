const db = require('../config/db')

class Look {
    constructor(diskSize, headPos) {
        this.diskSize = diskSize;
        this.headPos = headPos;
    }
  
    async save() {
      let sql = `insert into Look_Clook(headPos, diskSize)
      values('${this.diskSize}','${this.headPos}')`;
      
      const [newPost, _] = await db.execute(sql);
      return newPost;
    }
  
    static findAll() {
      let sql="select * from Look_Clook;"
      return db.execute(sql);
    }
  }
  
  
  module.exports = Look;