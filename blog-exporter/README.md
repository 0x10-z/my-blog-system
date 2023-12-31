# README for Scripts `clean_json.py` and `export.py`

## Overview

These scripts are part of a two-stage process for converting and exporting blog data from a backup JSON file. The first script (`clean_json.py`) cleans, processes, and saves the blog posts and associated images, while the second (`export.py`) exports them into markdown files.

### `clean_json.py`

This script performs the following functions:

1. **Reading Backup JSON File**: Reads a JSON file containing data of blog posts (e.g., from a platform like Ghost).

2. **Cleaning and Conversion**: Converts the HTML of the posts to Markdown, performs text cleaning, and extracts image URLs.

3. **Image Download**: Downloads all images referenced in each post and saves them in a local folder.

4. **Saving Processed Data**: Saves the information of the posts, including Markdown content and references to local images, in a new JSON file.

### `export.py`

This script handles the exporting of the processed data:

1. **Reading Processed JSON File**: Reads the JSON file generated by `clean_json.py`.

2. **Creating Markdown Files**: For each post, generates a markdown file (.mdx) with content, date, tags, etc.

3. **Saving Markdown Files**: Saves each post as a markdown file in a specific directory.

## Requirements

- Python 3.x
- Python Libraries: `json`, `bs4` (BeautifulSoup), `markdownify`, `pathlib`, `datetime`, `re`, `requests`.
- Access to backup files in JSON format.

## Usage

### `clean_json.py`

1. Ensure you have the backup JSON file in the same location as the script or update the `file_path` variable to point to its location.
2. Run the script: `python clean_json.py`.
3. Processed data will be saved in `posts_and_tags.json` and images in the `./images/` folder.

### `export.py`

1. After running `clean_json.py`, ensure you have `posts_and_tags.json` in the same location as `export.py`.
2. Run the script: `python export.py`.
3. Markdown files of the posts will be saved in the `./posts/` folder.

## Additional Notes

- Customize the scripts as necessary, particularly the file and folder paths.
- Ensure you have write permissions in the folders where the scripts attempt to save files.
- These scripts do not include advanced error handling, so it's advisable to review and modify according to specific requirements of the environment and data.
