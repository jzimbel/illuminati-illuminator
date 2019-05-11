const theories = [
  'Lil Dicky is the foreign policy adviser to the President',
  'The Illuminati own Congress',
  'Nine eleven was an inside job',
  'Seven eleven was an inside job',
  'The deep state knows where you live',
  'Beyonce is not human',
  'Birds are not real',
  'Vaccines make you think the earth is round',
  'Obama is Trumps cousin',
  'The MBTA is the greatest transit system on earth',
  'Water was created to keep the man down',
  'RuPaul is the one true god'
];

const getTheory = () => {
  return randomChoice(theories);
}

const randomChoice = options =>
  options[Math.floor(Math.random() * options.length)];

const getChars = str => [...str.toLowerCase()].filter(char => /\w/.test(char));

const getCharsForReplace = str => [...str];

// Returns true if a node should be checked for text to change
const isCandidate = node =>
  !(
    node.isContentEditable // DraftJS and many others
    || (node.parentNode && node.parentNode.isContentEditable) // Special case for Gmail
    || (
      node.tagName // Some catch-alls
      && (
        node.tagName.toLowerCase() == 'textarea'
        || node.tagName.toLowerCase() == 'input'
      )
    )
  );

const walk = (characters, rootNode) => {
  let toFindIndex = 0;

  // Find all the text nodes in rootNode
  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let node;

  const updaters = [];
  // Modify each text node's value
  while (node = walker.nextNode()) {
    const result = handleText(node, characters, toFindIndex);
    toFindIndex = result.toFindIndex;
    updaters.push(result.updater);
    if (toFindIndex === characters.length) {
      break;
    }
  }
  if (toFindIndex === characters.length) {
    updaters.filter(updater => updater !== null).forEach(
      updater => {
        updater();
      }
    );
  }
};

const getFontResize = () => `${150 + Math.ceil((Math.random()*100))}%`;

const getBackgroundColor = () => randomChoice(['#ff69b4', '#56ff00', '#6a7e25', '#d6c601']);

const getHighlightedElement = str => {
  const highlightedElement = document.createElement('strong');
  highlightedElement.innerText = str;
  highlightedElement.style.background = getBackgroundColor();
  highlightedElement.style.fontSize = getFontResize();
  return highlightedElement;
};

const handleText = (textNode, characters, toFindIndex) => {
  let newIndex = toFindIndex;
  const newNodeParts =
    getCharsForReplace(textNode.nodeValue)
      .reduce((parts, char) => {
        if (char.toLowerCase() === characters[newIndex]) {
          newIndex++;
          return parts.concat(getHighlightedElement(char));
        } else if (parts.length > 0 && typeof parts[parts.length - 1] === 'string') {
          parts[parts.length - 1] = parts[parts.length - 1].concat(char);
          return parts;
        } else {
          return parts.concat(char);
        }
      }, []);
  return {
    toFindIndex: newIndex,
    updater: newNodeParts.some(part => typeof part === 'object') ? () => {
      textNode.replaceWith(...newNodeParts);
    } : null
  };
};

// Walk the doc (document) body and highlight characters in the conspiracy theory
const checkAndReplace = doc => {
  // only operate on pages that have a <main> element
  const mainElements = doc.body.getElementsByTagName('main');
  const hasMain = mainElements.length > 0;
  if (hasMain) {
    const main = mainElements[0];
    // get the characters of a random conspiracy theory
    const characters = getChars(getTheory());

    walk(characters, main);
  }
};
checkAndReplace(document);
