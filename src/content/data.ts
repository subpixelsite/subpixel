/* eslint-disable quotes */
/* eslint-disable max-len */
import { unmarshall, NativeAttributeValue } from '@aws-sdk/util-dynamodb';
import { ElementData, ElementType, ElementStatus, elementToDBData, recordToElementData } from './post_data.js';
import { getPostList, getPostByName, DEBUG_DB_GET } from '../db/read.js';
import { setPostByName, DEBUG_DB_PUT } from '../db/write.js';
import { DBClient } from '../db/table.js';

export class Database
{
	// This is a singleton.
	private static instance: Database;
	public static getDB(): Database
	{
		if ( !Database.instance )
			Database.instance = new Database();

		return Database.instance;
	}

	private devData: { [key: string]: ElementData } = {};

	public getPostData( name: string, forceConsistent: boolean, onResult: ( post: ElementData | undefined ) => void, status?: ElementStatus )
	{
		if ( DEBUG_DB_GET > 0 )
			// eslint-disable-next-line no-console
			console.log( `Fetching post '${name}'` );

		getPostByName( name, forceConsistent )
			.then( result =>
			{
				let post: ElementData | undefined;

				if ( result !== undefined )
				{
					if ( DEBUG_DB_GET > 2 )
						// eslint-disable-next-line no-console
						console.log( `DB raw result for '${name}': ${JSON.stringify( result, null, 2 )}` );

					const { Item } = result;
					const item = unmarshall( Item! );
					if ( item.tg !== undefined )
						item.tg = [...item.tg];
					else
						item.tg = [];

					if ( DEBUG_DB_GET > 1 )
						// eslint-disable-next-line no-console
						console.log( `DB fetch result for item '${name}': ${JSON.stringify( item, null, 2 )}` );

					// Fill in the primary compound key, which is missing from the returned results
					const record = item as Record<string, NativeAttributeValue>;

					post = recordToElementData( record, name, `${ElementType.Post}` );

					if ( status !== undefined && status !== ElementStatus.Invalid && post.status !== status )
					{
						if ( DEBUG_DB_GET > 1 )
							// eslint-disable-next-line no-console
							console.log( `Element '${name}' found but status '${post.status}' doesn't match requested '${status}'` );

						post = undefined;
					}
				}

				if ( DEBUG_DB_GET > 1 )
					// eslint-disable-next-line no-console
					console.log( `DB fetch result for '${name}': ${JSON.stringify( post, null, 2 )}` );

				onResult( post );
			} )
			.catch( error =>
			{
				if ( process.env.NODE_ENV === 'development' )
					// eslint-disable-next-line no-console
					console.error( `DB fetch error for ${name} with status ${status}:\n${error}` );
				else
					// eslint-disable-next-line no-console
					console.error( `Error fetching post ${name} from database` );

				onResult( undefined );
			} );
	}

	public setPostData( datum: ElementData, onResult: ( error?: string ) => void )
	{
		const key = datum.name;

		if ( DEBUG_DB_PUT > 0 )
			// eslint-disable-next-line no-console
			console.log( `Setting post '${key}'` );

		// convert to PostDataDB
		const db = elementToDBData( datum );
		setPostByName( db )
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.then( result =>
			{
				if ( DEBUG_DB_PUT > 1 )
					// eslint-disable-next-line no-console
					console.log( `DB put result: ${JSON.stringify( result, null, 2 )}` );

				// No errors to report
				onResult( undefined );
			} )
			.catch( err =>
			{
				// eslint-disable-next-line no-console
				console.error( `DB put error for ${key}:\n${err}` );

				// release the singleton and start over
				DBClient.reset();

				onResult( err );
			} );

		if ( process.env.NODE_ENV === 'development' )
			// Make a shallow copy of the datum
			this.devData[key] = { ...datum };
	}

