const canvas = document.getElementById('canvas-renderer');
const ctx = canvas.getContext('2d');

const bg_master = document.getElementById('bg-master');
const icon_master = document.getElementById('icon-master');
const template_master = document.getElementById('template-master');


function textFromInput (elementId) {
    return document.getElementById(elementId).value;
}
function textFromRadio (radioElementIdArray) {
    for (const id of radioElementIdArray) {
        if (document.getElementById(id).checked) {
            return document.getElementById(id).dataset.rendertext;
        }
    }
}
const fontSizePx = function(pt) {
    return (pt/72)*300;
}

function drawStrokedText (text, x, y, maxWidth, color, fontStyle) {
    ctx.lineWidth = '4';
    ctx.miterLimit = 2;
    ctx.strokeStyle = 'white';
    ctx.font = fontStyle;
    ctx.strokeText(text, x, y, maxWidth);
    ctx.fillStyle = color;
    ctx.fillText(text, x, y, (maxWidth - 4));
}

function processIconRichText (rawText) {
    let returnObj = {
        text: rawText,
        icons: [],
    };

    while (returnObj.text.indexOf('[') != -1) {
        let doContinue = false;
        for (const key in text_detections) {
            if (returnObj.text.indexOf(text_detections[key]) == returnObj.text.indexOf('[')) {
                returnObj.icons.push({
                    iconKey: ('glyph-' + key),
                    stringOnLeft: returnObj.text.substring(0, returnObj.text.indexOf('[')),
                })
                returnObj.text = returnObj.text.replace(text_detections[key], '　');
                doContinue = true;
                break;
            }
        }
        if (!doContinue) {
            break;
        }
    }

    return returnObj;
}

function drawTextLine (rawText, x, y, maxWidth, isStroked, color, fontSize, fontStyle) {
    lineText = processIconRichText(rawText).text;
    
    while (ctx.measureText(lineText).width > maxWidth) {
        lineText = lineText.substring(0, (lineText.length - 1));
    }
    if (isStroked) {
        drawStrokedText(lineText, x, y, maxWidth, color, fontStyle)
    } else {
        ctx.fillStyle = color;
        ctx.font = fontStyle;
        ctx.fillText(lineText, x, y, maxWidth);
    }

    for (iconObj of processIconRichText(rawText).icons) {
        let iconSheetKey;
        if (isStroked) {
            iconSheetKey = 'stroked-' + iconObj.iconKey;
        } else {
            iconSheetKey = iconObj.iconKey;
        }
        ctx.drawImage(
            document.getElementById('icon-master'),
            master_data.icons[iconSheetKey].x,
            master_data.icons[iconSheetKey].y,
            master_data.icons[iconSheetKey].w,
            master_data.icons[iconSheetKey].h,
            (x + ctx.measureText(iconObj.stringOnLeft).width),
            (y - fontSize),
            (fontSize * 1.2),
            (fontSize * 1.2),
        );
    }
}

