const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/html2pdf-D39d-C3i.js","assets/index-CrLirBdQ.js","assets/index-D3D_eyqj.css"])))=>i.map(i=>d[i]);
import{d as J,r as i,h as K,j as e,c as X,L,A as D,a as T,C as Y,g as ee,_ as te}from"./index-CrLirBdQ.js";import se from"./purify.es-DlXLPG5w.js";import{A as ae}from"./arrow-left-CO0qACro.js";import{F as W}from"./file-text-mLeiFQ1I.js";import{D as ne}from"./download-C9mtZzW6.js";import{E as re}from"./external-link-B_tbiTiX.js";const oe=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],ie=J("folder-open",oe),z="http://localhost:5001/api".replace(/\/+$/,""),F=z.endsWith("/api")?z:`${z}/api`,le=F.replace(/\/api\/?$/,""),S=[{id:"all",label:"All Resources"},{id:"care",label:"Care & Maintenance"},{id:"warranty",label:"Warranty"},{id:"faq",label:"FAQ"}],I=t=>[t,t?.data,t?.data?.data,t?.data?.resources,t?.data?.data?.resources,t?.resources,t?.categories,t?.data?.categories].find(Array.isArray)||[],O=t=>t===!0||t===1||t==="1"||t==="true",ce=(t="")=>String(t).split(" ").filter(Boolean).map(s=>s.charAt(0)).join("").slice(0,2).toUpperCase(),q=t=>{if(!t||typeof t!="string")return"";const s=t.trim();return/^https?:\/\//i.test(s)?s:s.startsWith("//")?`https:${s}`:/^[a-z][a-z0-9+.-]*:/i.test(s)?"":`${le}${s.startsWith("/")?"":"/"}${s}`},de=t=>{if(!t)return null;const s=String(t).trim().toLowerCase().replace(/[_-]+/g," ").replace(/\s+/g," ");return["care","care maintenance","care and maintenance","care & maintenance","maintenance"].includes(s)?"care":["warranty","warranties","warrenty"].includes(s)?"warranty":["faq","faqs","frequently asked questions"].includes(s)?"faq":null},R=t=>{const s=[t.resource_category,t.resource_category_name,t.document_category,t.document_type,t.resource_group,t.resource_section,t.section,t.category_type,t.type_name,t.filter_type,t.resource_subtype];for(const a of s){const r=a&&typeof a=="object"?a.name||a.slug||a.code:a,o=de(r);if(o)return o}return null},M=t=>S.find(s=>s.id===R(t))?.label||"Other Documents",xe=(t,s)=>t.slug==="ultra-quartz"?-1:s.slug==="ultra-quartz"||t.slug==="atlas-plan"?1:s.slug==="atlas-plan"?-1:String(t.name).localeCompare(String(s.name),void 0,{sensitivity:"base"}),pe=(t,s)=>Number(t.display_order||0)-Number(s.display_order||0)||String(t.title||"").localeCompare(String(s.title||"")),H=(t="Ultra-Stones-Resource")=>String(t).trim().replace(/[^a-zA-Z0-9\s-]/g,"").replace(/\s+/g,"-").slice(0,100)||"Ultra-Stones-Resource",B=(t="")=>se.sanitize(String(t||""),{USE_PROFILES:{html:!0}}),C=(t,s,a="")=>{const r=document.createElement(t);return r.textContent=String(s||""),r.style.cssText=a,r},me=async t=>{const s=(await te(async()=>{const{default:N}=await import("./html2pdf-D39d-C3i.js").then(y=>y.h);return{default:N}},__vite__mapDeps([0,1,2]))).default,a=document.createElement("div");a.style.cssText=`
    width: 720px;
    padding: 42px;
    box-sizing: border-box;
    background: #ffffff;
    color: #222222;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    line-height: 1.75;
    overflow-wrap: anywhere;
  `;const r=document.createElement("div");r.style.cssText=`
    border-bottom: 3px solid #c91f26;
    padding-bottom: 20px;
    margin-bottom: 32px;
  `;const o=C("div","ULTRA STONES",`
      font-size: 25px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #181818;
    `),l=C("div","RESOURCE CENTER",`
      margin-top: 5px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 2px;
      color: #777777;
    `);r.append(o,l);const p=C("div",M(t).toUpperCase(),`
      margin-bottom: 12px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.4px;
      color: #c91f26;
    `),g=C("h1",t.title||"Resource Document",`
      margin: 0 0 18px;
      font-size: 26px;
      font-weight: 700;
      line-height: 1.3;
      color: #181818;
    `),b=C("p",t.description||"",`
      margin: 0 0 26px;
      font-size: 13px;
      line-height: 1.8;
      color: #666666;
    `),m=document.createElement("div");m.innerHTML=B(t.content||""),m.style.cssText=`
    font-size: 13px;
    line-height: 1.85;
    color: #333333;
    overflow-wrap: anywhere;
  `;const w=C("div","ULTRA STONES  |  www.ultrastones.com",`
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #dddddd;
      font-size: 10px;
      color: #888888;
      letter-spacing: 0.4px;
    `);a.append(r,p,g),t.description&&a.appendChild(b),a.append(m,w);const v=document.createElement("style");v.textContent=`
    .ultra-resource-pdf h1,
    .ultra-resource-pdf h2,
    .ultra-resource-pdf h3,
    .ultra-resource-pdf h4 {
      color: #222222;
      font-weight: 700;
      line-height: 1.4;
      break-after: avoid;
      page-break-after: avoid;
    }

    .ultra-resource-pdf h2 {
      font-size: 19px;
      margin: 24px 0 12px;
    }

    .ultra-resource-pdf h3 {
      font-size: 16px;
      margin: 20px 0 10px;
    }

    .ultra-resource-pdf p {
      margin: 0 0 14px;
    }

    .ultra-resource-pdf ul,
    .ultra-resource-pdf ol {
      margin: 10px 0 18px;
      padding-left: 25px;
    }

    .ultra-resource-pdf li {
      margin-bottom: 8px;
    }

    .ultra-resource-pdf strong,
    .ultra-resource-pdf b {
      font-weight: 700;
    }

    .ultra-resource-pdf a {
      color: #c91f26;
      text-decoration: underline;
    }

    .ultra-resource-pdf table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12px;
    }

    .ultra-resource-pdf th,
    .ultra-resource-pdf td {
      border: 1px solid #dddddd;
      padding: 9px;
      text-align: left;
    }

    .ultra-resource-pdf th {
      background: #f2f2f2;
      font-weight: 700;
    }

    .ultra-resource-pdf img {
      max-width: 100%;
      height: auto;
    }

    .ultra-resource-pdf tr,
    .ultra-resource-pdf img {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `,a.className="ultra-resource-pdf";const u=document.createElement("div");u.style.cssText=`
    position: fixed;
    left: -10000px;
    top: 0;
    width: 720px;
    z-index: -1;
    pointer-events: none;
  `,u.append(v,a),document.body.appendChild(u);const f={margin:[12,12,12,12],filename:`${H(t.title)}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,backgroundColor:"#ffffff",windowWidth:900},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},pagebreak:{mode:["css","legacy"],avoid:["tr","img","h2","h3"]}};try{await document.fonts.ready,await s().set(f).from(a).save()}finally{u.remove()}},ue=async t=>{const s=q(t.file_url);if(!s)throw new Error("PDF file is unavailable.");const a=await fetch(s);if(!a.ok)throw new Error("Unable to download PDF.");const r=await a.blob(),o=URL.createObjectURL(r);try{const l=document.createElement("a");l.href=o,l.download=`${H(t.title)}.pdf`,document.body.appendChild(l),l.click(),l.remove()}finally{setTimeout(()=>{URL.revokeObjectURL(o)},1e3)}};function fe({category:t}){const s=t.thumbnail_url||t.banner_url||null,a=s?ee(s,1200,85):null,[r,o]=i.useState(!1);return i.useEffect(()=>{o(!1)},[a]),e.jsx("div",{className:"relative aspect-[4/5] w-full overflow-hidden bg-[#efefef]",children:a&&!r?e.jsx("img",{src:a,alt:t.name,loading:"lazy",decoding:"async",draggable:!1,onError:()=>o(!0),className:"h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]"}):e.jsx("div",{className:"flex h-full items-center justify-center bg-neutral-200 text-5xl font-semibold text-[#777]",children:ce(t.name)})})}function he({resources:t}){const s=S.filter(r=>r.id!=="all"&&t.some(o=>R(o)===r.id)),a=t.some(r=>!R(r));return e.jsxs("div",{className:"mt-3 flex flex-wrap gap-1.5",children:[s.map(r=>e.jsx("span",{className:"border border-[#dedede] bg-white px-2 py-[5px] text-[10px] font-medium leading-tight text-[#555] transition-colors group-hover:border-[#c91f26]",children:r.label},r.id)),a&&e.jsx("span",{className:"border border-[#dedede] bg-white px-2 py-[5px] text-[10px] font-medium text-[#555]",children:"Other Documents"})]})}function ge({category:t,categoryResources:s,onClick:a}){return e.jsxs("button",{type:"button",onClick:a,className:"group w-full cursor-pointer text-left",children:[e.jsx(fe,{category:t}),e.jsxs("div",{className:"border-b border-[#e5e5e5] py-5 transition-colors group-hover:border-[#c91f26]",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsx("h2",{className:"text-[18px] font-semibold text-[#161412]",children:t.name}),e.jsx(D,{size:20,strokeWidth:1.5,className:"shrink-0 transition-transform duration-300 group-hover:translate-x-1.5"})]}),e.jsx(he,{resources:s})]})]})}function be({resource:t,expanded:s,onToggle:a}){const[r,o]=i.useState(!1),[l,p]=i.useState(""),g=String(t.resource_type||"").toUpperCase()==="PDF",b=q(t.file_url),m=M(t),w=`resource-panel-${t.id}`,v=async()=>{if(!r){o(!0),p("");try{g?await ue(t):await me(t)}catch(u){console.error("Resource PDF download failed:",u),p("Unable to download PDF. Please try again.")}finally{o(!1)}}};return e.jsxs("article",{className:`
        flex min-w-0 flex-col overflow-hidden
        rounded-[5px] border
        transition-all duration-300
        ${s?"border-[#bcbcbc] bg-white shadow-sm":"border-[#e5e5e5] bg-[#f8f8f8] hover:border-[#bbb]"}
      `,children:[e.jsxs("button",{type:"button",onClick:a,"aria-expanded":s,"aria-controls":w,className:"flex w-full flex-1 flex-col px-5 pb-5 pt-5 text-left md:px-6",children:[e.jsxs("div",{className:"mb-5 flex w-full items-center justify-between",children:[e.jsx(W,{size:19,strokeWidth:1.5,className:"text-[#c91f26]"}),e.jsx(Y,{size:17,strokeWidth:1.4,className:`text-[#777] transition-transform duration-300 ${s?"rotate-180":""}`})]}),e.jsx("p",{className:"mb-2 text-[10px] font-semibold uppercase tracking-[1.1px] text-[#c91f26]",children:m}),e.jsx("h3",{className:"text-[16px] font-semibold leading-snug text-[#222] md:text-[17px]",children:t.title}),t.description&&e.jsx("p",{className:"mt-2 line-clamp-2 text-[12px] leading-[1.7] text-[#858585]",children:t.description})]}),e.jsxs("div",{className:"mx-5 flex min-h-[52px] items-center justify-between gap-3 border-t border-[#e5e5e5] md:mx-6",children:[e.jsx("button",{type:"button",onClick:a,className:"text-[10px] font-semibold uppercase tracking-[0.6px] text-[#555] transition-colors hover:text-[#c91f26]",children:s?"Close Document":"View Document"}),e.jsxs("button",{type:"button",onClick:v,disabled:r||(g?!b:!t.content),className:`
            inline-flex items-center gap-1.5
            border border-[#e6b2b4]
            px-2.5 py-1.5
            text-[10px] font-medium
            text-[#c91f26]
            transition-colors
            hover:border-[#c91f26]
            hover:bg-[#c91f26]
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-40
          `,children:[r?"Preparing...":"Download PDF",e.jsx(ne,{size:12})]})]}),l&&e.jsx("p",{role:"alert",className:"px-5 pb-3 text-[11px] text-red-600 md:px-6",children:l}),s&&e.jsxs("div",{id:w,className:"min-w-0 border-t border-[#e5e5e5] bg-white px-5 pb-6 pt-5 md:px-6",children:[t.description&&e.jsx("p",{className:"mb-4 text-[13px] leading-6 text-[#666]",children:t.description}),g?b?e.jsxs(e.Fragment,{children:[e.jsxs("a",{href:b,target:"_blank",rel:"noopener noreferrer",className:"mb-4 inline-flex items-center gap-2 text-[12px] font-semibold text-[#c91f26] hover:underline",children:[e.jsx(re,{size:15}),"Open Full PDF"]}),e.jsx("div",{className:"overflow-hidden border border-[#e5e5e5] bg-[#f5f5f5]",children:e.jsx("iframe",{src:`${b}#toolbar=1`,title:`${t.title} PDF Preview`,loading:"lazy",className:"h-[400px] w-full"})})]}):e.jsx("p",{className:"text-[12px] text-[#888]",children:"This PDF is currently unavailable."}):t.content?e.jsx("div",{className:`
                min-w-0 break-words
                text-[13px] leading-7 text-[#555]
                [&_p]:mb-4
                [&_h2]:mb-3
                [&_h2]:mt-5
                [&_h2]:text-lg
                [&_h2]:font-semibold
                [&_h3]:mb-2
                [&_h3]:mt-4
                [&_h3]:font-semibold
                [&_ul]:list-disc
                [&_ul]:pl-5
                [&_ol]:list-decimal
                [&_ol]:pl-5
                [&_li]:mb-2
                [&_a]:text-[#c91f26]
                [&_a]:underline
                [&_img]:max-w-full
                [&_table]:block
                [&_table]:max-w-full
                [&_table]:overflow-x-auto
              `,dangerouslySetInnerHTML:{__html:B(t.content)}}):e.jsx("p",{className:"text-[12px] text-[#888]",children:"No additional content available."})]})]})}function $({activeFilter:t,onChange:s}){return e.jsx("div",{className:"grid grid-cols-2 gap-1 rounded-[5px] border border-[#aaa] bg-[#e8e8e8] p-1 md:grid-cols-4",children:S.map(a=>{const r=a.id==="all"?!t:t===a.id;return e.jsx("button",{type:"button","aria-pressed":r,onClick:()=>s(a.id),className:`
              min-h-[38px] rounded-[3px]
              px-3 py-2
              text-center text-[12px]
              font-medium transition-colors
              ${r?"bg-[#171717] text-white":"text-[#333] hover:bg-white"}
            `,children:a.label},a.id)})})}function Re(){const[t,s]=i.useState([]),[a,r]=i.useState([]),[o,l]=i.useState(!0),[p,g]=i.useState(""),[b,m]=i.useState(null),[w,v]=K(),u=w.get("type")?.toLowerCase(),f=S.some(n=>n.id!=="all"&&n.id===u)?u:null,N=w.get("category");i.useEffect(()=>{const n=new AbortController;return(async()=>{try{l(!0),g("");const[d,j]=await Promise.all([T.get(`${F}/stones`,{signal:n.signal}),T.get(`${F}/category-resources/public`,{signal:n.signal})]),G=I(d.data),U=I(j.data).filter(x=>x.is_active===void 0||x.is_active===null||O(x.is_active)),Q=new Set(U.map(x=>String(x.category_id))),Z=G.filter(x=>O(x.is_active)&&(x.parent_id===null||x.parent_id===void 0)&&Q.has(String(x.id))).sort(xe);n.signal.aborted||(s(Z),r(U))}catch(d){d.code!=="ERR_CANCELED"&&d.name!=="CanceledError"&&!n.signal.aborted&&(console.error("Resources page error:",d),g(d.response?.data?.message||"Unable to load resources. Please try again."))}finally{n.signal.aborted||l(!1)}})(),()=>n.abort()},[]);const y=i.useMemo(()=>f?a.filter(n=>R(n)===f):a,[a,f]),P=i.useMemo(()=>{const n=new Set(y.map(c=>String(c.category_id)));return t.filter(c=>n.has(String(c.id)))},[t,y]),h=i.useMemo(()=>N&&t.find(n=>n.slug===N)||null,[t,N]),_=i.useMemo(()=>h?y.filter(n=>String(n.category_id)===String(h.id)).sort(pe):[],[y,h]),k=({type:n,category:c})=>{m(null),v(d=>{const j=new URLSearchParams(d);return n===null?j.delete("type"):n!==void 0&&j.set("type",n),c===null?j.delete("category"):c!==void 0&&j.set("category",c),j})},E=n=>{k({type:n==="all"?null:n,category:h?h.slug:null})},V=n=>{k({category:n.slug}),window.scrollTo({top:0,behavior:"smooth"})},A=()=>{k({category:null}),window.scrollTo({top:0,behavior:"smooth"})};return i.useEffect(()=>{m(null)},[N,f]),o?e.jsx(X,{}):e.jsxs("main",{className:"min-h-screen bg-white pt-[110px]",style:{fontFamily:"Montserrat, sans-serif"},children:[p&&e.jsx("section",{className:"mx-auto max-w-[1650px] px-6 py-10 xl:px-10",children:e.jsx("div",{className:"border border-red-200 bg-red-50 p-5 text-[14px] text-red-700",children:p})}),!h&&!p&&e.jsxs(e.Fragment,{children:[e.jsxs("section",{className:"mx-auto max-w-[1650px] px-6 xl:px-10",children:[e.jsx("h1",{className:"text-[34px] font-semibold leading-none text-[#161412] md:text-[42px]",children:"Resources"}),e.jsx("div",{className:"mb-4 mt-4 h-[4px] w-[70px] bg-[#c91f26]"}),e.jsxs("nav",{"aria-label":"Breadcrumb",className:"flex items-center gap-2 text-[12px] text-[#777]",children:[e.jsx(L,{to:"/",className:"hover:text-[#c91f26]",children:"Home"}),e.jsx("span",{children:"/"}),e.jsx("span",{className:"font-semibold text-[#161412]",children:"Resources"})]}),e.jsx("div",{className:"mt-7",children:e.jsx($,{activeFilter:f,onChange:E})})]}),e.jsx("section",{className:"mx-auto max-w-[1650px] px-6 pb-20 pt-10 xl:px-10",children:P.length===0?e.jsxs("div",{className:"py-20 text-center",children:[e.jsx(ie,{size:38,strokeWidth:1,className:"mx-auto mb-5 text-[#aaa]"}),e.jsx("h2",{className:"text-[18px] font-semibold",children:"No Resources Available"}),e.jsx("p",{className:"mt-2 text-[13px] text-[#777]",children:"No resources match the selected filter."})]}):e.jsx("div",{className:"grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",children:P.map(n=>{const c=y.filter(d=>String(d.category_id)===String(n.id));return e.jsx(ge,{category:n,categoryResources:c,onClick:()=>V(n)},n.id)})})})]}),h&&!p&&e.jsxs(e.Fragment,{children:[e.jsx("section",{className:"bg-[#242424] text-white",children:e.jsxs("div",{className:"mx-auto max-w-[1650px] px-6 py-10 md:py-12 xl:px-10",children:[e.jsxs("p",{className:"mb-3 text-[10px] font-semibold uppercase tracking-[1.6px] text-[#e5393f]",children:["Resource Center —"," ",h.name]}),e.jsx("h1",{className:"max-w-[1050px] text-[28px] font-semibold leading-tight md:text-[40px]",children:"Everything you need to know about your surface."}),e.jsx("p",{className:"mt-3 max-w-[850px] text-[13px] leading-6 text-[#bdbdbd] md:text-[14px]",children:"Care instructions, warranty information, and expert guidance — organized in one place."}),e.jsxs("div",{className:"mt-5 flex flex-wrap items-center gap-4",children:[e.jsx("span",{className:"text-[11px] text-[#bdbdbd]",children:h.name}),e.jsx("span",{className:"h-1 w-1 rounded-full bg-[#777]"}),e.jsxs("span",{className:"text-[11px] text-[#bdbdbd]",children:[_.length," ",_.length===1?"Document":"Documents"]}),e.jsxs("button",{type:"button",onClick:A,className:"inline-flex items-center gap-2 text-[11px] font-medium text-white hover:text-[#f05a60]",children:[e.jsx(ae,{size:13}),"All Categories"]})]})]})}),e.jsx("section",{className:"bg-[#e9e9e9]",children:e.jsxs("div",{className:"mx-auto max-w-[1650px] px-6 pb-16 pt-9 xl:px-10",children:[e.jsxs("div",{className:"mb-4 flex flex-wrap items-center justify-between gap-3",children:[e.jsx("h2",{className:"text-[16px] font-semibold text-[#222]",children:"Explore Resources"}),e.jsxs("button",{type:"button",onClick:A,className:"inline-flex items-center gap-2 text-[11px] text-[#888] transition-colors hover:text-[#c91f26]",children:["Back to all categories",e.jsx(D,{size:14})]})]}),e.jsx($,{activeFilter:f,onChange:E}),e.jsxs("div",{className:"mb-5 mt-10 flex flex-wrap items-center justify-between gap-3",children:[e.jsx("h2",{className:"text-[16px] font-semibold text-[#222]",children:"Available Documents"}),e.jsxs("span",{className:"text-[12px] text-[#999]",children:[_.length," ",_.length===1?"document":"documents"]})]}),_.length===0?e.jsxs("div",{className:"rounded-[5px] bg-white px-6 py-16 text-center",children:[e.jsx(W,{size:35,strokeWidth:1,className:"mx-auto mb-4 text-[#aaa]"}),e.jsx("p",{className:"text-[14px] text-[#777]",children:"No documents are available for this selection."}),f&&e.jsx("button",{type:"button",onClick:()=>E("all"),className:"mt-5 text-[12px] font-semibold text-[#c91f26] hover:underline",children:"View All Resources"})]}):e.jsx("div",{className:"grid grid-cols-1 items-start gap-4 md:grid-cols-2",children:_.map(n=>e.jsx(be,{resource:n,expanded:String(b)===String(n.id),onToggle:()=>m(c=>String(c)===String(n.id)?null:n.id)},n.id))}),e.jsxs("div",{className:"mt-10 rounded-[5px] border border-[#e3e3e3] bg-[#f7f7f7] px-6 py-7 md:px-8 md:py-8",children:[e.jsx("h2",{className:"text-[19px] font-semibold text-[#222]",children:"Need additional assistance?"}),e.jsx("p",{className:"mt-2 text-[13px] leading-6 text-[#888]",children:"Our team can help you find the right information for your project."}),e.jsxs(L,{to:"/contact",className:"mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.8px] text-[#333] transition-colors hover:text-[#c91f26]",children:["Contact Our Team",e.jsx(D,{size:15,strokeWidth:1.5})]})]})]})})]})]})}export{Re as default};
