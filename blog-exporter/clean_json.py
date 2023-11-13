import json
from datetime import datetime
from pathlib import Path
import os
from tqdm import tqdm
from utils import HTMLProcessor, MarkdownGenerator
from concurrent.futures import ThreadPoolExecutor
from typing import List

current_directory = os.path.dirname(__file__)

file_path = os.path.join(current_directory, "ghost-backup-2023-11-10.json")
output_path = Path(os.path.join(current_directory, "posts"))
output_json_path = Path(os.path.join(current_directory, "posts_and_tags.json"))
output_redirects_filename = os.path.join(current_directory, "redirects.js")

images_path = Path("../public/static/images/uploads/")

output_path.mkdir(parents=True, exist_ok=True)

def process_post(post: dict) -> dict:
    markdown_content, images = HTMLProcessor.process_html_to_markdown(post['html'], post["slug"], images_path, post['feature_image'])
    post_tags = post_to_tags[post["id"]]

    draft = post['status'] == 'draft'
    created_at = datetime.strptime(post["created_at"].replace('Z', ''), '%Y-%m-%dT%H:%M:%S.%f')
    _ = MarkdownGenerator.generate_header(post['title'], created_at.strftime("%Y-%m-%d"), post_tags, draft, post['plaintext'][:100])

    post_info = {
        "title": post['title'],
        "slug": post['slug'],
        "date": created_at.strftime("%Y-%m-%d"),
        "tags": post_tags,
        "images": images,
        "draft": draft,
        "content": markdown_content
    }
    return post_info

if __name__ == "__main__":
    with open(file_path, 'r', encoding='utf-8') as file:
        db = json.load(file)

    posts = db["db"][0]["data"]["posts"]
    tags = {tag["id"]: tag["name"] for tag in db["db"][0]["data"]["tags"]}
    posts_tags = db["db"][0]["data"]["posts_tags"]
    post_to_tags = {post["id"]: [] for post in posts}
    
    for post_tag in posts_tags:
        if post_tag["post_id"] in post_to_tags:
            post_to_tags[post_tag["post_id"]].append(tags[post_tag["tag_id"]])

    posts_with_tags = []

    num_cpus = 3
    with ThreadPoolExecutor(max_workers=num_cpus) as executor:
        futures = []
        print(f"Number of used CPUs: {num_cpus}")
        for post in posts:
            future = executor.submit(process_post, post)
            futures.append(future)
        
        HTMLProcessor.generate_redirects(output_redirects_filename, posts)

        for future in tqdm(futures, total=len(futures), desc="Processing Posts"):
            post_info = future.result()
            posts_with_tags.append(post_info)

    with open(output_json_path, 'w', encoding='utf-8') as json_file:
        json.dump(posts_with_tags, json_file, ensure_ascii=False, indent=4)

    print(f"Archivo JSON guardado en {output_json_path}")
