var MSG = {
  arduinoCodeCopied: "Arduino code copied to clipboard",
  title: "DwenguinoBlockly",
  blocks: "Bloques",
  linkTooltip: "Guarda y conexión a los bloques.",
  runTooltip: "Ejecute el programa definido por los bloques en el área de trabajo.",
  badCode: "Error del programa:\n%1",
  timeout: "Se excedio el máximo de iteraciones ejecutadas permitidas.",
  trashTooltip: "Descartar todos los bloques.",
  catLogic: "Lógica",
  catLoops: "Secuencias",
  catMath: "Matemáticas",
  catText: "Texto",
  catLists: "Listas",
  catColour: "Color",
  catArduino: "Arduino",
  catVariables: "Variables",
  catFunctions: "Funciones",
  catDwenguino: "Dwenguino",
  catSocialRobot: "Robot social",
  catComments: "Comentarios",
  catBoardIO: "IO",
  createVar: "Crea nuevo variable",
  listVariable: "lista",
  textVariable: "texto",
  httpRequestError: "Hubo un problema con la petición.",
  linkAlert: "Comparte tus bloques con este enlace:\n\n%1",
  hashError: "«%1» no corresponde con ningún programa guardado.",
  xmlError: "No se pudo cargar el archivo guardado.  ¿Quizá fue creado con otra versión de Blockly?",
  badXml: "Error de análisis XML:\n%1\n\nSelecciona OK para abandonar tus cambios o Cancelar para seguir editando el XML.",
  setup: "configura",
  loop: "repite",
  dwenguino_main_program_structure: "El código en el bloque de configuración se ejecute una sola vez al comenzar el programa. El código en el ‘repite’ se repite cada vez hasta que el programa termine (p.ej. cuando desenchufas el cartel).",
  catDwenguino: "Dwenguino",
  delay_help: "Espera unos indicados milisegundos. (1 segundo = 1000 milisegundos)",
  delay: "espera",
  clearLCD: "vacia pantalla LCD",
  dwenguinoLCD: "pantalla LCD %1 %2 %3 escribe texto: %4 en la fila: %5 desde la columna: %6",
  pin: "pin",
  toneOnPin: "juega tono en ",
  frequency: "con frecuencia",
  noToneOnPin: "para tono en",
  toneOnPinTooltip: "Juega tono con frecuencia específica en un pin",
  noToneOnPinTooltip: "para tono en pin",
  sonarTooltip: "Este bloque lee la distancia de un sensor sonar",
  pirTooltip: "Este sensor puede detectar movimiento",
  miliseconds: "ms",
  digitalRead: "lee valor digital de",
  digitalWriteToPin: "escribe en",
  digitalWriteValue: "valor digital",
  digitalWriteTooltip: "escribe alto o bajo valor en un pin digital del tablero Dwenguino",
  digitalReadTooltip: "lee un valor digital (1/alto o 0/bajo) de un pin específico",
  high: "ALTO",
  low: "BAJO",
  highLowTooltip: "representa un valor alto (1) o bajo (2) en el pin.",
  tutsIntroduction: "Introducción",
  tutsTheremin: "Theremín",
  tutsRobot: "Robot",
  tutsHelloDwenguino: "¡Hola Dwenguino!",
  tutsNameOnLcd: "Nombre en LCD",
  tutsBlinkLED: "Luz intermitente",
  tutsLedOnButtonPress: "LED en botón pulsado",
  tutsBitPatternOnLeds: "Bit patrón en LEDs",
  tutsAllButtons: "Todos los botones",
  tutsDriveForward: "Conduce hacia adelante",
  tutsRideInSquare: "Conduce en cuadrado",
  tutsRideToWall: "Conduce hacia pared",
  tutsAvoidWall: "Esquiva pared",
  tutsNameOnLcdBasic: "Tu nombre en LCD",
  simulator: "Simulador",
  setLedState: "Pone %1 %2",
  setLedStateTooltip: "Enciende o apaga LED en el tablero Dwenguino",
  ledPinsTooltip: "Elige LED que quieres encender o apagar",
  dwenguinoOn: "ENCENDIDO",
  dwenguinoOff: 'APAGADO',
  dwenguinoOnOffTooltip: "Selecciona ENCENDIDO o APAGADO",
  dwenguinoLedBlock: "LED",
  dwenguinoSonarBlock: "sonar %1 %2 %3 número trig pin %4 número echo pin %5",
  dwenguinoServoBlock: "Servomotor %1 %2 %3 pin %4 ángulo %5",
  dwenguinoServoDropdownBlock: "Servomotor %1",
  dwenguinoServoBlockTooltip: "Pone uno de los servos conectado con el Dwenguino con un ángulo específico entre 0 y 180 grados",
  dwenguinoServoDropdownTooltip: "Selecciona uno de los dos servomotores internos",
  dwenguinoServoOne: "1",
  dwenguinoServoTwo: "2",
  dwenguinoDCMotorBlock: "Motor DC %1 %2 %3 canal %4 rapidez %5",
  dwenguinoDCMotorBlockTooltip: "Pone la rapidez de uno de los dos motores Dwenguino. Rapidez = valor entre -255 (rapidez máxima hacia atrás) y 255 (rapidez máxima hacia adelante)",
  dwenguinoAnalogWrite: "Esribe a %1 el valor análogo %2",
  dwenguinoAnalogWriteTooltip: "Escribe un valor análogo entre 0 y 255 al pin específico",
  dwenguinoAnalogRead: "Lee valor análogo de %1",
  dwenguinoAnalogWriteTooltip: "Lee un valor entre 0 y 255 del pin específico",
  digitalReadSwitch: "Lee valor del botón %1",
  digitalReadSwitchTooltip: "Lee el valor de uno de los botones Dwenguino",
  waitForSwitch: "espera hasta que el botón %1 esté pulsado",
  north: "NORTE",
  east:"ESTE",
  south: "SUD",
  west: "OESTE",
  center: "CENTRO",
  ledsReg: "LEDS",
  dwenguinoLedsRegTooltip: "Con este bloque puedes encender o apagar leds 0 hasta 7 con un número binario. Por ejemplo: 0b00001111 encenderá leds 0 hasta 3 y apagará el resto",
  pressed: "PULSADO",
  notPressed: "NO PULSADO",
  pressedTooltip: "Representa el valor del botón. Compara este valor con el que lees en un bóton específico.",
  sureYouWantToChangeTutorial: "¿Estás seguro/segura de que quieres empezar este tutorial?\n Todos los bloques en el espacio de trabajo actual serán eliminados.",
  create: "Cree",
  with_type: "con tipo",
  create_global: "Cree global",
  socialRobotRgbLedBlock: "LED RGB",
  socialRobotPinRed: "pin rojo",
  socialRobotPinGreen: "pin verde",
  socialRobotPinBlue: "pin azul",
  socialRobotRgbLedOffBlock: "Apaga la LED RGB con",
  socialRobotRgbColorBlock: "color RGB %1",
  socialRobotRgbColor: "rojo %1 verde %2 azul %3",
  socialRobotLedmatrixImageBlock: "Despliega patrón en segmento matriz LED",
  socialRobotLedmatrixImageBlockTooltip: "Muestra el patrón seleccionado en el visualizador de matriz LED seleccionado.",
  socialRobotLedmatrixEyePatternBlock: "Muestra patrón de ojo",
  socialRobotLedmatrixEyePatternBlockTooltip: 'Muestra el patrón de ojo seleccionado en el visualizador de matriz LED.',
  socialRobotLedmatrixEyePatternSegmentBlock: "en el visualizador de matriz LED",
  socialRobotLedmatrixClearSegmentBlock: "Vacía el visualizador de matriz LED",
  socialRobotLedmatrixClearSegmentBlockTooltip: 'Vacía el visualizador de matriz LED seleccionado.',
  socialRobotLedmatrixClearDisplayBlock: "Vacía matriz LED",
  socialRobotLedmatrixClearDisplayBlockTooltip: 'Vacía la entera matriz LED.',
  socialRobotPirBlock: "sensor Pir %1 %2 %3 número trig pin %4",
  socialRobotSoundSensorBlock: "sensor de sonido %1 %2 %3 pin %4",
  socialRobotSoundSensorBlockTooltip: "",
  socialRobotTouchSensorBlock: "sensor táctil %1 %2 %3 pin %4",
  socialRobotTouchSensorBlockTooltip: "",
  socialRobotButtonSensorBlock: "Botón %1 %2 %3 pin %4",
  socialRobotButtonSensorBlockTooltip: "",
  socialrobotSetPinState: "Pone %1 %2",
  socialrobotServoBlock: "Servomotor %1 %2 %3 pin %4 ángulo %5",
  socialrobotWaveArmesBlock: "Agita los brazos %1 %2 Servo pin brazo derecho %3 %4 Servo pin brazo izquierdo %5 %6",
  socialRobotArmsDownBlock: "Baja los brazos %1 %2 %3 Servo pin brazo derecho %4 %5 Servo pin brazo izquierdo %6 %7",
  socialRobotArmsUpBlock: "Levanta los brazos %1 %2 %3 Servo pin brazo derecho %4 %5 Servo pin brazo izquierdo %6 %7",
  socialRobotEyesLeftBlock: "Gira los ojos a la izquierda %1 %2 %3 Servo pin ojo izquierdo %4 %5 Servo pin ojo derecho %6 %7",
  socialRobotEyesRightBlock: "Gira los ojos a la derecha %1 %2 %3 Servo pin ojo derecho %4 %5 Servo pin ojo izquierdo %6 %7",
  socialrobotReadPinBlock: "Lee valor del pin %1 %2",
  socialRobotServoRightHand: "Servo pin mano derecha",
  socialRobotServoLeftHand: "Servo pin mano izquierda",
  sonarSliderLabel: "Distancia sonar",
  pirButtonLabel: "Botón sensor PIR",
  soundButtonLabel: "Botón sensor de sonido",
  touchButtonLabel: "Botón sensor táctil",
  lightSensorSliderLabel: "Deslizador sensor luz",
  servoCostume: "Apariencia",
  servoOptions: "Opciones del servomotor",
  sonarOptions: "Opciones del sensor ultrasónico",
  lcdOptions: "Opciones de la pantalla LCD",
  pirOptions: "Opciones del sensor PIR",
  soundOptions: "Opciones del sensor de sonido",
  touchOptions: "Opciones del sensor táctil",
  buttonOptions: "Opciones del botón",
  lightOptions: "Opciones del sensor de luz",
  rgbLedOptions: "Opciones del LED RGB",
  ledmatrixOptions: 'Led  Matrix Options',
  ledOptions: "Opciones del LED",
  pinOptions: "Pin",
  colorOptions: "Color",
  runError: "<h3>Perdón, no pude cargar el código al tablero</h3>",
  uploadError: "Sigue estas etapas para recomenzar el tablero Dwenguino:\n    1. Desenchufa el cable USB \n    2. Conecta el ordenador y el tablero Dwenguino con el cable USB \n    3. Pulsa el botón RESTABLECE y SUD del tablero Dwenguino al misma vez\n    4. Suelta después primeramente el botón RESTABLECE \n    5. Suelta después el botón SUD \n    6. Carga el programa de nuevo a través <span id='db_menu_item_run' class='fas fa-play-circle' alt='Carga código al tablero Dwenguino'></span> botón en el menú principal",
  cleanError: "El código precedente no se pudo eliminar.\nPor favor verifica si otra aplicación está usando unos archivos .cpp.\n Cierra la aplicación.",
  compileError: "El código no pudo ser compilado.\nDeberías verificar tu código, ¿has olvidado algún bloque?",
  clear: "Vacía",
  save: "Guarda",
  dwenguinoStepperMotorBlock: "motor paso a paso %1 %2 %3 número %4 número de pasos %5",
  dwenguinoStepperMotorBlockTooltip: "TODO",
  drawingrobotMove:"Mueve el rotulador bajo un ángulo de %1 grados con %2 pasos",
  drawingrobotMoveXY:"Mueve el rotulador %1 a la derecha y %2 a la izquierda",
  drawingrobotLine:"Dibuja una línea a x: %1 y: %2",
  drawingrobotCircle:"Dibuja un círculo con radio: %1",
  drawingrobotRectangle:"Dibuja un rechtangulo con ancho: %1 y altura: %2",
  drawingrobotLiftStylus: "Levantar rotulador",
  drawingrobotLowerStylus: "Dejar rotulador",
  drawingrobotChangeColor: "Color %1",
  up:"arriba",
  down:"abajo",
  left:"izquierdo",
  right:"derecho",
  bounds:"Cuidado\nIntentas dibujar fuera de la página",
  drawingrobotgrid: "cuadrícula",
  colorpicker:"Color",
  drawingrobotSaveImage:"Guardar dibujo",
  drawingrobotDrawing:"Dibujo",
  stepperMotorOne: "STEPPER1", 
  stepperMotorTwo: "STEPPER2",
  stepperMotorTooltip: "Selecciona que motor paso a paso del robot plotter quieres usar."
};

