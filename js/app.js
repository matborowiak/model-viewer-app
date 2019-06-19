let camera, scene, renderer
let geometry, material, mesh, mesh2

init()
animate()

function animate() {
	requestAnimationFrame(animate)
	renderer.render(scene, camera)
}

function init() {
	// Load custom GLTF model
	const loader = new THREE.GLTFLoader()
	loader.load(
		'/model3/scene.gltf',
		function (gltf) {
			const model = gltf.scene.children[0]
			model.scale.set(0.01, 0.01, 0.01)
			model.rotation.set(1.5707963267948963, 0, -0.8)
			model.receiveShadow = true
			console.log(model)
			scene.add(model)

		},
		undefined,
		function (error) {
			console.error(error)
		}
	)

	// Scene Setup
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xddddddd);

	// Camera Setup
	camera = new THREE.PerspectiveCamera(
		70,
		window.innerWidth / window.innerHeight,
		1,
		1000
	)
	camera.position.set(0, 2, 12)

	// Light Setup
	// Ambient Light
	const ambientLight = new THREE.AmbientLight(0xcccccc, 1)
	scene.add(ambientLight)

	// Point Light
	const pointLight = new THREE.PointLight(0x1fffff, 1)
	console.log(pointLight)
	pointLight.position.set(0, 25, -25)
	camera.add(pointLight)
	scene.add(camera)

	// Render Setup
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	// Camera Controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement)
}