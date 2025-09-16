// lib/emailTemplates.ts

export function html({ url, site }: { url: string; site: string }) {
    return `
    <body style="font-family:sans-serif;line-height:1.6;color:#111827">
      <div style="text-align:center">
        <img src="https://your-cdn.com/logo-dark.png" alt="${site}" width="120" style="margin-bottom:1rem"/>
        <h2>Sign in to ${site}</h2>
        <p>아래 버튼을 눌러 로그인하세요:</p>
        <a href="${url}" style="
          display:inline-block;
          padding:12px 24px;
          margin:1rem 0;
          background:#2563eb;
          color:#fff;
          border-radius:6px;
          text-decoration:none;
          font-weight:bold;
        ">로그인</a>
        <p style="color:#6b7280">If you did not request this, safely ignore.</p>
      </div>
    </body>`;
  }
  
  export function text({ url, site }: { url: string; site: string }) {
    return `Sign in to ${site}\n${url}\n\nIf you did not request this email, you can ignore it.`;
  }
  