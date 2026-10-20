import{c as J,h as he,r as l,j as e,L as oe,R as xe,f as fe,X as be,g as E}from"./index-TrkQfYJp.js";import{C as ye,a as we}from"./chevron-right-D0hdTYcX.js";import{P as ve}from"./play-bRnfrp7m.js";const je=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],le=J("image",je);const Ne=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],ke=J("maximize-2",Ne);const Pe=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],Ce=J("refresh-cw",Pe),Y="https://backend.ultrastones.com/api",w=24,Se=["mp4","webm","mov","m4v","ogg","ogv"],O=n=>n?.image_url||n?.video_url||n?.media_url||n?.url||n?.image||"",_e=(n="")=>{try{return new URL(n,window.location.origin).pathname.split(".").pop()?.toLowerCase()||""}catch{return n.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase()||""}},V=n=>{const o=String(n?.media_type||n?.type||n?.mime_type||"").toLowerCase();if(o==="video"||o.startsWith("video/"))return!0;const a=O(n),d=_e(a);return Se.includes(d)},ce=n=>n?.image_alt||n?.video_alt||n?.title||n?.name||(V(n)?"Inspiration gallery video":"Inspiration gallery image"),Ee=n=>n?.category_name||n?.inspiration_gallery_categories?.name||"",Ie=n=>{const o=n?.title||n?.name||"";return o?o.replace(/\.(mp4|webm|mov|m4v|ogg|ogv|jpg|jpeg|png|webp|avif)$/i,""):""},U=(...n)=>{for(const o of n){const a=Number(o);if(Number.isFinite(a)&&a>=0)return a}return null},ie=(n,o)=>{const a=n?.data;if(Array.isArray(a)){const N=a,I=N.length===w;return{images:N,total:null,page:o,totalPages:I?o+1:o,hasNextPage:I,hasPreviousPage:o>1,totalKnown:!1}}const d=a?.images||a?.media||a?.rows||a?.items||a?.results||a?.data||[],c=Array.isArray(d)?d:[],s=a?.pagination||a?.meta||a?.paging||n?.pagination||n?.meta||{},f=U(a?.total,a?.count,a?.totalCount,a?.total_count,s?.total,s?.count,s?.totalCount,s?.total_count,s?.totalItems,s?.total_items,n?.total,n?.count),u=U(a?.page,a?.currentPage,a?.current_page,s?.page,s?.currentPage,s?.current_page,n?.page,o)||o,h=U(a?.totalPages,a?.total_pages,a?.pages,a?.pageCount,a?.page_count,s?.totalPages,s?.total_pages,s?.pages,s?.pageCount,s?.page_count,s?.lastPage,s?.last_page,n?.totalPages,n?.total_pages),g=U(a?.limit,a?.pageSize,a?.page_size,a?.perPage,a?.per_page,s?.limit,s?.pageSize,s?.page_size,s?.perPage,s?.per_page,w)||w;let b=1,i=!1;h!==null&&h>0?(b=h,i=!0):f!==null&&f>=0?(b=Math.max(1,Math.ceil(f/g)),i=!0):(b=c.length===w?u+1:u,i=!1);const C=s?.hasNextPage??s?.has_next_page??s?.hasNext??s?.has_next??a?.hasNextPage??a?.has_next_page??a?.hasNext??null,y=C!==null?!!C:i?u<b:c.length===w;return{images:c,total:f,page:u,totalPages:Math.max(u,b),hasNextPage:y,hasPreviousPage:u>1,totalKnown:i}},Le=()=>e.jsx("div",{className:`
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        `,children:Array.from({length:w}).map((n,o)=>e.jsx("div",{className:`
                gallery-skeleton
                aspect-[4/3]
                w-full
                overflow-hidden
                bg-[#eeeeee]
              `},o))}),de=l.memo(({media:n,index:o,onClick:a})=>{const d=l.useRef(null),c=O(n),s=ce(n),f=Ee(n),u=Ie(n),h=V(n);if(!c)return null;const g=()=>{!h||!d.current||d.current.play().catch(()=>{})},b=()=>{if(!(!h||!d.current)){d.current.pause();try{d.current.currentTime=0}catch{}}};return e.jsxs("button",{type:"button",onClick:()=>a(n),onMouseEnter:g,onMouseLeave:b,"aria-label":`Open ${s}`,className:`
          group
          relative
          block
          aspect-[4/3]
          w-full
          cursor-pointer
          overflow-hidden
          bg-[#eeeeee]
          text-left
        `,children:[h?e.jsx("video",{ref:d,src:c,"aria-label":s,muted:!0,loop:!0,playsInline:!0,preload:o<4?"metadata":"none",disablePictureInPicture:!0,controlsList:"nodownload noplaybackrate",className:`
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            `}):e.jsx("img",{src:E(c,900,82),srcSet:`
              ${E(c,480,76)} 480w,

              ${E(c,700,79)} 700w,

              ${E(c,900,82)} 900w,

              ${E(c,1200,84)} 1200w
            `,sizes:`
              (max-width: 639px) 100vw,
              (max-width: 1023px) 50vw,
              (max-width: 1279px) 33vw,
              25vw
            `,alt:s,width:"900",height:"675",loading:o<4?"eager":"lazy",decoding:"async",fetchPriority:o<2?"high":"low",draggable:!1,className:`
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            `}),e.jsx("span",{"aria-hidden":"true",className:`
            absolute
            inset-0
            bg-gradient-to-t
            from-black/55
            via-black/5
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          `}),h&&e.jsx("span",{"aria-hidden":"true",className:`
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
              bg-black/55
              text-white
              shadow-lg
              backdrop-blur-sm
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:bg-white
              group-hover:text-black
            `,children:e.jsx(ve,{size:22,fill:"currentColor","aria-hidden":"true",className:"ml-0.5"})}),e.jsx("span",{className:`
            absolute
            right-4
            top-4
            flex
            h-10
            w-10
            translate-y-2
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-[#161412]
            opacity-0
            shadow-lg
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          `,children:e.jsx(ke,{size:17,"aria-hidden":"true"})}),(u||f)&&e.jsxs("span",{className:`
              absolute
              bottom-0
              left-0
              right-0
              translate-y-3
              p-5
              opacity-0
              transition-all
              duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
            `,children:[u&&e.jsx("span",{className:"block text-[15px] font-medium text-white",children:u}),f&&e.jsx("span",{className:`
                  mt-1
                  block
                  text-[11px]
                  uppercase
                  tracking-[0.14em]
                  text-white/75
                `,children:f})]})]})});de.displayName="GalleryCard";const Me=({currentPage:n,totalPages:o})=>{if(o<=7)return Array.from({length:o},(d,c)=>c+1);const a=new Set([1,o,n,n-1,n+1]);return Array.from(a).filter(d=>d>=1&&d<=o).sort((d,c)=>d-c)},Re=()=>{const[n,o]=he(),a=n.get("category"),d=l.useRef(null),c=l.useRef(new Map),[s,f]=l.useState([]),[u,h]=l.useState([]),[g,b]=l.useState("all"),[i,C]=l.useState(1),[y,N]=l.useState(1),[I,$]=l.useState(null),[k,R]=l.useState(!1),[T,Q]=l.useState(!1),[G,Z]=l.useState(!0),[L,D]=l.useState(!0),[H,q]=l.useState(""),[v,F]=l.useState(null),[ee,S]=l.useState(!1),me=l.useMemo(()=>[{id:"all",name:"All"},...s],[s]),te=l.useCallback(async t=>{try{Z(!0);const r=await fetch(`${Y}/inspiration-gallery/categories`,{signal:t});if(!r.ok)throw new Error(`Categories request failed: ${r.status}`);const m=await r.json();if(!m.success)throw new Error(m.message||"Failed to load categories");const x=[...Array.isArray(m.data)?m.data:[]].sort((p,P)=>String(p?.name||"").localeCompare(String(P?.name||""),void 0,{sensitivity:"base"}));f(x)}catch(r){r.name!=="AbortError"&&console.error("Failed to fetch inspiration categories:",r)}finally{t.aborted||Z(!1)}},[]);l.useEffect(()=>{if(G||s.length===0||!a)return;const t=a.trim().toLowerCase(),r=s.find(m=>String(m?.name||"").trim().toLowerCase()===t);r&&String(g)!==String(r.id)&&(b(r.id),C(1),N(1),$(null),R(!1))},[s,G,a,g]);const X=l.useCallback(async({categoryId:t,page:r,signal:m,force:j=!1})=>{const x=`${t}-${r}`;if(!j&&c.current.has(x)){const p=c.current.get(x);h(p.images),$(p.total),N(p.totalPages),R(p.hasNextPage),Q(p.totalKnown),q(""),D(!1);return}try{D(!0),q("");const p=new URLSearchParams({limit:String(w),page:String(r)});t!=="all"&&p.set("categoryId",String(t));const P=`${Y}/inspiration-gallery/images?${p.toString()}`;console.log("🟦 Gallery request:",P);const z=await fetch(P,{signal:m});if(!z.ok)throw new Error(`Images request failed: ${z.status}`);const K=await z.json();if(console.log("🟩 Gallery API response:",K),K.success===!1)throw new Error(K.message||"Failed to load gallery media");const A=ie(K,r);console.log("🟨 Normalized pagination:",A);let re=A.totalPages;!A.totalKnown&&A.images.length<w&&(re=r);const _={...A,totalPages:re};c.current.set(x,_),h(_.images),$(_.total),N(_.totalPages),R(_.hasNextPage),Q(_.totalKnown)}catch(p){p.name!=="AbortError"&&(console.error("Failed to fetch inspiration gallery media:",p),h([]),q("Unable to load inspiration media."))}finally{m.aborted||D(!1)}},[]);l.useEffect(()=>{const t=new AbortController;return te(t.signal),()=>{t.abort()}},[te]),l.useEffect(()=>{const t=new AbortController;return X({categoryId:g,page:i,signal:t.signal}),()=>{t.abort()}},[g,i,X]),l.useEffect(()=>{if(L||!k)return;const t=i+1,r=`${g}-${t}`;if(c.current.has(r))return;const m=new AbortController,j=window.setTimeout(async()=>{try{const x=new URLSearchParams({limit:String(w),page:String(t)});g!=="all"&&x.set("categoryId",String(g));const p=await fetch(`${Y}/inspiration-gallery/images?${x.toString()}`,{signal:m.signal});if(!p.ok)return;const P=await p.json();if(P.success===!1)return;const z=ie(P,t);c.current.set(r,z)}catch(x){x.name!=="AbortError"&&console.warn("Next gallery page preload failed:",x)}},500);return()=>{window.clearTimeout(j),m.abort()}},[g,i,k,L]),l.useEffect(()=>{if(!v)return;const t=document.body.style.overflow,r=document.documentElement.style.overflow;document.body.style.overflow="hidden",document.documentElement.style.overflow="hidden";const m=j=>{j.key==="Escape"&&(F(null),S(!1))};return window.addEventListener("keydown",m),()=>{document.body.style.overflow=t,document.documentElement.style.overflow=r,window.removeEventListener("keydown",m)}},[v]);const ne=l.useCallback(()=>{window.setTimeout(()=>{d.current?.scrollIntoView({behavior:"smooth",block:"start"})},50)},[]),ge=t=>{if(String(t)!==String(g)){if(b(t),C(1),N(1),$(null),R(!1),t==="all")o({});else{const r=s.find(m=>String(m.id)===String(t));r?.name&&o({category:r.name})}ne()}},B=t=>{t<1||t===i||T&&t>y||!T&&t>i&&!k||(C(t),ne())},pe=()=>{const t=`${g}-${i}`;c.current.delete(t);const r=new AbortController;X({categoryId:g,page:i,signal:r.signal,force:!0})},ue=t=>{S(!V(t)),F(t)},M=O(v),W=v?V(v):!1,ae=v?ce(v):"",se=l.useMemo(()=>Me({currentPage:i,totalPages:Math.max(y,k?i+1:i)}),[i,y,k]);return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
            @keyframes galleryShimmer {
              0% {
                transform: translateX(-100%);
              }

              100% {
                transform: translateX(100%);
              }
            }

            @keyframes gallerySpinner {
              to {
                transform: rotate(360deg);
              }
            }

            .gallery-skeleton {
              position: relative;
            }

            .gallery-skeleton::after {
              content: "";
              position: absolute;
              inset: 0;
              transform: translateX(-100%);
              background: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.78),
                transparent
              );
              animation: galleryShimmer 1.4s infinite;
            }

            .gallery-preview-spinner {
              animation: gallerySpinner 0.8s linear infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              .gallery-skeleton::after {
                animation: none;
              }

              .gallery-preview-spinner {
                animation: none;
              }
            }
          `}),e.jsxs("div",{className:"min-h-screen pt-[110px]",children:[e.jsx("section",{children:e.jsxs("div",{className:"mx-auto max-w-[1650px] px-6 xl:px-10",children:[e.jsx("h1",{className:"text-[34px] font-semibold text-[#161412] md:text-[42px]",style:{fontFamily:"Montserrat, sans-serif"},children:"Inspiration Gallery"}),e.jsx("div",{className:"mb-5 mt-3 h-[4px] w-[70px] bg-[#c91f26]"}),e.jsxs("p",{className:"text-[13px] text-[#777]",children:[e.jsx(oe,{to:"/",className:"duration-300 hover:text-[#161412]",children:"Home"})," / ",e.jsx(oe,{to:"/",className:"duration-300 hover:text-[#161412]",children:"Resource Center"})," / ",e.jsx("span",{className:"font-semibold text-[#161412]",children:"Portfolio"})]})]})}),e.jsx("section",{ref:d,className:"scroll-mt-[120px] py-14",children:e.jsxs("div",{className:"mx-auto max-w-[1650px] px-6 xl:px-10",children:[e.jsx("div",{className:`
                  mb-9
                  border-b
                  border-[#e4e4e4]
                  pb-7
                `,children:e.jsxs("div",{className:"flex items-end justify-between gap-6",children:[e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:`
                        mb-4
                        text-[12px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-[#777]
                      `,children:"Filter by application"}),e.jsxs("div",{className:"flex max-w-full gap-2 overflow-x-auto pb-2",children:[me.map(t=>{const r=String(g)===String(t.id);return e.jsx("button",{type:"button",disabled:G,onClick:()=>ge(t.id),className:`
                                shrink-0
                                border
                                px-5
                                py-2.5
                                text-[13px]
                                font-medium
                                transition-all
                                duration-300
                                disabled:opacity-50

                                ${r?"border-[#161412] bg-[#161412] text-white":"border-[#dedede] bg-white text-[#555] hover:border-[#161412] hover:text-[#161412]"}
                              `,children:t.name},t.id)}),G&&s.length===0&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"gallery-skeleton h-[42px] w-[105px] shrink-0 bg-[#eeeeee]"}),e.jsx("div",{className:"gallery-skeleton h-[42px] w-[125px] shrink-0 bg-[#eeeeee]"}),e.jsx("div",{className:"gallery-skeleton h-[42px] w-[110px] shrink-0 bg-[#eeeeee]"})]})]})]}),!L&&I!==null&&e.jsxs("p",{className:`
                          hidden
                          shrink-0
                          pb-2
                          text-[12px]
                          uppercase
                          tracking-[1px]
                          text-[#888]
                          md:block
                        `,children:[I," ","Items"]})]})}),L?e.jsx(Le,{}):H?e.jsx("div",{className:`
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                    border
                    border-[#e5e5e5]
                    bg-[#fafafa]
                    px-6
                  `,children:e.jsxs("div",{className:"max-w-[420px] text-center",children:[e.jsx("div",{className:`
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-[#777]
                        shadow-sm
                      `,children:e.jsx(le,{size:24,"aria-hidden":"true"})}),e.jsx("p",{className:"mt-5 text-[18px] font-semibold text-[#222]",children:"Gallery unavailable"}),e.jsx("p",{className:"mt-2 text-[14px] leading-6 text-[#666]",children:H}),e.jsxs("button",{type:"button",onClick:pe,className:`
                        mx-auto
                        mt-6
                        flex
                        items-center
                        gap-2
                        bg-[#161412]
                        px-6
                        py-3
                        text-[13px]
                        font-medium
                        text-white
                        transition-colors
                        duration-300
                        hover:bg-[#c91f26]
                      `,children:[e.jsx(Ce,{size:16,"aria-hidden":"true"}),"Try Again"]})]})}):u.length>0?e.jsx("div",{className:`
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                  `,children:u.map((t,r)=>e.jsx(de,{media:t,index:r,onClick:ue},t.id||O(t)||`${i}-${r}`))}):e.jsx("div",{className:`
                    flex
                    min-h-[500px]
                    items-center
                    justify-center
                    border
                    border-[#e5e5e5]
                    bg-[#fafafa]
                    px-6
                  `,children:e.jsxs("div",{className:"text-center",children:[e.jsx(le,{size:34,className:"mx-auto text-[#999]","aria-hidden":"true"}),e.jsx("p",{className:"mt-5 text-[18px] font-semibold text-[#222]",children:"No inspiration media found"}),e.jsx("p",{className:"mt-2 text-[14px] text-[#666]",children:"Images and videos for this category will appear here."})]})}),!L&&!H&&u.length>0&&(y>1||i>1||k)&&e.jsxs("div",{className:"mt-16",children:[e.jsxs("div",{className:`
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-2
                      `,children:[e.jsxs("button",{type:"button",onClick:()=>B(i-1),disabled:i===1,className:`
                          mr-2
                          flex
                          h-10
                          items-center
                          gap-2
                          border
                          border-[#dedede]
                          bg-white
                          px-4
                          text-[12px]
                          font-medium
                          uppercase
                          tracking-[0.6px]
                          text-[#333]
                          transition-all
                          duration-300
                          hover:border-black
                          hover:bg-black
                          hover:text-white
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                          disabled:hover:border-[#dedede]
                          disabled:hover:bg-white
                          disabled:hover:text-[#333]
                        `,children:[e.jsx(ye,{size:15}),"Prev"]}),se.map((t,r)=>{const m=se[r-1],j=r>0&&m&&t-m>1;return e.jsxs(xe.Fragment,{children:[j&&e.jsx("span",{className:"px-1 text-[#999]",children:"…"}),e.jsx("button",{type:"button",onClick:()=>B(t),className:`
                                  flex
                                  h-10
                                  min-w-10
                                  items-center
                                  justify-center
                                  border
                                  px-3
                                  text-[13px]
                                  font-medium
                                  transition-all
                                  duration-300

                                  ${i===t?"border-[#161412] bg-[#161412] text-white":"border-[#dedede] bg-white text-[#555] hover:border-[#161412] hover:text-[#161412]"}
                                `,children:t})]},t)}),e.jsxs("button",{type:"button",onClick:()=>B(i+1),disabled:T?i>=y:!k,className:`
                          ml-2
                          flex
                          h-10
                          items-center
                          gap-2
                          border
                          border-[#dedede]
                          bg-white
                          px-4
                          text-[12px]
                          font-medium
                          uppercase
                          tracking-[0.6px]
                          text-[#333]
                          transition-all
                          duration-300
                          hover:border-black
                          hover:bg-black
                          hover:text-white
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                          disabled:hover:border-[#dedede]
                          disabled:hover:bg-white
                          disabled:hover:text-[#333]
                        `,children:["Next",e.jsx(we,{size:15})]})]}),e.jsxs("p",{className:`
                        mt-5
                        text-center
                        text-[11px]
                        uppercase
                        tracking-[1.2px]
                        text-[#999]
                      `,children:["Page"," ",i,T&&y>1&&` of ${y}`]})]})]})})]}),v&&M&&fe.createPortal(e.jsxs("div",{role:"dialog","aria-modal":"true","aria-label":W?"Video preview":"Image preview",className:`
        fixed
        inset-0
        z-[999999]
        flex
        h-[100dvh]
        w-screen
        items-center
        justify-center
        overflow-hidden
        bg-black/90
        p-4
        sm:p-6
        md:p-8
      `,onClick:()=>{F(null),S(!1)},children:[e.jsx("button",{type:"button","aria-label":"Close media preview",onClick:t=>{t.stopPropagation(),F(null),S(!1)},className:`
          absolute
          right-4
          top-4
          z-[60]
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/15
          bg-black/35
          text-white
          shadow-lg
          backdrop-blur-md
          transition-all
          duration-300
          hover:rotate-90
          hover:bg-white
          hover:text-black
          sm:right-6
          sm:top-6
          sm:h-12
          sm:w-12
        `,children:e.jsx(be,{size:24,strokeWidth:1.7,"aria-hidden":"true"})}),e.jsxs("div",{className:`
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
        `,onClick:t=>t.stopPropagation(),children:[!W&&ee&&e.jsxs("div",{className:`
                absolute
                left-1/2
                top-1/2
                z-20
                flex
                -translate-x-1/2
                -translate-y-1/2
                flex-col
                items-center
                justify-center
                gap-3
              `,children:[e.jsx("div",{className:`
                  gallery-preview-spinner
                  h-10
                  w-10
                  rounded-full
                  border-2
                  border-white/25
                  border-t-white
                `}),e.jsx("span",{className:`
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[1.5px]
                  text-white/65
                `,children:"Loading"})]}),W?e.jsx("video",{src:M,"aria-label":ae,controls:!0,autoPlay:!0,playsInline:!0,preload:"auto",controlsList:"nodownload",className:`
              block
              max-h-[calc(100dvh-64px)]
              max-w-[calc(100vw-32px)]
              object-contain
              sm:max-h-[calc(100dvh-80px)]
              sm:max-w-[calc(100vw-48px)]
              md:max-h-[calc(100dvh-96px)]
              md:max-w-[calc(100vw-64px)]
            `,children:"Your browser does not support video playback."},M):e.jsx("img",{src:E(M,2600,92),alt:ae,decoding:"async",fetchPriority:"high",draggable:!1,onLoad:()=>S(!1),onError:()=>S(!1),className:`
              block
              max-h-[calc(100dvh-64px)]
              max-w-[calc(100vw-32px)]
              object-contain
              transition-opacity
              duration-300

              sm:max-h-[calc(100dvh-80px)]
              sm:max-w-[calc(100vw-48px)]

              md:max-h-[calc(100dvh-96px)]
              md:max-w-[calc(100vw-64px)]

              ${ee?"opacity-0":"opacity-100"}
            `},M)]})]}),document.body)]})};export{Re as Gallery,Re as default};
