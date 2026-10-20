import{c as m,u as J,r as l,a as F,j as t,X as Z,S as U}from"./index-TrkQfYJp.js";import{P as s}from"./index-DWVfANWl.js";import{F as b}from"./file-text-B4Sgf9l6.js";import{L as $}from"./loader-circle-DTmMFRGf.js";import{E as ee}from"./external-link-TlSfj7SR.js";const te=[["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",key:"1ksdt3"}],["path",{d:"M22 13a18.15 18.15 0 0 1-20 0",key:"12hx5q"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],re=m("briefcase-business",te);const ae=[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]],se=m("building-2",ae);const ne=[["path",{d:"m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16",key:"9kzy35"}],["path",{d:"M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2",key:"1t0f0t"}],["circle",{cx:"13",cy:"7",r:"1",fill:"currentColor",key:"1obus6"}],["rect",{x:"8",y:"2",width:"14",height:"14",rx:"2",key:"1gvhby"}]],oe=m("images",ne);const le=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],A=m("map-pin",le);const ce=[["path",{d:"M12 22V12",key:"d0xqtd"}],["path",{d:"M20.27 18.27 22 20",key:"er2am"}],["path",{d:"M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559",key:"tok1h1"}],["path",{d:"M3.29 7 12 12l8.71-5",key:"19ckod"}],["path",{d:"m7.5 4.27 8.997 5.148",key:"9yrvtv"}],["circle",{cx:"18.5",cy:"16.5",r:"2.5",key:"ke13xx"}]],v=m("package-search",ce);const ie=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],de=m("users",ie),ue=[{id:"about-us",label:"About Us",path:"/aboutus",type:"Page",keywords:["about","about us","company","ultra stones","experience"],icon:de},{id:"our-process",label:"Our Process",path:"/ourprocess",type:"Page",keywords:["process","our process","stone process","how we work"],icon:b},{id:"online-inventory",label:"Online Inventory",path:"https://ultrastones.stoneprofitsweb.com/",type:"External",external:!0,keywords:["inventory","online inventory","stock","available slabs","online"],icon:v},{id:"material-portfolio",label:"Material Portfolio",path:"/categories",type:"Page",keywords:["materials","material portfolio","portfolio","marble","granite","quartz","quartzite","stone"],icon:v},{id:"merchandising-displays",label:"Merchandising Displays",path:"/merchandising-displays",type:"Resource",keywords:["display","displays","merchandising","sample display","stand"],icon:se},{id:"gallery",label:"Gallery",path:"/gallery",type:"Resource",keywords:["gallery","images","inspiration","applications","renders"],icon:oe},{id:"blogs",label:"Our Blogs",path:"/blogs",type:"Resource",keywords:["blog","blogs","articles","news","information"],icon:b},{id:"ceu",label:"CEU",path:"/ceu",type:"Resource",keywords:["ceu","continuing education","education","course","certificate"],icon:b},{id:"career",label:"Career",path:"/career",type:"Page",keywords:["career","careers","job","jobs","vacancy","hiring","employment"],icon:re},{id:"new-york",label:"New York Location",path:"/locations/new-york",type:"Location",keywords:["new york","ny","farmingdale","long island","showroom"],icon:A},{id:"philadelphia",label:"Philadelphia Location",path:"/locations/philadelphia",type:"Location",keywords:["philadelphia","pa","pennsylvania","warehouse","showroom"],icon:A},{id:"contact",label:"Contact",path:"/contact",type:"Page",keywords:["contact","contact us","call","email","message","support"],icon:b}],z=(y="")=>String(y).toLowerCase().trim().replace(/[-_/]+/g," ").replace(/\s+/g," "),V=y=>{const d=String(y||"").toLowerCase();return d==="product"||d==="material"||d==="collection"||d==="category"?v:d==="location"||d==="showroom"?A:d==="resource"?b:b},pe=({materials:y=[],mobile:d=!1,isLightNavbar:C=!1,expanded:L=!1,desktopModal:g=!1,onResultClick:T})=>{const G=J(),R=l.useRef(null),j=l.useRef(null),M=l.useRef(null);l.useEffect(()=>{const e=window.setTimeout(()=>{j.current?.focus()},50);return()=>{window.clearTimeout(e)}},[]);const[u,P]=l.useState(""),[q,k]=l.useState([]),[I,x]=l.useState(!1),[N,S]=l.useState(!1),[O,w]=l.useState(""),[p,f]=l.useState(-1),B=l.useMemo(()=>{const e=y.filter(r=>r?.name&&r?.slug&&r?.is_active!==!1).map(r=>{const a=r.parent_id===null||r.parent_id===void 0;return{id:`local-material-${r.id}`,label:r.name,path:`/product-category/${r.slug}`,type:a?"Material":"Collection",keywords:[r.name,r.slug,r.description,r.short_description,a?"material category stone":"collection subcategory stone"].filter(Boolean),image:r.thumbnail_url||null,icon:v,displayOrder:r.display_order??999,score:0}});return[...ue,...e]},[y]);l.useEffect(()=>{const e=u.trim();if(e.length<2){k([]),S(!1),w("");return}const r=new AbortController,a=window.setTimeout(async()=>{try{S(!0),w("");const h=(await F.get("https://backend.ultrastones.com/api/search",{params:{q:e,limit:15},signal:r.signal})).data?.data?.results;if(Array.isArray(h)){const i=h.filter(o=>o?.label&&o?.path).map((o,_)=>({...o,id:o.id||`api-result-${o.type}-${o.path}-${_}`,icon:V(o.type),external:o.external===!0||String(o.path).startsWith("http"),score:Number(o.score)||0}));k(i)}else k([])}catch(c){c.name==="CanceledError"||c.code==="ERR_CANCELED"||F.isCancel(c)||(console.error("Global search failed:",c),k([]),w("Unable to load product search results."))}finally{r.signal.aborted||S(!1)}},300);return()=>{window.clearTimeout(a),r.abort()}},[u]);const D=l.useMemo(()=>{const e=z(u);if(!e)return[];const r=e.split(" ").filter(Boolean);return B.map(a=>{const c=z(a.label),h=z((a.keywords||[]).join(" "));let i=0;return c===e&&(i+=200),c.startsWith(e)&&(i+=140),c.includes(e)&&(i+=100),h.includes(e)&&(i+=50),r.forEach(o=>{c.startsWith(o)&&(i+=30),c.includes(o)&&(i+=20),h.includes(o)&&(i+=10)}),{...a,score:i}}).filter(a=>a.score>0)},[u,B]),n=l.useMemo(()=>{if(!u.trim())return[];const e=[...q,...D];return Array.from(new Map(e.map(a=>[`${String(a.type).toLowerCase()}-${a.path}`,a])).values()).sort((a,c)=>{const h=Number(a.score)||0,i=Number(c.score)||0;if(i!==h)return i-h;const o=a.displayOrder??999,_=c.displayOrder??999;return o!==_?o-_:String(a.label).localeCompare(String(c.label))}).slice(0,15)},[u,q,D]);l.useEffect(()=>{const e=r=>{R.current&&!R.current.contains(r.target)&&(x(!1),f(-1))};return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},[]),l.useEffect(()=>{f(-1)},[u]),l.useEffect(()=>{p>=n.length&&f(-1)},[p,n.length]),l.useEffect(()=>{if(p<0||!M.current)return;M.current.querySelector(`[data-search-index="${p}"]`)?.scrollIntoView({block:"nearest"})},[p]);const W=()=>{P(""),k([]),w(""),S(!1),x(!1),f(-1)},K=()=>{W(),window.requestAnimationFrame(()=>{j.current?.focus()})},E=e=>{if(!e?.path)return;e.external===!0||String(e.path).startsWith("http")?window.open(e.path,"_blank","noopener,noreferrer"):G(e.path),W(),T&&T(e)},Q=e=>{if(e.preventDefault(),!!u.trim()){if(p>=0&&n[p]){E(n[p]);return}if(n.length===1){E(n[0]);return}x(!0)}},H=e=>{if(e.key==="Escape"){x(!1),f(-1),j.current?.blur();return}if(e.key==="ArrowDown"){if(e.preventDefault(),x(!0),!n.length)return;f(r=>r>=n.length-1?0:r+1);return}if(e.key==="ArrowUp"){if(e.preventDefault(),x(!0),!n.length)return;f(r=>r<=0?n.length-1:r-1);return}e.key==="Enter"&&p>=0&&n[p]&&(e.preventDefault(),E(n[p]))},X=u.trim().length>0&&!N&&n.length===0,Y=d||L||g;return t.jsxs("div",{ref:R,className:`
        relative
        ${Y?"w-full max-w-none":"w-full max-w-[320px]"}
      `,children:[t.jsx("form",{onSubmit:Q,role:"search",className:"w-full",children:t.jsxs("div",{className:"relative w-full",children:[t.jsx("input",{ref:j,type:"text",value:u,placeholder:"Search Website",autoComplete:"off","aria-label":"Search the Ultra Stones website","aria-expanded":I,"aria-controls":"global-search-results",onChange:e=>{const r=e.target.value;P(r),w(""),x(!!r.trim())},onFocus:()=>{u.trim()&&x(!0)},onKeyDown:H,className:`
              w-full border outline-none
              transition-all duration-300
              ${d?`
                    h-[48px]
                    rounded-md
                    border-white/15
                    bg-white/10
                    px-4 pr-20
                    text-sm text-white
                    placeholder:text-white/50
                  `:g?`
                      h-[52px]
                      rounded-xl
                      border-black/20
                      bg-white
                      px-5 pr-24
                      text-[14px]
                      text-black
                      placeholder:text-black/40
                      focus:border-black/45
                      focus:ring-2
                      focus:ring-black/[0.04]
                    `:C?`
                        h-11 rounded-md
                        border-gray-300
                        bg-white
                        px-4 pr-20
                        text-[12px]
                        text-black
                        placeholder:text-gray-500
                        focus:border-gray-500
                      `:`
                        h-11 rounded-md
                        border-white/20
                        bg-white/10
                        px-4 pr-20
                        text-[12px]
                        text-white
                        placeholder:text-white/60
                        focus:border-white/40
                        focus:bg-white/15
                      `}
            `}),u&&t.jsx("button",{type:"button","aria-label":"Clear search",onClick:K,className:`
                absolute right-11 top-1/2
                flex h-9 w-9
                -translate-y-1/2
                items-center justify-center
                transition-colors
                ${d||!C&&!g?`
                      text-white/60
                      hover:text-white
                    `:`
                      text-gray-400
                      hover:text-black
                    `}
              `,children:t.jsx(Z,{size:15,"aria-hidden":"true"})}),t.jsx("button",{type:"submit","aria-label":"Search website",className:`
              absolute right-1 top-1/2
              flex h-10 w-10
              -translate-y-1/2
              items-center justify-center
              rounded-full
              transition-colors
              ${d||!C&&!g?`
                    text-white/80
                    hover:bg-white/10
                    hover:text-white
                  `:`
                    text-black/70
                    hover:bg-black/[0.05]
                    hover:text-black
                  `}
            `,children:N?t.jsx($,{size:17,className:"animate-spin","aria-hidden":"true"}):t.jsx(U,{size:17,"aria-hidden":"true"})})]})}),I&&t.jsxs("div",{id:"global-search-results",className:`
            z-[300]
            overflow-hidden
            rounded-xl
            border border-black/10
            bg-white text-black
            shadow-[0_24px_70px_rgba(0,0,0,0.22)]
            ${d?`
                  relative mt-3
                  w-full
                `:g||L?`
                    absolute
                    left-0 right-0
                    top-[calc(100%+10px)]
                    w-full max-w-none
                  `:`
                    absolute right-0
                    top-[54px]
                    w-[390px]
                  `}
          `,children:[O&&t.jsx("div",{className:`
                border-b border-red-100
                bg-red-50 px-4 py-3
              `,children:t.jsx("p",{className:"text-xs text-red-600",children:O})}),u.trim().length===1&&t.jsx("div",{className:`
                border-b border-black/10
                px-4 py-2.5
              `,children:t.jsx("p",{className:`
                  text-[10px]
                  tracking-[0.7px]
                  text-black/40
                `,children:"Type one more character to search products."})}),n.length>0&&t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:`
                  flex items-center
                  justify-between
                  border-b border-black/10
                  px-4 py-3
                `,children:[t.jsxs("p",{className:`
                    text-[11px] uppercase
                    tracking-[1.5px]
                    text-black/45
                  `,children:[n.length," ",n.length===1?"result":"results"," ","found"]}),N&&t.jsxs("div",{className:`
                      flex items-center gap-1.5
                      text-black/40
                    `,children:[t.jsx($,{size:13,className:"animate-spin"}),t.jsx("span",{className:`
                        text-[10px] uppercase
                        tracking-[1px]
                      `,children:"Searching"})]})]}),t.jsx("div",{ref:M,className:`
                  max-h-[420px]
                  overflow-y-auto p-2
                `,children:n.map((e,r)=>{const a=e.icon||V(e.type),c=p===r,h=e.external===!0||String(e.path).startsWith("http");return t.jsxs("button",{type:"button","data-search-index":r,onMouseEnter:()=>f(r),onClick:()=>E(e),className:`
                          flex w-full
                          items-center gap-3
                          rounded-lg
                          px-3 py-3
                          text-left
                          transition-colors
                          ${c?"bg-[#f2f2f2]":"hover:bg-[#f7f7f7]"}
                        `,children:[t.jsx("div",{className:`
                            flex h-11 w-11
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-lg
                            bg-black/5
                          `,children:e.image?t.jsx("img",{src:e.image,alt:e.label,loading:"lazy",className:`
                                h-full w-full
                                object-cover
                              `,onError:i=>{i.currentTarget.style.display="none"}}):t.jsx(a,{size:18,className:"text-black/55","aria-hidden":"true"})}),t.jsxs("div",{className:"min-w-0 flex-1",children:[t.jsx("p",{className:`
                              truncate text-[14px]
                              font-medium
                              text-black
                            `,children:e.label}),t.jsxs("div",{className:`
                              mt-0.5 flex
                              items-center gap-2
                            `,children:[t.jsx("p",{className:`
                                text-[11px]
                                uppercase
                                tracking-[1px]
                                text-black/45
                              `,children:e.type}),e.category_name&&t.jsxs(t.Fragment,{children:[t.jsx("span",{className:"text-black/20",children:"•"}),t.jsx("p",{className:`
                                    truncate
                                    text-[11px]
                                    text-black/40
                                  `,children:e.category_name})]})]})]}),h?t.jsx(ee,{size:15,className:`
                              shrink-0
                              text-black/35
                            `,"aria-hidden":"true"}):t.jsx("span",{className:`
                              shrink-0
                              text-black/35
                            `,"aria-hidden":"true",children:"→"})]},e.id||`${e.type}-${e.path}`)})})]}),N&&n.length===0&&t.jsxs("div",{className:`
                  flex items-center
                  justify-center gap-3
                  px-6 py-9
                `,children:[t.jsx($,{size:20,className:`
                    animate-spin
                    text-black/35
                  `}),t.jsx("p",{className:"text-sm text-black/50",children:"Searching products and materials..."})]}),X&&t.jsxs("div",{className:"px-6 py-8 text-center",children:[t.jsx(U,{size:24,className:`
                  mx-auto
                  text-black/25
                `,"aria-hidden":"true"}),t.jsx("p",{className:`
                  mt-3 text-sm
                  font-medium text-black
                `,children:"No results found"}),t.jsx("p",{className:`
                  mt-1 text-xs
                  leading-relaxed
                  text-black/50
                `,children:"Try searching for a page, product, material, collection, or location."})]})]})]})};pe.propTypes={materials:s.arrayOf(s.shape({id:s.oneOfType([s.string,s.number]),name:s.string,slug:s.string,description:s.string,short_description:s.string,thumbnail_url:s.string,parent_id:s.oneOfType([s.string,s.number]),display_order:s.number,is_active:s.bool})),isLightNavbar:s.bool,mobile:s.bool,expanded:s.bool,desktopModal:s.bool,onResultClick:s.func};export{pe as default};
