import json
from pathlib import Path

input_json_path = "./posts_and_tags.json"  # Archivo JSON de entrada
output_path = Path("./posts/")

# Crear el directorio de salida si no existe
output_path.mkdir(parents=True, exist_ok=True)

def mdx_header(title, date, tags, draft, summary):
    tags_str = ", ".join([f'"{tag}"' for tag in tags])
    return f"---\ntitle: '{title}'\ndate: '{date}'\ntags: [{tags_str}]\ndraft: {str(draft).lower()}\nauthors: ['default']\nsummary: '{summary}'\n---\n\n"

# Carga los datos del JSON
with open(input_json_path, 'r', encoding='utf-8') as file:
    posts_with_tags = json.load(file)

for post_info in posts_with_tags:
    title = post_info["title"]
    slug = post_info["slug"]
    date = post_info["date"]
    tags = post_info["tags"]
    draft = post_info["draft"]
    summary = post_info["content"].split('\n', 1)[0][:100]  # Extraer resumen del contenido
    markdown_content = post_info["content"]

    header = mdx_header(title, date, tags, draft, summary)
    content = header + markdown_content

    file_name = output_path / f"{slug}.mdx"
    with open(file_name, 'w', encoding='utf-8') as file:
        file.write(content)

    print(f"Archivo {file_name} creado.")