MSG.cookieConsent = {
  close: "Close",
  cookieConsent: "We use functional cookies to set up the Dwenguino simulator. ",
  cookieInfo: "More info on how we use cookies.",
  whatAreCookiesTitle: "Wat zijn cookies?",
  whatAreCookiesDescription1: "Cookies zijn kleine tekstbestanden die lokaal worden opgeslagen op uw computer. Deze cookies dienen voor tal van doeleinden: het onthouden van instellingen (login, taalkeuzes), het vergaren van informatie en het bijhouden van het bezoekgedrag van de gebruikers.",
  whatAreCookiesDescription2: "De cookies die wij gebruiken zijn veilig: zij hebben geen toegang tot persoonlijke informatie op uw computer en kunnen deze niet beschadigen of besmetten met virussen. De cookies geven op geen enkele manier persoonlijke informatie aan ons door. De informatie die we via cookies verzamelen helpt ons om je van specifieke diensten te laten genieten.",
  whatAreNecessaryCookiesTitle: "Wat zijn noodzakelijke cookies?",
  whatAreNecessaryCookiesDescription: "Noodzakelijke cookies zijn cookies die je nodig hebt om te surfen op de website en gebruik te maken van de functionaliteit die we aanbieden. Bovendien zijn de cookies noodzakelijk om de beveiligde onderdelen van de website te kunnen zien.",
  whichCookiesTitle: "Welke cookies gebruikt deze website?",
  dwengoCookieTitle: "Aanmelden als gebruiker (Dwengo cookie)",
  dwengoCookieDescription: "Bij het aanmelden op de website wordt een tijdelijke cookie gebruikt waardoor je herkend wordt als gebruiker. Met behulp van deze cookie wordt onder andere je taalinstelling en vooruitgang bewaard. De cookie zorgt er voor dat je toegang hebt tot de beveiligde delen van de website. Deze cookie is slechts geldig tot aan het einde van de sessie en is enkel beschikbaar voor en gemaakt door Dwengo vzw.",
  jenkinsCookieTitle: "Jenkins configuratie (Jenkins cookie)",
  jenkinsCookieDescription: "De Jenkins cookie is voor ons noodzakelijk om de Dwenguino simulator online op een server te kunnen installeren. Jenkins is software waarvan we gebruik maken om onze simulator te updaten. Die cookie bevat informatie over de instellingen van Jenkins en bevat dus ook geen enkele informatie over jou als gebruiker.",
};

