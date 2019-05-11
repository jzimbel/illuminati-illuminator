const theories = [
  'Teachers are conspiring to bankrupt the nation.',
  'The butler is conspiring to ruin the economy.',
  'Prince is conspiring to blow things up.',
  'The girlscouts are conspiring to keep a brotha down.',
  'Lil Jon is the foreign policy adviser to the President'
];

const getTheory = () => {
  return randomChoice(theories);
}

const randomChoice = options =>
  options[Math.floor(Math.random()*options.length)];

const walk = rootNode => {
  // Find all the text nodes in rootNode
  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let node;

  // Modify each text node's value
  while (node = walker.nextNode()) {
    handleText(node);
  }
};

const getStringCharacters = str => [...str];

const handleText = textNode => {
  textNode.nodeValue = replaceText(textNode.nodeValue);
};

const replaceText = v => {
  let result = v;
  result = result.replace(/\b(T|t)he\b/g, 'foobar');
  return result;
};

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

// The callback used for the document body and title observers
const observerCallback = mutations => {
  mutations.forEach(({addedNodes}) => {
      Array.from(addedNodes)
      .filter(isCandidate)
      .forEach(node => {
        if (node.nodeType === 3) {
          handleText(node);
        } else {
          walk(node);
        }
      });
  });
};

// Walk the doc (document) body, replace the title, and observe the body and title
const walkAndObserve = doc => {
  const observerConfig = {
    characterData: true,
    childList: true,
    subtree: true
  };

  // Do the initial text replacements in the document body and title
  walk(doc.body);

  // Observe the body so that we replace text in any added/modified nodes
  const bodyObserver = new MutationObserver(observerCallback);
  bodyObserver.observe(doc.body, observerConfig);
};
walkAndObserve(document);
