// registration.js

document.addEventListener('DOMContentLoaded', () => {
    let isLoggedIn = false; // Start with the user not logged in
    const logIn = document.getElementById('logIn');
    const registrationForm = document.querySelector('#registrationForm');
  
    // Initialize login button text
    if (logIn) {
      logIn.textContent = 'Login';
      logIn.dataset.page = "login";
  
      // Check local storage for login state
      if (localStorage.getItem('isLoggedIn') === 'true') {
        isLoggedIn = true;
        logIn.textContent = 'Logout';
        logIn.dataset.page = "logout";
      }
  
      // Handle login/logout functionality
      logIn.addEventListener('click', () => {
        if (isLoggedIn) {
          localStorage.removeItem('isLoggedIn');
          isLoggedIn = false;
          logIn.textContent = 'Login';
          logIn.dataset.page = "login";
          window.location.href = '/login';
        } else {
          window.location.href = '/login';
        }
      });
    }
  
    // Handle registration form submission (POST -> /api/user)
    if (registrationForm) {
      registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userData = {
          firstName: document.getElementById('firstName').value.trim(),
          lastName:  document.getElementById('lastName').value.trim(),
          birthD:    document.getElementById('birthD').value,
          phone:     document.getElementById('phone').value.trim(),
          email:     document.getElementById('email').value.trim(),
          password:  document.getElementById('password').value
        };
  
        try {
          const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Registration failed');
  
          alert(data.message || 'Registered!');
          localStorage.setItem('isLoggedIn', 'true');
          window.location.href = '/home';
        } catch (e) {
          alert(e.message || 'Error registering user');
        }
      });
    }
  
    // Back button
    const backBtn = document.getElementById('backButton');
    if (backBtn) backBtn.addEventListener('click', () => window.history.back());
  
    // Highlight active nav
    const currentPage = 'registration';
    document.querySelectorAll('.menu-option').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-page') === currentPage);
    });
  
    // ==========================
    // 3D Revolving Earth (Three.js)
    // ==========================
    const container = document.getElementById('earthContainer');
    if (!container || typeof THREE === 'undefined') return;
  
    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
  
    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3);
  
    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const dir = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(5, 3, 5);
    scene.add(dir);
  
    // Earth (diffuse texture)
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load('/images/earth_texture.jpg'); // <-- put file there
    const geo = new THREE.SphereGeometry(1, 64, 64);
    const mat = new THREE.MeshStandardMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(geo, mat);
    scene.add(earth);
  
    // Subtle tilt
    earth.rotation.x = 0.25;
  
    // Animate
    function animate() {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.002; // spin speed
      renderer.render(scene, camera);
    }
    animate();
  
    // Handle resize
    function onResize() {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', onResize);
  });
  // ======= High-fidelity 3D Earth =======
const container = document.getElementById('earthContainer');
if (!container || typeof THREE === 'undefined') return;

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // cap DPR=2 to avoid GPU burn
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;        // correct color
renderer.toneMapping = THREE.ACESFilmicToneMapping;      // gentle highlights
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 3);

// Background stars (optional but makes it feel real)
new THREE.TextureLoader().load('/images/stars_4k.jpg', (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  scene.background = tex;
});

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.35));
const sun = new THREE.DirectionalLight(0xffffff, 1.15);
sun.position.set(5, 2, 4);
scene.add(sun);

// Texture loader with best practices
const loader = new THREE.TextureLoader();
const maxAniso = renderer.capabilities.getMaxAnisotropy();
function prepColorTex(tex) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}
function prepDataTex(tex) {
  tex.anisotropy = maxAniso;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

// Load maps
const dayMap     = prepColorTex(loader.load('/images/earth_day_4k.jpg'));
const normalMap  = prepDataTex(loader.load('/images/earth_normal_4k.jpg'));
const specMap    = prepDataTex(loader.load('/images/earth_spec_4k.jpg'));   // oceans bright
const cloudsMap  = prepColorTex(loader.load('/images/earth_clouds_4k.png')); // RGBA w/ alpha

// Earth surface (PBR or Phong)
// Phong gives crisp specular highlights for water—great for a globe.
const earthGeo = new THREE.SphereGeometry(1, 128, 128);
const earthMat = new THREE.MeshPhongMaterial({
  map: dayMap,
  normalMap: normalMap,
  specularMap: specMap,
  specular: new THREE.Color(0x222222),
  shininess: 15
});
const earth = new THREE.Mesh(earthGeo, earthMat);
earth.rotation.x = 0.25;  // axial tilt
scene.add(earth);

// Clouds: slightly larger sphere with additive blending
const cloudsGeo = new THREE.SphereGeometry(1.008, 128, 128);
const cloudsMat = new THREE.MeshLambertMaterial({
  map: cloudsMap,
  transparent: true,
  opacity: 0.6,
  depthWrite: false
});
const clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
scene.add(clouds);

// Atmosphere glow (subtle)
const atmGeo = new THREE.SphereGeometry(1.03, 64, 64);
const atmMat = new THREE.MeshBasicMaterial({
  color: 0x78c3ff,
  transparent: true,
  opacity: 0.15,
  side: THREE.BackSide
});
const atmosphere = new THREE.Mesh(atmGeo, atmMat);
scene.add(atmosphere);

// Animation
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y  += 0.0018;  // main spin
  clouds.rotation.y += 0.0022;  // clouds drift a bit faster
  renderer.render(scene, camera);
}
animate();

// Resize
function onResize() {
  const w = container.clientWidth, h = container.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);
