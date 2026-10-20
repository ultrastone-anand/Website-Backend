import{u as B,r,j as n,g,a as X}from"./index-TrkQfYJp.js";const G="https://backend.ultrastones.com/api",V=.55,P=40,Y=2500,Q=()=>{const j=B(),o=r.useRef(null),c=r.useRef(null),u=r.useRef(null),f=r.useRef(null),R=r.useRef(0),S=r.useRef(0),d=r.useRef(!1),h=r.useRef(!1),[a,D]=r.useState([]),[v,O]=r.useState(!0),[p,C]=r.useState(!1),[N,w]=r.useState(!1),[H,L]=r.useState(!1),[J,E]=r.useState(!1);r.useEffect(()=>{(async()=>{try{const s=(await X.get(`${G}/stones`)).data;if(s.success){const l=(s.data||[]).filter(x=>x.is_active===!0&&x.parent_id===null).sort((x,A)=>{const _=x.display_order??999,F=A.display_order??999;return _!==F?_-F:x.name.localeCompare(A.name,void 0,{sensitivity:"base"})});D(l)}}catch(t){console.error("Error fetching materials:",t)}finally{O(!1)}})()},[]);const I=r.useMemo(()=>[...a,...a],[a]),b=r.useCallback(()=>{const e=o.current;if(!e||a.length===0)return 0;const t=e.querySelectorAll("[data-category-card]");if(t.length<a.length)return 0;let s=0;for(let l=0;l<a.length;l+=1)s+=t[l].getBoundingClientRect().width;return s+=P*Math.max(a.length-1,0),s},[a.length]),y=r.useCallback(()=>{const e=o.current;if(!e){L(!1),E(!1);return}const t=e.scrollWidth-e.clientWidth;L(e.scrollLeft>3),E(t>3)},[]),i=r.useCallback(()=>{const e=o.current;if(!e)return;const t=b();t<=0||(e.scrollLeft>=t&&(e.scrollLeft-=t),e.scrollLeft<0&&(e.scrollLeft+=t))},[b]),m=r.useCallback((e=Y)=>{w(!0),u.current&&window.clearTimeout(u.current),u.current=window.setTimeout(()=>{w(!1)},e)},[]),k=r.useCallback(()=>{const e=o.current;if(!e)return 340;const t=e.querySelector("[data-category-card]");return t?t.getBoundingClientRect().width+P:340},[]);r.useCallback(e=>{const t=o.current;if(!t)return;const s=k(),l=b();l<=0||(e==="left"&&t.scrollLeft<=3&&(t.scrollLeft=l),t.scrollBy({left:e==="left"?-s:s,behavior:"smooth"}),m())},[b,k,m]),r.useEffect(()=>{const e=o.current;if(!e||v||a.length<2)return;const t=s=>{f.current===null&&(f.current=s);const l=s-f.current;f.current=s,!N&&!p&&!h.current&&(e.scrollLeft+=V*(l/16.67),i()),c.current=window.requestAnimationFrame(t)};return c.current=window.requestAnimationFrame(t),()=>{c.current&&window.cancelAnimationFrame(c.current),f.current=null}},[v,a.length,N,p,i]),r.useEffect(()=>{const e=o.current;if(!e)return;const t=()=>{i(),y()},s=new ResizeObserver(()=>{y()});return e.addEventListener("scroll",t,{passive:!0}),s.observe(e),y(),()=>{e.removeEventListener("scroll",t),s.disconnect()}},[i,y]),r.useEffect(()=>()=>{c.current&&window.cancelAnimationFrame(c.current),u.current&&window.clearTimeout(u.current)},[]);const T=e=>{const t=o.current;t&&(e.pointerType==="mouse"&&e.button!==0||(h.current=!0,d.current=!1,R.current=e.clientX,S.current=t.scrollLeft,w(!0)))},$=e=>{const t=o.current;if(!t||!h.current)return;const s=e.clientX-R.current;Math.abs(s)>6&&(d.current=!0,C(!0)),e.pointerType==="mouse"&&d.current&&(e.preventDefault(),t.scrollLeft=S.current-s,i())},M=()=>{h.current=!1,C(!1),i(),m(),window.setTimeout(()=>{d.current=!1},0)},W=(e,t)=>{if(d.current){e.preventDefault(),e.stopPropagation();return}j(`/product-category/${t}`)},z=()=>{w(!0)},U=()=>{p||m(1e3)},q=()=>{m()};return n.jsx("section",{className:"overflow-hidden bg-white py-[110px]",children:n.jsxs("div",{className:"mx-auto max-w-[1850px] px-6 xl:px-12",children:[n.jsxs("div",{className:"flex flex-col justify-between gap-10 lg:flex-row lg:items-center",children:[n.jsxs("div",{children:[n.jsxs("p",{className:"flex items-center gap-5 text-[18px] font-bold uppercase tracking-[0.02em] text-[#111]",style:{fontFamily:"Montserrat, sans-serif"},children:["OUR COLLECTION",n.jsx("span",{className:"text-[32px] font-normal text-[#D67A1C]",children:"→"})]}),n.jsxs("h2",{className:"mt-4 text-[45px] leading-[1.05] text-[#111]",style:{fontFamily:'"Cormorant Garamond", serif'},children:["curated by nature.",n.jsx("br",{}),"chosen for you."]})]}),n.jsxs("div",{className:"max-w-[420px] lg:self-center",children:[n.jsx("p",{className:"text-[16px] leading-[1.5] text-[#555]",style:{fontFamily:"Inter, sans-serif"},children:"Explore our exclusive range of natural and engineered stones, each piece a masterpiece."}),n.jsxs("button",{type:"button",onClick:()=>j("/categories"),className:"mt-4 border border-[#777] px-10 py-3 text-[12px] font-medium tracking-[0.02em] text-[#222] transition-all duration-300 hover:bg-black hover:text-white",style:{fontFamily:"Montserrat, sans-serif"},children:["DISCOVER MORE",n.jsx("span",{className:"ml-3 text-[#FF8000]",children:"→"})]})]})]}),n.jsx("div",{className:"mt-[40px]",children:v?n.jsx("div",{className:"grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4",children:Array.from({length:4}).map((e,t)=>n.jsxs("div",{className:"animate-pulse",children:[n.jsx("div",{className:"aspect-[4/5] bg-gray-200"}),n.jsx("div",{className:"mx-auto mt-6 h-5 w-24 bg-gray-200"}),n.jsx("div",{className:"mx-auto mt-3 h-4 w-36 bg-gray-100"})]},t))}):a.length>0?n.jsx("div",{ref:o,role:"region","aria-label":"Stone collections carousel",tabIndex:0,onPointerDown:T,onPointerMove:$,onPointerUp:M,onPointerCancel:M,onMouseEnter:z,onMouseLeave:U,onWheel:q,className:`
                w-full
                min-w-0
                overflow-x-auto
                overflow-y-hidden
                overscroll-x-contain
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                ${p?"cursor-grabbing":"cursor-grab"}
              `,style:{WebkitOverflowScrolling:"touch",touchAction:"pan-x pan-y"},children:n.jsx("div",{className:"flex w-max gap-10 pb-3",children:I.map((e,t)=>n.jsxs("button",{"data-category-card":!0,type:"button",draggable:"false",onClick:s=>W(s,e.slug),className:`
                        group
                        w-[300px]
                        shrink-0
                        select-none
                        text-center
                        sm:w-[340px]
                        lg:w-[390px]
                      `,children:[n.jsx("div",{className:"overflow-hidden bg-gray-100",children:n.jsx("img",{src:g(e.thumbnail_url,1400,95),srcSet:`
    ${g(e.thumbnail_url,800,92)} 800w,
    ${g(e.thumbnail_url,1200,94)} 1200w,
    ${g(e.thumbnail_url,1600,95)} 1600w,
    ${g(e.thumbnail_url,2e3,96)} 2000w
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
  `})}),n.jsx("h3",{className:"mt-6 text-[20px] font-semibold uppercase tracking-[0.03em] text-[#111]",style:{fontFamily:"Montserrat, sans-serif"},children:e.name}),n.jsx("p",{className:"mt-2 text-[15px] text-[#666]",style:{fontFamily:"Inter, sans-serif"},children:e.description||`${e.name} collection`})]},`${e.id}-${t}`))})}):n.jsx("div",{className:"flex min-h-[480px] items-center justify-center bg-[#fafafa] text-[16px] text-[#666]",children:"No collections found"})})]})})};export{Q as default};
