var MSG = {
  title: "Codice",
  blocks: "Blocos",
  linkTooltip: "Salveguardar e ligar a blocos.",
  runTooltip: "Executar le programma definite per le blocos in le spatio de travalio.",
  badCode: "Error del programma:\n%1",
  timeout: "Le numero de iterationes executate ha excedite le maximo.",
  trashTooltip: "Abandonar tote le blocos.",
  catLogic: "Logica",
  catLoops: "Buclas",
  catMath: "Mathematica",
  catText: "Texto",
  catLists: "Listas",
  catColour: "Color",
  catVariables: "Variabiles",
  catFunctions: "Functiones",
  listVariable: "lista",
  textVariable: "texto",
  httpRequestError: "Il habeva un problema con le requesta.",
  linkAlert: "Divide tu blocos con iste ligamine:\n\n%1",
  hashError: "Infelicemente, '%1' non corresponde a alcun programma salveguardate.",
  xmlError: "Impossibile cargar le file salveguardate. Pote esser que illo ha essite create con un altere version de Blockly?",
  badXml: "Error de analyse del XML:\n%1\n\nSelige 'OK' pro abandonar le modificationes o 'Cancellar' pro continuar a modificar le codice XML."
};

Blockly.Msg = { ...Blockly.Msg, ...MSG };
