import{u as p,r as x,j as n,d as g,L as f,g as h,a as j}from"./index-TrkQfYJp.js";const y=(i="")=>i.split(" ").map(l=>l.charAt(0)).join("").substring(0,2).toUpperCase();function v(){const i=p(),[l,d]=x.useState([]),[u,m]=x.useState(!0);return x.useEffect(()=>{const e=new AbortController;return(async()=>{try{const a=(await j.get("https://backend.ultrastones.com/api/stones",{signal:e.signal})).data;if(a.success){const r=a.data.filter(s=>s.is_active===!0&&s.parent_id===null).sort((s,c)=>s.slug==="ultra-quartz"?-1:c.slug==="ultra-quartz"||s.slug==="atlas-plan"?1:c.slug==="atlas-plan"?-1:s.name.localeCompare(c.name,void 0,{sensitivity:"base"}));d(r),d(r)}}catch(t){t.code!=="ERR_CANCELED"&&t.name!=="CanceledError"&&console.error("Error fetching materials:",t)}finally{m(!1)}})(),()=>{e.abort()}},[]),u?n.jsx(g,{}):n.jsx(n.Fragment,{children:n.jsxs("div",{className:`
          min-h-screen
          pt-[110px]
        `,children:[n.jsx("section",{children:n.jsxs("div",{className:`
              max-w-[1650px]
              mx-auto
              px-6
              xl:px-10
            `,children:[n.jsx("h1",{className:`
                text-[34px]
                md:text-[42px]
                font-semibold
                text-[#161412]
                leading-none
              `,style:{fontFamily:"Montserrat, sans-serif"},children:"Material Portfolio"}),n.jsx("div",{className:`
                w-[70px]
                h-[4px]
                bg-[#c91f26]
                mt-4
                mb-4
              `}),n.jsxs("p",{className:`
                text-[13px]
                text-[#777]
              `,style:{fontFamily:"Montserrat, sans-serif"},children:[n.jsx(f,{to:"/",className:`
                  hover:text-[#161412]
                  duration-300
                `,children:"Home"})," / ",n.jsx("span",{className:"text-[#161412]",children:n.jsx("b",{children:"Material Portfolio"})})]}),n.jsxs("p",{className:`
                text-[13px]
                text-[#777]
                mt-3
              `,style:{fontFamily:"Montserrat, sans-serif"},children:["Showing all"," ",l.length," ","categories"]})]})}),n.jsx("section",{className:`
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
            py-15
          `,children:n.jsx("div",{className:`
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-8
            `,children:l.map(e=>{const o=e.thumbnail_url||e.banner_url||null,t=o?h(o,1600,90):null;return n.jsxs("div",{onClick:()=>i(`/product-category/${e.slug}`),className:`
                      group
                      cursor-pointer
                    `,children:[n.jsxs("div",{className:`
                        relative
                        aspect-[4/5]
                        overflow-hidden
                        bg-[#ececec]
                      `,children:[t&&n.jsx("img",{src:t,alt:e.name,loading:"lazy",decoding:"async",draggable:!1,onError:a=>{a.currentTarget.style.display="none";const r=a.currentTarget.parentElement?.querySelector("[data-image-fallback]");r&&(r.style.display="flex")},className:`
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                            object-center
                            select-none

                            transition-transform
                            duration-700
                            ease-out

                            group-hover:scale-[1.025]
                          `}),n.jsx("div",{"data-image-fallback":!0,style:{display:t?"none":"flex"},className:`
                          absolute
                          inset-0
                          items-center
                          justify-center

                          bg-gradient-to-br
                          from-neutral-100
                          to-neutral-300

                          text-[#555]
                          text-6xl
                          font-bold
                          tracking-wider
                          select-none
                        `,children:y(e.name)})]}),n.jsxs("div",{className:`
                        flex
                        items-center
                        justify-between

                        border-b
                        border-[#e5e5e5]

                        py-5
                      `,children:[n.jsxs("div",{children:[n.jsx("h2",{className:`
                            text-[18px]
                            font-semibold
                            text-[#161412]
                          `,style:{fontFamily:"Montserrat, sans-serif"},children:e.name}),n.jsx("p",{className:`
                            text-[12px]
                            text-[#888]
                            uppercase
                            tracking-[2px]
                            mt-1
                          `,children:"Explore Collection"})]}),n.jsx("div",{className:`
                          text-[22px]

                          transition-transform
                          duration-300

                          group-hover:translate-x-2
                        `,children:"→"})]})]},e.id)})})})]})})}export{v as default};
