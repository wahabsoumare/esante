const swaggerAutogen = require('swagger-autogen')(); 
const doc = { 
info: { 
title: 'API Documentation', 
description: 'Documentation générée automatiquement avec Swagger.', 
}, 
host: 'localhost:3000', 
schemes: ['http'], 
}; 
const outputFile = './swagger-output.json';  
const endpointsFiles = ['./app.js']; 
swaggerAutogen(outputFile, endpointsFiles).then(() => { 
console.log('Documentation Swagger générée avec succès.'); 
});