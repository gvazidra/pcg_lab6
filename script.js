let scene, camera, renderer, letterMesh, axesHelper;
let isMouseDown = false;
let previousMousePosition = { x: 0, y: 0 };
let mode = "rotate";

let oxyCamera, oxzCamera, oyzCamera;
let oxyRenderer, oxzRenderer, oyzRenderer;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    resizeMainRenderer();
    document.getElementById('container').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    createLetterCH();

    axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper);

    initProjections();

    document.getElementById('switch').addEventListener('click', toggleMode);
    document.getElementById('container').addEventListener('mousedown', onMouseDown);
    document.getElementById('container').addEventListener('mousemove', onMouseMove);
    document.getElementById('container').addEventListener('mouseup', onMouseUp);
    document.getElementById('container').addEventListener('wheel', onWheel);

    animate();
}

function resizeMainRenderer() {
    const container = document.getElementById('container');
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height);
}

window.addEventListener('resize', () => {
    resizeMainRenderer();
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
});

function toggleMode() {
    mode = mode === "rotate" ? "translate" : "rotate";
    document.getElementById('switch').innerText =
        mode === "rotate" ? "Переключить на перемещение" : "Переключить на вращение";
}

function createLetterCH() {
    const material = new THREE.MeshLambertMaterial({ color: 0xff69b4 });

    const leftPart = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.5, 0.5), material);
    leftPart.position.set(-0.5, 2.25, 0);

    const rightPart = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.5), material);
    rightPart.position.set(0.75, 1.5, 0);

    const crossBar = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.5, 0.5), material);
    crossBar.position.set(0.125, 1.5, 0);

    letterMesh = new THREE.Group();
    letterMesh.add(leftPart);
    letterMesh.add(rightPart);
    letterMesh.add(crossBar);

    scene.add(letterMesh);
}

function initProjections() {
    const size = 5;

    function resizeProjectionRenderer(renderer, containerId) {
        const container = document.getElementById(containerId);
        const { width, height } = container.getBoundingClientRect();
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);
    }

    oxyCamera = new THREE.OrthographicCamera(-size, size, size, -size, 1, 100);
    oxyCamera.position.set(0, 10, 0);
    oxyCamera.lookAt(0, 0, 0);
    oxyRenderer = new THREE.WebGLRenderer({ antialias: true });
    oxyRenderer.setClearColor(0xfafafa);
    resizeProjectionRenderer(oxyRenderer, 'oxy');

    oxzCamera = new THREE.OrthographicCamera(-size, size, size, -size, 1, 100);
    oxzCamera.position.set(0, 0, 10);
    oxzCamera.lookAt(0, 0, 0);
    oxzRenderer = new THREE.WebGLRenderer({ antialias: true });
    oxzRenderer.setClearColor(0xfafafa);
    resizeProjectionRenderer(oxzRenderer, 'oxz');

    oyzCamera = new THREE.OrthographicCamera(-size, size, size, -size, 1, 100);
    oyzCamera.position.set(10, 0, 0);
    oyzCamera.lookAt(0, 0, 0);
    oyzRenderer = new THREE.WebGLRenderer({ antialias: true });
    oyzRenderer.setClearColor(0xfafafa);
    resizeProjectionRenderer(oyzRenderer, 'oyz');
}

function onMouseDown(event) {
    isMouseDown = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseMove(event) {
    if (!isMouseDown) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    if (mode === "rotate") {
        letterMesh.rotation.y -= deltaX * 0.005;
        letterMesh.rotation.x -= deltaY * 0.005;
    } else if (mode === "translate") {
        letterMesh.position.x += deltaX * 0.01;
        letterMesh.position.y -= deltaY * 0.01;
    }

    previousMousePosition = { x: event.clientX, y: event.clientY };
}

function onMouseUp() {
    isMouseDown = false;
}

function onWheel(event) {
    letterMesh.scale.multiplyScalar(event.deltaY > 0 ? 0.9 : 1.1);
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);

    oxyCamera.position.set(letterMesh.position.x, 10 + letterMesh.position.y, letterMesh.position.z);
    oxyCamera.lookAt(letterMesh.position);

    oxzCamera.position.set(letterMesh.position.x, letterMesh.position.y, 10 + letterMesh.position.z);
    oxzCamera.lookAt(letterMesh.position);

    oyzCamera.position.set(10 + letterMesh.position.x, letterMesh.position.y, letterMesh.position.z);
    oyzCamera.lookAt(letterMesh.position);

    oxyRenderer.render(scene, oxyCamera);
    oxzRenderer.render(scene, oxzCamera);
    oyzRenderer.render(scene, oyzCamera);
}

init();
