const swaggerAutogen = require('swagger-autogen')();
const doc = {
        info:{
                title:'API projet e-sante',
                description: 'documentation genereé automatiquement avec swagger',
        },
};
const outputFile = './swagger-output.json';
const endpointFiles = ['./server.js'];
swaggerAutogen(outputFile, endpointFiles).then(()=>{
        console.log('Documentation swagger generé avec success');
});