MSG.dropzone = {
  dictSelectFile: "Selecciona un archivo.",
  dictChooseFile: "Elige archivo",
  dictDefaultMessage: "Suelta archivos aquí para cargar",
  dictFallbackMessage: "Tu navegador no soporta la carga de archivos drag’n’drop.",
  dictFileTooBig: "Archivo es demasiado grande ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
  dictFallbackText: "Por favor usa el respaldo de abajo para cargar tus archivos como en los viejos tiempos.",
  dictInvalidFileType: "No puedes cargar archivos de este tipo.",
  dictResponseError: "Servidor ha respondido con código {{statusCode}}.",
  dictCancelUpload: "Cancela carga",
  dictCancelUploadConfirmation: "¿Estás seguro/segura de que quieres cancelar esta carga?",
  dictRemoveFile: "Eliminar archivo",
  dictMaxFilesExceeded: "No puedes cargar más archivos.",
  dictUploadBlocks: "Cargar bloques",
  dictFileNotSupported: "Este archivo no está soportado.",
};

MSG.ledmatrix = {
  restPosition: 'Posición de reposo', 
  blink1: 'Parpadea 1',
  blink2: 'Parpadea 2',
  blink3: 'Parpadea 3',
  blink4: 'Parpadea 4',
  blink5: 'Parpadea 5',
  right1: 'Derecho 1',
  right2: 'Derecho 2',
  left1: 'Izquierdo 1',
  left2: 'Izquierdo 2',
  up1: 'Arriba 1',
  up2: 'Arriba 2',
  up3: 'Arriba 3',
  down1: 'Abajo 1',
  down2: 'Abajo 2',
  down3: 'Abajo 3',
  angryLeft1: 'Enfadado izquierdo 1',
  angryLeft2: 'Enfadado izquierdo 2',
  angryLeft3: 'Enfadado izquierdo 3',
  angryLeft4: 'Enfadado izquierdo 4',
  angryRight1: 'Enfadado derecho 1',
  angryRight2: 'Enfadado derecho 2',
  angryRight3: 'Enfadado derecho 3',
  angryRight4: 'Enfadado derecho 4',
  sadLeft1: 'Tristo izquierdo 1',
  sadLeft2: 'Tristo izquierdo 2',
  sadLeft3: 'Tristo izquierdo 3',
  sadRight1: 'Tristo derecho 1',
  sadRight2: 'Tristo derecho 2',
  sadRight3: 'Tristo derecho 3',
  evilLeft1: 'Malo izquierdo 1',
  evilLeft2: 'Malo izquierdo 2',
  evilRight1: 'Malo derecho 1',
  evilRight2: 'Malo derecho 2',
  scanHorizontal1: 'Escáner horizontal 1',
  scanHorizontal2: 'Escáner horizontal 2',
  scanHorizontal3: 'Escáner horizontal 3',
  scanHorizontal4: 'Escáner horizontal 4',
  scanVertical1: 'Escáner vertical 1',
  scanVertical2: 'Escáner vertical 2',
  scanVertical3: 'Escáner vertical 3',
  scanVertical4: 'Escáner vertical 4',
  scanVertical5: 'Escáner vertical 5',
  scanVertical6: 'Escáner vertical 6',
  rip1: 'RIP 1',
  rip2: 'RIP 2',
  peering1: 'Peering 1',
  peering2: 'Peering 2',
  peering3: 'Peering 3',
  peering4: 'Peering 4'
};

