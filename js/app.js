let camera, scene, renderer

init()
animate()

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

function init() {
    // Scene Setup
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xddddddd)

    // Set Ground Plane Geometry
    const geometry = new THREE.PlaneGeometry(15, 15, 15)
    const material = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide
    })
    const groundPlane = new THREE.Mesh(geometry, material)
    groundPlane.rotation.set(Math.PI / 2, 0, 0)
    groundPlane.castShadow = true
    scene.add(groundPlane)

    // Load custom GLTF model
    const loader = new THREE.GLTFLoader()
    loader.load(
        '/model3/scene.gltf',
        function(gltf) {
            const model = gltf.scene.children[0]
            model.scale.set(0.01, 0.01, 0.01)
            model.rotation.set(1.5707963267948963, 0, -0.8)
            model.castShadow = true
            console.log(model)
            scene.add(model)
        },
        undefined,
        function(error) {
            console.error(error)
        }
    )

    // Camera Setup
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
    )
	camera.position.set(0, 2, 12)
	scene.add(camera)

    // Light Setup
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xcccccc, 1)
    scene.add(ambientLight)

    // Point Light
    const pointLight = new THREE.DirectionalLight(0x1fffff, 1)
    pointLight.position.set(50, 500, 22)
    pointLight.target.position.set(300, 400, 200)
    console.log(pointLight)
    pointLight.position.set(0, 25, -25)
    pointLight.shadow.camera.near = 0.5
    pointLight.shadow.camera.far = 5000
    pointLight.shadow.camera.left = -500
    pointLight.shadow.camera.bottom = -500
    pointLight.shadow.camera.right = 500
    pointLight.shadow.camera.top = 500

    camera.add(pointLight)


    // Render Setup
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // Camera Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement)
}
