import{c as g,u as Z,r as i,a as U,j as r,X as ee,S as V}from"./index-Bn3LZPnQ.js";import{P as s}from"./index-WJ1zjaBk.js";import{F as b}from"./file-text-BG2dA_r6.js";import{L as z}from"./loader-circle-B-D9Zs_B.js";import{E as te}from"./external-link-BpNV_sny.js";const re=[["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",key:"1ksdt3"}],["path",{d:"M22 13a18.15 18.15 0 0 1-20 0",key:"12hx5q"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],ae=g("briefcase-business",re);const se=[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]],ne=g("building-2",se);const oe=[["path",{d:"m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16",key:"9kzy35"}],["path",{d:"M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2",key:"1t0f0t"}],["circle",{cx:"13",cy:"7",r:"1",fill:"currentColor",key:"1obus6"}],["rect",{x:"8",y:"2",width:"14",height:"14",rx:"2",key:"1gvhby"}]],le=g("images",oe);const ie=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],L=g("map-pin",ie);const ce=[["path",{d:"M12 22V12",key:"d0xqtd"}],["path",{d:"M20.27 18.27 22 20",key:"er2am"}],["path",{d:"M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559",key:"tok1h1"}],["path",{d:"M3.29 7 12 12l8.71-5",key:"19ckod"}],["path",{d:"m7.5 4.27 8.997 5.148",key:"9yrvtv"}],["circle",{cx:"18.5",cy:"16.5",r:"2.5",key:"ke13xx"}]],w=g("package-search",ce);const de=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],ue=g("users",de),pe=[{id:"about-us",label:"About Us",path:"/aboutus",type:"Page",keywords:["about","about us","company","ultra stones","experience"],icon:ue},{id:"our-process",label:"Our Process",path:"/ourprocess",type:"Page",keywords:["process","our process","stone process","how we work"],icon:b},{id:"online-inventory",label:"Online Inventory",path:"https://ultrastones.stoneprofitsweb.com/",type:"External",external:!0,keywords:["inventory","online inventory","stock","available slabs","online"],icon:w},{id:"material-portfolio",label:"Material Portfolio",path:"/categories",type:"Page",keywords:["materials","material portfolio","portfolio","marble","granite","quartz","quartzite","stone"],icon:w},{id:"merchandising-displays",label:"Merchandising Displays",path:"/merchandising-displays",type:"Resource",keywords:["display","displays","merchandising","sample display","stand"],icon:ne},{id:"gallery",label:"Gallery",path:"/gallery",type:"Resource",keywords:["gallery","images","inspiration","applications","renders"],icon:le},{id:"blogs",label:"Our Blogs",path:"/blogs",type:"Resource",keywords:["blog","blogs","articles","news","information"],icon:b},{id:"ceu",label:"CEU",path:"/ceu",type:"Resource",keywords:["ceu","continuing education","education","course","certificate"],icon:b},{id:"career",label:"Career",path:"/career",type:"Page",keywords:["career","careers","job","jobs","vacancy","hiring","employment"],icon:ae},{id:"new-york",label:"New York Location",path:"/locations/new-york",type:"Location",keywords:["new york","ny","farmingdale","long island","showroom"],icon:L},{id:"philadelphia",label:"Philadelphia Location",path:"/locations/philadelphia",type:"Location",keywords:["philadelphia","pa","pennsylvania","warehouse","showroom"],icon:L},{id:"contact",label:"Contact",path:"/contact",type:"Page",keywords:["contact","contact us","call","email","message","support"],icon:b}],A=(y="")=>String(y).toLowerCase().trim().replace(/[-_/]+/g," ").replace(/\s+/g," "),G=y=>{const d=String(y||"").toLowerCase();return d==="product"||d==="material"||d==="collection"||d==="category"?w:d==="location"||d==="showroom"?L:d==="resource"?b:b},he=({materials:y=[],mobile:d=!1,isLightNavbar:E=!1,expanded:T=!1,desktopModal:m=!1,onResultClick:P})=>{const K=Z(),C=i.useRef(null),v=i.useRef(null),R=i.useRef(null);i.useEffect(()=>{const e=window.setTimeout(()=>{v.current?.focus()},50);return()=>{window.clearTimeout(e)}},[]);const[u,q]=i.useState(""),[I,k]=i.useState([]),[O,x]=i.useState(!1),[j,M]=i.useState(!1),[B,N]=i.useState(""),[$,f]=i.useState(-1),D=i.useMemo(()=>{const e=y.filter(t=>t?.name&&t?.slug&&t?.is_active!==!1).map(t=>{const a=t.parent_id===null||t.parent_id===void 0;return{id:`local-material-${t.id}`,label:t.name,path:`/product-category/${t.slug}`,type:a?"Material":"Collection",keywords:[t.name,t.slug,t.description,t.short_description,a?"material category stone":"collection subcategory stone"].filter(Boolean),image:t.thumbnail_url||null,icon:w,displayOrder:t.display_order??999,score:0}});return[...pe,...e]},[y]);i.useEffect(()=>{const e=u.trim();if(e.length<2)return;const t=new AbortController,a=window.setTimeout(async()=>{try{N("");const o=await U.get("https://backend.ultrastones.com/api/search",{params:{q:e,limit:15},signal:t.signal});if(t.signal.aborted)return;const p=o.data?.data?.results;if(Array.isArray(p)){const c=p.filter(l=>l?.label&&l?.path).map((l,_)=>({...l,id:l.id||`api-result-${l.type}-${l.path}-${_}`,icon:G(l.type),external:l.external===!0||String(l.path).startsWith("http"),score:Number(l.score)||0}));k(c)}else k([])}catch(o){!(o.name==="CanceledError"||o.code==="ERR_CANCELED"||U.isCancel(o))&&!t.signal.aborted&&(console.error("Global search failed:",o),k([]),N("Unable to load product search results."))}finally{t.signal.aborted||M(!1)}},300);return()=>{window.clearTimeout(a),t.abort()}},[u]);const W=i.useMemo(()=>{const e=A(u);if(!e)return[];const t=e.split(" ").filter(Boolean);return D.map(a=>{const o=A(a.label),p=A((a.keywords||[]).join(" "));let c=0;return o===e&&(c+=200),o.startsWith(e)&&(c+=140),o.includes(e)&&(c+=100),p.includes(e)&&(c+=50),t.forEach(l=>{o.startsWith(l)&&(c+=30),o.includes(l)&&(c+=20),p.includes(l)&&(c+=10)}),{...a,score:c}}).filter(a=>a.score>0)},[u,D]),n=i.useMemo(()=>{if(!u.trim())return[];const e=[...I,...W];return Array.from(new Map(e.map(a=>[`${String(a.type).toLowerCase()}-${a.path}`,a])).values()).sort((a,o)=>{const p=Number(a.score)||0,c=Number(o.score)||0;if(c!==p)return c-p;const l=a.displayOrder??999,_=o.displayOrder??999;return l!==_?l-_:String(a.label).localeCompare(String(o.label))}).slice(0,15)},[u,I,W]),h=$>=0&&$<n.length?$:-1;i.useEffect(()=>{const e=t=>{C.current&&!C.current.contains(t.target)&&(x(!1),f(-1))};return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},[]),i.useEffect(()=>{if(h<0||!R.current)return;R.current.querySelector(`[data-search-index="${h}"]`)?.scrollIntoView({block:"nearest"})},[h]);const F=()=>{q(""),k([]),N(""),M(!1),x(!1),f(-1)},Q=()=>{F(),window.requestAnimationFrame(()=>{v.current?.focus()})},S=e=>{if(!e?.path)return;e.external===!0||String(e.path).startsWith("http")?window.open(e.path,"_blank","noopener,noreferrer"):K(e.path),F(),P&&P(e)},H=e=>{if(e.preventDefault(),!!u.trim()){if(h>=0&&n[h]){S(n[h]);return}if(n.length===1){S(n[0]);return}x(!0)}},X=e=>{if(e.key==="Escape"){x(!1),f(-1),v.current?.blur();return}if(e.key==="ArrowDown"){if(e.preventDefault(),x(!0),!n.length)return;f(t=>{const a=t>=0&&t<n.length?t:-1;return a>=n.length-1?0:a+1});return}if(e.key==="ArrowUp"){if(e.preventDefault(),x(!0),!n.length)return;f(t=>{const a=t>=0&&t<n.length?t:-1;return a<=0?n.length-1:a-1});return}e.key==="Enter"&&h>=0&&n[h]&&(e.preventDefault(),S(n[h]))},Y=u.trim().length>0&&!j&&n.length===0,J=d||T||m;return r.jsxs("div",{ref:C,className:`
        relative
        ${J?"w-full max-w-none":"w-full max-w-[320px]"}
      `,children:[r.jsx("form",{onSubmit:H,role:"search",className:"w-full",children:r.jsxs("div",{className:"relative w-full",children:[r.jsx("input",{ref:v,type:"text",value:u,placeholder:"Search Website",autoComplete:"off","aria-label":"Search the Ultra Stones website","aria-expanded":O,"aria-controls":"global-search-results",onChange:e=>{const t=e.target.value;q(t),f(-1),k([]),N(""),M(t.trim().length>=2),x(!!t.trim())},onFocus:()=>{u.trim()&&x(!0)},onKeyDown:X,className:`
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
                  `:m?`
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
                    `:E?`
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
            `}),u&&r.jsx("button",{type:"button","aria-label":"Clear search",onClick:Q,className:`
                absolute right-11 top-1/2
                flex h-9 w-9
                -translate-y-1/2
                items-center justify-center
                transition-colors
                ${d||!E&&!m?`
                      text-white/60
                      hover:text-white
                    `:`
                      text-gray-400
                      hover:text-black
                    `}
              `,children:r.jsx(ee,{size:15,"aria-hidden":"true"})}),r.jsx("button",{type:"submit","aria-label":"Search website",className:`
              absolute right-1 top-1/2
              flex h-10 w-10
              -translate-y-1/2
              items-center justify-center
              rounded-full
              transition-colors
              ${d||!E&&!m?`
                    text-white/80
                    hover:bg-white/10
                    hover:text-white
                  `:`
                    text-black/70
                    hover:bg-black/[0.05]
                    hover:text-black
                  `}
            `,children:j?r.jsx(z,{size:17,className:"animate-spin","aria-hidden":"true"}):r.jsx(V,{size:17,"aria-hidden":"true"})})]})}),O&&r.jsxs("div",{id:"global-search-results",className:`
            z-[300]
            overflow-hidden
            rounded-xl
            border border-black/10
            bg-white text-black
            shadow-[0_24px_70px_rgba(0,0,0,0.22)]
            ${d?`
                  relative mt-3
                  w-full
                `:m||T?`
                    absolute
                    left-0 right-0
                    top-[calc(100%+10px)]
                    w-full max-w-none
                  `:`
                    absolute right-0
                    top-[54px]
                    w-[390px]
                  `}
          `,children:[B&&r.jsx("div",{className:`
                border-b border-red-100
                bg-red-50 px-4 py-3
              `,children:r.jsx("p",{className:"text-xs text-red-600",children:B})}),u.trim().length===1&&r.jsx("div",{className:`
                border-b border-black/10
                px-4 py-2.5
              `,children:r.jsx("p",{className:`
                  text-[10px]
                  tracking-[0.7px]
                  text-black/40
                `,children:"Type one more character to search products."})}),n.length>0&&r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:`
                  flex items-center
                  justify-between
                  border-b border-black/10
                  px-4 py-3
                `,children:[r.jsxs("p",{className:`
                    text-[11px] uppercase
                    tracking-[1.5px]
                    text-black/45
                  `,children:[n.length," ",n.length===1?"result":"results"," ","found"]}),j&&r.jsxs("div",{className:`
                      flex items-center gap-1.5
                      text-black/40
                    `,children:[r.jsx(z,{size:13,className:"animate-spin"}),r.jsx("span",{className:`
                        text-[10px] uppercase
                        tracking-[1px]
                      `,children:"Searching"})]})]}),r.jsx("div",{ref:R,className:`
                  max-h-[420px]
                  overflow-y-auto p-2
                `,children:n.map((e,t)=>{const a=e.icon||G(e.type),o=h===t,p=e.external===!0||String(e.path).startsWith("http");return r.jsxs("button",{type:"button","data-search-index":t,onMouseEnter:()=>f(t),onClick:()=>S(e),className:`
                          flex w-full
                          items-center gap-3
                          rounded-lg
                          px-3 py-3
                          text-left
                          transition-colors
                          ${o?"bg-[#f2f2f2]":"hover:bg-[#f7f7f7]"}
                        `,children:[r.jsx("div",{className:`
                            flex h-11 w-11
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-lg
                            bg-black/5
                          `,children:e.image?r.jsx("img",{src:e.image,alt:e.label,loading:"lazy",className:`
                                h-full w-full
                                object-cover
                              `,onError:c=>{c.currentTarget.style.display="none"}}):r.jsx(a,{size:18,className:"text-black/55","aria-hidden":"true"})}),r.jsxs("div",{className:"min-w-0 flex-1",children:[r.jsx("p",{className:`
                              truncate text-[14px]
                              font-medium
                              text-black
                            `,children:e.label}),r.jsxs("div",{className:`
                              mt-0.5 flex
                              items-center gap-2
                            `,children:[r.jsx("p",{className:`
                                text-[11px]
                                uppercase
                                tracking-[1px]
                                text-black/45
                              `,children:e.type}),e.category_name&&r.jsxs(r.Fragment,{children:[r.jsx("span",{className:"text-black/20",children:"•"}),r.jsx("p",{className:`
                                    truncate
                                    text-[11px]
                                    text-black/40
                                  `,children:e.category_name})]})]})]}),p?r.jsx(te,{size:15,className:`
                              shrink-0
                              text-black/35
                            `,"aria-hidden":"true"}):r.jsx("span",{className:`
                              shrink-0
                              text-black/35
                            `,"aria-hidden":"true",children:"→"})]},e.id||`${e.type}-${e.path}`)})})]}),j&&n.length===0&&r.jsxs("div",{className:`
                  flex items-center
                  justify-center gap-3
                  px-6 py-9
                `,children:[r.jsx(z,{size:20,className:`
                    animate-spin
                    text-black/35
                  `}),r.jsx("p",{className:"text-sm text-black/50",children:"Searching products and materials..."})]}),Y&&r.jsxs("div",{className:"px-6 py-8 text-center",children:[r.jsx(V,{size:24,className:`
                  mx-auto
                  text-black/25
                `,"aria-hidden":"true"}),r.jsx("p",{className:`
                  mt-3 text-sm
                  font-medium text-black
                `,children:"No results found"}),r.jsx("p",{className:`
                  mt-1 text-xs
                  leading-relaxed
                  text-black/50
                `,children:"Try searching for a page, product, material, collection, or location."})]})]})]})};he.propTypes={materials:s.arrayOf(s.shape({id:s.oneOfType([s.string,s.number]),name:s.string,slug:s.string,description:s.string,short_description:s.string,thumbnail_url:s.string,parent_id:s.oneOfType([s.string,s.number]),display_order:s.number,is_active:s.bool})),isLightNavbar:s.bool,mobile:s.bool,expanded:s.bool,desktopModal:s.bool,onResultClick:s.func};export{he as default};
