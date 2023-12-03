import re
import requests
import tempfile
from bs4 import BeautifulSoup
from pathlib import Path
from PIL import Image
import os
from openai import OpenAI
from markdownify import MarkdownConverter

class MyMarkdownConverter(MarkdownConverter):
    def convert_h1(self, el, text, convert_as_inline):
        return f'# {text}\n\n'
    
    def convert_h2(self, el, text, convert_as_inline):
        return f'## {text}\n\n'
    
    def convert_h3(self, el, text, convert_as_inline):
        return f'### {text}\n\n'
    
    def convert_figure(self, el, text, convert_as_inline):
        figcaption = el.find('figcaption')
        caption_text = figcaption.get_text(strip=True) if figcaption else ''

        img_markdown_pattern = re.compile(r'!\[.*\]\((.*?)\)')
        match = img_markdown_pattern.search(text)
        
        if match:
            img_markdown = match.group(0)
            img_url = match.group(1)
            new_img_markdown = f'![{caption_text}]({img_url})'
            text = text.replace(img_markdown, new_img_markdown)

        return text

    def convert_figcaption(self, el, text, convert_as_inline):
        return ''

    
md = MyMarkdownConverter()

class TextCleaner:
    @staticmethod
    def sanitize(string: str) -> str:
        return re.sub(r'[^\w\s]', '', string, flags=re.UNICODE)

    @staticmethod
    def clean_words(string: str) -> str:
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
    def clean_mdx(mdx_str: str) -> str:
        return mdx_str.replace('<', '').replace('>','')

class MarkdownGenerator:
    @staticmethod
    def generate_header(title: str, date: str, tags: list, images: list, draft: bool, summary: str) -> str:
        tags_str = ", ".join([f'"{tag}"' for tag in tags])
        images_str = ", ".join([f'"{img}"' for img in images])
        return f"---\ntitle: '{title}'\ndate: '{date}'\ntags: [{tags_str}]\ndraft: {str(draft).lower()}\nauthors: ['default']\nsummary: '{(summary)}'\nimages: [{images_str}]\n---\n\n"

class ImageProcessor:
    @staticmethod
    def convert_and_download_image(image_url: str, post_slug: str, images_path: Path) -> str:
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
    def convert_to_webp(image_path: Path, final_path: Path) -> str:
        original_filename = os.path.basename(image_path)
        webp_filename = os.path.splitext(original_filename)[0] + '.webp'
        final_image_path = final_path / webp_filename

        with Image.open(image_path) as img:
            if img.format == 'GIF' and 'duration' in img.info:
                img.save(final_image_path, format='webp', save_all=True, duration=img.info['duration'], loop=0)
            else:
                img.save(final_image_path, format='webp')

        return str(final_image_path)

class HTMLProcessor:
    @staticmethod
    def process_html_to_markdown(html: str, post_slug: str, images_path: Path, feature_image: str = None) -> tuple[str, list]:
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

        markdown_content += TextCleaner.clean_mdx(md.convert(str(soup)))
        return markdown_content, images

    @staticmethod
    def generate_redirects(output_file: str, posts: list) -> None:
        with open(output_file, "w") as file:
            file.write("const Redirects = [\n")
            for post in posts:
                file.write("  {\n")
                file.write(f"    source: '/{post['slug']}',\n")
                file.write(f"    destination: '/blog/{post['slug']}',\n")
                file.write(f"    permanent: false,\n")
                file.write("  },\n")
            file.write("]\n")

        print(f"Se ha generado el archivo {output_file}")

class ChatGPT:
    def __init__(self, api_key, model="gpt-3.5-turbo-16k"):
        self.api_key = api_key
        self.client = OpenAI(
            api_key=api_key,
        )
        self.model = model

    def summarize_markdown(self, markdown_text):
        try:
            prompt = f"""
            Hazme un resumen de este texto en markdown para mi blog. Lo voy a poner tal cual escribas,
            como si fuese una sinopsis. Escribelo en primera persona. Hay maquinas CTF de Capture The Flag.
            Para estos posts haz un resumen tipico en plan: Reto CTF que consiste en... y comenta las vulnerabilidades que se atacan.
            Dame solo texto de 30 palabras. Se muy conciso.:\n\n{markdown_text}\n\n"""
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
            )

            if response.choices:
                summary = response.choices[0].message.content
                return summary
            else:
                return "No summary available."

        except Exception as e:
            return f"An error occurred: {str(e)}"