function drawParagraph (text, x, y, maxWidth, maxLines, fontSize, isStroked, color, fontStyle) {
    if (maxLines == 1) {
        drawTextLine(text, x, y, maxWidth, isStroked, color, fontSize, fontStyle);
        return;
    }
    let paraText = text;
    for (let i = 0; i < maxLines; i++) {
        let line = paraText.trim();
        paraText = '';
        ctx.font = fontStyle;
        while (ctx.measureText(line).width > maxWidth) {
            paraText = line.substring(line.lastIndexOf(' ')) + paraText;
            line = line.substring(0, line.lastIndexOf(' '));
        }
        drawTextLine(line, x, (y + (i * 1.2 * fontSize)), maxWidth, isStroked, color, fontSize, fontStyle);
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

function updateRender() {
    ctx.clearRect(0, 0, 750, 1050);
    ctx.fillStyle = 'black';
    
    //Draw background
    ctx.drawImage(
        document.getElementById('bg-master'), 
        master_data.backgrounds[textFromInput('bg-path')].x, 
        master_data.backgrounds[textFromInput('bg-path')].y, 
        master_data.backgrounds[textFromInput('bg-path')].w, 
        master_data.backgrounds[textFromInput('bg-path')].h, 
        0, 
        0, 
        750, 
        1050
    );

    //Draw template
    ctx.drawImage(
        document.getElementById('template-master'),
        master_data.templates[textFromInput('template')].x, 
        master_data.templates[textFromInput('template')].y, 
        master_data.templates[textFromInput('template')].w, 
        master_data.templates[textFromInput('template')].h, 
        0,
        0,
        750,
        1050
    );

    //Draw icon
    ctx.drawImage(
        document.getElementById('icon-master'),
        master_data.icons[textFromInput('element-icon')].x, 
        master_data.icons[textFromInput('element-icon')].y, 
        master_data.icons[textFromInput('element-icon')].w, 
        master_data.icons[textFromInput('element-icon')].h, 
        37,
        43,
        60,
        60
    );

    const doStrokeText = document.getElementById('textcolor-highcontrast').checked;

    //Draw text
    const textData = {
        // x, y, renderText, fontSize(pt), isStrokeable, maxLines, maxWidth(px), fontStyle, color
        'prefix': [140, 60, textFromInput('prefix'), 6, false, 1, 450, 'SemiBold', '#000000'],
        'name': [135, 105, textFromInput('name'), 11, false, 1, 425, 'SemiBold', '#000000'],
        //'TEXT_HP': [630, 60, 'HP', 6, false, 1, 300, 'SemiBold', '#000000'],
        'hp': [615, 110, textFromInput('hp'), 14, false, 1, 100, 'SemiBold', '#000000'],
        'fighterRange': [70, 540, textFromRadio(['fighter-long', 'fighter-short', 'item-discard', 'item-attach']), 8, true, 1, 300, 'SemiBold', '#000000'],
        //'weakness-mult': [500, 540, ('x'+ textFromInput('weakness-mult')), 8, true, 1, 60, 'SemiBold', '#000000'],
        //'resistance-subtract': [635, 540, ('-'+ textFromInput('resistance-subtract')), 8, true, 1, 60, 'SemiBold', '#000000'],
        'energy-cost-1': [70, 610, (textFromInput('energy-cost-1')), 9, true, 1, 45, 'SemiBold', '#000000'],
        'name-1': [175, 610, textFromInput('name-1'), 9, true, 1, 425, 'SemiBold', (document.getElementById('special-text-1').checked ? '#004fcf' : '#000000')],
        'damage-1': [645, 610, textFromInput('damage-1'), 9, true, 1, 75, 'SemiBold', '#000000'],
        'text-1': [70, 660, textFromInput('text-1'), 8, true, 2, 620, 'Light', '#000000'],
        'energy-cost-2': [70, 785, (textFromInput('energy-cost-2')), 9, true, 1, 45, 'SemiBold', '#000000'],
        'name-2': [175, 785, textFromInput('name-2'), 9, true, 1, 425, 'SemiBold', (document.getElementById('special-text-2').checked ? '#004fcf' : '#000000')],
        'damage-2': [645, 785, textFromInput('damage-2'), 9, true, 1, 75, 'SemiBold', '#000000'],
        'text-2': [70, 835, textFromInput('text-2'), 8, true, 2, 620, 'Light', '#000000'],
        'artist': [40, 960, ('Illust.: ' + textFromInput('artist')), 5, true, 1, 240, 'Light', '#000000'],
        'TEXT_CARD_VERSION': [40, 985, 'Card Version ', 5, true, 1, 300, 'Light', '#000000'],
        'card-version': [165, 985, textFromInput('card-version'), 5, true, 1, 50, 'SemiBold', '#000000'],
        'year': [230, 985, textFromInput('year'), 5, true, 1, 50, 'Light', '#000000'],
        'TEXT_GAMENAME': [40, 1010, 'CARD_GAME_NAME_TEXT', 5, true, 1, 240, 'Light', '#000000'],
        'flavor-text': [350, 960, (textFromInput('flavor-text')), 5, true, 3, 375, 'Light', '#000000'],
    }
    for (const key in textData) {
        drawParagraph(textData[key][2], textData[key][0], textData[key][1], textData[key][6], textData[key][5], fontSizePx(textData[key][3]), (textData[key][4] && doStrokeText), textData[key][8], (fontSizePx(textData[key][3]) + 'px Bahnschrift ' + textData[key][7]));
    }

    //Don't draw certain icons if there is no accompanying text
    if (textFromInput('weakness-mult') != '') {
        ctx.font = (fontSizePx(8) + 'px Bahnschrift ' + "SemiBold");
        drawParagraph(('x'+ textFromInput('weakness-mult')), 500, 540, 60, 1, fontSizePx(8), (true && doStrokeText), '#000000');

        ctx.drawImage(
            document.getElementById('icon-master'),
            master_data.icons[document.getElementById('weakness').value].x, 
            master_data.icons[document.getElementById('weakness').value].y, 
            master_data.icons[document.getElementById('weakness').value].w, 
            master_data.icons[document.getElementById('weakness').value].h,
            455,
            510,
            36,
            36
        );
    }
    if (textFromInput('resistance-subtract') != '') {
        ctx.font = (fontSizePx(8) + 'px Bahnschrift ' + "SemiBold");
        drawParagraph(('-'+ textFromInput('resistance-subtract')), 635, 540, 60, 1, fontSizePx(8), (true && doStrokeText), '#000000');

        ctx.drawImage(
            document.getElementById('icon-master'),
            master_data.icons[document.getElementById('resistance').value].x, 
            master_data.icons[document.getElementById('resistance').value].y, 
            master_data.icons[document.getElementById('resistance').value].w, 
            master_data.icons[document.getElementById('resistance').value].h,
            590,
            510,
            36,
            36
        );   
    }

    if (textFromInput('energy-cost-1') != '') {
        ctx.drawImage(
            document.getElementById('icon-master'),
            master_data.icons['energy'].x, 
            master_data.icons['energy'].y, 
            master_data.icons['energy'].w, 
            master_data.icons['energy'].h,
            110,
            580,
            36,
            36
        );
    }
    if (textFromInput('energy-cost-2') != '') {
        ctx.drawImage(
            document.getElementById('icon-master'),
            master_data.icons['energy'].x, 
            master_data.icons['energy'].y, 
            master_data.icons['energy'].w, 
            master_data.icons['energy'].h,
            110,
            755,
            36,
            36
        );
    }

    if (textFromInput('hp') != '') {
        ctx.font = (fontSizePx(6) + 'px Bahnschrift ' + "SemiBold");
        drawParagraph('HP', 630, 60, 300, 1, fontSizePx(6), false), '#000000';
    }

    //Draw Main Image
    ctx.drawImage(document.getElementById('client-file-holder'), 75, 155, 600, 338);
}

const text_detections = {
    'fire': '[FIRE]',
    'water': '[WATER]',
    'earth': '[EARTH]',
    'air': '[AIR]',
    'ice': '[ICE]',
    'plant': '[PLANT]',
    'metal': '[METAL]',
    'force': '[FORCE]',
    'speed': '[SPEED]',
    'electric': '[ELECTRIC]',
    'aether': '[AETHER]',
}

const master_data = {
    icons: {
        htmlId: 'icon-master',
        'fire': {x: 0, y: 0, w: 64, h: 64},
        'water': {x: 64, y: 0, w: 64, h: 64},
        'earth': {x: (64*2), y: 0, w: 64, h: 64},
        'air': {x: (64*3), y: 0, w: 64, h: 64},
        'ice': {x: (64*4), y: 0, w: 64, h: 64},
        'plant': {x: (64*5), y: 0, w: 64, h: 64},
        'metal': {x: (64*6), y: 0, w: 64, h: 64},
        'force': {x: (64*7), y: 0, w: 64, h: 64},
        'speed': {x: (64*8), y: 0, w: 64, h: 64},
        'electric': {x: (64*9), y: 0, w: 64, h: 64},
        'aether': {x: (64*10), y: 0, w: 64, h: 64},
        '2fire': {x: (64*11), y: 0, w: 64, h: 64},
        '2water': {x: (64*12), y: 0, w: 64, h: 64},
        '2earth': {x: (64*13), y: 0, w: 64, h: 64},
        '2air': {x: (64*14), y: 0, w: 64, h: 64},
        
        'glyph-fire': {x: 0, y: (64*2), w: 64, h: 64},
        'glyph-water': {x: 64, y: (64*2), w: 64, h: 64},
        'glyph-earth': {x: (64*2), y: (64*2), w: 64, h: 64},
        'glyph-air': {x: (64*3), y: (64*2), w: 64, h: 64},
        'glyph-ice': {x: (64*4), y: (64*2), w: 64, h: 64},
        'glyph-plant': {x: (64*5), y: (64*2), w: 64, h: 64},
        'glyph-metal': {x: (64*6), y: (64*2), w: 64, h: 64},
        'glyph-force': {x: (64*7), y: (64*2), w: 64, h: 64},
        'glyph-speed': {x: (64*8), y: (64*2), w: 64, h: 64},
        'glyph-electric': {x: (64*9), y: (64*2), w: 64, h: 64},
        'glyph-aether': {x: (64*10), y: (64*2), w: 64, h: 64},
        'stroked-glyph-fire': {x: 0, y: (64*3), w: 64, h: 64},
        'stroked-glyph-water': {x: 64, y: (64*3), w: 64, h: 64},
        'stroked-glyph-earth': {x: (64*2), y: (64*3), w: 64, h: 64},
        'stroked-glyph-air': {x: (64*3), y: (64*3), w: 64, h: 64},
        'stroked-glyph-ice': {x: (64*4), y: (64*3), w: 64, h: 64},
        'stroked-glyph-plant': {x: (64*5), y: (64*3), w: 64, h: 64},
        'stroked-glyph-metal': {x: (64*6), y: (64*3), w: 64, h: 64},
        'stroked-glyph-force': {x: (64*7), y: (64*3), w: 64, h: 64},
        'stroked-glyph-speed': {x: (64*8), y: (64*3), w: 64, h: 64},
        'stroked-glyph-electric': {x: (64*9), y: (64*3), w: 64, h: 64},
        'stroked-glyph-aether': {x: (64*10), y: (64*3), w: 64, h: 64},

        'item': {x: 0, y: 64, w: 64, h: 64},
        'energy': {x: 64, y: 64, w: 64, h: 64},
        'air-alt': {x: (64*2), y: 64, w: 64, h: 64},
        'opal': {x: (64*3), y: 64, w: 64, h: 64},
        'energy-old': {x: (64*4), y: 64, w: 64, h: 64},
    },
    templates: {
        htmlId: 'template-master',
        'fighter': {x: 0, y: 0, w: 750, h: 1050},
        'fighter-gold': {x: 750, y: 0, w: 750, h: 1050},
        'item': {x: (750*2), y: 0, w: 750, h: 1050},
        'item-gold': {x: (750*3), y: 0, w: 750, h: 1050},
    },
    backgrounds: {
        htmlId: 'bg-master',
        'fire': {x: 0, y: 0, w: 750, h: 1050},
        'water': {x: 750, y: 0, w: 750, h: 1050},
        'earth': {x: (750*2), y: 0, w: 750, h: 1050},
        'air': {x: (750*3), y: 0, w: 750, h: 1050},
        'ice': {x: (750*4), y: 0, w: 750, h: 1050},
        'plant': {x: (750*5), y: 0, w: 750, h: 1050},
        'metal': {x: (750*6), y: 0, w: 750, h: 1050},
        'force': {x: (750*7), y: 0, w: 750, h: 1050},
        'speed': {x: (750*8), y: 0, w: 750, h: 1050},
        'electric': {x: (750*9), y: 0, w: 750, h: 1050},
        'aether': {x: (750*10), y: 0, w: 750, h: 1050},
        
        'sp-fire': {x: 0, y: 1050, w: 750, h: 1050},
        'sp-metal': {x: (750*6), y: 1050, w: 750, h: 1050},
        
        'pt-green': {x: 0, y: (1050*2), w: 750, h: 1050},
        'pt-blue': {x: 750, y: (1050*2), w: 750, h: 1050},
        'pt-blood': {x: (750*2), y: (1050*2), w: 750, h: 1050},
        'pt-purple': {x: (750*3), y: (1050*2), w: 750, h: 1050},
        'pt-opal': {x: (750*4), y: (1050*2), w: 750, h: 1050},
        'pt-lightning': {x: (750*5), y: (1050*2), w: 750, h: 1050},
    },
}