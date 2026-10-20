import{r,j as e,d as p,L as x,a as m}from"./index-TrkQfYJp.js";const f=()=>{const[n,i]=r.useState(null),[o,d]=r.useState(!0);if(r.useEffect(()=>{(async()=>{try{const l=(await m.get("https://backend.ultrastones.com/api/pages/our-process")).data;l.success&&i(l.data)}catch(t){console.error("Error fetching Our Process page:",t)}finally{d(!1)}})()},[]),o)return e.jsx(p,{});if(!n)return e.jsx(e.Fragment,{children:e.jsx("div",{className:" min-h-screen pt-[110px] flex items-center justify-center",children:"Page not found"})});const a=n.content||{},c=a.processSteps||[];return e.jsx(e.Fragment,{children:e.jsxs("div",{className:" min-h-screen pt-[110px]",children:[e.jsx("section",{children:e.jsxs("div",{className:"max-w-[1650px] mx-auto px-6 xl:px-10",children:[e.jsx("h1",{className:"text-[34px] md:text-[42px] font-semibold text-[#161412]",style:{fontFamily:"Montserrat, sans-serif"},children:a.pageHeader?.heading||n.title||"Our Process"}),e.jsx("div",{className:"w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4"}),e.jsxs("p",{className:"text-[13px] text-[#777]",style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx(x,{to:"/",className:"hover:text-[#161412] duration-300",children:"Home"})," / ",e.jsx(x,{to:"/",className:"hover:text-[#161412] duration-300",children:"Ultra Experience"})," / ",e.jsx("span",{className:"text-[#161412] font-semibold",children:a.pageHeader?.heading||"Our Process"})]})]})}),e.jsx("section",{className:"py-5",children:e.jsx("div",{className:"max-w-[1650px] mx-auto px-3 xl:px-5",children:e.jsxs("div",{className:"space-y-12 mt-16",children:[c.map((s,t)=>e.jsxs("div",{className:`
                    flex
                    flex-col
                    lg:flex-row
                    items-start
                    gap-0
                  `,children:[e.jsx("div",{className:`
                      w-full
                      lg:w-[500px]
                      xl:w-[600px]
                      shrink-0
                    `,children:e.jsx("img",{src:s.image,alt:s.imageAlt||s.title,className:`
                        w-full
                        h-[320px]
                        xl:h-[380px]
                        object-cover
                      `})}),e.jsxs("div",{className:`
                      flex-1
                      bg-transparent
                      relative
                    `,children:[e.jsx("div",{className:`
                        h-[42px]
                        w-[340px]
                        bg-gradient-to-r
                        from-[#d71920]
                        to-[#f5e4e4]
                        flex
                        items-center
                        px-5
                        text-white
                        text-[24px]
                        font-semibold
                      `,children:s.title}),e.jsx("div",{className:"pt-12 px-12 flex-1",children:e.jsx("p",{className:`
                          text-[20px]
                          leading-[26px]
                          text-[#555]
                          mb-8
                        `,children:s.description})})]})]},s.id||t)),c.length===0&&e.jsx("div",{className:"text-center text-gray-500 py-16",children:"No process steps found."})]})})})]})})};export{f as default};
