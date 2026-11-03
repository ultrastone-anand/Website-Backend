import{u as $,r,j as n,g as x,a as U}from"./index-Bn3LZPnQ.js";const W="https://backend.ultrastones.com/api",z=.55,q=40,X=2500,G=()=>{const y=$(),o=r.useRef(null),c=r.useRef(null),u=r.useRef(null),d=r.useRef(null),v=r.useRef(0),j=r.useRef(0),f=r.useRef(!1),p=r.useRef(!1),[a,A]=r.useState([]),[w,_]=r.useState(!0),[g,N]=r.useState(!1),[R,h]=r.useState(!1);r.useEffect(()=>{(async()=>{try{const s=(await U.get(`${W}/stones`)).data;if(s.success){const l=(s.data||[]).filter(m=>m.is_active===!0&&m.parent_id===null).sort((m,C)=>{const S=m.display_order??999,M=C.display_order??999;return S!==M?S-M:m.name.localeCompare(C.name,void 0,{sensitivity:"base"})});A(l)}}catch(t){console.error("Error fetching materials:",t)}finally{_(!1)}})()},[]);const k=r.useMemo(()=>[...a,...a],[a]),E=r.useCallback(()=>{const e=o.current;if(!e||a.length===0)return 0;const t=e.querySelectorAll("[data-category-card]");if(t.length<a.length)return 0;let s=0;for(let l=0;l<a.length;l+=1)s+=t[l].getBoundingClientRect().width;return s+=q*Math.max(a.length-1,0),s},[a.length]),i=r.useCallback(()=>{const e=o.current;if(!e)return;const t=E();t<=0||(e.scrollLeft>=t&&(e.scrollLeft-=t),e.scrollLeft<0&&(e.scrollLeft+=t))},[E]),b=r.useCallback((e=X)=>{h(!0),u.current&&window.clearTimeout(u.current),u.current=window.setTimeout(()=>{h(!1)},e)},[]);r.useEffect(()=>{const e=o.current;if(!e||w||a.length<2)return;const t=s=>{d.current===null&&(d.current=s);const l=s-d.current;d.current=s,!R&&!g&&!p.current&&(e.scrollLeft+=z*(l/16.67),i()),c.current=window.requestAnimationFrame(t)};return c.current=window.requestAnimationFrame(t),()=>{c.current&&window.cancelAnimationFrame(c.current),d.current=null}},[w,a.length,R,g,i]),r.useEffect(()=>{const e=o.current;if(!e)return;const t=()=>{i()};return e.addEventListener("scroll",t,{passive:!0}),()=>{e.removeEventListener("scroll",t)}},[i]),r.useEffect(()=>()=>{c.current&&window.cancelAnimationFrame(c.current),u.current&&window.clearTimeout(u.current)},[]);const F=e=>{const t=o.current;t&&(e.pointerType==="mouse"&&e.button!==0||(p.current=!0,f.current=!1,v.current=e.clientX,j.current=t.scrollLeft,h(!0)))},P=e=>{const t=o.current;if(!t||!p.current)return;const s=e.clientX-v.current;Math.abs(s)>6&&(f.current=!0,N(!0)),e.pointerType==="mouse"&&f.current&&(e.preventDefault(),t.scrollLeft=j.current-s,i())},L=()=>{p.current=!1,N(!1),i(),b(),window.setTimeout(()=>{f.current=!1},0)},D=(e,t)=>{if(f.current){e.preventDefault(),e.stopPropagation();return}y(`/product-category/${t}`)},I=()=>{h(!0)},O=()=>{g||b(1e3)},T=()=>{b()};return n.jsx("section",{className:"overflow-hidden bg-white py-[110px]",children:n.jsxs("div",{className:"mx-auto max-w-[1850px] px-6 xl:px-12",children:[n.jsxs("div",{className:"flex flex-col justify-between gap-10 lg:flex-row lg:items-center",children:[n.jsxs("div",{children:[n.jsxs("p",{className:"flex items-center gap-5 text-[18px] font-bold uppercase tracking-[0.02em] text-[#111]",style:{fontFamily:"Montserrat, sans-serif"},children:["OUR COLLECTION",n.jsx("span",{className:"text-[32px] font-normal text-[#D67A1C]",children:"→"})]}),n.jsxs("h2",{className:"mt-4 text-[45px] leading-[1.05] text-[#111]",style:{fontFamily:'"Cormorant Garamond", serif'},children:["curated by nature.",n.jsx("br",{}),"chosen for you."]})]}),n.jsxs("div",{className:"max-w-[420px] lg:self-center",children:[n.jsx("p",{className:"text-[16px] leading-[1.5] text-[#555]",style:{fontFamily:"Inter, sans-serif"},children:"Explore our exclusive range of natural and engineered stones, each piece a masterpiece."}),n.jsxs("button",{type:"button",onClick:()=>y("/categories"),className:"mt-4 border border-[#777] px-10 py-3 text-[12px] font-medium tracking-[0.02em] text-[#222] transition-all duration-300 hover:bg-black hover:text-white",style:{fontFamily:"Montserrat, sans-serif"},children:["DISCOVER MORE",n.jsx("span",{className:"ml-3 text-[#FF8000]",children:"→"})]})]})]}),n.jsx("div",{className:"mt-[40px]",children:w?n.jsx("div",{className:"grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4",children:Array.from({length:4}).map((e,t)=>n.jsxs("div",{className:"animate-pulse",children:[n.jsx("div",{className:"aspect-[4/5] bg-gray-200"}),n.jsx("div",{className:"mx-auto mt-6 h-5 w-24 bg-gray-200"}),n.jsx("div",{className:"mx-auto mt-3 h-4 w-36 bg-gray-100"})]},t))}):a.length>0?n.jsx("div",{ref:o,role:"region","aria-label":"Stone collections carousel",tabIndex:0,onPointerDown:F,onPointerMove:P,onPointerUp:L,onPointerCancel:L,onMouseEnter:I,onMouseLeave:O,onWheel:T,className:`
                w-full
                min-w-0
                overflow-x-auto
                overflow-y-hidden
                overscroll-x-contain
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                ${g?"cursor-grabbing":"cursor-grab"}
              `,style:{WebkitOverflowScrolling:"touch",touchAction:"pan-x pan-y"},children:n.jsx("div",{className:"flex w-max gap-10 pb-3",children:k.map((e,t)=>n.jsxs("button",{"data-category-card":!0,type:"button",draggable:"false",onClick:s=>D(s,e.slug),className:`
                        group
                        w-[300px]
                        shrink-0
                        select-none
                        text-center
                        sm:w-[340px]
                        lg:w-[390px]
                      `,children:[n.jsx("div",{className:"overflow-hidden bg-gray-100",children:n.jsx("img",{src:x(e.thumbnail_url,1400,95),srcSet:`
    ${x(e.thumbnail_url,800,92)} 800w,
    ${x(e.thumbnail_url,1200,94)} 1200w,
    ${x(e.thumbnail_url,1600,95)} 1600w,
    ${x(e.thumbnail_url,2e3,96)} 2000w
  `,sizes:`
    (max-width: 639px) 300px,
    (max-width: 1023px) 340px,
    390px
  `,alt:e.name,loading:"lazy",decoding:"async",draggable:"false",className:`
    pointer-events-none
    aspect-[4/5]
    w-full
    select-none
    object-cover
    transition-transform
    duration-700
    group-hover:scale-105
  `})}),n.jsx("h3",{className:"mt-6 text-[20px] font-semibold uppercase tracking-[0.03em] text-[#111]",style:{fontFamily:"Montserrat, sans-serif"},children:e.name}),n.jsx("p",{className:"mt-2 text-[15px] text-[#666]",style:{fontFamily:"Inter, sans-serif"},children:e.description||`${e.name} collection`})]},`${e.id}-${t}`))})}):n.jsx("div",{className:"flex min-h-[480px] items-center justify-center bg-[#fafafa] text-[16px] text-[#666]",children:"No collections found"})})]})})};export{G as default};
