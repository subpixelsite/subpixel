// Load all *.vs and *.fs files from shaders/ folder
// Create text stream of a JS file including a map of each shader by filename
// Save the text stream as shaders.js exporting the map as a module to the specified build artifact folder (eg: out-tsc/ or dist/)

const fs = require( 'fs' );
const path = require( 'path' );
const console = require( 'console' );

if ( process.argv.length !== 4 )
{
	console.error( `Usage: ${process.argv.join( ' ' )} 'relative src dir' 'relative out file'` );
	process.exit( 1 );
}

let srcDir = path.join( process.cwd(), process.argv[2] );
srcDir = srcDir.endsWith( path.sep ) ? srcDir : srcDir + path.sep;
const outFile = path.join( process.cwd(), process.argv[3] );

console.log( `Building shaders from ${srcDir} to ${outFile}\n` );

let filenames = fs.readdirSync( srcDir );
filenames = filenames.filter( file => ['.fs', '.vs'].indexOf( path.extname( file ) ) > -1 );
filenames.sort();

let shaderTS = `// Compiled shader contents
// Copyright 2023 Christopher Lambert

export const shaders = new Map();
`;

filenames.forEach( file => {
	let contents;
	try {
		contents = fs.readFileSync( srcDir + file, 'utf8' );
	} catch ( error )	{
		console.error( `Error loading ${file}: ${error}` );
	}
	shaderTS += `
// ---------------- ${file}
shaders.set( '${file}', \`
// --- ${file}

${contents}
\` );
`;

	console.log( `Loaded and stored ${file}` );
} );

// Save combined shader TS file

fs.writeFileSync( outFile, shaderTS );
console.log( `\nWrote ${filenames.length} shaders to ${outFile}` );
