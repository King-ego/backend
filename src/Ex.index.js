const { request, response } = require('express');
const express = require('express');
const { uuid } = require('uuidv4');
const app = express();
app.use(express.json());

const projects = [];

app.get('/project', (request, response) => {
  const { title } = request.query;
  console.log(title);
  const result = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;
  return response.status(202).json(result);
});

app.post('/project', (request, response) => {
  const { title, name } = request.body;
  const project = { id: uuid(), title, name };
  projects.push(project);
  return response.status(202).json(project);
});

app.put('/project/:id', (request, response) => {
  const { id } = request.params;
  const { title, name } = request.body;
  const projectIndex = projects.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return response.status(404).json({ error: 'Project Not Found' });
  }
  const project = { id, title, name };
  projects[projectIndex] = project;
  return response.status(202).json(project);
});

app.delete('/project/:id', (resquest, response) => {
  const { id } = resquest.params;
  const projectIndex = projects.findIndex((project) => project.id === id);
  if (projectIndex < 0) {
    return response.status(404).json({ error: 'Project Not Found' });
  }
  projects.splice(projectIndex, 1);
  return response.status(204).send();
});
app.listen(3333, () => {
  console.log('conect back-end susses');
});
