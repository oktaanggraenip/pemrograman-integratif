const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

//Define proto path
const PROTO_PATH = './mahasiswa.proto';

const options = {
    keepCase : true,
    longs : String,
    enums : String,
    defaults : true,
    oneofs: true,
}

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

//Load proto
const mahasiswaProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

//Dummy data
let mahasiswa = [
    {
        id : 1,
        nama: "Swan",
        nrp: "5501",
        nilai: "79"
    },
    {
        id : 2,
        nama: "Upin",
        nrp: "5502",
        nilai: "80"    
    }
]

server.addService(mahasiswaProto.MahasiswaService.service,{
    getAll: (_, callback) => {
        callback (null, mahasiswa);
    }
})

//start server
server.bindAsync(
    "localhost:5000",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log("Server running at http://localhost:5000");
        server.start();
    }
)
