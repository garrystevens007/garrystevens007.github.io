# Regenerates the downloadable resume PDF from the SAME JSON content the
# website reads (../content/*.json) — not a separate hand-typed copy. Editing
# content/experience.json (or profile/education/skills) and re-running this
# script keeps the resume and the website in sync automatically.
#
# The phone number is omitted entirely (not just visually covered) -- true
# redaction, since the number is never written into the output in the first
# place, and it isn't present in content/profile.json anyway. This keeps the
# download consistent with the public Contact section, which also excludes
# the phone number.
#
# Usage:
#   pip install -r scripts/requirements.txt
#   python scripts/build_resume.py public/resume/Garry-Stevens-Resume.pdf
import json
import sys
from pathlib import Path

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib import colors

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"


def load(name):
    with open(CONTENT_DIR / name, encoding="utf-8") as f:
        return json.load(f)


def esc(text):
    # reportlab's Paragraph parses a small XML-like markup language, so any
    # dynamic text (from JSON, not our own literal <b> tags below) needs
    # entity-escaping or a stray "&"/"<" in someone's edited content would
    # throw a parse error instead of just rendering literally.
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


profile = load("profile.json")
education = load("education.json")
experience = load("experience.json")
skills = load("skills.json")

styles = getSampleStyleSheet()

name_style = ParagraphStyle("Name", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=18, leading=21, spaceAfter=3)
contact_style = ParagraphStyle("Contact", parent=styles["Normal"], fontSize=9.5, leading=12, textColor=colors.HexColor("#333333"), spaceAfter=1)
heading_style = ParagraphStyle("Heading", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=11.5, spaceBefore=9, spaceAfter=4, textColor=colors.HexColor("#1a1a1a"))
role_style = ParagraphStyle("Role", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=10, leading=12, spaceAfter=0)
period_style = ParagraphStyle("Period", parent=styles["Normal"], fontSize=9, leading=11, textColor=colors.HexColor("#666666"), spaceAfter=3)
body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=9.5, leading=12.5, spaceAfter=4)
bullet_style = ParagraphStyle("Bullet", parent=styles["Normal"], fontSize=9.5, leading=12.5, leftIndent=14, spaceAfter=1.5, bulletIndent=0)
plain_style = ParagraphStyle("Plain", parent=styles["Normal"], fontSize=9.5, leading=12.5, spaceAfter=1)


def hr():
    return HRFlowable(width="100%", thickness=0.75, color=colors.HexColor("#888888"), spaceBefore=2, spaceAfter=8)


def heading(text):
    return [Paragraph(text, heading_style), hr()]


def bullets(items):
    return [Paragraph(f"&bull;&nbsp;&nbsp;{esc(item)}", bullet_style) for item in items]


story = []

story.append(Paragraph(esc(profile["name"]), name_style))
story.append(Paragraph(f"{esc(profile['location'])} | {esc(profile['email'])} | LinkedIn", contact_style))
story.append(Paragraph("Personal Details:", contact_style))
story.append(Paragraph(esc(profile["nationality"]), contact_style))

story += heading("Professional Summary")
story.append(Paragraph(esc(profile["summary"]), body_style))

story += heading("Professional Experience")
for index, role in enumerate(experience):
    story.append(Paragraph(f"{esc(role['role'])}, {esc(role['company'])}, {esc(role['location'])}", role_style))
    story.append(Paragraph(esc(role["period"]), period_style))
    story += bullets(role["bullets"])
    if index < len(experience) - 1:
        story.append(Spacer(1, 4))

story += heading("Areas of Expertise")
for item in profile["areasOfExpertise"]:
    story.append(Paragraph(esc(item), plain_style))

story += heading("Technical Proficiencies")
proficiency_line = "; ".join(
    f"<b>{esc(category['category'])}:</b> " + ", ".join(esc(skill["name"]) for skill in category["skills"])
    for category in skills
)
story.append(Paragraph(proficiency_line, body_style))

story += heading("Education")
story.append(Paragraph(f"{esc(education['degree'])}, {esc(education['location'])}", role_style))
story.append(Paragraph(f"{esc(education['school'])}, {esc(education['period'])}", period_style))

story += heading("Languages")
story.append(Paragraph(", ".join(esc(lang) for lang in profile["spokenLanguages"]), plain_style))

doc = SimpleDocTemplate(
    sys.argv[1],
    pagesize=LETTER,
    topMargin=0.55 * inch,
    bottomMargin=0.55 * inch,
    leftMargin=0.75 * inch,
    rightMargin=0.75 * inch,
    title=f"{profile['name']} - Resume",
    author=profile["name"],
)
doc.build(story)
print("done")
