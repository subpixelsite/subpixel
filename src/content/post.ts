export interface Post
{
	id: number;
	title: string;
	author: string;
	dateCreated: number;
	tags: string[];
	description: string;
	body: string;
}