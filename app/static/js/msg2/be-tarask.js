var MSG = {
  title: "Код",
  blocks: "Блёкі",
  linkTooltip: "Захаваць і зьвязаць з блёкамі.",
  runTooltip: "Запусьціце праграму, вызначаную блёкамі ў працоўнай вобласьці.",
  badCode: "Памылка праграмы:\n%1",
  timeout: "Перавышана максымальная колькасьць ітэрацыяў.",
  trashTooltip: "Выдаліць усе блёкі.",
  catLogic: "Лёгіка",
  catLoops: "Петлі",
  catMath: "Матэматычныя формулы",
  catText: "Тэкст",
  catLists: "Сьпісы",
  catColour: "Колер",
  catVariables: "Зьменныя",
  catFunctions: "Функцыі",
  listVariable: "сьпіс",
  textVariable: "тэкст",
  httpRequestError: "Узьнікла праблема з запытам.",
  linkAlert: "Падзяліцца Вашым блёкам праз гэтую спасылку:\n\n%1",
  hashError: "Прабачце, '%1' не адпавядае ніводнай захаванай праграме.",
  xmlError: "Не атрымалася загрузіць захаваны файл. Магчыма, ён быў створаны з іншай вэрсіяй Блёклі?",
  badXml: "Памылка сынтаксічнага аналізу XML:\n%1\n\nАбярыце \"ОК\", каб адмовіцца ад зьменаў ці \"Скасаваць\" для далейшага рэдагаваньня XML."
};

Blockly.Msg = { ...Blockly.Msg, ...MSG };
