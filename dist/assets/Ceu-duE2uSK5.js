import{r as m,j as e,d as y,a as b,f as j,X as v}from"./index-TrkQfYJp.js";const g=({children:i,light:a=!1,centered:t=!1})=>e.jsxs("div",{className:`
        flex
        items-center
        gap-3

        ${t?"justify-center":""}

        text-[11px]
        sm:text-[12px]
        lg:text-[13px]

        font-semibold
        uppercase
        tracking-[0.08em]

        ${a?"text-white/90":"text-[#262320]"}
      `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx("span",{children:i}),e.jsx("span",{className:`
          text-[#c91f26]
          text-[16px]
          leading-none
        `,children:"→"})]}),w=({children:i,onClick:a,light:t=!1,type:p="button"})=>e.jsxs("button",{type:p,onClick:a,className:`
        inline-flex
        items-center
        justify-between

        gap-7

        min-w-[160px]
        h-[42px]

        px-5
        sm:px-6

        border

        text-[9px]
        sm:text-[10px]
        lg:text-[11px]

        font-semibold
        uppercase
        tracking-[0.05em]

        transition-all
        duration-300

        ${t?`
              border-white/35
              text-white

              hover:bg-white
              hover:text-[#161412]
            `:`
              border-[#aaa6a1]
              text-[#161412]

              hover:bg-[#161412]
              hover:border-[#161412]
              hover:text-white
            `}
      `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx("span",{children:i}),e.jsx("span",{className:"text-[#c91f26]",children:"→"})]}),d=({label:i,required:a=!1,children:t})=>e.jsxs("div",{children:[e.jsxs("label",{className:`
          block

          mb-2

          text-[9px]
          sm:text-[10px]

          font-semibold
          uppercase
          tracking-[0.08em]

          text-[#4f4a46]
        `,style:{fontFamily:"Montserrat, sans-serif"},children:[i,a&&e.jsxs("span",{className:"text-[#c91f26]",children:[" ","*"]})]}),t]}),N=({course:i,onClose:a})=>{const[t,p]=m.useState({name:"",email:"",phone:"",company:"",role:"",preferredDate:"",message:""}),[x,h]=m.useState(!1);m.useEffect(()=>(document.body.style.overflow="hidden",()=>{document.body.style.overflow=""}),[]),m.useEffect(()=>{const c=n=>{n.key==="Escape"&&a()};return window.addEventListener("keydown",c),()=>{window.removeEventListener("keydown",c)}},[a]);const l=c=>{const{name:n,value:o}=c.target;p(r=>({...r,[n]:o}))},s=async c=>{if(c.preventDefault(),!x){if(!t.name.trim()||!t.email.trim()||!t.phone.trim()||!t.company.trim()){alert("Please fill all required fields.");return}try{h(!0);const n="https://backend.ultrastones.com/api",o={course:String(i?.title||"").trim(),name:t.name.trim(),email:t.email.trim().toLowerCase(),phone:t.phone.trim(),company:t.company.trim(),role:t.role.trim(),preferredDate:t.preferredDate||"",message:t.message.trim()};console.log("📚 CEU REQUEST PAYLOAD:",o),console.log("📡 CEU REQUEST URL:",`${n}/ceu-request`);const r=await b.post(`${n}/ceu-request`,o,{headers:{"Content-Type":"application/json"}});if(console.log("✅ CEU REQUEST RESPONSE:",r.data),console.log("✅ CEU REQUEST STATUS:",r.status),r.data?.success===!1)throw new Error(r.data?.message||"Failed to submit CEU request.");alert(r.data?.message||"CEU course request submitted successfully."),p({name:"",email:"",phone:"",company:"",role:"",preferredDate:"",message:""}),a()}catch(n){console.error("❌ CEU REQUEST FAILED:",n),console.error("STATUS:",n.response?.status),console.error("BACKEND RESPONSE:",n.response?.data),console.error("REQUEST URL:",n.config?.url),alert(n.response?.data?.message||n.message||"Unable to submit CEU request. Please try again.")}finally{h(!1)}}};return j.createPortal(e.jsxs("div",{className:`
        fixed
        inset-0

        z-[99999]

        flex
        items-center
        justify-center

        p-4
        sm:p-6
      `,children:[e.jsx("button",{type:"button","aria-label":"Close CEU request form",onClick:a,className:`
          absolute
          inset-0

          w-full
          h-full

          bg-black/65

          backdrop-blur-[2px]
        `}),e.jsxs("div",{className:`
          relative
          z-10

          w-full
          max-w-[760px]

          max-h-[90vh]

          overflow-y-auto

          bg-white

          shadow-[0_30px_90px_rgba(0,0,0,0.28)]
        `,children:[e.jsx("div",{className:`
            h-[4px]
            w-full

            bg-[#c91f26]
          `}),e.jsxs("div",{className:`
            px-5
            sm:px-8
            md:px-10

            py-7
            sm:py-9
          `,children:[e.jsxs("div",{className:`
              flex
              items-start
              justify-between

              gap-6
            `,children:[e.jsxs("div",{children:[e.jsx(g,{children:"CEU Course Request"}),e.jsx("h2",{className:`
                  mt-5

                  text-[32px]
                  sm:text-[38px]
                  md:text-[42px]

                  leading-[1.06]

                  tracking-[-0.03em]

                  text-[#161412]
                `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:"Request This Course"}),e.jsx("p",{className:`
                  mt-4

                  max-w-[540px]

                  text-[12px]
                  sm:text-[13px]

                  leading-[1.75]

                  text-[#77716c]
                `,style:{fontFamily:"Montserrat, sans-serif"},children:"Complete the form below and our team will contact you to coordinate your CEU session."})]}),e.jsx("button",{type:"button",onClick:a,className:`
                shrink-0

                w-[38px]
                h-[38px]

                flex
                items-center
                justify-center

                border
                border-[#d8d4cf]

                text-[#161412]

                hover:bg-[#161412]
                hover:text-white
                hover:border-[#161412]

                transition-all
                duration-300
              `,children:e.jsx(v,{size:17})})]}),e.jsxs("div",{className:`
              mt-7

              bg-[#efedea]

              px-5
              py-4

              border-l-[3px]
              border-[#c91f26]
            `,children:[e.jsx("span",{className:`
                text-[9px]
                sm:text-[10px]

                font-semibold

                uppercase
                tracking-[0.1em]

                text-[#77716c]
              `,style:{fontFamily:"Montserrat, sans-serif"},children:"Selected Course"}),e.jsx("h3",{className:`
                mt-2

                text-[17px]
                sm:text-[19px]

                text-[#161412]
              `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:i.title})]}),e.jsxs("form",{onSubmit:s,className:`
              mt-7
            `,children:[e.jsxs("div",{className:`
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-x-5
                gap-y-5
              `,children:[e.jsx(d,{label:"Full Name",required:!0,children:e.jsx("input",{required:!0,type:"text",name:"name",value:t.name,onChange:l,placeholder:"Your name",autoComplete:"name",className:"ceu-input"})}),e.jsx(d,{label:"Email",required:!0,children:e.jsx("input",{required:!0,type:"email",name:"email",value:t.email,onChange:l,placeholder:"name@company.com",autoComplete:"email",className:"ceu-input"})}),e.jsx(d,{label:"Phone",required:!0,children:e.jsx("input",{required:!0,type:"tel",name:"phone",value:t.phone,onChange:l,placeholder:"Phone number",autoComplete:"tel",className:"ceu-input"})}),e.jsx(d,{label:"Company / Firm",required:!0,children:e.jsx("input",{required:!0,type:"text",name:"company",value:t.company,onChange:l,placeholder:"Company or firm",autoComplete:"organization",className:"ceu-input"})}),e.jsx(d,{label:"Professional Role",children:e.jsxs("select",{name:"role",value:t.role,onChange:l,className:`
                    ceu-input
                    bg-white
                  `,children:[e.jsx("option",{value:"",children:"Select role"}),e.jsx("option",{value:"Architect",children:"Architect"}),e.jsx("option",{value:"Interior Designer",children:"Interior Designer"}),e.jsx("option",{value:"Designer",children:"Designer"}),e.jsx("option",{value:"Specifier",children:"Specifier"}),e.jsx("option",{value:"Contractor",children:"Contractor"}),e.jsx("option",{value:"Developer",children:"Developer"}),e.jsx("option",{value:"Other",children:"Other"})]})}),e.jsx(d,{label:"Preferred Date",children:e.jsx("input",{type:"date",name:"preferredDate",value:t.preferredDate,onChange:l,className:"ceu-input"})})]}),e.jsx("div",{className:"mt-5",children:e.jsx(d,{label:"Additional Notes",children:e.jsx("textarea",{name:"message",value:t.message,onChange:l,rows:4,placeholder:"Any questions or scheduling preferences...",className:`
                    ceu-input

                    h-auto
                    min-h-[110px]

                    py-3

                    resize-none
                  `})})}),e.jsxs("div",{className:`
                mt-8

                pt-6

                border-t
                border-[#e2ded9]

                flex
                flex-col-reverse
                sm:flex-row

                sm:items-center
                sm:justify-between

                gap-5
              `,children:[e.jsx("p",{className:`
                  max-w-[380px]

                  text-[10px]
                  sm:text-[11px]

                  leading-[1.65]

                  text-[#8b8681]
                `,style:{fontFamily:"Montserrat, sans-serif"},children:"Our team will follow up regarding course availability and scheduling."}),e.jsxs("button",{type:"submit",disabled:x,className:`
                  inline-flex
                  items-center
                  justify-between

                  gap-7

                  min-w-[175px]
                  h-[44px]

                  px-6

                  bg-[#161412]

                  border
                  border-[#161412]

                  text-white

                  text-[10px]
                  sm:text-[11px]

                  font-semibold
                  uppercase
                  tracking-[0.05em]

                  hover:bg-[#c91f26]
                  hover:border-[#c91f26]

                  transition-all
                  duration-300

                  disabled:opacity-50
                `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx("span",{children:x?"Submitting...":"Submit Request"}),!x&&e.jsx("span",{children:"→"})]})]})]})]})]})]}),document.body)},C=()=>{const[i,a]=m.useState(null),[t,p]=m.useState(!0),[x,h]=m.useState(null);if(m.useEffect(()=>{(async()=>{try{const r=(await b.get("https://backend.ultrastones.com/api/pages/ceu")).data;r.success&&a(r.data)}catch(o){console.error("Error fetching CEU page:",o)}finally{p(!1)}})()},[]),t)return e.jsx(y,{});if(!i)return e.jsx("div",{className:`
          min-h-screen

          pt-[90px]
          sm:pt-[110px]

          flex
          items-center
          justify-center

          px-6

          text-center
        `,children:"Page not found"});const l=i.content||{},s=l.hero||{},c=Array.isArray(l.courses)?l.courses:[];return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:`
          min-h-screen

          pt-[90px]
          sm:pt-[110px]

          bg-white
        `,children:[e.jsx("section",{children:e.jsxs("div",{className:`
              relative

              h-[500px]
              sm:h-[570px]
              lg:h-[650px]

              overflow-hidden

              bg-[#161412]
            `,children:[s.image&&e.jsx("img",{src:s.image,alt:s.imageAlt||s.headingLine2||s.headingLine1||"",className:`
                  absolute
                  inset-0

                  w-full
                  h-full

                  object-cover
                  object-center
                `}),e.jsx("div",{className:`
                absolute
                inset-0

                bg-black/50

                sm:bg-gradient-to-r
                sm:from-black/65
                sm:via-black/30
                sm:to-black/10
              `}),e.jsx("div",{className:`
                absolute
                inset-0

                flex
                items-center

                px-6
                sm:px-10
                md:px-14
                lg:px-16
              `,children:e.jsxs("div",{className:`
                  max-w-[700px]

                  text-white
                `,children:[s.eyebrow&&e.jsx(g,{light:!0,children:s.eyebrow}),(s.headingLine1||s.headingLine2)&&e.jsxs("h1",{className:`
                      mt-6
                      sm:mt-8

                      text-[40px]
                      sm:text-[50px]
                      md:text-[60px]
                      xl:text-[66px]

                      leading-[1.02]

                      tracking-[-0.035em]

                      font-normal
                    `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:[s.headingLine1,s.headingLine2&&e.jsxs(e.Fragment,{children:[e.jsx("br",{}),s.headingLine2]})]}),s.description&&e.jsx("p",{className:`
                      mt-6
                      sm:mt-8

                      max-w-[520px]

                      text-[12px]
                      sm:text-[13px]

                      leading-[1.75]

                      text-white/80
                    `,style:{fontFamily:"Montserrat, sans-serif"},children:s.description})]})})]})}),e.jsx("section",{className:`
            py-10
            sm:py-12
            lg:py-16
          `}),c.length>0&&e.jsx("section",{className:`
              pb-16
              sm:pb-20
              lg:pb-28
            `,children:e.jsx("div",{className:`
                max-w-[1750px]
                mx-auto

                px-5
                sm:px-6
                xl:px-10
              `,children:e.jsx("div",{className:`
                  space-y-16
                  sm:space-y-20
                  lg:space-y-28
                `,children:c.map((n,o)=>{const r=Array.isArray(n.objectives)?n.objectives:[];return e.jsxs("article",{className:`
                          grid
                          grid-cols-1
                          lg:grid-cols-2

                          items-center

                          gap-9
                          lg:gap-16
                          xl:gap-24
                        `,children:[e.jsx("div",{children:e.jsxs("div",{className:`
                              relative

                              overflow-hidden

                              bg-[#efedea]
                            `,children:[n.image?e.jsx("img",{src:n.image,alt:n.imageAlt||n.title||"",loading:"lazy",className:`
                                  w-full

                                  h-[320px]
                                  sm:h-[420px]
                                  lg:h-[520px]

                                  object-cover

                                  transition-transform
                                  duration-700

                                  hover:scale-[1.03]
                                `}):e.jsx("div",{className:`
                                  w-full

                                  h-[320px]
                                  sm:h-[420px]
                                  lg:h-[520px]

                                  bg-[#efedea]
                                `}),e.jsx("div",{className:`
                                absolute

                                left-0
                                bottom-0

                                min-w-[78px]
                                h-[65px]

                                sm:min-w-[90px]
                                sm:h-[76px]

                                flex
                                items-center
                                justify-center

                                bg-white
                              `,children:e.jsx("span",{className:`
                                  text-[28px]
                                  sm:text-[34px]

                                  text-[#161412]
                                `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:String(o+1).padStart(2,"0")})})]})}),e.jsxs("div",{children:[n.eyebrow&&e.jsx(g,{children:n.eyebrow}),n.title&&e.jsx("h2",{className:`
                                mt-6
                                sm:mt-7

                                max-w-[620px]

                                text-[34px]
                                sm:text-[42px]
                                lg:text-[48px]

                                leading-[1.06]

                                tracking-[-0.03em]

                                text-[#161412]
                              `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:n.title}),n.description&&e.jsx("p",{className:`
                                mt-6

                                max-w-[620px]

                                text-[12px]
                                sm:text-[14px]

                                leading-[1.8]

                                text-[#5e5955]
                              `,style:{fontFamily:"Montserrat, sans-serif"},children:n.description}),r.length>0&&e.jsxs("div",{className:`
                                mt-8

                                pt-7

                                border-t
                                border-[#d8d4cf]
                              `,children:[e.jsx("h3",{className:`
                                  text-[10px]
                                  sm:text-[11px]

                                  font-semibold

                                  uppercase
                                  tracking-[0.08em]

                                  text-[#262320]
                                `,style:{fontFamily:"Montserrat, sans-serif"},children:"Learning Objectives"}),e.jsx("div",{className:`
                                  mt-5

                                  space-y-3
                                `,children:r.map((u,f)=>e.jsxs("div",{className:`
                                        flex
                                        items-start

                                        gap-4
                                      `,children:[e.jsx("span",{className:`
                                          mt-[2px]

                                          w-[20px]
                                          h-[20px]

                                          shrink-0

                                          flex
                                          items-center
                                          justify-center

                                          border
                                          border-[#c7c2bd]

                                          text-[9px]

                                          font-semibold

                                          text-[#c91f26]
                                        `,style:{fontFamily:"Montserrat, sans-serif"},children:String(f+1).padStart(2,"0")}),e.jsx("p",{className:`
                                          text-[11px]
                                          sm:text-[13px]

                                          leading-[1.7]

                                          text-[#69645f]
                                        `,style:{fontFamily:"Montserrat, sans-serif"},children:u})]},`${u}-${f}`))})]}),Array.isArray(n.bottomDescriptions)&&n.bottomDescriptions.length>0&&e.jsx("div",{className:`
        mt-7
        space-y-3
      `,children:n.bottomDescriptions.map((u,f)=>e.jsx("p",{className:`
              max-w-[620px]

              text-[12px]
              sm:text-[14px]

              leading-[1.8]

              text-[#5e5955]
            `,style:{fontFamily:"Montserrat, sans-serif"},children:u},`${u}-${f}`))}),n.buttonText&&e.jsx("div",{className:"mt-8",children:e.jsx(w,{onClick:()=>h(n),children:n.buttonText})})]})]},n.id||`${n.title}-${o}`)})})})}),e.jsx("div",{className:`
            h-12
            sm:h-16
          `})]}),x&&e.jsx(N,{course:x,onClose:()=>h(null)}),e.jsx("style",{children:`
          .ceu-input {
            width: 100%;
            height: 48px;

            padding-left: 14px;
            padding-right: 14px;

            border: 1px solid #d8d4cf;

            outline: none;

            border-radius: 0;

            font-family: Montserrat, sans-serif;
            font-size: 12px;

            color: #262320;

            transition:
              border-color 0.3s ease,
              box-shadow 0.3s ease;
          }

          .ceu-input::placeholder {
            color: #aaa6a1;
          }

          .ceu-input:focus {
            border-color: #161412;

            box-shadow:
              inset 0 -1px 0 #161412;
          }
        `})]})};export{C as default};