	getPostsList( onResult: ( posts: ElementData[] | undefined ) => void, status?: ElementStatus )
	{
		let posts: ElementData[] = [];

		getPostList( status )
			.then( result =>
			{
				// let posts: ElementData[] | undefined;

				if ( result !== undefined )
				{
					if ( DEBUG_DB_GET > 2 )
						// eslint-disable-next-line no-console
						console.log( `DB raw result for getPostList: ${JSON.stringify( result, null, 4 )}` );

					const { Count, Items } = result;

					if ( Count !== undefined && Items !== undefined )
					{
						if ( DEBUG_DB_GET > 1 )
							// eslint-disable-next-line no-console
							console.log( `Retrieved ${Count} posts with status ${status}` );

						for ( let i = 0; i < Count; i++ )
						{
							const item = unmarshall( Items[i]! );
							if ( item.tg !== undefined )
								item.tg = [...item.tg];
							else
								item.tg = [];

							// Fill in the primary compound key, which is missing from the returned results
							const record = item as Record<string, NativeAttributeValue>;

							posts.push( recordToElementData( record, item.pk, `${ElementType.Post}` ) );
						}
					}
				}
				else
				{
					// eslint-disable-next-line no-lonely-if
					if ( DEBUG_DB_GET > 2 )
						// eslint-disable-next-line no-console
						console.log( `DB no post list result for status '${status}'` );
				}

				posts = posts.concat( this.getDevPostsList() );

				onResult( posts );
			} )
			.catch( error =>
			{
				if ( process.env.NODE_ENV === 'development' )
					// eslint-disable-next-line no-console
					console.error( `DB fetch error for getPostList with status ${status}:\n${error}` );
				else
					// eslint-disable-next-line no-console
					console.error( `Error fetching post list from database` );

				onResult( undefined );
			} );
	}

	// DEVELOPMENT ONLY METHODS ----------------------------------------------------------------------------------------------------------

	getDevPostsList(): ElementData[]
	{
		if ( process.env.NODE_ENV === 'development' )
			// TODO: get this from the DB
			return Object.values( this.devData );

		return [];
	}

	setDevPostData( key: string, datum: ElementData )
	{
		if ( process.env.NODE_ENV === 'development' )
			this.devData[key] = datum;
	}

