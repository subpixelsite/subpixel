/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable key-spacing */
import { PutCommand, PutCommandInput, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { ElementDataDB } from '../content/post_data.js';
import { DB, DBClient } from './table.js';

export const DEBUG_DB_PUT = 0;		// 0, 1, 2

// Set a post of name 'blah'
export const setPostByName = async ( post: ElementDataDB ): Promise<PutCommandOutput> =>
	DBClient.getDocClient().send<PutCommandInput, PutCommandOutput>(
		new PutCommand(
			{
				TableName: DB.table,
				Item: {
					pk: post.pk,
					sk: post.sk,
					st: post.st,
					ti: post.ti,
					au: post.au,
					dc: post.dc,
					dp: post.dp,
					dm: post.dm,
					tg: post.tg,
					hi: post.hi,
					hr: post.hr,
					ha: post.ha,
					de: post.de,
					md: post.md,
					co: post.co,
					ne: post.ne
				}
			}
		)
	);
