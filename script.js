const canvas = document.getElementById('canvas-renderer');
const ctx = canvas.getContext('2d');

const img_template = document.getElementById('img-template');
let allowBgPath = false;

function textFromRadio (radioElementIdArray) {
    for (const id of radioElementIdArray) {
        if (document.getElementById(id).checked) {
            return document.getElementById(id).dataset.rendertext;
        }
    }
}
function textFromInput (elementId) {
    return document.getElementById(elementId).value;
}

const fontSizePx = function(pt) {
    return (pt/72)*300;
}

document.getElementById('flavor-text').setAttribute('value', 'This is a really long string of text to see what happens if/when it overflows the boundary. This should not be visible in the final version. If it is, something went wrong.');
document.getElementById('text-1').setAttribute('value', 'This is a really long string of text to see what happens if/when it overflows the boundary. This should not be visible in the final version. If it is, something went wrong.');
document.getElementById('text-2').setAttribute('value', 'This is a really long string of text to see what happens if/when it overflows the boundary. This should not be visible in the final version. If it is, something went wrong.');
let tempInputElementList = document.querySelectorAll('input');
tempInputElementList.forEach(function (elem) {
    if (elem.getAttribute('value')) {
        //do nothing
    } else if (elem.getAttribute('type') == 'text') {
        elem.setAttribute('value', 'Lorem ipsum dolor sit amet, consectetur edpipiscing');
    } else if (elem.getAttribute('type') == 'number') {
        elem.setAttribute('value', '10');
    }
});

function updateRender() {
    ctx.clearRect(0, 0, 750, 1050);
    ctx.fillStyle = 'black';
    
    if (allowBgPath) {
        updateBgCache();
        ctx.drawImage(document.getElementById('client-bg-holder'), 0, 0, 750, 1050);
    } else {
        ctx.drawImage(document.getElementById('bg-' + document.getElementById('element').value), 0, 0, 750, 1050);
    }

    ctx.drawImage(img_template, 0, 0);
    ctx.drawImage(document.getElementById('img-' + document.getElementById('element').value), 37, 43, 60, 60);

    const doStrokeText = document.getElementById('textcolor-highcontrast').checked;

    const textData = {
        // x, y, renderText, fontSize(pt), isStrokeable, maxLines, maxWidth(px), fontStyle
        'prefix': [140, 60, textFromInput('prefix'), 6, false, 1, 450, 'SemiBold'],
        'name': [135, 105, textFromInput('name'), 11, false, 1, 425, 'SemiBold'],
        'TEXT_HP': [630, 60, 'HP', 6, false, 1, 300, 'SemiBold'],
        'hp': [615, 110, textFromInput('hp'), 14, false, 1, 100, 'SemiBold'],
        'fighterRange': [70, 540, textFromRadio(['fighter-long', 'fighter-short']), 8, true, 1, 300, 'SemiBold'],
        'energy-cost-1': [70, 610, (textFromInput('energy-cost-1')), 9, true, 1, 45, 'SemiBold'],
        'name-1': [175, 610, textFromInput('name-1'), 9, true, 1, 425, 'SemiBold'],
        'damage-1': [645, 610, textFromInput('damage-1'), 9, true, 1, 75, 'SemiBold'],
        'text-1': [70, 660, textFromInput('text-1'), 8, true, 2, 620, 'Light'],
        'energy-cost-2': [70, 785, (textFromInput('energy-cost-2')), 9, true, 1, 45, 'SemiBold'],
        'name-2': [175, 785, textFromInput('name-2'), 9, true, 1, 425, 'SemiBold'],
        'damage-2': [645, 785, textFromInput('damage-2'), 9, true, 1, 75, 'SemiBold'],
        'text-2': [70, 835, textFromInput('text-2'), 8, true, 2, 620, 'Light'],
        'artist': [40, 960, ('Illust.: ' + textFromInput('artist')), 5, true, 1, 240, 'Light'],
        'TEXT_CARD_VERSION': [40, 985, 'Card Version ', 5, true, 1, 300, 'Light'],
        'card-version': [165, 985, textFromInput('card-version'), 5, true, 1, 50, 'SemiBold'],
        'year': [230, 985, textFromInput('year'), 5, true, 1, 50, 'Light'],
        'TEXT_GAMENAME': [40, 1010, 'CARD_GAME_NAME_TEXT', 5, true, 1, 240, 'Light'],
        'flavor-text': [350, 960, (textFromInput('flavor-text')), 5, true, 3, 375, 'Light'],
    }
    const optionalTextData = {
        'weakness-mult': [500, 540, ('x'+ textFromInput('weakness-mult')), 8, true, 1, 60, 'SemiBold'],
        'resistance-subtract': [635, 540, ('-'+ textFromInput('resistance-subtract')), 8, true, 1, 60, 'SemiBold'],
    }

    for (const key in textData) {
        ctx.font = (fontSizePx(textData[key][3]) + 'px Bahnschrift ' + textData[key][7]);
        drawParagraph(textData[key][2], textData[key][0], textData[key][1], textData[key][6], textData[key][5], fontSizePx(textData[key][3]), (textData[key][4] && doStrokeText));
    }
    for (const key in optionalTextData) {
        if (textFromInput(key) != '') {
            ctx.font = (fontSizePx(optionalTextData[key][3]) + 'px Bahnschrift ' + optionalTextData[key][7]);
            drawParagraph(optionalTextData[key][2], optionalTextData[key][0], optionalTextData[key][1], optionalTextData[key][6], optionalTextData[key][5], fontSizePx(optionalTextData[key][3]), (optionalTextData[key][4] && doStrokeText));
        }
    }


    if (textFromInput('weakness-mult') != '') {
        ctx.drawImage(document.getElementById('img-' + document.getElementById('weakness').value), 455, 510, 36, 36);
    }
    if (textFromInput('resistance-subtract') != '') {
        ctx.drawImage(document.getElementById('img-' + document.getElementById('resistance').value), 590, 510, 36, 36);   
    }

    if (textFromInput('energy-cost-1') != '') {
        ctx.drawImage(document.getElementById('img-energy'), 110, 580, 36, 36);
    }
    if (textFromInput('energy-cost-2') != '') {
        ctx.drawImage(document.getElementById('img-energy'), 110, 755, 36, 36);
    }

    ctx.drawImage(document.getElementById('client-file-holder'), 75, 155, 600, 338);

}

