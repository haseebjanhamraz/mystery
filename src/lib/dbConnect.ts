import mongoose from 'mongoose'

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}
const MONGODB_URI = process.env.MONGODB_URI;
async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database")
        return
    }
    try {
        console.log("Connecting to database...")
        const db = await mongoose.connect(MONGODB_URI || "", {})
        connection.isConnected = db.connections[0].readyState
        console.log("Connected to database")
    } catch (error) {
        console.log("Database connection failed")
        // console.error(error)
        // process.exit(1)
    }
}

export default dbConnect