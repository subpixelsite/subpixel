/* eslint-disable implicit-arrow-linebreak */
import { GetCommand, GetCommandInput, GetCommandOutput } from '@aws-sdk/lib-dynamodb';
import { GetItemCommand, GetItemCommandInput, GetItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { DB, DBClient } from './table.js';
import { ElementType, ElementStatus } from '../content/post_data.js';

export const DEBUG_DB_GET = 0;		// 0, 1

// Get all posts, sorted by latest publish date( or the client could do the sort...)
// Get all posts with tag 'category'
// Get all threads, sorted by latest publish date( or client sorts )
// Get a thread of name 'blah'

// Get a post of name 'blah'
export const getPostByName = async ( name: string, forceConsistent: boolean = false ): Promise<GetItemCommandOutput> =>
{
	// Document Client version:

	// const params = {
	// 	// No filtering on status
	// 	TableName: DB.table,
	// 	Key: {
	// 		pk: name,
	// 		sk: `${ElementType.Post}`
	// 	},
	// 	ConsistentRead: forceConsistent
	// };

	// console.log( `GetCommand:\n${JSON.stringify( params, null, 2 )}` );
	// // if ( params.tg !== null && params.tg !== undefined )
	// // 	console.log( `tags:\n${JSON.stringify( params.tg, null, 2 )}` );

	// return DBClient.getDocClient().send<GetCommandInput, GetCommandOutput>( new GetCommand( params ) );

	// Raw Document version:
	const input: GetItemCommandInput = {

		TableName: DB.table,
		Key: {
			pk: { S: name },
			sk: { S: `${ElementType.Post}` }
		},
		ConsistentRead: forceConsistent
	};

	const command = new GetItemCommand( input );
	return DBClient.get().send( command );
};

// Get a post of name 'blah' and visibility
// eslint-disable-next-line max-len
export const getPostByNameAndVisibility = async ( name: string, status: ElementStatus, forceConsistent: boolean = false ): Promise<GetCommandOutput> =>
{
	const params = {
		TableName: DB.table,
		Key: {
			pk: name,
			sk: `${ElementType.Post}`
		},
		Item: {
			st: `${status}`
		},
		ConsistentRead: forceConsistent
	};

	if ( DEBUG_DB_GET > 1 )
		// eslint-disable-next-line no-console
		console.log( `GetCommand:\n${JSON.stringify( params, null, 2 )}` );

	return DBClient.getDocClient().send<GetCommandInput, GetCommandOutput>( new GetCommand( params ) );
};
