import {
  Server,
  loadPackageDefinition,
  ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

// Import Firebase Admin
import admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json" assert { type: "json" };

// Initialize Firebase app with service account config
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
};
admin.initializeApp(firebaseConfig);

// Initialize Firestore
const db = admin.firestore();

const server = new Server();

const packageDefinition = loadSync("./mahasiswa.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const mahasiswa = loadPackageDefinition(packageDefinition).mahasiswa;

const addMahasiswa = async (call, callback) => {
  const mahasiswa = call.request.mahasiswa;
  const mahasiswaRef = db.collection("mhs").doc(mahasiswa.id);
  try {
    await mahasiswaRef.set(mahasiswa);
    const docSnapshot = await mahasiswaRef.get();
    const data = docSnapshot.data();
    const response = {
      id: data.id,
      nama: data.nama,
      nrp: data.nrp,
      angkatan: data.angkatan,
    };
    callback(null, response);
  } catch (error) {
    console.log("Error adding mahasiswa: ", error);
    callback(error);
  }
};

const getMahasiswa = async (call, callback) => {
  const id = call.request.id;
  const mahasiswaRef = db.collection("mhs").doc(id);
  try {
    const docSnapshot = await mahasiswaRef.get();
    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      const response = {
        id: data.id,
        nama: data.nama,
        nrp: data.nrp,
        angkatan: data.angkatan,
      };
      callback(null, response);
    } else {
      const error = new Error(`Mahasiswa with id ${id} not found`);
      callback(error);
    }
  } catch (error) {
    console.log("Error getting mahasiswa: ", error);
    callback(error);
  }
};

const updateMahasiswa = async (call, callback) => {
  const mahasiswa = call.request.mahasiswa;
  const mahasiswaRef = db.collection("mhs").doc(mahasiswa.id);
  try {
    await mahasiswaRef.update(mahasiswa);
    const response = {
      id: mahasiswa.id,
      nama: mahasiswa.nama,
      nrp: mahasiswa.nrp,
    };
    callback(null, response);
  } catch (error) {
    console.log("Error updating mahasiswa: ", error);
    callback(error);
  }
};

const deleteMahasiswa = async (call, callback) => {
  const id = call.request.id;
  const mahasiswaRef = db.collection("mhs").doc(id);
  try {
    const docSnapshot = await mahasiswaRef.get();
    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      await mahasiswaRef.delete();
      const response = {
        id: data.id,
        nama: data.nama,
        nrp: data.nrp,
        angkatan: data.angkatan,
      };
      callback(null, response);
    }
  } catch (error) {
    console.log("Error deleting mahasiswa: ", error);
    callback(error);
  }
};

const getAllMhs = async (call, callback) => {
  const mhsRef = db.collection("mhs");
  try {
    const querySnapshot = await mhsRef.get();
    const mhs = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const mahasiswa = {
        id: doc.id, // gunakan id dokumen sebagai id buku
        nama: data.nama,
        nrp: data.nrp,
        angkatan: data.angkatan,
      };
      mhs.push(mahasiswa);
    });
    callback(null, { mhs: mhs });
  } catch (error) {
    console.log("Error getting all mhs: ", error);
    callback(error);
  }
};

server.addService(mahasiswa.MahasiswaService.service, {
  addMahasiswa: addMahasiswa,
  getMahasiswa: getMahasiswa,
  updateMahasiswa: updateMahasiswa,
  deleteMahasiswa: deleteMahasiswa,
  GetAllMhs: getAllMhs,
});

server.bindAsync("localhost:5000", ServerCredentials.createInsecure(), () => {
  console.log("Server running at http://localhost:5000");
  server.start();
});
