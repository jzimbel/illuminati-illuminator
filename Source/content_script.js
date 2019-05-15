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

const randomChoice = options =>
  options[Math.floor(Math.random() * options.length)];

const getTheoryCharacters = str =>
  [...randomChoice(theories).toLowerCase()].filter(char => /\w/.test(char));

const walk = (characters, rootNode) => {
  // Find all the text nodes in rootNode
  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  let toFindIndex = 0;
  const updaters = [];
  while (toFindIndex < characters.length && (node = walker.nextNode())) {
    const {offset, updater} = getNodeUpdater(
      node,
      characters.slice(toFindIndex)
    );
    toFindIndex += offset;
    updater && updaters.push(updater);
  }
  if (toFindIndex === characters.length) {
    updaters.forEach(updater => {
      updater();
    });
  }
};

const getFontSize = () => `${100 + Math.ceil(Math.random() * 100)}%`;

const getBackgroundColor = () =>
  randomChoice(['#ff69b4', '#56ff00', '#6a7e25', '#d6c601']);

const getFontFamily = () =>
  randomChoice(['sans-serif', 'serif', 'cursive', 'monospace']);

const getHighlightedElement = str => {
  const highlightedElement = document.createElement('strong');
  highlightedElement.innerText = str;
  highlightedElement.style.background = getBackgroundColor();
  highlightedElement.style.fontSize = getFontSize();
  highlightedElement.style.fontFamily = getFontFamily();
  return highlightedElement;
};

// Reads through a text node and finds characters to highlight.
// Returns an object of the shape: {
//   offset: number of characters found to highlight,
//   updater: false if no interesting characters found in this node,
//            or a function that edits the DOM to highlight characters
// }
const getNodeUpdater = (textNode, characters) => {
  let offset = 0;
  // an array of strings and Element objects that will replace this node.
  // strings contain characters that are left alone,
  // Elements contain characters that are highlighted as part of the hidden message
  const newNodeParts = [...textNode.nodeValue].reduce((parts, char) => {
    if (char.toLowerCase() === characters[offset]) {
      offset++;
      return parts.concat(getHighlightedElement(char));
    } else if (
      parts.length > 0 &&
      typeof parts[parts.length - 1] === 'string'
    ) {
      parts[parts.length - 1] = parts[parts.length - 1].concat(char);
      return parts;
    } else {
      return parts.concat(char);
    }
  }, []);
  return {
    offset,
    updater:
      newNodeParts.some(part => part instanceof Element) &&
      (() => {
        textNode.replaceWith(...newNodeParts);
      })
  };
};

// Walk the doc (document) body and highlight characters in the conspiracy theory
const highlightSuspiciousCharacters = doc => {
  // only operate on pages that have a <main> element so that we have a better
  // chance that all of the highlighted characters actually appear in visible
  // elements within the main content
  const mainElements = doc.body.getElementsByTagName('main');
  const hasMain = mainElements.length > 0;
  if (hasMain) {
    const main = mainElements[0];
    const characters = getTheoryCharacters();
    walk(characters, main);
  }
};
highlightSuspiciousCharacters(document);
