import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

export namespace DB
{
	export const region: string = 'us-east-1';
	export const table: string = 'post_data';
	export const pk: string = 'pk_name';
	export const sk: string = 'sk_status';

	export const credentials = fromCognitoIdentityPool( {
		client: new CognitoIdentityClient( { region: DB.region } ),
		identityPoolId: 'us-east-1:3adc438a-9582-43dd-b191-beeb6b11db9c'
	} );
}

export class DBClient
{
	// This is a singleton to handle a long-living resource but potential failure.
	private static instance: DynamoDBClient | undefined;

	// eslint-disable-next-line no-useless-constructor, no-empty-function
	private constructor() {}
	public static get(): DynamoDBClient
	{
		if ( DBClient.instance === undefined )
			DBClient.instance = new DynamoDBClient( { region: DB.region, credentials: DB.credentials } );

		return DBClient.instance;
	}

	public static reset()
	{
		DBClient.instance = undefined;
	}
}