MSG.simulator = {
  start: "Empieza",
  stop: "Para",
  pause: "Pausa",
  step: "Paso 1",
  speed: "Rapidez",
  speedVerySlow: "40 veces más lento",
  speedSlow: "20 veces más lento",
  speedMedium: "10 veces más lento",
  speedFast: "5 veces más lento",
  speedVeryFast: "2 veces más lento",
  speedRealTime: "Tiempo real",
  components: "Selecciona componentes",
  servo: "Servo",
  servoDescription: "Un servomotor es un actuador que puede <b>rotar un objeto en un cierto ángulo</b>. En el simulador, servomotores se pueden rotar en un ángulo de 0 hasta 180 grados. Servomotores pueden estar decorados facilmente y por eso son ideales para crear componentes moviendos periódicamente. Con bloques sencillos del servomotor el ángulo de rotación tiene que ser specificado. Si usas otros bloques predefinidos como \"agita los manos\" o \"gira los ojos\" no tienes que especificar el ángulo porque es preprogramado.",
  motor: "Motor",
  DCMotorDescription: "Un motor de corriente continua o motor DC rota completamente. Puedes usarlo por ejemplo para conducir tu robot. Tienes que especificar la rapidez de la rotación del motor y la dirección de rotación en tu programa usando números entre -255 y 255.",
  scope: "Variables",
  alertDebug: "Para la simulación antes de volver a programar.",
  distance: "distancia",
  scenario: "Escenario",
  scenario_default: "Tablero normal",
  scenario_moving: "Robot moviendo",
  scenario_wall: "Robot moviendo con pared",
  scenario_socialrobot:"Robot social",
  code: "Código",
  pir: "Sensor PIR",
  pirDescription: "Un sensor de infrarrojos pasivo (PIR) permite <b>detectar el movimiento</b>, ya que detecta los cambios de radiación infrarroja en su entorno. En el simulador encontrarás un botón para simular estos cambios de radiación infrarroja. Al pulsar el botón, se simula que hay movimiento, por lo que el sensor PIR recibirá el valor 1. Al soltar el botón, el sensor PIR recibirá su valor por defecto 0.",
  sonar: "Sensor sonar",
  sonarDescription: "Utiliza este sensor para detectar la presencia de una persona u objeto y para estimar la distancia a la que se encuentra esta persona u objeto del sensor. En el simulador encontrarás un control deslizante para simular la distancia entre el objeto y el sensor. El sensor mostrará la distancia en centímetros.",
  led: "LED",
  ledDescription: "Un diodo emisor de luz (LED) es un dispositivo semiconductor que <b>emite luz</b> cuando le atraviesa una corriente eléctrica. Diferentes materiales semiconductores producen <b>diferentes colores de luz</b>. Si el pin está en estado ALTO, el LED emitirá luz. Si el pin correspondiente está en estado BAJO, el LED se apagará.",
  rgbled: "LED RGB",
  rgbledDescription: "",
  ledmatrix: "LED matriz",
  ledmatrixDescription: "",
  ledmatrixsegment: "LED matrix",
  ledmatrixsegmentDescription: "",
  touch: "Touch sensor",
  touchDescription: "Use the touch sensor to detect if the robot is being touched. In the simulator you will find a button to simulate touching the robot. When the robot is being touched, the touch sensor will output the value '1', otherwise the value '0'.",
  lcd: "LCD screen",
  lcdDescription: "The LCD display on the Dwengo board is a 16x2 character display with backlight. The text to be displayed should be specified in your program.",
  touch: "sensor táctil",
  touchDescription: "Utiliza el sensor táctil para detectar si el robot está siendo tocado. En el simulador encontrarás un botón para simular que tocas el robot. Cuando el robot está siendo tocado, el sensor táctil emitirá el valor '1', en el caso contrario el valor '0'",
  lcd: "Pantalla LCD",
  lcdDescription: "La pantalla LCD del tablero Dwengo es una pantalla de 16x2 caracteres con luz de fondo. El texto a mostrar debe ser especificado en tu programa.",
  button: "Botón",
  buttonDescription: "",
  sound: "Sensor de sonido",
  soundDescription: "Utiliza el sensor de sonido para <b>detectar el sonido</b>. En el simulador encontrarás un botón para simular la presencia de sonido. Cuando el sensor de sonido detecte el sonido emitirá el valor 1, en caso contrario emitirá el valor 0.",
  light: "Sensor de luz",
  lightDescription: "",
  buzzer: "Zumbador",
  buzzerDescription: "El zumbador del tablero Dwengo puede utilizarse para <b>reproducir una serie de tonos</b> o fragmentos de sonido cortos. La altura de cada tono se controla definiendo la <b>frecuencia</b> del zumbador. Utiliza un bloque de demora para cambiar la duración de un tono",
  decoración: "Decoración",
};

