const mongoose = require("mongoose");

const MyServicetypesListSchema=mongoose.Schema({
    service_types:{type:[mongoose.Types.ObjectId],default:[],ref:"ServiceTypeModel"},
    userId:{type:mongoose.Types.ObjectId,ref:"UserInfo"},
}, {timestamps:true}
)

module.exports=mongoose.model("MyServicetypesList",MyServicetypesListSchema)