// seed.js — crea datos de prueba al iniciar por primera vez
import { Usuario } from './Models/usuario.model.js'
import { Tarea } from './Models/tarea.model.js'
import { usuariosDB, tareasDB } from './config/db.js'

async function seed() {
  // Verificar si ya hay datos
  const existentes = await usuariosDB.find({})
  if (existentes.length > 0) {
    console.log('✓ Base de datos ya tiene datos, omitiendo seed')
    return
  }

  console.log('🌱 Creando datos de prueba...')

  // Crear usuario admin
  const admin = await Usuario.create({
    nombre: 'Administrador',
    email: 'admin@myhw.com',
    password: 'admin123',
    rol: 'admin'
  })

  // Crear usuario normal
  const user1 = await Usuario.create({
    nombre: 'Ana García',
    email: 'ana@myhw.com',
    password: 'ana123',
    rol: 'usuario'
  })

  const user2 = await Usuario.create({
    nombre: 'Luis Mendoza',
    email: 'luis@myhw.com',
    password: 'luis123',
    rol: 'usuario'
  })

  // Crear tareas de ejemplo
  await Tarea.create({
    titulo: 'Diseñar wireframes del proyecto',
    descripcion: 'Crear los wireframes para las pantallas principales de la aplicación.',
    estado: 'completada',
    prioridad: 'alta',
    asignadoA: user1._id,
    vencimiento: '2025-12-15',
    creadoPor: admin._id
  })

  await Tarea.create({
    titulo: 'Implementar autenticación JWT',
    descripcion: 'Agregar login y registro con tokens JWT y bcrypt para contraseñas.',
    estado: 'completada',
    prioridad: 'alta',
    asignadoA: user2._id,
    vencimiento: '2025-12-20',
    creadoPor: admin._id
  })

  await Tarea.create({
    titulo: 'Crear CRUD de tareas',
    descripcion: 'Desarrollar las operaciones de crear, leer, actualizar y eliminar tareas.',
    estado: 'en_progreso',
    prioridad: 'alta',
    asignadoA: user1._id,
    vencimiento: '2025-12-30',
    creadoPor: admin._id
  })

  await Tarea.create({
    titulo: 'Diseñar estilos CSS',
    descripcion: 'Aplicar estilos a todas las vistas del sistema.',
    estado: 'en_progreso',
    prioridad: 'media',
    asignadoA: user2._id,
    creadoPor: admin._id
  })

  await Tarea.create({
    titulo: 'Implementar filtros dinámicos',
    descripcion: 'Agregar filtros por estado y usuario en el listado de tareas.',
    estado: 'pendiente',
    prioridad: 'media',
    asignadoA: user1._id,
    creadoPor: admin._id
  })

  await Tarea.create({
    titulo: 'Documentar el sistema',
    descripcion: 'Redactar la documentación técnica del proyecto incluyendo diagramas.',
    estado: 'pendiente',
    prioridad: 'baja',
    asignadoA: user2._id,
    creadoPor: admin._id
  })

  console.log('✅ Datos de prueba creados:')
  console.log('   Admin: admin@myhw.com / admin123')
  console.log('   Usuario: ana@myhw.com / ana123')
  console.log('   Usuario: luis@myhw.com / luis123')
}

seed()