MSG.socialrobot = {
  plain: "Por defecto",
  eye: "Ojo",
  mouth: "Boca",
  righthand: "Mano derecha",
  lefthand: "Mano izquierda",
};

MSG.tutorialMenu = {
  header: "Tutoriales",
  catDwenguino: "Aprende a programar<br>con DwenguinoBlockly",
  catDwenguinoComponents: "Resumen útil de<br>los componentes Dwenguino",  
  catDwenguinoConnector: "Mapa del pin &<br>expansión del connector",
  catRidingRobot: "Robot de conducción",
  catSocialRobot: "Robot social",
  catWeGoStem: "WeGoSTEM",
  chooseCategory: "Selecciona una categoría tutorial",
  chooseTutorial: "Selecciona un tutorial",
  previous: "Previo",
  close: "Cerrar",
  checkAnswer: "Verificar respuesta",
  correctAnswer: "La respuesta era correcta!",
  wrongAnswer: "La respuesta no era correcta. Intentas de nuevo!",
  dwenguinoComponents: "componentes Dwenguino",
  sensors: "Sensores",
  actuators: "Actuadores",
  movement: "Movimiento",
  audio: "Audio",
  display: "Visualizador"
};

MSG.tutorials = {
  introduction: {},
  /*theremin: {},
  robot: {},
  hello_dwenguino: {},*/
};


