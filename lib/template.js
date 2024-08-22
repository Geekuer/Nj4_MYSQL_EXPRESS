const sanitizeHtml = require('sanitize-html');

module.exports = {
	HTML: function (title, list, control, body) {
		return `
		<!doctype html>
		<html>

		<head>
			<title>${title}</title>
			<meta charset="utf-8">
		</head>

		<body>
			<h1><a href="/">WEB</a></h1>
			<a href="/author">Author</a>
			${list}
			${control}
			${body}
		</body>
		
		</html>
		`;
	},

	list: function (topics) {
		let list = '<ol>';
		for (const topic of topics) {
			list += `<li><a href="/page/${topic.id}">${sanitizeHtml(topic.title)}</a></li>`;
		}

		list += '</ol>';
		return list;
	},
  
	authorSelect: function (authors, author_id) {
		let tag = '';
		for (let i = 0; i < authors.length; i++) {
			let selected = '';
			if (authors[i].id === author_id) {
				selected = 'selected';
			}
			tag += `<option value="${authors[i].id}" ${selected}>${sanitizeHtml(authors[i].name)}</option>`;
		}

		return `<select name="author">${tag}</select>`
	},

	authorTable: function (authors) {
		let tag = '';
		for (let i = 0; i < authors.length; i++) {
			tag += `
				<tr>
					<td>${sanitizeHtml(authors[i].name)}</td>
					<td>${sanitizeHtml(authors[i].profile)}</td>
					<td><a href="/author/update/${authors[i].id}">Update</a></td>
					<td>
						<form action="/author/delete_process" method="post" onsubmit="return confirm('Are you sure you want to delete author data?\\nYour items will also be deleted.')">
							<input type="hidden" name="id" value="${authors[i].id}">
							<input type="hidden" name="old_name" value="${sanitizeHtml(authors[i].name)}">
							<input type="submit" value="Delete">
						</form>
					</td>
				</tr>
				`
		}
		
		return `<table>${tag}</table>`;
	}
}