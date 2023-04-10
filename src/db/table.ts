import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

export namespace DB
{
	export const region: string = 'us-east-1';
	export const table: string = 'elements';
	export const typeIndex: string = 'gsi_ty';

	export const credentials = fromCognitoIdentityPool( {
		client: new CognitoIdentityClient( { region: DB.region } ),
		identityPoolId: 'us-east-1:3adc438a-9582-43dd-b191-beeb6b11db9c'
	} );
}

export class DBClient
{
	// This is a singleton to handle a long-living resource but potential failure.
	private static instance: DynamoDBClient | undefined;
	private static docInstance: DynamoDBDocumentClient | undefined;

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

	public static getDocClient(): DynamoDBDocumentClient
	{
		const marshallOptions = {
			// Whether to automatically convert empty strings, blobs, and sets to `null`.
			convertEmptyValues: false, // false, by default.
			// Whether to remove undefined values while marshalling.
			removeUndefinedValues: false, // false, by default.
			// Whether to convert typeof object to map attribute.
			convertClassInstanceToMap: false // false, by default.
		};
		const unmarshallOptions = {
			// Whether to return numbers as a string instead of converting them to native JavaScript numbers.
			wrapNumbers: false // false, by default.
		};
		if ( DBClient.docInstance === undefined )
			DBClient.docInstance = DynamoDBDocumentClient.from( DBClient.get(), { marshallOptions, unmarshallOptions } );

		return DBClient.docInstance;
	}
}