MSG.tutorials.general = {
  sureTitle: "¿Estás seguro/segura?",
  sureText: "Cuando hagas clic en 'Siguiente' todos los bloques en el espacio de trabajo serán eliminados.",
};

MSG.tutorials.introduction = {
  step1Title: "Bienvenido a DwenguinoBlockly",
  step1Content: "¡Hola, mi nombre es Dwenguino! ¡Te ayudaré a conocer el interfaz!",
  step2aTitle: "La área de código Blockly",
  step2aContent: "En esta área colocas tus bloques de código. Debes poner tus bloques dentro del bloque de setup-loop si quieres que se ejecuten.",
  step2bTitle: "La caja de herramientas Blockly",
  step2bContent: "Es la caja de herramientas, contiene todos los bloques que puedes utilizar para crear tu programa. Puedes explorar las diferentes categorías para descubrir lo que tu Dwenguino puede hacer.",
  step3Title: "Selección de idioma",
  step3Content: "Usa esto para cambiar el idioma",
  step4Title: "Dificultad",
  step4Content: "Este control deslizante te permite poner el nivel de dificultad. Por ahora solo ofrecemos niveles de principiante y avanzado",
  step5Title: "Dwengolibros",
  step5Content: "Los dwengolibros son tutoriales interactivos que te guían a través de los diferentes retos de la computación física.",
  step6Title: "Carga código",
  step6Content: "Cuando tu código está completo, puedes subirlo al tablero Dwenguino haciendo clic en este botón. Asegúrate de que seleccionas el tablero y el puerto correcto dentro del Arduino IDE.",
  step7Title: "Abrir",
  step7Content: "Este botón te permite abrir un programa previamente guardado.",
  step8Title: "Guardar",
  step8Content: "Este botón te permite guardar tu código a un archivo local",
  step9Title: "El simulador",
  step9Content: "Con este botón se abre el simulador. Puedes utilizarlo para probar tu código antes de cargarlo."
};

MSG.tutorials.nameOnLcd = {
  step1Title: "Nombre en la pantalla LCD",
  step1Content: "Abre la vista del simulador y prueba el código. ¿Qué ves?",
  step2Title: "Nombre en la pantalla LCD",
  step2Content: "Cambia el programa para que tu nombre aparezca en la primera línea de la pantalla LCD",
};

MSG.tutorials.blinkLED = {
  step1Title: "Luz intermitente",
  step1Content: "Abre la vista de simulador y prueba el código. ¿Qué ves?",
  step2Title: "Luz intermitente",
  step2Content: "Cambia el programa para que el LED se encienda durante un segundo y después se apague durante un segundo. Esta secuencia se repite indefinidamente.",
  step3Title: "Extra",
  step3Content: "Haz que otro LED se encienda y se apague",
};

MSG.tutorials.ledOnButtonPress = {
  step1Title: "LED al apretar el botón",
  step1Content: "Abre la vista de simulador y prueba el código. ¿Qué ves?",
  step2Title: " LED al apretar el botón",
  step2Content: "Cambia el programa para que el LED se encienda al apretar el botón norte.",
  step3Title: "Extra",
  step3Content: "Asegúrate de que el LED se apague cuando sueltas el botón norte",
};

