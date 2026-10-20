import{c as $,r as n,j as e,f as W,g as p}from"./index-TrkQfYJp.js";import{P as Q}from"./play-bRnfrp7m.js";const X=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 3v18",key:"108xh3"}]],D=$("columns-2",X);const K=[["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 12h18",key:"1i2n21"}],["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",key:"h1oib"}]],B=$("grid-2x2",K);const Y=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],H=$("square",Y),R="https://backend.ultrastones.com/api",J=20,Z=["mp4","webm","mov","m4v","ogg","ogv"],N=t=>t?.image_url||t?.video_url||t?.media_url||t?.url||"",ee=(t="")=>t.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase()||"",L=t=>{const c=String(t?.media_type||t?.type||t?.mime_type||"").toLowerCase();if(c==="video"||c.startsWith("video/"))return!0;const l=ee(N(t));return Z.includes(l)},U=t=>t?.image_alt||t?.video_alt||t?.title||t?.name||(L(t)?"Gallery video":"Gallery image"),te=({layout:t})=>{if(t==="grid")return e.jsx("div",{className:"min-h-[760px] overflow-hidden","aria-hidden":"true",children:e.jsx("div",{className:"grid w-max grid-flow-col grid-rows-3 gap-5",style:{gridAutoColumns:"320px"},children:Array.from({length:12}).map((l,g)=>e.jsx("div",{className:"gallery-skeleton h-[240px] w-[320px]"},g))})});const c=t==="one"?"h-[650px] w-[calc(100vw-120px)]":"h-[520px] w-[calc(50vw-60px)]";return e.jsx("div",{className:"min-h-[700px] overflow-hidden","aria-hidden":"true",children:e.jsx("div",{className:"flex flex-nowrap gap-5",children:Array.from({length:t==="one"?2:4}).map((l,g)=>e.jsx("div",{className:`gallery-skeleton shrink-0 ${c}`},g))})})},M=n.memo(({media:t,className:c,mediaClassName:l,onClick:g,imageWidth:o=480,imageQuality:f=70,imageSizes:x="320px"})=>{const d=n.useRef(null),i=N(t),y=U(t),u=L(t);if(!i)return null;const w=()=>{!u||!d.current||d.current.play().catch(()=>{})},C=()=>{!u||!d.current||(d.current.pause(),d.current.currentTime=0)};return e.jsxs("button",{type:"button",onClick:()=>g(t),onMouseEnter:w,onMouseLeave:C,"aria-label":`Open ${y} preview`,className:`
          group
          relative
          block
          cursor-pointer
          overflow-hidden
          bg-[#f1f1f1]
          text-left
          ${c}
        `,children:[u?e.jsx("video",{ref:d,src:i,"aria-label":y,muted:!0,loop:!0,playsInline:!0,preload:"metadata",disablePictureInPicture:!0,controlsList:"nodownload noplaybackrate",className:l}):e.jsx("img",{src:p(i,o,f),srcSet:`
              ${p(i,480,74)} 480w,
              ${p(i,640,76)} 640w,
              ${p(i,900,78)} 900w,
              ${p(i,1200,80)} 1200w,
              ${p(i,1600,82)} 1600w
            `,sizes:x,width:"320",height:"240",alt:y,loading:"lazy",decoding:"async",fetchPriority:"low",draggable:"false",className:l}),u&&e.jsxs(e.Fragment,{children:[e.jsx("span",{"aria-hidden":"true",className:`
                pointer-events-none
                absolute
                inset-0
                bg-black/10
                transition-colors
                duration-300
                group-hover:bg-black/20
              `}),e.jsx("span",{"aria-hidden":"true",className:`
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                flex
                h-14
                w-14
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-black/60
                text-white
                shadow-lg
                backdrop-blur-sm
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:bg-white
                group-hover:text-black
              `,children:e.jsx(Q,{size:21,fill:"currentColor",className:"ml-0.5"})})]})]})});M.displayName="GalleryCard";const ae=()=>{const t=n.useRef(null),c=n.useRef(new Map),[l,g]=n.useState(!1),[o,f]=n.useState("grid"),[x,d]=n.useState("all"),[i,y]=n.useState([]),[u,w]=n.useState([]),[C,_]=n.useState(!1),[O,S]=n.useState(!1),[F,I]=n.useState(""),[m,b]=n.useState(null);n.useEffect(()=>{const r=t.current;if(!r)return;const a=new IntersectionObserver(([s])=>{s.isIntersecting&&(g(!0),a.disconnect())},{root:null,rootMargin:"150px",threshold:.01});return a.observe(r),()=>a.disconnect()},[]),n.useEffect(()=>{if(!l)return;const r=new AbortController;return(async()=>{try{_(!0);const s=await fetch(`${R}/inspiration-gallery/categories`,{signal:r.signal});if(!s.ok)throw new Error(`Categories request failed: ${s.status}`);const v=await s.json();if(!v.success)throw new Error(v.message||"Failed to load categories");y(Array.isArray(v.data)?v.data:[])}catch(s){s.name!=="AbortError"&&console.error("Failed to fetch inspiration categories:",s)}finally{r.signal.aborted||_(!1)}})(),()=>r.abort()},[l]),n.useEffect(()=>{if(!l)return;const r=String(x),a=c.current.get(r);if(a){w(a),S(!1),I("");return}const s=new AbortController;return(async()=>{try{S(!0),I("");const j=new URLSearchParams({limit:String(J)});x!=="all"&&j.set("categoryId",String(x));const A=await fetch(`${R}/inspiration-gallery/images?${j.toString()}`,{signal:s.signal});if(!A.ok)throw new Error(`Images request failed: ${A.status}`);const h=await A.json();if(!h.success)throw new Error(h.message||"Failed to load gallery media");const G=Array.isArray(h.data)?h.data:h.data?.images||h.data?.items||h.data?.rows||[];c.current.set(r,G),w(G)}catch(j){j.name!=="AbortError"&&(console.error("Failed to fetch inspiration gallery media:",j),w([]),I("Unable to load inspiration media."))}finally{s.signal.aborted||S(!1)}})(),()=>s.abort()},[l,x]),n.useEffect(()=>{if(!m)return;const r=document.body.style.overflow;document.body.style.overflow="hidden";const a=s=>{s.key==="Escape"&&b(null)};return window.addEventListener("keydown",a),()=>{document.body.style.overflow=r,window.removeEventListener("keydown",a)}},[m]);const q=n.useMemo(()=>[{id:"all",name:"All"},...i],[i]),E=r=>`transition-colors duration-200 ${o===r?"text-black":"text-[#666] hover:text-black"}`,T=()=>o==="two"?"h-[520px] w-[calc(50vw-60px)]":o==="one"?"h-[650px] w-[calc(100vw-120px)]":"",V=n.useMemo(()=>o==="one"?{imageWidth:1400,imageQuality:80,imageSizes:"calc(100vw - 120px)"}:o==="two"?{imageWidth:1e3,imageQuality:76,imageSizes:"calc(50vw - 60px)"}:{imageWidth:480,imageQuality:70,imageSizes:"320px"},[o]),k=N(m),z=m?L(m):!1,P=m?U(m):"";return e.jsxs("section",{ref:t,className:"bg-white py-[42px]",children:[e.jsx("style",{children:`
          @keyframes galleryShimmer {
            0% {
              transform: translateX(-100%);
            }

            100% {
              transform: translateX(100%);
            }
          }

          .gallery-skeleton {
            position: relative;
            overflow: hidden;
            background: #eeeeee;
          }

          .gallery-skeleton::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: translateX(-100%);
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.75),
              transparent
            );
            animation: galleryShimmer 1.4s infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .gallery-skeleton::after {
              animation: none;
            }
          }
        `}),e.jsxs("div",{className:"mx-auto max-w-[1850px] px-6 xl:px-[52px]",children:[e.jsx("div",{className:"mb-11 flex items-center justify-between",children:e.jsxs("h2",{className:"flex items-center gap-7 text-[18px] font-bold uppercase text-[#111] md:text-[22px]",style:{fontFamily:"Montserrat, sans-serif"},children:["INSPIRATION GALLERIES",e.jsx("span",{"aria-hidden":"true",className:"text-[24px] font-normal text-[#B45309]",children:"→"})]})}),e.jsxs("div",{className:"mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-center",children:[e.jsxs("div",{className:"flex flex-wrap gap-x-12 gap-y-4",children:[q.map(r=>{const a=String(x)===String(r.id);return e.jsxs("button",{type:"button",onClick:()=>d(r.id),"aria-pressed":a,className:"group relative min-h-11 px-1 pb-2 text-[14px]",style:{fontFamily:"Inter, sans-serif"},children:[e.jsx("span",{className:`transition-colors duration-300 ${a?"text-black":"text-[#555] group-hover:text-black"}`,children:r.name}),e.jsx("span",{"aria-hidden":"true",className:`absolute bottom-0 left-0 h-[1.5px] bg-black transition-all duration-300 ${a?"w-full":"w-0 group-hover:w-full"}`})]},r.id)}),C&&i.length===0&&e.jsx("span",{className:"flex min-h-11 items-center text-[14px] text-[#666]",children:"Loading categories..."})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{type:"button","aria-label":"Show gallery in grid layout","aria-pressed":o==="grid",onClick:()=>f("grid"),className:"flex h-11 w-11 items-center justify-center",children:e.jsx(B,{size:18,"aria-hidden":"true",className:E("grid")})}),e.jsx("button",{type:"button","aria-label":"Show gallery in two-column layout","aria-pressed":o==="two",onClick:()=>f("two"),className:"flex h-11 w-11 items-center justify-center",children:e.jsx(D,{size:18,"aria-hidden":"true",className:E("two")})}),e.jsx("button",{type:"button","aria-label":"Show gallery in single-column layout","aria-pressed":o==="one",onClick:()=>f("one"),className:"flex h-11 w-11 items-center justify-center",children:e.jsx(H,{size:18,"aria-hidden":"true",className:E("one")})})]})]}),!l||O?e.jsx(te,{layout:o}):F?e.jsx("div",{className:"flex h-[700px] items-center justify-center border border-[#ECECEC] bg-[#FAFAFA]",children:e.jsx("p",{className:"text-[16px] text-[#666]",children:F})}):u.length>0?o==="grid"?e.jsx("div",{className:"min-h-[760px] overflow-x-auto overflow-y-hidden",children:e.jsx("div",{className:"grid w-max grid-flow-col grid-rows-3 gap-5 pb-3",style:{gridAutoColumns:"320px"},children:u.map(r=>e.jsx(M,{media:r,onClick:b,imageWidth:480,imageQuality:70,imageSizes:"320px",className:"h-[240px] w-[320px]",mediaClassName:"h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"},r.id||N(r)))})}):e.jsx("div",{className:"min-h-[700px] overflow-x-auto",children:e.jsx("div",{className:"flex flex-nowrap gap-5 pb-3",children:u.map(r=>e.jsx(M,{media:r,onClick:b,...V,className:`shrink-0 ${T()}`,mediaClassName:"h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"},r.id||N(r)))})}):e.jsx("div",{className:"flex h-[700px] items-center justify-center border border-[#ECECEC] bg-[#FAFAFA]",children:e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-[18px] font-medium text-[#222]",children:"No inspiration media found"}),e.jsx("p",{className:"mt-2 text-[14px] text-[#666]",children:"Images and videos for this category will appear here."})]})})]}),m&&k&&W.createPortal(e.jsxs("div",{role:"dialog","aria-modal":"true","aria-label":z?"Video preview":"Image preview",className:`
        fixed
        inset-0
        z-[99999]
        flex
        h-[100dvh]
        w-screen
        items-center
        justify-center
        overflow-hidden
        bg-black/80
        p-4
        sm:p-6
      `,onClick:()=>b(null),children:[e.jsx("button",{type:"button","aria-label":"Close media preview",onClick:()=>b(null),className:`
          absolute
          right-4
          top-4
          z-20
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-black/40
          text-4xl
          font-light
          leading-none
          text-white
          backdrop-blur-sm
          transition
          hover:bg-white
          hover:text-black
        `,children:e.jsx("span",{"aria-hidden":"true",className:"-mt-1",children:"×"})}),e.jsx("div",{className:`
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
        `,onClick:r=>r.stopPropagation(),children:z?e.jsx("video",{src:k,"aria-label":P,controls:!0,autoPlay:!0,playsInline:!0,preload:"auto",controlsList:"nodownload",className:`
              block
              max-h-full
              max-w-full
              bg-black
              object-contain
            `,children:"Your browser does not support video playback."},k):e.jsx("img",{src:p(k,1800,82),alt:P,decoding:"async",fetchPriority:"high",className:`
              block
              max-h-full
              max-w-full
              object-contain
            `})})]}),document.body)]})};export{ae as default};
