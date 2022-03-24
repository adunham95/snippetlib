var fs = require('fs');
const path = require('path');

let allSnippets; 
let snippetTypes = {

}

function readFiles(dir) {

	const filenames = fs.readdirSync(dir);

	const snippets = filenames.filter(file => {
		if (path.extname(file) == ".json")
		  return file
	  })

	snippets.forEach(snip => {
		const filePath = path.resolve(dir, snip);
		console.log("reading", filePath)
		let content = fs.readFileSync(filePath).toString();
		allSnippets = {
			...allSnippets,
			...JSON.parse(content)
		};
	});

	for (const [key, value] of Object.entries(allSnippets)) {
		let scope = value.scope.split(',')
		scope.forEach(s => {
			if(!snippetTypes.hasOwnProperty(s)) {
				snippetTypes[s] = {[key]: value}
			}
			if(snippetTypes.hasOwnProperty(s)){
				snippetTypes[s] = {
					...snippetTypes[s],
					[key]: value
				}	
			}
		})
	};

	for (const [key, value] of Object.entries(snippetTypes)) {
		const filePath = path.resolve("./", `${key}.code-snippets`);
		console.log("writing", filePath)
		fs.writeFileSync(filePath, JSON.stringify(value), null, 4);
	};

	console.log("finished");

  }

readFiles("./snippets")