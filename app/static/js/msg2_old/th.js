var MSG = {
  title: "เขียนโปรแกรม",
  blocks: "บล็อก",
  linkTooltip: "บันทึกและสร้างลิงก์มายังบล็อกเหล่านี้",
  runTooltip: "เรียกใช้โปรแกรมตามที่กำหนดไว้ด้วยบล็อกที่อยู่ในพื้นที่ทำงาน",
  badCode: "โปรแกรมเกิดข้อผิดพลาด:\n%1",
  timeout: "โปรแกรมทำงานซ้ำคำสั่งเดิมมากเกินไป",
  trashTooltip: "ยกเลิกบล็อกทั้งหมด",
  catLogic: "ตรรกะ",
  catLoops: "การวนซ้ำ",
  catMath: "คณิตศาสตร์",
  catText: "ข้อความ",
  catLists: "รายการ",
  catColour: "สี",
  catVariables: "ตัวแปร",
  catFunctions: "ฟังก์ชัน",
  listVariable: "รายการ",
  textVariable: "ข้อความ",
  httpRequestError: "มีปัญหาเกี่ยวกับการร้องขอ",
  linkAlert: "แบ่งปันบล็อกของคุณด้วยลิงก์นี้:\n\n%1",
  hashError: "เสียใจด้วย '%1' ไม่ตรงกับโปรแกรมใดๆ ที่เคยบันทึกเอาไว้เลย",
  xmlError: "ไม่สามารถโหลดไฟล์ที่บันทึกไว้ของคุณได้ บางทีมันอาจจะถูกสร้างขึ้นด้วย Blockly รุ่นอื่นที่แตกต่างกัน?",
  badXml: "เกิดข้อผิดพลาดในการแยกวิเคราะห์ XML:\n%1\n\nเลือก 'ตกลง' เพื่อละทิ้งการเปลี่ยนแปลงต่างๆ ที่ทำไว้ หรือเลือก 'ยกเลิก' เพื่อแก้ไข XML ต่อไป"
};

Blockly.Msg = { ...Blockly.Msg, ...MSG };