import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_DIR = r"E:\project\AquaGuard AI\presentation"
os.makedirs(OUTPUT_DIR, exist_ok=True)
PPTX_PATH = os.path.join(OUTPUT_DIR, "AquaGuard_AI_Hackathon_Pitch_Deck.pptx")

# 16:9 Widescreen dimensions (13.333 x 7.5 inches)
SLIDE_WIDTH = Inches(13.333)
SLIDE_HEIGHT = Inches(7.5)

# Clean, Simple Modern Theme (Deep Navy / Slate / White with crisp Lime & Cyan accents)
C_BG = RGBColor(11, 15, 25)            # Clean deep navy #0B0F19
C_CARD_BG = RGBColor(18, 24, 38)       # Slate card fill #121826
C_CARD_BORDER = RGBColor(40, 52, 75)   # Subtle border #28344B

C_TEXT_WHITE = RGBColor(255, 255, 255) # Pure white
C_TEXT_LIGHT = RGBColor(226, 232, 240) # Slate 200 #E2E8F0
C_TEXT_MUTED = RGBColor(156, 163, 175) # Neutral gray #9CA3AF
C_TEXT_DIM = RGBColor(100, 116, 139)   # Dim slate #64748B

# Functional Accents (Crisp & High Contrast)
C_LIME = RGBColor(180, 240, 58)        # Brand Lime #B4F03A
C_CYAN = RGBColor(56, 189, 248)        # Tech Cyan #38BDF8
C_CORAL = RGBColor(244, 63, 94)        # Alert Red #F43F5E
C_ORANGE = RGBColor(251, 146, 60)      # Warm Orange #FB923C
C_PURPLE = RGBColor(167, 139, 250)     # Violet #A78BFA

def set_tf_zero_margins(tf):
    tf.margin_left = Inches(0.08)
    tf.margin_right = Inches(0.08)
    tf.margin_top = Inches(0.06)
    tf.margin_bottom = Inches(0.06)
    tf.word_wrap = True

