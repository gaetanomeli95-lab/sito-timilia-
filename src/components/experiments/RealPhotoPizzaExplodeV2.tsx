"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

type Kind = "bufala" | "pomodoro" | "basilico";
type Piece = { id:string; kind:Kind; src:string; left:number; top:number; width:number; height:number; cx:number; cy:number; index:number };
type Prepared = { base:string; pieces:Piece[]; width:number; height:number };

export type RealPhotoPizzaExplodeV2Props = {
  image:string;
  eyebrow:string;
  title:string;
  lead:string;
  body:string;
  closing:string;
  notes:Array<{label:string;detail:string}>;
};

const clamp=(n:number,a=0,b=1)=>Math.min(b,Math.max(a,n));
const remap=(v:number,a:number,b:number,c:number,d:number)=>c+(d-c)*clamp((v-a)/(b-a));

function rgbToHsv(r:number,g:number,b:number){
  r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;
  if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360;}
  return [h,mx===0?0:d/mx,mx] as const;
}

function dilate(mask:Uint8Array,w:number,h:number,n=1){let src=mask;for(let p=0;p<n;p++){const out=new Uint8Array(src);for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(!src[i]&&(src[i-1]||src[i+1]||src[i-w]||src[i+w]))out[i]=1;}src=out;}return src;}

function components(mask:Uint8Array,w:number,h:number,min:number){
  const seen=new Uint8Array(mask.length),out:number[][]=[];
  for(let i=0;i<mask.length;i++){
    if(!mask[i]||seen[i])continue;const q=[i],comp:number[]=[];seen[i]=1;
    for(let k=0;k<q.length;k++){const cur=q[k],x=cur%w;comp.push(cur);for(const d of [-1,1,-w,w]){const j=cur+d;if(j<0||j>=mask.length)continue;if((d===-1&&x===0)||(d===1&&x===w-1))continue;if(mask[j]&&!seen[j]){seen[j]=1;q.push(j);}}}
    if(comp.length>=min)out.push(comp);
  }
  return out.sort((a,b)=>b.length-a.length);
}

function pieceFrom(source:ImageData,comp:number[],w:number,kind:Kind,index:number):Piece{
  let minX=w,minY=source.height,maxX=0,maxY=0;const set=new Set(comp);
  for(const i of comp){const x=i%w,y=Math.floor(i/w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  const pad=4;minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(w-1,maxX+pad);maxY=Math.min(source.height-1,maxY+pad);
  const cw=maxX-minX+1,ch=maxY-minY+1,c=document.createElement("canvas");c.width=cw;c.height=ch;const ctx=c.getContext("2d")!,im=ctx.createImageData(cw,ch);
  for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){const si=y*w+x;if(!set.has(si))continue;const s=si*4,d=((y-minY)*cw+x-minX)*4;im.data[d]=source.data[s];im.data[d+1]=source.data[s+1];im.data[d+2]=source.data[s+2];im.data[d+3]=255;}
  ctx.putImageData(im,0,0);
  return {id:`${kind}-${index}`,kind,index,src:c.toDataURL("image/png"),left:minX/w,top:minY/source.height,width:cw/w,height:ch/source.height,cx:(minX+maxX)/2/w,cy:(minY+maxY)/2/source.height};
}

function inpaint(source:ImageData,mask:Uint8Array,w:number,h:number){
  const d=new Uint8ClampedArray(source.data);let unresolved=new Uint8Array(mask);
  for(let pass=0;pass<55;pass++){
    const next=new Uint8Array(unresolved);let changed=0;
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
      const i=y*w+x;if(!unresolved[i])continue;let rr=0,gg=0,bb=0,n=0;
      for(const j of [i-1,i+1,i-w,i+w,i-w-1,i-w+1,i+w-1,i+w+1])if(!unresolved[j]){const p=j*4;rr+=d[p];gg+=d[p+1];bb+=d[p+2];n++;}
      if(n>=2){const p=i*4;d[p]=rr/n;d[p+1]=gg/n;d[p+2]=bb/n;d[p+3]=255;next[i]=0;changed++;}
    }
    unresolved=next;if(!changed)break;
  }
  const copy=new Uint8ClampedArray(d);
  for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){const i=y*w+x;if(!mask[i])continue;let rr=0,gg=0,bb=0,n=0;for(let yy=-2;yy<=2;yy++)for(let xx=-2;xx<=2;xx++){const p=((y+yy)*w+x+xx)*4;rr+=copy[p];gg+=copy[p+1];bb+=copy[p+2];n++;}const p=i*4;d[p]=rr/n;d[p+1]=gg/n;d[p+2]=bb/n;}
  return new ImageData(d,w,h);
}

