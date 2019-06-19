let camera, scene, renderer

var gui, shadowCameraHelper, shadowConfig = {

	shadowCameraVisible: false,
	shadowCameraNear: 10,
	shadowCameraFar: 70,
	shadowCameraFov: 30,
	shadowBias: - 0.01

};

init()
animate()

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

// Sky Function
function initSky() {
    // Add Sky
    sky = new THREE.Sky()
    sky.scale.setScalar(450000)
    scene.add(sky)

    // Add Sun Helper
    sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    sunSphere.position.y = -700000
    sunSphere.visible = false
    scene.add(sunSphere)

    /// GUI

    var effectController = {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.49, // elevation / inclination
        azimuth: 0.25, // Facing front,
        sun: !true
    }

    var distance = 400000

    function guiChanged() {
        var uniforms = sky.material.uniforms
        uniforms['turbidity'].value = effectController.turbidity
        uniforms['rayleigh'].value = effectController.rayleigh
        uniforms['luminance'].value = effectController.luminance
        uniforms['mieCoefficient'].value = effectController.mieCoefficient
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

        var theta = Math.PI * (effectController.inclination - 0.5)
        var phi = 2 * Math.PI * (effectController.azimuth - 0.5)

        sunSphere.position.x = distance * Math.cos(phi)
        sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta)
        sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta)

        sunSphere.visible = effectController.sun

        uniforms['sunPosition'].value.copy(sunSphere.position)

        renderer.render(scene, camera)
    }

    var gui = new dat.GUI()

    gui.add(effectController, 'turbidity', 1.0, 20.0, 0.1).onChange(guiChanged)
    gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged)
    gui.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(
        guiChanged
    )
    gui.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(
        guiChanged
    )
    gui.add(effectController, 'luminance', 0.0, 2).onChange(guiChanged)
    gui.add(effectController, 'inclination', 0, 1, 0.0001).onChange(guiChanged)
    gui.add(effectController, 'azimuth', 0, 1, 0.0001).onChange(guiChanged)
    gui.add(effectController, 'sun').onChange(guiChanged)

    guiChanged()
}

function init() {
    // Scene Setup
    scene = new THREE.Scene()
    // scene.background = new THREE.Color(0xddddddd)
    scene.background = new THREE.CubeTextureLoader().load([
        'https://gltf-viewer.donmccurdy.com/assets/environment/Park2/posx.jpg',
        'https://gltf-viewer.donmccurdy.com/assets/environment/Park2/negx.jpg',
        'https://gltf-viewer.donmccurdy.com/assets/environment/Park2/posy.jpg',
        'https://gltf-viewer.donmccurdy.com/assets/environment/Park2/negy.jpg',
        'https://gltf-viewer.donmccurdy.com/assets/environment/Park2/posz.jpg',
        'https://gltf-viewer.donmccurdy.com/assets/environment/Park2/negz.jpg'
    ])

    // Set Ground Plane Geometry
    const geometry = new THREE.PlaneGeometry(15, 15, 15)
    const material = new THREE.MeshPhongMaterial({
        color: 0x6c6c6c,
        side: THREE.DoubleSide
    })
    const groundPlane = new THREE.Mesh(geometry, material)
    groundPlane.rotation.set(Math.PI / 2, 0, 0)
    groundPlane.castShadow = true
    groundPlane.receiveShadow = true
    scene.add(groundPlane)

    // Set Test Box
    const geometry1 = new THREE.BoxGeometry(2, 2, 2)
    const material1 = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        side: THREE.DoubleSide
    })
    const testBox = new THREE.Mesh(geometry1, material1)
    testBox.rotation.set(Math.PI / 2, 0, 0)
    testBox.position.set(-4, 1.5, 0)
    testBox.castShadow = true
    testBox.receiveShadow = true
    console.log(testBox)
    scene.add(testBox)

    // Load custom GLTF model
    const loader = new THREE.GLTFLoader()
    loader.load(
        '/model/scene.gltf',
        function(gltf) {
            const model = gltf.scene.children[0].children[0].children[0].children[0]
            model.scale.set(0.01, 0.01, 0.01)
            model.position.y = 0.4
            model.rotation.set(1.5707963267948963, 0, Math.PI / -2)
            model.castShadow = true
			model.receiveShadow = true
			const map = model.material.map
			// Model Material Setup
			model.material = new THREE.MeshPhongMaterial({
				color: 0xcccccc,
				side: THREE.DoubleSide,
				map: map
			})
            scene.add(model)
        },
        undefined,
        function(error) {
            console.error(error)
        }
    )

    // Camera Setup
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        100000
    )
    camera.position.set(0, 2, 12)
    scene.add(camera)

    // Light Setup
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xcccccc, 1.4)
    scene.add(ambientLight)

    // Point Light
    const pointLight = new THREE.SpotLight(0xffffff, 1.5)
    pointLight.position.set(-30, 40, -20)
    pointLight.target.position.set(0, 0, 0)
	pointLight.castShadow = true
	pointLight.shadow.bias = shadowConfig.shadowBias

    pointLight.shadow.mapSize.width = 10000
    pointLight.shadow.mapSize.height = 10000

   
    pointLight.shadow.camera.near = shadowConfig.shadowCameraNear
    pointLight.shadow.camera.far = shadowConfig.shadowCameraFar

    scene.add(pointLight)
	console.log(pointLight)
	
	// Shadow Cam Helper
	const shadowCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
	shadowCameraHelper.visible = true;
	scene.add(shadowCameraHelper)

    // Render Setup
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMapSoft = false
    document.body.appendChild(renderer.domElement)

    // Camera Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement)

    // // Use Sky
    // initSky()
}
