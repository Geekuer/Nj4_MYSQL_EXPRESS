const author = require('./lib/author');
const express = require('express');
const app = express();
const topic = require('./lib/topic');

app.get('/', (request, response) => {
	topic.home(request, response);
});

app.get('/page/:pageId', (request, response) => {
	topic.page(request, response);
});

app.get('/create', (request, response) => {
	topic.create(request, response);
});

app.post('/create_process', (request, response) => {
	topic.create_process(request, response);
});

app.get('/update/:updateId', (request, response) => {
	topic.update(request, response);
});

app.post('/update_process', (request, response) => {
	topic.update_process(request, response);
});

app.post('/delete_process', (request, response) => {
	topic.delete_process(request, response);
});

app.get('/author', (request, response) => {
	author.home(request, response);
});

app.post('/author/create_process', (request, response) => {
	author.create_process(request, response);
});

app.get('/author/update/:updateId', (request, response) => {
	author.update(request, response);
});

app.post('/author/update_process', (request, response) => {
	author.update_process(request, response);
});

app.post('/author/delete_process', (request, response) => {
	author.delete_process(request, response);
});

app.use((request, response) => {
	response.status(404).send('Not Found');
});

PORT = 3004;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});	