function drawStrokedText (text, x, y, maxWidth) {
    ctx.lineWidth = '4';
    ctx.miterLimit = 2;
    ctx.strokeStyle = 'white';
    ctx.strokeText(text, x, y, maxWidth);
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y, (maxWidth - 4));
}

/**
 * Renders a string of text with line breaks placed. If there is too much text, will only render as much as possible.
 * @param {string} text Text to be rendered
 * @param {number} x x-position at which to render the text
 * @param {number} y y-position at which to render the text
 * @param {number} maxWidth Maximum width of text box
 * @param {number} maxLines Maximum amount of lines in text box
 * @param {number} fontSize Height of font, in pixels
 * @param {boolean} isStroked Whether or not the test is stroked for visibility
 */
function drawParagraph (text, x, y, maxWidth, maxLines, fontSize, isStroked) {
    if (maxLines == 1) {
        drawTextLine(text, x, y, maxWidth, isStroked);
        return;
    }
    let paraText = text;
    for (let i = 0; i < maxLines; i++) {
        let line = paraText.trim();
        paraText = '';
        while (ctx.measureText(line).width > maxWidth) {
            paraText = line.substring(line.lastIndexOf(' ')) + paraText;
            line = line.substring(0, line.lastIndexOf(' '));
        }
        if (isStroked) {
            drawStrokedText(line, x, (y + (i * 1.2 * fontSize)), maxWidth)
        } else {
            ctx.fillText(line, x, (y + (i * 1.2 * fontSize)), maxWidth);
        }
    }
}

function drawTextLine (text, x, y, maxWidth, isStroked) {
    let lineText = text;
    while (ctx.measureText(lineText).width > maxWidth) {
        lineText = lineText.substring(0, (lineText.length - 1));
    }
    if (isStroked) {
        drawStrokedText(lineText, x, y, maxWidth)
    } else {
        ctx.fillText(lineText, x, y, maxWidth);
    }
}

function updateImageCache () {
    let imgFile = document.getElementById('img-main').files[0];
    let imgHolder = document.getElementById('client-file-holder');
    const reader = new FileReader();

    reader.readAsDataURL(imgFile);

    reader.addEventListener('load', function (e) {
        imgHolder.src = reader.result;
    });
}

function updateBgCache () {
    let imgHolder = document.getElementById('client-bg-holder');
    imgHolder.src = 'backgrounds/' + textFromInput('bg-path') + '.png';
}

function enableBgPath() {
    document.getElementById('bg-path-div').style.display = "block";
    allowBgPath = true;
}