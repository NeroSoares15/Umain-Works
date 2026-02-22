import os
from pypdf import PdfReader

files = [
    "IPTomar - Risco Abandono Escolar",
    "RiskRadar - Definic",
    "RiskRadar OnePager",
    "[IPTomar] - Processo To Be",
    "iptomar_pontos",
]


def extract():
    task_dir = "task files"
    dir_files = os.listdir(task_dir)

    with open(os.path.join(task_dir, "extracted.txt"), "w", encoding="utf-8") as out:
        for file_prefix in files:
            exact_file = next(
                (f for f in dir_files if file_prefix in f and f.endswith(".pdf")), None
            )
            if not exact_file:
                out.write(f"\n\n--- COULD NOT FIND FILE MATCHING: {file_prefix} ---\n")
                continue

            path = os.path.join(task_dir, exact_file)
            out.write(f"\n\n--- EXTRACTING: {exact_file} ---\n")

            try:
                reader = PdfReader(path)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                out.write(text[:5000])  # Cap to 5000 chars per file
            except Exception as e:
                out.write(f"Error reading {exact_file}: {e}\n")


if __name__ == "__main__":
    extract()
