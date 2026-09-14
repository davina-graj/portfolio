# 🌿 Nature-Themed Computer Science Portfolio

A calm, earth-toned personal portfolio for a computer science student or software engineer. Content is data-driven: every section reads from JSON files in [`assets/user_data/`](assets/user_data), so you edit data rather than markup.

Built on the Nature Canvas template from [Portfolio-Templates](https://github.com/madhurimarawat/Portfolio-Templates) by Madhurima Rawat (MIT), restyled around a four-colour palette.

## 🎨 Palette

| Token      | Hex       | Role                                                        |
| ---------- | --------- | ----------------------------------------------------------- |
| `--sand`   | `#C2A884` | Warm accent: heading underlines, card tops, dark-mode titles |
| `--sage`   | `#677C69` | Borders, hover states, secondary text                        |
| `--forest` | `#40534D` | Body copy in light mode, card surfaces in dark mode          |
| `--pine`   | `#1A3637` | Headings and skill chips in light mode, background at night  |

Light mode backgrounds use tints of `--sand` (`--sand-mist`, `--sand-veil`) so body text clears WCAG AA contrast; dark mode flips to a deep pine background with warm sand text. All of it is defined in [`Nature_Canvas/css/variables.css`](Nature_Canvas/css/variables.css) — change the four hexes there and the whole site follows.

## 📁 Structure

```
index.html              # the portfolio page (site root)
Nature_Canvas/          # the theme: CSS and background art
  css/variables.css     # palette + typography tokens
  css/main-styles.css   # layout and components
  css/index.css         # light mode colours
  css/index-dark.css    # dark mode colour remap
  css/responsive-styles.css
  images/               # leaf frame background
assets/user_data/*.json # your content
js/index.js             # loads the JSON and renders each section
_config.yml             # GitHub Pages url + baseurl
deleteLater/            # temporary backup of removed template files
```

## ✏️ Making it yours

1. Edit the JSON files in `assets/user_data/`: `user.json`, `social_links.json`, `experience.json`, `projects.json`, `education.json`.
2. `user.json` takes skills either as a flat list or as an object of category → list; categories render as labelled rows of pills.
3. `experience.json` and `projects.json` both accept a `highlights` array, which renders as leaf-bulleted lines.
4. Add screenshots for your projects by setting each project's `image` field to a path or URL. An empty value simply renders the card without an image.
5. Any section whose JSON is empty or missing hides itself automatically.
6. Update `url` and `baseurl` in `_config.yml` to match where you deploy.

## 🚀 Running locally

The site uses Jekyll's `{{ site.baseurl }}`, so serve it with Jekyll rather than opening the HTML directly:

```bash
bundle exec jekyll serve
```

Then visit `http://localhost:4000/portfolio/`.

## 📄 License

MIT — see [LICENSE](LICENSE).
