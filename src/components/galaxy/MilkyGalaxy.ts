import {
    Color,
    DoubleSide,
    InstancedBufferAttribute,
    InstancedBufferGeometry,
    Mesh,
    Object3D,
    PerspectiveCamera,
    PlaneBufferGeometry,
    Scene,
    ShaderMaterial,
    sRGBEncoding,
    TextureLoader,
    Vector3,
    Vector4,
    WebGLRenderer
} from 'three';

import {doesNeedResize, lerp} from './helpers';
import barredSpiral from './glsl/barred-spiral.glsl';
import fragment from './glsl/fragment.glsl';

interface Layer {
  count: number;
  color: string;
  texture: string;
  sizeAmp?: number;
  minRadius?: number;
  maxRadius?: number;
  speedAmp?: number;
  yAmp?: number;
}
interface GalaxyOptions {
  canvas: HTMLElement;
  type?: GalaxyTypes;
  camera?: PerspectiveCamera;
  scene?: Scene;
  renderer?: WebGLRenderer;
  window?: Window;
  backgroundColor?: any;

  layers: Layer[];
}

type GalaxyTypes = 'spiral' | 'barred-spiral';

class MilkyGalaxy {
  camera: PerspectiveCamera;

  private readonly canvas: HTMLElement;
  private readonly layers: Layer[];
  private readonly window: Window;
  private readonly scene: Scene;
  private readonly renderer: WebGLRenderer;
  private readonly materials: ShaderMaterial[];
  private stopAnimation: boolean;

  constructor(opts: GalaxyOptions) {
    this.canvas = opts.canvas;
    this.layers = opts.layers;
    this.window = opts.window ?? window;
    this.materials = [];

    this.renderer =
      opts.renderer ??
      new WebGLRenderer({
        canvas: this.canvas,
        alpha: !opts.backgroundColor
      });
    this.scene = opts.scene ?? new Scene();
    this.camera =
      opts.camera ??
      new PerspectiveCamera(
        70,
        this.canvas.clientWidth / this.canvas.clientHeight,
        0.000000000001,
        1000
      );

    opts.backgroundColor &&
      this.renderer.setClearColor(opts.backgroundColor, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = sRGBEncoding;
    this.camera.position.set(0, 3, 2);
    this.stopAnimation = false;

    this.generate = this.generate.bind(this);
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
    this.animate = this.animate.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.trackMouse = this.trackMouse.bind(this);

    this.layers.forEach(this.generate);
  }

  private generate(layer: Layer): void {
    const {
      count,
      color,
      texture,
      sizeAmp = 1,
      minRadius = 0.2,
      maxRadius = 2,
      speedAmp = 1,
      yAmp = 1
    } = layer;
    const particlegeo = new PlaneBufferGeometry(1, 1);
    const geo = new InstancedBufferGeometry();
    geo.instanceCount = count;
    geo.setAttribute('position', particlegeo.getAttribute('position'));
    geo.index = particlegeo.index;

    const pos = new Float32Array(count * 3);

    for (let index = 0; index < count; index++) {
      const theta = Math.random() * 2 * Math.PI;
      const r = lerp(minRadius, maxRadius, Math.random());
      const x = r * Math.sin(theta);
      const y = (Math.random() - 0.05) * (lerp(0.2, 0.1, Math.random()) * yAmp);
      const z = r * Math.cos(theta);

      pos.set([x, y, z], index * 3);
    }

    geo.setAttribute('pos', new InstancedBufferAttribute(pos, 3, false));

    const material = new ShaderMaterial({
      extensions: {
        derivatives: true
      },
      side: DoubleSide,
      uniforms: {
        uTexture: { value: new TextureLoader().load(texture) },
        uColor: { value: new Color(color) },
        uSizeAmp: { value: sizeAmp },
        uSpeedAmp: { value: speedAmp },
        uYTwistAmp: { value: yAmp },
        uMouse: { value: new Vector3() },
        time: { value: 0 },
        resolution: { value: new Vector4() }
      },
      // wireframe: true,
      transparent: true,
      depthTest: false,
      vertexShader: barredSpiral,
      fragmentShader: fragment
    });

    this.materials.push(material);

    const points = new Mesh(geo, material);
    this.scene.add(points);
  }

  resize(): void {
    if (doesNeedResize(this.renderer)) {
      const pixelRatio = Math.min(this.window.devicePixelRatio, 2);
      const width = (this.canvas.clientWidth * pixelRatio) | 0;
      const height = (this.canvas.clientHeight * pixelRatio) | 0;
      const canvas = this.renderer.domElement;

      this.renderer.setPixelRatio(pixelRatio);
      this.renderer.setSize(width, height, false);

      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }
  }

  add(object: Object3D): void {
    this.scene.add(object);
  }

  render(): void {
    this.resize();
    this.renderer.render(this.scene, this.camera);
  }

  animate(): void {
    this.render();
    this.materials.forEach((m) => {
      m.uniforms.time.value += 1;
    });
  }

  play(): void {
    this.stopAnimation ? this.render() : this.animate();

    requestAnimationFrame(this.play);
  }

  stop(): void {
    this.stopAnimation = true;
  }

  trackMouse(xyz: Vector3): void {
    this.materials.forEach((m) => {
      m.uniforms.uMouse.value = xyz;
    });
  }
}

export default MilkyGalaxy;
