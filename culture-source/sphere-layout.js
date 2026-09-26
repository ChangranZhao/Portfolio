import {archiveAssets} from './archive-assets.js';

export const random = n => {const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
function reliefDepth(p,id){
 // Neighbouring pairs share a level, producing small raised/recessed patches
 // instead of a uniformly noisy outline. Small per-tile variations soften it.
 const patch=random(p.row*101+Math.floor(p.col/2)+503);
 const variation=random(id+271);
 if(patch<.26)return -26+variation*8;
 if(patch>.72)return 20+variation*12;
 return -5+variation*10;
}
// A coprime stride distributes the archive evenly without adjacent repeats.
export const photos = [6,10,14,18,22,24,26,26,24,22,18,14,10,6]
 .flatMap((count,row)=>Array.from({length:count},(_,col)=>({row,col,count})))
 .map((p,id)=>({...p,...archiveAssets[(id*19)%archiveAssets.length],id,
  latitude:-81.25+p.row*12.5,longitude:p.col*360/p.count+(p.row%2?180/p.count:0),
  depth:reliefDepth(p,id),width:60+random(id+4)*24,height:52+random(id+8)*18}));

const rad = Math.PI / 180;
const baseRadius=280;
const safeSizes = new Map(photos.map(p => {
  const roll = (random(p.id + 80) - .5) * 1.2;
  const phi = p.latitude * rad;
  // Fit the entire rolled rectangle inside a disjoint angular sector.
  // Leave a narrow but positive gap along both latitude and longitude.
  function fits(width, height) {
    const u = (Math.abs(Math.cos(roll * rad)) * width + Math.abs(Math.sin(roll * rad)) * height) / 2;
    const v = (Math.abs(Math.sin(roll * rad)) * width + Math.abs(Math.cos(roll * rad)) * height) / 2;
    for (const x of [-u, 0, u]) for (const y of [-v, v]) {
      const north = baseRadius * Math.sin(phi) + y * Math.cos(phi);
      const forward = baseRadius * Math.cos(phi) - y * Math.sin(phi);
      const lat = Math.atan2(north, Math.hypot(forward, x)) / rad;
      const lon = Math.atan2(x, forward) / rad;
      if (Math.abs(lat - p.latitude) > 5.98 || Math.abs(lon) > 180 / p.count - .28) return false;
    }
    return true;
  }
  let width = p.width, height = p.height;
  while (!fits(width, height)) { width *= .98; height *= .98; }
  // Expand the two axes independently: a short photograph should not leave
  // its horizontal space empty just because its height hit the boundary first.
  function grow(axis) {
    let low = axis === 'width' ? width : height, high = baseRadius;
    for (let i = 0; i < 24; i++) {
      const mid = (low + high) / 2;
      if (fits(axis === 'width' ? mid : width, axis === 'height' ? mid : height)) low = mid;
      else high = mid;
    }
    return low;
  }
  width = grow('width') * (.95 + .05 * random(p.id + 31));
  height = grow('height') * (p.id%9===0?.84:(.96 + .04 * random(p.id + 47)));
  return [p.id, {width, height, roll}];
}));
export function cardGeometry(p, depth) {
  const radius = baseRadius + p.depth * depth;
  const thickness=6+random(p.id+411)*3+Math.max(0,p.depth*depth)*.09;
  const size = safeSizes.get(p.id);
  // Fit at the rear radius: all eight corners of the solid block remain
  // inside the same disjoint sector, including its recessed back face.
  const scale=(radius-thickness)/baseRadius;
  return {...size,width:size.width*scale,height:size.height*scale,radius,thickness};
}
