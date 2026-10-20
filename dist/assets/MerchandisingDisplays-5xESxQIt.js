import{c as N,r as m,j as n,d as q,a as k,f as C,X as S}from"./index-TrkQfYJp.js";import{S as M}from"./shield-check-mw5jPwf2.js";const F=[["path",{d:"M12 17V3",key:"1cwfxf"}],["path",{d:"m6 11 6 6 6-6",key:"12ii2o"}],["path",{d:"M19 21H5",key:"150jfl"}]],P=N("arrow-down-to-line",F);const D=[["path",{d:"m11 17 2 2a1 1 0 1 0 3-3",key:"efffak"}],["path",{d:"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",key:"9pr0kb"}],["path",{d:"m21 3 1 11h-2",key:"1tisrp"}],["path",{d:"M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3",key:"1uvwmv"}],["path",{d:"M3 4h8",key:"1ep09j"}]],E=N("handshake",D);const L=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],A=N("layers",L);const R=[["path",{d:"m14 10 7-7",key:"oa77jy"}],["path",{d:"M20 10h-6V4",key:"mjg0md"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M4 14h6v6",key:"rmj7iw"}]],_=N("minimize-2",R),w=({children:c,light:p=!1})=>n.jsxs("div",{className:`
        flex
        items-center
        gap-3

        text-[10px]
        sm:text-[11px]
        lg:text-[12px]

        font-semibold
        uppercase
        tracking-[0.06em]

        ${p?"text-white/95":"text-[#262320]"}
      `,style:{fontFamily:"Montserrat, sans-serif"},children:[n.jsx("span",{children:c}),n.jsx("span",{className:`
          text-[#e67e22]

          text-[17px]
          leading-none
        `,children:"→"})]}),v=({children:c,onClick:p,light:d=!1,type:e="button"})=>n.jsxs("button",{type:e,onClick:p,className:`
        inline-flex
        items-center
        justify-between

        gap-8

        min-w-[165px]
        h-[42px]

        px-5

        border

        text-[9px]
        sm:text-[10px]

        font-semibold
        uppercase
        tracking-[0.04em]

        transition-all
        duration-300

        ${d?`
                border-white/45
                text-white

                hover:bg-white
                hover:border-white
                hover:text-[#161412]
              `:`
                border-[#000]
                text-[#161412]

                hover:bg-[#161412]
                hover:border-[#161412]
                hover:text-white
              `}
      `,style:{fontFamily:"Montserrat, sans-serif"},children:[n.jsx("span",{children:c}),n.jsx("span",{className:"text-[#e67e22]",children:"→"})]}),j=({icon:c,line1:p,line2:d})=>n.jsxs("div",{className:`
        flex
        flex-col
        items-center

        text-center
      `,children:[n.jsx("div",{className:`
          h-[48px]

          flex
          items-center
          justify-center
        `,children:n.jsx(c,{size:33,strokeWidth:1.1,className:"text-[#161412]"})}),n.jsxs("p",{className:`
          mt-3

          text-[8px]
          sm:text-[9px]

          leading-[1.45]

          uppercase

          text-[#393532]
        `,style:{fontFamily:"Montserrat, sans-serif"},children:[p,n.jsx("br",{}),d]})]}),o=({label:c,required:p=!1,children:d})=>n.jsxs("div",{children:[n.jsxs("label",{className:`
          block

          mb-2

          text-[9px]
          sm:text-[10px]

          font-semibold
          uppercase
          tracking-[0.08em]

          text-[#4f4a46]
        `,style:{fontFamily:"Montserrat, sans-serif"},children:[c,p&&n.jsxs("span",{className:"text-[#c91f26]",children:[" ","*"]})]}),d]}),T=({displays:c,selectedDisplay:p,onClose:d})=>{const[e,y]=m.useState({name:"",email:"",phone:"",company:"",display:p?.name||"",concernedPersonName:"",concernedPersonPhone:"",streetAddress:"",suiteNumber:"",city:"",county:"",state:"",zipCode:"",message:""}),[t,f]=m.useState(!1);m.useEffect(()=>{const a=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=a}},[]),m.useEffect(()=>{const a=r=>{r.key==="Escape"&&!t&&d()};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[d,t]);const i=a=>{const{name:r,value:l}=a.target;y(x=>({...x,[r]:l}))},h=async a=>{if(a.preventDefault(),t)return;if(!e.name.trim()||!e.email.trim()||!e.phone.trim()||!e.company.trim()||!e.display.trim()||!e.streetAddress.trim()||!e.city.trim()||!e.state.trim()||!e.zipCode.trim()){alert("Please fill all required fields.");return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email.trim())){alert("Please enter a valid email address.");return}try{f(!0);const l="https://backend.ultrastones.com/api",x={name:e.name.trim(),email:e.email.trim().toLowerCase(),phone:e.phone.trim(),company:e.company.trim(),display:e.display.trim(),concerned_person_name:e.concernedPersonName.trim(),concerned_person_phone:e.concernedPersonPhone.trim(),street_address:e.streetAddress.trim(),suite_number:e.suiteNumber.trim(),city:e.city.trim(),county:e.county.trim(),state:e.state.trim(),zip_code:e.zipCode.trim(),message:e.message.trim()};console.log("DISPLAY REQUEST PAYLOAD:",x);const s=await k.post(`${l}/display-request`,x,{headers:{"Content-Type":"application/json"}});if(console.log("DISPLAY REQUEST RESPONSE:",s.data),s.data?.success===!1)throw new Error(s.data?.message||"Failed to submit display request.");alert(s.data?.message||"Display request submitted successfully."),d()}catch(l){console.error("DISPLAY REQUEST FAILED:",l),console.error("STATUS:",l.response?.status),console.error("BACKEND RESPONSE:",l.response?.data),console.error("REQUEST URL:",l.config?.url),alert(l.response?.data?.message||l.message||"Unable to submit display request. Please try again.")}finally{f(!1)}};return C.createPortal(n.jsxs("div",{className:`
        fixed
        inset-0

        z-[99999]

        flex
        items-center
        justify-center

        p-4
        sm:p-6
      `,children:[n.jsx("button",{type:"button","aria-label":"Close display request form",onClick:t?void 0:d,className:`
          absolute
          inset-0

          w-full
          h-full

          bg-black/65

          backdrop-blur-[2px]
        `}),n.jsxs("div",{className:`
          relative
          z-10

          w-full
          max-w-[820px]

          max-h-[92vh]

          overflow-y-auto

          bg-white

          shadow-[0_30px_90px_rgba(0,0,0,0.28)]
        `,children:[n.jsx("div",{className:`
            h-[4px]
            w-full

            bg-[#e67e22]
          `}),n.jsxs("div",{className:`
            px-5
            sm:px-8
            md:px-10

            py-7
            sm:py-9
          `,children:[n.jsxs("div",{className:`
              flex
              items-start
              justify-between

              gap-6
            `,children:[n.jsxs("div",{children:[n.jsx(w,{children:"Merchandising Display Request"}),n.jsx("h2",{className:`
                  mt-5

                  text-[32px]
                  sm:text-[38px]
                  md:text-[42px]

                  leading-[1.06]

                  tracking-[-0.03em]

                  text-[#161412]
                `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:"Request a Display"}),n.jsx("p",{className:`
                  mt-4

                  max-w-[590px]

                  text-[12px]
                  sm:text-[13px]

                  leading-[1.75]

                  text-[#77716c]
                `,style:{fontFamily:"Montserrat, sans-serif"},children:"Complete the form below and our team will contact you regarding display availability, specifications and next steps."})]}),n.jsx("button",{type:"button",onClick:d,disabled:t,className:`
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

                disabled:opacity-50
                disabled:cursor-not-allowed
              `,"aria-label":"Close",children:n.jsx(S,{size:17})})]}),e.display&&n.jsxs("div",{className:`
                mt-7

                bg-[#faf4eb]

                px-5
                py-4

                border-l-[3px]
                border-[#e67e22]
              `,children:[n.jsx("span",{className:`
                  text-[9px]
                  sm:text-[10px]

                  font-semibold
                  uppercase
                  tracking-[0.1em]

                  text-[#77716c]
                `,style:{fontFamily:"Montserrat, sans-serif"},children:"Selected Request"}),n.jsx("h3",{className:`
                  mt-2

                  text-[17px]
                  sm:text-[19px]

                  text-[#161412]
                `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:e.display})]}),n.jsxs("form",{onSubmit:h,className:"mt-7",children:[n.jsxs("div",{className:`
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-x-5
                gap-y-5
              `,children:[n.jsx(o,{label:"Full Name",required:!0,children:n.jsx("input",{required:!0,disabled:t,type:"text",name:"name",value:e.name,onChange:i,placeholder:"Your name",autoComplete:"name",className:"display-request-input"})}),n.jsx(o,{label:"Email",required:!0,children:n.jsx("input",{required:!0,disabled:t,type:"email",name:"email",value:e.email,onChange:i,placeholder:"name@company.com",autoComplete:"email",className:"display-request-input"})}),n.jsx(o,{label:"Phone",required:!0,children:n.jsx("input",{required:!0,disabled:t,type:"tel",name:"phone",value:e.phone,onChange:i,placeholder:"Phone number",autoComplete:"tel",className:"display-request-input"})}),n.jsx(o,{label:"Company / Firm",required:!0,children:n.jsx("input",{required:!0,disabled:t,type:"text",name:"company",value:e.company,onChange:i,placeholder:"Company or firm",autoComplete:"organization",className:"display-request-input"})})]}),n.jsx("div",{className:"mt-5",children:n.jsx(o,{label:"Display / Request Type",required:!0,children:n.jsxs("select",{required:!0,disabled:t,name:"display",value:e.display,onChange:i,className:`
                    display-request-input
                    bg-white
                  `,children:[n.jsx("option",{value:"",children:"Select display or request type"}),c.map((a,r)=>n.jsx("option",{value:a.name||"",children:a.name||`Display ${r+1}`},a.id||`${a.name}-${r}`)),n.jsx("option",{value:"Update Tower",children:"Update Tower"}),n.jsx("option",{value:"Update Sample",children:"Update Sample"})]})})}),n.jsxs("div",{className:`
                mt-5

                grid
                grid-cols-1
                sm:grid-cols-2

                gap-x-5
                gap-y-5
              `,children:[n.jsx(o,{label:"Concerned Person Name (Optional)",children:n.jsx("input",{disabled:t,type:"text",name:"concernedPersonName",value:e.concernedPersonName,onChange:i,placeholder:"Contact person name",className:"display-request-input"})}),n.jsx(o,{label:"Concerned Person Phone (Optional)",children:n.jsx("input",{disabled:t,type:"tel",name:"concernedPersonPhone",value:e.concernedPersonPhone,onChange:i,placeholder:"Contact person phone",className:"display-request-input"})})]}),n.jsx("div",{className:`
                mt-8
                mb-5

                pt-6

                border-t
                border-[#e2ded9]
              `,children:n.jsx("h3",{className:`
                  text-[11px]
                  sm:text-[12px]

                  font-semibold
                  uppercase
                  tracking-[0.08em]

                  text-[#161412]
                `,style:{fontFamily:"Montserrat, sans-serif"},children:"Address"})}),n.jsxs("div",{className:`
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-x-5
                gap-y-5
              `,children:[n.jsx(o,{label:"Street Address",required:!0,children:n.jsx("input",{required:!0,disabled:t,type:"text",name:"streetAddress",value:e.streetAddress,onChange:i,placeholder:"Street address",autoComplete:"address-line1",className:"display-request-input"})}),n.jsx(o,{label:"Suite Number (Optional)",children:n.jsx("input",{disabled:t,type:"text",name:"suiteNumber",value:e.suiteNumber,onChange:i,placeholder:"Suite, unit, apt, etc.",autoComplete:"address-line2",className:"display-request-input"})}),n.jsx(o,{label:"City",required:!0,children:n.jsx("input",{required:!0,disabled:t,type:"text",name:"city",value:e.city,onChange:i,placeholder:"City",autoComplete:"address-level2",className:"display-request-input"})}),n.jsx(o,{label:"County (Optional)",children:n.jsx("input",{disabled:t,type:"text",name:"county",value:e.county,onChange:i,placeholder:"County",className:"display-request-input"})}),n.jsx(o,{label:"State",required:!0,children:n.jsx("input",{required:!0,disabled:t,type:"text",name:"state",value:e.state,onChange:i,placeholder:"State",autoComplete:"address-level1",className:"display-request-input"})}),n.jsx(o,{label:"ZIP Code",required:!0,children:n.jsx("input",{required:!0,disabled:t,type:"text",name:"zipCode",value:e.zipCode,onChange:i,placeholder:"ZIP code",autoComplete:"postal-code",className:"display-request-input"})})]}),n.jsx("div",{className:"mt-7",children:n.jsxs(o,{label:"Additional Notes",children:[n.jsx("textarea",{disabled:t,name:"message",value:e.message,onChange:i,rows:4,placeholder:"Tell us about your display, tower or sample requirements...",className:`
                    display-request-input

                    h-auto
                    min-h-[110px]

                    py-3

                    resize-none
                  `}),n.jsx("p",{className:`
                    mt-2

                    text-[9px]
                    sm:text-[10px]

                    leading-[1.6]

                    text-[#8b8681]
                  `,style:{fontFamily:"Montserrat, sans-serif"},children:"If there is a convenient time for our team to contact or visit you, please mention it above."})]})}),n.jsxs("div",{className:`
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
              `,children:[n.jsx("p",{className:`
                  max-w-[400px]

                  text-[10px]
                  sm:text-[11px]

                  leading-[1.65]

                  text-[#8b8681]
                `,style:{fontFamily:"Montserrat, sans-serif"},children:"Our team will follow up regarding availability, specifications and next steps."}),n.jsxs("button",{type:"submit",disabled:t,className:`
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

                  hover:bg-[#e67e22]
                  hover:border-[#e67e22]

                  transition-all
                  duration-300

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                `,style:{fontFamily:"Montserrat, sans-serif"},children:[n.jsx("span",{children:t?"Submitting...":"Submit Request"}),!t&&n.jsx("span",{children:"→"})]})]})]})]})]})]}),document.body)},O=()=>{const[c,p]=m.useState(null),[d,e]=m.useState(!0),[y,t]=m.useState(null);m.useEffect(()=>{const s=new AbortController;return(async()=>{try{const b=(await k.get("https://backend.ultrastones.com/api/pages/merchandising-displays",{signal:s.signal})).data;b.success&&p(b.data)}catch(u){u.name!=="CanceledError"&&u.code!=="ERR_CANCELED"&&console.error("Error fetching Merchandising Displays page:",u)}finally{e(!1)}})(),()=>{s.abort()}},[]);const f=s=>{!s||s==="#"||window.open(s,"_blank","noopener,noreferrer")},i=(s=null)=>{t({display:s})};if(d)return n.jsx(q,{});if(!c)return n.jsx("div",{className:`
          min-h-screen

          pt-[90px]
          sm:pt-[110px]

          flex
          items-center
          justify-center

          px-6

          text-center
        `,children:"Page not found"});const h=c.content||{},a=h.hero||{},r=h.displaySection||{},l=Array.isArray(r.items)?r.items:[],x=h.cta||{};return n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:`
          min-h-screen

          pt-[90px]
          sm:pt-[110px]

          bg-white
        `,children:[n.jsx("section",{children:n.jsxs("div",{className:`
              relative

              h-[500px]
              sm:h-[570px]
              lg:h-[620px]
              xl:h-[650px]

              overflow-hidden

              bg-[#161412]
            `,children:[a.image&&n.jsx("img",{src:a.image,alt:a.imageAlt||a.headingLine1||"Merchandising Displays",className:`
                  absolute
                  inset-0

                  w-full
                  h-full

                  object-cover
                  object-center
                `}),n.jsx("div",{className:`
                absolute
                inset-0

                bg-black/35
              `}),n.jsx("div",{className:`
                absolute
                inset-0

                bg-gradient-to-r

                from-black/75
                via-black/35
                to-transparent
              `}),n.jsx("div",{className:`
                absolute
                inset-0

                flex
                items-center

                px-6
                sm:px-10
                md:px-12
                lg:px-16
                xl:px-[5vw]
              `,children:n.jsxs("div",{className:`
                  w-full
                  max-w-[620px]

                  text-white
                `,children:[n.jsx(w,{light:!0,children:a.eyebrow||"Merchandising Display"}),n.jsxs("h1",{className:`
                    mt-7

                    text-[40px]
                    sm:text-[50px]
                    md:text-[56px]
                    lg:text-[60px]
                    xl:text-[64px]

                    leading-[0.99]

                    tracking-[-0.035em]

                    font-normal
                  `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:[a.headingLine1||"Designed to display,",n.jsx("br",{}),a.headingLine2||"built to inspire"]}),n.jsx("p",{className:`
                    mt-6

                    max-w-[480px]

                    text-[11px]
                    sm:text-[12px]
                    lg:text-[13px]

                    leading-[1.7]

                    text-white/85
                  `,style:{fontFamily:"Montserrat, sans-serif"},children:a.description||"Purpose-built merchandising solutions that bring our surface collections into your showroom."}),n.jsx("div",{className:"mt-7",children:n.jsx(v,{light:!0,onClick:()=>i(),children:a.buttonText||"Request a Display"})})]})}),n.jsx("div",{className:`
                absolute

                left-6
                right-6
                bottom-5

                sm:left-10
                sm:right-10

                lg:left-16
                lg:right-16
              `,children:n.jsxs("p",{className:`
                  text-[9px]
                  sm:text-[10px]
                  lg:text-[11px]

                  font-medium
                  uppercase

                  tracking-[0.02em]

                  text-white/90
                `,style:{fontFamily:"Montserrat, sans-serif"},children:["For Dealers"," • ","Fabricators"," • ","Design Studios"," • ","Showrooms"]})})]})}),n.jsx("section",{className:`
            bg-[#faf4eb]

            py-14
            sm:py-16
            lg:py-20
          `,children:n.jsx("div",{className:`
              max-w-[1650px]
              mx-auto

              px-6
              sm:px-8
              lg:px-12
              xl:px-16
            `,children:n.jsxs("div",{className:`
                grid
                grid-cols-1
                lg:grid-cols-[1fr_0.82fr]

                items-center

                gap-12
                lg:gap-16
                xl:gap-20
              `,children:[n.jsxs("div",{children:[n.jsx(w,{children:r.eyebrow||"The Display Program"}),n.jsx("h2",{className:`
                    mt-6

                    max-w-[700px]

                    text-[34px]
                    sm:text-[40px]
                    lg:text-[46px]
                    xl:text-[50px]

                    leading-[1.08]

                    tracking-[-0.03em]

                    text-[#161412]
                  `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:r.heading||"Bring the Ultra Stones experience to your showroom."}),n.jsx("p",{className:`
                    mt-6

                    max-w-[650px]

                    text-[11px]
                    sm:text-[12px]
                    lg:text-[13px]

                    leading-[1.8]

                    text-[#504b47]
                  `,style:{fontFamily:"Montserrat, sans-serif"},children:r.description||"Our merchandising displays are designed to present stone samples clearly, beautifully, and efficiently—helping customers explore colors, patterns, and collections with confidence."}),n.jsxs("div",{className:`
                    mt-8
                    sm:mt-10

                    grid
                    grid-cols-2
                    sm:grid-cols-4

                    gap-y-8
                    gap-x-4

                    max-w-[650px]
                  `,children:[n.jsx(j,{icon:A,line1:"Premium",line2:"Presentation"}),n.jsx(j,{icon:_,line1:"Space",line2:"Efficient"}),n.jsx(j,{icon:M,line1:"Built To",line2:"Last"}),n.jsx(j,{icon:E,line1:"Support That",line2:"Sells"})]})]}),n.jsx("div",{className:`
                  flex
                  items-center
                  justify-center

                  lg:justify-end
                `,children:n.jsx("div",{className:`
                    relative

                    w-[310px]
                    sm:w-[370px]
                    lg:w-[430px]
                    xl:w-[470px]

                    aspect-square

                    rounded-full

                    bg-white

                    flex
                    items-center
                    justify-center
                  `,children:(r.image||l[1]?.image||l[0]?.image)&&n.jsx("img",{src:r.image||l[1]?.image||l[0]?.image,alt:r.imageAlt||"Ultra Stones merchandising display",className:`
                        w-[62%]
                        h-[82%]

                        object-contain
                      `})})})]})})}),l.length>0&&n.jsx("section",{className:"bg-[#f4f4f4]",children:n.jsx("div",{className:`
                max-w-[1650px]
                mx-auto

                px-6
                sm:px-8
                lg:px-12
                xl:px-16
              `,children:l.map((s,g)=>{const u=g%2===1,b=String(g+1).padStart(2,"0");return n.jsxs("article",{className:`
                        grid
                        grid-cols-1
                        lg:grid-cols-2

                        items-center

                        gap-10
                        lg:gap-14
                        xl:gap-20

                        py-12
                        sm:py-14
                        lg:py-16
                        xl:py-[70px]

                        ${g!==l.length-1?`
                                border-b
                                border-[#d8d8d8]
                              `:""}
                      `,children:[n.jsx("div",{className:u?"lg:order-1":"lg:order-2",children:n.jsx("div",{className:`
                            relative

                            mx-auto

                            w-[280px]
                            sm:w-[350px]
                            md:w-[390px]
                            lg:w-[430px]
                            xl:w-[470px]

                            aspect-square

                            rounded-full

                            bg-white

                            flex
                            items-center
                            justify-center

                            overflow-hidden
                          `,children:s.image?n.jsx("img",{src:s.image,alt:s.imageAlt||s.name||"Display",loading:"lazy",className:`
                                w-[75%]
                                h-[75%]

                                object-contain

                                transition-transform
                                duration-700

                                hover:scale-[1.035]
                              `}):n.jsx("div",{className:`
                                w-[70%]
                                h-[70%]

                                bg-[#f1f1f1]
                              `})})}),n.jsxs("div",{className:u?"lg:order-2":"lg:order-1",children:[n.jsx("span",{className:`
                            text-[18px]
                            sm:text-[20px]
                            lg:text-[21px]

                            font-semibold

                            text-[#e67e22]
                          `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:b}),s.name&&n.jsx("h2",{className:`
                              mt-4

                              max-w-[720px]

                              text-[32px]
                              sm:text-[38px]
                              lg:text-[43px]
                              xl:text-[47px]

                              leading-[1.08]

                              uppercase

                              tracking-[-0.025em]

                              text-[#161412]
                            `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:s.name}),s.description&&n.jsx("p",{className:`
                              mt-4

                              max-w-[620px]

                              text-[13px]
                              sm:text-[14px]
                              lg:text-[15px]
                              xl:text-[16px]

                              leading-[1.7]

                              text-[#363230]
                            `,style:{fontFamily:"Montserrat, sans-serif"},children:s.description}),s.size&&n.jsx("p",{className:`
                              mt-3

                              text-[12px]
                              sm:text-[13px]
                              lg:text-[14px]
                              xl:text-[15px]

                              font-medium

                              leading-[1.6]

                              text-[#363230]
                            `,style:{fontFamily:"Montserrat, sans-serif"},children:s.size}),n.jsxs("div",{className:`
                            mt-6

                            flex
                            flex-wrap
                            items-center

                            gap-x-7
                            gap-y-4
                          `,children:[s.detailLink&&s.detailLink!=="#"&&n.jsxs("a",{href:s.detailLink,className:`
                                  inline-flex
                                  items-center
                                  gap-4

                                  text-[10px]
                                  sm:text-[11px]
                                  lg:text-[12px]

                                  font-semibold
                                  uppercase
                                  tracking-[0.03em]

                                  text-[#e67e22]

                                  hover:text-[#161412]

                                  transition-colors
                                  duration-300
                                `,style:{fontFamily:"Montserrat, sans-serif"},children:[n.jsx("span",{children:"View Details"}),n.jsx("span",{className:`
                                    text-[18px]
                                    leading-none
                                  `,children:"→"})]}),s.detailLink&&s.detailLink!=="#"&&s.pdfUrl&&s.pdfUrl!=="#"&&n.jsx("span",{className:`
                                  hidden
                                  sm:block

                                  w-px
                                  h-[34px]

                                  bg-[#bfbfbf]
                                `}),s.pdfUrl&&s.pdfUrl!=="#"&&n.jsxs("button",{type:"button",onClick:()=>f(s.pdfUrl),className:`
                                  inline-flex
                                  items-center
                                  gap-4

                                  text-[10px]
                                  sm:text-[11px]
                                  lg:text-[12px]

                                  font-semibold
                                  uppercase
                                  tracking-[0.03em]

                                  text-[#161412]

                                  hover:text-[#e67e22]

                                  transition-colors
                                  duration-300
                                `,style:{fontFamily:"Montserrat, sans-serif"},children:[n.jsx("span",{children:s.buttonText||"Download Spec Sheet"}),n.jsx(P,{size:15,strokeWidth:1.6,className:"text-[#c91f26]"})]}),n.jsxs("button",{type:"button",onClick:()=>i(s),className:`
                              inline-flex
                              items-center
                              gap-4

                              text-[10px]
                              sm:text-[11px]
                              lg:text-[12px]

                              font-semibold
                              uppercase
                              tracking-[0.03em]

                              text-[#161412]

                              hover:text-[#e67e22]

                              transition-colors
                              duration-300
                            `,style:{fontFamily:"Montserrat, sans-serif"},children:[n.jsx("span",{children:"Request Display"}),n.jsx("span",{className:`
                                text-[18px]
                                leading-none

                                text-[#e67e22]
                              `,children:"→"})]})]})]})]},s.id||`${s.name}-${g}`)})})}),n.jsx("section",{id:"request-display",className:`
            bg-[#f9b877]

            py-10
            sm:py-12
            lg:py-14
          `,children:n.jsx("div",{className:`
              max-w-[1550px]
              mx-auto

              px-6
              sm:px-8
              lg:px-12
              xl:px-14
            `,children:n.jsxs("div",{className:`
                grid
                grid-cols-1

                lg:grid-cols-[0.95fr_1fr]

                items-center

                gap-10
                lg:gap-12
                xl:gap-16
              `,children:[n.jsx("div",{className:`
                  flex
                  items-center
                  justify-center
                `,children:n.jsxs("div",{className:`
                    grid

                    grid-cols-[95px_260px_105px]
                    sm:grid-cols-[115px_300px_125px]
                    lg:grid-cols-[125px_330px_135px]

                    items-center

                    w-fit
                    max-w-full
                  `,children:[n.jsxs("div",{className:`
                      flex
                      flex-col
                      justify-between

                      h-[205px]
                      sm:h-[230px]
                      lg:h-[255px]

                      py-6
                    `,children:[n.jsxs("div",{className:`
                        flex
                        items-center

                        text-right
                      `,children:[n.jsxs("span",{className:`
                          flex-1

                          pr-3

                          text-[8px]
                          sm:text-[9px]
                          lg:text-[10px]

                          font-medium
                          uppercase

                          leading-[1.4]

                          text-[#161412]
                        `,style:{fontFamily:"Montserrat, sans-serif"},children:["Easy Sample",n.jsx("br",{}),"Access"]}),n.jsx("span",{className:`
                          w-[6px]
                          h-[6px]

                          shrink-0

                          rounded-full

                          bg-[#161412]
                        `}),n.jsx("span",{className:`
                          w-[28px]
                          sm:w-[34px]

                          h-px

                          shrink-0

                          bg-[#161412]
                        `})]}),n.jsxs("div",{className:`
                        flex
                        items-center

                        text-right
                      `,children:[n.jsxs("span",{className:`
                          flex-1

                          pr-3

                          text-[8px]
                          sm:text-[9px]
                          lg:text-[10px]

                          font-medium
                          uppercase

                          leading-[1.4]

                          text-[#161412]
                        `,style:{fontFamily:"Montserrat, sans-serif"},children:["High-Capacity",n.jsx("br",{}),"Display"]}),n.jsx("span",{className:`
                          w-[6px]
                          h-[6px]

                          shrink-0

                          rounded-full

                          bg-[#161412]
                        `}),n.jsx("span",{className:`
                          w-[28px]
                          sm:w-[34px]

                          h-px

                          shrink-0

                          bg-[#161412]
                        `})]})]}),n.jsx("div",{className:`
                      relative

                      w-[260px]
                      sm:w-[300px]
                      lg:w-[330px]

                      aspect-square

                      rounded-full

                      bg-white

                      flex
                      items-center
                      justify-center

                      shrink-0

                      overflow-visible
                    `,children:(x.image||l[1]?.image||l[0]?.image)&&n.jsx("img",{src:x.image||l[1]?.image||l[0]?.image,alt:x.imageAlt||"Merchandising display",className:`
                          absolute

                          left-1/2
                          top-1/2

                          -translate-x-1/2
                          -translate-y-1/2

                          w-auto

                          h-[112%]
                          sm:h-[116%]
                          lg:h-[120%]

                          max-w-none

                          object-contain

                          z-10
                        `})}),n.jsxs("div",{className:`
                      flex
                      flex-col
                      justify-between

                      h-[205px]
                      sm:h-[230px]
                      lg:h-[255px]

                      py-6
                    `,children:[n.jsxs("div",{className:`
                        flex
                        items-center
                      `,children:[n.jsx("span",{className:`
                          w-[28px]
                          sm:w-[34px]

                          h-px

                          shrink-0

                          bg-[#161412]
                        `}),n.jsx("span",{className:`
                          w-[6px]
                          h-[6px]

                          shrink-0

                          rounded-full

                          bg-[#161412]
                        `}),n.jsxs("span",{className:`
                          pl-3

                          text-[8px]
                          sm:text-[9px]
                          lg:text-[10px]

                          font-medium
                          uppercase

                          leading-[1.4]

                          text-[#161412]
                        `,style:{fontFamily:"Montserrat, sans-serif"},children:["Compact",n.jsx("br",{}),"Footprint"]})]}),n.jsxs("div",{className:`
                        flex
                        items-center
                      `,children:[n.jsx("span",{className:`
                          w-[28px]
                          sm:w-[34px]

                          h-px

                          shrink-0

                          bg-[#161412]
                        `}),n.jsx("span",{className:`
                          w-[6px]
                          h-[6px]

                          shrink-0

                          rounded-full

                          bg-[#161412]
                        `}),n.jsxs("span",{className:`
                          pl-3

                          text-[8px]
                          sm:text-[9px]
                          lg:text-[10px]

                          font-medium
                          uppercase

                          leading-[1.4]

                          text-[#161412]
                        `,style:{fontFamily:"Montserrat, sans-serif"},children:["Organized",n.jsx("br",{}),"Presentation"]})]})]})]})}),n.jsxs("div",{className:`
                  max-w-[600px]

                  lg:pl-1
                `,children:[n.jsx(w,{children:x.eyebrow||"Designed For The Showroom"}),n.jsxs("h2",{className:`
                    mt-4

                    text-[34px]
                    sm:text-[39px]
                    lg:text-[43px]
                    xl:text-[46px]

                    leading-[1.02]

                    tracking-[-0.035em]

                    text-[#161412]
                  `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:[x.titleLine1||"More surface.",n.jsx("br",{}),x.titleLine2||"Less footprint."]}),n.jsx("p",{className:`
                    mt-5

                    max-w-[590px]

                    text-[11px]
                    sm:text-[12px]
                    lg:text-[13px]

                    leading-[1.7]

                    text-[#292522]
                  `,style:{fontFamily:"Montserrat, sans-serif"},children:x.description||"Our displays are engineered to maximize sample capacity while maintaining a clean, modern look that elevates your showroom space."}),n.jsx("div",{className:"mt-5",children:n.jsx(v,{onClick:()=>i(),children:x.buttonText||"Request a Display"})})]})]})})}),n.jsx("div",{className:`
            h-6
            sm:h-8

            bg-white
          `})]}),y&&n.jsx(T,{displays:l,selectedDisplay:y.display,onClose:()=>t(null)}),n.jsx("style",{children:`
          .display-request-input {
            width: 100%;
            height: 48px;

            padding-left: 14px;
            padding-right: 14px;

            border: 1px solid #d8d4cf;

            outline: none;

            border-radius: 0;

            background: #ffffff;

            font-family: Montserrat, sans-serif;
            font-size: 12px;

            color: #262320;

            transition:
              border-color 0.3s ease,
              box-shadow 0.3s ease;
          }

          .display-request-input::placeholder {
            color: #aaa6a1;
          }

          .display-request-input:focus {
            border-color: #161412;

            box-shadow:
              inset 0 -1px 0 #161412;
          }

          .display-request-input:disabled {
            cursor: not-allowed;

            opacity: 0.6;

            background: #f5f5f5;
          }

          textarea.display-request-input {
            height: auto;
          }
        `})]})};export{O as default};
