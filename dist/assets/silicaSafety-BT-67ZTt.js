import{c as y,r as l,j as e,L as A,C as M,S as z}from"./index-TrkQfYJp.js";import{P as d}from"./index-DWVfANWl.js";import{A as T}from"./arrow-right-Du60gXyM.js";import{D as m}from"./download-Dzlw-fj-.js";import{E as C}from"./external-link-TlSfj7SR.js";import{F as D}from"./file-text-B4Sgf9l6.js";import{C as P}from"./check-D1yc_Obj.js";import{S as B}from"./shield-check-mw5jPwf2.js";import{P as _,M as G}from"./phone-tteVHlqS.js";const E=[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],q=y("badge-check",E);const U=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],H=y("book-open",U);const R=[["path",{d:"m5 8 6 6",key:"1wu5hv"}],["path",{d:"m4 14 6-6 2-3",key:"1k1g8d"}],["path",{d:"M2 5h12",key:"or177f"}],["path",{d:"M7 2h1",key:"1t2jsx"}],["path",{d:"m22 22-5-10-5 10",key:"don7ne"}],["path",{d:"M14 18h6",key:"1m8k6r"}]],I=y("languages",R);const W=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],S=y("triangle-alert",W),V="silica-first",O="https://backend.ultrastones.com/api",Q=()=>{const t=sessionStorage.getItem("token");return{"Content-Type":"application/json",...t&&{Authorization:`Bearer ${t}`}}},Z=async(t,o)=>{let r;try{r=await t.json()}catch{r=null}if(!t.ok)throw new Error(r?.message||o);return r},J=async t=>{const o=await fetch(`${O}/pages/${t}`,{method:"GET",headers:Q()});return Z(o,"Failed to fetch page")},a={pageHeader:{heading:"Silica Safety First",breadcrumbLabel:"Silica Safety",parentBreadcrumbLabel:"Resource Center",parentBreadcrumbLink:"/resource-center"},hero:{image:"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2400&q=90",imageAlt:"Industrial workplace and fabrication safety",title:"Safety begins with knowledge.",description:"Access silica hazard information, official safety resources, Safety Data Sheets, good-practice guides, warning labels, and compliance information for the stone industry.",primaryButtonText:"Explore Safety Resources",primaryButtonLink:"#resources",secondaryButtonText:"View Safety Data Sheets",secondaryButtonLink:"#safety-data-sheets"},aboutSection:{eyebrow:"About This Page",paragraphs:[]},hazardAwareness:{eyebrow:"Silica Hazard Awareness",title:"Questions every stone professional should understand.",description:"Review essential information about crystalline silica, occupational exposure, health risks, final-user safety, and Ultra Stones' commitment.",questions:[]},resourcesSection:{eyebrow:"Official Information",title:"Safety resources and downloads.",description:"Access documents and guidance from recognized government agencies, occupational-health organizations, and stone-industry authorities.",items:[]},safetyDataSheetsSection:{eyebrow:"Document Library",title:"Safety Data Sheets",description:"Search and download Safety Data Sheets for Ultra Stones product categories and specialty surfaces.",searchPlaceholder:"Search by product or material type...",initialVisibleCount:6,items:[]},guidesSection:{image:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2200&q=88",imageAlt:"Professional fabrication and workplace safety",eyebrow:"Best Practices",title:"Practical guidance for safer work.",description:"Download recommended fabrication and installation guidance covering dust-control methods, engineering controls, workplace procedures, and worker protection.",primaryButtonText:"Good Practice Guide",primaryPdfUrl:"",secondaryButtonText:"Installer Guide",secondaryPdfUrl:"",points:[]},labelsSection:{eyebrow:"Product Documentation",title:"Safety Labels",description:"Download product-specific warning labels communicating the presence of crystalline silica and important workplace precautions.",items:[]},certificationsSection:{eyebrow:"Product Standards",title:"Certifications",description:"Selected products may carry recognized certifications related to indoor air quality, material performance, and food-contact applications. Certification availability can vary by product.",footerText:"Contact Ultra Stones to confirm certification availability for a specific product.",items:[]},noticeSection:{title:"Safety & Compliance Notice",paragraphs:[]},contactSection:{eyebrow:"Need Additional Information?",title:"Speak with the Ultra Stones team.",description:"Contact us for available Safety Data Sheets, product documentation, warning labels, certification information, and other technical resources.",phone:"631-873-4747",phoneLink:"+16318734747",email:"info@ultrastones.com"}},K=(t={})=>({...a,...t,pageHeader:{...a.pageHeader,...t.pageHeader},hero:{...a.hero,...t.hero},aboutSection:{...a.aboutSection,...t.aboutSection,paragraphs:Array.isArray(t.aboutSection?.paragraphs)?t.aboutSection.paragraphs:a.aboutSection.paragraphs},hazardAwareness:{...a.hazardAwareness,...t.hazardAwareness,questions:Array.isArray(t.hazardAwareness?.questions)?t.hazardAwareness.questions:a.hazardAwareness.questions},resourcesSection:{...a.resourcesSection,...t.resourcesSection,items:Array.isArray(t.resourcesSection?.items)?t.resourcesSection.items:a.resourcesSection.items},safetyDataSheetsSection:{...a.safetyDataSheetsSection,...t.safetyDataSheetsSection,items:Array.isArray(t.safetyDataSheetsSection?.items)?t.safetyDataSheetsSection.items:a.safetyDataSheetsSection.items},guidesSection:{...a.guidesSection,...t.guidesSection,points:Array.isArray(t.guidesSection?.points)?t.guidesSection.points:a.guidesSection.points},labelsSection:{...a.labelsSection,...t.labelsSection,items:Array.isArray(t.labelsSection?.items)?t.labelsSection.items:a.labelsSection.items},certificationsSection:{...a.certificationsSection,...t.certificationsSection,items:Array.isArray(t.certificationsSection?.items)?t.certificationsSection.items:a.certificationsSection.items},noticeSection:{...a.noticeSection,...t.noticeSection,paragraphs:Array.isArray(t.noticeSection?.paragraphs)?t.noticeSection.paragraphs:a.noticeSection.paragraphs},contactSection:{...a.contactSection,...t.contactSection}}),f=({eyebrow:t,title:o,description:r,align:p="center",light:c=!1})=>{const x=p==="center";return e.jsxs("div",{className:x?"text-center":"text-left",children:[t&&e.jsx("p",{className:`
            text-[11px]
            uppercase
            tracking-[0.24em]
            font-semibold
            ${c?"text-white/65":"text-[#c91f26]"}
          `,style:{fontFamily:"Montserrat, sans-serif"},children:t}),e.jsx("h2",{className:`
          mt-3
          text-[34px]
          sm:text-[40px]
          lg:text-[48px]
          leading-[1.08]
          ${c?"text-white":"text-[#171513]"}
        `,style:{fontFamily:'"Cormorant Garamond", serif'},children:o}),e.jsx("div",{className:`
          mt-5
          h-[2px]
          w-[52px]
          bg-[#c91f26]
          ${x?"mx-auto":""}
        `}),r&&e.jsx("p",{className:`
            mt-6
            text-[14px]
            sm:text-[15px]
            leading-[1.9]
            ${x?"max-w-[760px] mx-auto":"max-w-[650px]"}
            ${c?"text-white/70":"text-[#686868]"}
          `,style:{fontFamily:"Montserrat, sans-serif"},children:r})]})};f.propTypes={eyebrow:d.string,title:d.string.isRequired,description:d.string,align:d.oneOf(["center","left"]),light:d.bool};f.defaultProps={eyebrow:"",description:"",align:"center",light:!1};const h=({url:t,children:o,variant:r="outline",icon:p=m})=>{const c=!t||t==="#",x=()=>{c||window.open(t,"_blank","noopener,noreferrer")},b=r==="solid"?"bg-[#c91f26] text-white hover:bg-[#aa1a20]":"border border-[#c91f26] text-[#c91f26] hover:bg-[#c91f26] hover:text-white";return e.jsxs("button",{type:"button",disabled:c,onClick:x,className:`
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        py-3
        text-[12px]
        font-semibold
        tracking-[0.02em]
        duration-300
        ${b}
        disabled:opacity-45
        disabled:cursor-not-allowed
        disabled:hover:bg-transparent
        disabled:hover:text-[#c91f26]
      `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx(p,{size:15,strokeWidth:1.8}),o]})};h.propTypes={url:d.string,children:d.node.isRequired,variant:d.oneOf(["outline","solid"]),icon:d.elementType};h.defaultProps={url:"",variant:"outline",icon:m};const oe=()=>{const[t,o]=l.useState(a),[r,p]=l.useState(!0),[c,x]=l.useState(""),[b,$]=l.useState(0),[g,L]=l.useState(""),[w,N]=l.useState(!1),v=l.useCallback(async()=>{try{p(!0),x("");const s=await J(V),n=s?.data||s;if(!n?.id)throw new Error("Silica Safety page was not found.");o(K(n.content||{}))}catch(s){console.error(s),x(s?.message||"Failed to load Silica Safety page.")}finally{p(!1)}},[]);l.useEffect(()=>{v()},[v]);const u=t.safetyDataSheetsSection.items||[],k=Number(t.safetyDataSheetsSection.initialVisibleCount)||6,j=l.useMemo(()=>{const s=g.trim().toLowerCase();return s?u.filter(n=>`${n.name||""} ${n.category||""} ${n.description||""}`.toLowerCase().includes(s)):u},[g,u]),F=w?j:j.slice(0,k);return r?e.jsx("main",{className:"min-h-screen pt-[110px] bg-white",children:e.jsx("div",{className:"min-h-[520px] flex items-center justify-center",children:e.jsx("div",{className:"w-11 h-11 rounded-full border-2 border-[#c91f26]/20 border-t-[#c91f26] animate-spin"})})}):c?e.jsx("main",{className:"min-h-screen pt-[110px] bg-white",children:e.jsx("div",{className:"max-w-[900px] mx-auto px-6 py-24",children:e.jsxs("div",{className:"border border-[#ead8d9] bg-[#fcf7f7] p-8",children:[e.jsx(S,{size:28,className:"text-[#c91f26]"}),e.jsx("h1",{className:"mt-4 text-[28px] text-[#171513]",style:{fontFamily:'"Cormorant Garamond", serif'},children:"Unable to load this page"}),e.jsx("p",{className:"mt-3 text-[14px] leading-[1.8] text-[#686868]",style:{fontFamily:"Montserrat, sans-serif"},children:c})]})})}):e.jsxs("main",{className:"min-h-screen pt-[110px] bg-white",children:[e.jsx("section",{children:e.jsxs("div",{className:"max-w-[1650px] mx-auto px-6 xl:px-10",children:[e.jsx("h1",{className:"text-[34px] md:text-[42px] font-semibold text-[#161412]",style:{fontFamily:"Montserrat, sans-serif"},children:t.pageHeader.heading}),e.jsx("div",{className:"w-[70px] h-[4px] bg-[#c91f26] mt-3 mb-5"}),e.jsxs("p",{className:"text-[13px] text-[#777]",children:[e.jsx(A,{to:"/",className:"hover:text-[#161412] duration-300",children:"Home"})," / ",e.jsx(A,{to:t.pageHeader.parentBreadcrumbLink,className:"hover:text-[#161412] duration-300",children:t.pageHeader.parentBreadcrumbLabel})," / ",e.jsx("span",{className:"text-[#161412] font-semibold",children:t.pageHeader.breadcrumbLabel})]})]})}),e.jsxs("section",{className:"relative min-h-[650px] lg:min-h-[720px] overflow-hidden mt-10",children:[e.jsx("img",{src:t.hero.image,alt:t.hero.imageAlt||t.hero.title,className:"absolute inset-0 w-full h-full object-cover"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10"}),e.jsx("div",{className:"relative max-w-[1500px] mx-auto px-6 xl:px-10 min-h-[650px] lg:min-h-[720px] flex items-center",children:e.jsxs("div",{className:"max-w-[850px] pt-10",children:[e.jsx("h1",{className:`
                mt-7
                text-white
                text-[46px]
                sm:text-[60px]
                lg:text-[78px]
                xl:text-[88px]
                leading-[0.98]
                max-w-[850px]
              `,style:{fontFamily:'"Cormorant Garamond", serif'},children:t.hero.title}),e.jsx("p",{className:`
                max-w-[760px]
                mt-7
                text-white/78
                text-[15px]
                sm:text-[17px]
                leading-[1.85]
              `,style:{fontFamily:"Montserrat, sans-serif"},children:t.hero.description}),e.jsxs("div",{className:"mt-9 flex flex-col sm:flex-row gap-3",children:[e.jsxs("a",{href:t.hero.primaryButtonLink,className:`
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-[#c91f26]
                  text-white
                  px-7
                  py-4
                  text-[13px]
                  font-semibold
                  hover:bg-[#aa1a20]
                  duration-300
                `,style:{fontFamily:"Montserrat, sans-serif"},children:[t.hero.primaryButtonText,e.jsx(T,{size:16})]}),e.jsxs("a",{href:t.hero.secondaryButtonLink,className:`
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  border
                  border-white/40
                  bg-white/5
                  backdrop-blur-sm
                  text-white
                  px-7
                  py-4
                  text-[13px]
                  font-semibold
                  hover:bg-white
                  hover:text-[#171513]
                  duration-300
                `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx(m,{size:16}),t.hero.secondaryButtonText]})]})]})})]}),e.jsx("section",{className:"bg-white py-20 lg:py-28",children:e.jsxs("div",{className:"max-w-[780px] mx-auto px-6",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:`
                text-[14px]
                sm:text-[16px]
                uppercase
                tracking-[0.18em]
                font-medium
                text-[#c91f26]
              `,style:{fontFamily:"Montserrat, sans-serif"},children:t.aboutSection.eyebrow}),e.jsx("div",{className:"w-[32px] h-[3px] bg-[#c91f26] mx-auto mt-4"})]}),e.jsx("div",{className:"mt-7 space-y-4",children:t.aboutSection.paragraphs.map((s,n)=>e.jsx("p",{className:`
                    text-[15px]
                    sm:text-[16px]
                    lg:text-[17px]
                    leading-[2.15]
                    text-[#595959]
                  `,style:{fontFamily:"Montserrat, sans-serif"},children:s},`about-${n+1}`))})]})}),e.jsx("section",{id:"hazard-awareness",className:"py-20 lg:py-28 bg-[#f7f5f3] scroll-mt-[180px]",children:e.jsxs("div",{className:"max-w-[1250px] mx-auto px-6",children:[e.jsx(f,{eyebrow:t.hazardAwareness.eyebrow,title:t.hazardAwareness.title,description:t.hazardAwareness.description}),e.jsx("div",{className:"mt-14 max-w-[1050px] mx-auto",children:t.hazardAwareness.questions.map((s,n)=>{const i=b===n;return e.jsxs("article",{className:`
                      border-b
                      transition-colors
                      ${i?"border-[#c91f26] bg-white":"border-[#ddd8d4] bg-transparent"}
                    `,children:[e.jsxs("button",{type:"button",onClick:()=>$(i?null:n),"aria-expanded":i,className:`
                        w-full
                        flex
                        items-center
                        justify-between
                        gap-6
                        px-5
                        sm:px-7
                        py-6
                        text-left
                      `,children:[e.jsxs("div",{className:"flex items-start gap-5",children:[e.jsx("span",{className:`
                            text-[12px]
                            font-semibold
                            pt-1
                            ${i?"text-[#c91f26]":"text-[#9a9692]"}
                          `,style:{fontFamily:"Montserrat, sans-serif"},children:String(n+1).padStart(2,"0")}),e.jsx("span",{className:`
                            text-[20px]
                            sm:text-[24px]
                            leading-[1.25]
                            text-[#171513]
                          `,style:{fontFamily:'"Cormorant Garamond", serif'},children:s.question})]}),e.jsx("span",{className:`
                          w-10
                          h-10
                          shrink-0
                          rounded-full
                          flex
                          items-center
                          justify-center
                          duration-300
                          ${i?"bg-[#c91f26] text-white rotate-180":"bg-white text-[#171513]"}
                        `,children:e.jsx(M,{size:18})})]}),e.jsx("div",{className:`
                        grid
                        transition-all
                        duration-300
                        ${i?"grid-rows-[1fr] opacity-100":"grid-rows-[0fr] opacity-0"}
                      `,children:e.jsx("div",{className:"overflow-hidden",children:e.jsx("p",{className:`
                            px-5
                            sm:px-[76px]
                            pb-7
                            max-w-[920px]
                            text-[14px]
                            sm:text-[15px]
                            leading-[1.9]
                            text-[#686868]
                          `,style:{fontFamily:"Montserrat, sans-serif"},children:s.answer})})})]},s.id||`question-${n+1}`)})})]})}),e.jsx("section",{id:"resources",className:"py-20 lg:py-28 scroll-mt-[180px]",children:e.jsxs("div",{className:"max-w-[1450px] mx-auto px-6",children:[e.jsx(f,{eyebrow:t.resourcesSection.eyebrow,title:t.resourcesSection.title,description:t.resourcesSection.description}),e.jsx("div",{className:"mt-14 grid md:grid-cols-2 xl:grid-cols-3 gap-5",children:t.resourcesSection.items.map((s,n)=>{const i=s.type==="external";return e.jsxs("article",{className:`
                      group
                      relative
                      overflow-hidden
                      border
                      border-[#e7e3df]
                      bg-white
                      p-7
                      min-h-[325px]
                      flex
                      flex-col
                      hover:-translate-y-1
                      hover:border-[#c91f26]
                      hover:shadow-[0_22px_55px_rgba(0,0,0,0.07)]
                      duration-300
                    `,children:[e.jsx("span",{className:`
                        absolute
                        top-5
                        right-6
                        text-[54px]
                        leading-none
                        text-[#f1eeeb]
                        group-hover:text-[#f8e9ea]
                        duration-300
                      `,style:{fontFamily:'"Cormorant Garamond", serif'},children:String(n+1).padStart(2,"0")}),e.jsx("div",{className:"w-12 h-12 bg-[#f8e9ea] text-[#c91f26] flex items-center justify-center",children:i?e.jsx(C,{size:21,strokeWidth:1.7}):e.jsx(D,{size:21,strokeWidth:1.7})}),e.jsx("p",{className:`
                        mt-7
                        text-[10px]
                        uppercase
                        tracking-[0.21em]
                        font-semibold
                        text-[#c91f26]
                      `,style:{fontFamily:"Montserrat, sans-serif"},children:s.organization}),e.jsx("h3",{className:`
                        mt-3
                        pr-12
                        text-[27px]
                        leading-[1.15]
                        text-[#171513]
                      `,style:{fontFamily:'"Cormorant Garamond", serif'},children:s.title}),e.jsx("p",{className:`
                        mt-4
                        text-[13px]
                        leading-[1.8]
                        text-[#747474]
                        flex-1
                      `,style:{fontFamily:"Montserrat, sans-serif"},children:s.description}),e.jsx("div",{className:"mt-7",children:e.jsx(h,{url:s.url,icon:i?C:m,children:s.buttonText})})]},s.id||`resource-${n+1}`)})})]})}),e.jsx("section",{id:"safety-data-sheets",className:"py-20 lg:py-28 bg-[#171513] scroll-mt-[180px]",children:e.jsxs("div",{className:"max-w-[1450px] mx-auto px-6",children:[e.jsxs("div",{className:"grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-end",children:[e.jsx(f,{eyebrow:t.safetyDataSheetsSection.eyebrow,title:t.safetyDataSheetsSection.title,description:t.safetyDataSheetsSection.description,align:"left",light:!0}),e.jsxs("div",{className:"relative",children:[e.jsx(z,{size:19,className:"absolute left-5 top-1/2 -translate-y-1/2 text-white/45"}),e.jsx("input",{type:"search",value:g,onChange:s=>{L(s.target.value),N(!0)},placeholder:t.safetyDataSheetsSection.searchPlaceholder,className:`
                  w-full
                  h-[58px]
                  bg-white/8
                  border
                  border-white/18
                  text-white
                  placeholder:text-white/40
                  pl-14
                  pr-5
                  outline-none
                  focus:border-[#c91f26]
                  duration-300
                `,style:{fontFamily:"Montserrat, sans-serif"}})]})]}),e.jsx("div",{className:"mt-14 grid sm:grid-cols-2 xl:grid-cols-3 gap-4",children:F.map((s,n)=>e.jsxs("article",{className:`
                    group
                    bg-white/[0.055]
                    border
                    border-white/12
                    p-6
                    min-h-[245px]
                    flex
                    flex-col
                    hover:bg-white/[0.09]
                    hover:border-[#c91f26]
                    duration-300
                  `,children:[e.jsxs("div",{className:"flex items-start justify-between gap-4",children:[e.jsx("div",{className:"w-11 h-11 bg-[#c91f26] text-white flex items-center justify-center",children:e.jsx(D,{size:20,strokeWidth:1.7})}),e.jsx("span",{className:`
                        border
                        border-white/15
                        text-white/55
                        px-3
                        py-1.5
                        text-[9px]
                        uppercase
                        tracking-[0.15em]
                      `,style:{fontFamily:"Montserrat, sans-serif"},children:s.category})]}),e.jsx("h3",{className:"mt-6 text-[25px] leading-[1.15] text-white",style:{fontFamily:'"Cormorant Garamond", serif'},children:s.name}),e.jsx("p",{className:"mt-3 text-[12px] leading-[1.75] text-white/55 flex-1",style:{fontFamily:"Montserrat, sans-serif"},children:s.description}),e.jsxs("div",{className:"mt-6 flex flex-wrap gap-2",children:[e.jsx(h,{url:s.englishUrl,variant:"solid",icon:m,children:"English"}),e.jsx(h,{url:s.spanishUrl,icon:I,children:"Español"})]})]},s.id||`sheet-${n+1}`))}),F.length===0&&e.jsxs("div",{className:"mt-12 border border-white/15 p-10 text-center",children:[e.jsx(z,{size:28,className:"text-white/35 mx-auto"}),e.jsx("p",{className:"mt-4 text-white/65 text-sm",style:{fontFamily:"Montserrat, sans-serif"},children:"No Safety Data Sheets match your search."})]}),!g&&j.length>k&&e.jsx("div",{className:"mt-10 text-center",children:e.jsxs("button",{type:"button",onClick:()=>N(s=>!s),className:`
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    border
                    border-white/25
                    text-white
                    px-7
                    py-3.5
                    text-[12px]
                    font-semibold
                    hover:bg-white
                    hover:text-[#171513]
                    duration-300
                  `,style:{fontFamily:"Montserrat, sans-serif"},children:[w?"Show Fewer Documents":`View All ${u.length} Documents`,e.jsx(M,{size:16,className:w?"rotate-180":""})]})})]})}),e.jsxs("section",{id:"guides",className:"relative min-h-[620px] overflow-hidden scroll-mt-[180px]",children:[e.jsx("img",{src:t.guidesSection.image,alt:t.guidesSection.imageAlt||t.guidesSection.title,className:"absolute inset-0 w-full h-full object-cover",loading:"lazy"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/20"}),e.jsx("div",{className:"relative max-w-[1450px] mx-auto px-6 py-24 lg:py-32",children:e.jsxs("div",{className:"max-w-[720px]",children:[e.jsx("div",{className:"w-14 h-14 bg-[#c91f26] text-white flex items-center justify-center",children:e.jsx(H,{size:25,strokeWidth:1.7})}),e.jsx(f,{eyebrow:t.guidesSection.eyebrow,title:t.guidesSection.title,description:t.guidesSection.description,align:"left",light:!0}),e.jsxs("div",{className:"mt-9 flex flex-col sm:flex-row gap-3",children:[e.jsx(h,{url:t.guidesSection.primaryPdfUrl,variant:"solid",icon:m,children:t.guidesSection.primaryButtonText}),e.jsx(h,{url:t.guidesSection.secondaryPdfUrl,icon:m,children:t.guidesSection.secondaryButtonText})]}),e.jsx("div",{className:"mt-10 grid sm:grid-cols-3 gap-3",children:t.guidesSection.points.map((s,n)=>{const i=typeof s=="string"?s:s.text;return e.jsxs("div",{className:`
                        flex
                        items-start
                        gap-3
                        border
                        border-white/15
                        bg-white/8
                        backdrop-blur-sm
                        p-4
                      `,children:[e.jsx(P,{size:17,className:"text-[#ee3b43] shrink-0 mt-0.5"}),e.jsx("p",{className:"text-[11px] leading-[1.6] text-white/75",style:{fontFamily:"Montserrat, sans-serif"},children:i})]},s.id||`guide-point-${n+1}`)})})]})})]}),e.jsx("section",{id:"labels",className:"py-20 lg:py-28 bg-[#f7f5f3] scroll-mt-[180px]",children:e.jsx("div",{className:"max-w-[1450px] mx-auto px-6",children:e.jsxs("div",{className:"grid lg:grid-cols-2 gap-6",children:[e.jsxs("article",{className:"bg-white border border-[#e6e1dd] p-7 sm:p-10",children:[e.jsxs("div",{className:"flex items-start justify-between gap-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[10px] uppercase tracking-[0.22em] font-semibold text-[#c91f26]",style:{fontFamily:"Montserrat, sans-serif"},children:t.labelsSection.eyebrow}),e.jsx("h2",{className:"mt-3 text-[36px] sm:text-[43px] leading-[1.08] text-[#171513]",style:{fontFamily:'"Cormorant Garamond", serif'},children:t.labelsSection.title})]}),e.jsx("div",{className:"w-12 h-12 bg-[#f8e9ea] text-[#c91f26] flex items-center justify-center shrink-0",children:e.jsx(S,{size:22,strokeWidth:1.7})})]}),e.jsx("p",{className:"mt-6 text-[13px] leading-[1.85] text-[#707070]",style:{fontFamily:"Montserrat, sans-serif"},children:t.labelsSection.description}),e.jsx("div",{className:"mt-8 grid sm:grid-cols-2 gap-2.5",children:t.labelsSection.items.map((s,n)=>{const i=!s.url||s.url==="#";return e.jsxs("button",{type:"button",disabled:i,onClick:()=>{i||window.open(s.url,"_blank","noopener,noreferrer")},className:`
                          flex
                          items-center
                          justify-between
                          gap-4
                          border
                          border-[#e6e1dd]
                          px-4
                          py-3.5
                          text-left
                          hover:border-[#c91f26]
                          hover:bg-[#fcf7f7]
                          duration-300
                          disabled:opacity-55
                          disabled:cursor-not-allowed
                        `,children:[e.jsx("span",{className:"text-[11px] text-[#353230]",style:{fontFamily:"Montserrat, sans-serif"},children:s.name}),e.jsx(m,{size:14,className:"text-[#c91f26] shrink-0"})]},s.id||`label-${n+1}`)})})]}),e.jsxs("article",{className:"bg-[#171513] p-7 sm:p-10 text-white",children:[e.jsxs("div",{className:"flex items-start justify-between gap-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[10px] uppercase tracking-[0.22em] font-semibold text-white/55",style:{fontFamily:"Montserrat, sans-serif"},children:t.certificationsSection.eyebrow}),e.jsx("h2",{className:"mt-3 text-[36px] sm:text-[43px] leading-[1.08] text-white",style:{fontFamily:'"Cormorant Garamond", serif'},children:t.certificationsSection.title})]}),e.jsx("div",{className:"w-12 h-12 bg-white/10 text-[#ee3b43] flex items-center justify-center shrink-0",children:e.jsx(q,{size:23,strokeWidth:1.7})})]}),e.jsx("p",{className:"mt-6 text-[13px] leading-[1.85] text-white/62",style:{fontFamily:"Montserrat, sans-serif"},children:t.certificationsSection.description}),e.jsx("div",{className:"mt-9 grid sm:grid-cols-2 gap-4",children:t.certificationsSection.items.map((s,n)=>e.jsxs("div",{className:"border border-white/15 bg-white/[0.055] p-6 min-h-[190px]",children:[e.jsx("div",{className:"w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden p-1.5",children:s.logo?e.jsx("img",{src:s.logo,alt:s.logoAlt||s.title||"Certification logo",className:"w-full h-full object-contain"}):e.jsx(B,{size:21,className:"text-[#171513]"})}),e.jsx("h3",{className:"mt-6 text-[25px]",style:{fontFamily:'"Cormorant Garamond", serif'},children:s.title}),e.jsx("p",{className:"mt-3 text-[11px] leading-[1.7] text-white/50",style:{fontFamily:"Montserrat, sans-serif"},children:s.description})]},s.id||`certification-${n+1}`))}),e.jsx("div",{className:"mt-6 border-t border-white/12 pt-6",children:e.jsx("p",{className:"text-[11px] leading-[1.75] text-white/45",style:{fontFamily:"Montserrat, sans-serif"},children:t.certificationsSection.footerText})})]})]})})}),e.jsx("section",{className:"py-16 lg:py-20",children:e.jsx("div",{className:"max-w-[1250px] mx-auto px-6",children:e.jsx("div",{className:"border border-[#ead8d9] bg-[#fcf7f7] p-7 sm:p-10",children:e.jsxs("div",{className:"grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-8",children:[e.jsx("div",{className:"w-12 h-12 bg-[#c91f26] text-white flex items-center justify-center",children:e.jsx(S,{size:22,strokeWidth:1.8})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-[25px] sm:text-[29px] text-[#171513]",style:{fontFamily:'"Cormorant Garamond", serif'},children:t.noticeSection.title}),e.jsx("div",{className:"mt-5 space-y-4 text-[12px] sm:text-[13px] leading-[1.85] text-[#696969]",style:{fontFamily:"Montserrat, sans-serif"},children:t.noticeSection.paragraphs.map((s,n)=>e.jsx("p",{children:s},`notice-${n+1}`))})]})]})})})}),e.jsx("section",{className:"bg-[#c91f26] mb-20",children:e.jsx("div",{className:"max-w-[1450px] mx-auto px-6 py-16 lg:py-20",children:e.jsxs("div",{className:"grid lg:grid-cols-[1fr_auto] gap-10 items-center",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[10px] uppercase tracking-[0.22em] font-semibold text-white/65",style:{fontFamily:"Montserrat, sans-serif"},children:t.contactSection.eyebrow}),e.jsx("h2",{className:"mt-3 text-[38px] sm:text-[48px] leading-[1.08] text-white",style:{fontFamily:'"Cormorant Garamond", serif'},children:t.contactSection.title}),e.jsx("p",{className:"mt-5 max-w-[740px] text-[13px] sm:text-[14px] leading-[1.8] text-white/75",style:{fontFamily:"Montserrat, sans-serif"},children:t.contactSection.description})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3",children:[e.jsxs("a",{href:`tel:${t.contactSection.phoneLink}`,className:`
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  min-w-[220px]
                  bg-white
                  text-[#171513]
                  px-6
                  py-4
                  text-[12px]
                  font-semibold
                  hover:bg-[#171513]
                  hover:text-white
                  duration-300
                `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx(_,{size:17}),t.contactSection.phone]}),e.jsxs("a",{href:`mailto:${t.contactSection.email}`,className:`
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  min-w-[240px]
                  border
                  border-white/50
                  text-white
                  px-6
                  py-4
                  text-[12px]
                  font-semibold
                  hover:bg-white
                  hover:text-[#171513]
                  duration-300
                `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx(G,{size:17}),t.contactSection.email]})]})]})})})]})};export{oe as default};
