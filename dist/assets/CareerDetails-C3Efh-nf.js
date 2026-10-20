import{b as C,r as o,j as e,L as f}from"./index-TrkQfYJp.js";const v="https://backend.ultrastones.com/api",L=[{value:"ZERO_TO_TWO",label:"0 - 2 Years"},{value:"THREE_TO_FIVE",label:"3 - 5 Years"},{value:"FIVE_PLUS",label:"5+ Years"}],w={firstName:"",lastName:"",email:"",phone:"",message:"",experienceLevel:"",yearsOfExperience:"",resume:null,coverLetter:null},_=c=>String(c||"").toLowerCase().replace(/_/g," ").replace(/\b\w/g,n=>n.toUpperCase()),F=c=>{if(!c)return"";const n=new Date(c);return Number.isNaN(n.getTime())?"":n.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})},S=()=>{const{slug:c}=C(),[n,b]=o.useState(null),[k,p]=o.useState(!0),[j,h]=o.useState(""),[t,N]=o.useState(w),[g,y]=o.useState(!1),[u,l]=o.useState({type:"",text:""});o.useEffect(()=>{let r=!0;return c?(async()=>{try{p(!0),h("");const a=await fetch(`${v}/careers/jobs/${encodeURIComponent(c)}`),d=await a.json();if(!a.ok)throw new Error(d.message||"Failed to load this position");r&&b(d.data||null)}catch(a){console.error("Career Detail Error:",a),r&&(b(null),h(a.message||"Unable to load this position."))}finally{r&&p(!1)}})():(p(!1),h("Job slug is missing.")),()=>{r=!1}},[c]);const i=r=>{const{name:s,value:a,files:d}=r.target,m=s==="resume"||s==="coverLetter";l({type:"",text:""}),N(x=>({...x,[s]:m?d?.[0]||null:a}))},E=async r=>{if(r.preventDefault(),!n?.id){l({type:"error",text:"This position is currently unavailable."});return}if(!t.firstName.trim()){l({type:"error",text:"Please enter your first name."});return}if(!t.lastName.trim()){l({type:"error",text:"Please enter your last name."});return}if(!t.email.trim()){l({type:"error",text:"Please enter your email address."});return}if(!t.resume){l({type:"error",text:"Please upload your resume."});return}try{y(!0),l({type:"",text:""});const s=new FormData;s.append("application_type","JOB_APPLICATION"),s.append("job_id",n.id),s.append("first_name",t.firstName.trim()),s.append("last_name",t.lastName.trim()),s.append("email",t.email.trim()),s.append("phone",t.phone.trim()),s.append("department",n.department||""),s.append("message",t.message.trim()),s.append("source_page",`/careers/${n.slug}`),t.experienceLevel&&s.append("experience_level",t.experienceLevel),t.yearsOfExperience!==""&&s.append("years_of_experience",t.yearsOfExperience),s.append("resume",t.resume),t.coverLetter&&s.append("cover_letter",t.coverLetter);const a=await fetch(`${v}/careers/applications`,{method:"POST",body:s}),d=await a.json();if(!a.ok)throw new Error(d.message||"Failed to submit application");l({type:"success",text:"Your application has been submitted successfully."}),N(w);const m=document.getElementById("job-resume-file"),x=document.getElementById("job-cover-letter-file");m&&(m.value=""),x&&(x.value="")}catch(s){console.error("Application Submission Error:",s),l({type:"error",text:s.message||"Failed to submit your application."})}finally{y(!1)}};return k?e.jsx(e.Fragment,{children:e.jsx("div",{className:`
            min-h-screen
            pt-[110px]
            flex
            items-center
            justify-center
          `,children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:`
                inline-block
                w-10
                h-10
                border-[3px]
                border-[#e5e5e5]
                border-t-[#c91f26]
                rounded-full
                animate-spin
              `}),e.jsx("p",{className:"mt-4 text-[#777]",children:"Loading position..."})]})})}):j||!n?e.jsx(e.Fragment,{children:e.jsx("div",{className:`
            min-h-screen
            pt-[110px]
            flex
            items-center
            justify-center
            px-6
          `,children:e.jsxs("div",{className:"text-center max-w-[600px]",children:[e.jsx("h1",{className:`
                text-[38px]
                text-[#161412]
              `,style:{fontFamily:'"Cormorant Garamond", serif'},children:"Position Not Available"}),e.jsx("p",{className:"mt-4 text-[#666]",children:j||"This career opportunity is no longer available."}),e.jsx(f,{to:"/career",className:`
                inline-block
                mt-8
                bg-[#c91f26]
                text-white
                px-7
                py-3
                hover:bg-[#a9191f]
                duration-300
              `,children:"View All Careers"})]})})}):e.jsx(e.Fragment,{children:e.jsxs("div",{className:"min-h-screen pt-[110px]",children:[e.jsx("section",{className:"py-12",children:e.jsxs("div",{className:"max-w-[1650px] mx-auto px-6 xl:px-10",children:[e.jsxs("p",{className:"text-[13px] text-[#777] mb-5",children:[e.jsx(f,{to:"/",className:"hover:text-[#161412]",children:"Home"})," / ",e.jsx(f,{to:"/career",className:"hover:text-[#161412]",children:"Careers"})," / ",e.jsx("span",{className:"font-semibold text-[#161412]",children:n.title})]}),e.jsx("h1",{className:`
                text-[38px]
                md:text-[52px]
                text-[#161412]
              `,style:{fontFamily:'"Cormorant Garamond", serif'},children:n.title}),e.jsxs("div",{className:"flex flex-wrap gap-3 mt-6",children:[n.employment_type&&e.jsx("span",{className:`
                    px-4
                    py-2
                    bg-white
                    border
                    border-[#e5e5e5]
                    text-[14px]
                  `,children:_(n.employment_type)}),n.work_mode&&e.jsx("span",{className:`
                    px-4
                    py-2
                    bg-white
                    border
                    border-[#e5e5e5]
                    text-[14px]
                  `,children:_(n.work_mode)}),n.location&&e.jsx("span",{className:`
                    px-4
                    py-2
                    bg-white
                    border
                    border-[#e5e5e5]
                    text-[14px]
                  `,children:n.location}),n.department&&e.jsx("span",{className:`
                    px-4
                    py-2
                    bg-[#c91f26]
                    text-white
                    text-[14px]
                  `,children:n.department})]})]})}),e.jsx("section",{className:"pb-20",children:e.jsx("div",{className:"max-w-[1650px] mx-auto px-6 xl:px-10",children:e.jsxs("div",{className:"grid lg:grid-cols-[1fr_500px] gap-10 xl:gap-16",children:[e.jsxs("main",{children:[e.jsxs("div",{className:`
                    grid
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                    mb-12
                  `,children:[n.experience_required&&e.jsxs("div",{className:"border border-[#e5e5e5] p-5",children:[e.jsx("p",{className:"text-[12px] uppercase tracking-wide text-[#888]",children:"Experience"}),e.jsx("p",{className:"mt-2 text-[#222] font-medium",children:n.experience_required})]}),n.education_required&&e.jsxs("div",{className:"border border-[#e5e5e5] p-5",children:[e.jsx("p",{className:"text-[12px] uppercase tracking-wide text-[#888]",children:"Education"}),e.jsx("p",{className:"mt-2 text-[#222] font-medium",children:n.education_required})]}),n.vacancies&&e.jsxs("div",{className:"border border-[#e5e5e5] p-5",children:[e.jsx("p",{className:"text-[12px] uppercase tracking-wide text-[#888]",children:"Vacancies"}),e.jsx("p",{className:"mt-2 text-[#222] font-medium",children:n.vacancies})]}),n.closing_date&&e.jsxs("div",{className:"border border-[#e5e5e5] p-5",children:[e.jsx("p",{className:"text-[12px] uppercase tracking-wide text-[#888]",children:"Closing Date"}),e.jsx("p",{className:"mt-2 text-[#222] font-medium",children:F(n.closing_date)})]}),n.salary_range&&e.jsxs("div",{className:"border border-[#e5e5e5] p-5",children:[e.jsx("p",{className:"text-[12px] uppercase tracking-wide text-[#888]",children:"Salary Range"}),e.jsx("p",{className:"mt-2 text-[#222] font-medium",children:n.salary_range})]})]}),(n.office_hours||n.location)&&e.jsx("div",{className:"mb-12",children:e.jsxs("p",{className:`
                        text-[#555]
                        leading-[1.9]
                        whitespace-pre-line
                      `,children:[n.office_hours?`Office Hours: ${n.office_hours}`:"",n.office_hours&&n.location?`
`:"",n.location||""]})}),n.summary&&e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-[#c91f26] font-semibold text-[20px] mb-4",children:"Job Summary"}),e.jsx("p",{className:`
                        text-[#444]
                        leading-[1.9]
                        whitespace-pre-line
                      `,children:n.summary})]}),n.responsibilities?.length>0&&e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-[#c91f26] font-semibold text-[20px] mb-4",children:"Responsibilities"}),e.jsx("ul",{className:"list-disc pl-6 space-y-2 text-[#444] leading-[1.8]",children:n.responsibilities.map((r,s)=>e.jsx("li",{children:r},`${r}-${s}`))})]}),n.qualifications?.length>0&&e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-[#c91f26] font-semibold text-[20px] mb-4",children:"Qualifications"}),e.jsx("ul",{className:"list-disc pl-6 space-y-2 text-[#444] leading-[1.8]",children:n.qualifications.map((r,s)=>e.jsx("li",{children:r},`${r}-${s}`))})]}),n.skills_required?.length>0&&e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-[#c91f26] font-semibold text-[20px] mb-4",children:"Required Skills"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:n.skills_required.map((r,s)=>e.jsx("span",{className:`
                              px-4
                              py-2
                              bg-[#f5f5f5]
                              text-[#444]
                              text-sm
                            `,children:r},`${r}-${s}`))})]}),n.benefits?.length>0&&e.jsxs("section",{className:"mb-10",children:[e.jsx("h2",{className:"text-[#c91f26] font-semibold text-[20px] mb-4",children:"Benefits"}),e.jsx("ul",{className:"list-disc pl-6 space-y-2 text-[#444] leading-[1.8]",children:n.benefits.map((r,s)=>e.jsx("li",{children:r},`${r}-${s}`))})]}),(n.how_to_apply||n.contact_phone||n.contact_email)&&e.jsxs("section",{children:[e.jsx("h2",{className:"text-[#c91f26] font-semibold text-[20px] mb-4",children:"How To Apply"}),n.how_to_apply&&e.jsx("p",{className:`
                          text-[#444]
                          leading-[1.9]
                          whitespace-pre-line
                        `,children:n.how_to_apply}),e.jsxs("div",{className:"mt-5 space-y-2 text-[#444]",children:[n.contact_phone&&e.jsxs("p",{children:["Phone:"," ",e.jsx("a",{href:`tel:${n.contact_phone}`,className:"hover:text-[#c91f26]",children:n.contact_phone})]}),n.contact_email&&e.jsxs("p",{children:["Email:"," ",e.jsx("a",{href:`mailto:${n.contact_email}`,className:"hover:text-[#c91f26]",children:n.contact_email})]})]})]})]}),e.jsxs("aside",{className:`
                  bg-white
                  border
                  border-[#e5e5e5]
                  rounded-xl
                  p-6
                  md:p-8
                  h-fit
                  lg:sticky
                  lg:top-[140px]
                `,children:[e.jsx("h2",{className:`
                    text-[28px]
                    text-[#161412]
                    mb-2
                  `,style:{fontFamily:'"Cormorant Garamond", serif'},children:"Apply for This Position"}),e.jsx("p",{className:"text-sm text-[#666] mb-6",children:"Complete the form and attach your latest resume."}),u.text&&e.jsx("div",{className:`
                      mb-5
                      p-3
                      text-sm
                      border
                      ${u.type==="success"?"bg-green-50 border-green-200 text-green-700":"bg-red-50 border-red-200 text-red-700"}
                    `,children:u.text}),e.jsxs("form",{onSubmit:E,className:"space-y-5",children:[e.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"firstName",className:"block text-sm font-medium mb-2",children:"First Name*"}),e.jsx("input",{id:"firstName",type:"text",name:"firstName",required:!0,placeholder:"First Name",value:t.firstName,onChange:i,className:`
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                          focus:border-[#c91f26]
                        `})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"lastName",className:"block text-sm font-medium mb-2",children:"Last Name*"}),e.jsx("input",{id:"lastName",type:"text",name:"lastName",required:!0,placeholder:"Last Name",value:t.lastName,onChange:i,className:`
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                          focus:border-[#c91f26]
                        `})]})]}),e.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"email",className:"block text-sm font-medium mb-2",children:"Email*"}),e.jsx("input",{id:"email",type:"email",name:"email",required:!0,placeholder:"Email",value:t.email,onChange:i,className:`
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                          focus:border-[#c91f26]
                        `})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"phone",className:"block text-sm font-medium mb-2",children:"Phone Number*"}),e.jsx("input",{id:"phone",type:"tel",name:"phone",required:!0,placeholder:"Phone Number",value:t.phone,onChange:i,className:`
                          w-full
                          h-[52px]
                          border
                          border-[#ddd]
                          px-4
                          outline-none
                          focus:border-[#c91f26]
                        `})]})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"message",className:"block text-sm font-medium mb-2",children:"Message*"}),e.jsx("textarea",{id:"message",rows:6,name:"message",required:!0,placeholder:"Tell us about yourself...",value:t.message,onChange:i,className:`
                        w-full
                        border
                        border-[#ddd]
                        p-4
                        resize-none
                        outline-none
                        focus:border-[#c91f26]
                      `})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"yearsOfExperience",className:"block text-sm font-medium mb-2",children:"Years of Experience"}),e.jsx("input",{id:"yearsOfExperience",type:"number",name:"yearsOfExperience",min:"0",placeholder:"Example: 3",value:t.yearsOfExperience,onChange:i,className:`
                        w-full
                        h-[52px]
                        border
                        border-[#ddd]
                        px-4
                        outline-none
                        focus:border-[#c91f26]
                      `})]}),e.jsxs("fieldset",{children:[e.jsx("legend",{className:"block text-sm font-medium mb-3",children:"Experience Level"}),e.jsx("div",{className:"space-y-3",children:L.map(r=>e.jsxs("label",{className:"flex items-center gap-2 cursor-pointer",children:[e.jsx("input",{type:"radio",name:"experienceLevel",value:r.value,checked:t.experienceLevel===r.value,onChange:i}),e.jsx("span",{children:r.label})]},r.value))})]}),e.jsxs("div",{children:[e.jsx("label",{className:`
      block
      text-sm
      font-medium
      mb-3
      text-[#333]
    `,children:"Resume*"}),e.jsx("input",{id:"job-resume-file",type:"file",name:"resume",required:!0,accept:".pdf,.doc,.docx",onChange:i,className:"hidden"}),e.jsxs("label",{htmlFor:"job-resume-file",className:`
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
      `,children:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",className:"w-5 h-5","aria-hidden":"true",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4.25A1.75 1.75 0 006.75 20h10.5A1.75 1.75 0 0019 18.25V14"})})}),t.resume?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:`
            text-[14px]
            font-semibold
            text-[#161412]
            max-w-full
            truncate
          `,children:t.resume.name}),e.jsx("span",{className:"mt-1 text-[12px] text-[#777]",children:"Click to replace file"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:`
            text-[15px]
            font-semibold
            text-[#161412]
          `,children:"Upload Your Resume"}),e.jsx("span",{className:"mt-1 text-[12px] text-[#777]",children:"Click here to select a file"})]}),e.jsx("span",{className:"mt-3 text-[11px] text-[#999]",children:"PDF, DOC or DOCX"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:`
      block
      text-sm
      font-medium
      mb-3
      text-[#333]
    `,children:"Cover Letter"}),e.jsx("input",{id:"job-cover-letter-file",type:"file",name:"coverLetter",accept:".pdf,.doc,.docx",onChange:i,className:"hidden"}),e.jsxs("label",{htmlFor:"job-cover-letter-file",className:`
      group
      flex
      flex-col
      items-center
      justify-center
      w-full
      min-h-[125px]
      px-5
      py-5
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
        w-10
        h-10
        mb-3
        rounded-full
        bg-white
        border
        border-[#e5e5e5]
        text-[#c91f26]
        transition-all
        duration-300
        group-hover:border-[#c91f26]
      `,children:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",className:"w-5 h-5","aria-hidden":"true",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4.25A1.75 1.75 0 006.75 20h10.5A1.75 1.75 0 0019 18.25V14"})})}),t.coverLetter?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:`
            text-[14px]
            font-semibold
            text-[#161412]
            max-w-full
            truncate
          `,children:t.coverLetter.name}),e.jsx("span",{className:"mt-1 text-[12px] text-[#777]",children:"Click to replace file"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:`
            text-[15px]
            font-semibold
            text-[#161412]
          `,children:"Upload Cover Letter"}),e.jsx("span",{className:"mt-1 text-[12px] text-[#777]",children:"Optional document"})]}),e.jsx("span",{className:"mt-3 text-[11px] text-[#999]",children:"PDF, DOC or DOCX"})]})]}),e.jsx("button",{type:"submit",disabled:g,className:`
                      w-full
                      bg-[#c91f26]
                      hover:bg-[#a91a20]
                      text-white
                      px-10
                      py-3
                      font-medium
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      transition-all
                    `,children:g?"Submitting...":"Submit Application"})]})]})]})})})]})})};export{S as default};
