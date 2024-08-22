const db = require('./db');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const template = require('./template');
const qs = require('querystring');

module.exports = {
	home: function (request, response) {
		db.query(`SELECT * FROM topic`, function (error, topics) {
			if (error) {
				throw error;
			}
		
			const title = 'Welcome';
			const description = 'Hello, Node.js';
			const list = template.list(topics);
			const html = template.HTML(title, list,
				`<a href="/create">Create</a>`,
				`<h2>${title}</h2>${description}`
			);
		
			response.send(html);
		});
	},

	page: function (request, response) {
		const filteredId = path.parse(request.params.pageId).base;

		db.query(`SELECT * FROM topic`, function (error, topics) {
			if (error) {
				throw error;
			}
			
			db.query(`SELECT topic.id, title, description, created, name, profile FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [filteredId], function (error2, topic) {
				if (error2) {
					throw error2;
				}
				
				const title = topic[0].title;
				const sanitizeTitle = sanitizeHtml(title);

				const description = topic[0].description;
				const sanitizeDescription = sanitizeHtml(description);

				const list = template.list(topics);
				const html = template.HTML(sanitizeTitle, list,
					`<a href="/create">Create</a>
					<a href="/update/${topic[0].id}">Update</a>
					<form action="/delete_process" method="post" onsubmit="return confirm('Are you sure you want to delete this item?')">
						<input type="hidden" name="id" value="${topic[0].id}">
						<input type="hidden" name="title" value="${sanitizeHtml(topic[0].title)}">
						<input type="submit" value="Delete">
					</form>`,
					`<h2>${sanitizeTitle}</h2>${sanitizeDescription}<p><strong>-${sanitizeHtml(topic[0].name)}-</strong></p>`
				);
	
				response.send(html);
			});
	
		});
	},

	create: function (request, response) {
		db.query(`SELECT * FROM topic`, function (error, topics) {
			if (error) {
				throw error;
			}

			db.query(`SELECT * FROM author`, function (error2, authors) {
				if (error2) {
					throw error2;
				}
				
				const title = 'Create';
				const list = template.list(topics);
				const html = template.HTML(title, list, '',
					`<h2>${title}</h2>
					<form action="/create_process" method="post">
						<p><input type="text" name="title" placeholder="title" required></p>
						<p><textarea name="description" placeholder="description"></textarea></p>
						<p>${template.authorSelect(authors)}</p>
						<p><input type="submit" value="Create"></p>
					</form>`
				);

				response.send(html);
			});
		});
	},

	create_process: function (request, response) {
		let body = '';
		request.on('data', function (data){
			body = body + data;
		});

		request.on('end', function (){
			const post = qs.parse(body);
			
			db.query(`INSERT INTO topic (id, title, description, created, author_id) VALUES(NULL, ?, ?, NOW(), ?)`, [post.title, post.description, post.author], function (error, result) {
				if (error) {
					throw error;
				}
				
				response.redirect(`/page/${result.insertId}`);
				console.log(`Created : ${post.title}`);

			});
		});
	},

	update: function (request, response) {
		const filteredId = path.parse(request.params.updateId).base;

		db.query(`SELECT * FROM topic`, function (error, topics) {
			if (error) {
				throw error;
			}
			
			db.query(`SELECT * FROM topic WHERE id=?`, [filteredId], function (error2, topic) {
				if (error2) {
					throw error2;
				}

				db.query(`SELECT * FROM author`, function (error3, authors) {
					if (error3) {
						throw error3;
					}

					const list = template.list(topics);
					const html = template.HTML(`Update ${sanitizeHtml(topic[0].title)}`, list, '',
						`<h2>Update ${sanitizeHtml(topic[0].title)}</h2>
						<form action="/update_process" method="post">
							<input type="hidden" name="id" value="${topic[0].id}">
							<input type="hidden" name="old_title" value="${sanitizeHtml(topic[0].title)}">
							<p><input type="text" name="title" placeholder="title" required value="${sanitizeHtml(topic[0].title)}"></p>
							<p><textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea></p>
							<p>${template.authorSelect(authors, topic[0].author_id)}</p>
							<p><input type="submit" value="Update"></p>
						</form>`
					);

					response.send(html);
				});
			});
		});
	},

	update_process: function (request, response) {
		let body = '';
		request.on('data', function (data){
			body = body + data;
		});

		request.on('end', function (){
			const post = qs.parse(body);

			db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], function (error, result) {
				if (error) {
					throw error;
				}
				
				response.redirect(`/page/${post.id}`)
				console.log(`Updated : ${post.old_title} -> ${post.title}`);
			});
		});
	},

	delete_process: function (request, response) {
		let body = '';
		request.on('data', function (data){
			body = body + data;
		});

		request.on('end', function (){
			const post = qs.parse(body);

			db.query(`DELETE FROM topic WHERE id=?`, [post.id], function (error, result) {
				if (error) {
					throw error;
				}
				
				response.redirect('/');
				console.log(`Deleted : ${post.title}`);
			});
		});
	}
}