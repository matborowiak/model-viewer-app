var camera, scene, renderer;
var geometry, material, mesh, mesh2;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
	scene = new THREE.Scene();
	geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
	material = new THREE.MeshNormalMaterial();
	mesh = new THREE.Mesh(geometry, material);

	scene.add(mesh);
	
	// Load custom model
	var loader = new THREE.GLTFLoader();
	loader.load('house/scene.gltf', function (gltf) {
		gltf.scene.position.x = 0;
		scene.add(gltf.scene);

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Scene
		gltf.scenes; // Array<THREE.Scene>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
		debugger
		// return mesh2 = gltf.scene
	}, undefined, function (error) {
		console.error(error);
	});

	
	var light = new THREE.AmbientLight(0x404040, 10); // soft white light
	scene.add(light);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Camera Controlls
	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	//controls.update() must be called after any manual changes to the camera's transform
	camera.position.set(0, 0, 2);
	controls.update();

	function animate() {

		requestAnimationFrame(animate);

		// required if controls.enableDamping or controls.autoRotate are set to true
		controls.update();

		renderer.render(scene, camera);

	}

	document.body.appendChild(renderer.domElement);

}

function animate() {

	requestAnimationFrame(animate);

	// mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	// mesh2.rotation.y += 0.02;

	renderer.render(scene, camera);

}