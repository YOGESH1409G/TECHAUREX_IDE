// src/sockets/index.js
//TODO - to complete
export function initNamespaces(io) {
  // Minimal: just log when a client connects
  io.on("connection", (socket) => {
    console.log(`🟢 Connected: ${socket.id}`);
    socket.on("disconnect", (reason) => {
      console.log(`🔴 Disconnected (${socket.id}): ${reason}`);
    });
  });
}


// // src/sockets/index.js
// import logger from "../config/logger.js";
// import { socketAuth } from "../middleware/socketAuth.middleware.js";

// // Namespace initializers
// import { initChatNamespace } from "./namespaces/chat.namespace.js";
// import { initCallNamespace } from "./namespaces/call.namespace.js";
// import { initPresenceNamespace } from "./namespaces/presence.namespace.js";

// /**
//  * Initialize all Socket.IO namespaces and apply
//  * per-namespace middleware + event handlers.
//  *
//  * @param {import("socket.io").Server} io
//  */
// export function initNamespaces(io) {
//   logger.info("[sockets] Initializing namespaces...");


//   // 1️⃣ /chat namespace
//   const chatNs = io.of("/chat");
//   chatNs.use(socketAuth); 
//   initChatNamespace(chatNs);
//   logger.info("[sockets] /chat namespace initialized");


//   // 2️⃣ /call namespace
//   const callNs = io.of("/call");
//   callNs.use(socketAuth);
//   initCallNamespace(callNs);
//   logger.info("[sockets] /call namespace initialized");


//   // 3️⃣ /presence namespace
//   const presenceNs = io.of("/presence");
//   presenceNs.use(socketAuth);
//   initPresenceNamespace(presenceNs);
//   logger.info("[sockets] /presence namespace initialized");

  
//   logger.info("[sockets] All namespaces registered");
// }
