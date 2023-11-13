import json
from pathlib import Path
from utils import MarkdownGenerator
import os

current_directory = os.path.dirname(__file__)

input_json_path = os.path.join(current_directory, "posts_and_tags.json")
output_path = Path("../data/blog/")

output_path.mkdir(parents=True, exist_ok=True)

with open(input_json_path, 'r', encoding='utf-8') as file:
    posts_with_tags = json.load(file)

for post_info in posts_with_tags:
    title: str = post_info["title"]
    slug: str = post_info["slug"]
    date: str = post_info["date"]
    tags: list = post_info["tags"]
    draft: bool = post_info["draft"]
    summary: str = post_info["content"].split('\n', 1)[0][:100]
    markdown_content: str = post_info["content"]

    header: str = MarkdownGenerator.generate_header(title, date, tags, draft, summary)
    content: str = header + markdown_content

    file_name: Path = output_path / f"{slug}.mdx"
    with open(file_name, 'w', encoding='utf-8') as file:
        file.write(content)

    print(f"Archivo {file_name} creado.")