async function prepare(src:string):Promise<Prepared>{
  const img=new Image();await new Promise<void>((ok,no)=>{img.onload=()=>ok();img.onerror=()=>no(new Error("load"));img.src=src;});
  const scale=Math.min(1,820/img.naturalWidth),w=Math.round(img.naturalWidth*scale),h=Math.round(img.naturalHeight*scale);const c=document.createElement("canvas");c.width=w;c.height=h;const ctx=c.getContext("2d",{willReadFrequently:true})!;ctx.drawImage(img,0,0,w,h);const source=ctx.getImageData(0,0,w,h);
  const cheese=new Uint8Array(w*h),tomato=new Uint8Array(w*h),basil=new Uint8Array(w*h);const cx=w*.5,cy=h*.49,rx=w*.37,ry=h*.39;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const e=((x-cx)**2)/(rx**2)+((y-cy)**2)/(ry**2);if(e>1)continue;const i=y*w+x,p=i*4,r=source.data[p],g=source.data[p+1],b=source.data[p+2],[hh,s,v]=rgbToHsv(r,g,b);
    if(v>.70&&s<.25&&r>172&&g>164&&b>145)cheese[i]=1;
    if((hh<24||hh>350)&&s>.52&&v>.43&&r>g*1.24&&r>b*1.20)tomato[i]=1;
    if(hh>62&&hh<148&&s>.30&&g>r*.92&&g>b*1.10&&v>.22)basil[i]=1;
  }
  const cm=dilate(cheese,w,h,2),tm=dilate(tomato,w,h,1),bm=dilate(basil,w,h,1),min=Math.max(20,Math.round(w*h*.00011));
  const cc=components(cm,w,h,min).slice(0,10),tc=components(tm,w,h,min).slice(0,12),bc=components(bm,w,h,Math.max(8,Math.round(min*.35))).slice(0,12);
  const pieces=[...cc.map((x,i)=>pieceFrom(source,x,w,"bufala",i)),...tc.map((x,i)=>pieceFrom(source,x,w,"pomodoro",i)),...bc.map((x,i)=>pieceFrom(source,x,w,"basilico",i))];
  const remove=new Uint8Array(w*h);for(const comp of [...cc,...tc,...bc])for(const i of comp)remove[i]=1;const repaired=inpaint(source,dilate(remove,w,h,4),w,h);ctx.putImageData(repaired,0,0);
  return {base:c.toDataURL("image/jpeg",.95),pieces,width:w,height:h};
}

function transformFor(piece:Piece,progress:number){
  const start=piece.kind==="bufala"?.34:piece.kind==="pomodoro"?.46:.58;const t=clamp((progress-start)/(.88-start));const dx=piece.cx-.5,dy=piece.cy-.5;
  const radial=piece.kind==="bufala"?55:piece.kind==="pomodoro"?180:115;
  const x=dx*radial*t+(piece.kind==="pomodoro"?Math.sign(dx||1)*35*t:0);
  const y=(piece.kind==="bufala"?-105:piece.kind==="pomodoro"?-190:-255)*t+dy*45*t;
  const z=(piece.kind==="bufala"?100:piece.kind==="pomodoro"?180:255)*t;
  const rz=(dx*11+(piece.index%2?3:-3))*t;
  const rx=(piece.kind==="basilico"?(piece.index%2?12:-12):piece.kind==="pomodoro"?(piece.index%2?6:-6):2)*t;
  return `translate3d(${x}px,${y}px,${z}px) rotateZ(${rz}deg) rotateX(${rx}deg)`;
}