MSG.tutorials.bitPatternOnLeds = {
  step1Title: "Patrón en LEDs",
  step1Content: "Abre la vista de simulador y prueba el código. ¿Qué ves?",
  step2Title: "Patrón en LEDs",
  step2Content: "El código que utilizas es muy largo. ¿Puedes obtener el mismo resultado utilizando menos bloques? Intenta obtener el mismo resultado utilizando menos bloques",
  step3Title: "Patrón en LEDs",
  step3Content: "Cuando consigas reducir el número de bloques, llama a uno de los tutores para recibir feedback",
};

MSG.tutorials.allButtons = {
  step1Title: "Todos los botones",
  step1Content: "Abre la vista de simulador y prueba el código. ¿Qué ves?",
  step2Title: "Todos los botones",
  step2Content: "Este código debería encender un LED cuando se pulse uno de los botones. Mira el programa. ¿Funcionan todos los botones? Intenta corregir el código de los botones que no funcionan",
  step3Title: "Extra",
  step3Content: "Cambia el código para que el LED se apague al soltar el botón",
};

MSG.tutorials.driveForward = {
  step1Title: "Conduce hacía adelante",
  step1Content: "Abre la vista de simulador.",
  step2Title: "Conduce hacía adelante",
  step2Content: "Selecciona la vista del escenario y prueba el código. ¿Qué ves?",
  step3Title: "Conduce hacía adelante",
  step3Content: "¿El coche va hacia delante? Corrige el código para que el coche vaya hacia delante",
};

MSG.tutorials.rideInSquare = {
  step1Title: "Conduce en el cuadrado",
  step1Content: "Abre la vista de simulador.",
  step2Title: "Conduce en el cuadrado",
  step2Content: "Selecciona la vista del escenario y prueba el código. ¿Qué ves?",
  step3Title: "Conduce hacía adelante",
  step3Content: "¿El coche circula en un cuadrado? Corrige el código para que el coche circule en un cuadrado",
  step4Title: "Extra",
  step4Content: "El código es largo, ¿se puede acortar manteniendo el mismo comportamiento?",
};

MSG.tutorials.rideToWall = {
  step1Title: "Conduce hacía pared",
  step1Content: "Abre la vista de simulador.",
  step2Title: "Conduce hacía pared",
  step2Content: "Selecciona la vista de escenario.",
  step3Title: "Conduce hacía pared",
  step3Content: "Cambia el escenario a \"Robot en movimiento con pared\" y prueba el código. ¿Qué ves?",
  step4Title: "Conduce hacía pared",
  step4Content: "¿El coche llega hasta la pared? ¿Se para en la pared? Cambia el código para que el coche se pare cerca de la pared.",
};

MSG.tutorials.avoidWall = {
  step1Title: "Esquivar pared",
  step1Content: "Abre la vista de simulador.",
  step2Title: "Esquivar pared",
  step2Content: "Abre la vista del escenario.",
  step3Title: "Esquivar pared",
  step3Content: "Cambia el escenario a robot en movimiento con pared y prueba el código. ¿Qué ves?",
  step4Title: "Esquivar pared",
  step4Content: "¿El coche evita la pared girando antes de alcanzarlo? Cambia el código para que el coche siga circulando pero nunca choque contra la pared",
};

MSG.tutorials.nameOnLcdBasic = {
  step0Title: "¿Estás seguro/segura?",
  step0Content: "¿Estás seguro/segura? Cuando hagas clic en \"Siguiente\", los bloques del tablero de trabajo serán reemplazados",
  step1Title: "Nombre en la pantalla LCD",
  step1Content: "En este tutorial pones tu nombre en la pantalla LCD. Ves un ejemplo de cómo hacerlo.",
  step2Title: "Probar en el tablero",
  step2Content: "Prueba el código conectando el tablero Dwenguino al ordenador con el cable USB y pulsando el botón jugar",
  step3Title: "Tu propio nombre",
  step3Content: "En este momento ves que aparece el nombre \"Tom\" en la pantalla. Cambia el código para que veas tu nombre",
  step4Title: "Dos  filas",
  step4Content: "La pantalla LCD tiene dos filas. Cambia la fila con tu nombre de 0 a 1.",
  step5Title: "Test",
  step5Content: "Prueba tu código.",
  step6Title: "¡Genial!",
  step6Content: "¡Buen hecho! Ahora ya sabes cómo mostrar tu nombre en la pantalla LCD",
};

/*MSG.tutorials.hello_dwenguino = {
  label: "¡Hola Mundo!",
};*/

