let camera, scene, renderer

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
    const pointLight = new THREE.DirectionalLight(0x1fffff, 20)
    pointLight.position.set(15, 15, 1)
    pointLight.target.position.set(0, 0, 0)
    console.log(pointLight)
    pointLight.position.set(0, 25, -25)
    pointLight.shadow.camera.near = 0.5
    pointLight.shadow.camera.far = 5000
    pointLight.shadow.camera.left = -500
    pointLight.shadow.camera.bottom = -500
    pointLight.shadow.camera.right = 500
    pointLight.shadow.camera.top = 500
    scene.add(pointLight)

    // Render Setup
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // Camera Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement)

    // Use Sky
    initSky()
}
