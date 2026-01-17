/* eslint-disable jsdoc/require-jsdoc */
/**
 * Servicio de gestión de mensajes usando closures
 *
 * TODO:
 * Implementar este servicio siguiendo el patrón usado en userService.js
 *
 * Requisitos:
 * - Usar closures para mantener estado privado
 * - Mantener un array de mensajes en memoria
 * - Cada mensaje debe tener: {id, email, message, timestamp}
 * - IMPORTANTE: Verificar que el email existe usando userService.getUserByEmail()
 *   antes de crear un mensaje
 */

export function createMessageService(userService) {
  // TODO: Declarar variables privadas
  // - Array de mensajes
  let receivedMessages = [];
  // - Contador para IDs
  let nextId = 1;

  /**
   * Crea un nuevo mensaje
   * @param {string} email - Email del usuario que envía
   * @param {string} message - Contenido del mensaje
   * @returns {object} Mensaje creado
   * @throws {Error} Si el email no existe
   */
  function createMessage(email, message) {
    // TODO: Implementar
    // 1. Verificar que el usuario existe (userService.getUserByEmail)
    let user = userService.getUserByEmail(email);
    // 2. Si no existe, lanzar error
    if(!user) throw new Error('createMessage() no implementado - TODO para estudiantes');
    // 3. Crear objeto mensaje con id, email, message, timestamp
    const newMessage ={
      id : 'Message_'+String(nextId),
      email: email,
      sentMessage: message,
      timestamp: new Date().toISOString()
    };
    // 4. Agregar a la lista
    receivedMessages.push(newMessage);
    nextId++;
    // 5. Retornar el mensaje creado
    return newMessage;
  }

  /**
   * Obtiene los últimos N mensajes
   * @param {number} limit - Cantidad de mensajes a retornar
   * @returns {Array} Array de mensajes
   */
  function getRecentMessages(limit = 50) {
    // TODO: Implementar
    // Retornar los últimos 'limit' mensajes, ordenados por timestamp
    if(limit <=0) return null;
    if(limit>=nextId-1) return receivedMessages; // -1 porque siempre que subimos un mensaje guardamos el indice del siguiente : tenemos X mensajes -> nextId = X+1
    return receivedMessages.slice(-limit); // de esta forma la funcion cuenta desde el final del array y coge los últimos elementos
  }

  /**
   * Obtiene mensajes desde un timestamp específico
   * @param {string} since - Timestamp ISO
   * @returns {Array} Mensajes nuevos desde ese timestamp
   */
  function getMessagesSince(since) {
    // TODO: Implementar
    // Filtrar mensajes cuyo timestamp sea mayor que 'since'
    let index = receivedMessages.indexOf(receivedMessages.find(m => m.timestamp >= since));
    return getRecentMessages(-index); // le ponemos negativo para que en la función lo pase a positivo y cuente desde el inicio en vez desde el final
  }

  // Exponer la API pública del servicio
  return {
    createMessage,
    getRecentMessages,
    getMessagesSince
  };
}
