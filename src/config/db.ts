import mongoose from "mongoose";
import colors from "colors"

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI)

        const url = `${connection.host}: ${connection.port}`
        console.log(colors.bgMagenta.white(`MongoDB conectado en ${url}`))

    } catch (e) {
        console.log(colors.bgRed.white(`ERROR conexion BDD: ${e.message}`))
        process.exit(1)
    }
}