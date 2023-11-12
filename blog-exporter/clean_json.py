import json
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from pathlib import Path
from datetime import datetime
import re
import requests
from pathlib import Path

words_to_clean = [
  { "&lt;": "<"},
  { "&gt;": ">"},
  { "<gathered_session_id>": "gathered_session_id"},
]

file_path = "./ghost-backup-2023-11-10.json"
output_path = Path("./posts/")
output_json_path = Path("./posts_and_tags.json")  # Ruta para el nuevo archivo JSON
images_path = Path("./images/")

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

def download_image(image_url, post_slug, images_path):
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image_name = image_url.split("/")[-1]
        post_images_path = images_path / post_slug
        post_images_path.mkdir(parents=True, exist_ok=True)
        image_path = post_images_path / image_name
        with open(image_path, 'wb') as file:
            file.write(response.content)
        return str(image_path)
    except requests.RequestException as e:
        print(f"Error al descargar {image_url}: {e}")
        return None


def process_html_to_markdown(html, post_slug, images_path):
    html_escaped = clean_words(html)
    soup = BeautifulSoup(html_escaped, 'html.parser')
    images = []
    for img in soup.find_all('img'):
        img_url = img['src'].replace('__GHOST_URL__', 'https://blog.ikerocio.com')
        local_image_path = download_image(img_url, post_slug, images_path)
        if local_image_path:
            img_alt = img.get('alt', '')
            img.replace_with(f"![{img_alt}]({local_image_path})")
            images.append(local_image_path)

    return clean_mdx(md(str(soup))), images
 
with open(file_path, 'r', encoding='utf-8') as file:
    db = json.load(file)

posts = db["db"][0]["data"]["posts"]
tags = {tag["id"]: tag["name"] for tag in db["db"][0]["data"]["tags"]}
posts_tags = db["db"][0]["data"]["posts_tags"]

post_to_tags = {post["id"]: [] for post in posts}
for post_tag in posts_tags:
    if post_tag["post_id"] in post_to_tags:
        post_to_tags[post_tag["post_id"]].append(tags[post_tag["tag_id"]])

posts_with_tags = []  # Lista para almacenar la información de los posts y sus tags

for post in posts:
    markdown_content, images = process_html_to_markdown(post['html'], post["slug"], images_path)
    post_tags = post_to_tags[post["id"]]

    draft = post['status'] == 'draft'
    created_at = datetime.strptime(post["created_at"].replace('Z', ''), '%Y-%m-%dT%H:%M:%S.%f')
    content = mdx_header(post['title'], created_at.strftime("%Y-%m-%d"), post_tags, draft, post['plaintext'][:100])
    content = markdown_content

    # Almacenar información en la estructura de datos
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

# Guardar la estructura de datos en un archivo JSON
with open(output_json_path, 'w', encoding='utf-8') as json_file:
    json.dump(posts_with_tags, json_file, ensure_ascii=False, indent=4)

print(f"Archivo JSON guardado en {output_json_path}")