def create_deck():
    prs = Presentation()
    prs.slide_width = SLIDE_WIDTH
    prs.slide_height = SLIDE_HEIGHT
    blank_layout = prs.slide_layouts[6]

    # =========================================================================
    # SLIDE 1: Problem Statement & Solution Architecture
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)

    # Background
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT)
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_BG
    bg1.line.fill.background()

    # Top Header Left: Problem Statement
    top_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.38), Inches(4.3), Inches(0.36))
    top_badge.fill.solid()
    top_badge.fill.fore_color.rgb = RGBColor(15, 27, 44)
    top_badge.line.color.rgb = C_CYAN
    top_badge.line.width = Pt(1)
    tf = top_badge.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "HACKATHON  |  PROBLEM STATEMENT 18"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    # Top Header Right: Team Name "cyber knight"
    team_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.033), Inches(0.38), Inches(3.5), Inches(0.36))
    team_badge.fill.solid()
    team_badge.fill.fore_color.rgb = RGBColor(24, 38, 18)
    team_badge.line.color.rgb = C_LIME
    team_badge.line.width = Pt(1)
    tf = team_badge.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "Team: cyber knight"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_LIME
    p.alignment = PP_ALIGN.CENTER

    # Title & Subtitle Box
    title_box = s1.shapes.add_textbox(Inches(0.8), Inches(0.82), Inches(11.733), Inches(0.82))
    tf = title_box.text_frame
    set_tf_zero_margins(tf)
    p = tf.paragraphs[0]
    p.text = "Fish Disease Risk Detection & Early Warning!"
    p.font.size = Pt(25)
    p.font.bold = True
    p.font.color.rgb = C_TEXT_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Smart AI early warning system that catches fish illness early and protects pond health"
    p2.font.size = Pt(12)
    p2.font.color.rgb = C_TEXT_MUTED
    p2.space_before = Pt(3)

    # -------------------------------------------------------------------------
    # Column 1: The Problem Card (Clean & Perfectly Fitted)
    # -------------------------------------------------------------------------
    c1_left = Inches(0.8)
    c1_top = Inches(1.80)
    c1_w = Inches(4.7)
    c1_h = Inches(5.0)

    card1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c1_left, c1_top, c1_w, c1_h)
    card1.fill.solid()
    card1.fill.fore_color.rgb = C_CARD_BG
    card1.line.color.rgb = C_CORAL
    card1.line.width = Pt(1.4)

    # Header Pill
    pill1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c1_left + Inches(0.32), c1_top + Inches(0.25), Inches(1.8), Inches(0.32))
    pill1.fill.solid()
    pill1.fill.fore_color.rgb = RGBColor(40, 16, 24)
    pill1.line.color.rgb = C_CORAL
    pill1.line.width = Pt(1)
    tf = pill1.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "THE PROBLEM"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CORAL
    p.alignment = PP_ALIGN.CENTER

    # Problem Bullets Box (Fitted comfortably inside card)
    tb1 = s1.shapes.add_textbox(c1_left + Inches(0.32), c1_top + Inches(0.72), c1_w - Inches(0.64), Inches(4.0))
    tf1 = tb1.text_frame
    set_tf_zero_margins(tf1)

    problem_points = [
        ("Late Detection:", " By the time sores, red spots, or pale gills appear on fish, the illness has already spread to the whole pond."),
        ("Disconnected Data:", " Fish photos, water tests (oxygen, pH, ammonia), and farm loss logs sit in separate places with no connection."),
        ("Heavy Fish Losses:", " Acting too late causes 50% to 80% of fish to die within just 2 to 3 days of water stress or disease."),
        ("Harmful Antibiotic Use:", " Panic use of harsh antibiotics ruins pond water quality, kills natural biology, and leads to market bans.")
    ]

    for i, (title, desc) in enumerate(problem_points):
        p = tf1.add_paragraph() if i > 0 else tf1.paragraphs[0]
        p.space_before = Pt(11) if i > 0 else Pt(0)
        p.space_after = Pt(0)

        r_bullet = p.add_run()
        r_bullet.text = "• "
        r_bullet.font.bold = True
        r_bullet.font.color.rgb = C_CORAL
        r_bullet.font.size = Pt(12)

        r_title = p.add_run()
        r_title.text = title
        r_title.font.bold = True
        r_title.font.color.rgb = C_TEXT_WHITE
        r_title.font.size = Pt(12)

        r_desc = p.add_run()
        r_desc.text = desc
        r_desc.font.color.rgb = C_TEXT_MUTED
        r_desc.font.size = Pt(11.5)

    # -------------------------------------------------------------------------
    # Column 2: Our Solution Card (Structured Flow)
    # -------------------------------------------------------------------------
    c2_left = Inches(5.8)
    c2_top = Inches(1.80)
    c2_w = Inches(6.733)
    c2_h = Inches(5.0)

    card2 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c2_left, c2_top, c2_w, c2_h)
    card2.fill.solid()
    card2.fill.fore_color.rgb = C_CARD_BG
    card2.line.color.rgb = C_LIME
    card2.line.width = Pt(1.4)

    # Header Pill
    pill2 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c2_left + Inches(0.32), c2_top + Inches(0.25), Inches(1.8), Inches(0.32))
    pill2.fill.solid()
    pill2.fill.fore_color.rgb = RGBColor(24, 38, 18)
    pill2.line.color.rgb = C_LIME
    pill2.line.width = Pt(1)
    tf = pill2.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "OUR SOLUTION"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_LIME
    p.alignment = PP_ALIGN.CENTER

    # Step 1: 4 Data Inputs (2x2 Grid)
    in_data = [
        ("📸 Pond Fish Photos", "Spots 7 fish diseases (sores, fins, gills)", C_CYAN),
        ("🐟 Fish Behaviour Logs", "Tracks surfacing, lethargy & slow feeding", C_PURPLE),
        ("📋 Mortality Records", "Saves daily losses & past pond checkups", C_ORANGE),
        ("🧪 Pond Water Tests", "Measures Oxygen, pH, Temp & Ammonia", C_LIME)
    ]

    gw = (c2_w - Inches(0.64) - Inches(0.24)) / 2
    gh = Inches(0.72)
    gy0 = c2_top + Inches(0.70)

    for idx, (title, desc, color) in enumerate(in_data):
        col_idx = idx % 2
        row_idx = idx // 2
        bx = c2_left + Inches(0.32) + col_idx * (gw + Inches(0.24))
        by = gy0 + row_idx * (gh + Inches(0.14))

        ibox = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, by, gw, gh)
        ibox.fill.solid()
        ibox.fill.fore_color.rgb = RGBColor(12, 17, 28)
        ibox.line.color.rgb = color
        ibox.line.width = Pt(1)
        tf = ibox.text_frame
        set_tf_zero_margins(tf)
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE

        p = tf.paragraphs[0]
        p.text = title
        p.font.bold = True
        p.font.size = Pt(10.5)
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = C_TEXT_MUTED
        p2.space_before = Pt(2)

    # Arrow 1: Downward connector
    arrow1_y = gy0 + (gh * 2) + Inches(0.22)
    arrow1 = s1.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, c2_left + (c2_w / 2) - Inches(0.18), arrow1_y, Inches(0.36), Inches(0.24))
    arrow1.fill.solid()
    arrow1.fill.fore_color.rgb = C_LIME
    arrow1.line.fill.background()

    # Step 2: AI Risk Engine Box
    eng_y = arrow1_y + Inches(0.32)
    eng_h = Inches(1.15)
    eng_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c2_left + Inches(0.32), eng_y, c2_w - Inches(0.64), eng_h)
    eng_box.fill.solid()
    eng_box.fill.fore_color.rgb = RGBColor(20, 18, 34)
    eng_box.line.color.rgb = C_PURPLE
    eng_box.line.width = Pt(1.2)
    tf = eng_box.text_frame
    set_tf_zero_margins(tf)

    p = tf.paragraphs[0]
    p.text = "AI Risk Engine: CNN Photo AI + Water Model + Disease Synergy"
    p.font.bold = True
    p.font.size = Pt(11.5)
    p.font.color.rgb = C_LIME
    p.alignment = PP_ALIGN.CENTER

    eng_bullets = [
        "• Photo AI (MobileNetV3): Scans fish skin and gills with 98% accuracy (55% score weight)",
        "• Water AI (Random Forest): Predicts water danger score from oxygen, pH & ammonia (45% weight)",
        "• Hidden Synergy Check: Flags when warm dirty water makes fish disease spread 3x faster (+20 pts)"
    ]
    for b in eng_bullets:
        p = tf.add_paragraph()
        p.text = b
        p.font.size = Pt(9.5)
        p.font.color.rgb = C_TEXT_LIGHT
        p.space_before = Pt(2)

    # Arrow 2: Downward connector
    arrow2_y = eng_y + eng_h + Inches(0.08)
    arrow2 = s1.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, c2_left + (c2_w / 2) - Inches(0.18), arrow2_y, Inches(0.36), Inches(0.22))
    arrow2.fill.solid()
    arrow2.fill.fore_color.rgb = C_CYAN
    arrow2.line.fill.background()

    # Step 3: Actionable Output Banner
    out_y = arrow2_y + Inches(0.28)
    out_h = Inches(0.72)
    out_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c2_left + Inches(0.32), out_y, c2_w - Inches(0.64), out_h)
    out_box.fill.solid()
    out_box.fill.fore_color.rgb = RGBColor(12, 28, 36)
    out_box.line.color.rgb = C_CYAN
    out_box.line.width = Pt(1.2)
    tf = out_box.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE

    p = tf.paragraphs[0]
    p.text = "Risk Score (0–100) + Natural Treatment Plan + Regional Voice Alert"
    p.font.bold = True
    p.font.size = Pt(11.5)
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    p2 = tf.add_paragraph()
    p2.text = "Exact salt & lime amounts, water flush volume, air pump runtime & 12 Indian languages"
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = C_TEXT_WHITE
    p2.space_before = Pt(2)
    p2.alignment = PP_ALIGN.CENTER

    # Footer
    foot1 = s1.shapes.add_textbox(Inches(12.0), Inches(6.98), Inches(0.6), Inches(0.3))
    p = foot1.text_frame.paragraphs[0]
    p.text = "1"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_TEXT_DIM
    p.alignment = PP_ALIGN.RIGHT

    # =========================================================================
    # SLIDE 2: Features, Technology & Impact
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)

    # Background
    bg2 = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT)
    bg2.fill.solid()
    bg2.fill.fore_color.rgb = C_BG
    bg2.line.fill.background()

    # Top Header Left: What We Will Build
    top_badge2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.38), Inches(3.2), Inches(0.36))
    top_badge2.fill.solid()
    top_badge2.fill.fore_color.rgb = RGBColor(15, 27, 44)
    top_badge2.line.color.rgb = C_CYAN
    top_badge2.line.width = Pt(1)
    tf = top_badge2.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "WHAT WE WILL BUILD"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    # Top Header Right: Team Name "cyber knight"
    team_badge2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.033), Inches(0.38), Inches(3.5), Inches(0.36))
    team_badge2.fill.solid()
    team_badge2.fill.fore_color.rgb = RGBColor(24, 38, 18)
    team_badge2.line.color.rgb = C_LIME
    team_badge2.line.width = Pt(1)
    tf = team_badge2.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "Team: cyber knight"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_LIME
    p.alignment = PP_ALIGN.CENTER

    # Title & Subtitle Box
    title_box2 = s2.shapes.add_textbox(Inches(0.8), Inches(0.82), Inches(11.733), Inches(0.82))
    tf = title_box2.text_frame
    set_tf_zero_margins(tf)
    p = tf.paragraphs[0]
    p.text = "Features, Technology & Impact"
    p.font.size = Pt(25)
    p.font.bold = True
    p.font.color.rgb = C_TEXT_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Simple, practical tools designed for real fish farmers to protect crops without antibiotics"
    p2.font.size = Pt(12)
    p2.font.color.rgb = C_TEXT_MUTED
    p2.space_before = Pt(3)

    # 3 Equal Columns Layout (Clean spacing, perfectly fitted inside each card)
    col_w = Inches(3.68)
    col_gap = Inches(0.34)
    col_top = Inches(1.80)
    col_h = Inches(5.0)

    # -------------------------------------------------------------------------
    # Column 1: Core Features
    # -------------------------------------------------------------------------
    c1_x = Inches(0.8)
    card_c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c1_x, col_top, col_w, col_h)
    card_c1.fill.solid()
    card_c1.fill.fore_color.rgb = C_CARD_BG
    card_c1.line.color.rgb = C_CYAN
    card_c1.line.width = Pt(1.4)

    pill_c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c1_x + Inches(0.24), col_top + Inches(0.22), Inches(1.9), Inches(0.32))
    pill_c1.fill.solid()
    pill_c1.fill.fore_color.rgb = RGBColor(15, 27, 44)
    pill_c1.line.color.rgb = C_CYAN
    pill_c1.line.width = Pt(1)
    tf = pill_c1.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "CORE FEATURES"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    tb_c1 = s2.shapes.add_textbox(c1_x + Inches(0.24), col_top + Inches(0.66), col_w - Inches(0.48), Inches(4.15))
    tf_c1 = tb_c1.text_frame
    set_tf_zero_margins(tf_c1)

    core_points = [
        ("Phone Photo Scanner:", " Take a quick photo of sick fish to detect 7 major diseases (Red sores, Dropsy, Gill disease, White tail, Fungus, Parasites) with 98% accuracy."),
        ("Water Quality Checker:", " Checks Oxygen, pH, Temperature, and Ammonia levels in seconds to flag dangerous pond water conditions."),
        ("Simple Danger Meter (0–100):", " Combines fish photo (55%) and water tests (45%) into one clear score: Safe, Watch, Warning, or Critical Danger."),
        ("Early Sickness Warning:", " Spots invisible risks—like warm water making gill infections spread 3 times faster—before mass mortality begins."),
        ("Blur & Glare Checker:", " Automatically checks photo sharpness and lighting so farmers don't get inaccurate test results.")
    ]

    for i, (head, body) in enumerate(core_points):
        p = tf_c1.add_paragraph() if i > 0 else tf_c1.paragraphs[0]
        p.space_before = Pt(7) if i > 0 else Pt(0)

        r_b = p.add_run()
        r_b.text = "✔ "
        r_b.font.bold = True
        r_b.font.color.rgb = C_CYAN
        r_b.font.size = Pt(10)

        r_h = p.add_run()
        r_h.text = head
        r_h.font.bold = True
        r_h.font.color.rgb = C_TEXT_WHITE
        r_h.font.size = Pt(10)

        r_t = p.add_run()
        r_t.text = body
        r_t.font.color.rgb = C_TEXT_MUTED
        r_t.font.size = Pt(9.5)

    # -------------------------------------------------------------------------
    # Column 2: Advanced Features
    # -------------------------------------------------------------------------
    c2_x = c1_x + col_w + col_gap
    card_c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c2_x, col_top, col_w, col_h)
    card_c2.fill.solid()
    card_c2.fill.fore_color.rgb = C_CARD_BG
    card_c2.line.color.rgb = C_PURPLE
    card_c2.line.width = Pt(1.4)

    pill_c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c2_x + Inches(0.24), col_top + Inches(0.22), Inches(2.2), Inches(0.32))
    pill_c2.fill.solid()
    pill_c2.fill.fore_color.rgb = RGBColor(28, 20, 44)
    pill_c2.line.color.rgb = C_PURPLE
    pill_c2.line.width = Pt(1)
    tf = pill_c2.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "ADVANCED FEATURES"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_PURPLE
    p.alignment = PP_ALIGN.CENTER

    tb_c2 = s2.shapes.add_textbox(c2_x + Inches(0.24), col_top + Inches(0.66), col_w - Inches(0.48), Inches(4.15))
    tf_c2 = tb_c2.text_frame
    set_tf_zero_margins(tf_c2)

    adv_points = [
        ("Natural Dosage Calculator:", " Enter pond length, width & depth to calculate the exact kilograms and 50 kg sacks of salt and lime needed—no guessing."),
        ("Past Pond Health Records:", " Keeps a clean digital ledger of every test, photo, and treatment so farmers can track trends across all ponds."),
        ("12 Indian Languages:", " Complete app translation into Hindi, Bengali, Telugu, Tamil, Malayalam, Kannada, Marathi, Gujarati, Odia, Punjabi & more."),
        ("Emergency Life Guardrail:", " Automatically triggers a top emergency alert if dissolved oxygen drops below lethal limits (< 2.0 mg/L)."),
        ("Future Roadmap:", " Underwater camera monitoring, feeding sound sensors, and regional disease outbreak maps.")
    ]

    for i, (head, body) in enumerate(adv_points):
        p = tf_c2.add_paragraph() if i > 0 else tf_c2.paragraphs[0]
        p.space_before = Pt(7) if i > 0 else Pt(0)

        r_b = p.add_run()
        r_b.text = "★ "
        r_b.font.bold = True
        r_b.font.color.rgb = C_PURPLE
        r_b.font.size = Pt(10)

        r_h = p.add_run()
        r_h.text = head
        r_h.font.bold = True
        r_h.font.color.rgb = C_TEXT_WHITE
        r_h.font.size = Pt(10)

        r_t = p.add_run()
        r_t.text = body
        r_t.font.color.rgb = C_TEXT_MUTED
        r_t.font.size = Pt(9.5)

    # -------------------------------------------------------------------------
    # Column 3: Tech Stack & Impact
    # -------------------------------------------------------------------------
    c3_x = c2_x + col_w + col_gap
    card_c3 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c3_x, col_top, col_w, col_h)
    card_c3.fill.solid()
    card_c3.fill.fore_color.rgb = C_CARD_BG
    card_c3.line.color.rgb = C_LIME
    card_c3.line.width = Pt(1.4)

    pill_c3 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c3_x + Inches(0.24), col_top + Inches(0.22), Inches(2.3), Inches(0.32))
    pill_c3.fill.solid()
    pill_c3.fill.fore_color.rgb = RGBColor(24, 38, 18)
    pill_c3.line.color.rgb = C_LIME
    pill_c3.line.width = Pt(1)
    tf = pill_c3.text_frame
    set_tf_zero_margins(tf)
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.text = "TECH STACK & IMPACT"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_LIME
    p.alignment = PP_ALIGN.CENTER

    tb_c3 = s2.shapes.add_textbox(c3_x + Inches(0.24), col_top + Inches(0.66), col_w - Inches(0.48), Inches(4.15))
    tf_c3 = tb_c3.text_frame
    set_tf_zero_margins(tf_c3)

    # Section 1: Tech Stack
    p = tf_c3.paragraphs[0]
    r_t = p.add_run()
    r_t.text = "SIMPLE TECH STACK"
    r_t.font.bold = True
    r_t.font.size = Pt(10.5)
    r_t.font.color.rgb = C_LIME

    techs = [
        ("AI / ML:", " Python · MobileNetV3 CNN · Random Forest · OpenCV"),
        ("Backend:", " FastAPI · Python 3.12 · Uvicorn · Supabase Cloud"),
        ("Frontend:", " React 19 · Vite · Tailwind CSS · Fast Mobile Web")
    ]
    for head, body in techs:
        p = tf_c3.add_paragraph()
        p.space_before = Pt(3)
        r_h = p.add_run()
        r_h.text = "• " + head
        r_h.font.bold = True
        r_h.font.color.rgb = C_TEXT_WHITE
        r_h.font.size = Pt(9.5)
        r_b = p.add_run()
        r_b.text = body
        r_b.font.color.rgb = C_TEXT_MUTED
        r_b.font.size = Pt(9.5)

    # Section 2: Farm Impact
    p = tf_c3.add_paragraph()
    p.space_before = Pt(12)
    r_t = p.add_run()
    r_t.text = "REAL FARM IMPACT"
    r_t.font.bold = True
    r_t.font.size = Pt(10.5)
    r_t.font.color.rgb = C_ORANGE

    impacts = [
        ("48–72h Early Warning:", " Catches water and fish stress before mass die-offs begin."),
        ("70% Less Fish Mortality:", " Lowers typical disease loss from 60% down to under 10%."),
        ("Zero Antibiotics Needed:", " Replaces harsh chemicals with safe salt, lime & fresh water."),
        ("Farmer Friendly:", " Simple English and 12 local Indian languages for any farmer to use.")
    ]
    for head, body in impacts:
        p = tf_c3.add_paragraph()
        p.space_before = Pt(4)
        r_h = p.add_run()
        r_h.text = "▲ " + head
        r_h.font.bold = True
        r_h.font.color.rgb = C_ORANGE
        r_h.font.size = Pt(9.5)
        r_b = p.add_run()
        r_b.text = body
        r_b.font.color.rgb = C_TEXT_MUTED
        r_b.font.size = Pt(9.2)

    # Footer
    foot2 = s2.shapes.add_textbox(Inches(12.0), Inches(6.98), Inches(0.6), Inches(0.3))
    p = foot2.text_frame.paragraphs[0]
    p.text = "2"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_TEXT_DIM
    p.alignment = PP_ALIGN.RIGHT

    prs.save(PPTX_PATH)
    print(f"Updated PowerPoint pitch deck saved at: {PPTX_PATH}")

if __name__ == "__main__":
    create_deck()
