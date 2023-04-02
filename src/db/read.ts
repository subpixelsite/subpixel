import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { PostDataDB, PostStatus } from '../content/post_data.js';
import { DB, DBClient } from './table.js';

// Get all posts, sorted by latest publish date( or the client could do the sort...)
// Get all posts with tag 'category'
// Get all threads, sorted by latest publish date( or client sorts )
// Get a thread of name 'blah'

// Get a post of name 'blah'
export function getPostByName( name: string, status: PostStatus = PostStatus.Visible ): PostDataDB | undefined
{
	let postData: PostDataDB | undefined;

	( async () =>
	{
		const ddbDocClient = DynamoDBDocumentClient.from( DBClient.get() );
		try
		{
			const results = await ddbDocClient.send(
				new GetCommand(
					{
						TableName: DB.table,
						Key: {
							pk_name: name,
							sk_status: status
						}
					}
				)
			);

			console.log( `DB fetch result: ${JSON.stringify( results, null, 2 )}` );
		} catch ( err )
		{
			if ( process.env.NODE_ENV === 'development' )
				// eslint-disable-next-line no-console
				console.error( `DB fetch error for ${name} with status ${status}:\n${err}` );
			else
				// eslint-disable-next-line no-console
				console.error( `Error fetching post ${name} from database` );

			DBClient.reset();
		}
	} )();

	return postData;
}
