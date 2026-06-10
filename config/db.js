import Datastore from 'nedb-promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Cada colección se guarda como un archivo .db en la carpeta data/
const dbPath = join(__dirname, '../data')

export const usuariosDB = Datastore.create({
  filename: join(dbPath, 'usuarios.db'),
  autoload: true
})

export const tareasDB = Datastore.create({
  filename: join(dbPath, 'tareas.db'),
  autoload: true
})
