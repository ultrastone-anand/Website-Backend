import{r as a,j as e,L as w}from"./index-TrkQfYJp.js";import{P as g}from"./index-DWVfANWl.js";const C="https://backend.ultrastones.com/api",x={employmentType:"",location:"",department:""},J={departments:[],locations:[],employmentTypes:[],workModes:[]},I={fullName:"",email:"",phone:"",department:"",message:"",resume:null},S=l=>String(l||"").toLowerCase().replace(/_/g," ").replace(/\b\w/g,o=>o.toUpperCase()),O=l=>{const o=String(l||"").trim().split(/\s+/).filter(Boolean);return{firstName:o[0]||"",lastName:o.slice(1).join(" ")||"-"}},y=({name:l,value:o,onChange:i,children:u})=>e.jsxs("div",{className:"relative",children:[e.jsx("select",{name:l,value:o,onChange:i,className:`
        w-full
        h-[58px]
        bg-white
        border
        border-[#e5e5e5]
        px-5
        pr-12
        appearance-none
        outline-none
        text-[#555]
        cursor-pointer
        transition-colors
        focus:border-[#c91f26]
      `,children:u}),e.jsx("svg",{className:`
        absolute
        right-5
        top-1/2
        -translate-y-1/2
        w-4
        h-4
        pointer-events-none
        text-[#555]
      `,viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",children:e.jsx("path",{fillRule:"evenodd",d:"M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z",clipRule:"evenodd"})})]});y.propTypes={name:g.string.isRequired,value:g.string.isRequired,onChange:g.func.isRequired,children:g.node.isRequired};const G=()=>{const[l,o]=a.useState([]),[i,u]=a.useState(x),[j,M]=a.useState(J),[d,F]=a.useState(!0),[h,R]=a.useState(""),[r,E]=a.useState(I),[_,k]=a.useState(!1),[N,m]=a.useState({type:"",text:""}),L=a.useCallback(async()=>{try{const n=await fetch(`${C}/careers/jobs/filters`),t=await n.json();if(!n.ok)throw new Error(t.message||"Failed to load job filters");M({departments:t.data?.departments||[],locations:t.data?.locations||[],employmentTypes:t.data?.employmentTypes||[],workModes:t.data?.workModes||[]})}catch(n){console.error("Career Filters Error:",n)}},[]),f=a.useCallback(async(n=x)=>{try{F(!0),R("");const t=new URLSearchParams;t.set("page","1"),t.set("limit","100"),n.employmentType&&t.set("employment_type",n.employmentType),n.location&&t.set("location",n.location),n.department&&t.set("department",n.department);const c=await fetch(`${C}/careers/jobs?${t.toString()}`),s=await c.json();if(!c.ok)throw new Error(s.message||"Failed to load career jobs");o(s.data||[])}catch(t){console.error("Career Jobs Error:",t),o([]),R(t.message||"Unable to load career jobs.")}finally{F(!1)}},[]);a.useEffect(()=>{L(),f(x)},[L,f]);const v=n=>{const{name:t,value:c}=n.target;u(s=>({...s,[t]:c}))},P=()=>{f(i)},A=()=>{u(x),f(x)},p=n=>{const{name:t,value:c,files:s}=n.target;m({type:"",text:""}),E(b=>({...b,[t]:t==="resume"?s?.[0]||null:c}))},q=async n=>{n.preventDefault();const{firstName:t,lastName:c}=O(r.fullName);if(!t){m({type:"error",text:"Please enter your full name."});return}if(!r.email.trim()){m({type:"error",text:"Please enter your email address."});return}if(!r.resume){m({type:"error",text:"Please upload your resume."});return}try{k(!0),m({type:"",text:""});const s=new FormData;s.append("application_type","GENERAL_RESUME"),s.append("first_name",t),s.append("last_name",c),s.append("email",r.email.trim()),s.append("phone",r.phone.trim()),s.append("department",r.department.trim()),s.append("message",r.message.trim()),s.append("source_page","/careers"),s.append("resume",r.resume);const b=await fetch(`${C}/careers/applications`,{method:"POST",body:s}),U=await b.json();if(!b.ok)throw new Error(U.message||"Failed to submit resume");m({type:"success",text:"Your resume has been submitted successfully."}),E(I);const T=document.getElementById("general-resume-file");T&&(T.value="")}catch(s){console.error("Resume Submission Error:",s),m({type:"error",text:s.message||"Failed to submit your resume."})}finally{k(!1)}},D=!!(i.employmentType||i.location||i.department);return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"min-h-screen pt-[110px]",children:[e.jsx("section",{className:"py-12",children:e.jsxs("div",{className:"max-w-[1650px] mx-auto px-6 xl:px-10",children:[e.jsx("h1",{className:`
                text-[34px]
                md:text-[42px]
                font-semibold
                text-[#161412]
              `,style:{fontFamily:"Montserrat, sans-serif"},children:"Careers"}),e.jsx("div",{className:"w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4"}),e.jsxs("p",{className:"text-[13px] text-[#777]",children:[e.jsx(w,{to:"/",className:"hover:text-[#161412]",children:"Home"})," / ",e.jsx(w,{to:"/resource-center",className:"hover:text-[#161412]",children:"Resource Center"})," / ",e.jsx("span",{className:"font-semibold text-[#161412]",children:"Careers"})]})]})}),e.jsx("section",{className:"pb-20",children:e.jsxs("div",{className:"max-w-[1650px] mx-auto px-6 xl:px-10",children:[e.jsxs("div",{className:"grid md:grid-cols-4 gap-4 mb-4",children:[e.jsxs(y,{name:"employmentType",value:i.employmentType,onChange:v,children:[e.jsx("option",{value:"",children:"All Job Types"}),j.employmentTypes.map(n=>e.jsx("option",{value:n,children:S(n)},n))]}),e.jsxs(y,{name:"location",value:i.location,onChange:v,children:[e.jsx("option",{value:"",children:"All Locations"}),j.locations.map(n=>e.jsx("option",{value:n,children:n},n))]}),e.jsxs(y,{name:"department",value:i.department,onChange:v,children:[e.jsx("option",{value:"",children:"All Departments"}),j.departments.map(n=>e.jsx("option",{value:n,children:n},n))]}),e.jsx("button",{type:"button",onClick:P,disabled:d,className:`
                  h-[58px]
                  bg-[#c91f26]
                  text-white
                  font-medium
                  hover:bg-[#a9191f]
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  duration-300
                `,children:d?"Searching...":"Search Jobs"})]}),e.jsx("div",{className:"min-h-[32px] mb-8 text-right",children:D&&e.jsx("button",{type:"button",onClick:A,disabled:d,className:`
                    text-sm
                    text-[#777]
                    underline
                    hover:text-[#c91f26]
                    disabled:opacity-50
                  `,children:"Clear Filters"})}),e.jsxs("div",{className:"grid lg:grid-cols-[1fr_360px] gap-10",children:[e.jsxs("div",{className:"bg-white",children:[d&&e.jsxs("div",{className:"py-20 text-center",children:[e.jsx("div",{className:`
                        inline-block
                        w-9
                        h-9
                        border-[3px]
                        border-[#e5e5e5]
                        border-t-[#c91f26]
                        rounded-full
                        animate-spin
                      `}),e.jsx("p",{className:"mt-4 text-[#777]",children:"Loading available positions..."})]}),!d&&h&&e.jsx("div",{className:`
                        py-12
                        px-6
                        border
                        border-red-200
                        bg-red-50
                        text-red-700
                      `,children:h}),!d&&!h&&l.length===0&&e.jsxs("div",{className:`
                        py-16
                        px-6
                        text-center
                        border
                        border-[#e5e5e5]
                      `,children:[e.jsx("h2",{className:`
                          text-[28px]
                          text-[#161412]
                        `,style:{fontFamily:'"Cormorant Garamond", serif'},children:"No Positions Found"}),e.jsx("p",{className:"mt-3 text-[#666]",children:"No current openings match the selected filters."})]}),!d&&!h&&l.map((n,t)=>e.jsx("article",{className:`
                          py-10
                          px-6
                          ${t!==l.length-1?"border-b border-[#e5e5e5]":""}
                        `,children:e.jsxs("div",{className:"flex flex-col lg:flex-row justify-between gap-8",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex flex-wrap gap-2 mb-4",children:[n.department&&e.jsx("span",{className:`
                                    px-3
                                    py-1
                                    bg-[#f7f7f7]
                                    text-[12px]
                                    text-[#555]
                                  `,children:n.department}),n.employment_type&&e.jsx("span",{className:`
                                    px-3
                                    py-1
                                    border
                                    border-[#e5e5e5]
                                    text-[12px]
                                    text-[#555]
                                  `,children:S(n.employment_type)}),n.work_mode&&e.jsx("span",{className:`
                                    px-3
                                    py-1
                                    border
                                    border-[#e5e5e5]
                                    text-[12px]
                                    text-[#555]
                                  `,children:S(n.work_mode)}),n.is_featured&&e.jsx("span",{className:`
                                    px-3
                                    py-1
                                    bg-[#c91f26]
                                    text-white
                                    text-[12px]
                                  `,children:"Featured"})]}),e.jsx("h2",{className:`
                                text-[26px]
                                md:text-[34px]
                                text-[#161412]
                                mb-4
                              `,style:{fontFamily:'"Cormorant Garamond", serif'},children:n.title}),e.jsx("p",{className:`
                                text-[#555]
                                leading-[1.8]
                                max-w-[900px]
                              `,children:n.short_description||"Explore this career opportunity at Ultra Stones."}),e.jsxs("div",{className:"flex flex-wrap gap-x-6 gap-y-2 mt-5 text-[13px] text-[#777]",children:[n.experience_required&&e.jsxs("span",{children:["Experience:"," ",n.experience_required]}),n.vacancies&&e.jsxs("span",{children:["Vacancies:"," ",n.vacancies]}),n.salary_range&&e.jsxs("span",{children:["Salary:"," ",n.salary_range]})]})]}),e.jsxs("div",{className:`
                              flex
                              flex-col
                              lg:items-end
                              gap-4
                              min-w-[190px]
                            `,children:[e.jsx("span",{className:"text-sm text-[#777]",children:n.location||"Location not specified"}),e.jsx(w,{to:`/careers/${n.slug}`,className:`
                                bg-[#c91f26]
                                text-white
                                px-6
                                py-3
                                text-sm
                                text-center
                                hover:bg-[#a9191f]
                                duration-300
                              `,children:"More Details"})]})]})},n.id))]}),e.jsxs("aside",{className:`
                  bg-white
                  border
                  border-[#e5e5e5]
                  p-6
                  h-fit
                  lg:sticky
                  lg:top-[140px]
                `,children:[e.jsx("h3",{className:`
                    text-[24px]
                    text-[#161412]
                    mb-3
                  `,style:{fontFamily:'"Cormorant Garamond", serif'},children:"Submit Your Resume"}),e.jsx("p",{className:`
                    text-[14px]
                    text-[#666]
                    mb-6
                    leading-relaxed
                  `,children:"Didn't find the right opening? Upload your resume and we'll get in touch when something matches."}),N.text&&e.jsx("div",{className:`
                      mb-5
                      p-3
                      text-sm
                      border
                      ${N.type==="success"?"bg-green-50 border-green-200 text-green-700":"bg-red-50 border-red-200 text-red-700"}
                    `,children:N.text}),e.jsxs("form",{onSubmit:q,className:"space-y-4",children:[e.jsx("input",{type:"text",name:"fullName",required:!0,placeholder:"Full Name*",value:r.fullName,onChange:p,className:`
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                      focus:border-[#c91f26]
                    `}),e.jsx("input",{type:"email",name:"email",required:!0,placeholder:"Email*",value:r.email,onChange:p,className:`
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                      focus:border-[#c91f26]
                    `}),e.jsx("input",{type:"tel",name:"phone",placeholder:"Phone Number",value:r.phone,onChange:p,className:`
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                      focus:border-[#c91f26]
                    `}),e.jsx("input",{type:"text",name:"department",placeholder:"Preferred Department",value:r.department,onChange:p,className:`
                      w-full
                      h-[50px]
                      border
                      border-[#ddd]
                      px-4
                      outline-none
                      focus:border-[#c91f26]
                    `}),e.jsx("textarea",{rows:5,name:"message",placeholder:"Tell us about yourself",value:r.message,onChange:p,className:`
                      w-full
                      border
                      border-[#ddd]
                      px-4
                      py-3
                      resize-none
                      outline-none
                      focus:border-[#c91f26]
                    `}),e.jsxs("div",{children:[e.jsx("label",{className:`
      block
      text-sm
      font-medium
      text-[#333]
      mb-2
    `,children:"Resume*"}),e.jsx("input",{id:"general-resume-file",type:"file",name:"resume",required:!0,accept:".pdf,.doc,.docx",onChange:p,className:"hidden"}),e.jsxs("label",{htmlFor:"general-resume-file",className:`
      group
      flex
      flex-col
      items-center
      justify-center
      w-full
      min-h-[145px]
      px-5
      py-6
      border-2
      border-dashed
      border-[#d4d4d4]
      bg-[#fafafa]
      cursor-pointer
      text-center
      transition-all
      duration-300
      hover:border-[#c91f26]
      hover:bg-[#fffafa]
    `,children:[e.jsx("div",{className:`
        flex
        items-center
        justify-center
        w-11
        h-11
        mb-3
        rounded-full
        bg-white
        border
        border-[#e5e5e5]
        text-[#c91f26]
        transition-all
        duration-300
        group-hover:border-[#c91f26]
      `,children:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",className:"w-5 h-5","aria-hidden":"true",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4.25A1.75 1.75 0 006.75 20h10.5A1.75 1.75 0 0019 18.25V14"})})}),r.resume?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:`
            text-[14px]
            font-semibold
            text-[#161412]
            max-w-full
            truncate
          `,children:r.resume.name}),e.jsx("span",{className:"mt-1 text-[12px] text-[#777]",children:"Click to replace file"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:`
            text-[15px]
            font-semibold
            text-[#161412]
          `,children:"Upload Your Resume"}),e.jsx("span",{className:"mt-1 text-[12px] text-[#777]",children:"Click here to select a file"})]}),e.jsx("span",{className:`
        mt-3
        text-[11px]
        text-[#999]
      `,children:"PDF, DOC or DOCX"})]})]}),e.jsx("button",{type:"submit",disabled:_,className:`
                      w-full
                      h-[52px]
                      bg-[#c91f26]
                      text-white
                      font-medium
                      hover:bg-[#a9191f]
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      duration-300
                    `,children:_?"Submitting...":"Submit Resume"})]})]})]})]})})]})})};export{G as default};
