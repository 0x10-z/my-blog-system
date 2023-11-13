import re
import requests
import tempfile
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from pathlib import Path
from PIL import Image
import os

class TextCleaner:
    @staticmethod
    def sanitize(string):
        return re.sub(r'[^\w\s]', '', string, flags=re.UNICODE)

    @staticmethod
    def clean_words(string):
        words_to_clean = [
            { "&lt;": "<"},
            { "&gt;": ">"},
            { "<gathered_session_id>": "gathered_session_id"},
        ]

        for word in words_to_clean:
            word_key, word_value = next(iter(word.items()))
            string = string.replace(word_key, word_value)
        return string

    @staticmethod
    def clean_mdx(mdx_str):
        return mdx_str.replace('<', '').replace('>','')

class MarkdownGenerator:
    @staticmethod
    def generate_header(title, date, tags, draft, summary):
        tags_str = ", ".join([f'"{tag}"' for tag in tags])
        return f"---\ntitle: '{title}'\ndate: '{date}'\ntags: [{tags_str}]\ndraft: {str(draft).lower()}\nauthors: ['default']\nsummary: '{(summary)}'\n---\n\n"

class ImageProcessor:
    @staticmethod
    def convert_and_download_image(image_url, post_slug, images_path):
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
                    final_image_path = ImageProcessor.convert_to_webp(temp_image_path, post_images_path)
                else:
                    post_images_path = images_path / post_slug
                    post_images_path.mkdir(parents=True, exist_ok=True)
                    final_image_path = post_images_path / image_name
                    temp_image_path.replace(final_image_path)

            return str(final_image_path)
        except requests.RequestException as e:
            print(f"Error al descargar {image_url}: {e}")
            return None

    @staticmethod
    def convert_to_webp(image_path, final_path):
        original_filename = os.path.basename(image_path)
        webp_filename = os.path.splitext(original_filename)[0] + '.webp'
        final_image_path = final_path / webp_filename

        with Image.open(image_path) as img:
            img.save(final_image_path, format='webp')

        return str(final_image_path)

class HTMLProcessor:
    @staticmethod
    def process_html_to_markdown(html, post_slug, images_path, feature_image=None):
        html_escaped = TextCleaner.clean_words(html)
        soup = BeautifulSoup(html_escaped, 'html.parser')
        images = []
        markdown_content = ""

        if feature_image:
            feature_image = feature_image.replace('__GHOST_URL__', 'https://blog.ikerocio.com')
            feature_image_path = ImageProcessor.convert_and_download_image(feature_image, post_slug, images_path)
            if feature_image_path:
                feature_image_path = feature_image_path.replace('../public', '')
                images.append(feature_image_path)
                markdown_content += f"![]({feature_image_path})\n\n"

        for img in soup.find_all('img'):
            img_url = img['src'].replace('__GHOST_URL__', 'https://blog.ikerocio.com')
            local_image_path = ImageProcessor.convert_and_download_image(img_url, post_slug, images_path)
            if local_image_path:
                local_image_path = local_image_path.replace('../public', '')
                img_alt = img.get('alt', '')
                img.replace_with(f"![{img_alt}]({local_image_path})\n\n")
                images.append(local_image_path)

        markdown_content += TextCleaner.clean_mdx(md(str(soup)))
        return markdown_content, images
