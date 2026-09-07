# Rasterizes the first page of each certificate PDF into a web-sized JPEG for
# use as a card background image in components/sections/Certifications.tsx.
# Source PDFs live outside the repo (E:\Project kaya\Certificate) — only the
# rendered images are committed, not the original files.
import pymupdf

SOURCE_DIR = r"E:\Project kaya\Certificate"
OUTPUT_DIR = "public/certificates"
TARGET_WIDTH_PX = 1400

jobs = [
    ("Coursera 6SVBPK47QAZN.pdf", "coursera-foundations-of-project-management.jpg"),
    ("EF SET Certificate.pdf", "ef-set-english-certificate.jpg"),
    ("Sertifikat CCC.pdf", "ccc-certified-coursenet-coach.jpg"),
]

for source_name, output_name in jobs:
    doc = pymupdf.open(f"{SOURCE_DIR}/{source_name}")
    page = doc[0]
    zoom = TARGET_WIDTH_PX / page.rect.width
    matrix = pymupdf.Matrix(zoom, zoom)
    pixmap = page.get_pixmap(matrix=matrix)
    out_path = f"{OUTPUT_DIR}/{output_name}"
    pixmap.save(out_path, jpg_quality=85)
    print(f"{source_name} -> {out_path} ({pixmap.width}x{pixmap.height})")
    doc.close()

print("done")
