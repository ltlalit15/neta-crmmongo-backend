
const errorhendler=(err,req,res,next)=>{
    {
        const statusCode = res.status ? res.statusCode :500;
        res.status(statusCode)
        res.json({
            message:err.message,
            stack:process.env.NOD_ENV === 'pordtion'?null:err.stack
        })
    }
}

module.exports ={ errorhendler}