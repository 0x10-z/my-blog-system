import json
from pathlib import Path
from utils import MarkdownGenerator
import os

current_directory = os.path.dirname(__file__)

input_json_path = os.path.join(current_directory,"posts_and_tags.json")
output_path = Path("../data/blog/")

output_path.mkdir(parents=True, exist_ok=True)

with open(input_json_path, 'r', encoding='utf-8') as file:
    posts_with_tags = json.load(file)

for post_info in posts_with_tags:
    title = post_info["title"]
    slug = post_info["slug"]
    date = post_info["date"]
    tags = post_info["tags"]
    draft = post_info["draft"]
    summary = post_info["content"].split('\n', 1)[0][:100]
    markdown_content = post_info["content"]

    header = MarkdownGenerator.generate_header(title, date, tags, draft, summary)
    content = header + markdown_content

    file_name = output_path / f"{slug}.mdx"
    with open(file_name, 'w', encoding='utf-8') as file:
        file.write(content)

    print(f"Archivo {file_name} creado.")
