/* eslint-disable implicit-arrow-linebreak */
import { GetCommand, GetCommandInput, GetCommandOutput } from '@aws-sdk/lib-dynamodb';
// eslint-disable-next-line max-len
import { GetItemCommand, GetItemCommandInput, GetItemCommandOutput, QueryCommand, QueryCommandInput, QueryCommandOutput } from '@aws-sdk/client-dynamodb';
import { DB, DBClient } from './table.js';
import { ElementType, ElementStatus } from '../content/post_data.js';

export const DEBUG_DB_GET = 0;		// 0, 1, 2, 3

// Get all posts with tag 'category'
// Get all threads, sorted by latest publish date( or client sorts )
// Get a thread of name 'blah'

// Get all posts, sorted by latest publish date( or the client could do the sort...)
// eslint-disable-next-line max-len
export const getPostList = async ( status: ElementStatus | undefined = undefined ): Promise<QueryCommandOutput> =>
{
	// Get all( visible ) posts
	// 	- QUERY GSI_TY
	// 		- key: #sk EQ '1'				// post type
	// 			- key: #st EQ '2'

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

	const yesStatusInput: QueryCommandInput = {

		TableName: DB.table,
		IndexName: DB.typeIndex,
		KeyConditionExpression: 'sk = :type and st = :status',
		ExpressionAttributeValues: {
			':type': { S: `${ElementType.Post}` },
			':status': { S: `${status}` }
		}
	};
	const noStatusInput: QueryCommandInput = {

		TableName: DB.table,
		IndexName: DB.typeIndex,
		KeyConditionExpression: 'sk = :type',
		ExpressionAttributeValues: {
			':type': { S: `${ElementType.Post}` }
		}
	};

	const command = new QueryCommand( status !== undefined ? yesStatusInput : noStatusInput );
	return DBClient.get().send( command );
};

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