MSG.logging = {
  setup: "Test de configuración",
  login: "Acceso",
  logout: "Log out",
  firstname: "First name",
  newuser: "Nuevo usuario",
  username: "Nombre de usuario",
  chooseUsername: "Elige un nombre de usuario",
  email: "Email address",
  enterEmail: "Enter email address",
  forgotPassword: "I forgot my password",
  userDoesNotExist: "This user does not exist. Try a different email address.",
  resetPassword: "Reset your password",
  back: "Back",
  enterFirstname: "Enter your first name",
  password: "Password",
  repeatedPassword: "Repeat password",
  enterPassword: "Enter password",
  enterRepeatedPassword: "Repeat your password",
  choosePassword: "Selecciona 4 iconos personales como contraseña. Tienes que ser capaz de recordarlos en el orden correcto.",
  currentlySelected: "Actualmente seleccionado: ",
  role: "Role",
  student: "Student",
  teacher: "Teacher",
  verification: "Verify your email address",
  verificationSentTo: "A verification message has been sent to your email address. Click the link in the email to verify your account.",
  birth: "Fecha de nacimiento",
  school: "Escuela",
  selectSchool: "Buscar por nombre de escuela...",
  agegroup: "Grupo de edad:",
  primary1: "Primer grado 1",
  primary2: "Primer grado 2",
  primary3: "Primer grado 3",
  primary4: "Primer grado 4",
  primary5: "Primer grado 5",
  primary6: "Primer grado 6",
  secondary1: "Segundo grado 1",
  secondary2: "Segundo grado 2",
  secondary3: "Segundo grado 3",
  secondary4: "Segundo grado 4",
  secondary5: "Segundo grado 5",
  secondary6: "Segundo grado 6",
  gender: "Sexo: ",
  gender1: "F",
  gender2: "M",
  gender3: "X",
  gender4: "Prefiero no decirlo",
  activity: "Actividad: ",
  name: "Nombre ",
  date: "Fecha ",
  ok: "Vale",
  continue: "Continue",
  reset: "Restablece",
  person: "Persona",
  dog: "Perro",
  car: "Coche",
  camera: "Cámara",
  heart: "Corazón",
  plane: "Avión",
  house: "Casa",
  umbrella: "Paraguas",
  star: "Estrella",
  money: "Dinero",
  gift: "Regalo",
  keys: "Llaves",
  music: "Música",
  snowflake: "Copo de nieve",
  fire: "Fuego",
  envelope: "Sobre",
  conditions: "Voorwaarden",
  conditions1: "Om de app te gebruiken, moet je akkoord gaan met de <b>gebruiksvoorwaarden</b> en het <b>privacybeleid</b>.",
  generalConditions: "de gebruiksvoorwaarden",
  privacyStatement: "het privacybeleid",
  conditions2: "Daar staat onder andere in dat je moet inloggen om te beschikken over functionaliteit zoals het bewaren van je programma's of het bijhouden van je voortgang, dat je data anoniem wordt gelogd en verwerkt, en dat je ons mag mailen met vragen over privacy.",
  conditions3: "Ben je <b>13 jaar of ouder?</b> Dan mag je hieronder <b>zelf bevestigen</b> dat je de info hebt gelezen en akkoord gaat.",
  conditions4: "Ben je <b>12 jaar of jonger?</b> Dan moet een van je ouders of voogden toestemming geven.",
  acceptConditions: "Ik ga akkoord met de gebruiksvoorwaarden en het privacybeleid van de Dwengo-simulator",
  acceptResearch: "Ik geef toestemming aan Dwengo vzw om de gegevens die de simulator verzamelt, voor <b>wetenschappelijk onderzoek</b> te gebruiken, geanonimiseerd en volgens het privacybeleid.",
  anonymized: "* <b>\'Geanonimiseerd\'</b> wil zeggen dat er geen link is tussen je persoonsgegevens en je data. Niemand weet dus wat je deed in de simulator."
};

MSG.validator = {
  errSchool: "Selecciona una escuela.",
  errId: "No has seleccionado suficientes iconos.",
  errAgeGroup: "Selecciona tu grupo de edad.",
  errGender: "Selecciona tu sexo.",
  errFirstname: "Je voornaam is niet ingevuld.",
  errLastname: "Je achternaam is niet ingevuld.",
  errPassword: "Je paswoord voldoet niet aan de voorwaarden.",
  errPasswordNotIdentical: "Je paswoorden zijn niet identiek.",
  errEmail: "Je email is niet geldig",
  errActivityId: "El nombre de la actividad no puede estar vacío.",
  errAcceptConditions: "Je hebt de gebruiksvoorwaarden en het privacybeleid nog niet geaccepteerd.",
  errAcceptResearch: "Je hebt nog geen toestemming gegeven om de gegevens voor wetenschappelijk onderzoek te laten gebruiken.",
  errRequiredFields: "Je hebt niet alle velden ingevuld.",
  errRoleInvalid: "De opgegeven rol is niet geldig."
};

Blockly.Msg = { ...Blockly.Msg, ...MSG };