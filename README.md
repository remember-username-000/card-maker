# card-maker

HTML-based card maker for the card game "".

## How to use

Enter card information into fields, thnen press "Render".
The following fields are required for rendering:

- Card Template
    - Accepts either `fighter`, `item`, or another prototype card template (see changelog).
- Card Background
    - Accepts the name of any (elemental) type. See list below.
- Element Icon
    - Accepts the name of any (elemental) type. See list below.

### Elemental types

- Fire: `fire`
- Water: `water`
- Earth: `earth`
- Air: `air`
- Ice: `ice`
- Forest: `plant`
- Metal: `metal`
- Force: `force`
- Speed: `speed`
- Electric: `electric`
- Aether: `aether`

This list is also typed out at the very bottom of the HTML page.
For Element icons, "double" types (i.e. double fire type") are available. They are `2fire`, `2water`, `2earth`, and `2air`.

## Editing master sheets

Templates, backgrounds, and icons can be added, removed, or edited from the master sheets (`bg-master`, `icon-master`, and `template-master`). After editing, adding, or removing elements from these sheets, ensure that the data in `const master_data`, at the bottom of `script.js`, matches the edits. Data in `master_data` are structured as follows:

```
{
    x: x-position of top-left corner of image element
    y: y-position of top-left corner of image element
    w: width of image element
    h: height of image element
}
```