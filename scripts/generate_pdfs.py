import os
import re
import subprocess
import time
import markdown

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
WORKSPACE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
MERMAID_JS_PATH = os.path.join(WORKSPACE_DIR, "scripts", "mermaid.min.js")

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title}</title>
  <style>
    @page {{
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
    }}
    
    * {{
      box-sizing: border-box;
    }}

    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 9.5pt;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }}

    /* Header Banner */
    .doc-banner {{
      background: linear-gradient(135deg, #09131f 0%, #0f2744 50%, #0369a1 100%);
      color: #ffffff;
      padding: 22pt 24pt;
      border-radius: 12px;
      margin-bottom: 18pt;
      border: 1px solid #1e3a5f;
      page-break-after: avoid;
    }}

    .doc-banner-badge {{
      display: inline-block;
      background: rgba(180, 240, 58, 0.2);
      border: 1px solid rgba(180, 240, 58, 0.5);
      color: #b4f03a;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3pt 8pt;
      border-radius: 999px;
      margin-bottom: 8pt;
    }}

    .doc-banner h1 {{
      margin: 0 0 6pt 0;
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      border: none;
      padding: 0;
    }}

    .doc-banner-sub {{
      font-size: 11pt;
      color: #94a3b8;
      margin: 0;
      font-weight: 500;
    }}

    /* Metadata Panel */
    .metadata-panel {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8pt 16pt;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10pt 14pt;
      margin-bottom: 20pt;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }}

    .metadata-item {{
      display: flex;
      flex-direction: column;
    }}

    .metadata-label {{
      font-size: 7.5pt;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }}

    .metadata-value {{
      font-weight: 600;
      color: #0f172a;
      margin-top: 1pt;
    }}

    /* Typography */
    h1 {{
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 4pt;
      margin-top: 24pt;
      margin-bottom: 10pt;
      page-break-after: avoid;
      letter-spacing: -0.01em;
    }}

    h2 {{
      font-size: 12.5pt;
      font-weight: 750;
      color: #0369a1;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 3pt;
      margin-top: 18pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
    }}

    h3 {{
      font-size: 10.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 14pt;
      margin-bottom: 6pt;
      page-break-after: avoid;
    }}

    h4 {{
      font-size: 9.5pt;
      font-weight: 700;
      color: #334155;
      margin-top: 10pt;
      margin-bottom: 4pt;
      page-break-after: avoid;
    }}

    p {{
      margin: 0 0 8pt 0;
      line-height: 1.55;
    }}

    ul, ol {{
      margin: 0 0 10pt 0;
      padding-left: 18pt;
    }}

    li {{
      margin-bottom: 3.5pt;
      line-height: 1.5;
    }}

    strong {{
      color: #0f172a;
      font-weight: 700;
    }}

    hr {{
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 18pt 0;
    }}

    /* Tables */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0;
      font-size: 8pt;
      page-break-inside: avoid;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }}

    th {{
      background: #0f172a;
      color: #ffffff;
      padding: 6pt 8pt;
      text-align: left;
      font-weight: 700;
      border: 1px solid #0f172a;
      letter-spacing: 0.02em;
    }}

    td {{
      padding: 5pt 8pt;
      border: 1px solid #e2e8f0;
      vertical-align: top;
      color: #1e293b;
      line-height: 1.4;
    }}

    tr:nth-child(even) td {{
      background-color: #f8fafc;
    }}

    /* Code Blocks & ASCII Tables */
    pre, code {{
      font-family: "JetBrains Mono", "Cascadia Code", "Consolas", monospace;
    }}

    pre:not(.mermaid) {{
      background: #0b121e;
      color: #e2e8f0;
      padding: 10pt 12pt;
      border-radius: 8px;
      font-size: 7.5pt;
      line-height: 1.45;
      overflow-x: auto;
      page-break-inside: avoid;
      border: 1px solid #1e293b;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);
      margin: 10pt 0;
    }}

    code:not(pre code) {{
      background: #f1f5f9;
      color: #0369a1;
      padding: 1.5pt 4pt;
      border-radius: 4px;
      font-size: 8pt;
      border: 1px solid #e2e8f0;
      font-weight: 600;
    }}

    /* Mermaid Diagrams */
    .mermaid-container {{
      text-align: center;
      margin: 14pt 0;
      page-break-inside: avoid;
      background: #ffffff;
      padding: 12pt 8pt;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }}

    .mermaid {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 8.5pt !important;
    }}

    /* Status Pills & Badges */
    .pill-must {{
      background: #fee2e2;
      color: #991b1b;
      font-weight: 700;
      padding: 1.5pt 5pt;
      border-radius: 4px;
      font-size: 7pt;
      border: 1px solid #fecaca;
    }}

    .pill-should {{
      background: #fef3c7;
      color: #92400e;
      font-weight: 700;
      padding: 1.5pt 5pt;
      border-radius: 4px;
      font-size: 7pt;
      border: 1px solid #fde68a;
    }}

    .pill-could {{
      background: #e0f2fe;
      color: #075985;
      font-weight: 700;
      padding: 1.5pt 5pt;
      border-radius: 4px;
      font-size: 7pt;
      border: 1px solid #bae6fd;
    }}

    /* Print optimization */
    @media print {{
      body {{
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }}
      .mermaid-container {{
        break-inside: avoid;
      }}
      table {{
        break-inside: avoid;
      }}
      h1, h2, h3, h4 {{
        break-after: avoid;
      }}
    }}
  </style>
  <script src="{mermaid_url}"></script>
  <script>
    mermaid.initialize({{
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {{ htmlLabels: true, curve: 'basis' }},
      sequence: {{ mirrorActors: false, actorMargin: 40 }}
    }});
  </script>
