import mongoose from "mongoose";

//CONEXION A LA BASE DE DATOS
export class ClienteMongoDb {
  static async connect() {
    try {
      const conn = await mongoose.connect(
        `${process.env.MONGODB_URI}`,
      );
      console.warn(`Se realizo la conexion a mongoDB ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit();
    }
  }
}
