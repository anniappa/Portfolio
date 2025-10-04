// Three.js scene management
class ThreeScene {
    constructor() {
        this.scenes = new Map();
        this.currentScene = null;
        this.init();
    }

    async init() {
        // Initialize Three.js
        this.setupRenderer();
        await this.loadModels();
        this.setupScenes();
    }

    setupRenderer() {
        // Main hero scene
        this.setupHeroScene();
        
        // Project scenes will be initialized when needed
    }

    setupHeroScene() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        // Scene setup
        this.heroScene = new THREE.Scene();
        this.heroCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.heroRenderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true,
            alpha: true 
        });

        this.heroRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.heroScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.heroScene.add(directionalLight);

        // Simple geometry for hero section
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.4
        });
        
        this.heroMesh = new THREE.Mesh(geometry, material);
        this.heroScene.add(this.heroMesh);
        
        this.heroCamera.position.z = 5;

        // Animation
        this.heroClock = new THREE.Clock();
    }

    async loadModels() {
        // Placeholder for model loading
        // In production, use GLTFLoader with Draco compression
        console.log('Loading 3D models...');
        
        // Example model loading structure:
        /*
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/path/to/draco/');
        loader.setDRACOLoader(dracoLoader);
        
        try {
            const gltf = await loader.loadAsync('/models/project-1.glb');
            this.setupProjectScene('project-1', gltf.scene);
        } catch (error) {
            console.error('Error loading model:', error);
            this.setupFallbackScene('project-1');
        }
        */
    }

    setupProjectScene(projectId, model = null) {
        const canvas = document.getElementById(`${projectId}-canvas`);
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true,
            alpha: true 
        });

        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Add model or placeholder
        if (model) {
            scene.add(model);
            
            // Center and scale model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim;
            model.scale.multiplyScalar(scale);
        } else {
            // Fallback geometry
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshPhysicalMaterial({ 
                color: 0x666666,
                metalness: 0.3,
                roughness: 0.4
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        }

        camera.position.z = 5;

        // Controls for interactive rotation
        const controls = new THREE.OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        this.scenes.set(projectId, {
            scene,
            camera,
            renderer,
            controls,
            model
        });

        // Set up rotation controls
        this.setupProjectControls(projectId);
    }

    setupProjectControls(projectId) {
        const rotateBtn = document.querySelector(`[data-project="${projectId}"] .control-rotate`);
        const resetBtn = document.querySelector(`[data-project="${projectId}"] .control-reset`);

        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => {
                this.toggleAutoRotate(projectId);
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetCamera(projectId);
            });
        }
    }

    toggleAutoRotate(projectId) {
        const sceneData = this.scenes.get(projectId);
        if (sceneData) {
            sceneData.controls.autoRotate = !sceneData.controls.autoRotate;
        }
    }

    resetCamera(projectId) {
        const sceneData = this.scenes.get(projectId);
        if (sceneData) {
            sceneData.controls.reset();
        }
    }

    update() {
        // Update hero scene
        if (this.heroMesh) {
            const time = this.heroClock.getElapsedTime();
            this.heroMesh.rotation.x = time * 0.2;
            this.heroMesh.rotation.y = time * 0.3;
        }

        if (this.heroRenderer && this.heroScene && this.heroCamera) {
            this.heroRenderer.render(this.heroScene, this.heroCamera);
        }

        // Update project scenes
        this.scenes.forEach((sceneData, projectId) => {
            if (sceneData.controls) {
                sceneData.controls.update();
            }
            sceneData.renderer.render(sceneData.scene, sceneData.camera);
        });
    }

    onWindowResize() {
        // Resize hero scene
        if (this.heroCamera && this.heroRenderer) {
            const canvas = this.heroRenderer.domElement;
            this.heroCamera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.heroCamera.updateProjectionMatrix();
            this.heroRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }

        // Resize project scenes
        this.scenes.forEach((sceneData, projectId) => {
            const canvas = sceneData.renderer.domElement;
            sceneData.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            sceneData.camera.updateProjectionMatrix();
            sceneData.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
    }
}