</head>
<body>

  <!-- Top Executive Banner -->
  <div class="doc-banner">
    <div class="doc-banner-badge">{doc_type}</div>
    <h1>{doc_title}</h1>
    <div class="doc-banner-sub">{doc_subtitle}</div>
  </div>

  <!-- Document Metadata Grid -->
  <div class="metadata-panel">
    <div class="metadata-item">
      <span class="metadata-label">Project</span>
      <span class="metadata-value">AquaGuard AI – Smart Aquaculture Early Warning</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Document Version / Status</span>
      <span class="metadata-value">v1.0 • {doc_status}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Publication Date</span>
      <span class="metadata-value">{doc_date}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Authors / Team</span>
      <span class="metadata-value">{doc_authors}</span>
    </div>
  </div>

  <!-- Main Document Body -->
  <div class="doc-body">
    {content}
  </div>

</body>
</html>
"""

def convert_md_to_html(md_path, html_path, doc_type, doc_title, doc_subtitle, doc_status, doc_date, doc_authors):
    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    # Strip out the redundant top H1 headers since the banner displays them
    md_cleaned = re.sub(r'^#\s+.*?\n', '', md_text, count=2)
    # Strip document header metadata block if present
    md_cleaned = re.sub(r'^\*\*Document Version:\*\*.*?\n\n---\n', '', md_cleaned, flags=re.DOTALL)

    # Convert markdown to HTML
    html_content = markdown.markdown(md_cleaned, extensions=['extra', 'sane_lists', 'toc'])

    # Convert Mermaid code blocks into <div class="mermaid-container"><pre class="mermaid">...</pre></div>
    def replace_mermaid(match):
        code_body = match.group(1).strip()
        # Decode HTML entities if any
        code_body = code_body.replace('&gt;', '>').replace('&lt;', '<').replace('&amp;', '&')
        return f'<div class="mermaid-container"><pre class="mermaid">{code_body}</pre></div>'

    html_content = re.sub(r'<pre><code class="language-mermaid">([\s\S]*?)</code></pre>', replace_mermaid, html_content)

    # Replace Priority tags with styled pills
    html_content = re.sub(r'MUST HAVE \(P0\)', '<span class="pill-must">MUST HAVE (P0)</span>', html_content)
    html_content = re.sub(r'SHOULD HAVE \(P1\)', '<span class="pill-should">SHOULD HAVE (P1)</span>', html_content)
    html_content = re.sub(r'COULD HAVE \(P2\)', '<span class="pill-could">COULD HAVE (P2)</span>', html_content)
    html_content = re.sub(r'WON\'T HAVE \(P3\)', '<span class="pill-could">WON\'T HAVE (P3)</span>', html_content)

    # Embed local mermaid.min.js as file URL or direct script
    mermaid_file_url = f"file:///{MERMAID_JS_PATH.replace(os.sep, '/')}"

    full_html = HTML_TEMPLATE.format(
        title=f"{doc_title} – {doc_type}",
        doc_type=doc_type,
        doc_title=doc_title,
        doc_subtitle=doc_subtitle,
        doc_status=doc_status,
        doc_date=doc_date,
        doc_authors=doc_authors,
        mermaid_url=mermaid_file_url,
        content=html_content
    )

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(full_html)
    print(f"Generated HTML: {html_path}")


def render_html_to_pdf(html_path, pdf_path):
    abs_html = os.path.abspath(html_path)
    abs_pdf = os.path.abspath(pdf_path)

    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--virtual-time-budget=5000",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={abs_pdf}",
        f"file:///{abs_html.replace(os.sep, '/')}"
    ]

    print(f"Executing Chrome print-to-pdf: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    time.sleep(2)

    if os.path.exists(abs_pdf) and os.path.getsize(abs_pdf) > 1000:
        print(f"SUCCESS: Generated PDF at {abs_pdf} (Size: {os.path.getsize(abs_pdf):,} bytes)")
        return True
    else:
        print(f"ERROR: Failed to generate PDF. Chrome output: {result.stdout} {result.stderr}")
        return False


def main():
    mrd_dir = os.path.join(WORKSPACE_DIR, "mrd")
    prd_dir = os.path.join(WORKSPACE_DIR, "prd")

    # 1. Market Requirements Document (MRD)
    mrd_md = os.path.join(mrd_dir, "mrd.md")
    mrd_html = os.path.join(mrd_dir, "mrd_print.html")
    mrd_pdf = os.path.join(mrd_dir, "mrd.pdf")

    print("\n--- Generating MRD PDF ---")
    convert_md_to_html(
        md_path=mrd_md,
        html_path=mrd_html,
        doc_type="Market Requirements Document (MRD)",
        doc_title="AquaGuard AI: Market Requirements Document",
        doc_subtitle="Fish Disease Risk Detection & Early Warning System • Commercial & Economic Architecture",
        doc_status="Approved / Baseline",
        doc_date="October 2026",
        doc_authors="AquaGuard AI Product & Research Team"
    )
    render_html_to_pdf(mrd_html, mrd_pdf)

    # 2. Product Requirements Document (PRD)
    prd_md = os.path.join(prd_dir, "prd.md")
    prd_html = os.path.join(prd_dir, "prd_print.html")
    prd_pdf = os.path.join(prd_dir, "prd.pdf")

    print("\n--- Generating PRD PDF ---")
    convert_md_to_html(
        md_path=prd_md,
        html_path=prd_html,
        doc_type="Product Requirements Document (PRD)",
        doc_title="AquaGuard AI: Product Requirements Document",
        doc_subtitle="Engineering Specifications, Multimodal Risk Fusion Engine & API Contracts",
        doc_status="Approved / Engineering Baseline",
        doc_date="October 2026",
        doc_authors="Senior Software Architect, AI/ML Engineer, and Product Team"
    )
    render_html_to_pdf(prd_html, prd_pdf)


if __name__ == "__main__":
    main()
