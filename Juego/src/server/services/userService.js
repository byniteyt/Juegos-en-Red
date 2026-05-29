/* eslint-disable jsdoc/require-jsdoc */
/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */

export function createUserService() {
  // Estado privado: almacén de usuarios
  let users = [];
  let nextId = 1;

  /**
   * Crea un nuevo usuario
   * @param {object} userData - {name, password, avatar, level}
   * @returns {object} Usuario creado
   */
  function createUser(userData) {
    // 1. Validar que el jugador no exista ya
    const existingUser = users.find(u => u.name === userData.name);
    if (existingUser) {
      throw new Error('El usuario ya está registrado');
    }
    
    console.log("Se ha creado un nuevo user de id Player_"+String(nextId));
    // 2. Crear objeto usuario con id único y createdAt
    const newUser = {
      id: 'Player_'+String(nextId),
      password: userData.password,
      name: userData.name,
      avatar: userData.avatar || '',
      level: userData.level || 1,
      createdAt: new Date().toISOString()
    };

    // 3. Agregar a la lista de usuarios
    users.push(newUser);

    // 4. Incrementar nextId
    nextId++;

    // 5. Retornar el usuario creado
    return newUser;
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Array} Array de usuarios
   */
  function getAllUsers() {
    // TODO: Implementar
    // Retornar una copia del array de usuarios
    return [...users];
  }

  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {object|null} Usuario encontrado o null
   */
  function getUserById(id) {
    const user = users.find(u => u.id === id);
    return user || null;
  }

  /**
   * Busca un usuario por email
   * @param {string} name - nombre del usuario
   * @returns {object|null} Usuario encontrado o null
   */
  function getUserByName(name) {
    // TODO: Implementar
    // Buscar y retornar el usuario por email, o null si no existe
    // IMPORTANTE: Esta función será usada por el chat para verificar emails
    let findUser = users.find(u => u.name === name);
    if(findUser) return findUser;
    else{
      console.log("No existe usuario con el nombre "+name);
      return null;
    } 
  }

  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {object} updates - Campos a actualizar
   * @returns {object|null} Usuario actualizado o null si no existe
   */
  function updateUser(id, updates) {
    // TODO: Implementar
    // 1. Buscar el usuario por id
    let findUser = users.find(u => u.id === 'Player_'+id);
    // 2. Si no existe, retornar null
    if(!findUser) return null;
    // 3. Actualizar solo los campos permitidos (name, avatar, level)
    // 4. NO permitir actualizar id, email, o createdAt
    findUser.name = updates.name;
    findUser.avatar = updates.avatar;
    findUser.level = updates.level;
    // 5. Retornar el usuario actualizado
    return findUser;
  }

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si no existía
   */
  function deleteUser(id) {
    // TODO: Implementar
    // 1. Buscar el índice del usuario
    let findUser = users.find(u => u.id === 'Player_'+id||u.id === id);
    if(!findUser) return false;
    let userIndex = users.indexOf(findUser);
    // 2. Si existe, eliminarlo del array
    users.splice(userIndex,1);
    // 3. Retornar true si se eliminó, false si no existía
    return true;
  }

  // Exponer la API pública del servicio
  return {
    createUser,
    getAllUsers,
    getUserById,
    getUserByName,
    updateUser,
    deleteUser
  };
}
