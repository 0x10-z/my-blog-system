import json
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from pathlib import Path
from datetime import datetime
import re
import requests
from pathlib import Path
from PIL import Image
import os
import tempfile

words_to_clean = [
  { "&lt;": "<"},
  { "&gt;": ">"},
  { "<gathered_session_id>": "gathered_session_id"},
]

current_directory = os.path.dirname(__file__)

file_path = os.path.join(current_directory, "ghost-backup-2023-11-10.json")
output_path = Path(os.path.join(current_directory, "posts"))
output_json_path = Path(os.path.join(current_directory, "posts_and_tags.json"))

images_path = Path(os.path.join(current_directory, "../public/static/images/uploads/"))

output_path.mkdir(parents=True, exist_ok=True)

def sanitize(string):
    return re.sub(r'[^\w\s]', '', string, flags=re.UNICODE)

def clean_words(string):
  for word in words_to_clean:
    word_key, word_value = next(iter(word.items()))
    string = string.replace(word_key, word_value)
  return string

def clean_mdx(mdx_str):
    return mdx_str.replace('<', '').replace('>','')

def mdx_header(title, date, tags, draft, summary):
    tags_str = ", ".join([f'"{tag}"' for tag in tags])
    return f"---\ntitle: '{title}'\ndate: '{date}'\ntags: [{tags_str}]\ndraft: {str(draft).lower()}\nauthors: ['default']\nsummary: {sanitize(summary)}\n---\n\n"

def convert_to_webp(image_path, final_path):
    original_filename = os.path.basename(image_path)
    webp_filename = os.path.splitext(original_filename)[0] + '.webp'
    final_image_path = final_path / webp_filename

    with Image.open(image_path) as img:
        img.save(final_image_path, format='webp')
    
    return str(final_image_path)

def download_image(image_url, post_slug, images_path):
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image_name = image_url.split("/")[-1]

        with tempfile.TemporaryDirectory() as tmp_dir_name:
            temp_image_path = Path(tmp_dir_name) / image_name
            with open(temp_image_path, 'wb') as tmp_file:
                tmp_file.write(response.content)

            extension = Path(image_name).suffix.lower()
            if extension in ['.png', '.jpg', '.gif']:
                post_images_path = images_path / post_slug
                post_images_path.mkdir(parents=True, exist_ok=True)
                final_image_path = convert_to_webp(temp_image_path, post_images_path)
            else:
                post_images_path = images_path / post_slug
                post_images_path.mkdir(parents=True, exist_ok=True)
                final_image_path = post_images_path / image_name
                temp_image_path.replace(final_image_path)

        return str(final_image_path)
    except requests.RequestException as e:
        print(f"Error al descargar {image_url}: {e}")
        return None



def process_html_to_markdown(html, post_slug, images_path, feature_image=None):
    html_escaped = clean_words(html)
    soup = BeautifulSoup(html_escaped, 'html.parser')
    images = []
    markdown_content = ""

    if feature_image:
        feature_image = feature_image.replace('__GHOST_URL__', 'https://blog.ikerocio.com')
        feature_image_path = download_image(feature_image, post_slug, images_path)
        if feature_image_path:
            feature_image_path = feature_image_path.replace('../public', '')
            images.append(feature_image_path)
            markdown_content += f"![]({feature_image_path})\n\n"

    for img in soup.find_all('img'):
        img_url = img['src'].replace('__GHOST_URL__', 'https://blog.ikerocio.com')
        local_image_path = download_image(img_url, post_slug, images_path)
        if local_image_path:
            local_image_path = local_image_path.replace('../public', '')
            img_alt = img.get('alt', '')
            img.replace_with(f"![{img_alt}]({local_image_path})\n\n")
            images.append(local_image_path)

    markdown_content += clean_mdx(md(str(soup)))
    return markdown_content, images
 
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

for post in posts:
    markdown_content, images = process_html_to_markdown(post['html'], post["slug"], images_path, post['feature_image'])
    post_tags = post_to_tags[post["id"]]

    draft = post['status'] == 'draft'
    created_at = datetime.strptime(post["created_at"].replace('Z', ''), '%Y-%m-%dT%H:%M:%S.%f')
    content = mdx_header(post['title'], created_at.strftime("%Y-%m-%d"), post_tags, draft, post['plaintext'][:100])
    content = markdown_content

    post_info = {
        "title": post['title'],
        "slug": post['slug'],
        "date": created_at.strftime("%Y-%m-%d"),
        "tags": post_tags,
        "images": images,
        "draft": draft,
        "content": content
    }
    posts_with_tags.append(post_info)

with open(output_json_path, 'w', encoding='utf-8') as json_file:
    json.dump(posts_with_tags, json_file, ensure_ascii=False, indent=4)

print(f"Archivo JSON guardado en {output_json_path}")