	private constructor()
	{
		if ( process.env.NODE_ENV === 'development' )
		{
			this.setDevPostData(
				'mipmapping',
				{
					name: 'mipmapping',
					type: ElementType.Post,
					status: 2,
					title: 'Mipmapping',
					author: 'Chris Lambert',
					dateCreated: 1673735586720,
					datePosted: 0,
					dateModified: 1679359393464,
					tags: ['Textures', 'Geometry'],
					hdrInline: '<div style="display:block;padding:10px">If this has no image it\'s just rendered as<i>inline</i> <a href="https://www.w3schools.com/html/"> HTML </a> in the image slot with an automatic background color.</div>',
					hdrHref: '',
					hdrAlt: '',
					description: `What are mipmaps and why do we need them?  What is the difference between linear and anisotropic?`,
					markdown: `<gl-code src="assets/test/webgl1.json"></gl-code>
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test 
Test`,
					content: `<p class="clearfix"><gl-code src="assets/test/webgl1.json"></gl-code><br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test <br>
Test</p>`,
					next: ''
				}
			);

			this.setDevPostData(
				'rasterization',
				{
					name: 'rasterization',
					type: ElementType.Post,
					status: 1,
					title: 'Rasterization',
					author: 'Chris Lambert',
					dateCreated: 1678923694583,
					datePosted: 0,
					dateModified: 1678923694583,
					tags: [],
					hdrInline: '',
					hdrHref: '',
					hdrAlt: '',
					description:
						'This is a WIP post and shouldn\'t show up in the list yet.',
					markdown: '',
					content: '',
					next: ''
				}
			);

			this.setDevPostData(
				'lod',
				{
					name: 'lod',
					type: ElementType.Post,
					status: 2,
					title: 'Level of Detail',
					author: 'Chris Lambert',
					dateCreated: 1673721586720,
					datePosted: 1673725586720,
					dateModified: 1673725586720,
					tags: ['Geometry'],
					hdrInline: '',
					hdrAlt: '',
					hdrHref: 'assets/test/webgl1.json',
					description:
						'Why do I see low-resolution models pop in and out sometimes?  Why do we need them anyway?  Are there ways to avoid the pop?',
					markdown: '',
					content: '',
					next: ''
				}
			);

			this.setDevPostData(
				'texturefilters',
				{
					name: 'texturefilters',
					type: ElementType.Post,
					status: 2,
					title: 'Texture Filtering',
					author: 'Chris Lambert',
					dateCreated: 1673525586720,
					datePosted: 1673755586720,
					dateModified: 1673755586720,
					tags: ['Textures', 'Geometry'],
					hdrInline: `
			<svg width="100%" height="100%">
				<rect width="100%" height="100%" fill="white"/>
				<rect x="25%" y="25%" width="50%" height="50%" fill="#ff0000" />
				<line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(0,0,255);stroke-width:2" />
				<rect x="0" y="0" width="100%" height="100%" style="fill-opacity:0;stroke:black;" stroke-dasharray="8" />
			</svg>`,
					hdrHref: '',
					hdrAlt: 'A red box with a blue slash across it, signifying nothing',
					description:
						'What is the purpose of texture filtering?  Why would I ever choose blurry over sharp?',
					markdown: `
# Header 1 
Man I hope this works. 
- maybe a list? 
- Could be! 
- If not, I'm fucked 

*__SERIOUSLY FUCKED__* 
			`,
					content: '',
					next: ''
				}
			);

			this.setDevPostData(
				'antialiasing',
				{
					name: 'antialiasing',
					type: ElementType.Post,
					status: 2,
					title: 'Antialiasing',
					author: 'Chris Lambert',
					dateCreated: 1672725586720,
					datePosted: 1678932726683,
					dateModified: 1678956465937,
					tags: ['Postprocessing'],
					hdrInline: '',
					hdrHref: 'https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
					hdrAlt: 'A cat wondering when this is going to get done',
					description: `Why do we need it?  What is the best kind, and why can't we always do that?`,
					markdown: `**WebGL Test**  

<web-gl fontsize="24" width="100px" margin="10px" src="assets/test/webgl1.json"> </web-gl> 

<web-gl fontsize="24" src="assets/test/webgl1.json"> </web-gl> 
`,
					content: `<p class="clearfix"><strong>WebGL Test</strong>  </p><web-gl class="webglembed" fontsize="24" width="100px" margin="10px" padding="20px" src="assets/test/webgl1.json"> </web-gl><web-gl class="webglembed" fontsize="24" src="assets/test/webgl1.json"> </web-gl>`,
					next: ''
				}
			);

			this.setDevPostData(
				'anisotropy',
				{
					name: 'anisotropy',
					type: ElementType.Post,
					status: 2,
					title: 'Anisotropy',
					author: 'Chris Lambert',
					dateCreated: 1673635586720,
					datePosted: 1673775586720,
					dateModified: 1673775586720,
					tags: ['Textures', 'Geometry'],
					hdrInline: '',
					hdrAlt: '',
					hdrHref: '',
					description:
						"What is it?  How do you control it, and why don't you always use it?",
					markdown: `**WebGL Test**  

<web-gl src="assets/test/webgl2.json"></web-gl> 

`,
					content: `<b>WebGL Test</b><p> 

<web-gl class="webglembed" src="assets/test/webgl2.json"></web-gl> 

`,
					next: ''
				}
			);

			this.setDevPostData(

				'diffusespecular',
				{
					name: 'diffusespecular',
					type: ElementType.Post,
					status: 2,
					title: 'Basic Shading: Diffuse and Specular',
					author: 'Chris Lambert',
					dateCreated: 1678949649635,
					datePosted: 0,
					dateModified: 1679525277861,
					tags: ['Shaders', 'Lighting'],
					hdrInline: '',
					hdrHref: 'assets/test/webgl1.json',
					hdrAlt: '',
					description: `What do diffuse and specular shading mean?  What is the difference?  How do they work?`,
					markdown: `How do you know what shape a 3D object is on a 2D screen?  Our brains already have a technique for this, say, in case you lost an eye in a fight with a porcupine.  They use motion or shading.

As an example, let's look at a simple stationary cube without any visual features:

<web-gl src='assets/test/unshaded-box.json'></web-gl>

Between motion and shading, motion is the simpler option.  You have to do some math to get the object into the right place on screen, and it's very little extra work to add a change over time to the base transformation.  As an alternative, you could move the camera, which would be like limping around the carcass of your defeated porcupine foe.

Here's what applying motion to our untextured box looks like:

<gl-code src='assets/test/unshaded-box-spin.json'></gl-code>

Pretty uninspiring, huh?  Motion gives us a clue that it's a cube, but it's still like being in a dark or foggy forest with an agitated rodent.

So we obviously want shading.  That's why you're here.  Shading tells us a lot about the surface beyond just its shape: shading will usually simulate light reflecting, absorbing, or passing through a surface, depending on the material -- imagine steel, brick, and paper, respectively.

You may have heard of "shaders" in the context of rendering and GPUs.  "Shaders" are a specialized micro-program that runs on a GPU.  
 
- A complex math computation running on the GPU may use a single **Compute Shader**.
- A single triangle can be drawn with just one **Vertex Shader** and one **Fragment Shader** (also known as a **Pixel Shader**).
- Some advanced rendering applications use even more exotic versions as well, like **Geometry Shaders** or **Tessellation Shaders**. 
 
All of these are simple programs that run exclusively on the GPU.  They run over and over again, against each item in a list.  The key is that it's a different list of items for each kind of shader.

<!-- For more details on different kinds of shaders and how they work, see the post on [Shaders](posts/1). -->

What if we kept everything the same, and just added the most basic form of lighting calculations (also known as shading)?

Here's what that same box looks like with a simple light source:

<gl-code src="assets/test/shaded-box-spin.json"></gl-code> 

Surprise!

Chances are, you thought you were looking at the box from above and spinning clockwise.  This is how shading really helps you to figure out shapes on a 2D screen.

The two types that do the kind of shading we're discussing are Vertex and Fragment Shaders.  Vertex Shaders run on a list of vertices, as you may have guessed, and are responsible for getting the vertices into the right place and facing the right direction.

<alert>*Vertices* is the preferred plural of vertex, though *vertexes* is acceptable.<br>The same goes for *indices* and *indexes*.</alert>

What?  How can a point face a direction?

Well, each of those points comes with more data than just a position.  You may recall from the post on [Basic Geometry - Vertex, Index, Triangle] that a vertex typically has a normal, as well.  This normal is a unit vector (ie, a vector with a length of 1.0) that points "out" from the resulting triangle's face.

If every triangle had its own set of vertices with normals facing straight out from that triangle's face, we would see what we call "flat shading". 

<gl-code src="assets/test/flat.json"></gl-code> 

If those triangles instead share a vertex (and hence the normal points in a direction that's an average of the triangles' facing), then a sort of smoothing takes place thanks to interpolation.

<gl-code src="assets/test/poscol-cube.json"></gl-code> 

Now we need to discuss interpolation.  When the data from 3 vertices is combined to become input for 1 fragment, the process to do that is interpolation.  The specific method is known as Gouraud interpolation [pronounced "GOO-row"](https://casual-effects.blogspot.com/2016/03/computational-graphics-pronunciation.html), described by Henri Gouraud in 1971.  It's actually very simple: to get a smooth value somewhere in the middle of a triangle, the GPU computes the weighted average of the values from the 3 vertices and passes it as an input to the Fragment Shader.  We can see this at work by showing the positions of a cube with one corner at (0,0,0) and the opposite at (1,1,1) as colors.

This is incredibly useful behavior by the GPU.  It's basically free math, per-fragment.  We don't have to pay Vertex Shader or Fragment Shader cycles for it -- it's just part of the pipeline that occurs no matter what.  In this way, offloading work from the Fragment Shader (which runs at least once for every pixel on screen) to the Vertex Shader (which typically runs hundreds or thousands of times less frequently) is usually a massive win for performance.  See the post on [Performance Basics](posts/2).

We have everything we need to display some basic lighting.  To keep things simple, we'll start with a directional light.  That's a light with only a direction -- no position.  It's considered to be infinitely far away with no falloff or cutoff distance, akin to sunlight but less physically accurate.  The good news is it's very easy to simulate.

All real-time lighting starts with a point in space, a normal, and an incoming light vector.  We have all of that.  The incoming light vector is just the opposite of the "sunlight" direction -- if the light is shining in the direction (1,0,0), then to me all the light is coming from the direction (-1,0,0).  That's the incoming light vector.  Note how it's also unit length?  That's important.

The fundamental calculation that we use throughout real-time lighting is [Lambert's cosine law](https://en.wikipedia.org/wiki/Lambert%27s_cosine_law) (no relation).  Johann Heinrich Lambert, sometime around 1760, observed that the intensity of the light leaving an ideal surface is directly proportional to the cosine of the angle between the normal and the incoming light vector. 

<svg width="40%" viewbox="0 0 100 56"><rect width="100%" height="100%" fill="white"/><rect x="25%" y="25%" width="50%" height="50%" fill="#ff0000" /><line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(0,0,255);stroke-width:2" /><rect x="0" y="0" width="100%" height="100%" style="fill-opacity:0;stroke:black;" stroke-dasharray="8" /></svg> 

Footnote: this is also where I got my industry nickname.  See the [About](about) page.

Sorry for the math.  Thankfully, it ends up being pretty easy and the GPU does it all for us.  The cosine sounds expensive to calculate, and it is very expensive.  However, there's actually a nifty mathematical identity we can use, a sort of math shortcut.  See, the cosine of two unit-length vectors is identical to the result of the dot product between those two vectors, and that's extremely inexpensive to calculate.  You might recall from Geometry class that taking the cross product between two vectors gives you a vector, but taking a dot product between two vectors give you a single number (a scalar, we would say in graphics land).  This is the most sacred use of the dot product: it has applications throughout gaming, including in audio, collisions, physics -- anytime you want to calculate the rebound value of something off a surface.

In fact, this one use here, in the Vertex Shader, combined with Gouraud interpolation by the GPU, gives us basic lighting.  We take the scalar from the dot product and multiply it against the light color, if there is one, and send the result as a color value to the Fragment Shader.  The Fragment Shader simply shows the interpolated result.  This is known as Diffuse vertex lighting. 

<gl-code src="assets/test/diff-vs.json"></gl-code> 

Neat, but it's also very flat.  You can click and drag the camera around the object to see what I mean.  The lighting doesn't change relative to your viewpoint -- that's a hallmark of "Diffuse" lighting.  The next part of the lighting stew adds that view-dependent component, which we call "Specular" lighting.

Specular lighting is calculated in almost the exact same way as Diffuse lighting, except with two more steps and one more bit of info: the direction to the viewer.  

Imagine a wet road with the sun opposite you.  You would expect to see a reflection of the sun, a hot spot, on the ground, some distance between you and the sun.  We can calculate this hotspot with the Diffuse lighting algorithm technique -- we just need to plug in different vectors for the Lambert cosine calculation.  Let's work backwards.  If you're calculating the lighting at the point of the hotspot, one of them would be the normal of the ground, obviously.  The other is going to be "dotted" against the normal to get the lighting strength coefficient for this hotspot.  If we use the vector towards the sun, then we'd just get a view-independent Diffuse lighting value -- no view-relative hotspot at all.  If we use the vector towards the eye, then we'd get a result that never involved the sun at all.  But maybe something in between?  Literally?  That's actually exactly what we use: the average of the vector to the eye and the vector to the light.  We call it the "half vector".  Note that after you average them, the result probably won't be of length 1 anymore, so we have to normalize it again, which involves a square root operation (to get the length of the vector) and thus isn't super cheap. 

But with that done, we have a normal and a half vector at the point of our hotspot.  If we now apply Lambert's Cosine Law, we get a scalar result that tells us how powerful the sun's hotspot should be at that point.  And as we move, or as the sun moves, that value will change.  Let's see our Specular vertex lighting in action, in addition to the Diffuse lighting from before. 

<gl-code src="assets/test/spec-diff-vs.json"></gl-code> 

You can see the shape for sure, but you can also see the how it's interpolating between vertices.  As the light source moves around, you can really see the artifacts of Gouraud interpolation on a low-polygon object show up.  You can get around this with more triangles, or by moving the calculation to run per-fragment in a Fragment Shader instead. 

Moving work from the Vertex Shader to the Fragment Shader is actually pretty simple.  We just have to make sure the Vertex Shader outputs anything the Fragment Shader needs to do the work, and that the Fragment Shader has access to any constant data (see [GPU Memory](posts/3)).  In this case, the Vertex Shader outputs the world-space position and world-space normal to the Fragment Shader by assigning them to specially marked variables that were registered as part of the declaration of these shaders.  The GPU will dutifully interpolate these vectors and the Fragment Shader takes the results, performing the same calculations with the same constants.  The results, however, are much nicer: they should be, since instead of running on a few dozen vertices, they're running for thousands of pixels! 

<gl-code src="assets/test/spec-diff-fs.json"></gl-code> 

Note the fps and frame duration differences between the Vertex Shader and Fragment Shader Specular examples.  While for any given render the Vertex Shader expense scales with vertex count, Fragment Shader expense scales with size on screen and screen resolution.  Essentially, the more pixels that are eventually covered by an object, then the more times the GPU will have to run the Fragment Shader.  See the [Performance](posts/2) post for more about this. 
`,
					content: `<p class="clearfix">How do you know what shape a 3D object is on a 2D screen?  Our brains already have a technique for this, say, in case you lost an eye in a fight with a porcupine.  They use motion or shading.</p>
<p class="clearfix">As an example, let's look at a simple stationary cube without any visual features:</p>
<p class="clearfix"><web-gl id="1" class="webglembed webglpost" src="assets/test/unshaded-box.json"></web-gl></p>
<p class="clearfix">Between motion and shading, motion is the simpler option.  You have to do some math to get the object into the right place on screen, and it's very little extra work to add a change over time to the base transformation.  As an alternative, you could move the camera, which would be like limping around the carcass of your defeated porcupine foe.</p>
<p class="clearfix">Here's what applying motion to our untextured box looks like:</p>
<p class="clearfix"><gl-code id="2" src="assets/test/unshaded-box-spin.json"></gl-code></p>
<p class="clearfix">Pretty uninspiring, huh?  Motion gives us a clue that it's a cube, but it's still like being in a dark or foggy forest with an agitated rodent.</p>
<p class="clearfix">So we obviously want shading.  That's why you're here.  Shading tells us a lot about the surface beyond just its shape: shading will usually simulate light reflecting, absorbing, or passing through a surface, depending on the material -- imagine steel, brick, and paper, respectively.</p>
<p class="clearfix">You may have heard of "shaders" in the context of rendering and GPUs.  "Shaders" are a specialized micro-program that runs on a GPU.  </p>
<ul class="list">
<li>A complex math computation running on the GPU may use a single <strong>Compute Shader</strong>.</li>
<li>A single triangle can be drawn with just one <strong>Vertex Shader</strong> and one <strong>Fragment Shader</strong> (also known as a <strong>Pixel Shader</strong>).</li>
<li>Some advanced rendering applications use even more exotic versions as well, like <strong>Geometry Shaders</strong> or <strong>Tessellation Shaders</strong>. </li>
</ul>
<p class="clearfix">All of these are simple programs that run exclusively on the GPU.  They run over and over again, against each item in a list.  The key is that it's a different list of items for each kind of shader.</p>
<!-- For more details on different kinds of shaders and how they work, see the post on [Shaders](posts/1). -->
<p class="clearfix">What if we kept everything the same, and just added the most basic form of lighting calculations (also known as shading)?</p>
<p class="clearfix">Here's what that same box looks like with a simple light source:</p>
<p class="clearfix"><gl-code id="3" src="assets/test/shaded-box-spin.json"></gl-code> </p>
<p class="clearfix">Surprise!</p>
<p class="clearfix">Chances are, you thought you were looking at the box from above and spinning clockwise.  This is how shading really helps you to figure out shapes on a 2D screen.</p>
<p class="clearfix">The two types that do the kind of shading we're discussing are Vertex and Fragment Shaders.  Vertex Shaders run on a list of vertices, as you may have guessed, and are responsible for getting the vertices into the right place and facing the right direction.</p>
<p class="clearfix"><lit-alert variant="primary"><alert><em>Vertices</em> is the preferred plural of vertex, though <em>vertexes</em> is acceptable.<br>The same goes for <em>indices</em> and <em>indexes</em>.</alert></lit-alert></p>
<p class="clearfix">What?  How can a point face a direction?</p>
<p class="clearfix">Well, each of those points comes with more data than just a position.  You may recall from the post on [Basic Geometry - Vertex, Index, Triangle] that a vertex typically has a normal, as well.  This normal is a unit vector (ie, a vector with a length of 1.0) that points "out" from the resulting triangle's face.</p>
<p class="clearfix">If every triangle had its own set of vertices with normals facing straight out from that triangle's face, we would see what we call "flat shading". </p>
<p class="clearfix"><gl-code id="4" src="assets/test/flat.json"></gl-code> </p>
<p class="clearfix">If those triangles instead share a vertex (and hence the normal points in a direction that's an average of the triangles' facing), then a sort of smoothing takes place thanks to interpolation.</p>
<p class="clearfix"><gl-code id="5" src="assets/test/poscol-cube.json"></gl-code> </p>
<p class="clearfix">Now we need to discuss interpolation.  When the data from 3 vertices is combined to become input for 1 fragment, the process to do that is interpolation.  The specific method is known as Gouraud interpolation <a href="https://casual-effects.blogspot.com/2016/03/computational-graphics-pronunciation.html">pronounced "GOO-row"</a>, described by Henri Gouraud in 1971.  It's actually very simple: to get a smooth value somewhere in the middle of a triangle, the GPU computes the weighted average of the values from the 3 vertices and passes it as an input to the Fragment Shader.  We can see this at work by showing the positions of a cube with one corner at (0,0,0) and the opposite at (1,1,1) as colors.</p>
<p class="clearfix">This is incredibly useful behavior by the GPU.  It's basically free math, per-fragment.  We don't have to pay Vertex Shader or Fragment Shader cycles for it -- it's just part of the pipeline that occurs no matter what.  In this way, offloading work from the Fragment Shader (which runs at least once for every pixel on screen) to the Vertex Shader (which typically runs hundreds or thousands of times less frequently) is usually a massive win for performance.  See the post on <a href="posts/2">Performance Basics</a>.</p>
<p class="clearfix">We have everything we need to display some basic lighting.  To keep things simple, we'll start with a directional light.  That's a light with only a direction -- no position.  It's considered to be infinitely far away with no falloff or cutoff distance, akin to sunlight but less physically accurate.  The good news is it's very easy to simulate.</p>
<p class="clearfix">All real-time lighting starts with a point in space, a normal, and an incoming light vector.  We have all of that.  The incoming light vector is just the opposite of the "sunlight" direction -- if the light is shining in the direction (1,0,0), then to me all the light is coming from the direction (-1,0,0).  That's the incoming light vector.  Note how it's also unit length?  That's important.</p>
<p class="clearfix">The fundamental calculation that we use throughout real-time lighting is <a href="https://en.wikipedia.org/wiki/Lambert%27s_cosine_law">Lambert's cosine law</a> (no relation).  Johann Heinrich Lambert, sometime around 1760, observed that the intensity of the light leaving an ideal surface is directly proportional to the cosine of the angle between the normal and the incoming light vector. </p>
<p class="clearfix"><svg class="svgembed" width="40%" viewBox="0 0 100 56"><rect width="100%" height="100%" fill="white"></rect><rect x="25%" y="25%" width="50%" height="50%" fill="#ff0000"></rect><line x1="0" y1="0" x2="100%" y2="100%" style="stroke:rgb(0,0,255);stroke-width:2"></line><rect x="0" y="0" width="100%" height="100%" style="fill-opacity:0;stroke:black;" stroke-dasharray="8"></rect></svg> </p>
<p class="clearfix">Footnote: this is also where I got my industry nickname.  See the <a href="about">About</a> page.</p>
<p class="clearfix">Sorry for the math.  Thankfully, it ends up being pretty easy and the GPU does it all for us.  The cosine sounds expensive to calculate, and it is very expensive.  However, there's actually a nifty mathematical identity we can use, a sort of math shortcut.  See, the cosine of two unit-length vectors is identical to the result of the dot product between those two vectors, and that's extremely inexpensive to calculate.  You might recall from Geometry class that taking the cross product between two vectors gives you a vector, but taking a dot product between two vectors give you a single number (a scalar, we would say in graphics land).  This is the most sacred use of the dot product: it has applications throughout gaming, including in audio, collisions, physics -- anytime you want to calculate the rebound value of something off a surface.</p>
<p class="clearfix">In fact, this one use here, in the Vertex Shader, combined with Gouraud interpolation by the GPU, gives us basic lighting.  We take the scalar from the dot product and multiply it against the light color, if there is one, and send the result as a color value to the Fragment Shader.  The Fragment Shader simply shows the interpolated result.  This is known as Diffuse vertex lighting. </p>
<p class="clearfix"><gl-code id="6" src="assets/test/diff-vs.json"></gl-code> </p>
<p class="clearfix">Neat, but it's also very flat.  You can click and drag the camera around the object to see what I mean.  The lighting doesn't change relative to your viewpoint -- that's a hallmark of "Diffuse" lighting.  The next part of the lighting stew adds that view-dependent component, which we call "Specular" lighting.</p>
<p class="clearfix">Specular lighting is calculated in almost the exact same way as Diffuse lighting, except with two more steps and one more bit of info: the direction to the viewer.  </p>
<p class="clearfix">Imagine a wet road with the sun opposite you.  You would expect to see a reflection of the sun, a hot spot, on the ground, some distance between you and the sun.  We can calculate this hotspot with the Diffuse lighting algorithm technique -- we just need to plug in different vectors for the Lambert cosine calculation.  Let's work backwards.  If you're calculating the lighting at the point of the hotspot, one of them would be the normal of the ground, obviously.  The other is going to be "dotted" against the normal to get the lighting strength coefficient for this hotspot.  If we use the vector towards the sun, then we'd just get a view-independent Diffuse lighting value -- no view-relative hotspot at all.  If we use the vector towards the eye, then we'd get a result that never involved the sun at all.  But maybe something in between?  Literally?  That's actually exactly what we use: the average of the vector to the eye and the vector to the light.  We call it the "half vector".  Note that after you average them, the result probably won't be of length 1 anymore, so we have to normalize it again, which involves a square root operation (to get the length of the vector) and thus isn't super cheap. </p>
<p class="clearfix">But with that done, we have a normal and a half vector at the point of our hotspot.  If we now apply Lambert's Cosine Law, we get a scalar result that tells us how powerful the sun's hotspot should be at that point.  And as we move, or as the sun moves, that value will change.  Let's see our Specular vertex lighting in action, in addition to the Diffuse lighting from before. </p>
<p class="clearfix"><gl-code id="7" src="assets/test/spec-diff-vs.json"></gl-code> </p>
<p class="clearfix">You can see the shape for sure, but you can also see the how it's interpolating between vertices.  As the light source moves around, you can really see the artifacts of Gouraud interpolation on a low-polygon object show up.  You can get around this with more triangles, or by moving the calculation to run per-fragment in a Fragment Shader instead. </p>
<p class="clearfix">Moving work from the Vertex Shader to the Fragment Shader is actually pretty simple.  We just have to make sure the Vertex Shader outputs anything the Fragment Shader needs to do the work, and that the Fragment Shader has access to any constant data (see <a href="posts/3">GPU Memory</a>).  In this case, the Vertex Shader outputs the world-space position and world-space normal to the Fragment Shader by assigning them to specially marked variables that were registered as part of the declaration of these shaders.  The GPU will dutifully interpolate these vectors and the Fragment Shader takes the results, performing the same calculations with the same constants.  The results, however, are much nicer: they should be, since instead of running on a few dozen vertices, they're running for thousands of pixels! </p>
<p class="clearfix"><gl-code id="8" src="assets/test/spec-diff-fs.json"></gl-code> </p>
<p class="clearfix">Note the fps and frame duration differences between the Vertex Shader and Fragment Shader Specular examples.  While for any given render the Vertex Shader expense scales with vertex count, Fragment Shader expense scales with size on screen and screen resolution.  Essentially, the more pixels that are eventually covered by an object, then the more times the GPU will have to run the Fragment Shader.  See the <a href="posts/2">Performance</a> post for more about this. </p>`,
					next: ''
				}
			);
		}
	}
}

export function getTagsArray( tagsString: string ): string[]
{
	return tagsString.split( /,/ ).map( tag => tag.trim() );
}

export function getTagsString( tagsArray: string[] ): string
{
	return tagsArray.join( ',' );
}
