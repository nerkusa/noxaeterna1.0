/* Черты — необязательные особенности персонажа. Каждая может сочетать
   сразу несколько эффектов (бонус/штраф к нескольким навыкам и/или
   характеристике одновременно), не только «один минус к одному навыку». */
var TRAITS=[
  {id:"charismatic",name:"Харизматичный",category:"positive",desc:"Прирождённый душа компании.",effects:[{type:"skill_bonus",skill:"Charisma",amount:1},{type:"skill_bonus",skill:"Performance",amount:1},{type:"skill_bonus",skill:"Seduction",amount:1}]},
  {id:"lame",name:"Хромой",category:"negative",desc:"Старая травма ноги мешает двигаться быстро.",effects:[{type:"skill_bonus",skill:"Dodge",amount:-1},{type:"skill_bonus",skill:"Acrobatics",amount:-1}]},
  {id:"one_eyed",name:"Одноглазый",category:"negative",desc:"Потерян глаз — страдают меткость и восприятие.",effects:[{type:"stat_bonus",stat:"DEX",amount:-1},{type:"skill_bonus",skill:"Archery",amount:-1}]},
  {id:"scarred",name:"Шрамы",category:"mixed",desc:"Пугающая внешность: одних отталкивает, других впечатляет.",effects:[{type:"skill_bonus",skill:"Performance",amount:1},{type:"skill_bonus",skill:"Deception",amount:-1},{type:"stat_bonus",stat:"EMP",amount:-1}]},
  {id:"weak_heart",name:"Слабое сердце",category:"negative",desc:"Здоровье подводит в трудную минуту.",effects:[{type:"hp_flat",amount:-5},{type:"skill_bonus",skill:"Resistance",amount:-1}]},
  {id:"paranoid",name:"Параноик",category:"mixed",desc:"Всегда начеку — но доверять людям тяжело.",effects:[{type:"skill_bonus",skill:"Awareness",amount:1},{type:"skill_bonus",skill:"Charisma",amount:-1}]},
  {id:"strong",name:"Силач",category:"positive",desc:"Природная физическая мощь.",effects:[{type:"stat_bonus",stat:"BODY",amount:1},{type:"skill_bonus",skill:"Brawl",amount:1}]},
  {id:"bookworm",name:"Книжный червь",category:"mixed",desc:"Больше библиотеки, чем спортзала.",effects:[{type:"stat_bonus",stat:"INT",amount:1},{type:"skill_bonus",skill:"Athletics",amount:-1}]},
  {id:"veteran",name:"Ветеран боёв",category:"positive",desc:"Годы, проведённые в схватках, не прошли даром.",effects:[{type:"skill_bonus",skill:"Battle Weapon",amount:1},{type:"skill_bonus",skill:"Simple Weapon",amount:1}]},
  {id:"clumsy",name:"Неуклюжий",category:"negative",desc:"Руки растут не совсем оттуда.",effects:[{type:"skill_bonus",skill:"Sleight of Hands",amount:-1},{type:"skill_bonus",skill:"Stealth",amount:-1}]}
];

export { TRAITS };
