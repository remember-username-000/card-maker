# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/).

## 1.0.0 - 2024-10-26

### Added

- Added the "Is Special Ability" checkbox for special abilities. If selected, this turns the name of an attack blue.
- Elemental type symbols can now be inserted into body text by typing "\[ELEMENT_NAME\]". The element name must be in capital letters.

### Changed

- Moved elements around within index.html to follow a more natural workflow.
- Some elements in index.html that were previously radio or select options replaced with text input. See the README file for guidance.
- Changed script.js to be compatible with new changes in image storage and the user interface.
    - This makes v1.0.0 incompatible with v0.0.0.
- Replaced individual image files with three spretesheet-style master sheets: bg-master, template-master, and icon-master.
- Icons have been changed to more accurately reflect elemental types.

## 0.0.0

### Added

- Created index.html, including basic interface.
- Created style.css.
- Created script.js, using the HTML canvas element to construct a downloadable image on-screen when rendered.
- Created the /backgrounds folder, containing backgrounds, including prototypes for the cards.
- Created the /symbols folder, containing backgrounds for the cards.
- Created the /layers folder, containing the card template and a prototype background.
- Imported Bahnschrift.ttf for use on the cards.