export default function RealPhotoPizzaExplodeV2({image,eyebrow,title,lead,body,closing,notes}:RealPhotoPizzaExplodeV2Props){
  const ref=useRef<HTMLElement>(null),reduced=useReducedMotion();const [prepared,setPrepared]=useState<Prepared|null>(null),[failed,setFailed]=useState(false),[progress,setProgress]=useState(0),[pointer,setPointer]=useState({x:0,y:0});
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});useMotionValueEvent(scrollYProgress,"change",v=>setProgress(v));
  useEffect(()=>{let alive=true;prepare(image).then(v=>alive&&setPrepared(v)).catch(()=>alive&&setFailed(true));return()=>{alive=false}},[image]);
  const bg=useMemo(()=>"radial-gradient(circle at 65% 48%,rgba(210,142,69,.16),transparent 30%),radial-gradient(circle at 14% 24%,rgba(92,44,20,.18),transparent 24%),#050403",[]);
  const cameraX=reduced?0:remap(progress,.18,.85,9,-5),cameraY=reduced?0:pointer.x*7;
  return <section ref={ref} className="relative min-h-[205vh] text-white" style={{background:bg}}><div className="sticky top-0 min-h-screen overflow-hidden"><div className="mx-auto grid min-h-screen max-w-[1580px] items-center gap-8 px-5 py-24 md:px-10 lg:grid-cols-[.7fr_1.3fr] lg:px-14">
    <div className="relative z-20 max-w-xl"><div className="flex items-center gap-3"><span className="h-px w-10 bg-gold/70"/><span className="text-[10px] uppercase tracking-[.34em] text-gold">{eyebrow}</span></div><h2 className="mt-7 text-[clamp(3.5rem,7vw,7.8rem)] font-light leading-[.86] tracking-[-.055em]">{title}</h2><p className="mt-7 text-xl font-light text-white/84 md:text-2xl">{lead}</p><p className="mt-5 max-w-lg text-sm font-light leading-7 text-white/52 md:text-base">{body}</p><div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5">{notes.slice(0,5).map((n,i)=><div key={n.label} className="border-t border-white/10 pt-3"><span className="text-[9px] tracking-[.22em] text-gold/70">0{i+1}</span><div className="mt-1 text-[11px] uppercase tracking-[.12em] text-white/82">{n.label}</div><div className="mt-1 text-xs leading-5 text-white/38">{n.detail}</div></div>)}</div><p className="mt-10 max-w-md border-l border-gold/30 pl-4 text-sm italic leading-6 text-white/52">{closing}</p></div>
    <div className="relative h-[60vh] min-h-[440px] md:h-[74vh] lg:h-[84vh]" onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();setPointer({x:(e.clientX-r.left)/r.width*2-1,y:(e.clientY-r.top)/r.height*2-1})}} onPointerLeave={()=>setPointer({x:0,y:0})}><div className="absolute inset-0 flex items-center justify-center" style={{perspective:"1500px"}}>{!prepared&&!failed&&<div className="text-[10px] uppercase tracking-[.3em] text-white/30">Sto separando gli ingredienti reali…</div>}{failed&&<img src={image} alt="A Bufalina" className="max-h-full max-w-full object-contain"/>}{prepared&&<div className="relative w-[min(95%,940px)] transition-transform duration-200 ease-out" style={{aspectRatio:`${prepared.width}/${prepared.height}`,transform:`rotateX(${cameraX}deg) rotateY(${cameraY}deg)`,transformStyle:"preserve-3d"}}><img src={prepared.base} alt="Base reale della A Bufalina senza gli ingredienti sollevati" className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_42px_65px_rgba(0,0,0,.6)]"/>{prepared.pieces.map(piece=><img key={piece.id} src={piece.src} alt="" className="absolute origin-center will-change-transform drop-shadow-[0_18px_14px_rgba(0,0,0,.42)] transition-transform duration-75" style={{left:`${piece.left*100}%`,top:`${piece.top*100}%`,width:`${piece.width*100}%`,height:`${piece.height*100}%`,transform:reduced?"none":transformFor(piece,progress),transformStyle:"preserve-3d"}}/>)}<div className="pointer-events-none absolute left-[14%] right-[14%] top-[80%] h-[9%] rounded-[50%] bg-black/45 blur-3xl" style={{transform:`scale(${remap(progress,.2,.9,.82,1.15)})`,opacity:remap(progress,.2,.9,.35,.10)}}/></div>}</div><div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center"><div className="mx-auto h-9 w-px bg-gradient-to-b from-gold/70 to-transparent"/><span className="mt-2 block text-[9px] uppercase tracking-[.28em] text-white/30">Scorri · bufala, pomodorini e basilico prendono strade diverse</span></div></div>
  </div></div></section>;
}
