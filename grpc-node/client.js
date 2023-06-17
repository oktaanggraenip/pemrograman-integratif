import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const packageDefinition = loadSync("./mahasiswa.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const mahasiswa = loadPackageDefinition(packageDefinition).mahasiswa;

import { createInterface } from "readline";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// create dummy data
const dummyMahasiswa = {
  id: "123",
  nama: "Chwenotchew",
  nrp: "5555",
  angkatan: "2025"
};

const addMahasiswa = () => {
  readline.question("Enter mahasiswa ID: ", (id) => {
    readline.question("Enter mahasiswa nama: ", (nama) => {
      readline.question("Enter mahasiswa nrp: ", (nrp) => {
        readline.question("Enter mahasiswa angkatan: ", (angkatan) => {
        const mahasiswa = {
          id: id,
          nama: nama,
          nrp: nrp,
          angkatan: angkatan,
        };
        client.AddMahasiswa({ mahasiswa: mahasiswa }, (err, response) => {
          console.log("Mahasiswa telah berhasil ditambahkan!", response);
          readline.close();
        });
      });
    });
  });
})
};

const getMahasiswa = () => {
  readline.question("Masukkan ID mahasiswa: ", (id) => {
    client.GetMahasiswa({ id: id }, (err, response) => {
      console.log("Mahasiswa telah berhasil ditemukan!", response);
      readline.close();
    });
  });
};

const updateMahasiswa = () => {
  readline.question("Masukkan ID mahasiswa: ", (id) => {
    readline.question("Masukkan nama update mahasiswa: ", (nama) => {
      readline.question("Masukkan nrp update mahasiswa: ", (nrp) => {
        readline.question("Masukkan angkatan update mahasiswa: ", (angkatan) => {
        const mahasiswa = {
          id: id,
          nama: nama,
          nrp: nrp,
          angkatan: angkatan,
        };
        client.UpdateMahasiswa({ mahasiswa: mahasiswa }, (err, response) => {
          console.log("Mahasiswa telah berhasil diupdate!", response);
          readline.close();
        });
      });
    });
  });
})
};

const deleteMahasiswa = () => {
  readline.question("Masukkan ID mahasiswa: ", (id) => {
    client.DeleteMahasiswa({ id: id }, (err, response) => {
      console.log("Mahasiswa dengan ID ${id} telah berhasil dihapus!", response);
      readline.close();
    });
  });
};
const getAllMhs = () => {
  client.getAllMhs({}, (err, response) => {
    if (err) {
      console.error("Gagal mendapatkan data semua mahasiswa!", err);
      return;
    }
    console.log("Semua data mahasiswa telah berhasil ditemukan!", response.mhs);
    readline.close();
  });
};

const main = () => {
  readline.question(
    `Berikut ini terdapat beberapa opsi untuk mengelola data mahasiswa, silakan pilih salah satu :
    "add", "get", "update", "delete", "getAll" \n`,
    (operation) => {
      switch (operation) {
        case "add":
          addMahasiswa();
          break;
        case "get":
          getMahasiswa();
          break;
        case "update":
          updateMahasiswa();
          break;
        case "delete":
          deleteMahasiswa();
          break;
        case "getAll":
          getAllMhs();
          break;
        default:
          console.log("Invalid operation");
          readline.close();
          break;
      }
    }
  );
};

const client = new mahasiswa.MahasiswaService(
  "localhost:5000",
  credentials.createInsecure()
);

main();
