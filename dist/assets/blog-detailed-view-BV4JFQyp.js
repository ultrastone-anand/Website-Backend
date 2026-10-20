import{b as w,r as d,j as n,L as u}from"./index-TrkQfYJp.js";import{P as o}from"./index-DWVfANWl.js";const v="https://backend.ultrastones.com/api",y=()=>{const e=sessionStorage.getItem("token");return{"Content-Type":"application/json",...e&&{Authorization:`Bearer ${e}`}}},j=async e=>{const t=await fetch(`${v}/blog/${encodeURIComponent(e)}`,{method:"GET",headers:y()}),a=await t.json();if(!t.ok)throw new Error(a.message||"Failed to load blog post");return a},N=e=>{const t=e.cover&&typeof e.cover=="object"?e.cover:null,a=t?.url||e.cover_url||e.coverUrl||"",l=Array.isArray(e.tags)?e.tags.map(s=>typeof s=="string"?s:s?.name||"").filter(Boolean):[];return{id:e.id,title:e.title||"Untitled Blog",slug:e.slug||"",description:e.description||"",content:e.content||"",cover:a,coverAlt:t?.alt_text||t?.altText||e.title||"Blog cover image",tags:l,status:e.status||"DRAFT",publishedAt:e.published_at||e.publishedAt||e.created_at||e.createdAt||null,metaTitle:e.meta_title||e.metaTitle||e.title||"",metaDescription:e.meta_description||e.metaDescription||e.description||""}},k=e=>{if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",year:"numeric"}).format(t)},A=e=>{if(!e)return"";if(typeof window>"u"||typeof DOMParser>"u")return e;const a=new DOMParser().parseFromString(e,"text/html");return a.querySelectorAll("table").forEach(s=>{s.style.removeProperty("width"),s.removeAttribute("width"),s.classList.add("blog-responsive-table");const c=Array.from(s.querySelectorAll("tr"));if(c.length===0)return;const p=c[0],i=Array.from(p.children).map(r=>r.textContent?.replace(/\s+/g," ").trim()||"");p.classList.add("blog-table-header-row"),c.slice(1).forEach(r=>{r.classList.add("blog-table-data-row"),Array.from(r.children).forEach((m,h)=>{if(h===0){m.classList.add("blog-table-row-title");return}const _=i[h]||`Column ${h+1}`;m.setAttribute("data-label",_),m.classList.add("blog-table-value")})})}),a.body.innerHTML};function q(){const{identifier:e}=w(),[t,a]=d.useState(null),[l,s]=d.useState(!0),[c,p]=d.useState(""),x=d.useCallback(async()=>{if(!e){p("Blog identifier is missing."),s(!1);return}try{s(!0),p("");const i=await j(e);a(N(i.data))}catch(i){console.error("Failed to load blog:",i),a(null),p(i.message||"Unable to load this blog post.")}finally{s(!1)}},[e]);return d.useEffect(()=>{x()},[x]),d.useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"})},[e]),d.useEffect(()=>{if(!t)return;const i=document.title;document.title=t.metaTitle||t.title;let r=document.querySelector('meta[name="description"]');const b=r?.getAttribute("content");let m=!1;return r||(r=document.createElement("meta"),r.setAttribute("name","description"),document.head.appendChild(r),m=!0),r.setAttribute("content",t.metaDescription||t.description||""),()=>{if(document.title=i,m&&r){r.remove();return}r&&b!==null&&r.setAttribute("content",b||"")}},[t]),n.jsxs("main",{className:"min-h-screen overflow-x-hidden bg-white pt-[90px]",children:[l&&n.jsx(T,{}),!l&&c&&n.jsx(g,{message:c,onRetry:x}),!l&&!c&&t&&n.jsx(f,{blog:t})]})}function f({blog:e}){const t=k(e.publishedAt),a=d.useMemo(()=>A(e.content),[e.content]);return n.jsxs("article",{className:"overflow-x-hidden bg-white",children:[n.jsxs("section",{className:`
          relative
          min-h-[360px]
          overflow-hidden
          bg-[#161412]
          md:min-h-[430px]
          lg:min-h-[500px]
        `,children:[e.cover?n.jsx("img",{src:e.cover,alt:e.coverAlt,loading:"eager",decoding:"async",className:`
              absolute
              inset-0
              h-full
              w-full
              object-cover
            `}):n.jsx("div",{className:`
              absolute
              inset-0
              bg-gradient-to-br
              from-[#2f2b27]
              via-[#171513]
              to-black
            `}),n.jsx("div",{className:`
            absolute
            inset-0
            bg-black/55
          `}),n.jsx("div",{className:`
            relative
            z-10
            mx-auto
            flex
            min-h-[360px]
            max-w-[1180px]
            items-center
            px-6
            py-16
            md:min-h-[430px]
            md:px-10
            lg:min-h-[500px]
          `,children:n.jsxs("div",{className:`
              w-full
              max-w-[760px]
              lg:ml-[8%]
            `,children:[e.tags.length>0&&n.jsx("div",{className:`
                  mb-4
                  flex
                  flex-wrap
                  gap-x-3
                  gap-y-1
                `,children:e.tags.map(l=>n.jsx("span",{className:`
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-white/75
                      `,children:l},l))}),n.jsx("h1",{className:`
                max-w-[760px]
                text-[26px]
                font-semibold
                leading-[1.35]
                text-white
                md:text-[34px]
                lg:text-[40px]
              `,style:{fontFamily:"Montserrat, sans-serif"},children:e.title}),t&&n.jsx("time",{dateTime:e.publishedAt,className:`
                  mt-5
                  block
                  text-[12px]
                  text-white/70
                `,children:t})]})})]}),n.jsx("section",{className:`
          overflow-hidden
          px-5
          py-10
          sm:px-6
          md:py-16
          lg:py-20
        `,children:n.jsxs("div",{className:`
            mx-auto
            w-full
            max-w-[1100px]
            min-w-0
          `,children:[e.description&&n.jsx("p",{className:`
                mb-9
                text-[14px]
                font-normal
                leading-[1.75]
                text-[#55514d]
                md:text-[15px]
              `,children:e.description}),n.jsx("hr",{className:"mb-10"}),n.jsx("div",{className:`
              blog-content
              min-w-0
              max-w-full

              text-[14px]
              leading-[1.8]
              text-[#3f3d3a]

              [&_p]:mb-5
              [&_p]:max-w-full
              [&_p]:text-[14px]
              [&_p]:leading-[1.8]
              [&_p]:text-[#3f3d3a]

              [&_h1]:mb-5
              [&_h1]:mt-10
              [&_h1]:text-[30px]
              [&_h1]:font-bold
              [&_h1]:leading-[1.15]
              [&_h1]:text-[#202831]

              [&_h2]:mb-5
              [&_h2]:mt-9
              [&_h2]:text-[25px]
              [&_h2]:font-bold
              [&_h2]:leading-[1.2]
              [&_h2]:text-[#202831]

              [&_h3]:mb-4
              [&_h3]:mt-8
              [&_h3]:text-[21px]
              [&_h3]:font-bold
              [&_h3]:leading-[1.3]
              [&_h3]:text-[#202831]

              [&_h4]:mb-3
              [&_h4]:mt-7
              [&_h4]:text-[18px]
              [&_h4]:font-bold
              [&_h4]:leading-[1.4]
              [&_h4]:text-[#202831]

              [&_h5]:mb-3
              [&_h5]:mt-6
              [&_h5]:text-[15px]
              [&_h5]:font-bold
              [&_h5]:text-[#202831]

              [&_h6]:mb-3
              [&_h6]:mt-6
              [&_h6]:text-[13px]
              [&_h6]:font-bold
              [&_h6]:text-[#202831]

              [&_strong]:font-bold
              [&_strong]:text-[#202831]

              [&_em]:italic

              [&_a]:break-words
              [&_a]:text-[#00a878]
              [&_a]:underline
              [&_a]:underline-offset-2
              hover:[&_a]:text-[#c91f26]

              [&_ul]:mb-6
              [&_ul]:list-disc
              [&_ul]:pl-6

              [&_ol]:mb-6
              [&_ol]:list-decimal
              [&_ol]:pl-6

              [&_li]:mb-2
              [&_li]:pl-1
              [&_li]:leading-[1.75]

              [&_blockquote]:my-8
              [&_blockquote]:border-l-4
              [&_blockquote]:border-[#00a878]
              [&_blockquote]:bg-[#f5f7f6]
              [&_blockquote]:px-4
              [&_blockquote]:py-5
              [&_blockquote]:text-[16px]
              [&_blockquote]:italic
              [&_blockquote]:leading-[1.65]
              [&_blockquote]:text-[#4b4b4b]

              md:[&_blockquote]:px-6
              md:[&_blockquote]:text-[18px]

              [&_hr]:my-8
              [&_hr]:border-0
              [&_hr]:border-t
              [&_hr]:border-[#dedede]

              [&_img]:my-8
              [&_img]:h-auto
              [&_img]:max-h-[700px]
              [&_img]:max-w-full
              [&_img]:object-contain

              [&_pre]:my-7
              [&_pre]:max-w-full
              [&_pre]:overflow-x-auto
              [&_pre]:rounded-sm
              [&_pre]:bg-[#202831]
              [&_pre]:p-5
              [&_pre]:text-[13px]
              [&_pre]:leading-6
              [&_pre]:text-white

              [&_code]:rounded-sm
              [&_code]:bg-[#f1f1f1]
              [&_code]:px-1.5
              [&_code]:py-0.5
              [&_code]:text-[13px]

              [&_pre_code]:bg-transparent
              [&_pre_code]:p-0
              [&_pre_code]:text-white

              md:[&_h1]:text-[42px]
              md:[&_h2]:text-[32px]
              md:[&_h3]:text-[24px]
            `,dangerouslySetInnerHTML:{__html:a}}),n.jsx("style",{children:`
              /* ================================================
                 DESKTOP / TABLET TABLE
              ================================================= */

              .blog-content .blog-responsive-table {
                width: 100% !important;
                max-width: 100% !important;
                border-collapse: collapse;
                table-layout: auto;
                margin: 32px 0;
                font-size: 14px;
                line-height: 1.6;
              }

              .blog-content .blog-responsive-table th,
              .blog-content .blog-responsive-table td {
                border: 1px solid #d4d4d4;
                padding: 14px 16px;
                vertical-align: top;
                text-align: left;
              }

              .blog-content .blog-responsive-table th {
                background: #f5f5f5;
                color: #202831;
                font-weight: 600;
              }

              .blog-content .blog-responsive-table th p,
              .blog-content .blog-responsive-table td p {
                margin: 0 !important;
                padding: 0 !important;
              }


              /* ================================================
                 MOBILE
              ================================================= */

              @media (max-width: 767px) {

                /*
                 * Turn the entire table into normal block
                 * content so there is NO horizontal overflow.
                 */

                .blog-content .blog-responsive-table {
                  display: block;
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 26px 0;
                  border: 0;
                  table-layout: auto;
                }

                /*
                 * Tiptap inserts colgroup widths.
                 * They are useless in card mode.
                 */

                .blog-content .blog-responsive-table colgroup {
                  display: none !important;
                }

                .blog-content .blog-responsive-table tbody {
                  display: block;
                  width: 100%;
                }

                /*
                 * Hide original desktop header.
                 *
                 * Labels are displayed inside every card
                 * using data-label.
                 */

                .blog-content
                  .blog-responsive-table
                  .blog-table-header-row {
                  display: none !important;
                }

                /*
                 * Every original table row becomes one card.
                 */

                .blog-content
                  .blog-responsive-table
                  .blog-table-data-row {
                  display: block;
                  width: 100%;
                  margin: 0 0 18px;
                  overflow: hidden;
                  border: 1px solid #dedede;
                  border-radius: 4px;
                  background: #ffffff;
                }

                /*
                 * Every cell becomes full width.
                 */

                .blog-content
                  .blog-responsive-table
                  .blog-table-data-row
                  > th,

                .blog-content
                  .blog-responsive-table
                  .blog-table-data-row
                  > td {
                  display: block;
                  width: 100% !important;
                  max-width: 100% !important;
                  min-width: 0 !important;
                  box-sizing: border-box;
                  border: 0;
                  border-bottom: 1px solid #e5e5e5;
                  padding: 13px 15px;
                  white-space: normal;
                  overflow-wrap: anywhere;
                  word-break: normal;
                }

                /*
                 * First column becomes card title:
                 *
                 * Background color
                 * Veining
                 * Rarity
                 * etc.
                 */

                .blog-content
                  .blog-responsive-table
                  .blog-table-row-title {
                  background: #f5f5f5;
                  color: #202831;
                  font-size: 15px;
                  font-weight: 700;
                  line-height: 1.45;
                }

                /*
                 * Automatically display header above
                 * each corresponding value.
                 */

                .blog-content
                  .blog-responsive-table
                  .blog-table-value::before {
                  content: attr(data-label);
                  display: block;
                  margin-bottom: 4px;
                  color: #202831;
                  font-size: 11px;
                  font-weight: 700;
                  line-height: 1.4;
                  letter-spacing: 0.07em;
                  text-transform: uppercase;
                }

                /*
                 * Remove border from final cell.
                 */

                .blog-content
                  .blog-responsive-table
                  .blog-table-data-row
                  > *:last-child {
                  border-bottom: 0;
                }

                /*
                 * Ensure Tiptap paragraph styles don't
                 * create huge spacing inside table cards.
                 */

                .blog-content
                  .blog-responsive-table
                  td
                  p,

                .blog-content
                  .blog-responsive-table
                  th
                  p {
                  margin: 0 !important;
                  padding: 0 !important;
                  font-size: 14px;
                  line-height: 1.65;
                }
              }
            `}),n.jsx("div",{className:`
              mt-14
              border-t
              border-[#e5e5e5]
              pt-8
            `,children:n.jsxs(u,{to:"/blogs",className:`
                inline-flex
                items-center
                gap-3
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.1em]
                text-[#202831]
                transition-colors
                duration-300
                hover:text-[#c91f26]
              `,children:[n.jsx("span",{"aria-hidden":"true",className:"text-[18px]",children:"←"}),"Back to all blogs"]})})]})})]})}function T(){return n.jsxs("div",{className:"animate-pulse",children:[n.jsx("div",{className:`
          min-h-[360px]
          bg-[#dedede]
          md:min-h-[430px]
          lg:min-h-[500px]
        `,children:n.jsx("div",{className:`
            mx-auto
            flex
            min-h-[360px]
            max-w-[1180px]
            items-center
            px-6
            md:min-h-[430px]
            md:px-10
            lg:min-h-[500px]
          `,children:n.jsxs("div",{className:`
              w-full
              max-w-[500px]
              lg:ml-[8%]
            `,children:[n.jsx("div",{className:"h-3 w-32 rounded bg-white/30"}),n.jsx("div",{className:"mt-5 h-8 w-full rounded bg-white/35"}),n.jsx("div",{className:"mt-3 h-8 w-4/5 rounded bg-white/35"}),n.jsx("div",{className:"mt-6 h-3 w-28 rounded bg-white/30"})]})})}),n.jsxs("div",{className:`
          mx-auto
          max-w-[620px]
          px-6
          py-16
        `,children:[n.jsx("div",{className:"h-3 w-full rounded bg-[#ececec]"}),n.jsx("div",{className:"mt-3 h-3 w-5/6 rounded bg-[#ececec]"}),n.jsx("div",{className:"mt-10 h-10 w-3/5 rounded bg-[#ececec]"}),Array.from({length:10}).map((e,t)=>n.jsx("div",{className:`
                mt-4
                h-3
                w-full
                rounded
                bg-[#ececec]
              `},t))]})]})}function g({message:e,onRetry:t}){return n.jsx("section",{className:`
        flex
        min-h-[650px]
        items-center
        justify-center
        px-6
      `,children:n.jsxs("div",{className:`
          max-w-[600px]
          text-center
        `,children:[n.jsx("p",{className:`
            text-[36px]
            font-semibold
            text-[#202831]
          `,children:"Blog not available"}),n.jsx("p",{className:`
            mt-4
            text-[14px]
            leading-6
            text-[#777]
          `,children:e}),n.jsxs("div",{className:`
            mt-8
            flex
            flex-wrap
            justify-center
            gap-3
          `,children:[n.jsx("button",{type:"button",onClick:t,className:`
              bg-[#202831]
              px-6
              py-3
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-white
              transition-colors
              duration-300
              hover:bg-[#c91f26]
            `,children:"Try Again"}),n.jsx(u,{to:"/blogs",className:`
              border
              border-[#202831]
              px-6
              py-3
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#202831]
              transition-colors
              duration-300
              hover:bg-[#202831]
              hover:text-white
            `,children:"All Blogs"})]})]})})}f.propTypes={blog:o.shape({id:o.oneOfType([o.number,o.string]),title:o.string,description:o.string,content:o.string,cover:o.string,coverAlt:o.string,publishedAt:o.oneOfType([o.string,o.instanceOf(Date)]),tags:o.arrayOf(o.string)}).isRequired};g.propTypes={message:o.string,onRetry:o.func.isRequired};g.defaultProps={message:"Unable to load this blog post."};export{q as default};
