//const { query } = require('express');
const { response } = require('express');
const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');
const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
/**
 *Metodos HTTP
 *GET: buscar informaçoes do back-end
 *POST: criar uma informaçoes no back-end
 *PUT/PATH: alterar uma informaçoes no back-end
 *DELETE: deetar uma informaçoes no back-end
 */

/*
 *Tipos de parametros
 *
 * Query Params: Filtro e Paginação GET
 * Route Params: Indentificar recursos (Atualizar/Deletar)
 * Request Body: conteudo na hora de editar um recurso (JSON)
 */

/*
 *Middleware:
 *interceptador de requisições que interrompe totalmente a requisição ou alterar dados da requisição
 */
const projects = [];

function logRequests(request, response, next) {
  //Middleware
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  next(); //necessário para chamar a proxima rota
  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  // middleware
  const { id } = request.params;
  if (!isUuid(id))
    return response.status(400).json({ error: 'Invalid project ID.' });
  return next();
}

app.use(logRequests);
app.use('/project/:id', validateProjectId);

app.get(
  '/project',
  /*middlewarel, 
    middlewarel, (inlimitados middlewarel) */ (request, response) => {
    const { title } = request.query;
    // console.log(title);
    // console.log(owner);
    const resutl = title
      ? projects.filter((project) => project.title.includes(title))
      : projects;
    return response.json(resutl);
  }
);

app.post('/project', (request, response2) => {
  const { title, name } = request.body;
  // console.log(title);
  // console.log(name);
  const project = { id: uuid(), title, name };
  projects.push(project);
  return response2.json(project);
});

app.put('/project/:id', (request2, response2) => {
  const { id } = request2.params;
  const { title, name } = request2.body;
  // console.log(id);
  const projectIndex = projects.findIndex((project) => project.id === id);
  // console.log(projectIndex);
  if (projectIndex < 0) {
    return response2.status(404).json({ error: 'Project Not Found' });
  }
  const project = { id, title, name };
  projects[projectIndex] = project;

  return response2.json(project);
});

app.delete('/project/:id', (request, response2) => {
  const { id } = request.params;
  const projectIndex = projects.findIndex((project) => project.id === id);
  // console.log(projectIndex);
  if (projectIndex < 0) {
    return response2.status(404).json({ error: 'Project Not Found' });
  }
  projects.splice(projectIndex, 1);
  return response2.status(204).send();
});

app.listen(3333, () => {
  console.log('Back End Started');
});
//node src/index.js
