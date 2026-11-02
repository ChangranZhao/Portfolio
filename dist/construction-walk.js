// Ground basis matches construction-board's oblique u/v grid exactly.
export function constructionWalk(index,x,y){
 const u=(x>1000?-1:1)*(100+index%4*20),v=(y>950?-1:1)*(55+index%3*15);
 const a=[1.17*u,-.37*u],b=[.83*v,.62*v];
 return {points:[[0,0],a,[a[0]+b[0],a[1]+b[1]],b,[0,0]],duration:32+index%5*4,phase:-index*2.7};
}
