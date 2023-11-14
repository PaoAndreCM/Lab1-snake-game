// "use strict";

import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({canvas,
                                          antialias: true});
renderer.setClearColor('rgb(255,255,255)');    // set background color

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, canvas.width / canvas.height, 0.1, 100);
camera.position.set(0, -12, 15);
camera.lookAt(scene.position);
scene.add(camera);
scene.add(new THREE.AxesHelper(1.5));

// Add light sources
scene.add(new THREE.AmbientLight('#ffffff'));
const light = new THREE.PointLight();
light.position.set(5,0,5);
scene.add(light);

// Playing Field
const field = new THREE.Object3D;
scene.add( field );

const fieldSize = 10;
const widthSegments = 10;
const heightSegments = 10;
const fieldGeometry = new THREE.PlaneGeometry( fieldSize, fieldSize, widthSegments, heightSegments );
const fieldMaterial = new THREE.MeshBasicMaterial({ color: 0xc6bac2, 
                                                    side: THREE.DoubleSide, 
                                                    wireframe:false,
                                                    wireframeLinewidth:2.0 }); 
fieldMaterial.transparent = true;
fieldMaterial.opacity = 0.7;
const playingField = new THREE.Mesh( fieldGeometry, fieldMaterial );
field.add( playingField );

// Grid
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
gridHelper.rotation.x = - Math.PI / 2;
field.add( gridHelper );

// Snake head
const cube = new THREE.Object3D; // invisible plane to center the cube
const Z_OFFSET = 0.001
const step = 1;
cube.position.copy(getRandomPosition()); 

function getRandomPosition() {
  const MAX = 4;
  const MIN = -6;
  const x = Math.ceil(Math.random() * ( MAX - MIN ) + MIN) + step / 2;
  const y = Math.ceil(Math.random() * ( MAX - MIN ) + MIN) + step / 2;
  const z = cube.position.z = step / 2 + Z_OFFSET;
  return new THREE.Vector3( x, y, z );
}
field.add( cube );

const sneakCubeLength = 0.95;
const cubeGeometry = new THREE.BoxGeometry( sneakCubeLength, sneakCubeLength, sneakCubeLength ); 
const cubeMaterial = new THREE.MeshStandardMaterial( { color: 0x59af3f,
                                                    metalness:0.5,
                                                    roughness:0.1 } ); 
const snakeCube = new THREE.Mesh( cubeGeometry, cubeMaterial ); 
cube.add( snakeCube );

// Food ball
const foodRadius = 0.5;
const foodGeometry = new THREE.SphereGeometry( foodRadius ); 
const foodMaterial = new THREE.MeshStandardMaterial( { color: 0xbf2237,
                                                    metalness:0.5,
                                                    roughness:0.1 } ); 
const food = new THREE.Mesh( foodGeometry, foodMaterial ); 
food.position.copy(getRandomPosition())
field.add( food );

let nIntervId;
function move(){
  if (!nIntervId) {
    cube.position.add(speed.clone())
  }
}

const speed = new THREE.Vector3(0,0,0); // defining constant for speed
function moveSnake(event){
  if ( event.key == "ArrowLeft" && speed.x != 1 ){
      speed.y=0;
      speed.x=-1;
  }
  if ( event.key == "ArrowRight" && speed.x != -1 ){
      speed.y=0;
      speed.x=1;
  }
  if ( event.key == "ArrowUp" && speed.y != -1 ){
      speed.x=0;
      speed.y=1;
  }
  if ( event.key == "ArrowDown" && speed.y != 1){
      speed.y=-1;
      speed.x=0;
  }
}
document.addEventListener("keydown", moveSnake);
setInterval(move, 250);

function snakeHitsWall(){
  if (cube.position.x > 5) {
    return true;
  }
  if(cube.position.x < -5){
    return true;
  }
  if(cube.position.y > 5){
    return true;
  }
  if(cube.position.y < -5){
    return true;
  }
  return false;
}

function snakeEatsFood(){
  return cube.position.equals(food.position);
}

// * Render loop
const controls = new TrackballControls(camera, renderer.domElement);
function render() {
  requestAnimationFrame(render);
  
  if( snakeHitsWall() ){
    field.remove(cube);
    cube.position.set(0,0,0);
    if(!alert('Game Over.')){      
      window.location.reload(true);}
  }

  if( snakeEatsFood() ){
    food.position.copy(getRandomPosition())
  }

  renderer.render(scene, camera);
  controls.update();
}
render();



// * Deque:
// https://learnersbucket.com/tutorials/data-structures/implement-deque-data-structure-in-javascript/

function Deque() {
  //To track the elements from back
  let count = 0;

  //To track the elements from the front
  let lowestCount = 0;

  //To store the data
  let items = {};
  this.getValues = () => {return Object.values(items);};

  //Add an item on the front
  this.insertFront = (elm) => {

    if(this.isEmpty()){
      //If empty then add on the back
      this.insertBack(elm);

    }else if(lowestCount > 0){
      //Else if there is item on the back
      //then add to its front
      items[--lowestCount] = elm;

    }else{
      //Else shift the existing items
      //and add the new to the front
      for(let i = count; i > 0; i--){
        items[i] = items[i - 1];
      }

      count++;
      items[0] = elm;
    }
  };

  //Add an item on the back of the list
  this.insertBack = (elm) => {
    items[count++] = elm;
  };

  //Remove the item from the front
  this.removeFront = () => {
    //if empty return null
    if(this.isEmpty()){
      return null;
    }

    //Get the first item and return it
    const result = items[lowestCount];
    delete items[lowestCount];
    lowestCount++;
    return result;
  };

  //Remove the item from the back
  this.removeBack = () => {
    //if empty return null
    if(this.isEmpty()){
      return null;
    }

    //Get the last item and return it
    count--;
    const result = items[count];
    delete items[count];
    return result;
  };

  //Peek the first element
  this.getFront = () => {
    //If empty then return null
    if(this.isEmpty()){
      return null;
    }

    //Return first element
    return items[lowestCount];
  };

  //Peek the last element
  this.getBack = () => {
    //If empty then return null
    if(this.isEmpty()){
      return null;
    }

    //Return first element
    return items[count - 1];
  };

  //Check if empty
  this.isEmpty = () => {
    return this.size() === 0;
  };

  //Get the size
  this.size = () => {
    return count - lowestCount;
  };

  //Clear the deque
  this.clear = () => {
    count = 0;
    lowestCount = 0;
    items = {};
  };

  //Convert to the string
  //From front to back
  this.toString = () => {
    if (this.isEmpty()) {
      return '';
    }
    let objString = `${items[lowestCount]}`;
    for (let i = lowestCount + 1; i < count; i++) {
      objString = `${objString},${items[i]}`;
    }
    return objString;
  };
}
