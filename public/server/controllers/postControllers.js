const Post = require('../models/Post')
const DP = require('../models/DP')
const Look = require('../models/Look')
const FIFO = require('../models/FIFO')

exports.getAllPosts= async(req ,res , next)=>{
    try{
        const posts = await Post.findAll();
        res.status(200).json({count:posts[0].length , posts})
    }catch(error){
        console.log(error)
    }
}
exports.createNewPost= async(req ,res , next)=>{
    let {avgwt, avgta} = req.body;

    let post = new Post(avgwt, avgta)

    post = await post.save()

    console.log(post)
    res.send("createNewPost")
}

// For DP

exports.getAllDP= async(req ,res , next)=>{
    try{
        const posts = await DP.findAll();
        res.status(200).json({count:posts[0].length , posts})
    }catch(error){
        console.log(error)
    }
}
exports.createNewDP = async(req ,res , next)=>{
    let {p1, p2, p3, p4, p5} = req.body;

    let dp = new DP(p1, p2, p3, p4, p5)

    dp = await dp.save()

    console.log(dp)
    res.send("createNewPost")
}


// For Look CLook

exports.getAllLook= async(req ,res , next)=>{
    try{
        const posts = await Look.findAll();
        res.status(200).json({count:posts[0].length , posts})
    }catch(error){
        console.log(error)
    }
}
exports.createNewLook = async(req ,res , next)=>{
    let {headPos, diskSize} = req.body;

    let look = new Look(headPos, diskSize)

    look = await look.save()

    console.log(look)
    res.send("createNewPost")
}

// For FIFO

exports.getAllFIFO= async(req ,res , next)=>{
    try{
        const posts = await FIFO.findAll();
        res.status(200).json({count:posts[0].length , posts})
    }catch(error){
        console.log(error)
    }
}
exports.createNewFIFO = async(req ,res , next)=>{
    let {frames, hitrate, faultrate} = req.body;

    let fifo = new FIFO(frames, hitrate, faultrate)

    fifo = await fifo.save()

    console.log(fifo)
    res.send("createNewPost")
}