import{r as d,j as n,d as N,a as v,L as w}from"./index-TrkQfYJp.js";const o=({children:x,light:r=!1,centered:m=!1})=>n.jsxs("div",{className:`
        flex
        items-center
        gap-3

        ${m?"justify-center":""}

        text-[11px]
        sm:text-[12px]
        lg:text-[13px]

        font-semibold
        uppercase
        tracking-[0.08em]

        ${r?"text-white/90":"text-[#262320]"}
      `,style:{fontFamily:"Montserrat, sans-serif"},children:[n.jsx("span",{children:x}),n.jsx("span",{className:`
          text-[#c91f26]
          text-[16px]
          leading-none
        `,children:"→"})]}),g=({children:x,to:r="/",light:m=!1})=>n.jsxs(w,{to:r,className:`
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

        ${m?`
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
      `,style:{fontFamily:"Montserrat, sans-serif"},children:[n.jsx("span",{children:x}),n.jsx("span",{className:"text-[#c91f26]",children:"→"})]}),L=()=>{const[x,r]=d.useState(null),[m,u]=d.useState(!0);if(d.useEffect(()=>{(async()=>{try{const j=(await v.get("https://backend.ultrastones.com/api/pages/about-us")).data;j.success&&r(j.data)}catch(t){console.error("Error fetching About Us page:",t)}finally{u(!1)}})()},[]),m)return n.jsx(N,{});if(!x)return n.jsx("div",{className:`
          min-h-screen
          pt-[90px]
          sm:pt-[110px]

          flex
          items-center
          justify-center

          px-6
          text-center
        `,children:"Page not found"});const i=x.content||{},s=i.hero||{},l=i.whoWeAre||{},h=i.stats||[],c=i.journey||{},f=c.items||[],a=i.processSection||{},y=a.items||[],p=i.visitUs||{},b=p.locations||[];return n.jsxs("div",{className:`
        min-h-screen
        pt-[90px]
        sm:pt-[110px]
      `,children:[n.jsx("section",{children:n.jsxs("div",{className:`
            relative

            h-[540px]
            sm:h-[590px]
            md:h-[650px]
            xl:h-[720px]

            overflow-hidden

            bg-[#161412]
          `,children:[s.image&&n.jsx("img",{src:s.image,alt:s.imageAlt||"Ultra Stones natural stone quarry",className:`
                absolute
                inset-0

                w-full
                h-full

                object-cover

                object-center
              `}),n.jsx("div",{className:`
              absolute
              inset-0

              bg-black/50

              sm:bg-gradient-to-r
              sm:from-black/60
              sm:via-black/15
            `}),n.jsx("div",{className:`
              absolute
              inset-0

              flex
              items-center

              px-6
              sm:px-10
              md:px-14
              lg:px-16
            `,children:n.jsxs("div",{className:`
                w-full
                max-w-[620px]

                text-white
              `,children:[n.jsx(o,{light:!0,children:s.eyebrow||"About Ultra Stones"}),n.jsxs("h1",{className:`
                  mt-6
                  sm:mt-8

                  text-[38px]
                  sm:text-[46px]
                  md:text-[56px]
                  xl:text-[64px]

                  leading-[1.02]

                  tracking-[-0.035em]

                  font-normal
                `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:[s.headingLine1,s.headingLine2&&n.jsxs(n.Fragment,{children:[n.jsx("br",{}),s.headingLine2]}),s.headingLine3&&n.jsxs(n.Fragment,{children:[n.jsx("br",{}),s.headingLine3]})]}),s.description&&n.jsx("p",{className:`
                    mt-6
                    sm:mt-8

                    max-w-[470px]

                    text-[12px]
                    sm:text-[13px]

                    leading-[1.75]

                    text-white/80
                  `,style:{fontFamily:"Montserrat, sans-serif"},children:s.description}),s.meta&&n.jsx("p",{className:`
                    mt-7
                    sm:mt-10

                    text-[10px]
                    sm:text-[11px]
                    lg:text-[12px]

                    font-medium

                    tracking-[0.12em]

                    text-white
                  `,style:{fontFamily:"Montserrat, sans-serif"},children:s.meta})]})})]})}),n.jsx("section",{className:`
          py-10
          sm:py-12
          lg:py-16
        `,children:n.jsx("div",{className:`
            max-w-[1750px]
            mx-auto

            px-4
            sm:px-6
            xl:px-10
          `,children:n.jsxs("div",{className:`
              grid
              grid-cols-1
              lg:grid-cols-2
            `,children:[n.jsx("div",{className:`
                p-0
                sm:p-6
                lg:p-10
              `,children:l.image?n.jsx("img",{src:l.image,alt:l.imageAlt||"Ultra Stones warehouse",loading:"lazy",className:`
                    w-full

                    h-[320px]
                    sm:h-[430px]
                    lg:h-[560px]

                    object-cover
                  `}):n.jsx("div",{className:`
                    w-full

                    h-[320px]
                    sm:h-[430px]
                    lg:h-[560px]

                    bg-[#efedea]
                  `})}),n.jsx("div",{className:`
                flex
                items-center

                px-2
                sm:px-8
                lg:px-14
                xl:px-16

                pt-10
                pb-4

                sm:py-12
                lg:py-16
              `,children:n.jsxs("div",{className:`
                  w-full
                  max-w-[580px]
                `,children:[n.jsx(o,{children:l.eyebrow||"Who We Are"}),n.jsxs("h2",{className:`
                    mt-6
                    sm:mt-7

                    text-[34px]
                    sm:text-[42px]
                    lg:text-[49px]

                    leading-[1.06]

                    tracking-[-0.03em]

                    text-[#161412]
                  `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:[l.titleLine1,l.titleLine2&&n.jsxs(n.Fragment,{children:[n.jsx("br",{}),l.titleLine2]})]}),n.jsx("div",{className:`
                    mt-6
                    sm:mt-7

                    space-y-4
                    sm:space-y-5

                    text-[12px]
                    sm:text-[14px]

                    leading-[1.8]

                    text-[#5e5955]
                  `,style:{fontFamily:"Montserrat, sans-serif"},children:l.paragraphs?.filter(Boolean).map((e,t)=>n.jsx("p",{children:e},t))}),l.buttonLabel&&n.jsx("div",{className:"mt-7",children:n.jsx(g,{to:l.buttonLink||"/material-portfolio",children:l.buttonLabel})})]})})]})})}),h.length>0&&n.jsx("section",{children:n.jsx("div",{className:`
              max-w-[1750px]
              mx-auto

              px-4
              sm:px-6
              xl:px-10
            `,children:n.jsx("div",{className:`
                bg-[#efedea]

                grid
                grid-cols-2
                lg:grid-cols-4
              `,children:h.map((e,t)=>n.jsxs("div",{className:`
                      flex
                      flex-col
                      items-center
                      justify-center

                      text-center

                      min-h-[135px]
                      sm:min-h-[160px]
                      lg:min-h-[175px]

                      px-3
                      sm:px-4

                      ${t%2===1?"border-l border-[#d2ceca]":""}

                      ${t>1?"border-t lg:border-t-0":""}

                      ${t>0?"lg:border-l lg:border-[#d2ceca]":""}
                    `,children:[n.jsx("div",{className:`
                        text-[28px]
                        sm:text-[36px]
                        lg:text-[40px]
                        xl:text-[44px]

                        leading-none

                        text-[#171513]
                      `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:e.value}),n.jsx("div",{className:`
                        mt-3

                        text-[8px]
                        sm:text-[9px]
                        lg:text-[10px]

                        font-semibold

                        uppercase

                        tracking-[0.09em]

                        text-[#69645f]
                      `,style:{fontFamily:"Montserrat, sans-serif"},children:e.label})]},`${e.label}-${t}`))})})}),n.jsx("section",{className:`
          py-14
          sm:py-16
          lg:py-20
        `,children:n.jsxs("div",{className:`
            max-w-[1750px]
            mx-auto

            px-5
            sm:px-6
            xl:px-10
          `,children:[n.jsx(o,{children:c.eyebrow||"Our Journey"}),n.jsxs("div",{className:`
              mt-8
              sm:mt-10

              grid
              grid-cols-1
              xl:grid-cols-[0.8fr_2.2fr]

              gap-10
              xl:gap-20
            `,children:[n.jsx("div",{children:n.jsxs("h2",{className:`
                  text-[36px]
                  sm:text-[44px]
                  lg:text-[50px]
                  xl:text-[54px]

                  leading-[1.05]

                  tracking-[-0.03em]

                  text-[#161412]
                `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:[c.titleLine1,c.titleLine2&&n.jsxs(n.Fragment,{children:[n.jsx("br",{}),c.titleLine2]})]})}),n.jsxs("div",{className:`
                relative

                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4

                gap-8
                sm:gap-x-8
                sm:gap-y-10
                lg:gap-0
              `,children:[f.length>0&&n.jsx("div",{className:`
                    hidden
                    lg:block

                    absolute

                    left-0
                    right-0
                    top-[4px]

                    h-px

                    bg-[#aaa6a1]
                  `}),f.map((e,t)=>n.jsxs("div",{className:`
                      relative

                      pl-5
                      lg:pl-0

                      lg:pr-8

                      border-l
                      border-[#d8d4cf]

                      lg:border-l-0
                    `,children:[n.jsx("div",{className:`
                        absolute

                        left-[-4px]
                        top-[2px]

                        lg:relative
                        lg:left-auto
                        lg:top-auto

                        z-10

                        w-[8px]
                        h-[8px]

                        lg:mb-6

                        rounded-full

                        bg-[#161412]
                      `}),n.jsx("div",{className:`
                        text-[9px]
                        sm:text-[10px]

                        font-bold

                        uppercase

                        tracking-[0.08em]

                        text-[#312d29]
                      `,style:{fontFamily:"Montserrat, sans-serif"},children:e.year}),n.jsx("h3",{className:`
                        mt-2
                        sm:mt-3

                        text-[15px]
                        lg:text-[16px]

                        font-medium

                        text-[#1c1917]
                      `,style:{fontFamily:"Montserrat, sans-serif"},children:e.title}),n.jsx("p",{className:`
                        mt-3

                        max-w-[260px]

                        text-[11px]
                        sm:text-[12px]
                        lg:text-[13px]

                        leading-[1.65]

                        text-[#8b8681]
                      `,style:{fontFamily:"Montserrat, sans-serif"},children:e.description})]},`${e.year}-${t}`))]})]})]})}),n.jsx("section",{children:n.jsx("div",{className:`
            max-w-[1750px]
            mx-auto

            px-0
            sm:px-6
            xl:px-10
          `,children:n.jsx("div",{className:`
              bg-[#151515]

              px-5
              sm:px-8
              lg:px-12
              xl:px-16

              py-12
              sm:py-14
              lg:py-16
            `,children:n.jsxs("div",{className:`
                grid
                grid-cols-1

                lg:grid-cols-[0.8fr_2.2fr]

                gap-12
                lg:gap-12
                xl:gap-14
              `,children:[n.jsxs("div",{className:`
                  flex
                  flex-col
                  items-center
                  justify-center

                  text-center

                  lg:items-start
                  lg:text-left
                `,children:[n.jsx(o,{light:!0,centered:!0,children:a.eyebrow||"From Source To Space"}),n.jsxs("h2",{className:`
                    mt-6
                    sm:mt-7

                    max-w-[500px]

                    text-[38px]
                    sm:text-[46px]
                    lg:text-[48px]
                    xl:text-[54px]

                    leading-[1.03]

                    tracking-[-0.03em]

                    text-white

                    text-center
                    lg:text-left
                  `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:[a.titleLine1,a.titleLine2&&n.jsxs(n.Fragment,{children:[n.jsx("br",{}),a.titleLine2]})]}),a.description&&n.jsx("p",{className:`
                      mt-6

                      max-w-[380px]

                      text-[12px]
                      sm:text-[13px]

                      leading-[1.75]

                      text-white/60

                      text-center
                      lg:text-left
                    `,style:{fontFamily:"Montserrat, sans-serif"},children:a.description}),a.buttonLabel&&n.jsx("div",{className:`
                      mt-7
                      sm:mt-8

                      flex
                      justify-center

                      lg:justify-start
                    `,children:n.jsx(g,{light:!0,to:a.buttonLink||"/our-process",children:a.buttonLabel})})]}),n.jsx("div",{className:`
                  grid
                  grid-cols-1

                  sm:grid-cols-2

                  xl:grid-cols-3

                  gap-8
                  sm:gap-5
                  xl:gap-4
                `,children:y.map((e,t)=>n.jsxs("article",{className:`
                        w-full

                        max-w-[520px]

                        mx-auto

                        sm:max-w-none
                      `,children:[n.jsxs("div",{className:`
                          relative

                          h-[390px]

                          sm:h-[360px]

                          lg:h-[400px]

                          xl:h-[430px]

                          overflow-hidden

                          group

                          bg-[#242424]
                        `,children:[e.image?n.jsx("img",{src:e.image,alt:e.imageAlt||e.title,loading:"lazy",className:`
                              w-full
                              h-full

                              object-cover

                              transition-transform
                              duration-700

                              group-hover:scale-[1.04]
                            `}):n.jsx("div",{className:`
                              w-full
                              h-full

                              flex
                              items-center
                              justify-center

                              bg-[#242424]

                              text-white/20

                              text-[11px]

                              uppercase

                              tracking-[0.1em]
                            `,style:{fontFamily:"Montserrat, sans-serif"},children:e.title}),n.jsx("div",{className:`
                            absolute
                            inset-0

                            bg-gradient-to-t

                            from-black/45
                            via-transparent
                            to-black/10
                          `}),n.jsx("span",{className:`
                            absolute

                            top-4
                            left-4

                            text-[10px]

                            text-white/80
                          `,style:{fontFamily:"Montserrat, sans-serif"},children:e.number||String(t+1).padStart(2,"0")})]}),n.jsxs("div",{className:`
                          pt-5

                          flex
                          flex-col
                          items-center

                          text-center
                        `,children:[n.jsx("h3",{className:`
                            text-[12px]
                            sm:text-[13px]

                            font-semibold

                            uppercase

                            tracking-[0.09em]

                            text-white
                          `,style:{fontFamily:"Montserrat, sans-serif"},children:e.title}),n.jsx("p",{className:`
                            mt-3

                            mx-auto

                            max-w-[300px]

                            text-[11px]
                            sm:text-[11px]
                            lg:text-[12px]

                            leading-[1.6]

                            text-white/55
                          `,style:{fontFamily:"Montserrat, sans-serif"},children:e.description})]})]},`${e.title}-${t}`))})]})})})}),n.jsx("section",{className:`
          py-12
          sm:py-16
        `,children:n.jsx("div",{className:`
            max-w-[1750px]
            mx-auto

            px-5
            sm:px-6
            xl:px-10
          `,children:n.jsxs("div",{className:`
              px-0
              sm:px-6
              lg:px-14
              xl:px-16

              py-8
              sm:py-12
              lg:py-16
            `,children:[n.jsx(o,{children:p.eyebrow||"Visit Us"}),n.jsxs("h2",{className:`
                mt-6
                sm:mt-7

                text-[38px]
                sm:text-[48px]
                lg:text-[54px]
                xl:text-[58px]

                leading-[1.05]

                tracking-[-0.03em]

                text-[#161412]
              `,style:{fontFamily:"Georgia, 'Times New Roman', serif"},children:[p.titleLine1,p.titleLine2&&n.jsxs(n.Fragment,{children:[n.jsx("br",{}),p.titleLine2]})]}),n.jsx("div",{className:`
                mt-12
                sm:mt-14

                grid
                grid-cols-1
                md:grid-cols-2

                gap-16
                md:gap-10
                lg:gap-24
              `,children:b.map((e,t)=>n.jsxs("div",{className:`
                      flex
                      flex-col
                      items-center
                      justify-center

                      text-center
                    `,children:[n.jsx("div",{className:`
                        w-full

                        h-[190px]
                        sm:h-[230px]
                        lg:h-[270px]

                        flex
                        items-end
                        justify-center
                      `,children:e.image?n.jsx("img",{src:e.image,alt:e.imageAlt||e.name,loading:"lazy",className:`
                            w-full

                            max-w-[520px]

                            h-full

                            object-contain
                            object-bottom
                          `}):n.jsx("div",{className:`
                            w-full
                            max-w-[520px]
                            h-full

                            flex
                            items-center
                            justify-center

                            bg-[#efedea]

                            text-[11px]

                            uppercase

                            tracking-[0.08em]

                            text-[#999]
                          `,style:{fontFamily:"Montserrat, sans-serif"},children:e.name})}),n.jsx("h3",{className:`
                        mt-6
                        sm:mt-7

                        text-[13px]
                        sm:text-[15px]

                        font-bold

                        uppercase

                        tracking-[0.07em]

                        text-[#161412]

                        text-center
                      `,style:{fontFamily:"Montserrat, sans-serif"},children:e.name}),n.jsx("p",{className:`
                        mt-2

                        text-[12px]
                        sm:text-[14px]

                        text-[#393531]

                        text-center
                      `,style:{fontFamily:"Montserrat, sans-serif"},children:e.city}),e.buttonLabel&&n.jsx("div",{className:"mt-5 sm:mt-6",children:n.jsx(g,{to:e.buttonLink||"/contact-us",children:e.buttonLabel})})]},`${e.name}-${t}`))})]})})})]})};export{L as default};
