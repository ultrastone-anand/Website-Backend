import{b as k,r as t,j as e,L as g,g as x,a as f}from"./index-Bn3LZPnQ.js";const F=()=>{const{slug:c}=k(),[s,j]=t.useState(null),[o,v]=t.useState([]),[u,w]=t.useState(""),[r,m]=t.useState(""),[l,h]=t.useState(""),p=t.useRef(!1);t.useEffect(()=>{p.current=!1;const n=new AbortController;return(async()=>{try{const d=(await f.get(`https://backend.ultrastones.com/api/stones/${c}`,{signal:n.signal})).data;d.success&&(j(d.category),v(d.products))}catch(a){a.code!=="ERR_CANCELED"&&!f.isCancel(a)&&console.error("Error fetching product category:",a)}})(),()=>{n.abort()}},[c]);const y=t.useMemo(()=>[...new Set(o.map(n=>n.pattern).filter(Boolean))],[o]),N=t.useMemo(()=>[...new Set(o.map(n=>n.stone_group).filter(Boolean))],[o]),b=o.filter(n=>{const i=!l||n.pattern===l,a=!r||n.stone_group===r,d=!u||n.name?.toLowerCase().includes(u.toLowerCase());return i&&a&&d&&n.is_active&&n.is_published}).sort((n,i)=>n.name.localeCompare(i.name));return t.useLayoutEffect(()=>{if(!s||o.length===0||p.current)return;const n=`product-category-scroll:${c}`,i=sessionStorage.getItem(n);if(i===null){p.current=!0;return}const a=Number(i);if(Number.isNaN(a)){p.current=!0;return}requestAnimationFrame(()=>{requestAnimationFrame(()=>{window.scrollTo({top:a,left:0,behavior:"auto"}),p.current=!0})})},[s,o,c]),!s||s.slug!==c?e.jsx(C,{}):e.jsx(e.Fragment,{children:e.jsxs("div",{className:`
        
        min-h-screen
        pt-[110px]
        `,children:[e.jsx("section",{children:e.jsxs("div",{className:`
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
            `,children:[e.jsx("h1",{className:`
              text-[34px]
              md:text-[42px]
              font-semibold
              text-[#161412]
              leading-none
              `,style:{fontFamily:"Montserrat, sans-serif"},children:s.name}),e.jsx("div",{className:`
              w-[70px]
              h-[4px]
              bg-[#c91f26]
              mt-4
              mb-4
              `}),e.jsxs("p",{className:`
                        text-[13px]
                        text-[#777]
                        `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx(g,{to:"/",className:`
                          hover:text-[#161412]
                          duration-300
                          `,children:"Home"})," / ",e.jsx(g,{to:"/categories",className:`
                          hover:text-[#161412]
                          duration-300
                          `,children:"Material Portfolio"})," / ",e.jsx("span",{className:"text-[#161412]",children:e.jsx("b",{children:s.name})})]}),e.jsxs("p",{className:`
              text-[13px]
              text-[#777]
              mt-3
              `,style:{fontFamily:"Montserrat, sans-serif"},children:["Showing all"," ",b.length," results"]})]})}),e.jsxs("section",{className:`
          max-w-[1650px]
          mx-auto
          px-6
          xl:px-10
          mt-12
          `,children:[e.jsxs("div",{className:`
                      flex
                      flex-wrap
                      items-center
                      justify-center
                      gap-4
                      `,children:[e.jsx("div",{className:`
    relative
    `,children:e.jsx("input",{type:"text",value:u,onChange:n=>w(n.target.value),placeholder:`Search ${s.name}...`,className:`
      h-[50px]
      w-[230px]
      border
      border-[#d9d9d9]
      px-5
      uppercase
      tracking-[2px]
      text-[11px]
      outline-none
      duration-300
      bg-white
      text-[#777]
      placeholder:text-[#777]
      `,style:{fontFamily:"Montserrat, sans-serif"}})}),e.jsxs("div",{className:"relative group",children:[e.jsxs("button",{type:"button",className:`
      h-[50px]
      w-[230px]
      border
      px-5
      uppercase
      tracking-[2px]
      text-[11px]
      flex
      items-center
      justify-between
      duration-300

      
            bg-white
            text-[#777]
            border-[#d9d9d9]
          
    `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx("span",{children:"Filter By Color (0)"}),e.jsx("span",{className:"text-[9px] mt-[1px]",children:"▼"})]}),e.jsxs("div",{className:`
      pointer-events-none

      absolute
      left-1/2
      top-[calc(100%+8px)]
      z-50

      -translate-x-1/2
      translate-y-1

      whitespace-nowrap

      bg-[#161412]
      px-4
      py-2

      text-[9px]
      font-semibold
      uppercase
      tracking-[1.5px]
      text-white

      opacity-0
      invisible

      transition-all
      duration-200

      group-hover:opacity-100
      group-hover:visible
      group-hover:translate-y-0
    `,style:{fontFamily:"Montserrat, sans-serif"},children:["Coming Soon",e.jsx("span",{className:`
        absolute
        left-1/2
        bottom-full

        -translate-x-1/2

        border-[5px]
        border-transparent
        border-b-[#161412]
      `})]})]}),e.jsxs("div",{className:"relative",children:[e.jsxs("select",{value:l,onChange:n=>h(n.target.value),className:`
      h-[50px]
      w-[230px]
      border
      px-5
      pr-10
      uppercase
      tracking-[2px]
      text-[11px]
      appearance-none
      outline-none
      cursor-pointer
      duration-300

      ${l?`
            bg-black
            text-white
            border-black
            `:`
            bg-white
            text-[#777]
            border-[#d9d9d9]
            `}
      `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx("option",{value:"",children:"Sort By"}),y.map(n=>e.jsx("option",{value:n,children:n},n))]}),e.jsx("span",{className:`
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-[9px]
      pointer-events-none

      ${l?"text-white":"text-[#777]"}
      `,children:"▼"})]}),e.jsxs("div",{className:"relative",children:[e.jsxs("select",{value:r,onChange:n=>m(n.target.value),className:`
      h-[50px]
      w-[230px]
      border
      px-5
      pr-10
      uppercase
      tracking-[2px]
      text-[11px]
      appearance-none
      outline-none
      cursor-pointer
      duration-300

      ${r?`
            bg-black
            text-white
            border-black
            `:`
            bg-white
            text-[#777]
            border-[#d9d9d9]
            `}
      `,style:{fontFamily:"Montserrat, sans-serif"},children:[e.jsx("option",{value:"",children:"Filter By Group"}),N.map(n=>e.jsx("option",{value:n,children:n},n))]}),e.jsx("span",{className:`
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-[9px]
      pointer-events-none

      ${r?"text-white":"text-[#777]"}
      `,children:"▼"})]})]}),(l||r)&&e.jsxs("div",{className:`
              flex
              items-center
              justify-between
              mt-8
              `,children:[e.jsxs("div",{className:"flex gap-3",children:[l&&e.jsxs("div",{className:`
                    h-[30px]
                    px-3
                    border
                    border-[#ddd]
                    bg-white
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    uppercase
                    tracking-[1px]
                    text-[#777]
                    `,children:[l,e.jsx("button",{onClick:()=>h(""),children:"×"})]}),r&&e.jsxs("div",{className:`
                    h-[30px]
                    px-3
                    border
                    border-[#ddd]
                    bg-white
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    uppercase
                    tracking-[1px]
                    text-[#777]
                    `,children:[r,e.jsx("button",{onClick:()=>m(""),children:"×"})]})]}),e.jsx("button",{onClick:()=>{h(""),m("")},className:`
                text-[11px]
                uppercase
                tracking-[1px]
                text-[#9a9a9a]
                underline
                `,style:{fontFamily:"Montserrat, sans-serif"},children:"Clear Filters"})]})]}),e.jsx("section",{className:`
          max-w-[1650px]
          mx-auto
          px-6
          xl:px-10
          pt-10
          pb-24
          `,children:e.jsx("div",{className:`
            grid
            grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-x-6
            gap-y-10
            `,children:b.map(n=>e.jsxs(g,{to:`/product/${s.slug}/${n.slug}`,onClick:()=>{sessionStorage.setItem(`product-category-scroll:${s.slug}`,String(window.scrollY))},className:`
    group
    cursor-pointer
    block
  `,children:[e.jsx("div",{className:`
      overflow-hidden
      bg-[#eaeaea]
      aspect-square
    `,children:e.jsx("img",{src:n.closeup_image?x(n.closeup_image,400,72):"https://placehold.co/400x400",srcSet:n.closeup_image?`
            ${x(n.closeup_image,240,68)} 240w,
            ${x(n.closeup_image,320,70)} 320w,
            ${x(n.closeup_image,400,72)} 400w,
            ${x(n.closeup_image,520,74)} 520w,
            ${x(n.closeup_image,700,76)} 700w
          `:void 0,sizes:`
        (min-width: 1280px) calc((100vw - 128px) / 4),
        (min-width: 768px) calc((100vw - 96px) / 3),
        calc((100vw - 72px) / 2)
      `,alt:n.name,loading:"lazy",decoding:"async",fetchPriority:"low",width:"700",height:"700",className:`
        block
        w-full
        h-full
        object-cover
        duration-700
        group-hover:scale-[1.02]
      `})}),e.jsx("h2",{className:`
      mt-4
      text-[15px]
      font-semibold
      text-[#161412]
      border-b
      border-[#1f1f1f]
      pb-1
      inline-block
    `,style:{fontFamily:"Montserrat, sans-serif"},children:n.name}),e.jsx("p",{className:`
      mt-3
      text-[11px]
      leading-[1.65]
      text-[#8a8a8a]
      line-clamp-4
    `,style:{fontFamily:"Montserrat, sans-serif"},children:n.small_description})]},n.id))})})]})})},C=()=>e.jsxs("main",{className:"min-h-screen pt-[110px]","aria-busy":"true","aria-label":"Loading products",children:[e.jsx("section",{children:e.jsxs("div",{className:"max-w-[1650px] mx-auto px-6 xl:px-10",children:[e.jsx("div",{className:"h-[42px] w-[260px] bg-[#ececec]"}),e.jsx("div",{className:"w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4"}),e.jsx("div",{className:"h-[14px] w-[320px] max-w-full bg-[#ececec]"}),e.jsx("div",{className:"h-[14px] w-[130px] bg-[#ececec] mt-3"})]})}),e.jsx("section",{className:"max-w-[1650px] mx-auto px-6 xl:px-10 mt-12",children:e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-4",children:Array.from({length:4}).map((c,s)=>e.jsx("div",{className:"h-[50px] w-[230px] bg-[#ececec]"},s))})}),e.jsx("section",{className:"max-w-[1650px] mx-auto px-6 xl:px-10 pt-10 pb-24",children:e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10",children:Array.from({length:12}).map((c,s)=>e.jsxs("article",{children:[e.jsx("div",{className:"aspect-square bg-[#ececec]"}),e.jsx("div",{className:"mt-4 h-[20px] w-[65%] bg-[#ececec]"}),e.jsxs("div",{className:"mt-3 space-y-2",children:[e.jsx("div",{className:"h-[11px] w-full bg-[#ececec]"}),e.jsx("div",{className:"h-[11px] w-full bg-[#ececec]"}),e.jsx("div",{className:"h-[11px] w-[75%] bg-[#ececec]"})]})]},s))})})]});export{F as default};
